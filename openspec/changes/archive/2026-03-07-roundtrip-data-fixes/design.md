## Context

`md-trip-format` 已完成 JSON → MD splitter 和 MD → JSON builder，Ray 行程 round-trip 驗證通過。但對其餘 6 個行程執行 round-trip 後發現大量差異，歸因為：資料格式不一致、converter 欄位缺漏、品質規則不完整。已逐項與使用者討論決定修正方案。

## Goals / Non-Goals

**Goals:**
- 全部 7 個行程 round-trip 無損通過
- 統一行程 JSON 資料格式
- 品質規則涵蓋所有必填欄位
- converter 支援所有行程的欄位變體

**Non-Goals:**
- 不修改渲染端（js/css/html）
- 不新增 UI 功能
- 不重構 converter 架構（僅增補欄位支援）

## Decisions

### D1: 執行順序——先修資料，再改 converter，最後跑驗證

先修資料是因為很多差異來自格式不一致（URL、Emergency、Flight），修完後 converter 改動量更小。

### D2: URL 格式統一為 `/maps/search/` + percent-encode

Google Maps 統一為 `https://www.google.com/maps/search/<encoded>`。選擇格式 B 因為使用者偏好。Naver Maps 查詢詞轉簡體中文後 encode。Apple Maps 及其他用原店名（含分店）encode。

### D3: 空字串欄位的 MD 轉換策略

`blogUrl: ""`、`note: ""` 等空字串欄位：MD 中不輸出，但 builder 須還原為 `""`。實作方式：builder 對 blogUrl 和 note 等已知欄位，若 MD 中不存在則設為空字串。

### D4: 正式旅館判斷依據改為 checkout

取代 `hasUrl || hasDetails`，改用 `checkout` 欄位存在與否判斷。所有正式旅館都有 checkout，簡易旅館（家、返台、退房）都沒有。

### D5: breakfast.included 允許 null

R0（禁用 null）加例外，`breakfast.included` 可為 `true`/`false`/`null`。null 代表「未確認」。Splitter 對 null → 不輸出（省略），builder 見不到 breakfast 行則設 `{ included: null }`。

### D6: source 必填，不自動加

所有 hotel、restaurant、shop、gasStation、event 都必須在 JSON 中有 `source` 欄位。Splitter 輸出 `- source: <value>`，builder 讀取。Builder 不再自動加 `source: "ai"`。

### D7: 最後一天不設 hotel

品質規則強制：最後一天的 `content` 不含 `hotel` 鍵。資料修正腳本直接刪除。

### D8: note 欄位通用化

hotel、restaurant、shop、event、parking 全部必須有 `note` 欄位。空值用 `""`。MD 中空 note 不輸出，builder 還原 `""`。

## Risks / Trade-offs

- **[資料大量變動]** → 所有 7 個行程 JSON 都會修改；以 `npm test` + round-trip 驗證確保正確
- **[URL 格式變更影響渲染]** → `app.js` 直接用 URL 做 `<a href>`，格式 B 的 URL 瀏覽器同樣能開啟，無影響
- **[Naver 簡中轉換]** → 需要繁→簡中轉換邏輯，用 Node.js 字元對照表實作
- **[source 必填影響 tp-create]** → tp-create 產生行程時須確保所有實體有 source 欄位；已在品質規則中規範
