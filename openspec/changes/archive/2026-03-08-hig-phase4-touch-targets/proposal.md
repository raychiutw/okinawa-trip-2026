## Why

Apple HIG 嚴格要求所有互動元素最小觸控區域 44×44pt。目前有 5 個元素低於此標準（36px 或更小），手機上可能造成誤觸。

## What Changes

- `.nav-close-btn` 36×36 → 最小 44×44 觸控區域
- `.sheet-close-btn` 36×36 → 最小 44×44 觸控區域
- `.edit-send-btn` 36×36 → 最小 44×44 觸控區域
- `.nav-action-btn` ~36 高 → min-height: 44px
- `.dn`（nav pill）40×~33 → min-height: 44px, min-width: 44px
- `--nav-h` 統一為 48px（index 的 49px 和 edit 的 52px 皆改為 48px）

## Capabilities

### New Capabilities
- `touch-targets`: 全站互動元素觸控目標合規（≥ 44px）

### Modified Capabilities

## Impact

- 影響檔案：`css/shared.css`、`css/style.css`、`css/edit.css`
- 視覺變化：nav 列高度可能微調，nav pill 會稍大
- 佈局連鎖：nav 高度變化可能影響 sticky 定位和 info-panel 的 top offset
- 不涉及 JS / JSON 結構變更
