## Context

目前只有 2 階文字色（`--text` / `--text-muted`），部分場景用 `opacity` 或直接引用 `--gray` 來降低文字可見度。Phase 0 已定義 `--text-tertiary` 和 `--text-quaternary`。

## Goals / Non-Goals

**Goals:**
- 將 `opacity` 控制文字可見度的場景改為語意色 token
- 審查所有 `color: var(--gray)` 的使用，細分為 muted/tertiary
- 確保深色模式下 4 階文字色的 WCAG AA 對比度（≥ 4.5:1 for normal text，≥ 3:1 for large text）

**Non-Goals:**
- 不改變 `--gray` 變數的存在（它可能被用於非文字場景如邊框色）
- 不改 priority dot 的語意色（`--priority-*-dot` 是狀態色，不是文字層級色）

## Decisions

1. **tertiary 色值**：淺色模式 `#9B9B9B`（灰度 61%），深色模式 `#6B6B6B`（灰度 42%）。
2. **quaternary 色值**：淺色模式 `#C0C0C0`（灰度 75%），深色模式 `#4A4A4A`（灰度 29%）。
3. **分級原則**：
   - `--text`：主要內容文字
   - `--text-muted`：次要資訊（日期、meta、副標題）
   - `--text-tertiary`：輔助提示（placeholder 感）
   - `--text-quaternary`：裝飾性（sheet handle、disabled）
4. **`opacity: 0.9` (.dh-date) → `color: var(--text-muted)`**：day header 的日期是次要資訊，用語意色更正確。
5. **`opacity: 0.35` (.sheet-handle) → 保留 opacity**：sheet handle 的半透明是視覺效果，不是文字色階。

## Risks / Trade-offs

- [WCAG 對比度] → `--text-quaternary: #C0C0C0` 在白色背景上對比度約 1.6:1，不符合 AA。但 quaternary 級文字在 Apple 系統中也不要求 AA 合規（屬於裝飾性元素）。
- [--gray 與 --text-muted 重複] → `--gray: #6B6B6B` 和 `--text-muted: #6B6B6B` 值相同。保留兩者：`--gray` 用於非文字場景（scrollbar、邊框），`--text-muted` 用於文字。
