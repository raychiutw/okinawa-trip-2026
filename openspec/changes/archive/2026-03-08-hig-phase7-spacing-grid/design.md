## Context

全站間距值未遵守 grid 系統，存在 2/3/5/6/10/14 等不規則值。Apple HIG 要求嚴格的 8pt grid（4pt 半格）。合法值為 4 的倍數：4/8/12/16/20/24/28/32/40/48。

## Goals / Non-Goals

**Goals:**
- 全站所有 `padding`、`margin`、`gap` 值對齊到 4pt grid
- 非 4 倍數的值統一向上取到最近的合法值（Apple 寬裕原則）
- 10px → 12px 為預設規則

**Non-Goals:**
- 不改 scrollbar 寬度 6px（裝飾元素豁免）
- 不改 scrollbar thumb 的 3px border-radius（Phase 3 已豁免）
- 不改 `border-width`（1px/2px 邊框不受 grid 限制）
- 不改 `width`/`height` 等尺寸值（grid 僅約束 spacing）
- 不改 clip-path、transform 等非間距屬性中的值

## Decisions

1. **向上取整原則**：Apple 偏好寬裕空間。所有非合法值向上取到最近的 4 倍數。
   - 2px → 4px
   - 3px → 4px
   - 5px → 4px（例外：向下取因為 4 更近）
   - 6px → 8px
   - 10px → 12px
   - 14px → 16px
2. **分檔執行**：依 shared → style → edit → setting 順序，每檔完成後視覺確認。
3. **不設間距 token 變數**：間距值種類太多（4/8/12/16/20/24/28/32/40/48），逐一設 token 反而增加複雜度。直接用數值但確保合規即可。

## Risks / Trade-offs

- [累積微調效應] → 單一 ±2px 不明顯，但 50+ 處累積可能改變整體「鬆緊感」。12px 取代 10px 會讓整體偏鬆。
- [gap: 6px → 8px] → 緊密排列的元素（如 hw-grid、dh-nav）間距變大，可能影響可見數量。
- [回歸風險] → 這是改動量最大的 phase，需要逐頁逐元素視覺確認。
