---
name: tp-shared
description: Shared API settings, POI V2 field specs, doc structure, and travel semantics for all tp-* skills. Not invoked directly — referenced by other tp-* skills.
user-invocable: false
---

所有 tp-* skill 共用的定義和規範集中地。完整內容見 `references.md`。

### 快速摘要（避免每次都載入 references.md）

- **API Base**：`https://trip-planner-dby.pages.dev`，認證用 `CF-Access-Client-Id` / `CF-Access-Client-Secret`
- **Windows 禁用 curl 寫入**：中文 body 會亂碼，一律 `node writeFileSync` + `--data @file`
- **travel 鐵律**：travel = 從此地「出發」到下一站，放在出發地 entry 上；最後一個 entry 的 travel 為 null
- **Doc 連動鐵律**：任何 trip data 變更後須檢視 5 種 doc（checklist/backup/suggestions/flights/emergency）並更新不一致部分
- **pois vs trip_pois**：pois = AI 維護 master（客觀資料），trip_pois = user 覆寫（主觀資料），NULL = 繼承 master

### references.md 完整涵蓋

- API Base URL + 認證 headers + curl 模板
- POI V2 欄位規格（各 type 必填/建議欄位）
- 資料所有權（pois vs trip_pois COALESCE convention）
- API 操作端點（POST/PATCH/DELETE trip-pois, PATCH pois master）
- googleRating 查詢策略（browse-first, WebSearch fallback）
- Markdown 支援欄位
- travel 欄位語意（鐵律）+ PATCH flat vs PUT nested 格式差異
- Doc 結構規格 + 連動規則（鐵律）
- 行程修改共用步驟（tp-edit/tp-request/tp-rebuild 共用）
- 品質規則索引（→ tp-quality-rules）
