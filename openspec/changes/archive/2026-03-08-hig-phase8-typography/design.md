## Context

全站字級系統目前僅有 4 級（`--fs-display`/`--fs-lg`/`--fs-md`/`--fs-sm`），大量不同角色的元素被迫共用同一級，導致視覺層次扁平。此外桌面版有 `@media (min-width: 768px)` 將 4 級全部縮小的覆寫，與 Apple HIG 跨裝置一致性原則衝突。內容區 `--content-max-w: 800px` 在 17px body 字體下 CJK 每行約 47 字，超出 Apple 建議的 25-40 字舒適範圍。

## Goals / Non-Goals

**Goals:**
- 建立 Apple HIG 11 級文字樣式系統，取代現有 4 級
- 移除桌面版字級覆寫，全裝置統一字級
- 將全站所有元素重新分配到語意正確的 text style
- 收窄 `--content-max-w` 到 720px 以優化 CJK 閱讀體驗
- 鎖定規範：日後不得新增第 12 級

**Non-Goals:**
- 不改變 font-weight 系統（保留現有 400/600/700）
- 不改變 line-height（Phase 2 處理）
- 不改變 font-family（Phase 1 處理）
- 不改變色彩（Phase 0/6 處理）

## Decisions

1. **11 級字級對照表**：

   | Apple Text Style | CSS Variable | rem | px | 用途 |
   |-----------------|-------------|-----|-----|------|
   | Large Title | `--fs-large-title` | 2.125rem | 34px | 倒數計時數字、品牌展示 |
   | Title | `--fs-title` | 1.75rem | 28px | 預留（目前無元素使用） |
   | Title 2 | `--fs-title2` | 1.375rem | 22px | Day header h2、錯誤頁標題 |
   | Title 3 | `--fs-title3` | 1.25rem | 20px | 區段標題、nav-title、info-label |
   | Headline | `--fs-headline` | 1.0625rem | 17px | 粗體強調（= body 大小，靠 weight 區分） |
   | Body | `--fs-body` | 1.0625rem | 17px | 正文預設、body default |
   | Callout | `--fs-callout` | 1rem | 16px | 次要內容、描述文字、footer |
   | Subheadline | `--fs-subheadline` | 0.9375rem | 15px | 副標籤、天氣時間、日期 |
   | Footnote | `--fs-footnote` | 0.8125rem | 13px | 中繼資訊、旗幟、導航按鈕 |
   | Caption | `--fs-caption` | 0.75rem | 12px | 最小可讀文字、行程副標 |
   | Caption 2 | `--fs-caption2` | 0.6875rem | 11px | 預留（目前無元素使用） |

2. **`--fs-headline` = `--fs-body` 同值不算重複**：這是 Apple 的刻意設計——兩者皆為 17px，但 headline 搭配 semibold/bold 使用，body 搭配 regular weight。不同於色彩系統的同值重複（那是意外），此為語意區分。

3. **舊變數對映規則**：
   - `--fs-display` → `--fs-large-title`（40px → 34px，-6px）
   - `--fs-lg` → 依元素角色分配到 `--fs-title2`(22px) 或 `--fs-title3`(20px)
   - `--fs-md` → 依元素角色分配到 `--fs-body`(17px)、`--fs-callout`(16px) 或 `--fs-subheadline`(15px)
   - `--fs-sm` → 依元素角色分配到 `--fs-footnote`(13px) 或 `--fs-caption`(12px)

4. **元素重新分配（主要變動）**：

   | 元素 | 舊級 | 新級 | 變化 |
   |------|------|------|------|
   | `.countdown-number` | display (40px) | large-title (34px) | -6px |
   | `.nav-brand a` | display (40px) | large-title (34px) | -6px |
   | `.day-header h2` | lg (20px) | title2 (22px) | +2px |
   | `.tl-title` | lg (20px) | title3 (20px) | 不變 |
   | `.nav-title` | lg (20px) | title3 (20px) | 不變 |
   | `.dn` (day pills) | lg (20px) | body (17px) | -3px |
   | body default | md (18px) | body (17px) | -1px |
   | `.tl-desc` | md (18px) | callout (16px) | -2px |
   | `.dh-date` | md (18px) | subheadline (15px) | -3px |
   | `.hw-block-time` | md (18px) | subheadline (15px) | -3px |
   | `.tl-flag` | sm (14px) | footnote (13px) | -1px |
   | `.trip-btn .trip-sub` | sm (14px) | caption (12px) | -2px |
   | `.rating` | sm (14px) | caption (12px) | -2px |

5. **移除桌面版覆寫**：刪除 `shared.css` 中 `@media (min-width: 768px)` 的 `--fs-*` 覆寫區塊。Apple HIG 在所有裝置使用相同 text style scale。

6. **Content max-width 收窄**：`--content-max-w: 800px` → `720px`。17px body × 720px ≈ 38 字/行，落在 CJK 最佳閱讀範圍 25-40 字內。

7. **`--fs-title` 和 `--fs-caption2` 暫不使用**：定義但不分配給任何元素，為未來擴充預留。Apple HIG 完整定義 11 級，即使當前不全用也應全部定義。

8. **命名規則遵循 Apple 慣例**：第一項不編號（title, caption），後續編號（title2, title3, caption2）。不使用 title1 或 caption1。

## Risks / Trade-offs

- [body 預設從 18px → 17px] → 全站文字略小，但 17px 是 Apple 標準 body size，CJK 文字在此尺寸下仍清晰可讀
- [display 40px → large-title 34px] → 倒數計時數字和品牌文字縮小，但 34px 已足夠醒目
- [day pills 從 20px → 17px] → 日期導航按鈕文字縮小 3px，需確認觸控目標尺寸仍足夠（Phase 4 已處理 44px 最小觸控目標）
- [content-max-w 800px → 720px] → 桌面版內容區窄 80px，已發佈行程的版面會微調
- [大量元素重新分配] → 影響 style.css 60+ 處、edit.css 12+ 處、setting.css 4+ 處，需逐一視覺確認
