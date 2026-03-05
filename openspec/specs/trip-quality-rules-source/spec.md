## ADDED Requirements

### Requirement: 品質規則單一真相來源

`.claude/commands/trip-quality-rules.md` SHALL 包含所有行程品質規則的完整定義。所有行程操作 skill（tp-create、tp-rebuild、tp-rebuild-all、tp-edit、tp-issue、tp-check）SHALL 引用此檔案，不自行定義規則。

#### Scenario: 規則檔包含所有品質規則
- **WHEN** 讀取 `.claude/commands/trip-quality-rules.md`
- **THEN** SHALL 包含所有品質規則的完整定義（目前為 R1 至 R12，未來可擴充）

#### Scenario: 各 skill 引用規則檔
- **WHEN** tp-rebuild / tp-check / tp-edit / tp-issue / tp-rebuild-all / tp-create 參照品質規則
- **THEN** SHALL 以「遵守 `trip-quality-rules.md` 中定義的所有品質規則」引用，不內嵌規則定義，不寫死規則編號

#### Scenario: 新增規則時的擴充性
- **WHEN** 未來新增品質規則（如 R13、R14）
- **THEN** SHALL 只需在 `trip-quality-rules.md` 追加，CLAUDE.md / MEMORY.md / 各 skill 不需同步修改

### Requirement: CLAUDE.md 行程品質約束

`CLAUDE.md` 開發規則 SHALL 包含行程品質約束條目，指向 `trip-quality-rules.md`，不寫死規則編號。

#### Scenario: CLAUDE.md 含品質規則引用
- **WHEN** 讀取 `CLAUDE.md` 的開發規則
- **THEN** SHALL 包含一條明確指出「產生或修改行程 JSON 須遵守 `trip-quality-rules.md` 中的所有品質規則」，不出現「R1-R12」等硬編碼編號

### Requirement: MEMORY.md 行程品質強制約束

`MEMORY.md` SHALL 包含「行程 JSON 品質規則（強制）」section，明確列出所有行程操作對應的 skill 及品質規則引用，不寫死規則編號。

#### Scenario: MEMORY.md 含品質規則 section
- **WHEN** 讀取 `MEMORY.md`
- **THEN** SHALL 包含 section 明確要求：產生或修改 `data/trips/*.json` 時，無論透過 skill 或自然語言，必須遵守 `trip-quality-rules.md` 中定義的所有品質規則

#### Scenario: MEMORY.md 含 skill 對照表
- **WHEN** 讀取 `MEMORY.md` 的品質規則 section
- **THEN** SHALL 列出：新增用 tp-create、修改用 tp-edit、Issue 用 tp-issue、重建單一用 tp-rebuild、重建全部用 tp-rebuild-all、檢查用 tp-check
