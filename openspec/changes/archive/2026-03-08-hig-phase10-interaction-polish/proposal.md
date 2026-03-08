## Why

Phases 0–9 建立了色彩、字型、圓角、動畫、間距等 token 系統，但互動層仍有多處違反 Apple HIG 原則：按鈕使用 `cursor: pointer`（Apple 不加）、hover 用 `opacity` 而非語意色變化、缺少 `::selection` 品牌色、`:focus` 未改 `:focus-visible`、連結下底線策略不一致、hover 模式不統一、部分色彩對比未達 WCAG AA。此外 JS 有一處縮寫函式名 `fmtDuration` 違反語意命名原則。

## What Changes

- 移除所有 `cursor: pointer`（11 處，涵蓋 shared.css、style.css、edit.css、setting.css）
- hover 的 `opacity` 降低效果（6 處）替換為語意色 `background-color` 或 `color` 變化
- 新增 `::selection` 樣式，使用 accent 色調作為選取高亮
- `edit-textarea:focus` 改為 `:focus-visible`（edit.css）
- 統一 hover 模式：12+ 處改為 `background-color` 變化
- 連結下底線策略：預設移除 `text-decoration`，hover 時顯示 `underline`
- 色彩對比調整：`--text-secondary` 與 `--accent` 色值微調以達 WCAG AA（4.5:1）
- JS 重命名：`fmtDuration()` → `formatDuration()`

## Capabilities

### New Capabilities
- `interaction-polish`: 互動層統一——cursor、hover 模式、selection、focus-visible、連結樣式、色彩對比、函式命名

### Modified Capabilities

## Impact

- 影響檔案：`css/shared.css`、`css/style.css`、`css/edit.css`、`css/setting.css`、`js/app.js`
- 視覺變化：hover 效果從透明度改為色彩漸變，選取文字有品牌色高亮，cursor 不再出現手指圖示
- 不涉及 HTML / JSON 結構變更
