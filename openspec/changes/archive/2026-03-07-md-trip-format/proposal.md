## Why

目前行程 JSON 單檔 2000~3000 行（70~130KB），Claude 每次修改需讀取完整檔案才能改幾行。以 tp-patch 為例，批次更新 3 個行程的 time 欄位就耗費大量 context window。將行程資料改為 Markdown 拆天格式，每次只需讀取 ~90 行的小檔，編輯效率提升約 20 倍。

## What Changes

**Phase 1：POC Spike（本次範圍）**

以 `okinawa-trip-2026-Ray` 為測試對象，驗證完整 round-trip：

- 新增 `scripts/trip-split.js`：JSON → Markdown 拆檔工具
- 新增 `scripts/trip-build.js`：Markdown → JSON 編譯工具
- 新增 `data/trips-md/okinawa-trip-2026-Ray/`：拆天後的 .md 來源檔
- 新增 `data/dist/okinawa-trip-2026-Ray/`：編譯產出的小 JSON（.gitignore）
- 新增 `poc.html`：測試頁面，從小 JSON 載入並渲染
- 新增 `tests/unit/trip-roundtrip.test.js`：round-trip 自動驗證

**Phase 2（後續，不在本次範圍）**

- 遷移全部 7 個行程
- 改寫 app.js loader
- 更新 tp-* skills
- 設定 Cloudflare Pages build command

## Capabilities

### New Capabilities

- Markdown 行程格式定義（per-day + per-section .md 檔案）
- JSON ↔ Markdown 雙向轉換工具
- 多小檔 JSON 並行載入與組裝

### Modified Capabilities

（POC 階段不修改現有功能）

## Impact

- 影響檔案：新增 `scripts/`、`data/trips-md/`、`data/dist/`、`poc.html`、`tests/`
- **不影響**現有 index.html、app.js、style.css 等生產程式碼
- **不影響**現有行程 JSON 檔案
- POC 完全隔離，可獨立驗證後再決定是否正式遷移
