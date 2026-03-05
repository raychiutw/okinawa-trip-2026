## ADDED Requirements

### Requirement: highlights JSON 資料結構

Trip JSON SHALL 包含 `highlights` 頂層欄位，結構如下：

```json
{
  "highlights": {
    "title": "AI行程亮點",
    "content": {
      "summary": "100-200 字的行程摘要分析",
      "tags": ["標籤1", "標籤2", ...]
    }
  }
}
```

`highlights` 為必填欄位，`validateTripData()` SHALL 在缺少時產生 error。

#### Scenario: highlights 欄位存在且完整

- **WHEN** trip JSON 包含完整的 highlights 欄位（title、content.summary、content.tags）
- **THEN** 驗證 SHALL 通過，不產生錯誤

#### Scenario: highlights 欄位缺失

- **WHEN** trip JSON 缺少 highlights 欄位
- **THEN** `validateTripData()` SHALL 回傳 error「缺少 highlights」

### Requirement: highlights 卡牌渲染

`renderHighlights(data)` SHALL 渲染 AI行程亮點卡牌，包含：
1. 摘要段落：顯示 `content.summary` 文字
2. 標籤列：水平排列的 pill 標籤，顯示 `content.tags` 陣列

#### Scenario: 渲染完整 highlights

- **WHEN** highlights 資料包含 summary 和 3 個 tags
- **THEN** 卡牌 SHALL 顯示摘要段落，下方顯示 3 個 pill 標籤

#### Scenario: 無 tags

- **WHEN** highlights 資料包含 summary 但 tags 為空陣列
- **THEN** 卡牌 SHALL 僅顯示摘要段落，不顯示標籤列

### Requirement: highlights 標籤樣式

每個標籤 SHALL 使用 pill 樣式：
- 圓角背景（border-radius: 99px）
- 背景色：`color-mix(in srgb, var(--accent) 12%, transparent)`
- 文字色：`var(--accent)`
- 字體大小：`var(--fs-sm)`
- 水平排列，flex-wrap

#### Scenario: 標籤 pill 外觀

- **WHEN** 渲染 highlights 標籤
- **THEN** 每個標籤 SHALL 顯示為圓角 pill，使用 accent 色系

### Requirement: highlights 僅在主內容區渲染

`renderHighlights(data)` 函式 SHALL 保留，且 SHALL 僅在主內容區（day cards 上方）呼叫。Info panel（桌機右側欄 / 手機底部 sheet）SHALL 不再渲染 highlights 卡牌。

#### Scenario: Info panel 不顯示 highlights

- **WHEN** `renderInfoPanel(data)` 執行
- **THEN** 輸出 HTML SHALL 不包含 highlights 卡牌（summary 段落及 tags pill）
- **AND** info panel 其餘卡牌（倒數計時、行程統計、建議）SHALL 正常顯示

#### Scenario: 主內容區仍顯示 highlights

- **WHEN** 主行程頁面渲染完成
- **THEN** day cards 上方 SHALL 仍顯示 highlights 卡牌（summary + tags）
- **AND** 渲染結果 SHALL 與移除前相同

#### Scenario: renderHighlights 函式保留

- **WHEN** 讀取 `js/app.js`
- **THEN** `renderHighlights` 函式定義 SHALL 存在
- **AND** 函式 SHALL 可在主內容區正常呼叫
