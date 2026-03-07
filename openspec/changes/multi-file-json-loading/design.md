## Context

目前 `loadTrip(filename)` 載入單一 `data/trips/<slug>.json`，呼叫 `renderTrip(data)` 一次性渲染所有 Day、Info sections、Footer。已有 `trip-split.js` / `trip-build.js` 可產生 `data/dist/<slug>/` 多檔結構，但前端未使用。

天氣資料作為頂層 `weather[]` 陣列獨立存在，需透過 `w.date === day.date || w.dayId === id` 匹配到對應天。`initWeather()` 批次收集所有座標後一次打 API。

## Goals / Non-Goals

**Goals:**
- 前端改為從 `data/dist/<slug>/` 載入多個小檔案
- 各 section 平行 fetch、獨立渲染（slot-based async）
- Day 切換時才載入（lazy loading），提升初始載入效能
- 每個 section 載入失敗時個別顯示錯誤
- Weather 資料內嵌到 day，消除頂層 weather 陣列
- Weather API 支援超過 16 天的行程（部分天顯示預設值）

**Non-Goals:**
- 不做 Service Worker / offline cache
- 不做 day 內容的 virtual scroll 或分頁
- 不做 SSR 或 prerender
- 不改 edit.html 和 setting.html 的資料載入方式

## Decisions

### D1: 載入路徑從 `data/trips/<slug>.json` 改為 `data/dist/<slug>/`

`slugToFile(s)` 改為回傳 dist 路徑前綴。載入流程：

1. fetch `index.json`（manifest 陣列，如 `["meta","flights","day-1",...,"checklist",...]`）
2. 依 manifest 決定需要載入哪些檔案

**為什麼不用寫死清單**：manifest 讓不同行程可以有不同結構（有的沒有 flights、沒有 emergency），前端不需要 hardcode。

### D2: Slot-based async 渲染

頁面先建立骨架 DOM（空 slot），各 section fetch 到資料後獨立填入：

```
骨架 DOM:
  #nav-slot        ← meta.json 到了填入 nav pills
  #day-slot        ← day-N.json 到了填入 day 內容
  #flights-slot    ← flights.json 到了填入
  #checklist-slot  ← checklist.json 到了填入
  #backup-slot     ← backup.json 到了填入
  #suggestions-slot
  #emergency-slot
  #footer-slot     ← meta.json 到了填入 footer
```

各 slot 初始顯示 loading skeleton。fetch 失敗時該 slot 顯示錯誤訊息，不影響其他 slot。

**替代方案**：一次載入全部再渲染（現有做法）。不採用，因為無法做 lazy loading。

### D3: Day lazy loading

- 初始只載入首頁顯示的 Day（通常是 Day 1 或 autoScroll 指定的當天）
- `switchDay()` 觸發時，檢查該 Day 是否已載入：
  - 已載入 → 直接切換顯示
  - 未載入 → fetch `day-N.json` → 渲染 → 切換顯示
- 已載入的 Day 快取在記憶體中，不重複 fetch

```javascript
var dayCache = {};  // key: dayId, value: rendered HTML or data

function switchDay(dayId) {
    if (dayCache[dayId]) {
        showDay(dayId);        // 切換顯示
    } else {
        fetchDay(dayId)        // lazy fetch
            .then(renderDay)
            .then(showDay);
    }
}
```

**替代方案**：預載所有 Day。不採用，因為失去 lazy loading 的效能優勢。

### D4: Weather 內嵌到 days（方案 A）

頂層 `weather[]` 移除。每個 day 新增 `weather` 欄位：

```json
{
  "id": 1,
  "date": "2026-07-29",
  "weather": {
    "label": "北谷",
    "locations": [
      { "lat": 26.33, "lon": 127.78, "name": "那霸", "start": 0, "end": 13 },
      { "lat": 26.34, "lon": 127.76, "name": "北谷", "start": 14, "end": 23 }
    ]
  },
  "content": { ... }
}
```

消除的冗餘欄位：`weather.id`（改為 `hourly-${day.id}`）、`weather.date`（用 `day.date`）、`weather.dayId`（用 `day.id`）。

最後一天若不需天氣，`weather` 欄位可省略或設為 `null`。

**替代方案**：保留頂層 weather 陣列。不採用，因為多檔架構下 day 無法自包含，需額外等 weather.json。

### D5: Weather API 座標快取 + 智慧日期範圍

```
weatherCache = {}     // key: "lat,lon", value: API response

fetchStart = max(today, tripStart)
fetchEnd   = min(today + 16, tripEnd)
```

流程：
1. meta.json 載入時，從 `autoScrollDates` 得知 `tripStart` 和 `tripEnd`
2. 計算 `fetchStart` / `fetchEnd`
3. Day N 載入時：
   - 若 `day.date` 不在 `fetchStart ~ fetchEnd` → 渲染預設值（超出預報範圍）
   - 若在範圍內 → 檢查 `weatherCache[lat,lon]`
     - cache hit → 直接用
     - cache miss → fetch `start_date=fetchStart, end_date=fetchEnd` → 存入 cache
4. 從 cache 中用 `dayOffset = time.indexOf(day.date + 'T00:00')` 取出該天資料

每個座標只打一次 API，涵蓋整段行程（上限 16 天）。

**替代方案 1**：每天各自打 API（簡單但浪費）。不採用。
**替代方案 2**：在 meta.json 集中天氣設定（違反 day 自包含原則）。不採用。

### D6: 移除 highlights

搜尋全站無任何 `highlights` 使用。直接移除相關程式碼（如有）。

## Risks / Trade-offs

| 風險 | 緩解 |
|------|------|
| 多檔載入增加 HTTP 請求數 | Cloudflare Pages 支援 HTTP/2 multiplexing，小檔平行載入反而更快；info sections 載入非首屏關鍵路徑 |
| Day 切換有載入延遲 | 快取已載入的 Day；loading skeleton 提供視覺回饋；預載相鄰 Day（可選的未來優化） |
| Weather cache 永不過期 | 單次頁面瀏覽內快取即可，重整頁面重新查詢；Open-Meteo 免費無 rate limit 壓力 |
| BREAKING：weather 結構變更 | 所有 7 個 trip JSON 需遷移；trip-split/build/normalize 需同步修改；需跑完整 roundtrip test 確認無資料遺失 |
| E2E 測試需 mock 多檔載入 | Playwright route 攔截改為多檔路徑匹配 |
