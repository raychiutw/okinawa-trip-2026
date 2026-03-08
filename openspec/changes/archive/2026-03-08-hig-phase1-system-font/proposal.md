## Why

目前透過 Google Fonts CDN 載入 Noto Sans TC（僅 400/700 兩個字重），全站大量使用的 `font-weight: 600` 實際上是瀏覽器合成粗體（faux bold），中文字渲染品質差。改用系統字型堆疊可同時解決：faux bold 問題、外部 CDN 依賴、載入效能。

## What Changes

- 3 個 HTML 檔案（index/edit/setting）移除 Google Fonts 的 `<link>` 標籤和 `<link rel="preconnect">`
- 3 個 HTML 檔案的 CSP `style-src` 移除 `https://fonts.googleapis.com`，`font-src` 移除 `https://fonts.gstatic.com`
- `css/shared.css` 的 `body` 改用 `var(--font-system)`
- `css/style.css` 中 `.g-icon` / `.n-icon` 的 `font-family` 改用 `var(--font-system)`

## Capabilities

### New Capabilities
- `system-font-stack`: 系統字型堆疊遷移，移除外部字型 CDN 依賴

### Modified Capabilities

## Impact

- 影響檔案：`index.html`、`edit.html`、`setting.html`、`css/shared.css`、`css/style.css`
- 視覺變化：每個平台會使用該平台的最佳 CJK 字型（Apple → PingFang TC、Android → Noto Sans CJK、Windows → 微軟正黑體）
- 效能提升：省去外部字型載入（CJK 字型約 1.5MB+ 的網路傳輸）
- 不涉及 JS / JSON 結構變更
