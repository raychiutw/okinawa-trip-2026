## 1. :root 字級變數替換

- [x] 1.1 `css/shared.css` `:root`：移除 `--fs-display`、`--fs-lg`、`--fs-md`、`--fs-sm` 四個舊變數
- [x] 1.2 `css/shared.css` `:root`：新增 11 個 Apple text style 變數（`--fs-large-title` 至 `--fs-caption2`）
- [x] 1.3 `css/shared.css` `:root`：`--content-max-w: 800px` → `720px`
- [x] 1.4 `css/shared.css` `body`：`font-size: var(--fs-md)` → `var(--fs-body)`

## 2. 移除桌面版字級覆寫

- [x] 2.1 `css/shared.css`：刪除 `@media (min-width: 768px)` 中的 `--fs-display`、`--fs-lg`、`--fs-md`、`--fs-sm` 覆寫區塊

## 3. css/shared.css 元素字級重新分配

- [x] 3.1 `.trip-btn`：`var(--fs-md)` → `var(--fs-body)`
- [x] 3.2 `.trip-btn strong`：`var(--fs-lg)` → `var(--fs-title3)`
- [x] 3.3 `.trip-btn .trip-sub`：`var(--fs-sm)` → `var(--fs-caption)`
- [x] 3.4 `.nav-title`：`var(--fs-lg)` → `var(--fs-title3)`

## 4. css/style.css 元素字級重新分配（display / lg 區）

- [x] 4.1 `.nav-brand a`：`var(--fs-display)` → `var(--fs-large-title)`
- [x] 4.2 `.countdown-number`：`var(--fs-display)` → `var(--fs-large-title)`
- [x] 4.3 `.day-header h2`：`var(--fs-lg)` → `var(--fs-title2)`
- [x] 4.4 `.tl-title`：`var(--fs-lg)` → `var(--fs-title3)`
- [x] 4.5 `.flight-route`：`var(--fs-lg)` → `var(--fs-title3)`
- [x] 4.6 `.flight-icon`：`var(--fs-lg)` → `var(--fs-title3)`
- [x] 4.7 `.hw-block-icon`：`var(--fs-lg)` → `var(--fs-title3)`
- [x] 4.8 `footer h3`：`var(--fs-lg)` → `var(--fs-title3)`
- [x] 4.9 `.trip-error p`：`var(--fs-lg)` → `var(--fs-title2)`
- [x] 4.10 `.stats-card-title`：`var(--fs-lg)` → `var(--fs-title3)`
- [x] 4.11 `.info-label`：`var(--fs-lg)` → `var(--fs-title3)`
- [x] 4.12 info-sheet header：`var(--fs-lg)` → `var(--fs-title3)`
- [x] 4.13 `.dn`（day pills）：`var(--fs-lg)` → `var(--fs-body)`
- [x] 4.14 overview `.ov-card` 內標題（若有 `--fs-lg`）：→ `var(--fs-title3)`

## 5. css/style.css 元素字級重新分配（md → body / callout / subheadline）

- [x] 5.1 正文區塊 → `var(--fs-body)`：`.ov-card p`、`.col-detail`、`.tl-body`、`.info-box`、`.suggestion-card p`、`.notes-list li`、`.driving-summary-body`、`.info-sheet-body`
- [x] 5.2 次要描述 → `var(--fs-callout)`：`footer p`、`.footer-exchange`、`.flight-time`、`.tl-desc`、`.restaurant-meta`、`.driving-stats`、`.driving-stats-detail`、`.driving-summary-day`、`.trip-warnings`、`.trip-warning-item`、`.weather-list li`、`.hw-block-temp`、`.hw-block-rain`、`.hw-loading`、`.hw-error`、`.countdown-label`、`.countdown-date`、`.stats-row`、`.map-link`、`.map-link-inline`、`.print-exit-btn`、`.trip-error-link`
- [x] 5.3 副標籤 → `var(--fs-subheadline)`：`.dh-date`、`.hourly-weather-title`、`.hw-update-time`、`.hw-block-time`、`.hw-block-loc`、`.hw-summary`、`.hw-summary-arrow`、`.col-row .arrow`、`.nav-brand`
- [x] 5.4 粗體強調 → `var(--fs-headline)`：`.flight-label`、`.transport-type-summary`、`.status-tag`

## 6. css/style.css 元素字級重新分配（sm → footnote / caption）

- [x] 6.1 中繼資訊 → `var(--fs-footnote)`：`.tl-flag`、`.tl-duration`、`.tl-transit-content`、`.tl-blog`、`.driving-stats-badge`、`.nav-action-btn`、`.map-link .g-icon`、`.map-link .n-icon`、`.map-link-inline .g-icon`、`.map-link-inline .n-icon`
- [x] 6.2 最小文字 → `var(--fs-caption)`：`.rating`

## 7. css/edit.css 元素字級重新分配

- [x] 7.1 所有 `var(--fs-sm)` → `var(--fs-footnote)`（issue-badge、issue-date、issue-status、issue-no、issue-reply code 等）
- [x] 7.2 所有 `var(--fs-md)` → `var(--fs-body)` 或 `var(--fs-callout)`（依角色判斷）
- [x] 7.3 `.issue-reply h2, h3`：`var(--fs-lg)` → `var(--fs-title3)`
- [x] 7.4 `var(--fs-sm, var(--fs-md))` fallback 寫法 → 統一為 `var(--fs-footnote)`

## 8. css/setting.css 元素字級重新分配

- [x] 8.1 所有 `var(--fs-sm)` → `var(--fs-footnote)`
- [x] 8.2 所有 `var(--fs-md)` → `var(--fs-body)` 或 `var(--fs-callout)`（依角色判斷）

## 9. 文件更新

- [x] 9.1 `CLAUDE.md` 字型規範段落：「全站僅四級 font-size」→ 更新為 11 級 Apple text style 系統說明
- [x] 9.2 `openspec/config.yaml` context：更新字型規範描述

## 10. 驗證

- [x] 10.1 確認全站無 `var(--fs-display)`、`var(--fs-lg)`、`var(--fs-md)`、`var(--fs-sm)` 的殘留引用
- [x] 10.2 確認全站無 `@media` 覆寫 `--fs-*` 變數的規則
- [x] 10.3 確認 `--content-max-w` 為 720px
- [x] 10.4 視覺確認淺色/深色模式三頁外觀合理（字級層次分明）
- [x] 10.5 執行測試確認無 regression
