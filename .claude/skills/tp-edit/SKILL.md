---
name: tp-edit
description: "Use when the user wants to make a specific, partial change to an existing trip itinerary — e.g. '換餐廳', '加景點', '改 description', '刪購物行程', '更新 checkout 時間', '加一天'. This is for targeted, natural-language modifications to one trip. For BULK filling missing POI fields across trips, use /tp-patch. For full R0-R18 quality audit and fix, use /tp-rebuild. For creating a new trip from scratch, use /tp-create."
user-invocable: true
---

接受自然語言描述，局部修改指定行程資料（D1 API）。修改後執行 tp-check 精簡 report。

⚡ 核心原則：不問問題，直接給最佳解法。遇到模糊需求時自行判斷最合理的方案執行，不使用 AskUserQuestion。

## API 設定

API 設定、呼叫格式、Windows encoding 注意事項見 tp-shared/references.md

## 輸入方式

- 指定 tripId + 描述：`/tp-edit okinawa-trip-2026-Ray Day 3 午餐換成拉麵`
- 未指定 tripId：呼叫 `GET /api/trips` 列出所有行程供選擇

## 步驟

1. 讀取行程資料：
   ```bash
   # 讀取 meta（取得基本資訊、countries 等）
   curl -s "https://trip-planner-dby.pages.dev/api/trips/{tripId}"
   # 讀取受影響的天
   curl -s "https://trip-planner-dby.pages.dev/api/trips/{tripId}/days/{dayNum}"
   ```
2. 依自然語言描述**局部修改**對應資料（只改描述涉及的部分）
3. 新增或替換 POI 的必填欄位（source、note、googleQuery、googleRating）+ 韓國 naverQuery — **詳見 tp-shared/references.md「行程修改共用步驟」**
4. 修改的部分須符合 R0-R18 品質規則
5. 依修改類型選擇 API（PATCH entry / PUT 整天 / POST trip-pois / PUT doc）— **端點見 tp-shared/references.md「行程修改共用步驟」**
6. **Doc 連動（鐵律）**+ **travel 重算** — 規則見 tp-shared/references.md
7. 執行 tp-check 精簡模式，輸出：`tp-check: 🟢 N  🟡 N  🔴 N`
8. 不自動 commit（資料已直接寫入 D1 database，無需 git 操作）

## 局部修改 vs 全面重整

本 skill 只處理描述涉及的修改範圍，例如：
- 「Day 3 午餐換成拉麵」→ 只改 Day 3 午餐 entry（PATCH entry）
- 「加一個景點到 Day 2」→ 只在 Day 2 timeline 插入（PUT 整天）
- 「刪除 Day 4 的購物行程」→ 移除該 entry（PUT 整天，因為無 DELETE entry API）
- 「更新某餐廳的評分」→ 只改該 POI 欄位（PATCH trip-pois）

> ⚠️ **新增/刪除 entry** 必須使用 `PUT /api/trips/{tripId}/days/{N}` 覆寫整天，不能用 PATCH 單一 entry。插入或移除 entry 後須重算相鄰 travel。

**不全面重跑 R0-R18**。如需全面重整，使用 `/tp-rebuild`。

## 注意事項

- 所有資料讀寫均透過 API，不操作本地 MD 檔案
- 不執行 git commit / push（資料已直接寫入 D1 database）
- 不執行 npm run build（無 dist 產物需產生）

## Markdown 支援欄位

Markdown 支援欄位見 tp-shared/references.md
