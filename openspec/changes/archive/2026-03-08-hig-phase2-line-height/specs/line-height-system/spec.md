## ADDED Requirements

### Requirement: body 預設行距
`body` 的 `line-height` SHALL 使用 `var(--lh-normal)`（值為 1.5）。

#### Scenario: body 行距為 1.5
- **WHEN** 載入任何頁面
- **THEN** body 的 computed line-height SHALL 等於 font-size × 1.5

### Requirement: 標題類行距
`.tl-title`、`.tl-flag`、`.hw-block-icon`、`.countdown-number` 的 `line-height` SHALL 使用 `var(--lh-tight)`（值為 1.2）。

#### Scenario: 標題行距為 1.2
- **WHEN** 渲染 timeline 標題
- **THEN** `.tl-title` 的 computed line-height SHALL 等於 font-size × 1.2

#### Scenario: flag 行距為 1.2
- **WHEN** 渲染時間旗標
- **THEN** `.tl-flag` 的 computed line-height SHALL 等於 font-size × 1.2

### Requirement: 內容段落行距
`.tl-body`、`.col-detail`、`.info-box`、`.ov-card p`、`.restaurant-choice`、`.driving-summary-body`、`.suggestion-card p` 的 `line-height` SHALL 使用 `var(--lh-relaxed)`（值為 1.7）。

#### Scenario: 內容段落行距為 1.7
- **WHEN** 渲染行程描述文字
- **THEN** `.tl-body` 的 computed line-height SHALL 等於 font-size × 1.7

### Requirement: icon 行距保留
`.g-icon`、`.n-icon`、`.dh-nav-arrow` 的 `line-height` SHALL 保持為 `1`，不使用 token。

#### Scenario: icon 行距為 1
- **WHEN** 渲染地圖 icon
- **THEN** `.g-icon` 的 computed line-height SHALL 等於 font-size × 1
