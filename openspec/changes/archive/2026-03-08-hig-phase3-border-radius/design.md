## Context

全站有 8+ 種硬編碼圓角值（3/4/5/6/8/10/16/999px），只有 3 個定義為 CSS 變數。Phase 0 已新增 `--radius-xs`(4px) 和 `--radius-lg`(16px)。

## Goals / Non-Goals

**Goals:**
- 消除所有硬編碼的 `border-radius` 值，統一使用 5 級 token
- 每個元素的圓角值收斂到最近的 token 級別

**Non-Goals:**
- 不改 scrollbar thumb 的 `border-radius: 3px`（裝飾元素豁免，3px = 6px 寬度的一半 = 完美膠囊）
- 不改 `border-radius: 50%`（圓形語意不同）
- 不改 `border-radius: 12px 12px 0 0` 之類的組合值的數值（只改寫法為 `var(--radius-md) var(--radius-md) 0 0`）

## Decisions

1. **向上/向下取整規則**：3→4(xs), 5→4(xs), 6→8(sm), 10→8(sm), 999→99(full)。都是取最近的 token 值。
2. **scrollbar 豁免**：6px 寬 scrollbar 的 3px thumb radius 是 Apple 風格的最佳比例，強行改為 4px 反而會破壞膠囊形狀。
3. **組合值寫法**：如 `.day-header { border-radius: 12px 12px 0 0 }` 改為 `var(--radius-md) var(--radius-md) 0 0`。

## Risks / Trade-offs

- [4px→4px 的 badge/code 元素] → 最小圓角元素從 3~5px 統一到 4px，視覺差異極小
- [suggestion priority 6px→8px] → 圓角稍大，但與 info-box 等同級元素統一
