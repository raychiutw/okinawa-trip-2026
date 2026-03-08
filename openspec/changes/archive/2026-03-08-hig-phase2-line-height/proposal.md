## Why

全站使用 6 種不同的 `line-height`（1.0/1.2/1.3/1.4/1.6/1.7），缺乏系統性。Apple HIG 的排版原則：標題緊湊、內文寬裕、層次分明。收斂為 3 級行距系統，強化閱讀節奏。

## What Changes

- body 全域行距 1.6 → `var(--lh-normal)` = 1.5（UI 文字更俐落）
- 標題/flag/icon 的 1.3/1.4 → `var(--lh-tight)` = 1.2（標題更緊湊）
- 內容段落的 1.7 → `var(--lh-relaxed)` = 1.7（保持不變）
- icon 專用 `line-height: 1` 保留不設變數

## Capabilities

### New Capabilities
- `line-height-system`: 3 級行距系統（tight/normal/relaxed）統一全站行距

### Modified Capabilities

## Impact

- 影響檔案：`css/shared.css`、`css/style.css`、`css/edit.css`
- 視覺變化：body 預設從 1.6 縮到 1.5（稍緊），標題類從 1.3~1.4 縮到 1.2（明顯緊湊）
- 不涉及 JS / HTML / JSON 結構變更
