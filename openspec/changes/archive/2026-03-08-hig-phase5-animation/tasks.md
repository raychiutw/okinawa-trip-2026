## 1. css/shared.css 動畫替換

- [x] 1.1 `.container` 的 `transition` 曲線從 `cubic-bezier(0.4, 0, 0.2, 1)` 改為 `var(--ease-apple)`，duration 改為 `var(--duration-slow)`
- [x] 1.2 `.nav-close-btn` 的 `transition` duration 改為 `var(--duration-fast)`

## 2. css/style.css 動畫替換

- [x] 2.1 `.info-sheet-backdrop` 的 `transition` duration 改為 `var(--duration-slow)`
- [x] 2.2 `.info-sheet-panel` 的 `transition` 改為 `var(--duration-slow) var(--ease-apple)`
- [x] 2.3 `.speed-dial-backdrop` 的 `transition` duration 改為 `var(--duration-normal)`
- [x] 2.4 `.speed-dial-items` 的 `transition` 改為 `var(--duration-normal) var(--ease-apple)`
- [x] 2.5 `.speed-dial-item` 的 `transition` duration 改為 `var(--duration-fast)`
- [x] 2.6 `.edit-fab` 的 `transition` duration 改為 `var(--duration-normal)`
- [x] 2.7 `.speed-dial-trigger svg` 的 `transition` 改為 `var(--duration-slow) var(--ease-apple)`
- [x] 2.8 hover transition（如 `.col-row:hover`、`.map-link:hover`）的 duration 確認使用 `var(--duration-fast)`

## 3. css/edit.css 動畫替換

- [x] 3.1 `.edit-send-btn` 的 `transition` duration 改為 `var(--duration-normal)`
- [x] 3.2 `.setting-trip-list .trip-btn` 的 `transition` duration 改為 `var(--duration-fast)`

## 4. 驗證

- [x] 4.1 確認 speed dial stagger delay 未被改動
- [x] 4.2 視覺確認 speed dial 開關、bottom sheet 拖拉、container 移動的動畫手感
- [x] 4.3 執行測試確認無 regression
