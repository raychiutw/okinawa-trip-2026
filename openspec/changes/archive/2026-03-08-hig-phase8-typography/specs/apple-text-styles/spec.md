## ADDED Requirements

### Requirement: 11 級 Apple HIG text style CSS 變數
`:root` 中 SHALL 定義且僅定義以下 11 個 font-size 變數，命名遵循 Apple HIG text style 命名慣例（第一項不編號，後續項編號）。不得存在 `--fs-display`、`--fs-lg`、`--fs-md`、`--fs-sm` 變數。

| 變數 | 值 | Apple Text Style |
|------|-----|-----------------|
| `--fs-large-title` | `2.125rem` (34px) | Large Title |
| `--fs-title` | `1.75rem` (28px) | Title |
| `--fs-title2` | `1.375rem` (22px) | Title 2 |
| `--fs-title3` | `1.25rem` (20px) | Title 3 |
| `--fs-headline` | `1.0625rem` (17px) | Headline |
| `--fs-body` | `1.0625rem` (17px) | Body |
| `--fs-callout` | `1rem` (16px) | Callout |
| `--fs-subheadline` | `0.9375rem` (15px) | Subheadline |
| `--fs-footnote` | `0.8125rem` (13px) | Footnote |
| `--fs-caption` | `0.75rem` (12px) | Caption |
| `--fs-caption2` | `0.6875rem` (11px) | Caption 2 |

#### Scenario: 11 個變數存在且值正確
- **WHEN** 檢查 `:root` 的 CSS 變數
- **THEN** SHALL 存在上述 11 個 `--fs-*` 變數且值與表格一致

#### Scenario: 舊 4 級變數已移除
- **WHEN** 搜尋全站 CSS
- **THEN** SHALL 不存在 `--fs-display`、`--fs-lg`、`--fs-md`、`--fs-sm` 的定義或引用

### Requirement: body 預設 font-size 為 --fs-body
`body` 的 `font-size` SHALL 設為 `var(--fs-body)`，計算值為 `1.0625rem`（17px）。

#### Scenario: body 文字為 17px
- **WHEN** 載入任何頁面
- **THEN** `body` 的計算 `font-size` SHALL 為 17px

### Requirement: --fs-headline 與 --fs-body 同值但角色不同
`--fs-headline` 和 `--fs-body` 值 SHALL 相同（1.0625rem），但語意不同。`--fs-headline` 用於 semibold/bold 強調文字，`--fs-body` 用於 regular weight 正文。此為 Apple 的刻意設計，不算同值重複。

#### Scenario: headline 用於粗體元素
- **WHEN** 元素使用 `var(--fs-headline)` 作為 font-size
- **THEN** 該元素的 font-weight SHALL 為 600 或 700

#### Scenario: body 用於一般 weight 元素
- **WHEN** 元素使用 `var(--fs-body)` 作為 font-size
- **THEN** 該元素的 font-weight SHALL 為 400（或繼承預設值）

### Requirement: 全站無 font-size 硬編碼值
所有 CSS 檔案的 `font-size` 宣告 MUST 使用 `var(--fs-*)` 形式。icon 內部固定尺寸（如 `.tl-flag-num` 的 `0.8em`）除外。

#### Scenario: 無硬編碼 rem/px font-size
- **WHEN** 靜態分析全站 CSS（shared.css、style.css、edit.css、setting.css）
- **THEN** 除 icon 內部尺寸外，所有 `font-size` 宣告 SHALL 使用 `var(--fs-*)` 變數

### Requirement: 禁止新增第 12 級字級
全站 MUST NOT 定義超出 11 級的額外 `--fs-*` CSS 變數。所有新元素 MUST 從現有 11 級中選擇適當的 text style。

#### Scenario: 新增元素使用現有字級
- **WHEN** 新增 CSS 元素需要設定 font-size
- **THEN** MUST 從 11 個現有 `--fs-*` 變數中選擇，不得新增變數

### Requirement: 全裝置統一字級（無響應式覆寫）
`:root` 中定義的 11 級字級 SHALL 在所有裝置尺寸下保持一致。不得存在 `@media` 查詢覆寫 `--fs-*` 變數值。

#### Scenario: 桌面版與手機版字級一致
- **WHEN** 比較 768px 以上和以下視窗的 `--fs-*` 變數值
- **THEN** 所有 11 個變數值 SHALL 完全相同

#### Scenario: 無 media query 覆寫 font-size 變數
- **WHEN** 搜尋全站 CSS 中的 `@media` 規則
- **THEN** SHALL 不存在覆寫 `--fs-*` 變數的 media query

### Requirement: 內容區最大寬度優化 CJK 閱讀
`--content-max-w` SHALL 為 `720px`，使 CJK 文字在 17px body 字體下每行約 38 字，落在 Apple 建議的 25-40 字舒適閱讀範圍內。

#### Scenario: 內容區最大寬度為 720px
- **WHEN** 檢查 `:root` 的 CSS 變數
- **THEN** `--content-max-w` SHALL 為 `720px`
