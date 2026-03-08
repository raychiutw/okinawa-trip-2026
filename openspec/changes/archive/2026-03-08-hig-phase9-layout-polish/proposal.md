## Why

全站缺乏 Apple HIG 要求的四項關鍵版面特性：(1) 完全沒有 safe area inset 支援，iPhone X 以後的瀏海/動態島裝置上內容會被遮擋；(2) 導覽列是純色背景，缺少 Apple 標誌性的毛玻璃（backdrop-filter blur）效果；(3) 水平邊距在各元件間不一致（8px/12px/16px/24px 混用），不符合 Apple compact 16px / regular 20px 的統一規範；(4) 深淺模式切換是瞬間跳變，缺少平滑過渡動畫。

## What Changes

- **Safe area 支援**：所有三頁 HTML 的 viewport meta 加入 `viewport-fit=cover`，CSS 中在 sticky nav、FAB、speed dial、bottom sheet、水平邊距等加入 `env(safe-area-inset-*)` padding
- **毛玻璃導覽列**：`.sticky-nav` 加入 `backdrop-filter: saturate(180%) blur(20px)` + 半透明背景色，深色模式同步調整
- **統一水平邊距**：新增 `--padding-h: 16px`（compact）、桌面版覆寫為 `20px`（regular），全站水平邊距統一引用此 token
- **深淺模式過渡動畫**：`body` 加入 `transition: background-color 0.3s, color 0.3s`，確保切換時平滑淡入淡出

## Capabilities

### New Capabilities
- `safe-area-insets`: 支援 iPhone 瀏海/動態島/home indicator 的安全區域，所有邊緣元素加入 safe area padding
- `vibrancy-nav`: 導覽列毛玻璃效果（backdrop-filter blur + 半透明背景）
- `horizontal-padding`: 統一全站水平邊距 token（compact 16px / regular 20px）
- `dark-mode-transition`: 深淺模式切換平滑過渡動畫

### Modified Capabilities

## Impact

- 影響檔案：`index.html`、`edit.html`、`setting.html`（viewport meta）、`css/shared.css`、`css/style.css`、`css/edit.css`、`css/setting.css`
- 不涉及 JS / JSON 結構變更
- `backdrop-filter` 在舊版瀏覽器（IE、舊 Firefox）無效，但本站目標為現代瀏覽器
- safe area inset 僅在實際有瀏海的裝置上生效，一般裝置上 `env()` fallback 為 0
