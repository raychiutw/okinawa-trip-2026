-- Rollback 0040: trip_invitations
--
-- 回滾 V2 共編邀請 token 表。**資料損失**：所有 pending invitation 失效，
-- 已接受的 invitation 紀錄消失（trip_permissions 仍在，只是 audit trail 斷）。
--
-- Boundary：rollback 前必須先 deploy 不再 reference trip_invitations 的 code
--   - functions/api/permissions.ts POST 改回「直接 INSERT trip_permissions」
--   - functions/api/invitations*.ts 全部移除
--   - InvitePage / signup invitationToken 路徑下線

DROP INDEX IF EXISTS idx_invitations_email;
DROP INDEX IF EXISTS idx_invitations_trip;
DROP INDEX IF EXISTS idx_invitations_pending;
DROP TABLE IF EXISTS trip_invitations;
