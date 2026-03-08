## ADDED Requirements

### Requirement: 8pt grid 合規
全站 CSS 中所有 `padding`、`margin`、`gap` 的值 SHALL 為 4 的倍數（0/4/8/12/16/20/24/28/32/40/48）。

#### Scenario: 無不規則間距值
- **WHEN** 搜尋所有 CSS 檔案的 padding/margin/gap 屬性
- **THEN** 數值 SHALL 僅包含 0 或 4 的倍數（豁免：scrollbar 相關、border-width、width/height）

### Requirement: 10px 統一為 12px
原本使用 `10px` 的 padding/margin/gap SHALL 改為 `12px`。

#### Scenario: col-row padding
- **WHEN** 檢查 `.col-row` 的 padding
- **THEN** SHALL 不包含 `10px`，使用 `12px` 取代

#### Scenario: flight-row padding
- **WHEN** 檢查 `.flight-row` 的 padding
- **THEN** SHALL 不包含 `10px`，使用 `12px` 取代

### Requirement: 6px 統一為 8px
原本使用 `6px` 的 padding/margin/gap SHALL 改為 `8px`。

#### Scenario: nav pill gap
- **WHEN** 檢查 `.dh-nav` 的 gap
- **THEN** SHALL 為 `8px` 而非 `6px`

### Requirement: 奇數值消除
3px 和 5px 的 padding/margin/gap SHALL 改為 `4px`。2px SHALL 改為 `4px`。

#### Scenario: 無奇數間距
- **WHEN** 搜尋所有 CSS 的 padding/margin/gap
- **THEN** SHALL 不存在 2px、3px、5px 的間距值（豁免：`margin-top: 2px` 等極小調整如必要可保留為 4px）

### Requirement: scrollbar 豁免
scrollbar 相關的 width(6px)、height(6px) 和 padding SHALL 豁免 8pt grid 規則。

#### Scenario: scrollbar 寬度不改
- **WHEN** 檢查 `::-webkit-scrollbar` 的 CSS
- **THEN** width 和 height SHALL 保持 `6px`
