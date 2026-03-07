## ADDED Requirements

### Requirement: Cloudflare Pages 建置命令
`package.json` SHALL 有 `"build"` script，執行時 SHALL 自動對所有 `data/trips/*.json` 執行 split + build，產生 `data/dist/<slug>/` 多檔結構。

#### Scenario: 執行 npm run build
- **WHEN** 執行 `npm run build`
- **THEN** SHALL 對每個 `data/trips/*.json` 依序執行 `trip-split.js` 和 `trip-build.js`
- **THEN** `data/dist/` 下 SHALL 產生每個行程的多檔目錄

#### Scenario: 動態行程清單
- **WHEN** 新增或刪除 `data/trips/` 中的行程 JSON
- **THEN** `npm run build` SHALL 自動包含或排除該行程，不需手動修改 script
