## Context

前一輪 HIG 修正已建立完整的 token 架構（11 級字型、色彩語意 token、duration token、radius token、touch target token）。本輪處理第二輪審查發現的 ~80 處細節違規——主要是 spacing off-grid、少量硬編碼色碼、互動回饋缺失、毛玻璃不一致——並新增自動化測試防止回歸。

## Goals / Non-Goals

**Goals:**
- 全站 CSS spacing 100% 對齊 4pt grid（包含 2px micro-spacing）
- 消除非 token 硬編碼色碼（`#fff` → `var(--text-on-accent)`）
- Color mode preview 色碼 token 化（`--cmp-*` 系列）
- Icon 尺寸對齊 4pt grid（14→16, 11→12）
- 所有互動元素有 hover transition
- 三頁 nav bar 毛玻璃風格統一
- 新增 CSS HIG 回歸測試

**Non-Goals:**
- 不修改 print mode 硬編碼色碼（列印有獨立需求）
- 不修改 Google/Naver 品牌色碼（外部品牌識別）
- 不修改 scrollbar border-radius 3px（與 6px 寬度成正比的裝飾性質）
- 不涉及 JS/HTML 功能變更

## Decisions

### D1: 4pt grid 對齊方向

| 現值 | 方向 | 理由 |
|------|------|------|
| 2px | → 4px | 最小 grid 單位 |
| 3px | → 4px | 向上取最近倍數 |
| 5px | → 4px | 向下保持緊湊 |
| 6px | → 8px | 向上，避免過緊湊 |
| 10px | → 12px | 向上，多數為 section spacing |
| 14px | → 16px | 向上，padding 類常見值 |

**替代方案**：6px → 4px。但 6px 常出現在 gap/margin 位置，4px 會導致元素過於擁擠。8px 更平衡。

### D2: Color mode preview token 命名

在 `:root` 新增 6 個 token，命名空間 `--cmp-`（color mode preview）：

```
--cmp-light-bg: #F5F5F5
--cmp-light-surface: #FFFFFF
--cmp-light-input: #E0E0E0
--cmp-dark-bg: #1A1816
--cmp-dark-surface: #292624
--cmp-dark-input: #3D3A37
```

**關鍵**：這些 token 不在 `body.dark` 中覆寫——它們代表的是「淺色主題長什麼樣」和「深色主題長什麼樣」的固定預覽，不隨使用者當前主題切換。

**替代方案**：直接在 setting.css 開頭用 CSS custom property 定義。但統一放 `:root`（shared.css）保持 token 單一來源原則。

### D3: 毛玻璃統一策略

edit.css 和 setting.css 都覆寫了 `.sticky-nav` 的 `background: var(--bg)`。移除此覆寫，讓 shared.css 的 `color-mix(in srgb, var(--bg) 85%, transparent)` + `backdrop-filter` 生效。保留 `border-bottom: 1px solid var(--border)` 視覺分隔。

**Setting 頁風險**：Chrome 手機版捲動彈回問題的修正已包含 `position: sticky`、`transition: none`、scroll 中和等措施。`backdrop-filter` 與這些修正不衝突（它不影響 compositing layer 的 scroll 行為）。

### D4: Hover transition 統一策略

所有缺 transition 的互動元素統一加上：
```css
transition: background var(--duration-fast), color var(--duration-fast);
```

特例：`.trip-error-link` 使用 `filter` hover 效果，改為 `transition: filter var(--duration-fast)`。

### D5: CSS HIG 測試架構

使用 Vitest 讀取 CSS 原始碼做字串/regex 靜態分析。不引入 postcss 等外部依賴。

測試結構：
```
tests/unit/css-hig.test.js
├── Token discipline（transition duration、#fff、font-size、scrollbar）
├── 4pt grid（padding/margin/gap 的 px 值）
├── Touch targets（互動元素 min-height）
├── Visual consistency（sticky-nav 背景、shadow-ring）
└── Color mode preview（使用 --cmp-* token）
```

**4pt grid 測試的 allow-list**：
- `:root` / `body.dark` token 定義區塊內的值
- `var(--*)` 引用
- 相對單位（em/rem/%/vw/vh/dvh）
- `0` / `0px`
- `@media print` / `.print-mode` 區塊
- 品牌色碼上下文（.g-icon, .n-icon）
- 明確列舉的裝飾性例外（scrollbar border-radius 3px、sheet-handle border-radius 3px、priority dot 8×8px）

## Risks / Trade-offs

**[視覺微調]** → 4pt grid 對齊可能在某些地方看起來比原本略鬆或略緊。特別是 `2px → 4px` 的 micro-spacing 會讓文字間距稍微增大。但 4pt grid 的整體韻律感會彌補個別位置的差異。

**[Setting 頁毛玻璃]** → 移除 `background: var(--bg)` 後，Chrome 手機版需確認不會重新觸發捲動彈回。若測試發現問題，可單獨保留 setting.css 的 solid background 作為回退。

**[CSS 測試維護成本]** → regex 靜態分析容易產生 false positive。使用 allow-list + 明確的 skip 區塊標記來控制。新增 CSS 規則時需確保符合 HIG 規範，否則測試會擋住 commit。這是刻意的——破窗效應比 false positive 更危險。
