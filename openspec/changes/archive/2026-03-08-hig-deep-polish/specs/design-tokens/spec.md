## ADDED Requirements

### Requirement: Color mode preview token 定義
`:root` SHALL 定義 6 個 `--cmp-*` CSS 變數，供 setting.css 的色彩模式預覽卡片使用。這些 token 不在 `body.dark` 中覆寫——它們代表固定的主題預覽色。

| 變數 | 值 | 用途 |
|------|----|------|
| `--cmp-light-bg` | `#F5F5F5` | 淺色主題預覽背景 |
| `--cmp-light-surface` | `#FFFFFF` | 淺色主題預覽表面 |
| `--cmp-light-input` | `#E0E0E0` | 淺色主題預覽輸入框 |
| `--cmp-dark-bg` | `#1A1816` | 深色主題預覽背景 |
| `--cmp-dark-surface` | `#292624` | 深色主題預覽表面 |
| `--cmp-dark-input` | `#3D3A37` | 深色主題預覽輸入框 |

#### Scenario: 6 個 cmp token 存在於 :root
- **WHEN** 載入 `css/shared.css`
- **THEN** `:root` 中 SHALL 存在 `--cmp-light-bg`、`--cmp-light-surface`、`--cmp-light-input`、`--cmp-dark-bg`、`--cmp-dark-surface`、`--cmp-dark-input` 六個變數

#### Scenario: cmp token 不隨深色模式變動
- **WHEN** 頁面有 `body.dark` class
- **THEN** `body.dark` SHALL 不包含任何 `--cmp-*` 覆寫，preview token 值保持與 `:root` 一致

#### Scenario: setting.css 使用 cmp token
- **WHEN** 靜態分析 `css/setting.css` 的 `.color-mode-light`、`.color-mode-dark`、`.color-mode-auto` 規則
- **THEN** background 值 MUST 引用 `var(--cmp-*)` token，不得出現 `#F5F5F5`、`#FFFFFF`、`#E0E0E0`、`#1A1816`、`#292624`、`#3D3A37` 硬編碼色碼
