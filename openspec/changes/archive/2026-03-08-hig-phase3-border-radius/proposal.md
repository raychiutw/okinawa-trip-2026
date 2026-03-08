## Why

全站有 8 種以上不同的圓角值，其中只有 3 個定義為 CSS 變數，其餘硬編碼散落。Apple HIG 要求同類元件的圓角嚴格統一。收斂為 5 級 token 系統，消除所有硬編碼。

## What Changes

- 新增 `--radius-xs: 4px` 和 `--radius-lg: 16px`（Phase 0 已建立變數）
- 全站硬編碼圓角替換為 token：
  - 3px / 4px / 5px → `var(--radius-xs)`
  - 6px / 8px / 10px → `var(--radius-sm)`
  - 12px → `var(--radius-md)`（已有，統一寫法）
  - 16px → `var(--radius-lg)`
  - 999px → `var(--radius-full)`
- scrollbar thumb 的 3px 保留（裝飾元素豁免）
- `border-radius: 50%` 保留（圓形語意不同）

## Capabilities

### New Capabilities
- `border-radius-tokens`: 5 級圓角 token 系統，消除硬編碼圓角值

### Modified Capabilities

## Impact

- 影響檔案：`css/shared.css`、`css/style.css`、`css/edit.css`、`css/setting.css`
- 視覺變化：大部分 ±2px 微調，不會有明顯視覺跳躍
- 不涉及 JS / HTML / JSON 結構變更
