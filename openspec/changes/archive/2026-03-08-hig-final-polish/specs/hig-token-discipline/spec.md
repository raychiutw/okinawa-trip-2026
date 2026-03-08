## ADDED Requirements

### Requirement: Transition duration 禁止硬編碼
全站 CSS 的 `transition` 和 `animation-duration` 屬性 SHALL 僅使用 `var(--duration-fast)`、`var(--duration-normal)`、`var(--duration-slow)` 三個 token。禁止出現硬編碼的 `0.15s`、`0.2s`、`0.3s`、`150ms`、`250ms`、`350ms` 等數值。

#### Scenario: body 深淺模式切換動畫
- **WHEN** 檢查 `shared.css` 中 `body` 的 `transition` 屬性
- **THEN** duration 值 SHALL 為 `var(--duration-slow)`，easing 值 SHALL 為 `var(--ease-apple)`

#### Scenario: 全站搜尋硬編碼 duration
- **WHEN** 以正則 `\d+(\.\d+)?s(?!rgb)` 搜尋全站 CSS（排除 `:root` 變數定義行和 `@keyframes` 內部）
- **THEN** 結果 SHALL 為零匹配

### Requirement: 互動元素最小觸控目標
所有可接收使用者點擊/觸控的互動元素（`<a>`、`<button>`、以及 role="button" 的元素）SHALL 達到 44×44px 的最小觸控目標尺寸，使用 `var(--tap-min)` token 或等效的 `min-width` / `min-height` / `padding` 組合。

#### Scenario: map-link 觸控目標
- **WHEN** 檢查 `.map-link` 的計算高度
- **THEN** SHALL 大於等於 44px

#### Scenario: map-link-inline 觸控目標
- **WHEN** 檢查 `.map-link-inline` 的計算高度
- **THEN** SHALL 大於等於 44px

#### Scenario: dh-nav-arrow 觸控目標
- **WHEN** 檢查 `.dh-nav-arrow` 的計算寬度
- **THEN** SHALL 大於等於 44px

### Requirement: Spacing 值遵循 4pt grid
全站 CSS 的 `margin`、`padding`、`gap`、`width`、`height`（用於佈局間距的）SHALL 為 4 的倍數（0, 4, 8, 12, 16, 20, 24...）。裝飾性元素（dot、badge 圓點、scrollbar thumb 等）內部尺寸不受此限。

#### Scenario: tl-segment 間距
- **WHEN** 檢查 `.tl-segment` 的 `margin-left` 和 `padding-left`
- **THEN** 兩者 SHALL 各為 4 的倍數

#### Scenario: map-link margin-bottom
- **WHEN** 檢查 `.map-link` 的 `margin-bottom`
- **THEN** SHALL 為 4 的倍數

### Requirement: 淺色/深色模式視覺行為一致
同一 UI 元件在淺色模式和深色模式下 SHALL 表現相同的視覺行為模式（透明度策略、blur 效果、shadow 策略）。僅色彩值不同，不可出現一邊透明一邊不透明的行為差異。

#### Scenario: nav bar 背景策略
- **WHEN** 比較 `.sticky-nav` 在淺色模式和深色模式的 `background` 屬性
- **THEN** 兩者 SHALL 都使用半透明背景（非 100% opaque），且都啟用 `backdrop-filter`

### Requirement: Scrollbar 色碼 token 化
scrollbar 相關的色彩 SHALL 通過 CSS 變數引用，不得硬編碼色碼值。`:root` 和 `body.dark` 中 SHALL 定義 `--scrollbar-thumb` 和 `--scrollbar-thumb-hover` token。

#### Scenario: 淺色模式 scrollbar 色碼
- **WHEN** 檢查 `::-webkit-scrollbar-thumb` 的 `background`
- **THEN** SHALL 使用 `var(--scrollbar-thumb)` 而非硬編碼色碼

#### Scenario: scrollbar-color 屬性
- **WHEN** 檢查 `:root` 的 `scrollbar-color`
- **THEN** SHALL 使用 `var(--scrollbar-thumb) transparent` 而非硬編碼色碼

### Requirement: 無多餘的 body max-width
`body` 元素 SHALL NOT 設定 `max-width: 100vw`，因為 `html { overflow-x: clip }` 已防止水平溢出。

#### Scenario: body 無 max-width
- **WHEN** 檢查 `shared.css` 中 `body` 的樣式規則
- **THEN** SHALL NOT 包含 `max-width` 屬性
