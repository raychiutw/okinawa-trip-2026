## ADDED Requirements

### Requirement: Magic number 須抽為具名常數

重複出現的 magic number SHALL 抽為檔案頂部的具名常數。

#### Scenario: 86400000 抽為 MS_PER_DAY
- **WHEN** `86400000`（一天的毫秒數）出現 3 處
- **THEN** SHALL 抽為 `var MS_PER_DAY = 86400000` 並取代所有出現處

### Requirement: lsRenewAll 須有每 session 一次防護

`lsRenewAll()` SHALL 在每個瀏覽器 session 中最多執行一次，避免每次頁面載入都掃描整個 localStorage。

#### Scenario: 首次載入執行
- **WHEN** 頁面首次載入且 sessionStorage 中無 `lsRenewed` 標記
- **THEN** `lsRenewAll()` SHALL 執行並設定 `sessionStorage.setItem('lsRenewed', '1')`

#### Scenario: 同 session 再次載入跳過
- **WHEN** 頁面再次載入且 sessionStorage 中已有 `lsRenewed` 標記
- **THEN** `lsRenewAll()` SHALL 跳過不執行

### Requirement: aria-expanded 須隨展開收合更新

可展開/收合的 `.col-row` 元素在切換狀態時 SHALL 同步更新 `aria-expanded` 屬性。

#### Scenario: 展開時設為 true
- **WHEN** 使用者點擊 `.col-row` 展開內容
- **THEN** 該 `.col-row` 的 `aria-expanded` SHALL 設為 `"true"`

#### Scenario: 收合時設為 false
- **WHEN** 使用者點擊 `.col-row` 收合內容
- **THEN** 該 `.col-row` 的 `aria-expanded` SHALL 設為 `"false"`
