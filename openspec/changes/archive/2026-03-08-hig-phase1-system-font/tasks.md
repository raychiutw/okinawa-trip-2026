## 1. 移除 Google Fonts CDN

- [x] 1.1 `index.html`：刪除 Google Fonts 的 `<link rel="preconnect">` 和 `<link href="...css2?family=...">` 標籤
- [x] 1.2 `edit.html`：同上
- [x] 1.3 `setting.html`：同上

## 2. 清理 CSP

- [x] 2.1 `index.html`：CSP `style-src` 移除 `https://fonts.googleapis.com`，移除 `font-src https://fonts.gstatic.com`
- [x] 2.2 `edit.html`：同上
- [x] 2.3 `setting.html`：同上

## 3. 套用系統字型

- [x] 3.1 `css/shared.css`：`body` 的 `font-family` 改為 `var(--font-system)`
- [x] 3.2 `css/style.css`：`.g-icon` 和 `.n-icon` 的 `font-family` 改為 `var(--font-system)`

## 4. 驗證

- [x] 4.1 在 Chrome 確認頁面字型正常渲染、600 字重不是 faux bold
- [x] 4.2 確認 CSP 不再允許外部字型來源
- [x] 4.3 執行測試確認無 regression
