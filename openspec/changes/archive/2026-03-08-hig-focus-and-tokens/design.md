## Context

經過 13 輪 HIG 打磨（286+ 項），全站 CSS 已高度符合 Apple HIG。第三輪審查發現三類殘留問題：focus-visible 缺口（最嚴重）、rgba 色彩未 token 化、pseudo-element 微間距。本次修正完成後，全站 HIG 合規度將達到可量化的 100%。

## Goals / Non-Goals

**Goals:**
- 所有互動元素都有可見的鍵盤 focus indicator
- 所有 backdrop overlay 色彩統一由 token 管理
- 所有 pseudo-element 間距符合 4pt grid
- 測試覆蓋以上三項紀律，防止回歸

**Non-Goals:**
- Print mode 色彩（已排除）
- 品牌色（Google/Naver/GitHub）
- Scrollbar 裝飾尺寸
- Color mode preview 裝飾尺寸
- `cursor: pointer` 策略（Apple HIG 不要求 web pointer 變化）

## Decisions

### D1: Focus-visible 實作方式

**選擇**：在各元素的 `:focus-visible` 加上 `box-shadow: var(--shadow-ring)`，與現有 `.dn`、`.nav-close-btn`、`.sheet-close-btn` 一致。

**替代方案**：改 `shared.css` 的 reset 為 `button:focus-visible { outline: none; box-shadow: var(--shadow-ring); }` 一次性覆蓋所有按鈕。

**理由**：一次性覆蓋方案更簡潔且防未來遺漏，但可能影響到不需要 ring 的元素（如 `.speed-dial-item` 圓形按鈕可能需要不同的 ring 樣式）。採取折衷：在 `shared.css` 加通用 `button:focus-visible` ring，再對特殊形狀元素個別覆寫。

### D2: Backdrop overlay token 命名

**選擇**：`--overlay` / body.dark 覆寫 `--overlay`

**替代方案**：`--backdrop-bg` / `--backdrop-bg-dark` 分開定義。

**理由**：使用單一 `--overlay` token，在 `body.dark` 中覆寫值，與現有 `--bg`、`--border` 等 token 覆寫模式一致。dark mode 自然加深透明度。

### D3: .ov-card h4::before 裝飾圓點尺寸

**選擇**：維持 `10px`（不修改）。

**理由**：10px 圓點在視覺比例上與 `h4` 文字最平衡。改 8px 太小、12px 太大。此為純裝飾元素，不影響內容 spacing，且已在測試 allow-list 中排除。

### D4: .tl-flag-num 白色覆蓋

**選擇**：維持 `rgba(255,255,255,0.25)` 不改。

**理由**：這是在 accent 色上的半透明白色疊加，用於建立層次感。此值與主題色綁定（永遠是白色覆蓋在深色上），不需要隨主題切換，token 化反而增加不必要的抽象。

### D5: `<a>` 連結的 focus-visible

**選擇**：不移除 `<a>` 的預設 focus outline，僅處理 `button` 和有 `outline: none` 的元素。

**理由**：`shared.css` 的 `button:focus-visible { outline: none }` 只影響 `<button>`。`<a>` 標籤（如 `.map-link`、`.trip-error-link`）保留瀏覽器預設 focus outline，不需額外處理。

## Risks / Trade-offs

- **[Risk] 通用 button focus-visible 可能影響未來新增的按鈕**
  → Mitigation: 這是正確行為 — 新按鈕自動獲得 focus ring，符合 HIG 精神

- **[Risk] `.speed-dial-item` 圓形按鈕的 ring 可能需要 `border-radius: 50%` 配合**
  → Mitigation: `box-shadow` ring 自然跟隨元素形狀，圓形元素的 ring 也是圓形，無需額外處理

- **[Risk] 修改 `.sheet-handle` 高度從 5px→4px 可能影響拖曳手感**
  → Mitigation: 差異極微（1px），且 4px 更符合 4pt grid 一致性
