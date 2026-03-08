## 1. css/shared.css 圓角統一

- [x] 1.1 確認 `--radius-xs: 4px` 和 `--radius-lg: 16px` 已存在（Phase 0）

## 2. css/style.css 圓角替換

- [x] 2.1 `.tl-flag` 的 `4px 0 0 4px` → `var(--radius-xs) 0 0 var(--radius-xs)`
- [x] 2.2 `.hw-block-loc` 的 `4px` → `var(--radius-xs)`
- [x] 2.3 `.sg-priority-*` 的 `6px` → `var(--radius-sm)`
- [x] 2.4 `.driving-stats` 的 `8px` → `var(--radius-sm)`
- [x] 2.5 `.driving-stats-badge` 的 `10px` → `var(--radius-sm)`
- [x] 2.6 `.driving-summary-day` 的 `8px` → `var(--radius-sm)`
- [x] 2.7 `.day-header` 的 `12px 12px 0 0` → `var(--radius-md) var(--radius-md) 0 0`
- [x] 2.8 `.info-sheet-panel` 的 `16px 16px 0 0` → `var(--radius-lg) var(--radius-lg) 0 0`
- [x] 2.9 `.print-exit-btn` 的 `8px` → `var(--radius-sm)`

## 3. css/edit.css 圓角替換

- [x] 3.1 `.issue-badge` 的 `999px` → `var(--radius-full)`
- [x] 3.2 `.edit-input-card` 的 `16px` → `var(--radius-lg)`
- [x] 3.3 `.edit-status` 的 `8px` → `var(--radius-sm)`
- [x] 3.4 `.issue-reply code` 的 `4px` → `var(--radius-xs)`
- [x] 3.5 `.issue-reply blockquote` 的 `0 var(--radius-sm) var(--radius-sm) 0`（確認）
- [x] 3.6 `.issue-reply pre` 的圓角確認使用 token

## 4. css/setting.css 圓角替換

- [x] 4.1 `.color-mode-preview` 的 `8px` → `var(--radius-sm)`
- [x] 4.2 `.cmp-input` 的 `5px` → `var(--radius-xs)`

## 5. 驗證

- [x] 5.1 確認 scrollbar thumb 的 `3px` 未被改動
- [x] 5.2 確認 `border-radius: 50%` 的圓形按鈕未被改動
- [x] 5.3 視覺確認 suggestion priority 和 badge 的圓角變化可接受
- [x] 5.4 執行測試確認無 regression
