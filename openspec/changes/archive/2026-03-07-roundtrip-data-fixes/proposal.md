## Why

JSON → MD → JSON round-trip 驗證顯示，除 Ray 行程外其餘 6 個行程皆有資料遺失。根因為：(1) 行程 JSON 資料格式不一致（URL 格式、Emergency 結構、Flight 欄位）、(2) splitter/builder 未支援所有欄位（naverQuery、hotel.googleRating、parking.note 等）、(3) 品質規則缺少多項必填欄位定義。需統一修正以達成全行程無損 round-trip。

## What Changes

### 資料正規化（寫腳本修正 `data/trips/*.json`）
- 統一 Google Maps URL 為 `https://www.google.com/maps/search/<percent-encoded query>` 格式
- Naver Maps 查詢詞轉簡體中文後 percent-encode
- Apple Maps 及其他地圖用原店名（含分店名）percent-encode
- Emergency contacts 統一為 `{label, phone, url}` 格式（參照 Ray）
- Flight segments 統一為 `{label, route, time}` 三欄格式
- 所有行程 flights 補齊 `airline` 欄位
- 刪除所有行程最後一天的 hotel（含正式旅館）
- 刪除 HuiYun gasStation 多餘的 box-level location
- Onion 補齊 81 個 `location.name`
- 所有實體（hotel、restaurant、shop、event、parking）補齊 `note` 欄位（空值設 `""`）
- 刪除所有空 `blogUrl: ""`（restaurant/shop 表格）

### Converter 修正（`scripts/trip-split.js` + `scripts/trip-build.js`）
- 支援 `naverQuery`：location 行 `- naver:`、restaurant/shop 表格加 `naver` 欄
- 支援 `hotel.googleRating`：`- rating:` 輸出與讀取
- `breakfast.note` 在 `included=false` 時也輸出
- R0 例外：`breakfast.included` 允許 `null`（代表未確認）
- Restaurant 表格加 `appleMaps` 欄（與 shop 表格一致）
- `parking.note` 支援：`- note:` 輸出與讀取
- 通用 `note` 欄位邏輯：空 `""` 不輸出到 MD，轉回 JSON 還原為 `""`
- `source` 欄位必填：splitter 輸出 `- source:`，builder 讀取（不自動加）
- 空 `blogUrl` 保留：MD 不輸出，轉回 JSON 還原為 `""`
- Builder 用 `checkout` 判斷正式旅館（取代 `hasUrl || hasDetails`）
- Builder `buildLocationFromMaps()` 只在有 `|` 分隔時設 `name`（配合 name 必填規則不影響）
- Flights parser 不產出空 `airline` 物件

### 品質規則更新（`.claude/commands/trip-quality-rules.md`）
- Google Maps URL 必須為 `/maps/search/` 格式
- `location.name` 必填
- 所有實體必須有 `note` 欄位
- 最後一天不設 hotel
- `breakfast.included` 允許 `null`（R0 例外）
- 店名含分店名

## Capabilities

### New Capabilities
- `trip-data-normalization`: 行程 JSON 資料格式統一腳本（URL、Emergency、Flight、必填欄位）

### Modified Capabilities
- `trip-quality-rules-source`: 品質規則新增 URL 格式、location.name 必填、note 必填、最後一天無 hotel、breakfast.included null 例外、店名含分店

## Impact

- **資料檔案**：`data/trips/*.json`（全部 7 個行程）、`data/examples/template.json`
- **腳本檔案**：`scripts/trip-split.js`、`scripts/trip-build.js`
- **品質規則**：`.claude/commands/trip-quality-rules.md`
- **測試**：`tests/unit/trip-roundtrip.test.js`（擴展至全行程驗證）
- **無 UI 影響**：不修改 js/css/html（`app.js` 的 `formatDayDate()` 和日期相關已在先前變更處理）
- **無 checklist/backup/suggestions 連動**：本次僅修正資料格式與欄位，不影響這些 section 的結構
