## Why

經過三輪 HIG 審查（286+ 項修正），全站 CSS 在 4pt grid、字型 token、transition token、毛玻璃一致性上已達 98%+。但最後一輪賈伯斯級審查發現三類殘留問題：

1. **Focus-visible 缺口**：`shared.css` 的 `button:focus-visible { outline: none }` 移除了所有按鈕預設 focus ring，但僅 3 個元素加回自訂 focus 樣式，導致 8+ 個互動元素在鍵盤導航時完全看不到 focus 狀態 — Apple Accessibility Guidelines 硬性違規
2. **Backdrop overlay rgba 未 token 化**：`rgba(0,0,0,0.3)` / `rgba(0,0,0,0.55)` 散佈 4 處，加上 dark mode sticky-nav 邊框的 `rgba(255,255,255,0.15)` 和 flag-num 的 `rgba(255,255,255,0.25)`
3. **Pseudo-element 微間距**：3 個 `::before` / 裝飾元素的 px 值不在 4pt grid 上

## What Changes

- **Focus-visible 紀律**：為所有缺少 focus ring 的互動元素加上 `box-shadow: var(--shadow-ring)` focus-visible 樣式（8 個按鈕 + 2 個連結）
- **Backdrop token 化**：新增 `--overlay-backdrop` / `--overlay-backdrop-dark` token，統一所有 backdrop 遮罩色彩
- **Border overlay token 化**：將 dark mode sticky-nav 的 `rgba(255,255,255,0.15)` 改為 `color-mix` 或 token
- **Flag-num overlay**：`rgba(255,255,255,0.25)` 改為語義化寫法
- **Pseudo-element 4pt 修正**：`.sg-priority-* h4::before` margin-right 6→8px、`.sheet-handle` height 5→4px / border-radius 改 `var(--radius-full)`
- **CSS HIG 測試擴充**：新增 focus-visible 紀律測試 + pseudo-element spacing 測試 + backdrop token 化測試

## Capabilities

### New Capabilities
- `focus-visible-discipline`: 所有互動元素的鍵盤 focus 可見性保證
- `overlay-tokens`: backdrop 遮罩與半透明覆蓋的 token 化

### Modified Capabilities
- `design-tokens`: 新增 overlay 相關 token 定義

## Impact

- **CSS 檔案**：`css/shared.css`（token 定義 + focus-visible 基礎）、`css/style.css`（focus-visible + backdrop + pseudo-element 修正）、`css/edit.css`（focus-visible 修正）、`css/setting.css`（focus-visible 修正）
- **測試**：`tests/unit/css-hig.test.js`（新增 3+ 項測試）
- **無 JS / HTML / JSON 變更**
