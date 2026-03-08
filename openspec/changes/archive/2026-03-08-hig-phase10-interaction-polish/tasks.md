## 1. css/shared.css 互動修正

- [x] 1.1 `.trip-btn`（行 51）移除 `cursor: pointer`
- [x] 1.2 `.trip-btn:hover`（行 52）的 `opacity: 0.85` 改為 `background: var(--bg-secondary)`
- [x] 1.3 `body.dark .trip-btn:hover`（行 60）的 `opacity: 0.85` 改為 `background: var(--bg-tertiary)`
- [x] 1.4 `.nav-close-btn`（行 71）移除 `cursor: pointer`
- [x] 1.5 新增 `::selection { background: var(--accent-subtle); color: var(--text) }` 規則

## 2. css/style.css 互動修正

- [x] 2.1 `.dn`（行 47）移除 `cursor: pointer`
- [x] 2.2 `.col-row`（行 74）移除 `cursor: pointer`
- [x] 2.3 `.col-row`（行 116）移除 `cursor: pointer`
- [x] 2.4 `.map-link:hover`（行 166）移除 `opacity: 1`
- [x] 2.5 `.trip-error-link:hover`（行 267）的 `opacity: 0.9` 改為 `filter: brightness(1.1)`
- [x] 2.6 `.print-exit-btn`（行 300）移除 `cursor: pointer`
- [x] 2.7 `.hw-summary`（行 336）移除 `cursor: pointer`
- [x] 2.8 `.nav-action-btn`（行 397）移除 `cursor: pointer`
- [x] 2.9 speed-dial 的 `cursor: pointer`（行 408、436）移除
- [x] 2.10 info-sheet close button 的 `cursor: pointer`（行 492）移除
- [x] 2.11 行內連結（`.map-link` 等）確認預設無 `text-decoration`，hover 加 `text-decoration: underline`

## 3. css/edit.css 互動修正

- [x] 3.1 `.edit-send-btn`（行 180）移除 `cursor: pointer`
- [x] 3.2 `.edit-send-btn:not(:disabled):hover`（行 182）的 `opacity: 0.9` 改為 `filter: brightness(1.1)`
- [x] 3.3 `.edit-textarea:focus`（行 153）改為 `.edit-textarea:focus-visible`

## 4. css/setting.css 互動修正

- [x] 4.1 深色模式 toggle 的 `cursor: pointer`（行 68）移除

## 5. 色彩對比調整

- [x] 5.1 `css/shared.css` 的 `--accent` 色值從 `#C4704F` 微調至 `#B5623F`（WCAG AA 4.5:1）
- [x] 5.2 dark mode 的 `--accent` 值同步確認對比度

## 6. JS 語意命名

- [x] 6.1 `js/app.js` 的 `fmtDuration`（行 219）重命名為 `formatDuration`
- [x] 6.2 `js/app.js` 的 `fmtDuration` 呼叫點（行 255）更新為 `formatDuration`
- [x] 6.3 grep 全站確認無遺漏的 `fmtDuration` 引用

## 7. 驗證

- [x] 7.1 全站 grep 確認無殘留 `cursor: pointer`（CSS 檔案中）
- [x] 7.2 全站 grep 確認 hover 規則無 `opacity` 降低效果
- [x] 7.3 執行測試確認無 regression
