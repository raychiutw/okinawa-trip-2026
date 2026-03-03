## Why

各行程 JSON 的餐廳推薦品質參差不齊：Ray 的行程每餐 3 選 1 + blogUrl 涵蓋率 81%，但 RayHus 只有 4 家餐廳且 0% blogUrl，HuiYun 每餐只有 1 家。景點和飯店缺少繁中推薦網誌連結。需要建立一套統一的行程品質規則，併入 `/render-trip` skill，確保每次產生或修改行程時自動補齊。

## What Changes

- 行程 JSON schema 擴充：景點 timeline entry 和 hotel 物件新增 `blogUrl` 欄位
- app.js 渲染：景點和飯店的 `blogUrl` 顯示為「網誌推薦」連結
- validateTripData 擴充：`blogUrl` 加入景點/飯店的合法 URL 欄位
- `/render-trip` skill 新增品質規則 R1-R6：
  - R1 料理偏好：首次產生行程前詢問使用者（最多 3 類，依優先排序）
  - R2 餐次完整性：掃描每日 timeline，缺午餐/晚餐則插入「餐廳未定」entry；一日遊團不補午餐，晚餐依到達地點
  - R3 餐廳推薦品質：每個 restaurants box 補到 3 家，必填 hours + reservation + blogUrl，營業時間須與用餐時間吻合
  - R4 景點品質：titleUrl 放官網、blogUrl 放繁中網誌、infoBoxes 確認含營業時間
  - R5 飯店品質：blogUrl 放繁中推薦網誌
  - R6 搜尋方式：Google「{名稱} {地區} 推薦」取第一篇繁體中文文章
  - R7 購物景點推薦：飯店附近超市/唐吉軻德以 `infoBox type=shopping` 結構化顯示（取代 hotel.subs 純文字），獨立購物行程（來客夢/iias/Outlet）同樣附 shopping infoBox，購物景點含 `mustBuy` 必買推薦
- 新增 `infoBox type=shopping` + `renderShop()` 渲染（復用既有 `.restaurant-choice` CSS，不新增 CSS）
- 重跑四趟行程套用新規則：
  - Ray（偏好：拉麵/燒肉/當地特色）
  - RayHus（偏好：燒肉/烤魚or牛排/當地特色）
  - HuiYun（偏好：燒肉/拉麵/當地特色）
  - Onion（偏好：火鍋/義大利麵/特色小吃）

## Capabilities

### New Capabilities

- `trip-enrich-rules`：行程品質規則（R1-R7），定義餐次完整性、餐廳推薦品質、景點/飯店網誌覆蓋、料理偏好互動流程、購物景點推薦

### Modified Capabilities

（無 — app.js 渲染和 validate 屬於實作層面，不改既有 spec 需求）

## Impact

- **Skill 檔案**：`.claude/commands/render-trip.md` 新增品質規則段落
- **JS**：`js/app.js`（渲染景點/飯店 blogUrl + `renderShop()` 購物卡片）、行程驗證邏輯
- **JSON**：`data/trips/okinawa-trip-2026-Ray.json`、`data/trips/okinawa-trip-2026-RayHus.json`、`data/trips/okinawa-trip-2026-HuiYun.json`、`data/trips/banqiao-trip-2026-Onion.json` 補齊餐廳/網誌/購物
- **測試**：unit test 新增景點/飯店 blogUrl 渲染測試
- **checklist/backup/suggestions**：RayHus 和 HuiYun 重跑後需同步更新
