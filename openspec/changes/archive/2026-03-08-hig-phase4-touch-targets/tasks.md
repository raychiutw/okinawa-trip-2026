## 1. nav-h 統一

- [x] 1.1 `css/shared.css`：確認 `--nav-h: 48px`（現為 49px，改為 48px）
- [x] 1.2 `css/edit.css`：移除 `:root { --nav-h: 52px; }` 覆寫

## 2. 按鈕觸控目標擴大

- [x] 2.1 `css/shared.css`：`.nav-close-btn` 的 width/height 從 36px 改為 `var(--tap-min)`（44px）
- [x] 2.2 `css/style.css`：`.sheet-close-btn` 的 width/height 從 36px 改為 `var(--tap-min)`
- [x] 2.3 `css/edit.css`：`.edit-send-btn` 的 width/height 從 36px 改為 `var(--tap-min)`
- [x] 2.4 `css/style.css`：`.nav-action-btn` 新增 `min-height: var(--tap-min)`
- [x] 2.5 `css/style.css`：`.dn` 新增 `min-height: var(--tap-min); min-width: var(--tap-min)`

## 3. 連帶調整

- [x] 3.1 `.sticky-nav` padding 調整以配合新的 nav-h 和按鈕尺寸
- [x] 3.2 `.sheet-header` 間距確認不因 close button 變大而失衡
- [x] 3.3 `.edit-input-toolbar` 確認 send button 變大後排版正常
- [x] 3.4 `.day-header` 確認 nav pill 變大後不超出容器

## 4. 驗證

- [x] 4.1 手機版確認 nav 列視覺正常
- [x] 4.2 手機版確認 bottom sheet header 的 close button 可輕鬆點擊
- [x] 4.3 手機版確認 edit 頁 send button 觸控體驗
- [x] 4.4 桌面版確認 info-panel 的 `top: var(--nav-h)` 正確
- [x] 4.5 執行測試確認無 regression
