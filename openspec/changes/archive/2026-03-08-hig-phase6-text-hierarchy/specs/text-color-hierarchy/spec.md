## ADDED Requirements

### Requirement: 4 階文字色彩系統
CSS SHALL 定義 4 階文字色：`--text`（label）、`--text-muted`（secondaryLabel）、`--text-tertiary`（tertiaryLabel）、`--text-quaternary`（quaternaryLabel）。

#### Scenario: 淺色模式 4 階色值
- **WHEN** 淺色模式下
- **THEN** 4 階文字色 SHALL 由深到淺遞減：`--text` > `--text-muted` > `--text-tertiary` > `--text-quaternary`

#### Scenario: 深色模式 4 階色值
- **WHEN** `body.dark` 啟用
- **THEN** 4 階文字色 SHALL 由亮到暗遞減，且在 `--bg` 背景上保持可辨識

### Requirement: opacity 改為語意色
使用 `opacity` 降低文字可見度的場景 SHALL 改用對應的文字色階 token。

#### Scenario: day header 日期不使用 opacity
- **WHEN** 渲染 `.dh-date`
- **THEN** SHALL 使用 `color: var(--text-muted)` 而非 `opacity: 0.9`

### Requirement: 文字場景使用 text token
文字顯示場景中的 `color: var(--gray)` SHALL 審查並替換為適當的 `--text-muted` 或 `--text-tertiary`。

#### Scenario: 次要資訊文字使用 text-muted
- **WHEN** 渲染時間、meta、副標題等次要資訊
- **THEN** color SHALL 使用 `var(--text-muted)`

#### Scenario: 輔助提示文字使用 text-tertiary
- **WHEN** 渲染更低優先級的提示文字（如 loading 狀態、update time）
- **THEN** color SHALL 使用 `var(--text-tertiary)`
