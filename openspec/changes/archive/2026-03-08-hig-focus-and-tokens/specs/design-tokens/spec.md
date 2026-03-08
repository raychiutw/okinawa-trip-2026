## MODIFIED Requirements

### Requirement: 設計 token 完整性

`:root` 的設計 token 定義 SHALL 包含 overlay 相關 token，為 backdrop 遮罩提供統一的色彩值。新增 token：

- `--overlay`: backdrop 遮罩背景色（light mode 值）

`body.dark` 覆寫 SHALL 包含：
- `--overlay`: backdrop 遮罩背景色（dark mode 值，更深的不透明度）

#### Scenario: Overlay token 定義存在
- **WHEN** 檢查 `css/shared.css` 的 `:root` 定義
- **THEN** SHALL 包含 `--overlay` token

#### Scenario: Dark mode overlay token 覆寫
- **WHEN** 檢查 `css/shared.css` 的 `body.dark` 定義
- **THEN** SHALL 包含 `--overlay` 的覆寫值
