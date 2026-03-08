## Why

經過 14 輪 HIG 打磨後，全站視覺品質已達 100%。但代碼本身仍有技術債：未使用的 CSS token、冗餘的 dark mode 覆寫、重複宣告、JS magic number、以及每次頁面載入都掃描整個 localStorage 的效能問題。這些問題不影響使用者體驗但拖累可維護性與效能。

## What Changes

### CSS 清理
- 移除未使用的 CSS variables：`--shadow-sm`、`--text-tertiary`、`--text-quaternary`（含 `body.dark` 中的覆寫）
- **保留** `--fs-title`、`--fs-caption2`（Apple text style 完整體系）
- 移除 4 條冗餘的 `body.dark` 覆寫（值與 base 完全相同）
- 合併 `.trip-error-link` 重複宣告
- 提取 `.sticky-nav` 居中佈局的共用 class

### JS 清理
- 抽出 `MS_PER_DAY = 86400000` 常數，取代 3 處 magic number
- `lsRenewAll()` 加每日一次防護，避免每次頁面載入都掃描
- `initAria()` 補完 `aria-expanded` 在展開/收合時的狀態更新

### 文件修正
- 更正 `CLAUDE.md` 中 `menu.js` 的記載（該檔案不存在）

## Capabilities

### New Capabilities
- `css-dead-code-removal`: 移除未使用的 CSS token 與冗餘覆寫
- `js-constants-and-perf`: JS 常數化與效能防護

### Modified Capabilities
（無）

## Impact

- **CSS 檔案**：`css/shared.css`（移除 token）、`css/style.css`（移除冗餘覆寫 + 合併重複宣告）
- **JS 檔案**：`js/app.js`（常數 + lsRenewAll 防護 + aria 更新）、`js/shared.js`（lsRenewAll 可能調整）
- **文件**：`CLAUDE.md`（修正 menu.js 記載）
- **無 HTML / JSON 變更**
- **無破壞性變更**
