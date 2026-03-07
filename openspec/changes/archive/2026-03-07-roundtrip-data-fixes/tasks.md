## 1. 資料正規化腳本

- [x] 1.1 寫 `scripts/normalize-trip-data.js` — URL 格式統一（Google→`/maps/search/`、Apple→原店名 encode、Naver→簡中 encode）
- [x] 1.2 Emergency contacts 統一為 `{label, phone, url}` + card 必須有 `color`
- [x] 1.3 Flight segments 統一為 `{label, route, time}` + 補齊 `airline` 欄位
- [x] 1.4 刪除所有行程最後一天的 hotel
- [x] 1.5 刪除 HuiYun gasStation 多餘的 box-level location
- [x] 1.6 Onion 補齊所有缺失的 `location.name`
- [x] 1.7 所有實體補齊 `note: ""`（hotel、restaurant、shop、event、parking）
- [x] 1.8 所有實體補齊 `source` 欄位（hotel、restaurant、shop、gasStation、event）
- [x] 1.9 確保所有 restaurant/shop 有 `blogUrl`（空值 `""`）
- [x] 1.10 簡易旅館（最後一天）刪除空 `details: []`（已被 1.4 覆蓋）
- [x] 1.11 執行腳本並驗證 `npm test` 通過（品質測試 126/126 全過）

## 2. Splitter 修正（trip-split.js）

- [x] 2.1 `fmtLocations()` 加 `- naver: <url>` 輸出
- [x] 2.2 `fmtRestaurantTable()` 加 `naver` 和 `appleMaps` 欄
- [x] 2.3 `fmtShopTable()` 加 `naver` 欄
- [x] 2.4 `fmtHotel()` 加 `- rating:` 和 `- source:` 輸出
- [x] 2.5 `fmtHotel()` — `breakfast: false` 時也帶 note
- [x] 2.6 `fmtParkingBox()` 加 `- note:` 輸出
- [x] 2.7 `fmtEvent()` 加 `- source:` 輸出（取代 builder 自動加）+ gasStation source
- [x] 2.8 Restaurant/shop 表格 — `source` 欄加入輸出
- [x] 2.9 URL 格式配合：`extractQuery()` 支援 `/maps/search/` 格式

## 3. Builder 修正（trip-build.js）

- [x] 3.1 `buildLocationFromMaps()` — 只在有 `|` 分隔時才設 `name`；加 `naverQuery` 參數
- [x] 3.2 `parseRestaurantInfoBox()` — 讀取 `naver`、`appleMaps` 欄；空 blogUrl 還原 `""`；讀取 `source`；不自動加 `source`
- [x] 3.3 `parseShoppingInfoBox()` — 讀取 `naver` 欄；空 blogUrl 還原 `""`；讀取 `source`；不自動加 `source`
- [x] 3.4 `parseHotel()` — 讀取 `- rating:`、`- source:`；用 `checkout` 判斷正式旅館；`breakfast: false` 讀取 note；null breakfast 還原
- [x] 3.5 `parseParkingInfoBox()` — 讀取 `- note:`
- [x] 3.6 `buildEvent()` — 讀取 `- source:`；不自動加 `source`
- [x] 3.7 `parseFlights()` — 不產出空 `airline` 物件
- [x] 3.8 所有實體 — 空 `note` 還原為 `""`
- [x] 3.9 URL 重建配合：`encodeQuery()` 改用 `/maps/search/` 格式

## 4. 品質規則更新

- [x] 4.1 `trip-quality-rules.md` — 新增 URL 格式規則
- [x] 4.2 `trip-quality-rules.md` — 新增 `location.name` 必填規則（含分店名）
- [x] 4.3 `trip-quality-rules.md` — 新增 `note` 必填規則
- [x] 4.4 `trip-quality-rules.md` — 新增 `source` 必填規則
- [x] 4.5 `trip-quality-rules.md` — 新增最後一天無 hotel 規則
- [x] 4.6 `trip-quality-rules.md` — R0 加 `breakfast.included` null 例外
- [x] 4.7 `trip-quality-rules.md` — 新增 `airline` 必填規則
- [x] 4.8 `data/examples/template.json` 同步更新（note、source、airline 等欄位）

## 5. 驗證

- [x] 5.1 全部 7 個行程 split + build + round-trip 比對通過
- [x] 5.2 `npm test` 632 測試全過
- [x] 5.3 `tests/unit/trip-roundtrip.test.js` 擴展至全行程驗證（77 個 round-trip 測試）
