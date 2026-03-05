## 1. 建立品質規則檔

- [x] 1.1 新建 `.claude/commands/trip-quality-rules.md`：從 `tp-rebuild.md` 搬出現有品質規則定義
- [x] 1.2 在 `trip-quality-rules.md` 新增地圖導航（location）正式定義
- [x] 1.3 在 `trip-quality-rules.md` 新增 Google 評分（googleRating）正式定義

## 2. 新建 tp-create skill

- [x] 2.1 新建 `.claude/commands/tp-create.md`：定義新建行程流程（詢問偏好 → 產生 JSON → 寫入檔案 → 更新索引 → npm test → tp-check）
- [x] 2.2 tp-create 引用 `trip-quality-rules.md` 所有品質規則，白名單為 `data/trips/{slug}.json` + `data/trips.json`

## 3. 約束層寫入

- [x] 3.1 修改 `CLAUDE.md`：開發規則新增「行程品質」條目，指向 `trip-quality-rules.md`（不寫死規則編號）
- [x] 3.2 修改 `CLAUDE.md`：專案結構的 commands 清單加上 `trip-quality-rules.md` 和 `tp-create.md`
- [x] 3.3 修改 `MEMORY.md`：新增「行程 JSON 品質規則（強制）」section，含 skill 對照表（不寫死規則編號）

## 4. 既有 skill 引用統一

- [x] 4.1 修改 `tp-rebuild.md`：移除內嵌規則定義，改為引用 `trip-quality-rules.md` 所有品質規則
- [x] 4.2 修改 `tp-check.md`：「定義在 /tp-rebuild 中」改為引用 `trip-quality-rules.md`
- [x] 4.3 修改 `tp-edit.md`：「定義在 /tp-rebuild 中」改為引用 `trip-quality-rules.md`
- [x] 4.4 修改 `tp-issue.md`：「定義在 /tp-rebuild 中」改為引用 `trip-quality-rules.md`
- [x] 4.5 修改 `tp-rebuild-all.md`：「定義在 /tp-rebuild 中」改為引用 `trip-quality-rules.md`
