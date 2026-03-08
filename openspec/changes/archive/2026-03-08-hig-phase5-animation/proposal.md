## Why

目前的動畫曲線使用 `cubic-bezier(0.4, 0, 0.2, 1)`，這是 Google Material Design 的標準曲線，不是 Apple 風格。Apple 偏好 spring 動畫（更有「彈性」感），並且動畫時長應統一管理。

## What Changes

- 全站 `cubic-bezier(0.4, 0, 0.2, 1)` → `var(--ease-apple)` = `cubic-bezier(0.2, 0.8, 0.2, 1)`
- transition duration 改用 `var(--duration-fast/normal/slow)` token
- 微互動（≤ 150ms）保留原值
- speed dial 的 stagger delay 保留

## Capabilities

### New Capabilities
- `animation-system`: Apple 風格動畫曲線與時長 token 系統

### Modified Capabilities

## Impact

- 影響檔案：`css/shared.css`、`css/style.css`、`css/edit.css`
- 視覺變化：動畫感覺會稍微「彈」一點，時長不變
- 不涉及 JS / HTML / JSON 結構變更
