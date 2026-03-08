## MODIFIED Requirements

### Requirement: 全站 CSS 色彩變數定義於 shared.css

系統 SHALL 在 `css/shared.css` 的 `:root` 與 `body.dark` 兩個區塊中集中定義所有色彩 CSS variables，light mode 與 dark mode 各一套，其他 CSS 檔案 MUST 只引用這些變數，不得自行宣告色彩值。舊的 `--blue`、`--blue-light`、`--sand`、`--sand-light` 別名 MUST 刪除，改以語意正確的 `--accent-light` 與 `--accent-muted` 取代。

完整色彩變數列表（當前值）：

| 變數 | Light 值 | Dark 值 | 用途 |
|------|----------|---------|------|
| `--accent` | `#C4704F` | `#D4845E` | 強調色 |
| `--accent-subtle` | `#F9F3EF` | `#252220` | 強調淺底（selection） |
| `--accent-bg` | `#F5EDE8` | `#3D2F27` | 強調背景 |
| `--bg` | `#FAF9F5` | `#1A1A1A` | 頁面背景 |
| `--bg-secondary` | `#F5F0E8` | `#2B2B2B` | 卡片/次層背景 |
| `--bg-tertiary` | `#F0EDE8` | `#3D3A35` | 第三層背景 |
| `--hover-bg` | `#EDE8E0` | `#3D3A37` | hover 底色 |
| `--text` | `#1A1A1A` | `#E8E8E8` | 主要文字 |
| `--text-muted` | `#6B6B6B` | `#9B9B9B` | 次要文字 |
| `--text-on-accent` | `#FFFFFF` | `#FFFFFF` | accent 上文字 |
| `--border` | `#E5E0DA` | `#3A3A3A` | 邊線色 |
| `--error` | `#D32F2F` | `#FCA5A5` | 錯誤文字 |
| `--error-bg` | `#FFEBEE` | `rgba(220,38,38,0.12)` | 錯誤背景 |
| `--success` | `#10B981` | `#6EE7B7` | 成功狀態 |
| `--overlay` | `rgba(0,0,0,0.3)` | `rgba(0,0,0,0.55)` | backdrop 遮罩 |

歷史變動紀錄：
- `--card-bg` → 改名為 `--bg-secondary`
- `--bubble-bg` → 改名為 `--bg-tertiary`
- `--accent-light` → 改名為 `--accent-subtle`
- `--accent-muted` → 合併為 `--accent-bg`
- `--gray`、`--gray-light`、`--white` → 已刪除（語意不明確）
- `--blue`、`--blue-light`、`--sand`、`--sand-light` → 已刪除（舊別名）
- `--text-tertiary`、`--text-quaternary` → 已刪除（無使用處）
- `--shadow-sm` → 已刪除（無使用處）
- `--overlay` → 新增（backdrop 遮罩統一 token）
- `--text-on-accent` → 新增（取代硬寫 `#fff`）

#### Scenario: --accent-light 在 light mode 存在且值正確

- **WHEN** 載入 `css/shared.css`
- **THEN** `:root` 中 SHALL 存在 `--accent-light: #F5EDE8`，且 SHALL 不存在 `--blue-light`

#### Scenario: --accent-muted 在 light mode 存在且值正確

- **WHEN** 載入 `css/shared.css`
- **THEN** `:root` 中 SHALL 存在 `--accent-muted: #F5EDE0`，且 SHALL 不存在 `--sand-light`

#### Scenario: --blue 與 --sand 別名已刪除

- **WHEN** 靜態分析 `css/shared.css`
- **THEN** `:root` 中 SHALL 不存在 `--blue`、`--sand` 的宣告（print mode 與 body 覆蓋區塊亦同）

#### Scenario: --accent-light 在 dark mode 正確覆蓋

- **WHEN** `<body>` 元素含有 `.dark` class
- **THEN** `body.dark` 區塊 SHALL 覆蓋 `--accent-light: #302A25`、`--accent-muted: #302A22`

#### Scenario: Light mode 色彩變數存在且值正確

- **WHEN** 載入 `css/shared.css`
- **THEN** `:root` 中 SHALL 存在以下變數及對應值：`--bg: #FAF9F5`、`--card-bg: #F5F0E8`、`--hover-bg: #EDE8E0`、`--accent: #C4704F`、`--gray-light: #EDEBE8`、`--error: #D32F2F`、`--error-bg: #FFEBEE`、`--success: #10B981`

#### Scenario: Dark mode 色彩變數存在且值正確

