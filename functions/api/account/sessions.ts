/**
 * GET /api/account/sessions  — list current user's active sessions
 * DELETE /api/account/sessions — log out all OTHER devices (not current)
 *
 * V2-P6 multi-device session management。Mockup section 6。
 *
 * Auth: requireSessionUser
 *
 * GET response: {
 *   current_sid: string | null,        -- 當前 session 的 sid (frontend mark "current")
 *   sessions: [
 *     { sid, ua_summary, ip_hash_prefix?, created_at, last_seen_at, is_current },
 *     ...
 *   ]
 * }
 *
 * DELETE response: { ok: true, revoked: <count> }
 *
 * Note: 不 leak 完整 ip_hash（避免 hash 反查）— 只回前 8 char 做 device 區分提示。
 */
import { requireSessionUser, revokeAllOtherSessions } from '../_session';
import { rawJson } from '../_utils';
import type { Env } from '../_types';

interface SessionDeviceRow {
  sid: string;
  ua_summary: string | null;
  ip_hash: string | null;
  created_at: string;
  last_seen_at: string;
}

const SESSIONS_LIST_LIMIT = 100;

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const session = await requireSessionUser(context.request, context.env);

  const result = await context.env.DB
    .prepare(
      `SELECT sid, ua_summary, ip_hash, created_at, last_seen_at
       FROM session_devices
       WHERE user_id = ? AND revoked_at IS NULL
       ORDER BY last_seen_at DESC
       LIMIT ?`,
    )
    .bind(session.uid, SESSIONS_LIST_LIMIT)
    .all<SessionDeviceRow>();

  const currentSid = session.sid ?? null;
  const sessions = (result.results ?? []).map((row) => ({
    sid: row.sid,
    ua_summary: row.ua_summary,
    // Only first 8 chars of ip_hash for "different device" hint, not full reverse-lookup-bait
    ip_hash_prefix: row.ip_hash ? row.ip_hash.slice(0, 8) : null,
    created_at: row.created_at,
    last_seen_at: row.last_seen_at,
    is_current: row.sid === currentSid,
  }));

  return rawJson({ current_sid: currentSid, sessions });
};

export const onRequestDelete: PagesFunction<Env> = async (context) => {
  const session = await requireSessionUser(context.request, context.env);
  const { revoked } = await revokeAllOtherSessions(
    context.env.DB,
    session.uid,
    session.sid ?? null,
  );
  return rawJson({ ok: true, revoked });
};
