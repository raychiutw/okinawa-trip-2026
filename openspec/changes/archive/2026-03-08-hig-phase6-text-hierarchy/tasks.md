## 1. opacity 改為語意色

- [x] 1.1 `css/style.css`：`.dh-date` 移除 `opacity: 0.9`，改為 `color: var(--text-muted)`

## 2. 審查 color: var(--gray) 的文字場景

- [x] 2.1 `css/style.css`：逐一審查所有 `color: var(--gray)` 的使用，分為：
  - 次要資訊 → 改為 `var(--text-muted)`
  - 輔助提示 → 改為 `var(--text-tertiary)`
  - 非文字場景（scrollbar 等）→ 保留 `var(--gray)`
- [x] 2.2 `css/shared.css`：同上審查
- [x] 2.3 `css/edit.css`：同上審查

## 3. 套用 quaternary

- [x] 3.1 確認 `.sheet-handle` 的 `opacity: 0.35` 保留（非文字色階，是視覺效果）
- [x] 3.2 確認是否有其他適合使用 `--text-quaternary` 的場景（disabled 狀態等）

## 4. 驗證

- [x] 4.1 深色模式確認 4 階文字色在 `--bg` 背景上皆可辨識
- [x] 4.2 確認 `--gray` 在非文字場景仍正常使用
- [x] 4.3 執行測試確認無 regression
