## ADDED Requirements

### Requirement: 移除 Google Fonts CDN
3 個 HTML 頁面 SHALL 移除所有 Google Fonts 相關的 `<link>` 標籤（preconnect 和 stylesheet）。

#### Scenario: index.html 無 Google Fonts 載入
- **WHEN** 載入 index.html
- **THEN** HTML 中 SHALL 不存在任何指向 `fonts.googleapis.com` 或 `fonts.gstatic.com` 的 `<link>` 標籤

#### Scenario: edit.html 無 Google Fonts 載入
- **WHEN** 載入 edit.html
- **THEN** HTML 中 SHALL 不存在任何指向 `fonts.googleapis.com` 或 `fonts.gstatic.com` 的 `<link>` 標籤

#### Scenario: setting.html 無 Google Fonts 載入
- **WHEN** 載入 setting.html
- **THEN** HTML 中 SHALL 不存在任何指向 `fonts.googleapis.com` 或 `fonts.gstatic.com` 的 `<link>` 標籤

### Requirement: CSP 移除外部字型來源
3 個 HTML 頁面的 CSP `style-src` SHALL 不包含 `https://fonts.googleapis.com`，`font-src` 指令 SHALL 移除。

#### Scenario: CSP 不允許外部字型
- **WHEN** 檢查任何頁面的 CSP meta tag
- **THEN** SHALL 不包含 `fonts.googleapis.com` 或 `fonts.gstatic.com`

### Requirement: body 使用系統字型
`body` 的 `font-family` SHALL 使用 `var(--font-system)` 系統字型堆疊。

#### Scenario: 字型堆疊正確
- **WHEN** 檢查 body 的 computed font-family
- **THEN** SHALL 以 `-apple-system` 為首選，包含 `PingFang TC`、`Noto Sans TC`、`Microsoft JhengHei`

### Requirement: 地圖 icon 字型統一
`.g-icon` 和 `.n-icon` 的 `font-family` SHALL 改用 `var(--font-system)`。

#### Scenario: icon 字型與全站一致
- **WHEN** 渲染 Google Maps 或 Naver Maps icon
- **THEN** icon 的 font-family SHALL 與 body 使用相同的系統字型堆疊
