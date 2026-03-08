## 1. Safe Area 支援

- [x] 1.1 `index.html`：viewport meta 加入 `viewport-fit=cover`
- [x] 1.2 `edit.html`：viewport meta 加入 `viewport-fit=cover`
- [x] 1.3 `setting.html`：viewport meta 加入 `viewport-fit=cover`
- [x] 1.4 `css/shared.css` `.sticky-nav`：padding 加入 `env(safe-area-inset-top/left/right)` 使用 `max()` 函數
- [x] 1.5 `css/style.css` FAB（`.fab-link`）：bottom 加入 `env(safe-area-inset-bottom)`
- [x] 1.6 `css/style.css` Speed Dial（`.speed-dial`）：bottom 加入 `env(safe-area-inset-bottom)`
- [x] 1.7 `css/style.css` Bottom Sheet（`.info-sheet-panel`）：padding-bottom 加入 `env(safe-area-inset-bottom)`
- [x] 1.8 `css/style.css` `.day-content`：padding-left/right 加入 `env(safe-area-inset-left/right)`
- [x] 1.9 `css/style.css` `footer`：padding-bottom 加入 `env(safe-area-inset-bottom)`

## 2. 毛玻璃導覽列

- [x] 2.1 `css/shared.css` `.sticky-nav`：background 改為 `rgba(250, 249, 245, 0.85)` + 加入 `backdrop-filter: saturate(180%) blur(20px)` 和 `-webkit-backdrop-filter`
- [x] 2.2 `css/style.css` `body.dark .sticky-nav`：background 改為 `rgba(26, 26, 26, 0.85)`

## 3. 統一水平邊距

- [x] 3.1 `css/shared.css` `:root`：新增 `--padding-h: 16px`
- [x] 3.2 `css/shared.css` `@media (min-width: 768px)`：覆寫 `--padding-h: 20px`
- [x] 3.3 `css/shared.css` `.sticky-nav`：padding-left/right 改為 `var(--padding-h)`
- [x] 3.4 `css/style.css` `.day-content`：padding-left/right 改為 `var(--padding-h)`
- [x] 3.5 `css/style.css` `.info-sheet-panel`：padding-left/right 改為 `var(--padding-h)`
- [x] 3.6 `css/edit.css` `.chat-messages`：padding-left/right 改為 `var(--padding-h)`
- [x] 3.7 `css/setting.css` `.container`：padding 改為使用 `var(--padding-h)`

## 4. 深淺模式過渡動畫

- [x] 4.1 `css/shared.css` `body`：加入 `transition: background-color 0.3s ease, color 0.3s ease`
- [x] 4.2 確認三頁 HTML 的 `<head>` inline script 在 body 建立前設定 dark class（避免初次載入閃爍）

## 5. 驗證

- [x] 5.1 確認三頁 viewport meta 皆含 `viewport-fit=cover`
- [x] 5.2 確認 `.sticky-nav` 有 `backdrop-filter` 和 `-webkit-backdrop-filter`
- [x] 5.3 確認 `--padding-h` 在 `:root` 中定義且 768px+ 覆寫為 20px
- [x] 5.4 確認切換深淺模式有平滑過渡效果
- [x] 5.5 視覺確認淺色/深色模式三頁版面正常
- [x] 5.6 執行測試確認無 regression
