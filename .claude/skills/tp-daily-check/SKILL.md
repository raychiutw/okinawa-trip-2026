---
name: tp-daily-check
description: "Use when running the daily system-wide health check — e.g. '跑 daily check', '每日健康檢查', '每日報告', 'daily-check'. Executes daily-check.js covering all trips R0-R18 + API health + Sentry errors, then sends Telegram summary and waits for Key User response. For checking a SINGLE trip's quality only, use /tp-check instead."
user-invocable: true
---

每日問題報告 — 執行 daily-check.js，讀取報告，發送 Telegram 摘要，等待 Key User 指示。

本 skill 由本機排程每天 06:13 在**互動模式**啟動，session 保持開著等待回覆。

## 步驟

1. 執行 `node scripts/daily-check.js` 產出問題報告 JSON
   - **失敗處理**：若腳本執行失敗（exit code ≠ 0），直接輸出錯誤訊息，跳到步驟 3 發送錯誤摘要
   - **環境變數缺漏**：啟動前檢查必要變數是否存在，缺漏時列出缺少的變數名稱並終止
2. 讀取最新的 `scripts/logs/daily-check-*.json`
3. 整理成 Telegram 摘要（只含重點：🔴critical / 🟡warning / ✅ok）
4. 發送摘要給 Key User：
   - **優先**：Telegram MCP reply（chat_id: 6527604594）
   - **Fallback**：若 Telegram MCP 不可用，直接在 conversation 中輸出摘要，等待使用者回覆
5. **等待 Key User 回覆**（Telegram 或 conversation），根據回覆執行：
   - 「修 #1 #3」→ 讀 JSON 完整資料，分析問題，派工程師修復
   - 「看 #2 詳情」→ 讀 JSON 完整資料，發送該問題的詳細資訊
   - 「全部看」→ 發送完整報告
   - 「沒事」或「結束」→ 結束 session
6. 修復完成後：
   - commit（遵守團隊流程：Reviewer → QC → commit）
   - 發通知修復結果（Telegram 或 conversation）
   - 等 Key User approve → push

## 環境需求

- daily-check.js 需要環境變數：CLOUDFLARE_API_TOKEN, CF_ACCOUNT_ID, D1_DATABASE_ID, SENTRY_AUTH_TOKEN, SENTRY_ORG, SENTRY_PROJECT
- 這些變數應在 PowerShell 排程中設定，或從 openspec/config.yaml 讀取

## 排程方式

Windows Task Scheduler 每天 06:13 執行（scripts/register-scheduler.ps1 註冊）：
```powershell
# 排程啟動 Claude 互動模式，由 session hook 觸發 /tp-daily-check
claude
```

手動觸發：直接在 Claude Code 中輸入 `/tp-daily-check`。
