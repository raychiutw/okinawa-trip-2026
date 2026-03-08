## Context

Phase 0-10 建立了完整的 HIG token 系統（`:root` 變數），但全站仍有多處直接使用硬編碼值，未經 token 間接引用。這些逃逸值散佈在 transition duration（5 處）、scrollbar 色碼（6 處）、spacing（10+ 處）、觸控目標（3 類元素），以及淺/深模式 nav bar 行為不一致。此外 `openspec/config.yaml` 和 `CLAUDE.md` 的規範描述仍為舊的 4 級字型系統。

## Goals / Non-Goals

**Goals:**
- 消滅全站 CSS 中所有逃逸的硬編碼 duration — 全部改用 `--duration-fast/normal/slow`
- nav bar 在淺/深模式行為統一為毛玻璃效果
- 所有可點擊的互動元素達到 44px 最小觸控目標（含 map-link、dh-nav-arrow）
- scrollbar 色碼納入 token 系統
- spacing 值修正到 4pt grid（4 的倍數）
- 移除無效的 `body { max-width: 100vw }`
- 更新 config.yaml + CLAUDE.md 反映 11 級字型系統及 HIG token 紀律規範

**Non-Goals:**
- 不改動任何 JS 邏輯
- 不改動 HTML 結構
- 不改動 JSON 資料格式
- 不重新設計視覺風格——只修正 token 使用紀律

## Decisions

1. **Nav bar 統一為毛玻璃**

   style.css 中 `.sticky-nav` 的 `background: var(--bg)` 覆寫移除，改為半透明背景 + backdrop-filter（繼承 shared.css 的定義）。dark mode 已有半透明背景，light mode 需要對齊。

   shared.css 的 `.sticky-nav` background 改用 `color-mix(in srgb, var(--bg) 85%, transparent)` 取代寫死的 `rgba(250, 249, 245, 0.85)`，使其能隨 dark mode 變數自動適應。dark mode 的覆寫 `body.dark .sticky-nav` 也改用相同的 `color-mix` 模式。

   **替代方案：兩邊都改不透明** — 放棄 blur 效果最簡單，但 Apple 的 nav bar 標誌性視覺就是毛玻璃。

2. **Scrollbar 新增兩個 token**

   ```
   :root {
       --scrollbar-thumb: #C4C0BB;
       --scrollbar-thumb-hover: #B0ABA6;
   }
   body.dark {
       --scrollbar-thumb: #5A5651;
       --scrollbar-thumb-hover: #6A6560;
   }
   ```

   所有 scrollbar 樣式改用這兩個變數。不納入 `--border` 或 `--text-quaternary` — scrollbar 色彩在視覺上獨立，不應與文字/邊框語意耦合。

3. **Map-link 觸控目標策略**

   `.map-link` 從 `height: 28px` 改為 `min-height: var(--tap-min)`，padding 增加到 `8px 12px`。`.map-link-inline` 從 `height: 22px` 改為 `min-height: var(--tap-min)`，padding 增加到 `8px 8px`。

   `.dh-nav-arrow` 的 `min-width: 28px` 改為 `min-width: var(--tap-min)`。

   icon 的 width/height（14px, 16px, 20px 等）維持不變 — 這些是裝飾元素的視覺尺寸，不是觸控目標。

4. **Spacing 4pt grid 修正**

   | 元素 | 原值 | 修正值 | 理由 |
   |------|------|--------|------|
   | `.tl-segment` margin-left | 14px | 12px | 4pt grid |
   | `.tl-segment` padding-left | 18px | 16px | 4pt grid |
   | `.tl-segment-transit` padding-left | 18px | 16px | 同上 |
   | `.map-link` margin-bottom | 3px | 4px | 4pt grid |
   | `.map-link` height | 28px | 移除，改用 min-height + padding | |
   | `.map-link-inline` height | 22px | 移除，改用 min-height + padding | |
   | `.tl-flag-num` width/height | 18px | 20px | 4pt grid |
   | mobile `.tl-flag-num` | 16px | 16px | 已在 grid（不變） |
   | mobile `.tl-segment` margin-left | 10px | 8px 或 12px | 4pt grid — 選 12px 維持視覺寬度 |
   | mobile `.tl-segment` padding-left | 14px | 12px 或 16px | 4pt grid — 選 12px 搭配 margin |
   | mobile `.tl-segment-transit` padding-left | 14px | 12px | 同上 |

5. **Transition duration 全面 token 化**

   | 檔案 | 原值 | 修正 |
   |------|------|------|
   | `shared.css` body transition | `0.3s ease` | `var(--duration-slow) var(--ease-apple)` |
   | `style.css` `.dh-nav-wrap::before/after` | `opacity 0.2s` | `opacity var(--duration-fast)` |
   | `style.css` `.sheet-close-btn` | `background 0.15s, color 0.15s` | `background var(--duration-fast), color var(--duration-fast)` |
   | `setting.css` `.color-mode-card` | `border-color 0.15s, box-shadow 0.15s` | `border-color var(--duration-fast), box-shadow var(--duration-fast)` |

6. **移除 `body { max-width: 100vw }`**

   `html { overflow-x: clip }` 已在 shared.css 生效，`max-width: 100vw` 多餘且在有 scrollbar 時反而造成水平溢出（100vw 含 scrollbar 寬度）。

7. **Config.yaml 更新內容**

   - context 段：4 級字型 → 11 級 Apple text style 系統（`--fs-large-title` 至 `--fs-caption2`）
   - design rules：
     - 移除 `font-size 僅允許 var(--fs-display/lg/md/sm) 四級`
     - 新增 `font-size 僅允許 11 級 Apple text style token（--fs-large-title 至 --fs-caption2），禁止硬編碼 px/rem/em`
     - 新增 `transition duration 僅允許 var(--duration-fast/normal/slow)，禁止硬編碼秒數`
     - 新增 `spacing 值須為 4pt grid（4 的倍數），特殊裝飾元素除外`
     - 新增 `所有互動元素須達 44px 最小觸控目標（var(--tap-min)）`

## Risks / Trade-offs

- [nav bar 改毛玻璃] → 淺色模式下捲動時內容透過 nav bar 可見，可能影響可讀性。Mitigation：85% opacity + saturate(180%) blur(20px) 已是 Apple 標準配方，實測可讀性佳
- [map-link 高度增加] → inline map-link 從 22px 增至 44px 會佔據更多垂直空間，timeline 卡片可能變長。Mitigation：這是正確的 trade-off — 觸控可用性優先於緊湊排版
- [spacing 微調] → `.tl-segment` margin-left 從 14px → 12px 會讓 timeline 虛線稍微左移 2px，視覺上極微小
- [config.yaml 更新] → 已有 change 的 openspec instructions 可能快取舊 context，需確認更新後重新讀取
