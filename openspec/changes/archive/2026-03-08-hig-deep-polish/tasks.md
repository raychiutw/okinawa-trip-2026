## 1. Color mode preview token 新增

- [x] 1.1 `css/shared.css` `:root`：新增 `--cmp-light-bg: #F5F5F5`、`--cmp-light-surface: #FFFFFF`、`--cmp-light-input: #E0E0E0`
- [x] 1.2 `css/shared.css` `:root`：新增 `--cmp-dark-bg: #1A1816`、`--cmp-dark-surface: #292624`、`--cmp-dark-input: #3D3A37`
- [x] 1.3 `css/setting.css`：`.color-mode-light .cmp-top` background 從 `#F5F5F5` 改為 `var(--cmp-light-bg)`
- [x] 1.4 `css/setting.css`：`.color-mode-light .cmp-bottom` background 從 `#FFFFFF` 改為 `var(--cmp-light-surface)`
- [x] 1.5 `css/setting.css`：`.color-mode-light .cmp-input` background 從 `#E0E0E0` 改為 `var(--cmp-light-input)`
- [x] 1.6 `css/setting.css`：`.color-mode-dark .cmp-top` background 從 `#1A1816` 改為 `var(--cmp-dark-bg)`
- [x] 1.7 `css/setting.css`：`.color-mode-dark .cmp-bottom` background 從 `#292624` 改為 `var(--cmp-dark-surface)`
- [x] 1.8 `css/setting.css`：`.color-mode-dark .cmp-input` background 從 `#3D3A37` 改為 `var(--cmp-dark-input)`
- [x] 1.9 `css/setting.css`：`.color-mode-auto .cmp-top` gradient 從 `#F5F5F5`/`#1A1816` 改為 `var(--cmp-light-bg)`/`var(--cmp-dark-bg)`
- [x] 1.10 `css/setting.css`：`.color-mode-auto .cmp-bottom` gradient 從 `#FFFFFF`/`#292624` 改為 `var(--cmp-light-surface)`/`var(--cmp-dark-surface)`
- [x] 1.11 `css/setting.css`：`.color-mode-auto .cmp-input` gradient 從 `#E0E0E0`/`#3D3A37` 改為 `var(--cmp-light-input)`/`var(--cmp-dark-input)`

## 2. 硬編碼 #fff → token

- [x] 2.1 `css/style.css`：`.driving-stats-badge` color 從 `#fff` 改為 `var(--text-on-accent)`
- [x] 2.2 `css/edit.css`：`.edit-send-btn:not(:disabled)` color 從 `#fff` 改為 `var(--text-on-accent)`
- [x] 2.3 `css/edit.css`：`.issue-badge` color 從 `#fff` 改為 `var(--text-on-accent)`

## 3. Hover transition 補齊

- [x] 3.1 `css/style.css`：`.dn` 新增 `transition: background var(--duration-fast), color var(--duration-fast)`
- [x] 3.2 `css/style.css`：`.col-row` 新增 `transition: background var(--duration-fast)`
- [x] 3.3 `css/style.css`：`.map-link` 新增 `transition: background var(--duration-fast), color var(--duration-fast)`
- [x] 3.4 `css/style.css`：`.hw-summary` 新增 `transition: color var(--duration-fast)`
- [x] 3.5 `css/style.css`：`.trip-error-link` 新增 `transition: filter var(--duration-fast)`

## 4. 毛玻璃一致性

- [x] 4.1 `css/edit.css`：`.chat-container .sticky-nav` 移除 `background: var(--bg)`（保留 `border-bottom`）
- [x] 4.2 `css/setting.css`：`.page-setting .sticky-nav` 移除 `background: var(--bg)`（保留 `border-bottom`）

## 5. Active ring 統一

- [x] 5.1 `css/setting.css`：`.color-mode-card.active` box-shadow 從 `0 0 0 1px var(--accent)` 改為 `var(--shadow-ring)`

## 6. Icon 尺寸上 4pt grid

- [x] 6.1 `css/style.css`：`.map-link .apple-icon` width/height 從 `14px` 改為 `16px`
- [x] 6.2 `css/style.css`：`.map-link .apple-icon svg` width/height 從 `14px` 改為 `16px`
- [x] 6.3 `css/style.css`：`.map-link-inline .apple-icon, .map-link-inline .apple-icon svg` width/height 從 `11px` 改為 `12px`
- [x] 6.4 `css/edit.css`：`.issue-badge .svg-icon` width/height 從 `14px` 改為 `12px`

## 7. 4pt grid — style.css Desktop

