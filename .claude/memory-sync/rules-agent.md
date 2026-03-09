# Agent Teams 規則

## 模型與背景執行

- Teammates 用 **sonnet** 模型
- 獨立且不需等待結果的 agent 使用 `run_in_background: true` 背景執行

## 單獨 Agent vs 團隊（TeamCreate）

| 情境 | 用法 | 範例 |
|------|------|------|
| 單次平行任務（無共享狀態） | `Agent` 直接派出 | 多檔搜尋、多餐廳查詢、平行編輯 |
| 多步驟需協調（共享進度） | `TeamCreate` 建團隊 | 大型重構、跨模組功能開發 |

## 團隊工作流程

1. `TeamCreate` 建立團隊 → 自動產生共享 TaskList
2. `TaskCreate` 建立任務 → `TaskUpdate` 指派 owner
3. Teammates 用 `SendMessage` 溝通
4. 完成後 `SendMessage` type: shutdown_request → `TeamDelete` 清理
