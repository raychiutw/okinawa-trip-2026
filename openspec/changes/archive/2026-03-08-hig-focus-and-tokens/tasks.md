## 1. Overlay token 新增

- [x] 1.1 `css/shared.css` `:root`：新增 `--overlay: rgba(0,0,0,0.3)`
- [x] 1.2 `css/shared.css` `body.dark`：新增 `--overlay: rgba(0,0,0,0.55)`

## 2. Backdrop overlay token 化

- [x] 2.1 `css/style.css`：`.speed-dial-backdrop` background 從 `rgba(0,0,0,0.3)` 改為 `var(--overlay)`
- [x] 2.2 `css/style.css`：`body.dark .speed-dial-backdrop` background 從 `rgba(0,0,0,0.55)` 改為 `var(--overlay)`
- [x] 2.3 `css/style.css`：`.info-sheet-backdrop` background 從 `rgba(0,0,0,0.3)` 改為 `var(--overlay)`
- [x] 2.4 `css/style.css`：`body.dark .info-sheet-backdrop` background 從 `rgba(0,0,0,0.55)` 改為 `var(--overlay)`

## 3. Dark mode sticky-nav 邊框 color-mix 化

- [x] 3.1 `css/style.css`：`body.dark .sticky-nav` border-bottom-color 從 `rgba(255,255,255,0.15)` 改為 `color-mix(in srgb, var(--text-on-accent) 15%, transparent)`

## 4. Focus-visible 通用規則

- [x] 4.1 `css/shared.css`：將 `button:focus-visible { outline: none; }` 改為 `button:focus-visible { outline: none; box-shadow: var(--shadow-ring); }`

## 5. Pseudo-element 4pt grid 修正

- [x] 5.1 `css/style.css`：`.sg-priority-high h4::before, .sg-priority-medium h4::before, .sg-priority-low h4::before` margin-right 從 `6px` 改為 `8px`
- [x] 5.2 `css/style.css`：`.sheet-handle` height 從 `5px` 改為 `4px`
- [x] 5.3 `css/style.css`：`.sheet-handle` border-radius 從 `3px` 改為 `var(--radius-full)`

## 6. CSS HIG 測試擴充

- [x] 6.1 `tests/unit/css-hig.test.js`：新增測試「button:focus-visible 有 box-shadow 替代」— 驗證任何含 `outline: none` 的 `:focus-visible` 規則都有 `box-shadow`（排除 form input）
- [x] 6.2 `tests/unit/css-hig.test.js`：新增測試「backdrop 選擇器不含硬編碼 rgba(0,0,0,」— 驗證 backdrop/overlay 相關選擇器使用 token
- [x] 6.3 `tests/unit/css-hig.test.js`：新增測試「pseudo-element spacing allow-list 外的值符合 4pt grid」— 驗證 `::before`/`::after` 的 margin/padding 也在 4pt grid 上（排除 width/height 裝飾尺寸）

## 7. 驗證

- [x] 7.1 執行 `npm test` 確認全部通過（含新測試 + 既有 569 tests）→ 581 tests all passed
