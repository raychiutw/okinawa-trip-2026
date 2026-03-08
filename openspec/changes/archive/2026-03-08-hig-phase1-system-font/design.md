## Context

目前 3 個 HTML 頁面各自載入 Google Fonts CDN 的 Noto Sans TC（wght@400;700），CSP 中開放 `fonts.googleapis.com` 和 `fonts.gstatic.com`。CSS 中 `font-weight: 600` 被大量使用但未載入真正的 600 字重，瀏覽器合成的 faux bold 在中文字體上渲染品質差。

## Goals / Non-Goals

**Goals:**
- 移除所有 Google Fonts CDN 依賴（`<link>` 標籤、preconnect、CSP 白名單）
- body 字型改用 Phase 0 定義的 `var(--font-system)`
- 確保 CSP 不再允許外部字型來源

**Non-Goals:**
- 不改變 font-size 系統（`--fs-*` 維持不動）
- 不改變 font-weight 使用（300/400/600/700 皆保留，系統字型原生支援所有字重）

## Decisions

1. **系統字型堆疊順序**：`-apple-system` → `BlinkMacSystemFont`（Chrome on macOS）→ `"PingFang TC"`（Apple CJK）→ `"Noto Sans TC"`（Android/Linux）→ `"Microsoft JhengHei"`（Windows）→ `sans-serif`
2. **g-icon / n-icon 字型**：原本用 `'Google Sans', Arial, sans-serif`，改為 `var(--font-system)` 統一。這些 icon 只顯示單字母（G/N），任何字型都可正常渲染。
3. **CSP 清理**：`style-src` 移除 `https://fonts.googleapis.com`，`font-src` 整行移除（不再需要外部字型來源）。

## Risks / Trade-offs

- [跨平台視覺差異] → 每個 OS 使用不同字型是系統字型的本質特性，不是缺陷。Apple 裝置上會用最 Apple 的 PingFang TC。
- [Windows 微軟正黑體的 600 字重] → 微軟正黑體原生只有 Regular(400) 和 Bold(700)，600 可能仍是合成的。但 Windows 的合成比 Noto Sans TC 的合成品質好。
