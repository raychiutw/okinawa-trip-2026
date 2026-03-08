## Context

全站已完成色彩 token（Phase 0）、字型（Phase 1）、行距（Phase 2）、圓角（Phase 3）、觸控（Phase 4）、動畫（Phase 5）、文字層級（Phase 6）、間距（Phase 7）、字級（Phase 8）的 Apple HIG 對齊。但版面佈局層面仍有 4 個缺陷：無 safe area 支援、導覽列無毛玻璃效果、水平邊距不一致、深淺模式瞬間切換。

## Goals / Non-Goals

**Goals:**
- 全站支援 iPhone 瀏海/動態島/home indicator 的 safe area
- 導覽列加入 Apple 標誌性的毛玻璃效果
- 統一全站水平邊距為 compact 16px / regular 20px
- 深淺模式切換加入平滑過渡動畫

**Non-Goals:**
- 不重新設計導覽列的功能或佈局
- 不改變 info-panel 的寬度或顯示邏輯
- 不加入 split view 或多欄 responsive 佈局
- 不處理 print mode 的版面

## Decisions

1. **Safe area 實作策略**：

   a. 三頁 HTML 的 `<meta name="viewport">` 加入 `viewport-fit=cover`：
   ```html
   <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
   ```

   b. CSS 受影響元素使用 `env(safe-area-inset-*)` + fallback：
   ```css
   .sticky-nav {
       padding-top: max(8px, env(safe-area-inset-top));
       padding-left: max(12px, env(safe-area-inset-left));
       padding-right: max(12px, env(safe-area-inset-right));
   }
   ```

   c. 受影響元素清單：
   - `.sticky-nav`：top + left + right inset
   - `.speed-dial`、FAB：bottom + right inset
   - `.info-sheet-panel`：bottom inset（sheet 底部安全距離）
   - `.day-content`：left + right inset
   - `footer`：bottom inset

2. **毛玻璃導覽列**：

   ```css
   .sticky-nav {
       background: rgba(250, 249, 245, 0.85);
       backdrop-filter: saturate(180%) blur(20px);
       -webkit-backdrop-filter: saturate(180%) blur(20px);
   }
   body.dark .sticky-nav {
       background: rgba(26, 26, 26, 0.85);
   }
   ```

   選擇 `saturate(180%) blur(20px)` 而非單純 `blur(10px)`——Apple 的標準 bar 效果包含飽和度增強，讓背景色彩更鮮明。

3. **統一水平邊距 token**：

   新增 CSS 變數：
   ```css
   :root { --padding-h: 16px; }
   @media (min-width: 768px) {
       :root { --padding-h: 20px; }
   }
   ```

   全站替換：
   - `.sticky-nav` padding-left/right → `var(--padding-h)`
   - `.day-content` padding-left/right → `var(--padding-h)`
   - `.info-sheet-panel` padding-left/right → `var(--padding-h)`
   - edit.css `.chat-messages` padding → `var(--padding-h)`
   - setting.css `.container` padding → `var(--padding-h)`

4. **深淺模式過渡動畫**：

   ```css
   body {
       transition: background-color 0.3s ease, color 0.3s ease;
   }
   ```

   不在 `:root` 或 `*` 上加 transition（效能問題），只在 `body` 上加。卡片和其他元素透過 CSS 變數繼承自然獲得漸變效果。如果部分元素因使用硬編碼色值而不跟隨，Phase 0 色彩重構已解決此問題。

## Risks / Trade-offs

- [`viewport-fit=cover`] → 改變 viewport 行為，所有邊緣元素必須加 safe area padding 否則被遮擋。已列出完整元素清單。
- [`backdrop-filter`] → 舊版 Firefox（< 103）不支援，但本站目標為現代瀏覽器，且 graceful degradation 為不透明背景
- [body transition] → 初次載入時如果暗色模式是透過 JS class 添加，可能會閃爍。解法：在 `<head>` 的 inline script 中提前設定 `body.dark`，避免 transition 觸發
- [`--padding-h` 統一] → 現有 `12px` 水平邊距的元素會擴大到 `16px`，版面會略寬鬆
