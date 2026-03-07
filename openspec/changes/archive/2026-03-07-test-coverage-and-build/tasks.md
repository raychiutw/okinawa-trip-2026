## 1. 修復壞掉的測試

- [x] 1.1 修復 `tests/integration/render-pipeline.test.js` 的 weatherId 測試：`data.weather[0]` 改為 `data.days[0].weather`，weatherId 改為 `'hourly-' + data.days[0].id`
- [x] 1.2 執行 integration test 確認 2 個失敗測試修復

## 2. 補齊 unit test — render 函式

- [x] 2.1 `renderSuggestions`：空 cards、有 priority cards、items 渲染
- [x] 2.2 `calcDrivingStats` + `renderDrivingStats`：有 travel 的 timeline、無 travel、多種 transport type
- [x] 2.3 `calcTripDrivingStats` + `renderTripDrivingStats`：多天累計統計
- [x] 2.4 `formatMinutes`：0 分、60 分、90 分、負數邊界
- [x] 2.5 `renderCountdown`：未來日期、過去日期、當天
- [x] 2.6 `renderTripStatsCard`：有 days + flights、無 flights

## 3. 補齊 E2E test

- [x] 3.1 新增 `tests/e2e/setting-page.spec.js`：頁面載入顯示行程清單、行程切換、深色模式切換
- [x] 3.2 執行全部 E2E 測試確認通過

## 4. Cloudflare Pages build command

- [x] 4.1 新增 `scripts/build-all.js`：讀取 `data/trips/*.json` 所有 slug，依序執行 `trip-split.js` + `trip-build.js`
- [x] 4.2 `package.json` 新增 `"build": "node scripts/build-all.js"` script
- [x] 4.3 執行 `npm run build` 確認所有行程成功建置

## 5. 驗收

- [x] 5.1 執行全部測試（unit + integration + json + e2e）確認通過
