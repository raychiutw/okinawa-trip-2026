## Proposal: Tailwind CSS v4 整合 — @theme 作為唯一 token source

### 背景

目前色彩 token 定義在 `css/shared.css` 的 `body.theme-*` 選擇器中（原生 CSS 變數）。
本次引入 Tailwind CSS v4，以 `@theme` 作為 design token 的唯一定義處（方案 B），
消除雙層映射，同時獲得 utility class 能力。

### 影響範圍

| 類別 | 檔案 | 變更 |
|------|------|------|
| 新增依賴 | `package.json` | `tailwindcss`, `@tailwindcss/vite` |
| Vite 設定 | `vite.config.ts` | 加入 Tailwind plugin |
| Token 定義 | `css/shared.css` | 色彩 token 移至 `@theme`，`body.theme-*` 改為 `@layer base` override |
| Token 引用 | `css/style.css`, `setting.css`, `manage.css`, `edit.css`, `admin.css` | `var(--accent)` → `var(--color-accent)` 等命名空間化 |
| Token 引用 | `src/pages/TripPage.tsx`, `SettingPage.tsx`, `ManagePage.tsx` | inline style 中 6 個 var 引用更新 |
| 非色彩 token | `css/shared.css` `:root` | `--radius-*`, `--shadow-*` 等移入 `@theme`（命名已符合 Tailwind namespace） |

### 命名對照

色彩 token 加上 `--color-` 前綴以啟用 Tailwind color utility：

| 現有 | @theme 命名 | 產生的 utility |
|------|-------------|---------------|
| `--accent` | `--color-accent` | `bg-accent`, `text-accent`, `border-accent` |
| `--accent-subtle` | `--color-accent-subtle` | `bg-accent-subtle` |
| `--accent-bg` | `--color-accent-bg` | `bg-accent-bg` |
| `--bg` | `--color-surface` | `bg-surface` |
| `--bg-secondary` | `--color-surface-secondary` | `bg-surface-secondary` |
| `--bg-tertiary` | `--color-surface-tertiary` | `bg-surface-tertiary` |
| `--hover-bg` | `--color-hover` | `bg-hover` |
| `--text` | `--color-foreground` | `text-foreground` |
| `--text-muted` | `--color-muted` | `text-muted` |
| `--text-on-accent` | `--color-on-accent` | `text-on-accent` |
| `--border` | `--color-border` | `border-border` |
| `--error` | `--color-error` | `text-error` |
| `--error-bg` | `--color-error-bg` | `bg-error-bg` |
| `--success` | `--color-success` | `text-success` |
| `--shadow-md` | `--shadow-md` | `shadow-md`（不變） |
| `--shadow-lg` | `--shadow-lg` | `shadow-lg`（不變） |
| `--overlay` | `--color-overlay` | `bg-overlay` |

非色彩 token 命名已對齊 Tailwind namespace，不需改名：
- `--radius-*` → `rounded-*`
- `--shadow-*` → `shadow-*`
- `--font-size-*`（`--fs-*` → 改為 `--font-size-*`）→ `text-*`

### 架構設計

