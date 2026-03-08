## 1. 色彩重構：:root 定義

- [x] 1.1 `css/shared.css` `:root`：`--white` → 刪除（所有引用改為 `--bg`）
- [x] 1.2 `--card-bg` → 改名為 `--bg-secondary`
- [x] 1.3 `--bubble-bg` → 改名為 `--bg-tertiary`
- [x] 1.4 `--gray` → 刪除（所有引用改為 `--text-muted`）
- [x] 1.5 `--gray-light` → 刪除（所有引用改為 `--bg-secondary`）
- [x] 1.6 `--accent-lighter` → 改名為 `--accent-subtle`
- [x] 1.7 `--accent-light` → 改名為 `--accent-bg`
- [x] 1.8 `--accent-muted` → 刪除（所有引用改為 `--accent-bg`）
- [x] 1.9 新增 `--text-on-accent: #FFFFFF`

## 2. 色彩重構：body.dark 定義

- [x] 2.1 `body.dark` 中同步更新所有重命名變數
- [x] 2.2 新增 `--text-tertiary: #6B6B6B`、`--text-quaternary: #4A4A4A`
- [x] 2.3 新增 `--text-on-accent: #FFFFFF`

## 3. 色彩重構：全站引用替換

- [x] 3.1 `css/shared.css`：全文替換 `var(--white)` → `var(--bg)`、`var(--gray)` → `var(--text-muted)` 等
- [x] 3.2 `css/style.css`：同上全文替換（約 40+ 處）
- [x] 3.3 `css/edit.css`：同上
- [x] 3.4 `css/setting.css`：同上
- [x] 3.5 `js/app.js`：`var(--gray)` → `var(--text-muted)`（1 處）
- [x] 3.6 `js/setting.js`：`var(--gray)` → `var(--text-muted)`（1 處）

## 4. 硬編碼色清除

- [x] 4.1 `css/style.css`：`body.dark .tl-card { background: #403D3A }` → `var(--bg-tertiary)`
- [x] 4.2 `css/style.css`：`body.dark .hw-block { background: var(--hover-bg) }` → `var(--bg-secondary)`（語意修正）
- [x] 4.3 `css/style.css`：所有 `color: #fff` 在 accent 背景上的場景 → `var(--text-on-accent)`
- [x] 4.4 確認 print mode 的硬編碼色保留（print 是獨立色彩情境）

## 5. 新增 design token 變數

- [x] 5.1 新增 `--font-system` 系統字型堆疊
- [x] 5.2 新增行距 token：`--lh-tight: 1.2`、`--lh-normal: 1.5`、`--lh-relaxed: 1.7`
- [x] 5.3 新增圓角 token：`--radius-xs: 4px`、`--radius-lg: 16px`
- [x] 5.4 新增文字色階 token：`--text-tertiary: #9B9B9B`、`--text-quaternary: #C0C0C0`
- [x] 5.5 新增動畫 token：`--ease-apple`、`--duration-fast/normal/slow`
- [x] 5.6 新增觸控 token：`--tap-min: 44px`

## 6. 驗證

- [x] 6.1 確認全站無 `var(--white)`、`var(--gray)`、`var(--gray-light)`、`var(--card-bg)`、`var(--bubble-bg)`、`var(--accent-lighter)`、`var(--accent-light)`、`var(--accent-muted)` 的殘留引用
- [x] 6.2 確認 `body.dark` 中無硬編碼 hex 色值
- [x] 6.3 視覺確認淺色/深色模式頁面外觀與修改前一致
- [x] 6.4 執行測試確認無 regression
