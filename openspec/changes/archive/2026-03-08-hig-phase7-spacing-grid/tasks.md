## 1. css/shared.css 間距修正

- [x] 1.1 逐一檢查 padding/margin/gap，將 2→4, 3→4, 5→4, 6→8, 10→12, 14→16
- [x] 1.2 確認 scrollbar 的 6px 不改

## 2. css/style.css 間距修正（最大量）

- [x] 2.1 Day Header 區：`.day-header` padding/gap、`.dh-nav` gap(6→8)、`.dh-nav-arrow` padding
- [x] 2.2 Timeline 區：`.tl-flag` padding(5→4)、`.tl-segment` padding/margin、`.tl-card` padding(10→12, 14→16)、`.tl-transit-content` padding(6→8, 14→16)
- [x] 2.3 天氣區：`.hw-grid` gap(6→8)、`.hw-block` padding(6→8)、`.hw-block-loc` padding
- [x] 2.4 Collapsible 區：`.col-row` padding(10→12)、`.col-detail` padding(10→12)
- [x] 2.5 Flight 區：`.flight-row` padding(10→12, 12→12)、`.flight-info` gap
- [x] 2.6 Info Box 區：`.info-box` margin(6→8)、`.restaurant-choice` padding(10→12)
- [x] 2.7 Overview 區：`.ov-card` padding(14→16)、`.ov-grid` gap
- [x] 2.8 Suggestion 區：`.suggestion-card` padding、`.sg-priority-*` padding(10→12)
- [x] 2.9 Nav Actions 區：`.nav-action-btn` padding(6→8)、`.nav-actions` gap
- [x] 2.10 Speed Dial 區：`.speed-dial-items` gap
- [x] 2.11 Bottom Sheet 區：`.info-sheet-panel` padding、`.sheet-header` gap/margin
- [x] 2.12 Info Panel 區：`.info-panel` padding、`.info-card` padding/margin
- [x] 2.13 Footer 區：footer padding
- [x] 2.14 其他零散：`.driving-stats` margin/padding、`.notes-list` padding/margin、`.map-link` padding/margin、`.hotel-sub` margin/padding

## 3. css/edit.css 間距修正

- [x] 3.1 `.chat-messages` padding
- [x] 3.2 `.chat-messages-inner` gap
- [x] 3.3 `.issue-item` padding
- [x] 3.4 `.edit-input-bar` padding
- [x] 3.5 `.edit-input-card` padding
- [x] 3.6 `.edit-textarea` padding

## 4. css/setting.css 間距修正

- [x] 4.1 `.setting-section` margin
- [x] 4.2 `.setting-section-title` margin/padding
- [x] 4.3 `.color-mode-grid` gap(10→12)
- [x] 4.4 `.color-mode-card` padding/gap(6→8, 10→12)

## 5. 驗證

- [x] 5.1 手機版逐頁視覺確認（index → edit → setting）
- [x] 5.2 桌面版逐頁視覺確認
- [x] 5.3 深色模式視覺確認
- [x] 5.4 執行測試確認無 regression
