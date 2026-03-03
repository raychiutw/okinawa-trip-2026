## Context

行程 JSON 已有完善的餐廳推薦結構（`infoBoxes[type=restaurants]` + `blogUrl`），但品質不一致。需要在 `/render-trip` skill 加入品質規則，並擴充 JSON schema 讓景點和飯店也能放繁中網誌連結。

現有結構：
- 餐廳：`blogUrl` ✓、`hours` ✓、`reservation` ✓（但常為 null）
- 景點 timeline entry：`titleUrl`（官網）✓、`blogUrl` ✗
- Hotel 物件：無 URL 欄位

## Goals / Non-Goals

**Goals:**
- 景點和飯店 JSON 新增 `blogUrl` 欄位，app.js 可渲染
- `/render-trip` skill 加入 R1-R7 品質規則
- 新增 `infoBox type=shopping` + `renderShop()` 購物卡片渲染
- Ray、RayHus、HuiYun、Onion 四趟行程全部重跑補齊

**Non-Goals:**
- 不建立自動化搜尋 API（blog 搜尋由 Claude 手動 Google）
- 不新增 CSS — 購物卡片復用既有 `.restaurant-choice` 樣式

## Decisions

**D1: blogUrl 新欄位位置**

- 景點 timeline entry：與 `titleUrl` 同層級加 `blogUrl`
- Hotel 物件：在 `hotel` 物件內加 `blogUrl`
- 渲染方式：同餐廳既有模式 — `iconSpan('document') + '網誌推薦'` 連結

**D2: 品質規則併入 render-trip skill 而非獨立 skill**

規則直接寫在 `.claude/commands/render-trip.md`，作為「品質檢查」段落。每次 render-trip 執行時自動遵守，不需另外呼叫 skill。

**D3: 料理偏好存儲**

不存在 JSON 裡，只在 render-trip 執行時口頭問一次。已知偏好：
- Ray：拉麵 / 燒肉 / 當地特色
- RayHus：燒肉 / 烤魚or牛排 / 當地特色
- HuiYun：燒肉 / 拉麵 / 當地特色
- Onion：火鍋 / 義大利麵 / 特色小吃

**D4: 一日遊團判定**

由 AI 根據 timeline 內容判斷（含 KKday/Klook/團體行程字眼），不在 JSON 加標記欄位。

**D5: 餐廳未定 entry 結構**

```json
{
  "time": "12:00-13:00",
  "title": "午餐（餐廳未定）",
  "description": "建議在{地點}附近用餐",
  "infoBoxes": [{
    "type": "restaurants",
    "title": "推薦餐廳",
    "restaurants": [
      { "category": "偏好1", "name": "...", "hours": "...", "reservation": "...", "blogUrl": "..." },
      { "category": "偏好2", ... },
      { "category": "偏好3", ... }
    ]
  }]
}
```

**D6: Shopping infoBox 結構**

飯店附近超市/唐吉軻德、獨立購物行程（來客夢/iias/Outlet）統一用 `infoBox type=shopping`：

```json
{
  "type": "shopping",
  "title": "附近購物",
  "shops": [
    {
      "category": "超市",
      "name": "San-A 那霸メインプレイス",
      "hours": "09:00-23:00",
      "mustBuy": ["黑糖", "泡盛", "沖繩限定零食"],
      "blogUrl": "https://..."
    }
  ]
}
```

- `shops[]` 陣列：每個 shop 含 `category`、`name`、`hours`、`mustBuy[]`（必買推薦陣列）、`blogUrl`
- 渲染：新增 `renderShop(shop)` 函式，復用 `.restaurant-choice` CSS class，不新增 CSS
- 飯店 `subs[]` 中的購物資訊改用 shopping infoBox 結構化顯示
- `mustBuy` 以 tag 列表顯示在卡片內

**D7: Onion 板橋一日遊的處理**

Onion 板橋一日遊為自由行（非 KKday/Klook 團體行程），適用 R2 餐次完整性規則。午餐晚餐皆須補齊。

## Risks / Trade-offs

- **[Google 搜尋結果不穩定]** → Claude 搜尋時以「{名稱} {地區} 推薦」為關鍵字，優先選 pixnet / mimigo / kafu 等常見旅遊部落格
- **[營業時間可能過時]** → 在 suggestions 提醒使用者出發前確認
- **[重跑 RayHus/HuiYun 改動幅度大]** → 先備份再改，commit 前對比確認
