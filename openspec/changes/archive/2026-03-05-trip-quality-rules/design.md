## Context

目前行程品質規則內嵌在 `tp-rebuild.md`（48 行），部分規則沒有正式定義。其他 skill（tp-check、tp-edit、tp-issue）以「參照 tp-rebuild」引用規則。用自然語言新建行程時，Claude 完全不知道這些規則，導致產出的 JSON 不通過品質檢查。

現有約束層：
- `CLAUDE.md`：26 行摘要，無行程品質規則
- `MEMORY.md`：38 行，無行程品質規則
- `.claude/commands/tp-rebuild.md`：唯一包含規則定義的檔案
- 無 `/tp-create` skill

## Goals / Non-Goals

**Goals:**
- 建立 `trip-quality-rules.md` 作為品質規則單一真相來源
- 新增 location、googleRating 正式定義
- 建立 `/tp-create` skill 供新建行程使用
- 在 `CLAUDE.md` 和 `MEMORY.md` 加入強制約束，確保自然語言產生行程也被攔截
- 所有行程 skill 統一引用 `trip-quality-rules.md`
- **約束層不寫死規則編號**，以「遵守 trip-quality-rules.md 中定義的所有品質規則」表述

**Non-Goals:**
- 不修改現有規則的內容（原文搬移，不改語意）
- 不修改 js/css/html/tests
- 不修改現有行程 JSON 資料
- 不改變 tp-check 的紅綠燈判定邏輯

## Decisions

### D1：規則檔位置——`.claude/commands/trip-quality-rules.md`

放在 `.claude/commands/` 而非 `openspec/specs/` 或 `docs/`。

理由：所有 skill 都在 `.claude/commands/`，引用路徑最短（同目錄相對引用）。`openspec/specs/` 是 spec-driven 流程的 formal specs，而這是 skill 之間共用的操作規則，性質不同。

### D2：引用方式——指向檔案而非寫死編號

各 skill、CLAUDE.md、MEMORY.md 統一用：
- 「遵守 `trip-quality-rules.md` 中定義的所有品質規則」
- **不寫死**「R1-R12」或具體編號

理由：未來新增 R13、R14 時，只需在 `trip-quality-rules.md` 追加，不需回頭修改所有引用處。

### D3：CLAUDE.md 與 MEMORY.md 的分工

| 層級 | 寫什麼 | 作用 |
|------|--------|------|
| CLAUDE.md | 一行規則摘要 | 專案級約束，所有協作者都看到 |
| MEMORY.md | 完整 skill 對照表 | 使用者級約束，每次對話載入 |

兩者都指向 `trip-quality-rules.md`，不重複定義規則內容，不寫死規則編號。

### D4：location 定義

timeline event 的實體地點（非 transit、非「餐廳未定」）SHOULD 含 `location` 物件，包含 `googleQuery` 和/或 `appleQuery` 用於地圖導航。採 warn 級（黃燈）。

理由：經緯度資料不容易在產生時就精確填入，先以 query string 為主。

### D5：googleRating 定義

實體地點類 timeline event 與所有餐廳 SHOULD 含 `googleRating`（1.0-5.0）。採 warn 級（黃燈）。

理由：已在 `google-rating` change 中定義並實作，此處只是將散落的定義整合進 `trip-quality-rules.md`。

### D6：tp-create skill 設計

新建行程的完整流程：
1. 詢問料理偏好
2. 讀取 `trip-quality-rules.md` 所有品質規則
3. 依使用者描述產生完整行程 JSON
4. 寫入 `data/trips/{slug}.json`
5. 更新 `data/trips.json` 索引
6. 執行 `npm test`
7. 執行 `/tp-check` 完整模式驗證
8. 不自動 commit

白名單：`data/trips/{slug}.json` + `data/trips.json`

## Risks / Trade-offs

[Claude 仍可能跳過規則] → CLAUDE.md + MEMORY.md 雙重約束降低機率，且 tp-check 作為最後防線驗證

[trip-quality-rules.md 過長] → 控制精簡定義，詳細 spec 仍在 openspec/specs/trip-enrich-rules/

[tp-create 產生的 JSON 品質仍有落差] → tp-check 在最後驗證，不通過可接 tp-rebuild 修正
