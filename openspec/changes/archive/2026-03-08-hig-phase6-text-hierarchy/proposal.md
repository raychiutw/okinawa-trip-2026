## Why

Apple HIG 定義 4 階文字色彩層級（label → quaternaryLabel），目前只有 2 階（`--text` / `--text-muted`）。部分場景使用 `opacity` 或直接寫 `--gray` 來模擬更低層級，缺乏語意一致性。

## What Changes

- 新增 `--text-tertiary` 和 `--text-quaternary` 色值（Phase 0 已建立變數）
- dark mode 同步定義對應色值
- 將現有使用 `opacity` 降低文字可見度的場景改為語意色：
  - `opacity: 0.9`（.dh-date）→ `color: var(--text-muted)`
  - `opacity: 0.35`（.sheet-handle）→ 改用 `var(--text-quaternary)`
- 審查所有 `color: var(--gray)` 的場景，細分為 muted/tertiary

## Capabilities

### New Capabilities
- `text-color-hierarchy`: 4 階文字色彩語意系統

### Modified Capabilities

## Impact

- 影響檔案：`css/shared.css`、`css/style.css`
- 視覺變化：主要是語意重構，大部分視覺不會改變
- 需確認深色模式下 4 階文字的 WCAG AA 對比度合規
- 不涉及 JS / HTML / JSON 結構變更
