## ADDED Requirements

### Requirement: Apple 風格動畫曲線
所有超過 150ms 的 transition SHALL 使用 `var(--ease-apple)` 作為 timing-function。

#### Scenario: container 動畫曲線
- **WHEN** 檢查 `.container` 的 transition
- **THEN** timing-function SHALL 為 `var(--ease-apple)`

#### Scenario: info-sheet 動畫曲線
- **WHEN** 檢查 `.info-sheet-panel` 的 transition
- **THEN** timing-function SHALL 為 `var(--ease-apple)`

### Requirement: duration token 化
transition duration SHALL 使用 `--duration-fast`(150ms)、`--duration-normal`(250ms)、`--duration-slow`(350ms) token。

#### Scenario: 短 hover 效果
- **WHEN** 檢查 hover transition（如 `.nav-close-btn:hover`）
- **THEN** duration SHALL 使用 `var(--duration-fast)`

#### Scenario: 展開收合動畫
- **WHEN** 檢查 `.container` 或 `.info-sheet-panel` 的 transition
- **THEN** duration SHALL 使用 `var(--duration-slow)`

### Requirement: speed dial stagger 保留
speed dial 的 `transition-delay`（0ms/30ms/60ms/90ms/120ms）SHALL 保留不變。

#### Scenario: stagger delay 不改
- **WHEN** 檢查 `.speed-dial-item:nth-child(*)` 的 transition-delay
- **THEN** delay 值 SHALL 維持 0/30/60/90/120ms
