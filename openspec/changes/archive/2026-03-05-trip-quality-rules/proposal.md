## Why

用自然語言請 Claude 產生行程 JSON 時，產出結果經常不符合品質規則（缺 blogUrl、缺 googleRating、缺 location、購物結構不完整等）。根因：品質規則只內嵌在 `tp-rebuild.md` 裡，部分規則甚至沒有正式定義。新建行程時 Claude 完全不知道這些規則存在。

## What Changes

- **新建 `.claude/commands/trip-quality-rules.md`**：將品質規則提取為獨立檔案，作為單一真相來源（Single Source of Truth）
  - 現有規則從 `tp-rebuild.md` 搬出
  - 地圖導航（location）新增正式定義
  - Google 評分（googleRating）新增正式定義
  - 未來新增規則只需在此檔案追加，不需修改其他 skill 或約束層
- **新建 `.claude/commands/tp-create.md`**：新增行程 skill，從零產生行程 JSON 時強制引用品質規則
- **修改 `CLAUDE.md`**：開發規則加入行程品質約束，指向 `trip-quality-rules.md`（不寫死規則編號）
- **修改 `MEMORY.md`**：新增「行程 JSON 品質規則（強制）」section，確保自然語言產生行程時也被攔截（不寫死規則編號）
- **修改既有 skill**（tp-rebuild / tp-rebuild-all / tp-check / tp-edit / tp-issue）：移除內嵌規則或「參照 tp-rebuild」，統一改為引用 `trip-quality-rules.md`

## Capabilities

### New Capabilities
- `trip-quality-rules-source`: 品質規則獨立檔案，所有行程操作 skill 的共用規則來源
- `tp-create-skill`: 新建行程 skill，引用品質規則從零產生符合標準的行程 JSON

### Modified Capabilities
- `trip-enrich-rules`: 新增 location、googleRating 正式定義，規則來源改為獨立檔案

## Impact

- **影響檔案範圍**：僅 `.claude/commands/*.md`、`CLAUDE.md`、`MEMORY.md`（全部為文件）
- **不影響**：js / css / html / data/trips/*.json / tests/
- **不需跑測試**：純文件變更
- **不涉及 JSON 結構變更**：無 checklist/backup/suggestions 連動影響
- **擴充性**：未來新增品質規則只需在 `trip-quality-rules.md` 追加，CLAUDE.md / MEMORY.md / 各 skill 不需同步修改
