## ADDED Requirements

### Requirement: 深淺模式切換平滑過渡
`body` SHALL 定義 `transition` 屬性，使深淺模式切換時背景色和文字色平滑過渡，而非瞬間跳變。

#### Scenario: 切換到深色模式有淡入效果
- **WHEN** 使用者從淺色模式切換到深色模式
- **THEN** `body` 的 background-color 和 color SHALL 在約 0.3 秒內平滑過渡

#### Scenario: 切換到淺色模式有淡入效果
- **WHEN** 使用者從深色模式切換到淺色模式
- **THEN** `body` 的 background-color 和 color SHALL 在約 0.3 秒內平滑過渡

### Requirement: 初次載入不觸發過渡動畫
頁面初次載入時，深色模式的 class 設定 SHALL 在 transition 生效前完成，避免從淺色閃爍到深色。

#### Scenario: 深色模式使用者不見白閃
- **WHEN** 深色模式使用者載入頁面
- **THEN** 頁面 SHALL 直接以深色呈現，不出現淺色到深色的過渡閃爍

### Requirement: transition 僅限 body 層級
過渡 transition SHALL 僅定義在 `body` 上，不得在 `*` 或 `:root` 上定義（避免效能問題）。子元素透過 CSS 變數繼承自然獲得漸變效果。

#### Scenario: 無全域 transition
- **WHEN** 檢查全站 CSS
- **THEN** SHALL 不存在 `* { transition: ... }` 或 `:root { transition: ... }` 的規則
