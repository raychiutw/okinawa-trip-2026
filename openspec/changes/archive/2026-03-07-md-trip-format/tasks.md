## 1. JSON → Markdown splitter

- [x] 1.1 建立 `scripts/trip-split.js`，讀取 `okinawa-trip-2026-Ray.json`，拆出：meta.md、flights.md、day-1.md ~ day-5.md、checklist.md、backup.md、suggestions.md、emergency.md、weather.json，存至 `data/trips-md/okinawa-trip-2026-Ray/`
- [x] 1.2 執行 splitter 產出 Ray 行程的 .md 檔案，人工檢視格式是否正確

## 2. Markdown → JSON compiler

- [x] 2.1 建立 `scripts/trip-build.js`，掃描 `data/trips-md/{slug}/` 下所有 .md 與 .json，解析後產出對應小 JSON 至 `data/dist/{slug}/`，含 index.json manifest
- [x] 2.2 實作 day .md 解析器：frontmatter、Hotel 區塊（含 infoBoxes）、Timeline 區塊（含 travel、infoBoxes restaurants/shopping 表格）、maps 查詢文字展開為完整 URL、省略欄位補預設值
- [x] 2.3 實作其他卡片 .md 解析器：meta（YAML frontmatter）、flights（表格）、checklist（checkbox 清單）、backup（清單）、suggestions（priority 分組清單）、emergency（聯絡人）
- [x] 2.4 weather.json 直接複製到 dist

## 3. Round-trip 驗證

- [x] 3.1 建立 `tests/unit/trip-roundtrip.test.js`：原始 JSON → split → build → normalize 比對，驗證 Ray 行程所有 day + 所有卡片 round-trip 無資料遺失
- [x] 3.2 執行驗證通過，修正任何格式或解析問題直到 round-trip 完全一致

## 4. POC 測試頁面

- [x] 4.1 建立 `poc.html`，載入 `data/dist/okinawa-trip-2026-Ray/index.json`，並行 fetch 各小 JSON，assemble 成完整 trip object，複用現有 render 邏輯（引入 shared.js/menu.js/icons.js/app.js/style.css）
- [x] 4.2 本機開啟 poc.html，視覺比對與現有 index.html（?trip=okinawa-trip-2026-Ray）渲染結果一致

## 5. 收尾

- [x] 5.1 將 `data/dist/` 加入 .gitignore
- [x] 5.2 在 package.json 新增 `build:trips` script
- [x] 5.3 確認 `npm test` 全部通過（既有測試不受影響）
