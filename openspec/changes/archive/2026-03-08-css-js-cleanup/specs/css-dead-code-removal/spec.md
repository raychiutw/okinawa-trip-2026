## ADDED Requirements

### Requirement: 未使用的 CSS variables 須移除

`:root` 中定義但全站無引用的 CSS custom property SHALL 被移除，包含其在 `body.dark` 中的覆寫。Apple text style token（`--fs-*`）因設計系統完整性 SHALL 保留。

#### Scenario: 移除 --shadow-sm
- **WHEN** 全站搜尋 `var(--shadow-sm)` 無任何結果
- **THEN** `:root` 和 `body.dark` 中的 `--shadow-sm` 定義 SHALL 被移除

#### Scenario: 移除 --text-tertiary 和 --text-quaternary
- **WHEN** 全站搜尋 `var(--text-tertiary)` 和 `var(--text-quaternary)` 無任何結果
- **THEN** `:root` 和 `body.dark` 中的對應定義 SHALL 被移除

#### Scenario: 保留 Apple text style token
- **WHEN** `--fs-title` 和 `--fs-caption2` 屬於 Apple 11 級 text style 體系
- **THEN** 即使目前無引用也 SHALL 保留

### Requirement: 冗餘的 dark mode 覆寫須移除

當 `body.dark` 規則設定的值與 base 規則完全相同（因 token 已在 `body.dark {}` 中重新定義而自動生效），該覆寫規則 SHALL 被移除。

#### Scenario: body.dark .edit-fab 冗餘覆寫
- **WHEN** `.edit-fab` base 規則使用 `background: var(--accent)` 且 `body.dark` 覆寫也是 `background: var(--accent)`
- **THEN** `body.dark .edit-fab` 規則 SHALL 被移除

#### Scenario: body.dark backdrop 冗餘覆寫
- **WHEN** backdrop 元素 base 規則使用 `background: var(--overlay)` 且 `body.dark` 覆寫也是相同值
- **THEN** 冗餘覆寫規則 SHALL 被移除

### Requirement: 重複宣告須合併

同一選擇器的多次宣告 SHALL 合併為單一規則。

#### Scenario: .trip-error-link 合併
- **WHEN** `.trip-error-link` 在 style.css 中出現兩次
- **THEN** transition 屬性 SHALL 合併進第一條規則
