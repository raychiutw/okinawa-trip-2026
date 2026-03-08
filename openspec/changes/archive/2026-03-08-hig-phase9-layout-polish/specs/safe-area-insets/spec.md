## ADDED Requirements

### Requirement: viewport-fit=cover meta 標籤
所有三頁 HTML（index.html、edit.html、setting.html）的 `<meta name="viewport">` SHALL 包含 `viewport-fit=cover` 屬性。

#### Scenario: viewport meta 包含 viewport-fit
- **WHEN** 載入任何頁面的 HTML
- **THEN** viewport meta 標籤 SHALL 包含 `viewport-fit=cover`

### Requirement: 導覽列 safe area 支援
`.sticky-nav` SHALL 使用 `env(safe-area-inset-top)` 和 `env(safe-area-inset-left/right)` 計算 padding，確保在瀏海/動態島裝置上導覽列內容不被遮擋。

#### Scenario: 瀏海裝置上導覽列內容完整可見
- **WHEN** 在有 safe area 的裝置上載入頁面
- **THEN** `.sticky-nav` 的 padding-top SHALL 不小於 `env(safe-area-inset-top)`

#### Scenario: 無 safe area 裝置不受影響
- **WHEN** 在無 safe area 的裝置上載入頁面
- **THEN** `.sticky-nav` 的 padding SHALL 與原本一致（env() fallback 為 0）

### Requirement: 底部元素 safe area 支援
FAB（`.fab-link`）、Speed Dial（`.speed-dial`）、Bottom Sheet（`.info-sheet-panel`）、footer SHALL 使用 `env(safe-area-inset-bottom)` 確保在有 home indicator 的裝置上不被遮擋。

#### Scenario: home indicator 裝置上 FAB 位置正確
- **WHEN** 在有 home indicator 的裝置上載入頁面
- **THEN** FAB 的 bottom 值 SHALL 包含 `env(safe-area-inset-bottom)` 的偏移

#### Scenario: bottom sheet 底部有安全距離
- **WHEN** 在有 home indicator 的裝置上開啟 bottom sheet
- **THEN** `.info-sheet-panel` 的 padding-bottom SHALL 包含 `env(safe-area-inset-bottom)`

### Requirement: 內容區水平 safe area 支援
`.day-content` 和主要內容容器 SHALL 使用 `env(safe-area-inset-left/right)` 確保在橫向模式下內容不被裝置圓角或瀏海遮擋。

#### Scenario: 橫向模式內容不被切割
- **WHEN** 在有 safe area 的裝置上橫向持握
- **THEN** 內容區左右 padding SHALL 不小於 `env(safe-area-inset-left/right)`
