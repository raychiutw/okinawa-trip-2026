## Context

全站有 6 種 `line-height`（1.0/1.2/1.3/1.4/1.6/1.7），缺乏系統性。Phase 0 已定義 `--lh-tight`(1.2)、`--lh-normal`(1.5)、`--lh-relaxed`(1.7) 三級 token。

## Goals / Non-Goals

**Goals:**
- 將所有 `line-height` 值收斂為 3 級 token + icon 專用 `1`
- body 預設從 1.6 改為 1.5，拉開與 1.7 的層次

**Non-Goals:**
- 不改變 font-size（`--fs-*` 維持不動）
- 不改 `line-height: 1`（icon 專用，語意不同，不設 token）

## Decisions

1. **body 1.6 → 1.5**：CJK 文字在 1.5 仍然舒適，且與 1.7 的差距從 0.1 拉大到 0.2，層次更分明。
2. **標題 1.3/1.4 → 1.2**：Apple 風格標題緊湊，1.2 是 Apple 大標題的標準行距。
3. **icon 用 `line-height: 1` 不設 token**：g-icon、n-icon、dh-nav-arrow 的 `line-height: 1` 是確保 icon 容器不增加額外高度，與排版無關。

## Risks / Trade-offs

- [標題 1.4→1.2 變化明顯] → tl-title 的雙行文字會變得更緊。如果景點名稱很長折行後太擠，可能需要微調。
- [body 1.6→1.5 影響範圍廣] → 所有未指定 line-height 的元素都會受影響。但 1.5 是 CJK 排版的標準值，風險可控。
