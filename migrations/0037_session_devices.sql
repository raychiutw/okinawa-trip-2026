-- Migration 0037: session_devices — V2-P6 multi-device session tracking
--
-- Each issueSession 寫一 row。支援 user 在 /settings/sessions 看見所有 active
-- session + 遠端登出。
--
-- ## Why this design (vs storing whole session in DB)
--
-- 還是用 HMAC opaque cookie token + sid 嵌進 payload 而非 DB-only session。
-- 理由：
--   - HMAC verify 不需 DB 讀（constant time，無 latency）
--   - DB 只在 revocation check 時讀（仍是 D1 ms-level）
--   - 即使 D1 失敗（rare），cookie 仍能 verify → degrade gracefully
--   - revocation 不立即生效（需 lookup）— acceptable since 1h scenario
--
-- ## Privacy
--
-- ip_hash 是 SHA-256(ip)，跟 auth_audit_log 一致。**不存 plain IP**，但
-- city/country 留 NULL（V2-P6 future 加 GeoIP enrichment）。
-- ua_summary 從 User-Agent parse 「Browser · OS」（client-side display 用）。
--
-- ## Cleanup
--
-- V2-P6 cron 30 天 cleanup：DELETE WHERE revoked_at IS NOT NULL OR
-- (revoked_at IS NULL AND last_seen_at < datetime('now', '-30 days'))。
-- 過期 cookie 已被 verifySessionToken 拒，但 row 留太久浪費空間。

CREATE TABLE session_devices (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  sid             TEXT NOT NULL UNIQUE,                    -- session id 嵌 cookie payload
  user_id         TEXT NOT NULL,                            -- 對應 users.id (no FK 防 cascade race)
  ua_summary      TEXT,                                     -- 'Chrome · macOS 15'，client-friendly
  ip_hash         TEXT,                                     -- SHA-256(ip) base64
  created_at      TEXT NOT NULL DEFAULT (datetime('now')),
  last_seen_at    TEXT NOT NULL DEFAULT (datetime('now')),
  revoked_at      TEXT
);

CREATE INDEX idx_session_devices_user_active
  ON session_devices(user_id, revoked_at, last_seen_at);
CREATE INDEX idx_session_devices_sid
  ON session_devices(sid);
