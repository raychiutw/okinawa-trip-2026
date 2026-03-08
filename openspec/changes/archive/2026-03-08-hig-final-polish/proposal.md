## Why

Phase 0-10 的 HIG 合規改造完成了 token 系統建設（11 級字級、語意色彩、44px 觸控目標、Apple easing curve），但 Steve Jobs 級的審查發現至少 5 類細節漏洞：token 定義完但未貫徹使用、淺/深模式行為不一致、地圖連結觸控目標不達標、spacing 不在 4pt grid 上、config.yaml 規範描述過時。這些破壞了系統性一致性，需要一次性收尾。

## What Changes

- **寫死的 transition duration 全部替換為 token**：`0.15s` → `var(--duration-fast)`、`0.2s` → `var(--duration-fast)`、`0.3s ease` → `var(--duration-slow) var(--ease-apple)`，共 5+ 處
- **nav bar 淺/深模式行為統一**：決定兩邊都用毛玻璃（半透明 + backdrop-filter），消除 style.css 中淺色模式覆寫為不透明的問題
- **map-link / map-link-inline 觸控目標達標**：`height: 28px` → `min-height: var(--tap-min)`、`height: 22px` → 移除固定高度改用 padding 達到 44px
- **dh-nav-arrow 觸控目標達標**：`min-width: 28px` → `min-width: var(--tap-min)`
- **scrollbar 色碼納入 token 系統**：6 個寫死色碼改用語意變數或新增 `--scrollbar-thumb` / `--scrollbar-thumb-hover` token
- **spacing 修正到 4pt grid**：`14px` → `16px`、`18px` → `16px`、`3px` → `4px`、`28px` → 移除（改用 min-height）等
- **移除 `body { max-width: 100vw }`**：`html { overflow-x: clip }` 已足夠
- **更新 openspec/config.yaml**：context 段落更新為 11 級 Apple text style 系統、新增 HIG token 使用規範到 design rules
- **更新 CLAUDE.md**：同步 config.yaml 的規範變更

## Capabilities

### New Capabilities
- `hig-token-discipline`: 確保全站 CSS 無寫死的 duration / color / spacing — 所有值必須經由 token 系統

### Modified Capabilities
- `design-tokens`: 新增 scrollbar token（`--scrollbar-thumb` / `--scrollbar-thumb-hover`），nav bar 背景改為 token 化的半透明值

## Impact

- **CSS**：`shared.css`、`style.css`、`edit.css`、`setting.css` — transition、spacing、height、background 修正
- **HTML**：無需變更
- **JS**：無需變更
- **JSON**：無需變更
- **Config**：`openspec/config.yaml` context + design rules 更新
- **Docs**：`CLAUDE.md` 同步更新
