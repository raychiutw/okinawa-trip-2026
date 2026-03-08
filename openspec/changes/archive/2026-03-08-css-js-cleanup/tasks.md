## 1. CSS 死 token 移除

- [x] 1.1 `css/shared.css` `:root`：移除 `--shadow-sm: 0 1px 4px rgba(0,0,0,0.06);`
- [x] 1.2 `css/shared.css` `:root`：移除 `--text-tertiary: #9B9B9B;`
- [x] 1.3 `css/shared.css` `:root`：移除 `--text-quaternary: #C0C0C0;`
- [x] 1.4 `css/shared.css` `body.dark`：移除 `--text-tertiary: #6B6B6B`
- [x] 1.5 `css/shared.css` `body.dark`：移除 `--text-quaternary: #4A4A4A`

## 2. CSS 冗餘 dark mode 覆寫移除

- [x] 2.1 `css/style.css`：移除 `body.dark .edit-fab { background: var(--accent); }`
- [x] 2.2 `css/style.css`：移除 `body.dark .speed-dial-trigger { background: var(--accent); }`
- [x] 2.3 `css/style.css`：移除 `body.dark .speed-dial-backdrop { background: var(--overlay); }`
- [x] 2.4 `css/style.css`：移除 `body.dark .info-sheet-backdrop { background: var(--overlay); }`

## 3. CSS 重複宣告合併

- [x] 3.1 `css/style.css`：將 `.trip-error-link` 第二條規則的 `transition: filter var(--duration-fast)` 合併進第一條規則，刪除第二條

## 4. JS 常數化

- [x] 4.1 `js/app.js`：在 Constants 區塊新增 `var MS_PER_DAY = 86400000;`
- [x] 4.2 `js/app.js`：第 1019 行 `/ 86400000` 改為 `/ MS_PER_DAY`
- [x] 4.3 `js/app.js`：第 1024 行 `/ 86400000` 改為 `/ MS_PER_DAY`
- [x] 4.4 `js/app.js`：第 1516 行 `16*86400000` 改為 `16 * MS_PER_DAY`

## 5. lsRenewAll 效能防護

- [x] 5.1 `js/app.js`：在 `lsRenewAll()` 呼叫處加 sessionStorage 防護，同 session 內只執行一次

## 6. 文件修正

- [x] 6.1 `CLAUDE.md`：專案結構中移除 `menu.js` 和 `menu.css` 記載（兩個檔案都不存在）

## 7. 驗證

- [x] 7.1 執行 `npm test` 確認全部通過 → 581 tests all passed