- [x] 7.1 `.dn` padding 從 `6px 12px` 改為 `8px 12px`
- [x] 7.2 `.ov-card h4` padding-left 從 `18px` 改為 `16px`
- [x] 7.3 `.weather-list li` padding 從 `3px 0` 改為 `4px 0`
- [x] 7.4 `.weather-list li` gap 從 `6px` 改為 `8px`
- [x] 7.5 `.tl-flag` gap 從 `6px` 改為 `8px`
- [x] 7.6 `.tl-duration` gap 從 `3px` 改為 `4px`
- [x] 7.7 `.nav-links` margin 從 `6px 0` 改為 `8px 0`
- [x] 7.8 `.tl-blog` margin-top 從 `2px` 改為 `4px`
- [x] 7.9 `.tl-body` padding 從 `4px 0 2px` 改為 `4px 0 4px`
- [x] 7.10 `.restaurant-choice` padding 從 `10px 0` 改為 `12px 0`
- [x] 7.11 `.restaurant-meta` margin-top 從 `3px` 改為 `4px`
- [x] 7.12 `.hotel-detail-grid` gap 從 `6px 16px` 改為 `8px 16px`
- [x] 7.13 `.notes-list li` padding 從 `2px 0` 改為 `4px 0`
- [x] 7.14 `.notes-list li` gap 從 `6px` 改為 `8px`
- [x] 7.15 `.driving-stats-detail` gap 從 `4px 10px` 改為 `4px 12px`
- [x] 7.16 `.driving-summary-header` padding 從 `10px 8px 10px 0` 改為 `12px 8px 12px 0`
- [x] 7.17 `.driving-summary-body` padding 從 `4px 0 10px` 改為 `4px 0 12px`
- [x] 7.18 `.driving-summary-day-header` padding 從 `6px 0` 改為 `8px 0`
- [x] 7.19 `.driving-summary-day-body` padding 從 `2px 0 6px` 改為 `4px 0 8px`
- [x] 7.20 `.trip-warnings` padding 從 `10px 14px` 改為 `12px 16px`
- [x] 7.21 `.trip-warning-item` margin-bottom 從 `6px` 改為 `8px`
- [x] 7.22 `.suggestion-card h4` margin 從 `0 0 6px` 改為 `0 0 8px`
- [x] 7.23 `.suggestion-card p` margin 從 `3px 0` 改為 `4px 0`
- [x] 7.24 `.trip-error-link` padding 從 `10px 24px` 改為 `12px 24px`
- [x] 7.25 `.stats-card-title` margin-bottom 從 `10px` 改為 `12px`
- [x] 7.26 `.info-label` margin-bottom 從 `10px` 改為 `12px`
- [x] 7.27 `.day-overview .col-row` padding 從 `10px 0` 改為 `12px 0`
- [x] 7.28 `.day-overview .driving-stats` padding 從 `10px 0 0` 改為 `12px 0 0`
- [x] 7.29 `.countdown-date` margin-top 從 `2px` 改為 `4px`
- [x] 7.30 `.hw-block-time` margin-bottom 從 `2px` 改為 `4px`
- [x] 7.31 `.hw-block-loc` padding 從 `1px 5px` 改為 `4px 8px`
- [x] 7.32 `.hw-grid` padding-top 從 `2px` 改為 `4px`
- [x] 7.33 `.dh-nav` padding 從 `2px 0` 改為 `4px 0`
- [x] 7.34 `.status-tag` padding 從 `2px 8px` 改為 `4px 8px`
- [x] 7.35 `.driving-stats-badge` padding 從 `1px 8px` 改為 `4px 8px`
- [x] 7.36 `.transport-type-label` margin-bottom 從 `2px` 改為 `4px`
- [x] 7.37 `.suggestion-card p` margin-bottom 從 `3px` 改為 `4px`（desktop 時 `.info-box-grid .restaurant-choice:last-child` padding-bottom 從 `10px` 改為 `12px`）
- [x] 7.38 `.flight-info` gap 從 `4px 10px` 改為 `4px 12px`

## 8. 4pt grid — style.css Mobile (@media max-width: 600px)

- [x] 8.1 `.day-header` padding 從 `6px 8px` 改為 `8px 8px`
- [x] 8.2 `.day-overview` padding 從 `10px` 改為 `12px`
- [x] 8.3 `.tl-card` padding 從 `8px 10px` 改為 `8px 12px`
- [x] 8.4 `.tl-transit-content` padding 從 `5px 10px` 改為 `4px 12px`
- [x] 8.5 `.info-box` padding 從 `6px 10px` 改為 `8px 12px`
- [x] 8.6 `.hw-grid` gap 從 `5px` 改為 `4px`
- [x] 8.7 `.dh-nav` gap 從 `2px` 改為 `4px`

## 9. 4pt grid — edit.css

- [x] 9.1 `.issue-reply` margin-top 從 `6px` 改為 `8px`
- [x] 9.2 `.issue-reply h2, .issue-reply h3` margin 從 `12px 0 6px` 改為 `12px 0 8px`
- [x] 9.3 `.issue-reply th, .issue-reply td` padding 從 `6px 10px` 改為 `8px 12px`
- [x] 9.4 `.issue-reply blockquote` padding 從 `6px 12px` 改為 `8px 12px`
- [x] 9.5 `.issue-reply pre` padding 從 `10px` 改為 `12px`
- [x] 9.6 `.issue-reply code` padding 從 `1px 4px` 改為 `4px 4px`
- [x] 9.7 `.edit-input-toolbar` margin-top 從 `6px` 改為 `8px`

## 10. 4pt grid — setting.css

- [x] 10.1 `.setting-section-title` margin-bottom 從 `10px` 改為 `12px`
- [x] 10.2 `.cmp-bottom` padding 從 `0 6px` 改為 `0 8px`

## 11. CSS HIG 回歸測試

- [x] 11.1 新增 `tests/unit/css-hig.test.js`：讀取全站 CSS 檔案的基礎設施
- [x] 11.2 測試：transition duration 無硬編碼（排除 `:root` 定義）
- [x] 11.3 測試：無硬編碼 `#fff` 在 accent 上下文（排除品牌/print）
- [x] 11.4 測試：font-size 使用 `var(--fs-*)` token（排除 `:root` 定義和 em/% 相對單位）
- [x] 11.5 測試：padding/margin/gap px 值符合 4pt grid（含 allow-list 排除機制）
- [x] 11.6 測試：`.sticky-nav` 無 solid `var(--bg)` 或 `rgba(` 背景（排除 print）
- [x] 11.7 測試：color mode preview 使用 `var(--cmp-*)` token
- [x] 11.8 測試：`.color-mode-card.active` 使用 `var(--shadow-ring)`
- [x] 11.9 執行 `npm test` 確認全部通過（含新測試 + 既有 569 tests）
