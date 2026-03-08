## Why

前一輪 HIG 修正（12 phases / 286 tasks）建立了 token 系統骨架——11 級字型、色彩 token、觸控目標、毛玻璃 nav、scrollbar token。但第二輪逐行審查發現全站仍有 ~80 處細節違反 Apple HIG：4pt grid 偏離（3/5/6/10/14px 散布各處）、硬編碼 `#fff` 未走 token、互動元素缺 hover transition、毛玻璃風格三頁不一致、color mode preview 硬編碼色碼。同時缺乏自動化測試防止回歸。

## What Changes

- **4pt grid 全面對齊**：~38 處 padding/margin/gap 從 off-grid 值（3/5/6/10/14px）修正為最近的 4 倍數（4/8/12/16/20px），包含 2px micro-spacing 全部上修為 4px
- **Color mode preview token 化**：setting.css 的 9 處硬編碼主題預覽色（#F5F5F5、#1A1816 等）改用 `:root` 定義的 `--cmp-*` token，確保單一來源
- **Icon 尺寸上 4pt grid**：14px → 16px、11px → 12px，共 4 處
- **`#fff` → `var(--text-on-accent)`**：3 處硬編碼白色（driving-stats-badge、edit-send-btn、issue-badge）改用語意 token
- **補齊 hover transition**：5 個互動元素（.dn、.col-row、.map-link、.hw-summary、.trip-error-link）新增 `transition` 宣告
- **毛玻璃一致性**：edit.css 和 setting.css 的 sticky-nav `background: var(--bg)` 移除，讓 shared.css 的 `color-mix` + `backdrop-filter` 生效
- **Active ring 統一**：`.color-mode-card.active` 的 `0 0 0 1px` 改為 `var(--shadow-ring)`（2px）
- **CSS HIG 回歸測試**：新增 `tests/unit/css-hig.test.js`，涵蓋 token discipline、4pt grid、touch targets、visual consistency 四大面向的靜態分析

## Capabilities

### New Capabilities
- `css-hig-compliance-test`: CSS HIG 合規回歸測試——讀取 CSS 原始碼進行靜態分析，自動檢測 token 紀律、4pt grid、觸控目標、視覺一致性違規

### Modified Capabilities
- `design-tokens`: 新增 `--cmp-*` 系列 color mode preview token（6 個）至 `:root`
- `hover-system`: 補齊 5 個互動元素的 hover transition

## Impact

- **CSS**：`css/shared.css`（新增 preview token）、`css/style.css`（~30 處 spacing + transition + `#fff`）、`css/edit.css`（~8 處 spacing + 毛玻璃 + `#fff`）、`css/setting.css`（~5 處 spacing + preview token 引用 + ring 統一 + 毛玻璃）
- **測試**：新增 `tests/unit/css-hig.test.js`
- **無 JS/HTML/JSON 變更**，不影響行程資料或功能邏輯
