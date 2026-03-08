## ADDED Requirements

### Requirement: 水平邊距 token
`:root` 中 SHALL 定義 `--padding-h` 變數，compact（< 768px）為 `16px`，regular（≥ 768px）為 `20px`。

#### Scenario: 手機版水平邊距為 16px
- **WHEN** 視窗寬度 < 768px
- **THEN** `--padding-h` SHALL 為 `16px`

#### Scenario: 桌面版水平邊距為 20px
- **WHEN** 視窗寬度 ≥ 768px
- **THEN** `--padding-h` SHALL 為 `20px`

### Requirement: 全站水平邊距統一引用 token
所有主要容器和區段的水平 padding SHALL 使用 `var(--padding-h)` 而非硬編碼值。受影響元素包括：`.sticky-nav`、`.day-content`、`.info-sheet-panel`、`.chat-messages`、setting 頁 `.container`。

#### Scenario: sticky-nav 使用 padding-h
- **WHEN** 檢查 `.sticky-nav` 的 CSS
- **THEN** 左右 padding SHALL 引用 `var(--padding-h)`

#### Scenario: day-content 使用 padding-h
- **WHEN** 檢查 `.day-content` 的 CSS
- **THEN** 左右 padding SHALL 引用 `var(--padding-h)`

#### Scenario: 無硬編碼水平邊距
- **WHEN** 搜尋主要容器元素的 padding-left / padding-right
- **THEN** SHALL 使用 `var(--padding-h)` 而非硬編碼 `12px`、`16px`、`24px` 等值
