## Why

目前測試覆蓋不完整：
- **Integration test 壞掉**：`render-pipeline.test.js` 引用已移除的 `data.weather[0]`，2 個 test 失敗
- **未測試的 exported 函式**：`calcDrivingStats`、`renderDrivingStats`、`calcTripDrivingStats`、`renderTripDrivingStats`、`renderCountdown`、`renderTripStatsCard`、`formatMinutes`、`renderSuggestions` 等有 export 但無對應 unit test
- **E2E 覆蓋不足**：setting.html 無 E2E test
- **Cloudflare Pages 建置**：缺少 `build` script 讓 Cloudflare Pages 在部署時自動 split + build 所有行程的多檔 JSON

## What Changes

- **修復壞掉的 integration test**：`render-pipeline.test.js` 的 weatherId 測試改為使用 `days[].weather` 結構
- **補齊 unit test**：為未覆蓋的 exported 函式新增測試
- **補齊 integration test**：確認 render pipeline 對所有 section 的整合測試完整
- **補齊 E2E test**：setting.html 基本功能測試
- **新增 Cloudflare build command**：`package.json` 新增 `build` script，執行 `trip-split` + `trip-build` 全部行程

## Capabilities

### New Capabilities
- `cloudflare-build-command`: Cloudflare Pages 部署時的建置命令，自動 split + build 所有行程

### Modified Capabilities

## Impact

| 檔案 | 變動 |
|------|------|
| `tests/integration/render-pipeline.test.js` | 修復 weather 相關測試 |
| `tests/unit/render.test.js` | 補齊 `renderSuggestions`、`renderDrivingStats` 等 |
| `tests/unit/` | 可能新增 `driving-stats.test.js`、`countdown.test.js` |
| `tests/e2e/setting-page.spec.js` | 新增 setting.html E2E 測試 |
| `package.json` | 新增 `build` script |
| `scripts/` | 可能新增 `build-all.js` 或修改既有 script 支援全部行程 |
