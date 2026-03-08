## ADDED Requirements

### Requirement: 所有按鈕元素須有可見的 focus-visible 樣式

所有 `<button>` 元素在鍵盤 focus 時 SHALL 顯示 `box-shadow: var(--shadow-ring)` 作為 focus indicator。此規則透過 `shared.css` 的通用 `button:focus-visible` 選擇器實現，確保現有及未來新增的按鈕都自動獲得 focus ring。

#### Scenario: 通用按鈕 focus-visible
- **WHEN** 使用者以鍵盤 Tab 導航至任何 `<button>` 元素
- **THEN** 該按鈕 SHALL 顯示 `var(--shadow-ring)` 光暈，outline 為 none

#### Scenario: 已有自訂 focus-visible 的元素不受影響
- **WHEN** `.dn`、`.nav-close-btn`、`.sheet-close-btn` 等已有 `:focus-visible` 的元素獲得鍵盤 focus
- **THEN** 其既有的 `box-shadow: var(--shadow-ring)` 樣式 SHALL 維持不變（因通用規則與個別規則相同值）

### Requirement: CSS HIG 測試須涵蓋 focus-visible 紀律

測試 SHALL 驗證全站 CSS 中，任何包含 `outline: none` 的 `focus-visible` 規則都同時設定了 `box-shadow`（確保 focus ring 被替換而非單純移除）。

#### Scenario: 偵測缺少替代 focus indicator 的 outline 移除
- **WHEN** CSS 中出現 `:focus-visible { outline: none }` 但同一規則未包含 `box-shadow`
- **THEN** 測試 SHALL 報告違規

#### Scenario: 合法的 outline 移除
- **WHEN** `:focus-visible` 規則同時有 `outline: none` 和 `box-shadow`
- **THEN** 測試 SHALL 通過（因 focus indicator 已被 box-shadow 替代）
