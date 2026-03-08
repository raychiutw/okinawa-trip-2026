### Requirement: focus-visible 移除 outline 時必須提供替代焦點指示

所有 `:focus-visible` 規則中使用 `outline: none` 時 SHALL 同時宣告 `box-shadow: var(--shadow-ring)` 作為替代焦點指示器。

例外：表單輸入元素（`textarea`、`input`、`.edit-textarea`）使用文字游標作為焦點指示，不需 `box-shadow`。

#### Scenario: button focus-visible 有 box-shadow

- **WHEN** 靜態分析所有 CSS 檔案中含 `:focus-visible` 的規則
- **THEN** 若該規則包含 `outline: none` 且選擇器非表單輸入，SHALL 同時包含 `box-shadow` 宣告

#### Scenario: shared.css 提供全局 button focus-visible

- **WHEN** 載入 `css/shared.css`
- **THEN** SHALL 存在 `button:focus-visible { outline: none; box-shadow: var(--shadow-ring); }` 規則

---

### Requirement: backdrop/overlay 使用 --overlay token

所有含 `backdrop` 或 `overlay` 關鍵字的選擇器 SHALL 使用 `var(--overlay)` 作為背景色，不得硬寫 `rgba(0,0,0,...)` 值。

#### Scenario: 無硬寫 backdrop rgba

- **WHEN** 靜態分析所有 CSS 檔案中含 `backdrop` 或 `overlay` 的選擇器（排除 `:root` 與 `body.dark` 定義區塊）
- **THEN** 背景色 SHALL 為 `var(--overlay)`，不得出現 `rgba(0,0,0,...)`

---

### Requirement: sticky-nav 使用 frosted glass 效果

`.sticky-nav` 背景 SHALL 使用 `color-mix(in srgb, var(--bg) 85%, transparent)` 搭配 `backdrop-filter: saturate(180%) blur(20px)` 實現半透明磨砂玻璃效果。不得使用實色 `var(--bg)` 或 `rgba()` 背景。

#### Scenario: sticky-nav 無實色背景

- **WHEN** 靜態分析所有 CSS 檔案中含 `sticky-nav` 的選擇器
- **THEN** 背景 SHALL 不為 `var(--bg)` 實色或 `rgba()` 值

---

### Requirement: dark mode 覆寫不得冗餘

若 base 規則已使用 `var(--token)` 且該 token 在 `body.dark` 中已有覆寫值，則 SHALL NOT 另寫 `body.dark .class { property: var(--token); }` 規則（冗餘，因 token 值已自動切換）。

#### Scenario: 無冗餘 dark mode 覆寫

- **WHEN** 靜態分析所有 CSS 檔案
- **THEN** `body.dark .class` 規則中的屬性值若與 base 規則完全相同（皆為同一 `var(--token)`），該規則 SHALL 被移除

---

### Requirement: color: #fff 改用語意 token

CSS 中 `color: #fff` / `color: #FFF` / `color: #ffffff` SHALL 改為 `color: var(--text-on-accent)`。

例外：brand icon 選擇器（`.g-icon`、`.n-icon`）及 color mode preview（`.cmp-*`）。

#### Scenario: 無硬寫 color: #fff

- **WHEN** 靜態分析所有 CSS 檔案（排除 `:root`、`body.dark`、print mode、brand icon）
- **THEN** 不得出現 `color: #fff` 或等效硬寫值

---

### Requirement: 4pt grid spacing

所有 `margin`、`padding`、`gap` 的 px 值 SHALL 為 4 的倍數。

例外：
- 裝飾性 pseudo-element（`::before`/`::after`）中的 `.ov-card h4::before`、`.cmp-*`
- scrollbar 元素
- `@page` print margin
- 使用 `var()` 或 `calc()` 的值

#### Scenario: padding 值為 4 的倍數

- **WHEN** 靜態分析所有 CSS 檔案中的 `padding` 相關宣告
- **THEN** 所有 px 值 SHALL 為 4 的倍數（0 除外）

#### Scenario: margin 值為 4 的倍數

- **WHEN** 靜態分析所有 CSS 檔案中的 `margin` 相關宣告
- **THEN** 所有 px 值 SHALL 為 4 的倍數（0 除外）

#### Scenario: gap 值為 4 的倍數

- **WHEN** 靜態分析所有 CSS 檔案中的 `gap` 相關宣告
- **THEN** 所有 px 值 SHALL 為 4 的倍數（0 除外）

---

### Requirement: CSS HIG 回歸測試自動守護

`tests/unit/css-hig.test.js` SHALL 包含至少 12 條自動化靜態分析測試，涵蓋上述所有 HIG 紀律規則。每次 CSS 變更須通過所有測試。

#### Scenario: npm test 包含 CSS HIG 測試

- **WHEN** 執行 `npm test`
- **THEN** `css-hig.test.js` 中所有測試 SHALL 通過
