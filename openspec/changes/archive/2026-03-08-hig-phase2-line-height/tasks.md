## 1. body 預設行距

- [x] 1.1 `css/shared.css`：`body` 的 `line-height` 從 `1.6` 改為 `var(--lh-normal)`

## 2. 標題類行距（tight）

- [x] 2.1 `css/style.css`：`.countdown-number` 的 `line-height` 改為 `var(--lh-tight)`（1.2→1.2 不變）
- [x] 2.2 `.tl-flag` 的 `line-height` 從 `1.3` 改為 `var(--lh-tight)`
- [x] 2.3 `.hw-block-icon` 的 `line-height` 從 `1.3` 改為 `var(--lh-tight)`
- [x] 2.4 `.tl-title` 的 `line-height` 從 `1.4` 改為 `var(--lh-tight)`

## 3. 內容段落行距（relaxed）

- [x] 3.1 `css/style.css`：`.ov-card p` 的 `line-height` 改為 `var(--lh-relaxed)`（1.7→1.7 不變）
- [x] 3.2 `.col-detail` 改為 `var(--lh-relaxed)`
- [x] 3.3 `.tl-body` 改為 `var(--lh-relaxed)`
- [x] 3.4 `.info-box` 改為 `var(--lh-relaxed)`
- [x] 3.5 `.restaurant-choice` 改為 `var(--lh-relaxed)`
- [x] 3.6 `.driving-summary-body` 改為 `var(--lh-relaxed)`
- [x] 3.7 `.suggestion-card p` 改為 `var(--lh-relaxed)`

## 4. edit.css 行距

- [x] 4.1 `.issue-reply` 的 `line-height` 改為 `var(--lh-normal)`（1.6→1.5）
- [x] 4.2 `.edit-textarea` 的 `line-height` 改為 `var(--lh-normal)`（1.6→1.5）

## 5. 驗證

- [x] 5.1 確認 icon 的 `line-height: 1` 未被改動
- [x] 5.2 視覺確認行程頁 timeline、day header、長文段落的行距舒適度
- [x] 5.3 執行測試確認無 regression
