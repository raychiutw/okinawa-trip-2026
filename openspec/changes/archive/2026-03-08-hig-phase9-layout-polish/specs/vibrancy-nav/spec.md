## ADDED Requirements

### Requirement: 導覽列毛玻璃效果
`.sticky-nav` SHALL 使用半透明背景搭配 `backdrop-filter` 產生 Apple 風格的毛玻璃（vibrancy）效果。

#### Scenario: 淺色模式毛玻璃
- **WHEN** 頁面為淺色模式且內容捲動至導覽列下方
- **THEN** `.sticky-nav` SHALL 顯示半透明背景（opacity 約 0.85）且可透視下方內容（blur 效果）

#### Scenario: 深色模式毛玻璃
- **WHEN** 頁面為深色模式且內容捲動至導覽列下方
- **THEN** `.sticky-nav` SHALL 顯示深色半透明背景（opacity 約 0.85）且可透視下方內容

### Requirement: backdrop-filter 規格
`.sticky-nav` 的 `backdrop-filter` SHALL 為 `saturate(180%) blur(20px)`，包含 `-webkit-backdrop-filter` 前綴以支援 Safari。

#### Scenario: backdrop-filter 屬性正確
- **WHEN** 檢查 `.sticky-nav` 的 CSS
- **THEN** SHALL 同時包含 `backdrop-filter` 和 `-webkit-backdrop-filter`，值為 `saturate(180%) blur(20px)`

### Requirement: 不支援 backdrop-filter 的降級
在不支援 `backdrop-filter` 的瀏覽器上，`.sticky-nav` SHALL 降級為不透明背景色（與目前行為一致），功能不受影響。

#### Scenario: 舊瀏覽器降級
- **WHEN** 瀏覽器不支援 `backdrop-filter`
- **THEN** 導覽列 SHALL 顯示不透明背景色，內容不可透視但功能正常
