## ADDED Requirements

### Requirement: 圓角 5 級統一
全站所有 `border-radius` 值 SHALL 僅使用以下 5 級 token 或 `50%`（圓形）：`--radius-xs`(4px)、`--radius-sm`(8px)、`--radius-md`(12px)、`--radius-lg`(16px)、`--radius-full`(99px)。

#### Scenario: 無硬編碼圓角值
- **WHEN** 搜尋所有 CSS 檔案的 `border-radius` 屬性
- **THEN** 值 SHALL 僅包含 `var(--radius-*)` token、`50%`、`0`，或 scrollbar thumb 的 `3px`

### Requirement: 小元素使用 radius-xs
badge、code、tag、flag 等小型元素的 `border-radius` SHALL 使用 `var(--radius-xs)`。

#### Scenario: issue-badge 圓角
- **WHEN** 渲染 issue badge
- **THEN** `border-radius` SHALL 使用 `var(--radius-full)`（膠囊形）

#### Scenario: inline code 圓角
- **WHEN** 渲染 `.issue-reply code`
- **THEN** `border-radius` SHALL 使用 `var(--radius-xs)`

### Requirement: 卡片內子元素使用 radius-sm
info-box、tl-card、suggestion-priority 等卡片內子元素的 `border-radius` SHALL 使用 `var(--radius-sm)`。

#### Scenario: suggestion priority 圓角
- **WHEN** 渲染 `.sg-priority-*` 元素
- **THEN** `border-radius` SHALL 使用 `var(--radius-sm)`

### Requirement: 浮動面板使用 radius-lg
bottom sheet、edit-input-card 等浮動面板的 `border-radius` SHALL 使用 `var(--radius-lg)`。

#### Scenario: bottom sheet 圓角
- **WHEN** 渲染 `.info-sheet-panel`
- **THEN** `border-radius` SHALL 使用 `var(--radius-lg) var(--radius-lg) 0 0`

### Requirement: scrollbar thumb 豁免
scrollbar thumb 的 `border-radius: 3px` SHALL 保留不變。

#### Scenario: scrollbar 圓角不改
- **WHEN** 檢查 `::-webkit-scrollbar-thumb` 的 CSS
- **THEN** `border-radius` SHALL 為 `3px`
