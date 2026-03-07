## MODIFIED Requirements

### Requirement: Weather 資料位置
Weather 資料 SHALL 內嵌於各 `days[].weather`，不再作為頂層 `weather[]` 陣列。Normalize 腳本 SHALL 處理 per-day weather 結構（確保 `locations[].lat`/`lon` 為 number 型別）。

#### Scenario: 正規化 day weather
- **WHEN** 執行 normalize 且 day 有 `weather` 欄位
- **THEN** SHALL 確保 `weather.locations[].lat` 和 `weather.locations[].lon` 為 number

#### Scenario: 正規化無 weather 的 day
- **WHEN** 執行 normalize 且 day 沒有 `weather` 欄位
- **THEN** SHALL 不新增 weather 欄位

### Requirement: Splitter 不產生 weather.json
Splitter SHALL 將 weather 資料寫入對應的 `day-N.json`（或 day MD），不再產生獨立的 `weather.json`。

#### Scenario: split 輸出
- **WHEN** 執行 trip-split
- **THEN** 輸出目錄 SHALL 不包含 `weather.json`
- **THEN** 各 `day-N` 檔案 SHALL 包含對應的 weather 資料

### Requirement: Builder 不複製 weather.json
Builder SHALL 從 day 檔案讀取 weather 資料，不再 copy `weather.json`。組裝完整 JSON 時 SHALL 不產生頂層 `weather` 鍵。

#### Scenario: build 輸出
- **WHEN** 執行 trip-build
- **THEN** dist 目錄 SHALL 不包含 `weather.json`
- **THEN** 各 `day-N.json` SHALL 包含 weather 欄位
- **THEN** 組裝的完整 JSON SHALL 不含頂層 `weather` 鍵

## REMOVED Requirements

### Requirement: 頂層 weather 陣列
**Reason**: Weather 資料已遷移至 `days[].weather`，頂層 `weather[]` 不再需要
**Migration**: 各 `weather[i]` 的 `label` 和 `locations` 搬移到對應 `days[i].weather`；`id`、`date`、`dayId` 欄位由 day 本身提供
