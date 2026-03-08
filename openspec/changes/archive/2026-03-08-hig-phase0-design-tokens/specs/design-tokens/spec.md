## ADDED Requirements

### Requirement: 背景色 3 階語意命名
`:root` 中 SHALL 定義 3 階背景色：`--bg`（頁面底色）、`--bg-secondary`（卡片/區塊底色）、`--bg-tertiary`（嵌套元素底色）。不得存在 `--white`、`--card-bg`、`--bubble-bg`、`--gray-light` 變數。

#### Scenario: 背景色只有 3 個變數
- **WHEN** 檢查 `:root` 的 CSS 變數
- **THEN** 背景色 SHALL 僅有 `--bg`、`--bg-secondary`、`--bg-tertiary` 三個

#### Scenario: 舊背景變數已移除
- **WHEN** 搜尋全站 CSS
- **THEN** SHALL 不存在 `--white`、`--card-bg`、`--bubble-bg`、`--gray-light` 的定義或引用

### Requirement: accent 衍生色 2 個
`:root` 中 SHALL 定義 `--accent`（品牌色）、`--accent-bg`（帶品牌色的背景）、`--accent-subtle`（最淡的品牌色背景）。不得存在 `--accent-lighter`、`--accent-light`、`--accent-muted` 變數。

#### Scenario: accent 衍生色只有 2 個
- **WHEN** 檢查 `:root` 的 CSS 變數
- **THEN** accent 相關 SHALL 僅有 `--accent`、`--accent-bg`、`--accent-subtle` 三個

#### Scenario: 舊 accent 變數已移除
- **WHEN** 搜尋全站 CSS
- **THEN** SHALL 不存在 `--accent-lighter`、`--accent-light`、`--accent-muted` 的定義或引用

### Requirement: 零同值重複
所有 CSS 變數 SHALL 不存在兩個不同變數名指向相同色值的情況。

#### Scenario: 無重複色值
- **WHEN** 檢查 `:root` 中所有色彩變數
- **THEN** 每個色值 SHALL 最多對應一個變數名

### Requirement: 零外觀命名
所有 CSS 色彩變數 SHALL 以語意（用途）命名，不得以外觀（顏色名稱）命名。不得存在 `--white`、`--gray`、`--gray-light` 變數。

#### Scenario: 無外觀命名變數
- **WHEN** 搜尋全站 CSS
- **THEN** SHALL 不存在 `var(--white)`、`var(--gray)`、`var(--gray-light)` 的引用

### Requirement: text-on-accent 色
`:root` 中 SHALL 定義 `--text-on-accent`，用於 accent 背景上的文字色。

#### Scenario: accent 背景文字使用 token
- **WHEN** 搜尋全站 CSS 中 `background: var(--accent)` 的元素
- **THEN** 其文字色 SHALL 使用 `var(--text-on-accent)` 而非硬編碼 `#fff`

### Requirement: 零硬編碼色值（暗色模式）
`body.dark` 規則中 SHALL 不存在硬編碼的 hex 色值，所有色值 SHALL 透過 CSS 變數引用。

#### Scenario: 暗色模式無硬編碼
- **WHEN** 搜尋 `body.dark` 相關的 CSS 規則
- **THEN** `background`、`color` 等色彩屬性 SHALL 不包含硬編碼 hex 值（`#` 開頭的值）

### Requirement: 字型 token
`:root` 中 SHALL 定義 `--font-system` 變數，值為系統字型堆疊。

#### Scenario: font-system 變數存在
- **WHEN** 載入任何頁面
- **THEN** CSS 變數 `--font-system` SHALL 有定義值

### Requirement: 行距 token
`:root` 中 SHALL 定義 `--lh-tight: 1.2`、`--lh-normal: 1.5`、`--lh-relaxed: 1.7`。

#### Scenario: 行距變數存在
- **WHEN** 檢查 `:root` 的 CSS 變數
- **THEN** `--lh-tight`、`--lh-normal`、`--lh-relaxed` SHALL 皆有定義值

### Requirement: 圓角 token 補齊
`:root` 中 SHALL 新增 `--radius-xs: 4px` 和 `--radius-lg: 16px`。

#### Scenario: 圓角 5 級完整
- **WHEN** 檢查 `:root` 的 CSS 變數
- **THEN** SHALL 存在 `--radius-xs`(4px)、`--radius-sm`(8px)、`--radius-md`(12px)、`--radius-lg`(16px)、`--radius-full`(99px)

### Requirement: 文字色階 token
`:root` 中 SHALL 定義 `--text-tertiary` 和 `--text-quaternary`。`body.dark` 中 SHALL 有對應覆寫。

#### Scenario: 文字 4 階完整
- **WHEN** 檢查 CSS 變數
- **THEN** SHALL 存在 `--text`、`--text-muted`、`--text-tertiary`、`--text-quaternary` 四個變數

### Requirement: 動畫 token
`:root` 中 SHALL 定義 `--ease-apple` 和 `--duration-fast`/`--duration-normal`/`--duration-slow`。

#### Scenario: 動畫變數存在
- **WHEN** 檢查 `:root`
- **THEN** 4 個動畫 token SHALL 皆有定義值

### Requirement: 觸控尺寸 token
`:root` 中 SHALL 定義 `--tap-min: 44px`。

#### Scenario: 觸控尺寸變數存在
- **WHEN** 檢查 `:root`
- **THEN** `--tap-min` SHALL 為 `44px`
