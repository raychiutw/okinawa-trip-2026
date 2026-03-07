## ADDED Requirements

### Requirement: 多檔載入路徑
`loadTrip()` SHALL 從 `data/dist/<slug>/` 載入多個 JSON 檔案，不再載入單一 `data/trips/<slug>.json`。載入流程 SHALL 先 fetch `index.json` 取得 manifest 陣列，再依 manifest 載入對應檔案。

#### Scenario: 正常載入
- **WHEN** 呼叫 `loadTrip(slug)`
- **THEN** SHALL fetch `data/dist/<slug>/index.json`
- **THEN** SHALL 依 manifest 內容載入對應 JSON 檔案

#### Scenario: index.json 不存在
- **WHEN** fetch `index.json` 失敗（404 或網路錯誤）
- **THEN** SHALL 顯示整頁錯誤訊息

### Requirement: Slot-based async 渲染
頁面 SHALL 先建立骨架 DOM，包含各 section 的空 slot。每個 section fetch 到資料後 SHALL 獨立渲染到對應 slot，不需等待其他 section。

#### Scenario: 平行渲染
- **WHEN** meta.json 和 flights.json 同時 fetch 完成
- **THEN** 兩者 SHALL 各自渲染到對應 slot，順序不影響結果

#### Scenario: 骨架 DOM
- **WHEN** 頁面初始載入
- **THEN** SHALL 顯示 loading skeleton（nav、day、info sections 各自有 placeholder）

### Requirement: Day lazy loading
切換到某天時 SHALL 才載入該天的 `day-N.json`。初始只載入首頁顯示的 Day（autoScroll 指定的當天或 Day 1）。已載入的 Day SHALL 快取在記憶體中，不重複 fetch。

#### Scenario: 首次切換到 Day 3
- **WHEN** 使用者切換到 Day 3 且 Day 3 尚未載入
- **THEN** SHALL fetch `day-3.json` → 渲染 → 顯示

#### Scenario: 再次切換到 Day 3
- **WHEN** 使用者切換回 Day 3 且 Day 3 已載入過
- **THEN** SHALL 直接顯示快取內容，不重複 fetch

#### Scenario: 初始載入
- **WHEN** 頁面初次載入
- **THEN** SHALL 只載入 autoScroll 指定的當天（或 Day 1）的 day JSON

### Requirement: 個別錯誤處理
每個 section 載入失敗時 SHALL 在該 slot 內顯示錯誤訊息，不影響其他 section 的正常渲染。

#### Scenario: flights 載入失敗
- **WHEN** `flights.json` fetch 失敗
- **THEN** flights slot SHALL 顯示錯誤訊息
- **THEN** 其他 section（checklist、backup 等）SHALL 正常渲染

#### Scenario: day 載入失敗
- **WHEN** `day-2.json` fetch 失敗
- **THEN** day slot SHALL 顯示錯誤訊息
- **THEN** 使用者 SHALL 仍可切換到其他 Day

### Requirement: 移除 highlights
前端 SHALL 不再有 highlights 相關渲染邏輯。多檔結構 SHALL 不產生 highlights 相關檔案。

#### Scenario: 無 highlights 程式碼
- **WHEN** 檢查 app.js
- **THEN** SHALL 不含 highlights 渲染函式或引用
