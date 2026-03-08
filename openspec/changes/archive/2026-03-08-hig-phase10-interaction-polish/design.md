## Context

Phases 0–9 完成 design token 基礎與視覺層統一後，互動層仍存在多處 Apple HIG 違規：cursor 手指圖示、opacity hover、缺 selection 樣式、focus 策略、連結底線不一致、色彩對比不足，以及一處 JS 縮寫命名。

## Goals / Non-Goals

**Goals:**
- 全站移除 `cursor: pointer`，遵循 Apple 原生不加手指的慣例
- hover 效果從 `opacity` 改為語意色變化（背景色或文字色）
- 新增 `::selection` 品牌色高亮
- `:focus` 改為 `:focus-visible`，鍵盤導覽才顯示焦點環
- 統一連結底線策略：預設無底線，hover 時顯示
- 色彩微調達 WCAG AA 對比度（4.5:1）
- `fmtDuration` → `formatDuration` 語意命名

**Non-Goals:**
- 不調整動畫曲線或 duration（Phase 5 範圍）
- 不修改 font-size / line-height（Phase 8 / Phase 2 範圍）
- 不重構 JS 架構，僅重命名函式

## Decisions

### 1. cursor: pointer 全面移除
Apple HIG 中按鈕不加 pointer cursor，只有超連結才用。本專案所有互動元素（按鈕、FAB、卡片行）直接刪除 `cursor: pointer`，包含深色模式 toggle 也一併處理。

### 2. hover opacity → 語意色
`opacity: 0.7` 等降透明度效果改為：
- 按鈕類：`background-color` 加深（使用 `var(--bg-secondary)` 或 `color-mix()`）
- 文字連結類：`color` 改用 `var(--accent)` 或加深色

### 3. ::selection 使用 accent-subtle
選取高亮使用 `var(--accent-subtle)` 背景 + `var(--text-primary)` 文字，在亮暗模式下都能辨識。

### 4. focus → focus-visible
僅 `edit-textarea` 的 `:focus` 改為 `:focus-visible`。其他元素若已使用 `:focus-visible` 則不動。

### 5. 連結底線策略
`a` 標籤預設 `text-decoration: none`（已在 shared.css reset），行內文字連結 hover 時加 `text-decoration: underline`。導覽類連結（nav、pill、tab）不加底線。

### 6. 色彩對比微調
`--text-secondary`（目前 `--gray` = `#6B6B6B`）在白底需 4.5:1，`#6B6B6B` 已達 5.36:1 無需調整。`--accent`（`#C4704F`）在白底為 3.8:1，調整為 `#B5623F`（≈4.6:1）以達 AA。

### 7. fmtDuration → formatDuration
在 `js/app.js` 中函式定義和所有呼叫點重命名，grep 全站確認無遺漏。

## Risks / Trade-offs

- [移除 cursor: pointer 後使用者可能不知道元素可點擊] → 搭配 hover 背景色變化補償可發現性
- [accent 色值調整影響品牌色感受] → 僅微調 ΔE<5，肉眼幾乎不可辨
- [::selection 在部分瀏覽器有限制] → WebKit/Blink/Firefox 都支援，相容性無虞
