## ADDED Requirements

### Requirement: R11 地圖導航

實體地點類 timeline event（非 transit、非「餐廳未定」、非純描述型）SHOULD 含 `location` 物件，用於地圖導航。R11 採 warn 級（黃燈），不強制中斷測試。

#### Scenario: 景點含 location
- **WHEN** timeline event 為實體地點（景點、餐廳、飯店等）
- **THEN** SHOULD 含 `location` 物件，包含 `googleQuery`（Google Maps 搜尋字串）和/或 `appleQuery`（Apple Maps 搜尋字串）

#### Scenario: transit event 略過 R11
- **WHEN** timeline event 為 transit（交通移動）
- **THEN** SHALL 略過 R11 檢查

#### Scenario: 餐廳未定 event 略過 R11
- **WHEN** timeline event title 包含「餐廳未定」
- **THEN** SHALL 略過 R11 檢查

#### Scenario: location 缺失時 warn
- **WHEN** 實體地點 event 不含 `location`
- **THEN** tp-check SHALL 以黃燈（warn）標示，不以紅燈（fail）標示

### Requirement: R12 Google 評分

實體地點類 timeline event 與所有餐廳 SHOULD 含 `googleRating` 欄位（數字，1.0-5.0）。R12 採 warn 級（黃燈），不強制中斷測試。

#### Scenario: 景點含 googleRating
- **WHEN** timeline event 為實體地點
- **THEN** SHOULD 含 `googleRating`（數字，1.0-5.0）

#### Scenario: 餐廳含 googleRating
- **WHEN** restaurant 物件存在
- **THEN** SHOULD 含 `googleRating`（數字，1.0-5.0）

#### Scenario: transit event 略過 R12
- **WHEN** timeline event 為 transit
- **THEN** SHALL 略過 R12 檢查

#### Scenario: 餐廳未定 event 略過 R12
- **WHEN** timeline event title 包含「餐廳未定」
- **THEN** SHALL 略過 R12 檢查

#### Scenario: googleRating 缺失時 warn
- **WHEN** 實體地點 event 或餐廳不含 `googleRating`
- **THEN** tp-check SHALL 以黃燈（warn）標示

#### Scenario: shop 的 googleRating 不強制
- **WHEN** shop 物件不含 `googleRating`
- **THEN** SHALL 不發出 R12 警告（shop 評分為選填）
