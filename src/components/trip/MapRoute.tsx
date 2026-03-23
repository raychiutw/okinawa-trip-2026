/**
 * MapRoute — 直線 Polyline 連接 markers
 *
 * F004：
 * - 使用 Google Maps Polyline API 直線連接所有 MapPin，依 sort_order 排序
 * - 飯店也參與連線（sortOrder = -1，顯示在最前）
 * - 線條樣式：accent 色，2px 寬，opacity 0.7
 * - pins 增減時動態更新路徑（setPath，不重建 Polyline）
 * - 元件 unmount 時清除 Polyline（setMap(null)）
 *
 * 顏色策略：
 * - Google Maps Polyline 需要 hex/rgb 顏色字串，無法直接傳 CSS 變數
 * - 透過 getComputedStyle 讀取 document.documentElement 的 --color-accent 解析色值
 * - fallback：若讀取失敗或空值則使用 #007AFF（系統藍）
 */

import { useEffect, useRef } from 'react';
import type { MapPin } from '../../hooks/useMapData';

/* ===== Props ===== */

export interface MapRouteProps {
  map: google.maps.Map;
  pins: MapPin[];
}

/* ===== 讀取 CSS 變數 color（hex/rgb 字串）===== */

export function getAccentColor(): string {
  try {
    const value = getComputedStyle(document.documentElement)
      .getPropertyValue('--color-accent')
      .trim();
    return value || '#007AFF';
  } catch {
    return '#007AFF';
  }
}

/* ===== 將 pins 依 sort_order 排序並轉換為 LatLng path ===== */

export function buildPath(pins: MapPin[]): google.maps.LatLngLiteral[] {
  return [...pins]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((pin) => ({ lat: pin.lat, lng: pin.lng }));
}

/* ===== Component ===== */

/**
 * MapRoute 是純副作用元件（無 DOM 輸出）。
 *
 * Effect 依賴 [map, pins]。
 * 使用 prevMapRef 追蹤 map 實例是否改變：
 * - map 改變（含初始）→ 建立新 Polyline，並直接 setPath（不在 cleanup 清 ref）
 * - 只有 pins 改變 → setPath 更新路徑
 * - pins < 2 → 清除 Polyline
 *
 * **重要**：cleanup 只在 unmount 時才清除 Polyline（透過 isMounted flag）。
 * pins 變化觸發 cleanup 時，不清除 Polyline，讓下次 effect 直接 setPath。
 */
export function MapRoute({ map, pins }: MapRouteProps) {
  const polylineRef = useRef<google.maps.Polyline | null>(null);
  const prevMapRef = useRef<google.maps.Map | null>(null);

  useEffect(() => {
    const mapChanged = prevMapRef.current !== map;
    prevMapRef.current = map;

    if (pins.length < 2) {
      // 不足 2 個 pin → 清除現有 Polyline
      if (polylineRef.current) {
        polylineRef.current.setMap(null);
        polylineRef.current = null;
      }
      return;
    }

    if (mapChanged) {
      // map 換掉 → 清除舊 Polyline，建新的
      if (polylineRef.current) {
        polylineRef.current.setMap(null);
      }
      polylineRef.current = new google.maps.Polyline({
        path: buildPath(pins),
        geodesic: false,
        strokeColor: getAccentColor(),
        strokeOpacity: 0.7,
        strokeWeight: 2,
        map,
      });
    } else if (polylineRef.current) {
      // map 未變，Polyline 存在 → 只更新路徑
      polylineRef.current.setPath(buildPath(pins));
    } else {
      // Polyline 不存在（可能初始就沒建立）→ 建立
      polylineRef.current = new google.maps.Polyline({
        path: buildPath(pins),
        geodesic: false,
        strokeColor: getAccentColor(),
        strokeOpacity: 0.7,
        strokeWeight: 2,
        map,
      });
    }
  }, [map, pins]);

  /* --- Unmount cleanup：清除 Polyline --- */
  useEffect(() => {
    return () => {
      if (polylineRef.current) {
        polylineRef.current.setMap(null);
        polylineRef.current = null;
      }
    };
  }, []);

  // 無 DOM 輸出，副作用全在 Polyline
  return null;
}
