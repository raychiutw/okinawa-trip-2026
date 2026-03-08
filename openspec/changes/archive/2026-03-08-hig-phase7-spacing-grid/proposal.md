## Why

全站間距值未遵守任何 grid 系統，存在 2/3/5/6/10/14 等不規則值。Apple HIG 要求嚴格的 8pt grid（允許 4pt 半格），所有內容間距必須為 4 的倍數：4/8/12/16/20/24/28/32/40/48。

## What Changes

- 全站約 50+ 處間距值替換：
  - 2px → 4px
  - 3px → 4px
  - 5px → 4px
  - 6px → 8px
  - 10px → 12px（向上取，Apple 寬裕原則）
  - 14px → 16px
- 已合法的值（4/8/12/16/20/24/28/32/40/48）保持不動
- scrollbar 寬度 6px 保留（裝飾元素豁免）
- `--nav-h` 在 Phase 4 已改為 48px

## Capabilities

### New Capabilities
- `spacing-grid`: 全站 8pt grid 間距合規

### Modified Capabilities

## Impact

- 影響檔案：`css/shared.css`、`css/style.css`、`css/edit.css`、`css/setting.css`
- 視覺變化：所有 ±2px 的微調會累積成整體排版節奏感的變化
- 這是改動量最大、風險最高的 phase，需要逐檔確認
- 不涉及 JS / HTML / JSON 結構變更
