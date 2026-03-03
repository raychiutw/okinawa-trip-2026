## 1. JSON Schema 擴充

- [x] 1.1 景點 timeline entry 新增 `blogUrl` 欄位支援（app.js 渲染 — 與餐廳相同的「網誌推薦」連結樣式）
- [x] 1.2 Hotel 物件新增 `blogUrl` 欄位支援（app.js 渲染飯店區塊的「網誌推薦」連結）
- [x] 1.3 新增 `infoBox type=shopping` 支援 + `renderShop()` 渲染函式（復用 `.restaurant-choice` CSS，含 mustBuy tag 列表顯示）
- [x] 1.4 validateTripData 將 `blogUrl` 加入景點/飯店的合法 URL 欄位清單，新增 shopping infoBox 驗證
- [x] 1.5 新增 unit test：景點 blogUrl 渲染、飯店 blogUrl 渲染、shopping infoBox 渲染

## 2. render-trip skill 規則更新

- [x] 2.1 `.claude/commands/render-trip.md` 新增品質規則段落（R1-R7 完整規則文字）

## 3. 重跑 Ray 行程

- [x] 3.1 Ray 餐次補齊：確認每日午餐/晚餐完整，不足處補「餐廳未定」entry + 3 家推薦（偏好：拉麵/燒肉/當地特色）
- [x] 3.2 Ray 景點補齊：所有景點確認 titleUrl（官網）+ blogUrl（繁中網誌）+ 營業時間
- [x] 3.3 Ray 飯店補齊：所有 hotel 加 blogUrl
- [x] 3.4 Ray 餐廳品質：所有餐廳確認 hours + reservation + blogUrl 填寫完整
- [x] 3.5 Ray 購物補齊：飯店附近超市/唐吉軻德加 shopping infoBox + mustBuy；購物行程加 shopping infoBox

## 4. 重跑 RayHus 行程

- [x] 4.1 RayHus 餐次補齊：Day 1 晚餐補到 3 家、Day 2 晚餐補到 3 家、Day 4 補午餐+晚餐、Day 5 補午餐+晚餐（偏好：燒肉/烤魚or牛排/當地特色）
- [x] 4.2 RayHus 景點補齊：所有景點加 titleUrl（官網）+ blogUrl（繁中網誌）+ 營業時間確認
- [x] 4.3 RayHus 飯店補齊：所有 hotel 加 blogUrl
- [x] 4.4 RayHus 餐廳品質：所有餐廳確認 hours + reservation + blogUrl 填寫完整
- [x] 4.5 RayHus 購物補齊：飯店附近超市/唐吉軻德加 shopping infoBox + mustBuy；購物行程加 shopping infoBox

## 5. 重跑 HuiYun 行程

- [x] 5.1 HuiYun 餐次補齊：各日缺餐處補「餐廳未定」entry + 3 家推薦；既有 1 家的補到 3 家（偏好：燒肉/拉麵/當地特色）
- [x] 5.2 HuiYun 景點補齊：所有景點加 titleUrl（官網）+ blogUrl（繁中網誌）+ 營業時間確認
- [x] 5.3 HuiYun 飯店補齊：所有 hotel 加 blogUrl
- [x] 5.4 HuiYun 餐廳品質：所有餐廳確認 hours + reservation + blogUrl 填寫完整
- [x] 5.5 HuiYun 購物補齊：飯店附近超市/唐吉軻德加 shopping infoBox + mustBuy；購物行程加 shopping infoBox

## 6. 重跑 Onion 行程

- [x] 6.1 Onion 餐次補齊：確認午餐/晚餐完整，不足處補「餐廳未定」entry + 3 家推薦（偏好：火鍋/義大利麵/特色小吃）
- [x] 6.2 Onion 景點補齊：所有景點確認 titleUrl（官網）+ blogUrl（繁中網誌）+ 營業時間
- [x] 6.3 Onion 餐廳品質：所有餐廳確認 hours + reservation + blogUrl 填寫完整

## 7. 驗證

- [x] 7.1 執行 `npm test` 確認所有測試通過
- [x] 7.2 同步更新 Ray、RayHus、HuiYun、Onion 的 checklist/backup/suggestions
