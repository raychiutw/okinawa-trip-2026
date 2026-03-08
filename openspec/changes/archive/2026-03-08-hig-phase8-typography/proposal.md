## Why

全站字級系統僅 4 級（display/lg/md/sm），無法表達 Apple HIG 所定義的 11 級文字樣式層級。大量元素被迫共用 `--fs-md`（body 預設），導致視覺層次扁平——標題、正文、標註、說明文字全部同一大小。此外桌面版有 `@media (min-width: 768px)` 的字級縮放覆寫，與 Apple 的一致性原則衝突。內容最大寬度 800px 在 17px 字體下 CJK 每行約 47 字，超出 Apple 建議的 25-40 字舒適閱讀範圍。

## What Changes

- **字級系統重建**：4 級 → 11 級 Apple HIG text styles
  - 淘汰：`--fs-display`、`--fs-lg`、`--fs-md`、`--fs-sm`
  - 新增：`--fs-large-title`(34px)、`--fs-title`(28px)、`--fs-title2`(22px)、`--fs-title3`(20px)、`--fs-headline`(17px)、`--fs-body`(17px)、`--fs-callout`(16px)、`--fs-subheadline`(15px)、`--fs-footnote`(13px)、`--fs-caption`(12px)、`--fs-caption2`(11px)
- **移除桌面版字級覆寫**：刪除 `@media (min-width: 768px)` 中的 `--fs-*` 覆寫，全裝置統一字級
- **元素字級重新分配**：全站所有 `font-size` 宣告從舊 4 級對映到新 11 級
- **內容最大寬度收窄**：`--content-max-w: 800px` → `720px`，CJK 每行 ~38 字
- **body 預設字級**：`--fs-md`(18px) → `--fs-body`(17px)，對齊 Apple HIG body size

## Capabilities

### New Capabilities
- `apple-text-styles`: 建立 Apple HIG 11 級文字樣式系統，定義每級的 font-size / font-weight / 用途，並規範全站元素字級分配

### Modified Capabilities
- `font-size-scale`: 從 4 級系統升級為 11 級 Apple HIG 系統，移除桌面版覆寫，變數命名全面更新

## Impact

- 影響檔案：`css/shared.css`、`css/style.css`、`css/edit.css`、`css/setting.css`
- body 預設 font-size 從 18px 降為 17px，全站文字略小
- `--content-max-w` 從 800px 收為 720px，桌面版內容區略窄
- 不涉及 HTML / JS / JSON 結構變更
- 需同步更新 `CLAUDE.md` 的字型規範段落（四級→十一級）和 `openspec/config.yaml` context
