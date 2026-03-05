## ADDED Requirements

### Requirement: meta.selfDrive 欄位
每個行程 JSON 的 `meta` SHALL 包含 `selfDrive` 欄位（boolean），標示行程是否有租車自駕。

#### Scenario: 有租車自駕
- **WHEN** 行程有租車自駕（含全程自駕或部分自駕）
- **THEN** `meta.selfDrive` SHALL 為 `true`

#### Scenario: 無租車自駕
- **WHEN** 行程全程使用大眾運輸
- **THEN** `meta.selfDrive` SHALL 為 `false`

#### Scenario: 新行程無法判斷時提問
- **WHEN** 處理新行程且 `meta.selfDrive` 不存在
- **AND** 無法從行程內容推斷
- **THEN** SHALL 提問使用者是否有租車自駕

### Requirement: gasStation infoBox type
自駕行程還車事件 SHALL 使用 `gasStation` type 的 infoBox 提供加油站資訊。

#### Scenario: gasStation 結構
- **WHEN** infoBox `type` 為 `gasStation`
- **THEN** SHALL 包含 `station` 物件，必填欄位：`name`（名稱）、`address`（地址）、`hours`（營業時間）、`service`（服務類型：人工/自助）、`phone`（電話）
- **AND** 選填欄位：`location`（Location 物件，含 googleQuery / appleQuery）

#### Scenario: 人工加油站優先
- **WHEN** 推薦加油站
- **THEN** SHALL 優先選擇フルサービス（人工加油站），若附近無人工加油站才選自助

### Requirement: R10 還車加油站品質規則
自駕行程（`meta.selfDrive` 為 `true`）的還車 timeline event SHALL 包含 gasStation infoBox。

#### Scenario: 自駕行程有還車事件
- **WHEN** `meta.selfDrive` 為 `true`
- **AND** timeline 中有 event title 包含「還車」
- **THEN** 該 event 的 infoBoxes SHALL 包含至少一個 `type: "gasStation"` 的 infoBox

#### Scenario: 非自駕行程不檢查
- **WHEN** `meta.selfDrive` 為 `false`
- **THEN** SHALL 不檢查還車加油站

#### Scenario: 無還車事件不檢查
- **WHEN** timeline 中沒有 title 包含「還車」的 event
- **THEN** SHALL 不檢查加油站
