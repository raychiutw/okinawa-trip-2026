## ADDED Requirements

### Requirement: 最小觸控目標 44px
所有互動元素（按鈕、連結、可點擊區域）的觸控區域 SHALL 至少為 44×44px。

#### Scenario: nav-close-btn 觸控區域
- **WHEN** 渲染 `.nav-close-btn`
- **THEN** 其 min-width 和 min-height SHALL ≥ 44px

#### Scenario: sheet-close-btn 觸控區域
- **WHEN** 渲染 `.sheet-close-btn`
- **THEN** 其 min-width 和 min-height SHALL ≥ 44px

#### Scenario: edit-send-btn 觸控區域
- **WHEN** 渲染 `.edit-send-btn`
- **THEN** 其 min-width 和 min-height SHALL ≥ 44px

#### Scenario: nav-action-btn 觸控區域
- **WHEN** 渲染 `.nav-action-btn`
- **THEN** 其 min-height SHALL ≥ 44px

#### Scenario: nav pill 觸控區域
- **WHEN** 渲染 `.dn`（Day 導覽按鈕）
- **THEN** 其 min-height 和 min-width SHALL ≥ 44px

### Requirement: nav-h 統一 48px
`--nav-h` SHALL 為 48px，所有頁面統一。

#### Scenario: index 頁 nav 高度
- **WHEN** 載入 index.html
- **THEN** `--nav-h` 的計算值 SHALL 為 48px

#### Scenario: edit 頁 nav 高度
- **WHEN** 載入 edit.html
- **THEN** `--nav-h` SHALL 為 48px（移除 edit.css 的 52px 覆寫）
