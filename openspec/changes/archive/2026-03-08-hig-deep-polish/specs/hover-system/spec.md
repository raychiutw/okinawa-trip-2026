## ADDED Requirements

### Requirement: 互動元素 hover transition 完整覆蓋
所有會在 hover 時改變 background 或 color 的互動元素 SHALL 具備 `transition` 宣告，使用 `var(--duration-fast)` 作為 duration。

#### Scenario: .dn（Day nav pill）有 hover transition
- **WHEN** 檢查 `.dn` 的 CSS 規則
- **THEN** SHALL 包含 `transition` 屬性，涵蓋 `background` 和 `color` 的 `var(--duration-fast)` 過渡

#### Scenario: .col-row 有 hover transition
- **WHEN** 檢查 `.col-row` 的 CSS 規則
- **THEN** SHALL 包含 `transition: background var(--duration-fast)`

#### Scenario: .map-link 有 hover transition
- **WHEN** 檢查 `.map-link` 的 CSS 規則
- **THEN** SHALL 包含 `transition` 屬性，涵蓋 `background` 和 `color` 的 `var(--duration-fast)` 過渡

#### Scenario: .hw-summary 有 hover transition
- **WHEN** 檢查 `.hw-summary` 的 CSS 規則
- **THEN** SHALL 包含 `transition: color var(--duration-fast)`

#### Scenario: .trip-error-link 有 hover transition
- **WHEN** 檢查 `.trip-error-link` 的 CSS 規則
- **THEN** SHALL 包含 `transition: filter var(--duration-fast)`
