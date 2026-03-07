## 1. Weather 資料遷移（JSON 結構變更）

- [x] 1.1 將 7 個 trip JSON 的頂層 `weather[]` 各項搬移到對應 `days[].weather`（只保留 `label` 和 `locations`，移除 `id`/`date`/`dayId`）
- [x] 1.2 更新 `data/examples/template.json`：day 範本新增 `weather` 欄位，移除頂層 `weather`
- [x] 1.3 更新 `scripts/normalize-trip-data.js`：weather lat/lon 驗證改為 per-day `days[].weather`（確認無 weather 相關程式碼，不需修改）
- [x] 1.4 更新 `tests/json/schema.test.js`：頂層 weather 驗證改為 per-day weather 驗證
- [x] 1.5 更新 `tests/unit/validate.test.js`：weather 相關測試改為 per-day 結構
- [x] 1.6 更新 `js/app.js` `validateTripData()`：weather 驗證從頂層改為 per-day
- [x] 1.7 執行全部測試確認 weather 遷移無資料遺失

## 2. Split/Build 腳本適配

- [x] 2.1 更新 `scripts/trip-split.js`：不再輸出 `weather.json`，weather 資料寫入 day MD frontmatter
- [x] 2.2 更新 `scripts/trip-build.js`：不再 copy `weather.json`，從 day frontmatter 讀取 weather；移除 weather.json copy
- [x] 2.3 更新 `scripts/diff-roundtrip.js`：移除 weather 獨立比對
- [x] 2.4 更新 `tests/unit/trip-roundtrip.test.js`：移除 weather round-trip test（已包含在 days round-trip）
- [x] 2.5 對全部 7 個 trip 執行 roundtrip test 確認無資料遺失

## 3. 前端骨架 DOM + Slot-based 渲染

- [ ] 3.1 在 `js/app.js` 新增 `createSkeleton()` 函式，建立骨架 DOM（nav-slot、day-slot、各 info section slot、footer-slot），各 slot 含 loading placeholder
- [ ] 3.2 新增 `renderSlotError(slotId, message)` 函式，在指定 slot 顯示錯誤訊息
- [ ] 3.3 拆解 `renderTrip()` 為個別 section 渲染函式：`renderNavSlot(meta)`、`renderFooterSlot(meta)`、`renderInfoSlot(key, data)`
- [ ] 3.4 新增對應 unit test（skeleton 產生、error slot 渲染）

## 4. 多檔載入機制

- [ ] 4.1 修改 `slugToFile()` 回傳 dist 路徑前綴 `data/dist/<slug>/`
- [ ] 4.2 重寫 `loadTrip()`：fetch `index.json` manifest → 平行 fetch meta + info sections → 各自渲染到 slot
- [ ] 4.3 meta.json 載入後計算 `tripStart`/`tripEnd`（from `autoScrollDates`）並存入全域變數
- [ ] 4.4 新增 index.json 載入失敗的整頁錯誤處理
- [ ] 4.5 新增各 section 載入失敗的個別錯誤處理（呼叫 `renderSlotError`）

## 5. Day Lazy Loading

- [ ] 5.1 新增 `dayCache` 物件，快取已載入的 Day 資料
- [ ] 5.2 重寫 `switchDay(dayId)`：檢查 dayCache → hit 直接顯示 / miss 則 fetch `day-N.json` → 渲染 → 快取 → 顯示
- [ ] 5.3 初始載入只 fetch autoScroll 指定的當天（或 Day 1），不預載所有天
- [ ] 5.4 Day 載入失敗時在 day-slot 顯示錯誤訊息，仍可切換到其他 Day
- [ ] 5.5 新增 unit test：dayCache hit/miss 行為驗證

## 6. Weather API 座標快取

- [ ] 6.1 新增 `weatherCache` 物件（key: `lat,lon`，value: API response）
- [ ] 6.2 新增 `fetchWeatherForDay(day)` 函式：檢查 `day.date` 是否在預報範圍 → 查快取 → miss 則 fetch（`start_date=fetchStart, end_date=fetchEnd`）→ 存快取 → 渲染
- [ ] 6.3 重構 `initWeather()`：改為 per-day 呼叫 `fetchWeatherForDay`，不再批次收集所有天
- [ ] 6.4 從 meta.json 的 `autoScrollDates` 計算 `fetchStart = max(today, tripStart)` 和 `fetchEnd = min(today+16, tripEnd)`
- [ ] 6.5 超出預報範圍的 Day 渲染預設值，不打 API
- [ ] 6.6 更新 `renderDayContent(content, weatherId)` 簽名：改為 `renderDayContent(content, weather)` 傳入 weather 物件，DOM id 改用 `hourly-${day.id}`
- [ ] 6.7 更新 `tests/unit/render.test.js` 和 `tests/integration/render-pipeline.test.js`：weatherId 改為 weather 物件

## 7. 移除 highlights

- [ ] 7.1 搜尋並移除 app.js 中所有 highlights 相關程式碼（如有）
- [ ] 7.2 確認 split/build 不產生 highlights 相關檔案

## 8. E2E 測試適配

- [ ] 8.1 更新 `tests/e2e/trip-page.spec.js`：mock 多檔載入路徑（攔截 `data/dist/<slug>/*`）
- [ ] 8.2 更新 weather API mock：配合 per-day 天氣查詢
- [ ] 8.3 新增 E2E test：Day lazy loading 切換行為
- [ ] 8.4 執行全部測試確認通過

## 9. 品質規則更新（trip-quality-rules.md）

- [ ] 9.1 R0 根層級必填：移除 `weather`（非空陣列）和 `highlights` 必填要求
- [ ] 9.2 R0 每日結構：新增 `weather`（選填物件，含 `label` 字串、`locations` 陣列）；`weather.locations[].lat` 和 `lon` 須為 number
- [ ] 9.3 R0 移除 Highlights 結構整段（L45-46：`須含 title 和 content（含 summary string 和 tags array）`）
- [ ] 9.4 R0 移除 weather 頂層相關行（L26-27：`weather[].date`、`weather[].locations[].lat`）
- [ ] 9.5 R9 AI 亮點精簡：整條規則移除（highlights 不再存在）
- [ ] 9.6 確認所有 skill（tp-create/tp-rebuild/tp-edit/tp-check/tp-issue/tp-patch）透過引用 `trip-quality-rules.md` 自動生效，不需逐一修改 skill 檔案
- [ ] 9.7 執行 `/tp-check` 對全部 7 個行程驗證通過
