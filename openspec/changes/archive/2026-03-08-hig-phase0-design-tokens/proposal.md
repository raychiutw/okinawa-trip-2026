## Why

全站 CSS 色彩系統有嚴重的結構性問題：同值重複（`--white`=`--bg`、`--gray`=`--text-muted`）、外觀命名與語意命名混用、背景色多達 8 階卻缺乏系統、accent 衍生色 3 個但角色不明、暗色模式有硬編碼色值。此外，圓角、行距、動畫曲線、觸控尺寸等 token 也散落硬編碼。

本 phase 全面重建 design token 基礎：色彩語意化 + 補齊缺失 token，為後續 7 個 phase 奠定基礎。

## What Changes

- **色彩重構**：重新命名所有色彩變數為語意命名，消除同值重複，背景色收斂為 3 階，accent 衍生色收為 2 個，新增 `--text-on-accent`，消除所有硬編碼色值
  - 淘汰：`--white`、`--gray`、`--gray-light`、`--accent-muted`
  - 改名：`--card-bg` → `--bg-secondary`、`--bubble-bg` → `--bg-tertiary`、`--accent-lighter` → `--accent-subtle`、`--accent-light` → `--accent-bg`
  - 新增：`--text-on-accent: #FFFFFF`
- **Token 補齊**（新增但不套用）：
  - `--font-system`：系統字型堆疊
  - `--lh-tight` / `--lh-normal` / `--lh-relaxed`：3 級行距
  - `--radius-xs` / `--radius-lg`：補齊圓角 token
  - `--text-tertiary` / `--text-quaternary`：第三、第四階文字色
  - `--ease-apple` / `--duration-fast` / `--duration-normal` / `--duration-slow`：動畫 token
  - `--tap-min`：最小觸控目標尺寸
- dark mode（`body.dark`）同步更新所有重命名變數和新增色值
- 全站 CSS + JS 中所有引用舊變數名的地方同步更新

## Capabilities

### New Capabilities
- `design-tokens`: 建立統一的 CSS design token 變數系統，涵蓋色彩語意化、字型、行距、圓角、文字色階、動畫、觸控尺寸

### Modified Capabilities

## Impact

- 影響檔案：`css/shared.css`、`css/style.css`、`css/edit.css`、`css/setting.css`、`js/app.js`、`js/setting.js`
- 色彩重構影響範圍大（所有引用舊變數名的地方），但是純重命名，視覺不應有任何變化
- 不涉及 HTML / JSON 結構變更
