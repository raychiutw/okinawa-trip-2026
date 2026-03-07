## ADDED Requirements

### Requirement: Weather 內嵌到 Day
每個 day 物件 SHALL 有 `weather` 欄位（可選），包含 `label`（字串）和 `locations` 陣列。頂層 `weather[]` 陣列 SHALL 不存在。

#### Scenario: Day 有天氣設定
- **WHEN** day 物件有 `weather` 欄位
- **THEN** SHALL 包含 `{ label: string, locations: [{ lat: number, lon: number, name: string, start: number, end: number }] }`

#### Scenario: Day 無天氣設定
- **WHEN** day 物件沒有 `weather` 欄位（如最後一天回程日）
- **THEN** 該天 SHALL 不渲染天氣 widget

#### Scenario: 頂層 weather 不存在
- **WHEN** 讀取行程 JSON
- **THEN** SHALL 不含頂層 `weather` 鍵

### Requirement: 座標快取
天氣 API 查詢結果 SHALL 以座標 key（`lat,lon`）快取。相同座標不重複 fetch。

#### Scenario: 首次查詢座標
- **WHEN** Day 1 需要座標 `26.33,127.78` 的天氣且快取中不存在
- **THEN** SHALL fetch Open-Meteo API
- **THEN** SHALL 將結果存入 `weatherCache["26.33,127.78"]`

#### Scenario: 重複座標
- **WHEN** Day 2 也需要座標 `26.33,127.78` 的天氣
- **THEN** SHALL 直接從 `weatherCache` 取值，不打 API

### Requirement: 智慧日期範圍查詢
每次 API 查詢 SHALL 使用 `start_date = max(today, tripStart)` 和 `end_date = min(today + 16, tripEnd)` 作為日期範圍，一次涵蓋最大有效範圍。

#### Scenario: 5 天行程在預報範圍內
- **WHEN** 行程 5 天且全部在 today+16 內
- **THEN** API 查詢 SHALL 用 `start_date=tripStart, end_date=tripEnd`

#### Scenario: 20 天行程部分超出
- **WHEN** 行程 20 天，後 4 天超出 today+16
- **THEN** API 查詢 SHALL 用 `end_date = today+16`
- **THEN** 前 16 天 SHALL 有天氣資料
- **THEN** 後 4 天 SHALL 渲染預設值

#### Scenario: 行程完全超出預報範圍
- **WHEN** 行程所有天都超出 today+16
- **THEN** SHALL 不打 API
- **THEN** 所有天 SHALL 渲染預設值

### Requirement: Per-day 天氣渲染
每個 Day 載入時 SHALL 獨立觸發其天氣查詢與渲染，不需等待所有 Day 載入完畢。

#### Scenario: Day 1 載入觸發天氣
- **WHEN** Day 1 的 `day-1.json` 載入完成且有 `weather` 欄位
- **THEN** SHALL 立即查詢天氣（或從快取取值）並渲染天氣 widget

#### Scenario: 天氣 API 失敗
- **WHEN** Open-Meteo API 查詢失敗
- **THEN** 該天 SHALL 顯示天氣載入失敗訊息
- **THEN** Day 內容其餘部分 SHALL 正常顯示

### Requirement: 日期範圍來源
`tripStart` 和 `tripEnd` SHALL 從 meta.json 的 `autoScrollDates` 陣列取得（取最小值和最大值）。

#### Scenario: 從 autoScrollDates 取得日期範圍
- **WHEN** meta.json 載入完成
- **THEN** SHALL 從 `autoScrollDates` 計算 `tripStart`（最小值）和 `tripEnd`（最大值）
- **THEN** SHALL 用於所有後續天氣 API 查詢的日期範圍計算
