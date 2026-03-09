# trip-planner 記憶索引

## 規則檔

- [rules-git.md](rules-git.md) — Git / Commit 工作流
- [rules-testing.md](rules-testing.md) — 測試觸發規則、目錄結構、實作細節
- [rules-ui.md](rules-ui.md) — UI 設計規範
- [rules-content.md](rules-content.md) — 內容撰寫 + MD 連動
- [rules-architecture.md](rules-architecture.md) — CSS/JS 拆分、桌機面板、交通統計、AI 修改流程
- [rules-md-format.md](rules-md-format.md) — 行程 MD 檔案格式定義（取代舊 JSON schema）
- [rules-agent.md](rules-agent.md) — Agent Teams 使用規範
- [rules-openspec.md](rules-openspec.md) — OpenSpec 開發流程規範

## 專案資訊

- Cloudflare Pages：https://trip-planner-dby.pages.dev/
- 資料流：`data/trips-md/{slug}/` → `npm run build` → `data/dist/{slug}/`（分檔 JSON）+ `data/dist/trips.json`（registry：slug/name/dates/owner）

## 使用者偏好

- Agent teammates 使用 sonnet 模型
- 僅程式碼/JSON 變更才跑測試
- 盡量使用 agent teams 並行處理
- 多 agent 並行修改檔案時，用 `isolation: "worktree"` 隔離避免衝突
- `/tp-rebuild` 和 `/tp-create` 不問問題，直接給最佳解法

## 現有行程（7 個）

| slug | owner | 類型 |
|------|-------|------|
| okinawa-trip-2026-Ray | Ray | 自駕 |
| okinawa-trip-2026-HuiYun | HuiYun | 自駕 |
| okinawa-trip-2026-RayHus | RayHus | 大眾運輸 |
| okinawa-trip-2026-AeronAn | AeronAn | 自駕 |
| banqiao-trip-2026-Onion | Onion | 大眾運輸 |
| busan-trip-2026-CeliaDemyKathy | CeliaDemyKathy | 大眾運輸 |
| kyoto-trip-2026-MimiChu | MimiChu | 大眾運輸 |

## 經驗筆記

- Node.js v22+ 內建 localStorage 與 jsdom 衝突 → `tests/setup.js` 用 in-memory mock 覆蓋
- `days[].date` 格式不一致：多數行程用 `M/D（曜）`，kyoto 用 ISO，template 用 ISO（暫不處理）
- GitHub API `state` 預設 `open`，查全部需帶 `&state=all`
- shared.css 捲動基礎設施為行程頁設計，新頁面需全面中和（詳見 CLAUDE.md）
- 記憶檔跨機同步：`scripts/memory-sync.sh`（export/import），hook 自動 export

