## MODIFIED Requirements

### Requirement: Scrollbar token 定義
`:root` SHALL 定義 `--scrollbar-thumb` 和 `--scrollbar-thumb-hover` 兩個 CSS 變數，供全站 scrollbar 樣式使用。`body.dark` SHALL 覆寫這兩個變數為深色模式適用的值。

#### Scenario: 淺色模式 scrollbar token 值
- **WHEN** 檢查 `:root` 的 `--scrollbar-thumb`
- **THEN** SHALL 為 `#C4C0BB`

#### Scenario: 深色模式 scrollbar token 值
- **WHEN** 檢查 `body.dark` 的 `--scrollbar-thumb`
- **THEN** SHALL 為 `#5A5651`

### Requirement: Nav bar 背景 token 化
shared.css 中 `.sticky-nav` 的 `background` SHALL 使用 `color-mix()` 函式引用 `var(--bg)` 變數，而非硬編碼的 `rgba()` 色碼值。此確保淺/深模式自動適應。

#### Scenario: sticky-nav background 使用 color-mix
- **WHEN** 檢查 `.sticky-nav` 的 `background` 屬性
- **THEN** SHALL 包含 `color-mix(in srgb, var(--bg)` 而非 `rgba(`
