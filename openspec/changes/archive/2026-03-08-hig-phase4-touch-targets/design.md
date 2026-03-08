## Context

Apple HIG 要求所有互動元素最小觸控區域 44×44pt。目前 5 個元素低於此標準。Phase 0 定義了 `--tap-min: 44px`。

## Goals / Non-Goals

**Goals:**
- 所有按鈕和互動元素的觸控區域 ≥ 44×44px
- `--nav-h` 統一為 48px（8pt grid 上能容納 44px 觸控目標的最小值）
- 盡量透過 padding/min-size 擴大觸控區域，避免視覺尺寸大幅改變

**Non-Goals:**
- 不改變按鈕的視覺設計（顏色、icon、文字）
- 不改變已達標的元素（speed-dial-trigger 56px、edit-fab 56px、trip-btn 等）

## Decisions

1. **nav-h 統一 48px**：index 的 49px 和 edit 的 52px 統一為 48px。48 = 44 + 2×2 padding，是 8pt grid 上的最小合理值。
2. **36px 按鈕 → 44px**：`.nav-close-btn`、`.sheet-close-btn`、`.edit-send-btn` 從 36×36 改為 44×44。使用 `min-width: var(--tap-min); min-height: var(--tap-min)` 確保觸控區域。
3. **nav pill (.dn) → 44px 高**：`min-height: var(--tap-min)` + `min-width: var(--tap-min)`。
4. **nav-action-btn → 44px 高**：`min-height: var(--tap-min)`。

## Risks / Trade-offs

- [nav 高度變化] → 49→48px 幾乎無感。edit 的 52→48px 會稍矮但仍舒適。
- [按鈕從 36→44px] → 視覺上會明顯變大。close button 和 send button 會更突出。
- [nav pill 變高] → .day-header 整體可能變高，影響 sticky 區域大小。需要在手機版確認不會佔太多螢幕空間。
- [info-panel top offset] → `top: var(--nav-h)` 會自動跟著更新，無需額外處理。
