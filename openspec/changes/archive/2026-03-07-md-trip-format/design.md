## Context

現有行程 JSON 單檔包含 meta、footer、autoScrollDates、weather、days（含 hotel + timeline）、flights、checklist、backup、suggestions、emergency。每個 day 約 300~460 行 JSON。本設計將資料拆為 Markdown 小檔（source of truth），經 build step 編譯為多個小 JSON（瀏覽器載入），render 邏輯不變。

## Goals / Non-Goals

**Goals:**
- 定義 Markdown 行程格式規格（per-day timeline + hotel、per-section 卡片）
- 建立 json→md splitter（一次性遷移用）
- 建立 md→json compiler（build step）
- POC 驗證：Ray 行程 round-trip 無資料遺失
- POC 驗證：poc.html 渲染結果與現有頁面一致

**Non-Goals:**
- 不遷移全部行程（Phase 2）
- 不修改 app.js / index.html（POC 獨立頁面）
- 不修改 tp-* skills（Phase 2）
- 不設定 Cloudflare Pages build（Phase 2）

## Decisions

### 1. Markdown 格式規格

**Day 檔（day-N.md）**

```markdown
---
id: 1
date: 7/29（三）
label: 那霸 → 北谷
---

## Hotel: ホテルグランビュー沖縄
- url: https://www.granbiew.jp/
- checkout: 11:00
- blog: https://example.com/
- rating: 4.2

### shopping: 飯店周邊購物

| name | category | hours | mustBuy | blog | rating |
|------|----------|-------|---------|------|--------|
| FamilyMart 北谷店 | 超商 | 24小時 | 沖繩限定,泡盛 | https://... | 3.5 |

## Timeline

### 10:45 抵達那霸機場
入境、領取行李
- blog: https://example.com/
- maps: 那霸機場
- mapcode: 33 154 523*80
- rating: 3.9

### 12:00 午餐
選擇沖繩料理
- maps: 那霸國際通
- rating: 4.0
- travel: car 40min 國道58號北上

#### restaurants: 午餐推薦三選一

| name | category | hours | price | reservation | description | blog | rating | mapcode |
|------|----------|-------|-------|-------------|-------------|------|--------|---------|
| 浜屋そば | 拉麵 | 10:00~18:00 | ¥650~ | 不需訂位 | 北谷人氣沖繩麵 | https://... | 4.3 | 33 496 097*82 |
```

**解析規則：**
- `---` frontmatter：day metadata（YAML）
- `## Hotel: {name}`：hotel 物件，`- key: value` 為屬性
- `### {type}: {title}`（在 Hotel 下）：hotel infoBox
- `## Timeline`：timeline 陣列開始
- `### {time} {title}`：timeline event
  - 純文字行 → description
  - `- key: value` → 屬性（blog/maps/mapcode/rating/web/travel）
  - `- travel: {type} {minutes}min {text}` → travel 物件
- `#### {type}: {title}`（在 event 下）：event infoBox
- Markdown table → restaurants[] / shops[] 陣列

**maps 欄位展開規則：**
- `- maps: {query}` → compiler 自動產生：
  - `googleQuery: https://maps.google.com/?q={encoded}`
  - `appleQuery: https://maps.apple.com/?q={encoded}`
- 省去每個 POI 重複的 4~6 行 locations 物件

**可省略欄位與預設值：**
- `source` → 預設 `"ai"`，MD 只標例外
- `hotel.details` → 省略時預設 `[]`
- `hotel.breakfast.included` → 省略時預設 `null`
- `blogUrl` → 省略時預設 `""`
- `googleRating` → 省略時不產生該欄位

**其他卡片檔案：**

| 檔案 | 格式 |
|------|------|
| `meta.md` | YAML frontmatter（title, description, foodPreferences, selfDrive, countries, footer, autoScrollDates） |
| `flights.md` | Markdown 表格（segments）+ 文字（airline info） |
| `checklist.md` | `## {category}` + `- [ ] item` 清單 |
| `backup.md` | `## {title}` + `- item` 清單 |
| `suggestions.md` | `## {priority}` + `- item` 清單 |
| `emergency.md` | `## {title}` + `- {label}: {phone}` 聯絡人 |
| `weather.json` | 保留 JSON（API 機器資料，不手編） |

### 2. 檔案結構

```
data/trips-md/{slug}/         ← source of truth（Markdown）
  meta.md
  flights.md
  day-1.md ~ day-N.md
  checklist.md
  backup.md
  suggestions.md
  emergency.md
  weather.json

data/dist/{slug}/             ← build 產出（.gitignore）
  index.json                  ← 檔案清單 manifest
  meta.json
  flights.json
  day-1.json ~ day-N.json
  checklist.json
  backup.json
  suggestions.json
  emergency.json
  weather.json
```

### 3. Build 流程

```
npm run build:trips
  → node scripts/trip-build.js
  → 掃描 data/trips-md/*/
  → 每個 .md 解析 → 產出對應 .json 到 data/dist/
  → 產出 index.json manifest
```

### 4. poc.html 載入流程

```javascript
fetch(`data/dist/${slug}/index.json`)
  .then(files => Promise.all(files.map(f => fetch(f + '.json'))))
  .then(parts => assemble(parts))  // 組裝成現有 trip object 結構
  .then(data => renderTrip(data))  // 複用現有 render 邏輯
```

### 5. Round-trip 驗證策略

```
原始 JSON → trip-split.js → .md 檔案 → trip-build.js → 重建 JSON

normalize(原始) === normalize(重建)
```

normalize 處理：
- JSON key 排序一致
- maps URL 格式統一（query text vs 完整 URL 皆可比對）
- 省略欄位補回預設值
- 忽略 key 順序差異

## Risks / Trade-offs

- Markdown 格式設計可能遺漏 edge case（如 description 含 `- ` 開頭文字）→ round-trip test 會抓到
- POC 只做一個行程，其他行程可能有未覆蓋的結構變體 → Phase 2 時再處理
- 新增 build step 增加部署複雜度 → Cloudflare Pages 支援 build command，影響有限
- Markdown table 列寬不固定 → 純語法解析不受影響
