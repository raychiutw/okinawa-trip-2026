## Context

目前有 12 個測試檔案（unit 7 + json 3 + integration 1 + e2e 2），共 624 tests。但有 2 個 integration test 因 weather 遷移而壞掉，多個 exported 函式缺少測試覆蓋。

Cloudflare Pages 部署設定尚未有統一的 build command，只有 `build:trips` 但需要傳入 slug 參數。

## Goals / Non-Goals

**Goals:**
- 修復壞掉的 2 個 integration test
- 為所有 exported 但未測試的函式補齊 unit test
- 新增 setting.html E2E 測試
- 新增 Cloudflare Pages build command（split-all + build-all）

**Non-Goals:**
- 不追求 100% 行覆蓋率
- 不重構既有測試架構
- 不新增 CI/CD pipeline（只新增 build script）

## Decisions

### D1: 修復 integration test

`render-pipeline.test.js` line 78 的 `data.weather[0]` 改為 `data.days[0].weather`，weatherId 改為 `'hourly-' + data.days[0].id`。

### D2: Unit test 補齊策略

按 exported 函式分組，加入既有的測試檔案或新增檔案：

| 函式群組 | 加入位置 |
|----------|----------|
| `calcDrivingStats`, `renderDrivingStats`, `calcTripDrivingStats`, `renderTripDrivingStats`, `formatMinutes` | `tests/unit/render.test.js` 新增 describe 區塊 |
| `renderCountdown`, `renderTripStatsCard` | `tests/unit/render.test.js` 新增 describe 區塊 |
| `renderSuggestions` | `tests/unit/render.test.js` 新增 describe 區塊 |

不新增獨立測試檔案，避免檔案膨脹。

### D3: E2E 測試 — setting.html

新增 `tests/e2e/setting-page.spec.js`，測試：
- 頁面載入顯示行程清單
- 行程切換功能
- 深色模式切換

### D4: Cloudflare build command

`package.json` 新增 `"build"` script：
1. 對所有 `data/trips/*.json` 執行 `trip-split.js`
2. 對所有 slug 執行 `trip-build.js`

可用簡單的 shell 迴圈或新增一個 `scripts/build-all.js` 統一處理。

## Risks / Trade-offs

| 風險 | 緩解 |
|------|------|
| 新增測試可能因既有 bug 而失敗 | 先修復再補測試 |
| E2E 測試依賴 serve 啟動 | 使用 Playwright webServer 配置 |
| build script 需要所有 trip 檔案存在 | 從 `data/trips/` 動態讀取，不寫死清單 |
