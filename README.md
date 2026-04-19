# Tripline

專為小團體量身打造的旅遊行程網站，讓每位旅伴都能輕鬆查閱行程、即時掌握天氣與交通資訊。

🔗 **線上 Demo**：[https://trip-planner-dby.pages.dev/](https://trip-planner-dby.pages.dev/)

---

## 功能特色

### 行程瀏覽

- 📋 **多行程支援** — 同時管理多套旅遊計畫，一鍵切換
- 🗓️ **每日時間軸** — 景點、餐廳、購物、飯店依時間排列，清晰呈現一天行程
- 📍 **景點詳情頁** — 點任一景點跳專屬頁面（`/trip/:id/stop/:entryId`），顯示大標、備註、導航 + 餐廳正備選 + 必買購物
- 🍽️ **餐廳正備選** — 正推薦 + 備選列表，視覺層級分明
- 🛍️ **必買購物 chips** — 逛店重點 pill chip 化，一眼掌握
- 🗺️ **互動地圖系統** — OpenStreetMap（Leaflet）+ 編號 pins + 路線連線，第三方導航外連（Google / Apple / mapcode）
- 🧭 **全圖地圖頁 + Funliday 導覽** — 景點地圖可切全螢幕（`/trip/:id/map`），下方日期 tab + 橫向 swipe entry cards，卡片滑到中央自動聚焦地圖 pin

### 即時資訊

- 🌤️ **天氣預報** — 行程日期在 16 天預報範圍內自動顯示逐時天氣
- 🚗 **交通統計** — 自動計算每日與全程的開車、電車、步行時間總計
- ⏳ **倒數計時器** — 顯示距離出發還有幾天

### 外觀與體驗

- 🌙 **深色模式** — 支援淺色、深色、跟隨系統三種模式
- 🎨 **Ocean 單一主題** — Airbnb editorial 風（白底 + 1px hairline + rounded-xl），Ocean 海洋藍 `#0077B6` 單一 accent
- 🖨️ **列印模式** — A4 排版最佳化，可直接列印或輸出 PDF
- 📱 **響應式設計** — 手機、平板、桌機均有對應排版（桌機 DayNav 用 GitHub/Apple HIG underlined tab style）
- ⚡ **PWA 體驗** — 可加入主畫面，離線瀏覽快取

### 旅伴協作

- 💬 **旅伴請求系統** — 傳送「改行程」或「問建議」請求給行程管理員
- 📧 **每日健康日報** — 透過 Gmail 自動寄送當日行程摘要

### 匯出與備份

- 💾 **下載行程** — 支援 PDF、Markdown、JSON、CSV 四種格式

---

## 截圖

> 截圖存放於 `docs/` 目錄。

![每日行程流程](docs/daily-report-flow.png)

---

## 技術文件

- [ARCHITECTURE.md](ARCHITECTURE.md) — 系統組成、資料流、信任邊界、部署拓撲
- [CONTRIBUTING.md](CONTRIBUTING.md) — 新手上路、測試、commit 慣例、常見任務
- [DESIGN.md](DESIGN.md) — 設計系統與視覺規範（Ocean 單主題、Airbnb editorial、Apple HIG type scale）
- [CLAUDE.md](CLAUDE.md) — 開發流程與 gstack pipeline
- [TODOS.md](TODOS.md) — 已知待辦與 follow-up
- [CHANGELOG.md](CHANGELOG.md) — 版本紀錄
