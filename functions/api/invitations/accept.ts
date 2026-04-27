/**
 * POST /api/invitations/accept — V2 共編邀請接受
 *
 * Body: { token: string }
 *
 * Auth required (session cookie)。流程：
 *   1. requireSessionUser → uid
 *   2. SELECT users → user.email
 *   3. HMAC token → token_hash
 *   4. SELECT trip_invitations WHERE token_hash
 *   5. Reject if expired / already accepted / email mismatch
 *   6. Atomic batch: INSERT OR IGNORE trip_permissions + UPDATE accepted_at
 *   7. Audit log
 *   8. Return { ok, tripId, tripTitle }
 *
 * Why email match check：被邀請者必須跟 invitation 的 invited_email 一致。
 * 別人拿到 token 不能接走邀請（mitigates email link forwarding 攻擊）。
 */
import { requireSessionUser } from '../_session';
import { hashInvitationToken } from '../../../src/server/invitation-token';
import { parseJsonBody } from '../_utils';
import { logAudit } from '../_audit';
import { AppError } from '../_errors';
import type { Env } from '../_types';

interface AcceptBody {
  token?: string;
}

interface InvitationRow {
  trip_id: string;
  invited_email: string;
  expires_at: string;
  accepted_at: string | null;
}

function errorResponse(code: string, message: string, status: number): Response {
  return new Response(
    JSON.stringify({ error: { code, message } }),
    { status, headers: { 'content-type': 'application/json' } },
  );
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  // 1. Auth
  let session;
  try {
    session = await requireSessionUser(context.request, context.env);
  } catch (err) {
    if (err instanceof AppError && err.code === 'AUTH_REQUIRED') {
      return errorResponse('AUTH_REQUIRED', '請先登入', 401);
    }
    // Non-AppError or differently-coded — re-throw to global handler
    throw err;
  }

  // 2. Body
  const body = (await parseJsonBody<AcceptBody>(context.request)) ?? {};
  const rawToken = (body.token ?? '').trim();
  if (!rawToken) {
    return errorResponse('INVITATION_TOKEN_MISSING', '缺少 token', 400);
  }

  if (!context.env.SESSION_SECRET) {
    return errorResponse('SERVER_MISCONFIG', 'SESSION_SECRET 未設定', 500);
  }

  // 3. User email
  const userRow = await context.env.DB
    .prepare('SELECT id, email FROM users WHERE id = ?')
    .bind(session.uid)
    .first<{ id: string; email: string }>();

  if (!userRow) {
    return errorResponse('AUTH_INVALID', '使用者不存在', 401);
  }

  // 4. Token lookup
  const tokenHash = await hashInvitationToken(rawToken, context.env.SESSION_SECRET);
  const invitation = await context.env.DB
    .prepare(
      `SELECT trip_id, invited_email, expires_at, accepted_at
       FROM trip_invitations
       WHERE token_hash = ?
       LIMIT 1`,
    )
    .bind(tokenHash)
    .first<InvitationRow>();

  if (!invitation) {
    return errorResponse('INVITATION_INVALID', '邀請連結無效', 410);
  }

  if (invitation.accepted_at) {
    return errorResponse('INVITATION_ACCEPTED', '此邀請已接受過', 410);
  }

  if (new Date(invitation.expires_at).getTime() < Date.now()) {
    return errorResponse('INVITATION_EXPIRED', '邀請已過期', 410);
  }

  // 5. Email match (case-insensitive)
  if (userRow.email.toLowerCase() !== invitation.invited_email.toLowerCase()) {
    return errorResponse('INVITATION_EMAIL_MISMATCH', '此邀請不屬於你的帳號', 403);
  }

  // 6. Atomic INSERT permission + UPDATE invitation
  const nowIso = new Date().toISOString();
  await context.env.DB.batch([
    context.env.DB
      .prepare(
        `INSERT OR IGNORE INTO trip_permissions (email, trip_id, role, user_id)
         VALUES (?, ?, 'member', ?)`,
      )
      .bind(userRow.email.toLowerCase(), invitation.trip_id, userRow.id),
    context.env.DB
      .prepare(
        `UPDATE trip_invitations SET accepted_at = ?, accepted_by = ? WHERE token_hash = ?`,
      )
      .bind(nowIso, userRow.id, tokenHash),
  ]);

  // 7. Trip title for response
  const trip = await context.env.DB
    .prepare('SELECT title FROM trips WHERE id = ?')
    .bind(invitation.trip_id)
    .first<{ title: string }>();

  // 8. Audit log (best-effort)
  await logAudit(context.env.DB, {
    tripId: invitation.trip_id,
    tableName: 'trip_invitations',
    recordId: null,
    action: 'update',
    changedBy: userRow.email,
    diffJson: JSON.stringify({ event: 'accepted', invited_email: invitation.invited_email }),
  });

  return new Response(
    JSON.stringify({
      ok: true,
      tripId: invitation.trip_id,
      tripTitle: trip?.title ?? null,
    }),
    { status: 200, headers: { 'content-type': 'application/json' } },
  );
};
