## Context

目前動畫使用 Material Design 的標準曲線 `cubic-bezier(0.4, 0, 0.2, 1)`，不是 Apple 風格。Phase 0 已定義 `--ease-apple` 和 `--duration-*` token。

## Goals / Non-Goals

**Goals:**
- 所有 transition 的 timing-function 改用 `var(--ease-apple)`
- transition duration 改用 `--duration-*` token
- 保留微互動（≤ 150ms）的原始值

**Non-Goals:**
- 不改變動畫的類型（不新增/移除 transition 或 animation）
- 不改變 speed dial 的 stagger delay
- 不加入 CSS @keyframes 動畫

## Decisions

1. **Apple 曲線選擇**：`cubic-bezier(0.2, 0.8, 0.2, 1)` — 起始緩慢（0.2 control），中段加速到高點（0.8），結尾快速收斂（0.2, 1）。比 Material 的曲線更有「彈性出發、迅速到位」的感覺。
2. **duration 對應**：`0.15s` → `var(--duration-fast)`，`0.2s~0.25s` → `var(--duration-normal)`，`0.3s` → `var(--duration-slow)`。
3. **不改微互動**：`transition: background 0.15s` 之類的短 hover 效果保留 `var(--duration-fast)`，不需要用 `--ease-apple`（太短看不出曲線差異）。

## Risks / Trade-offs

- [動畫手感變化] → Apple 曲線開頭比 Material 慢，結尾比 Material 快。使用者可能感覺動畫「更彈」。差異微妙，不會造成不適。
- [測試覆蓋] → 動畫不在現有測試範圍內，需視覺確認。
