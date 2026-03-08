## ADDED Requirements

### Requirement: Backdrop overlay 色彩須由 token 管理

所有 backdrop overlay（modal/sheet/speed-dial 遮罩）的背景色 SHALL 使用 `var(--overlay)` token，不得硬編碼 `rgba()` 值。

#### Scenario: Light mode backdrop overlay
- **WHEN** speed-dial 或 info-sheet backdrop 在 light mode 顯示
- **THEN** 其 background SHALL 使用 `var(--overlay)`

#### Scenario: Dark mode backdrop overlay
- **WHEN** speed-dial 或 info-sheet backdrop 在 dark mode 顯示
- **THEN** `body.dark` 覆寫的 `--overlay` 值 SHALL 提供更深的遮罩（現為 0.55 不透明度）

### Requirement: Dark mode sticky-nav 邊框須使用 color-mix

`body.dark .sticky-nav` 的邊框色 SHALL 使用 `color-mix()` 函式而非硬編碼 `rgba()`，與毛玻璃設計語言一致。

#### Scenario: Dark mode sticky-nav 邊框
- **WHEN** 頁面在 dark mode 下
- **THEN** `.sticky-nav` 的 `border-bottom-color` SHALL 使用 `color-mix(in srgb, ...)` 而非 `rgba(255,255,255,0.15)`

### Requirement: CSS HIG 測試須涵蓋 overlay token 化

測試 SHALL 驗證 backdrop/overlay 相關選擇器不包含硬編碼 `rgba(0,0,0,` 背景色。

#### Scenario: 偵測未 token 化的 backdrop 色彩
- **WHEN** CSS 中 backdrop 相關選擇器使用 `background: rgba(0,0,0,`
- **THEN** 測試 SHALL 報告違規
