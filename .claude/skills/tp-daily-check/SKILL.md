---
name: tp-daily-check
description: 每日健康檢查時使用 — 讀取 daily-check report JSON，執行自動修復，發送精簡 Telegram 摘要（每日檢查、daily check、健康檢查）。單趟行程驗證用 /tp-check。
user-invocable: true
---

每日健康報告 — 讀取 report JSON，自動修復可修項目，code issues 走 tp-team pipeline 自動修，發送精簡 Telegram 摘要。

本 skill 由 `daily-check-scheduler.sh` 在 Phase 2 呼叫（Phase 1 已執行 daily-check.js 產出 JSON）。

## 步驟

1. 讀取最新的 `scripts/logs/daily-check/YYYY-MM-DD-report.json`
2. **Phase A：資料修復**（API 呼叫，秒級完成）
   - request status 卡在 received/processing/failed → PATCH → open
   - api-server error log 中 request 卡住 → PATCH → open
   - daily-check error log 中上次修復失敗 → 重試一次
3. **Phase B：Code Fix**（走 tp-team pipeline，分鐘級）
   - 分析 Sentry issues 和 API errors，判斷哪些是可自動修的 code bug
   - 可修條件：有明確 error message + 可定位到 source file + 修復不涉及架構變更
   - 對每個可修 issue：`/tp-team` pipeline → fix branch → `/ship` → `/land-and-deploy`
   - 不可修的標記「需人工處理」
4. 組裝精簡 Telegram 訊息
5. 用 Telegram MCP 發送摘要給 Key User（chat_id: 6527604594）
6. 結束（全自動，不等待回覆）

## Phase B 判斷標準

### 可自動修的 code issue

| 類型 | 範例 | 修法 |
|------|------|------|
| React render error | "Objects are not valid as a React child" | 修正 component render 邏輯 |
| API auth error（自家 caller） | 401/403 from tp-request/tp-patch | 修正 caller 的 auth header |
| Dynamic import failure | "Failed to fetch dynamically imported module" | 重新 build 或修正 chunk 路徑 |
| N+1 pattern | Sentry performance issue | 合併 API 呼叫 |

### 不可自動修（標記「需人工處理」）

| 類型 | 範例 | 原因 |
|------|------|------|
| 第三方 API 故障 | Cloudflare/Sentry API timeout | 外部依賴 |
| 資料庫 schema 問題 | migration 失敗 | 需 migration plan |
| 安全漏洞 | npm critical vulnerability | 需評估 breaking changes |
| 架構層級問題 | 效能瓶頸、race condition | 需設計討論 |

### Code Fix 流程

```
判定為可修 →
  git checkout -b fix/daily-check-autofix-YYYY-MM-DD
  → 寫 code（遵守 tp-team Build 規則）
  → /tp-code-verify（不可跳過）
  → /review（不可跳過）
  → /cso --diff（不可跳過）
  → /ship（建 PR）
  → /land-and-deploy（merge + deploy）
  → 結果寫入 Telegram 報告
```

每個 fix 獨立 commit。若任一步驟失敗，標記「修復失敗」並繼續處理下一個。

## Telegram 格式

有問題時：
```
📊 Tripline 每日報告 04/08
──────────────
⚠️ Sentry: 3 筆
⚠️ API errors: 24 筆
⚠️ 未完成請求: 2 筆
🔧 自動修復: 3 項完成
🔨 Code fix: 1 PR merged, 1 需人工
──────────────
📈 Workers: 1,234 req | err 0.1% | P50 45ms P99 320ms
📈 Analytics: 89 visits, 234 views
📈 npm: 0 vulnerabilities
✅ OK: api-server, daily-check
```

全綠時：
```
📊 04/08 ✅ 全綠
🔧 無需修復
📈 Workers: 1,234 req | err 0.1% | P50 45ms P99 320ms
📈 Analytics: 89 visits, 234 views
📈 npm: 0 vulnerabilities
```

## 自動修復範圍

### Phase A：資料修復

| 來源 | 可修復的錯誤 | 修復動作 |
|------|------------|---------|
| requestErrors | status = received/processing/failed | PATCH → open |
| api-server error log | process loop crash 後 request 卡住 | PATCH → open |
| daily-check error log | 上次修復失敗的項目 | 重試一次 |

### Phase B：Code Fix（走 tp-team pipeline）

| 來源 | 觸發條件 | 修復動作 |
|------|---------|---------|
| Sentry issues | 有明確 error + 可定位 source | fix branch → ship → deploy |
| API errors（自家 caller） | 非外部 API、非使用者操作錯誤 | 修正 caller code |

## 環境需求

- report JSON 由 `daily-check-scheduler.sh` Phase 1 產出
- Telegram 需要 MCP 連線
- Code fix 需要 git、npm、claude CLI

## 排程方式

`daily-check-scheduler.sh`（cron 06:13）自動呼叫。手動觸發：直接在 Claude Code 中輸入 `/tp-daily-check`。
