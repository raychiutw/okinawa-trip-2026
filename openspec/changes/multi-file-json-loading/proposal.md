## Why

目前 `index.html` 透過 `loadTrip()` 載入單一大 JSON 檔（`data/trips/<slug>.json`），一次性渲染所有內容。隨著行程資料量增長（7 個行程、每個 5-8 天），初始載入效能受限。

已有 `scripts/trip-split.js` 和 `scripts/trip-build.js` 可將單一 JSON 拆分為 `data/dist/<slug>/` 下的多個小檔案，但前端尚未利用這些生成檔。本次變更將前端切換為載入多檔結構，實現 lazy loading 和獨立渲染。

## What Changes

- **多檔載入**：`loadTrip()` 從載入單一 JSON 改為載入 `data/dist/<slug>/` 下的多個檔案（`meta.json`、`day-N.json`、`flights.json` 等）
- **Slot-based async 渲染**：頁面先建立骨架 DOM，每個 section（nav、day、flights、checklist 等）各自 fetch 後獨立渲染到對應 slot
- **Day lazy loading**：切換到某天時才載入 `day-N.json`，不預載所有天
- **個別錯誤處理**：每個 section 載入失敗時各自顯示錯誤訊息，不影響其他 section
- **Weather 內嵌到 days**：**BREAKING** — 頂層 `weather[]` 陣列移除，天氣設定（`label`、`locations[]`）內嵌到各 `days[].weather`；`weather.json` 不再獨立存在
- **Weather API 座標快取**：改用 per-day 座標快取 + 智慧日期範圍查詢（`max(today, tripStart)` ~ `min(today+16, tripEnd)`），支援超過 16 天的行程
- **移除 highlights**：無任何行程使用、無 JS 渲染，移除相關程式碼

## Capabilities

### New Capabilities
- `multi-file-loading`: 前端多檔載入架構（slot-based async 渲染、lazy day loading、個別錯誤處理）
- `weather-coord-cache`: 天氣 API 座標快取機制（per-day fetch、智慧日期範圍、座標去重快取）

### Modified Capabilities
- `trip-data-normalization`: weather 資料從頂層陣列遷移到 `days[].weather`，影響 normalize 腳本
- `trip-quality-rules-source`: weather 相關驗證規則需從頂層 `weather[]` 改為 per-day `weather` 欄位驗證

## Impact

### 程式碼
| 檔案 | 變動 |
|------|------|
| `js/app.js` | `loadTrip()`、`renderTrip()`、`switchDay()`、`initWeather()`、`validateTripData()` 重構；移除 highlights 相關 |
| `scripts/trip-split.js` | 不再輸出 `weather.json`，weather 寫入 `day-N.json` |
| `scripts/trip-build.js` | 不再 copy `weather.json`，從 day 檔案組裝 weather |
| `scripts/normalize-trip-data.js` | 移除頂層 weather 處理 |
| `scripts/diff-roundtrip.js` | 移除 weather 獨立比對 |

### 資料
| 檔案 | 變動 |
|------|------|
| `data/trips/*.json`（7 個） | `weather[]` 各項搬移到對應 `days[].weather` |
| `data/examples/template.json` | day 範本新增 `weather` 欄位 |
| `data/dist/<slug>/` | 不再產生 `weather.json` |

### 測試
| 檔案 | 變動 |
|------|------|
| `tests/json/schema.test.js` | 頂層 weather 驗證改為 per-day |
| `tests/unit/validate.test.js` | 同上 |
| `tests/unit/trip-roundtrip.test.js` | 移除 weather round-trip test |
| `tests/unit/render.test.js` | weatherId 傳參改為 weather 物件 |
| `tests/integration/render-pipeline.test.js` | 同上 |
| `tests/e2e/trip-page.spec.js` | 多檔載入路徑、weather mock 調整 |

### 連動影響
- `checklist`、`backup`、`suggestions`：結構不變，僅載入方式從一次性改為獨立 fetch
- `emergency`、`flights`：同上
