## ADDED Requirements

### Requirement: Token discipline 靜態分析
系統 SHALL 提供 Vitest 測試（`tests/unit/css-hig.test.js`），讀取 CSS 原始碼靜態分析 token 使用紀律。

#### Scenario: 無硬編碼 transition duration
- **WHEN** 靜態分析 `css/style.css`、`css/edit.css`、`css/setting.css` 中 `transition:` 屬性值
- **THEN** 不得出現 `0.1s`、`0.15s`、`0.2s`、`0.3s`、`150ms`、`250ms`、`350ms` 等硬編碼 duration，MUST 使用 `var(--duration-fast/normal/slow)`
- **EXCEPTION** `:root` / `body.dark` 的 token 定義區塊除外

#### Scenario: 無硬編碼 #fff 在互動/accent 上下文
- **WHEN** 靜態分析全站 CSS
- **THEN** 在 accent 背景色元素中使用的白色文字 SHALL 為 `var(--text-on-accent)` 而非 `#fff` / `#FFF` / `#ffffff`
- **EXCEPTION** 品牌色上下文（`.g-icon`、`.n-icon`）、print mode、`:root` / `body.dark` token 定義除外

#### Scenario: font-size 使用 token
- **WHEN** 靜態分析全站 CSS 的 `font-size:` 屬性
- **THEN** 值 MUST 為 `var(--fs-*)` 或相對單位（em/rem/%），不得出現硬編碼 px 值
- **EXCEPTION** `:root` token 定義除外

---

### Requirement: 4pt grid 靜態分析
系統 SHALL 靜態分析 CSS 中的 padding、margin、gap 屬性值，確認 px 值為 4 的倍數或 0。

#### Scenario: padding 值符合 4pt grid
- **WHEN** 靜態分析全站 CSS 的 `padding` 相關屬性
- **THEN** 所有 px 值 MUST 為 0 或 4 的倍數（4、8、12、16、20、24...）

#### Scenario: margin 值符合 4pt grid
- **WHEN** 靜態分析全站 CSS 的 `margin` 相關屬性
- **THEN** 所有 px 值 MUST 為 0 或 4 的倍數

#### Scenario: gap 值符合 4pt grid
- **WHEN** 靜態分析全站 CSS 的 `gap` 屬性
- **THEN** 所有 px 值 MUST 為 0 或 4 的倍數

#### Scenario: allow-list 排除合理例外
- **WHEN** 遇到以下情境
- **THEN** SHALL 跳過不檢查：`:root`/`body.dark` token 定義、`var(--*)` 引用、相對單位（em/rem/%/vw/vh/dvh）、`@media print`/`.print-mode` 區塊、scrollbar/sheet-handle 等裝飾元素的 border-radius

---

### Requirement: 視覺一致性靜態分析
系統 SHALL 靜態分析 CSS 確認全站視覺一致性。

#### Scenario: sticky-nav 使用毛玻璃背景
- **WHEN** 靜態分析 `.sticky-nav` 的 `background` 屬性
- **THEN** 不得出現 solid `var(--bg)` 或 `rgba(` 值，MUST 使用 `color-mix` 或繼承 shared.css 的定義
- **EXCEPTION** `.print-mode .sticky-nav` 除外

#### Scenario: color mode preview 使用 token
- **WHEN** 靜態分析 `.color-mode-light`、`.color-mode-dark`、`.color-mode-auto` 相關規則
- **THEN** background 值 MUST 使用 `var(--cmp-*)` token，不得出現 `#F5F5F5`、`#1A1816` 等硬編碼色碼

#### Scenario: active ring 使用統一 token
- **WHEN** 靜態分析含有 `box-shadow: 0 0 0` 的 active/focus 規則
- **THEN** SHALL 使用 `var(--shadow-ring)` 而非硬編碼 `0 0 0 Npx var(--accent)`
