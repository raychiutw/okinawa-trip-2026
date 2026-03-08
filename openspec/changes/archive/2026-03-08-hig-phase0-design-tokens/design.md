## Context

全站 CSS 變數定義在 `css/shared.css` 的 `:root` 中。色彩系統有嚴重問題：同值重複（`--white`=`--bg`、`--gray`=`--text-muted`）、外觀命名混用、背景 8 階無系統、accent 衍生 3 個角色不明、暗色模式硬編碼色（`#403D3A`）。此外圓角、行距、動畫、觸控尺寸缺少 token。

## Goals / Non-Goals

**Goals:**
- 色彩變數全面語意化，消除同值重複和外觀命名
- 背景色從 8 階收斂為 3 階
- accent 衍生色從 3 個收為 2 個
- 消除暗色模式的硬編碼色值
- 補齊行距、圓角、動畫、觸控尺寸 token
- 完成後視覺應與修改前完全一致（純重構）

**Non-Goals:**
- 不改變任何色值本身（只改名和消除重複）
- 不改變 font-size 系統
- 不套用新增的 token（套用在後續 phase）

## Decisions

1. **色彩改名對照表**：

   | 舊變數 | 新變數 | 原因 |
   |--------|--------|------|
   | `--white` | 刪除 → `--bg` | 同值重複，且 #FAF9F5 不是白色 |
   | `--gray` | 刪除 → `--text-muted` | 同值重複 |
   | `--gray-light` | 刪除 → `--bg-secondary` | 角色重複 |
   | `--card-bg` | → `--bg-secondary` | 語意命名 |
   | `--bubble-bg` | → `--bg-tertiary` | 語意命名 |
   | `--accent-lighter` | → `--accent-subtle` | 消除 lighter/light 歧義 |
   | `--accent-light` | → `--accent-bg` | 帶品牌色的背景 |
   | `--accent-muted` | 刪除 → `--accent-bg` | 與 accent-light 色差僅 3%，合併 |
   | 新增 | `--text-on-accent` | accent 背景上的文字色 #FFFFFF |

2. **`--accent-muted` 合併決策**：#F5EDE0 與 #F5EDE8 的 RGB 差值僅 Δ8/255（3%），肉眼不可分辨。原本使用 `--accent-muted` 的 `.status-tag.pending` 改用 `--accent-bg`。

3. **暗色模式硬編碼清除**：`body.dark .tl-card { background: #403D3A }` → `var(--bg-tertiary)`。`body.dark .hw-block { background: var(--hover-bg) }` 語意不對 → 改用 `var(--bg-secondary)`。

4. **JS 中的 `--gray` 引用**：`js/app.js` 和 `js/setting.js` 各 1 處 inline style 引用 `var(--gray)` → 改為 `var(--text-muted)`。

5. **全站搜尋替換順序**：先在 `:root` 和 `body.dark` 中改名 → 再全站替換引用 → 最後刪除舊變數。確保每一步都可驗證。

6. **新 token 定義**：
   - `--font-system: -apple-system, BlinkMacSystemFont, "PingFang TC", "Noto Sans TC", "Microsoft JhengHei", sans-serif`
   - `--lh-tight: 1.2; --lh-normal: 1.5; --lh-relaxed: 1.7`
   - `--radius-xs: 4px; --radius-lg: 16px`
   - `--text-tertiary: #9B9B9B; --text-quaternary: #C0C0C0`（dark: `#6B6B6B` / `#4A4A4A`）
   - `--ease-apple: cubic-bezier(0.2, 0.8, 0.2, 1)`
   - `--duration-fast: 150ms; --duration-normal: 250ms; --duration-slow: 350ms`
   - `--tap-min: 44px`
   - `--text-on-accent: #FFFFFF`

## Risks / Trade-offs

- [大量重命名] → 影響 4 個 CSS 檔 + 2 個 JS 檔，需要精確的搜尋替換。用 `replace_all` 降低遺漏風險。
- [--accent-muted 合併] → `.status-tag.pending` 的背景色會從 #F5EDE0 變為 #F5EDE8（Δ8），不可見差異。
- [--gray-light 合併到 --bg-secondary] → 需確認 `--gray-light` 的所有使用場景都能用 `--bg-secondary` 替代。目前 `--gray-light` 用在 setting 頁的 `.color-mode-card` 背景和 print mode，值 #EDEBE8 會變為 #F5F0E8（`--bg-secondary` = 舊 `--card-bg`），色差 Δ略大，需視覺確認。
