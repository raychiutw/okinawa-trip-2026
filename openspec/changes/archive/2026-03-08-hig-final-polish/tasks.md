## 1. Scrollbar token 新增

- [x] 1.1 `css/shared.css` `:root`：新增 `--scrollbar-thumb: #C4C0BB` 和 `--scrollbar-thumb-hover: #B0ABA6`
- [x] 1.2 `css/shared.css` `body.dark`：新增 `--scrollbar-thumb: #5A5651` 和 `--scrollbar-thumb-hover: #6A6560`
- [x] 1.3 `css/shared.css`：`:root` 的 `scrollbar-color` 改為 `var(--scrollbar-thumb) transparent`
- [x] 1.4 `css/shared.css`：`::-webkit-scrollbar-thumb` background 改為 `var(--scrollbar-thumb)`
- [x] 1.5 `css/shared.css`：`::-webkit-scrollbar-thumb:hover` background 改為 `var(--scrollbar-thumb-hover)`
- [x] 1.6 `css/shared.css`：移除 `body.dark` 的 `scrollbar-color` 獨立宣告（token 自動覆寫）
- [x] 1.7 `css/shared.css`：移除 `body.dark ::-webkit-scrollbar-thumb` 和 `body.dark ::-webkit-scrollbar-thumb:hover` 獨立宣告

## 2. Nav bar 毛玻璃統一

- [x] 2.1 `css/shared.css`：`.sticky-nav` background 從 `rgba(250, 249, 245, 0.85)` 改為 `color-mix(in srgb, var(--bg) 85%, transparent)`
- [x] 2.2 `css/style.css`：`.sticky-nav` 覆寫中移除 `background: var(--bg)`，保留其他屬性（border-radius、padding、gap、margin、border-bottom）
- [x] 2.3 `css/style.css`：`body.dark .sticky-nav` 移除 `background: rgba(26, 26, 26, 0.85)`（改由 shared.css 的 color-mix + dark mode token 自動處理）

## 3. Transition duration token 化

- [x] 3.1 `css/shared.css`：`body` transition 從 `background-color 0.3s ease, color 0.3s ease` 改為 `background-color var(--duration-slow) var(--ease-apple), color var(--duration-slow) var(--ease-apple)`
- [x] 3.2 `css/style.css`：`.dh-nav-wrap::before/after` transition 從 `opacity 0.2s` 改為 `opacity var(--duration-fast)`
- [x] 3.3 `css/style.css`：`.sheet-close-btn` transition 從 `background 0.15s, color 0.15s` 改為 `background var(--duration-fast), color var(--duration-fast)`
- [x] 3.4 `css/setting.css`：`.color-mode-card` transition 從 `border-color 0.15s, box-shadow 0.15s` 改為 `border-color var(--duration-fast), box-shadow var(--duration-fast)`

## 4. 觸控目標修正

- [x] 4.1 `css/style.css`：`.map-link` 移除 `height: 28px`，新增 `min-height: var(--tap-min)`，padding 從 `4px 8px` 改為 `8px 12px`
- [x] 4.2 `css/style.css`：`.map-link-inline` 移除 `height: 22px`，新增 `min-height: var(--tap-min)`，padding 從 `1px 6px` 改為 `8px 8px`
- [x] 4.3 `css/style.css`：`.dh-nav-arrow` min-width 從 `28px` 改為 `var(--tap-min)`

## 5. Spacing 4pt grid 修正

- [x] 5.1 `css/style.css`：`.tl-segment` margin-left 從 `14px` 改為 `12px`
- [x] 5.2 `css/style.css`：`.tl-segment` padding-left 從 `18px` 改為 `16px`
- [x] 5.3 `css/style.css`：`.tl-segment-transit` padding-left 從 `18px` 改為 `16px`（如果存在）
- [x] 5.4 `css/style.css`：`.map-link` margin-bottom 從 `3px` 改為 `4px`
- [x] 5.5 `css/style.css`：`.tl-flag-num` width/height 從 `18px` 改為 `20px`
- [x] 5.6 `css/style.css`（mobile）：`.tl-segment` margin-left 從 `10px` 改為 `12px`
- [x] 5.7 `css/style.css`（mobile）：`.tl-segment` padding-left 從 `14px` 改為 `12px`
- [x] 5.8 `css/style.css`（mobile）：`.tl-segment-transit` padding-left 從 `14px` 改為 `12px`（如果存在）

## 6. 移除無效屬性

- [x] 6.1 `css/shared.css`：`body` 規則中移除 `max-width: 100vw`

## 7. 規範文件更新

- [x] 7.1 `openspec/config.yaml` context 段：將「全站僅四級 font-size — --fs-display/lg/md/sm」更新為 11 級 Apple text style 系統描述
- [x] 7.2 `openspec/config.yaml` design rules：移除舊的 `font-size 僅允許 var(--fs-display/lg/md/sm) 四級` 規則
- [x] 7.3 `openspec/config.yaml` design rules：新增 `font-size 僅允許 11 級 Apple text style token（--fs-large-title 至 --fs-caption2），禁止硬編碼 px/rem/em`
- [x] 7.4 `openspec/config.yaml` design rules：新增 `transition duration 僅允許 var(--duration-fast/normal/slow)，禁止硬編碼秒數`
- [x] 7.5 `openspec/config.yaml` design rules：新增 `spacing 值須為 4pt grid（4 的倍數），裝飾元素除外`
- [x] 7.6 `openspec/config.yaml` design rules：新增 `互動元素須達 44px 最小觸控目標（var(--tap-min)）`
- [x] 7.7 `CLAUDE.md`：同步 config.yaml 變更到 CLAUDE.md 的 UI 規範段落

## 8. 驗證

- [x] 8.1 grep 確認全站 CSS 無硬編碼 transition duration（排除 `:root` 定義）
- [x] 8.2 grep 確認 scrollbar 樣式無硬編碼色碼
- [x] 8.3 grep 確認 `.sticky-nav` 無 `rgba(` 背景
- [x] 8.4 確認 `body` 無 `max-width` 屬性
- [x] 8.5 執行 `npm test` 確認無 regression
