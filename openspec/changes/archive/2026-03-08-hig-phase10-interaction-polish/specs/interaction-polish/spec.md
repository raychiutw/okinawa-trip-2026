## ADDED Requirements

### Requirement: 移除 cursor pointer
全站所有按鈕、FAB、卡片行等互動元素 SHALL 不使用 `cursor: pointer`。僅超連結（`<a>` 標籤）保留瀏覽器預設 cursor 行為。

#### Scenario: 按鈕 hover 無手指圖示
- **WHEN** 使用者 hover 任何 `<button>` 元素
- **THEN** cursor 顯示為預設箭頭（`default`），不顯示手指（`pointer`）

#### Scenario: 卡片行 hover 無手指圖示
- **WHEN** 使用者 hover `.col-row`、`.trip-btn` 等可點擊行
- **THEN** cursor 顯示為預設箭頭

### Requirement: hover 語意色變化
所有 hover 效果 SHALL 使用語意色（`background-color` 或 `color`）變化，禁止使用 `opacity` 降低透明度。

#### Scenario: 按鈕 hover 背景色變化
- **WHEN** 使用者 hover 按鈕（`.nav-close-btn`、`.speed-dial-item` 等）
- **THEN** 元素背景色變為 `var(--bg-secondary)` 或使用 `color-mix()` 加深

#### Scenario: 連結文字 hover 色變化
- **WHEN** 使用者 hover 文字連結（`.map-link` 等）
- **THEN** 文字 `color` 變化，不使用 `opacity`

### Requirement: selection 品牌色高亮
全站 `::selection` 偽元素 SHALL 使用品牌 accent 色調作為選取背景。

#### Scenario: 亮色模式選取文字
- **WHEN** 使用者在亮色模式下選取文字
- **THEN** 選取背景為 `var(--accent-subtle)`，文字色為 `var(--text-primary)`

#### Scenario: 暗色模式選取文字
- **WHEN** 使用者在暗色模式下選取文字
- **THEN** 選取背景使用暗色模式對應的 accent-subtle 值

### Requirement: focus-visible 鍵盤焦點
表單元素 SHALL 使用 `:focus-visible` 而非 `:focus` 顯示焦點環，避免滑鼠點擊時出現焦點環。

#### Scenario: 滑鼠點擊 textarea 不顯示焦點環
- **WHEN** 使用者以滑鼠點擊 `.edit-textarea`
- **THEN** 不顯示自訂焦點環樣式

#### Scenario: 鍵盤 Tab 到 textarea 顯示焦點環
- **WHEN** 使用者以鍵盤 Tab 導覽到 `.edit-textarea`
- **THEN** 顯示 `outline` 焦點環樣式

### Requirement: 連結底線策略
行內文字連結 SHALL 預設無底線，hover 時顯示 `text-decoration: underline`。導覽類連結（nav pill、tab、按鈕式連結）不加底線。

#### Scenario: 行內連結預設無底線
- **WHEN** 頁面載入包含行內文字連結（如 `.map-link`）
- **THEN** 連結無 `text-decoration: underline`

#### Scenario: 行內連結 hover 顯示底線
- **WHEN** 使用者 hover 行內文字連結
- **THEN** 連結顯示 `text-decoration: underline`

### Requirement: 色彩對比達 WCAG AA
所有文字與背景的色彩對比 SHALL 達到 WCAG AA 標準（一般文字 4.5:1、大字 3:1）。

#### Scenario: accent 色在白底對比度
- **WHEN** accent 色用於白色背景上的文字
- **THEN** 對比度 ≥ 4.5:1

### Requirement: JS 語意命名
公開函式 SHALL 使用完整語意命名，禁止縮寫。

#### Scenario: fmtDuration 重命名
- **WHEN** 程式碼中使用 duration 格式化函式
- **THEN** 函式名為 `formatDuration`，不是 `fmtDuration`
