# F-1 DestinationArt 工程師報告

## 結果

- `npx tsc --noEmit` — 0 errors
- `npm test` — 440 passed, 0 failed

## 架構

### 新檔案
- `src/components/trip/DestinationArt.tsx` — 獨立元件，不修改 ThemeArt.tsx

### 修改檔案
- `css/style.css` — 新增 `.destination-art` CSS + sticky-nav z-index 分層
- `src/pages/TripPage.tsx` — import DestinationArt，嵌入 sticky-nav

## 設計決策

### 目的地 SVG 主題（5 個）

| 目的地 | 元素 | light opacity | dark opacity |
|--------|------|--------------|-------------|
| okinawa | 海浪、風獅爺、珊瑚、熱帶魚、扶桑花 | 0.15-0.35 | 0.08-0.20 |
| busan | 廣安大橋、海鷗、海浪、釜山塔 | 0.12-0.20 | 0.06-0.12 |
| kyoto | 鳥居、楓葉、竹林、寺廟屋簷 | 0.12-0.18 | 0.06-0.10 |
| banqiao | 林家花園亭閣、夜市紅燈籠、老街屋簷 | 0.12-0.20 | 0.06-0.12 |
| generic | 飛機、指南針、行李箱（fallback） | 0.12 | 0.08 |

### tripId → 目的地映射
```ts
resolveDestination(tripId):
  startsWith('okinawa') → 'okinawa'
  startsWith('busan')   → 'busan'
  startsWith('kyoto')   → 'kyoto'
  startsWith('banqiao') → 'banqiao'
  fallback              → 'generic'
```

### CSS 分層
```
.sticky-nav (position: relative)
  └─ .destination-art (position: absolute, inset: 0, z-index: 0)
  └─ nav-brand, DayNav, NavArt (position: relative, z-index: 1)
```

### SVG 規格
- viewBox: `0 0 480 48`
- preserveAspectRatio: `xMidYMid slice`（填滿寬度，居中裁切）
- 簡約線條風格，低對比度背景用途

## 注意事項
- DestinationArt 用 `memo` 包裝，只在 `tripId` 或 `dark` 變化時重新渲染
- 不干擾 DayNav pill 的可讀性：所有元素 opacity 極低
- dark mode 整體再降 opacity 以配合深色背景
- `.sticky-nav > [aria-hidden="true"]` 的 mask-image 規則會自動套用到 DestinationArt
