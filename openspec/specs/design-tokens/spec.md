### Requirement: Shadow token 定義於 shared.css

系統 SHALL 在 `css/shared.css` 的 `:root` 中定義以下三個 shadow CSS 變數，所有 CSS 檔案 MUST 引用這些變數，不得自行硬寫等效的 `box-shadow` 數值。

| 變數 | 值 | 用途 |
|------|----|------|
| `--shadow-md` | `0 4px 12px rgba(0,0,0,0.12)` | 中等浮升（input card、FAB） |
| `--shadow-lg` | `0 6px 16px rgba(0,0,0,0.2)` | 強浮升（FAB hover） |
| `--shadow-ring` | `0 0 0 2px var(--accent)` | 焦點環（focus-visible） |

#### Scenario: 三個 shadow token 存在於 :root

- **WHEN** 載入 `css/shared.css`
- **THEN** `:root` 中 SHALL 存在 `--shadow-md`、`--shadow-lg`、`--shadow-ring` 三個變數，且值分別對應上表所定義的陰影

#### Scenario: --shadow-ring 隨 --accent 動態更新

- **WHEN** `body.dark` 覆蓋 `--accent` 為 `#D4845E`
- **THEN** `--shadow-ring` 計算後焦點環色 SHALL 自動使用 dark mode 的 `--accent` 值，無需額外覆蓋

---

### Requirement: Radius token 定義於 shared.css

系統 SHALL 在 `css/shared.css` 的 `:root` 中定義以下五個 border-radius CSS 變數，並在各 CSS 檔案中取代對應的硬寫值。

| 變數 | 值 | 用途 |
|------|----|------|
| `--radius-xs` | `4px` | 小型裝飾元素 |
| `--radius-sm` | `8px` | info-box、status-tag、map-link、警告區塊、小型元件 |
| `--radius-md` | `12px` | section card、info-card、nav-pill、trip-btn、flight-row |
| `--radius-lg` | `16px` | 大型容器、sheet panel |
| `--radius-full` | `99px` | pill tag（`.hl-tag`）、圓形按鈕 |

以下形狀屬例外，不納入 token 化：

- `border-radius: 50%`（圓形元素）
- 非對稱值如 `16px 16px 0 0`（`.info-sheet-panel` 底部抽屜形狀）

#### Scenario: 五個 radius token 存在於 :root

- **WHEN** 載入 `css/shared.css`
- **THEN** `:root` 中 SHALL 存在 `--radius-xs`、`--radius-sm`、`--radius-md`、`--radius-lg`、`--radius-full` 五個變數

---

### Requirement: Overlay token 定義於 shared.css

系統 SHALL 在 `css/shared.css` 的 `:root` 與 `body.dark` 中定義 `--overlay` CSS 變數，所有 backdrop/overlay 元素 MUST 引用此變數。

| 變數 | Light 值 | Dark 值 | 用途 |
|------|----------|---------|------|
| `--overlay` | `rgba(0,0,0,0.3)` | `rgba(0,0,0,0.55)` | backdrop 遮罩背景 |

#### Scenario: backdrop 選擇器使用 var(--overlay)

- **WHEN** 靜態分析所有 CSS 檔案中含 `backdrop` 或 `overlay` 的選擇器
- **THEN** 背景色 SHALL 引用 `var(--overlay)`，不得出現硬寫 `rgba(0,0,0,...)` 值

#### Scenario: dark mode overlay 自動加深

- **WHEN** 頁面有 `body.dark` class
- **THEN** `--overlay` SHALL 為 `rgba(0,0,0,0.55)`，比 light mode 的 `0.3` 更不透明

---

### Requirement: Priority 色彩 token 定義於 shared.css

系統 SHALL 在 `css/shared.css` 的 `:root` 與 `body.dark` 中定義以下 priority 色彩 CSS 變數，並取代 `.sg-priority-*` 的硬寫色碼。

| 變數 | Light 值 | Dark 值 |
|------|----------|---------|
| `--priority-high-bg` | `rgba(239, 68, 68, 0.15)` | `rgba(239, 68, 68, 0.22)` |
| `--priority-high-dot` | `#EF4444` | `#FCA5A5` |
| `--priority-medium-bg` | `rgba(234, 179, 8, 0.15)` | `rgba(234, 179, 8, 0.22)` |
| `--priority-medium-dot` | `#EAB308` | `#FDE047` |
| `--priority-low-bg` | `rgba(34, 197, 94, 0.10)` | `rgba(34, 197, 94, 0.15)` |
| `--priority-low-dot` | `#22C55E` | `#86EFAC` |

#### Scenario: .sg-priority-* 使用 token 而非硬寫色

- **WHEN** 靜態分析 `css/style.css`
- **THEN** `.sg-priority-high`、`.sg-priority-medium`、`.sg-priority-low` 的 `background` SHALL 引用對應的 CSS 變數，不得出現硬寫色碼

---

### Requirement: Color Mode Preview token 定義於 shared.css

系統 SHALL 在 `css/shared.css` 的 `:root` 中定義 `--cmp-*` 系列 CSS 變數，設定頁色彩模式預覽 MUST 引用這些變數。

| 變數 | 值 | 用途 |
|------|----|------|
| `--cmp-light-bg` | `#F5F5F5` | 預覽 light 背景 |
| `--cmp-light-surface` | `#FFFFFF` | 預覽 light 表面 |
| `--cmp-light-input` | `#E0E0E0` | 預覽 light 輸入框 |
| `--cmp-dark-bg` | `#1A1816` | 預覽 dark 背景 |
| `--cmp-dark-surface` | `#292624` | 預覽 dark 表面 |
| `--cmp-dark-input` | `#3D3A37` | 預覽 dark 輸入框 |

#### Scenario: color mode preview 不含硬寫色碼

- **WHEN** 靜態分析 `css/setting.css` 中 `.color-mode-light`、`.color-mode-dark`、`.color-mode-auto` 選擇器
- **THEN** 不得出現 `#F5F5F5`、`#FFFFFF`、`#E0E0E0`、`#1A1816`、`#292624`、`#3D3A37` 等硬寫值

---

### Requirement: Motion token 定義於 shared.css

系統 SHALL 在 `css/shared.css` 的 `:root` 中定義以下 motion 相關 CSS 變數，所有 CSS 檔案 MUST 引用這些變數。

| 變數 | 值 | 用途 |
|------|----|------|
| `--ease-apple` | `cubic-bezier(0.2, 0.8, 0.2, 1)` | Apple 風格 easing |
| `--duration-fast` | `150ms` | 快速互動（hover、fade） |
| `--duration-normal` | `250ms` | 一般動畫 |
| `--duration-slow` | `350ms` | 慢速過渡（頁面背景色） |

#### Scenario: 無硬編碼 transition duration

- **WHEN** 靜態分析所有 CSS 檔案（排除 `:root` 與 `body.dark` 定義區塊）
- **THEN** `transition` 宣告中不得出現硬編碼秒數（`0s` 除外），須使用 `var(--duration-*)` token
