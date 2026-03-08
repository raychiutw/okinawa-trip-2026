## REMOVED Requirements

### Requirement: 四級 font-size CSS variables 定義於 shared.css
**Reason**: 被 11 級 Apple HIG text style 系統取代（見 `apple-text-styles` spec）
**Migration**: `--fs-display` → `--fs-large-title`、`--fs-lg` → `--fs-title3`（或依元素角色選擇 title2/title3）、`--fs-md` → `--fs-body`（或依角色選擇 callout/subheadline）、`--fs-sm` → `--fs-footnote`（或依角色選擇 caption）

### Requirement: 各 CSS 檔案不得出現硬編碼 font-size
**Reason**: 規則保留但移至 `apple-text-styles` spec，變數名稱從 4 級更新為 11 級
**Migration**: 繼續使用 `var(--fs-*)` 形式，但可用的變數從 4 個擴充為 11 個

### Requirement: 硬編碼值對映至最近視覺比例的變數
**Reason**: 被 11 級系統的精確語意分配取代，不再需要「最近比例」的粗略對映
**Migration**: 每個元素依其語意角色（標題/正文/說明/中繼資訊）分配到對應的 Apple text style

### Requirement: 桌機 font-size 覆蓋（media query）
**Reason**: Apple HIG 在所有裝置使用統一字級，不做響應式字級縮放
**Migration**: 刪除 `@media (min-width: 768px)` 中的 `--fs-*` 覆寫區塊
