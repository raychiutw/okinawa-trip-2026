## MODIFIED Requirements

### Requirement: 品質規則單一真相來源

`.claude/commands/trip-quality-rules.md` SHALL 包含所有行程品質規則的完整定義。所有行程操作 skill（tp-create、tp-rebuild、tp-rebuild-all、tp-edit、tp-issue、tp-check）SHALL 引用此檔案，不自行定義規則。

本次新增以下品質規則：
- Google Maps URL 格式 SHALL 為 `https://www.google.com/maps/search/<percent-encoded>`
- `location.name` SHALL 為必填，店名含分店名
- Hotel、restaurant、shop、event、parking SHALL 有 `note` 欄位（空值 `""`）
- Hotel、restaurant、shop、gasStation、event SHALL 有 `source` 欄位
- 最後一天 SHALL 不設 hotel
- R0 例外：`breakfast.included` SHALL 允許 `null`
- 所有 flights SHALL 有 `airline` 欄位

#### Scenario: 規則檔包含所有品質規則
- **WHEN** 讀取 `.claude/commands/trip-quality-rules.md`
- **THEN** SHALL 包含所有品質規則的完整定義，包括新增的 URL 格式、必填欄位、最後一天無 hotel 等規則

#### Scenario: 各 skill 引用規則檔
- **WHEN** tp-rebuild / tp-check / tp-edit / tp-issue / tp-rebuild-all / tp-create 參照品質規則
- **THEN** SHALL 以「遵守 `trip-quality-rules.md` 中定義的所有品質規則」引用，不內嵌規則定義，不寫死規則編號

#### Scenario: 新增規則時的擴充性
- **WHEN** 未來新增品質規則
- **THEN** SHALL 只需在 `trip-quality-rules.md` 追加，CLAUDE.md / MEMORY.md / 各 skill 不需同步修改
