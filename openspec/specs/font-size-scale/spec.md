## ADDED Requirements

### Requirement: 11 級 Apple Text Style font-size token 定義於 shared.css

系統 SHALL 在 `css/shared.css` 的 `:root` 中定義且僅定義以下 11 個 font-size 變數，對應 Apple Human Interface Guidelines 的 Text Styles 階層。任何 CSS 檔案 MUST NOT 使用硬編碼 px/rem/em 作為 font-size 值。

| 變數 | 值 | Apple Text Style |
|------|----|------------------|
| `--fs-large-title` | `2.125rem` | Large Title |
| `--fs-title` | `1.75rem` | Title 1 |
| `--fs-title2` | `1.375rem` | Title 2 |
| `--fs-title3` | `1.25rem` | Title 3 |
| `--fs-headline` | `1.0625rem` | Headline |
| `--fs-body` | `1.0625rem` | Body（body 預設） |
| `--fs-callout` | `1rem` | Callout |
| `--fs-subheadline` | `0.9375rem` | Subheadline |
| `--fs-footnote` | `0.8125rem` | Footnote |
| `--fs-caption` | `0.75rem` | Caption 1 |
| `--fs-caption2` | `0.6875rem` | Caption 2 |

#### Scenario: 11 個變數存在且值正確

- **WHEN** 載入 `css/shared.css`
- **THEN** `:root` 中 SHALL 存在上述 11 個 `--fs-*` 變數，且值分別對應上表

#### Scenario: body 預設 font-size 為 --fs-body

- **WHEN** 任何頁面載入完成
- **THEN** `body` 的 `font-size` SHALL 為 `var(--fs-body)`（`1.0625rem`）

---

### Requirement: 各 CSS 檔案不得出現硬編碼 font-size

`css/style.css`、`css/edit.css`、`css/setting.css` 中的所有 `font-size` 宣告 MUST 使用 `var(--fs-*)` 形式。硬編碼 rem/em/px 值 SHALL 不存在。

#### Scenario: 全站 CSS 無硬編碼 font-size

- **WHEN** 靜態分析所有 CSS 檔案（排除 `:root` 與 `body.dark` 定義區塊及 print mode）
- **THEN** 所有 `font-size` 宣告 SHALL 使用 `var(--fs-*)` CSS variable

---

### Requirement: Line height token 定義於 shared.css

系統 SHALL 在 `css/shared.css` 的 `:root` 中定義三個 line-height 變數。

| 變數 | 值 | 用途 |
|------|----|------|
| `--lh-tight` | `1.2` | 標題、密排文字 |
| `--lh-normal` | `1.5` | body 預設 |
| `--lh-relaxed` | `1.7` | 長文段落 |

#### Scenario: body 預設 line-height 為 --lh-normal

- **WHEN** 任何頁面載入完成
- **THEN** `body` 的 `line-height` SHALL 為 `var(--lh-normal)`（`1.5`）