- **WHEN** `<body>` 元素含有 `.dark` class
- **THEN** `body.dark` 區塊 SHALL 覆蓋以下變數：`--hover-bg: #3D3A37`、`--error: #FCA5A5`、`--error-bg: rgba(220, 38, 38, 0.12)`、`--success: #6EE7B7`

---

### Requirement: 深色模式覆蓋規範

系統 SHALL 確保所有 `body.dark` CSS 覆蓋遵守以下規則：

1. 背景色 MUST 引用 CSS 變數，不得硬寫十六進位色碼
2. 不得使用 `!important` 除非在 print mode
3. 深色覆蓋的 specificity MUST 精確匹配目標狀態（如 `:disabled`），不得過寬覆蓋

#### Scenario: info-header 深色覆蓋不使用 !important

- **WHEN** 頁面為 dark mode 且渲染 `.info-header`
- **THEN** 背景色 SHALL 由 CSS 變數控制（`var(--hover-bg)` 或 `var(--card-bg)`），不得使用 `!important`

#### Scenario: edit-send-btn 深色覆蓋限定 disabled

- **WHEN** 頁面為 dark mode 且 `.edit-send-btn` 為 enabled 狀態
- **THEN** 按鈕背景色 SHALL 為 `var(--accent)`（`#D4845E`），不被 `body.dark` 覆蓋影響

---

### Requirement: stickyNav 與 Day 1 間隔

系統 SHALL 確保 `.sticky-nav` 與第一個 Day section 之間有視覺間隔。

#### Scenario: stickyNav 下方有間隔

- **WHEN** 頁面渲染 `.sticky-nav` 和第一個 `#tripContent section`
- **THEN** 兩者之間 SHALL 有至少 `12px` 的間隔（通過 margin 實現）

---

### Requirement: 深色模式 info-box 統一

系統 SHALL 以單一通用選擇器統一所有 `.info-box` 型別在深色模式下的背景色，取代原本逐一列舉型別的寫法。

使用 `body.dark .info-box { background: var(--accent-light); }` 單一選擇器，涵蓋所有型別（`.reservation`、`.parking`、`.souvenir`、`.restaurants`、`.shopping`、`.gas-station` 及未來新增型別）。

#### Scenario: 所有 info-box 型別在 dark mode 套用相同背景

- **WHEN** 頁面為 dark mode 且渲染任何 `.info-box` 型別
- **THEN** 所有型別的背景色 SHALL 為 `var(--accent-light)`（dark mode 值：`#302A25`）

#### Scenario: 逐一列舉的舊選擇器已移除

- **WHEN** 靜態分析 `css/style.css`
- **THEN** 不得出現 `body.dark .info-box.reservation`、`body.dark .info-box.parking` 等逐一列舉型別的深色覆蓋選擇器

---

### Requirement: 全站 CSS 不得引用已刪除的別名變數

所有 CSS 檔案 MUST 將 `var(--blue)`、`var(--blue-light)`、`var(--sand)`、`var(--sand-light)` 替換為對應的新變數：

| 舊引用 | 新引用 |
|--------|--------|
| `var(--blue)` | `var(--accent)` |
| `var(--blue-light)` | `var(--accent-light)` |
| `var(--sand)` | `var(--accent)` |
| `var(--sand-light)` | `var(--accent-muted)` |

#### Scenario: 全站 CSS 不含舊別名引用

- **WHEN** 靜態分析所有 CSS 檔案（含 print mode 區塊）
- **THEN** SHALL 不出現 `var(--blue)`、`var(--blue-light)`、`var(--sand)`、`var(--sand-light)` 字串

---

### Requirement: sidebar 與 drawer 深色模式背景

系統 SHALL 在深色模式中使用 `var(--card-bg)` 作為 `.sidebar` 與 `.menu-drawer` 的背景色，使其與頁面背景（`--bg`）有層級區分。

#### Scenario: sidebar 在 dark mode 使用 card-bg

- **WHEN** 頁面為 dark mode 且顯示 `.sidebar`
- **THEN** 背景色 SHALL 為 `var(--card-bg)`（`#2B2B2B`），不得為 `var(--bg)`（`#1A1A1A`）

#### Scenario: menu-drawer 在 dark mode 使用 card-bg

- **WHEN** 頁面為 dark mode 且開啟 `.menu-drawer`
- **THEN** 背景色 SHALL 為 `var(--card-bg)`（`#2B2B2B`），與頁面背景有層級區分
