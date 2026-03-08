## Context

全站經過 302 項 HIG 打磨，CSS 視覺品質 100%。本次針對代碼層面的技術債進行清理：死 token、冗餘覆寫、magic number、效能陷阱。所有變更都是純清理，不改變任何視覺行為。

## Goals / Non-Goals

**Goals:**
- 消除死代碼（未用 CSS token、冗餘覆寫、重複宣告）
- 提升 JS 可讀性（magic number → 常數）
- 修復 `lsRenewAll()` 效能問題（每頁載入 → 每日一次）
- 補完 ARIA 狀態管理
- 修正文件不一致（CLAUDE.md 中的 menu.js）

**Non-Goals:**
- 不改變任何視覺行為
- 不重構 JS 模組化（風險太大）
- 不拆分 `validateTripData()`（此次不做大重構）
- 不合併 render 函式模板（運作正常）
- 不改 Apple text style token 體系（`--fs-title`、`--fs-caption2` 保留）

## Decisions

### D1: 死 token 的判定標準

**選擇**：僅移除在 CSS/JS/HTML 全站搜尋完全無引用的 token。

**保留的 token**：
- `--fs-title`（Apple 11 級 text style 第 2 級，設計系統完整性）
- `--fs-caption2`（Apple 11 級 text style 第 11 級，設計系統完整性）

**移除的 token**：
- `--shadow-sm`（無人引用，且已有 `--shadow-md`/`--shadow-lg`/`--shadow-ring` 覆蓋所有用途）
- `--text-tertiary`（無人引用）
- `--text-quaternary`（無人引用）

### D2: lsRenewAll() 每日防護機制

**選擇**：在 `lsRenewAll()` 內部加檢查，用 `sessionStorage` 記錄當日已執行過，同 session 內不重複。

**理由**：
- `sessionStorage` 在分頁關閉後自動清除，下次開啟自然重新執行
- 不使用 `localStorage` 避免永久遺漏更新
- 不使用日期比較避免時區問題

### D3: aria-expanded 更新位置

**選擇**：在 `toggleCol()` 函式中，切換 `.open` class 的同時更新 `aria-expanded` 屬性。

**理由**：這是最小改動點，且與現有 toggle 邏輯完全對齊。

### D4: sticky-nav 居中佈局不抽共用 class

**選擇**：維持現狀，不抽 `.sticky-nav--centered`。

**理由**：需要改 HTML 結構，風險大於收益。edit.css 和 setting.css 各 2 行重複是可接受的。

## Risks / Trade-offs

- **[Risk] 移除 token 後未來需要時要重新加回**
  → Mitigation: git history 可追溯；且這些 token 確實未被使用

- **[Risk] lsRenewAll sessionStorage 防護在隱私模式下行為不同**
  → Mitigation: 隱私模式下 sessionStorage 仍可用，只是分頁關閉即清除（符合預期行為）