```css
/* css/shared.css */

/* ===== @theme: 唯一 token 定義處 ===== */
/* 預設值 = theme-sun light */
@theme {
  /* Colors */
  --color-accent: #E86A4A;
  --color-accent-subtle: #FDE8E2;
  --color-accent-bg: #F9DDD4;
  --color-surface: #FBF3E8;
  --color-surface-secondary: #F0DABC;
  --color-surface-tertiary: #E5CBA8;
  --color-hover: #EACFAE;
  --color-foreground: #2E2418;
  --color-muted: #7A6A56;
  --color-on-accent: #FBF3E8;
  --color-border: #DDCEB8;
  --color-error: #C83030;
  --color-error-bg: #FDECEC;
  --color-success: #3D8E5A;
  --color-overlay: rgba(0,0,0,0.35);
  /* ...其餘色彩 token */

  /* Radius（命名已對齊） */
  --radius-xs: 4px;
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-full: 99px;

  /* Shadow */
  --shadow-md: 0 4px 16px rgba(46,36,24,0.12);
  --shadow-lg: 0 6px 20px rgba(46,36,24,0.18);
}

/* ===== Non-color tokens（不需 utility，保持 :root） ===== */
:root {
  --shadow-ring: 0 0 0 2px var(--color-accent);
  --content-max-w: 720px;
  --info-panel-w: 280px;
  --nav-h: 48px;
  --padding-h: 16px;
  --font-system: -apple-system, ...;
  --lh-tight: 1.2;
  --lh-normal: 1.5;
  --lh-relaxed: 1.7;
  --ease-apple: cubic-bezier(0.2, 0.8, 0.2, 1);
  --duration-fast: 150ms;
  --duration-normal: 250ms;
  --duration-slow: 350ms;
  --tap-min: 44px;
  --z-*: ...;
  --fs-*: ...;  /* font-size token 暫保留原名，後續再 migrate */
}

/* ===== Theme overrides（@layer base） ===== */
@layer base {
  body.theme-sun.dark {
    --color-accent: #F4A08A;
    --color-surface: #1E1A16;
    /* ... */
  }
  body.theme-sky { ... }
  body.theme-sky.dark { ... }
  body.theme-zen { ... }
  body.theme-zen.dark { ... }
  body.theme-print { ... }
}
```

### 實作 Tasks

1. **安裝 Tailwind v4** — `npm install tailwindcss @tailwindcss/vite`，更新 `vite.config.ts`
2. **重構 shared.css** — 將 token 定義移入 `@theme`，theme override 移入 `@layer base`
3. **批次更名 CSS** — 5 個 CSS 檔案中 ~350 個 `var()` 引用更新命名
4. **更新 TSX inline style** — 3 個 TSX 檔案中 6 個 var 引用
5. **更新 shared.css 非色彩引用** — `--shadow-ring` 等引用新名稱
6. **TypeScript 驗證** — `npx tsc --noEmit`
7. **測試** — `npm test` 確保 naming-convention + css-hig 測試通過
8. **Build 驗證** — `npm run build` 確保 Vite + Tailwind 建置成功

### 不變項目

- `useDarkMode.ts` 的 class toggle 邏輯不變（`body.theme-sun`, `.dark`）
- 既有 CSS 規則的選擇器結構不變
- 非色彩 token（typography / spacing / z-index）暫保留 `:root`
- 不強制將現有 CSS 改寫為 utility class（漸進式採用）

---

### Requirement: @theme 為色彩 token 唯一定義處

系統 SHALL 在 `css/shared.css` 的 `@theme` 區塊中定義所有色彩 design token，預設值對應 theme-sun light。其他 CSS 檔案 MUST 引用 `var(--color-*)` 命名空間的變數，不得自行宣告色彩值。

#### Scenario: @theme 中定義 accent 色彩 token

- **WHEN** 載入 `css/shared.css`
- **THEN** `@theme` 中 SHALL 存在 `--color-accent`，且對應 Tailwind 產生 `bg-accent`、`text-accent` 等 utility class

#### Scenario: 舊命名 --accent 已不存在

- **WHEN** 搜尋所有 CSS 與 TSX 檔案
- **THEN** SHALL 不存在 `var(--accent)` 引用（須使用 `var(--color-accent)`）

---

### Requirement: Theme override 定義於 @layer base

系統 SHALL 在 `@layer base` 中以 `body.theme-*` 選擇器覆寫 `@theme` 定義的色彩變數，保持 light → dark 順序。

#### Scenario: sky 主題覆寫 accent

- **WHEN** 頁面有 `body.theme-sky`
- **THEN** `--color-accent` SHALL 為 `#2870A0`

#### Scenario: dark mode 覆寫

- **WHEN** 頁面有 `body.theme-sun.dark`
- **THEN** `--color-accent` SHALL 為 `#F4A08A`

---

### Requirement: Tailwind CSS v4 Vite 整合

系統 SHALL 在 `vite.config.ts` 中使用 `@tailwindcss/vite` plugin，使 Tailwind CSS v4 的 `@theme` 和 utility class 在建置時生效。

#### Scenario: Vite build 成功

- **WHEN** 執行 `npm run build`
- **THEN** 建置 SHALL 成功完成，dist/ 中的 CSS 包含 Tailwind 產生的 utility class
