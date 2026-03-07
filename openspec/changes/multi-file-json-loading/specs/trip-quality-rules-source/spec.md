## MODIFIED Requirements

### Requirement: 品質規則單一真相來源

`.claude/commands/trip-quality-rules.md` SHALL 包含所有行程品質規則的完整定義。所有行程操作 skill（tp-create、tp-rebuild、tp-rebuild-all、tp-edit、tp-issue、tp-check）SHALL 引用此檔案，不自行定義規則。

本次修改以下品質規則：
- Weather 驗證從頂層 `weather[]` 改為 per-day `days[].weather` 欄位
- `validateTripData()` SHALL 驗證各天的 `weather.locations[].lat`/`lon` 為 number
- 頂層 `weather` 存在 SHALL 視為驗證錯誤

#### Scenario: 規則檔包含 weather 驗證規則
- **WHEN** 讀取 `.claude/commands/trip-quality-rules.md`
- **THEN** SHALL 包含 per-day weather 欄位的驗證規則（lat/lon 為 number、locations 為陣列）

#### Scenario: 頂層 weather 視為錯誤
- **WHEN** 行程 JSON 含有頂層 `weather` 鍵
- **THEN** `validateTripData()` SHALL 報告錯誤

#### Scenario: 各 skill 引用規則檔
- **WHEN** tp-rebuild / tp-check / tp-edit / tp-issue / tp-rebuild-all / tp-create 參照品質規則
- **THEN** SHALL 以「遵守 `trip-quality-rules.md` 中定義的所有品質規則」引用，不內嵌規則定義，不寫死規則編號

#### Scenario: 新增規則時的擴充性
- **WHEN** 未來新增品質規則
- **THEN** SHALL 只需在 `trip-quality-rules.md` 追加，CLAUDE.md / MEMORY.md / 各 skill 不需同步修改
