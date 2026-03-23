/**
 * Unit tests for MapRoute component (F004)
 *
 * 測試：
 *   1. 0/1 個 pin → 不建立 Polyline
 *   2. 2+ 個 pins → 建立 Polyline，樣式正確（strokeWeight=2, strokeOpacity=0.7）
 *   3. 依 sort_order 升序排列 path
 *   4. 飯店（sortOrder=-1）排在最前
 *   5. pins 增加 → 呼叫 setPath 更新路徑而非重建
 *   6. unmount → setMap(null) 清除 Polyline
 *   7. getComputedStyle 空值 → fallback #007AFF
 *   8. getComputedStyle 有值 → 使用該值
 */

import React from 'react';
import { render } from '@testing-library/react';

/* ===== Mock google.maps.Polyline（必須在 vi.mock 之前以 vi.hoisted 宣告）===== */

const { mockSetPath, mockSetMap, mockPolyline } = vi.hoisted(() => {
  const mockSetPath = vi.fn();
  const mockSetMap = vi.fn();
  const mockPolyline = vi.fn(() => ({
    setPath: mockSetPath,
    setMap: mockSetMap,
  }));
  return { mockSetPath, mockSetMap, mockPolyline };
});

/* ===== 測試資料 ===== */

const makePins = (count: number) =>
  Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    type: 'entry' as const,
    index: i + 1,
    title: `景點 ${i + 1}`,
    lat: 26.2 + i * 0.01,
    lng: 127.7 + i * 0.01,
    sortOrder: i + 1,
  }));

const HOTEL_PIN = {
  id: 100,
  type: 'hotel' as const,
  index: 0,
  title: '那霸飯店',
  lat: 26.19,
  lng: 127.68,
  sortOrder: -1,
};

const mockMap = {} as google.maps.Map;

/* ===== Setup ===== */

beforeEach(() => {
  // @ts-expect-error — 模擬 global google.maps
  globalThis.google = {
    maps: {
      Polyline: mockPolyline,
    },
  };
  vi.clearAllMocks();
});

afterEach(() => {
  vi.restoreAllMocks();
});

/* ===== 動態 import MapRoute ===== */

async function getMapRoute() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mod = await import('../../src/components/trip/MapRoute') as any;
  return mod.MapRoute;
}

/* ===== Tests ===== */

describe('MapRoute — Polyline 建立', () => {
  it('1. 0 個 pin → 不建立 Polyline', async () => {
    const MapRoute = await getMapRoute();
    render(<MapRoute map={mockMap} pins={[]} />);

    expect(mockPolyline).not.toHaveBeenCalled();
  });

  it('2. 1 個 pin → 不建立 Polyline', async () => {
    const MapRoute = await getMapRoute();
    render(<MapRoute map={mockMap} pins={makePins(1)} />);

    expect(mockPolyline).not.toHaveBeenCalled();
  });

  it('3. 2 個 pins → 建立 Polyline', async () => {
    const MapRoute = await getMapRoute();
    render(<MapRoute map={mockMap} pins={makePins(2)} />);

    expect(mockPolyline).toHaveBeenCalledTimes(1);
  });

  it('4. Polyline 樣式：strokeWeight=2, strokeOpacity=0.7, geodesic=false', async () => {
    const MapRoute = await getMapRoute();
    render(<MapRoute map={mockMap} pins={makePins(3)} />);

    expect(mockPolyline).toHaveBeenCalledWith(
      expect.objectContaining({
        strokeWeight: 2,
        strokeOpacity: 0.7,
        geodesic: false,
        map: mockMap,
      }),
    );
  });
});

describe('MapRoute — path 排序', () => {
  it('5. 依 sort_order 升序排列 path（亂序輸入 → 排序後輸出）', async () => {
    const pins = [
      { id: 3, type: 'entry' as const, index: 3, title: '景點 C', lat: 26.22, lng: 127.72, sortOrder: 3 },
      { id: 1, type: 'entry' as const, index: 1, title: '景點 A', lat: 26.20, lng: 127.70, sortOrder: 1 },
      { id: 2, type: 'entry' as const, index: 2, title: '景點 B', lat: 26.21, lng: 127.71, sortOrder: 2 },
    ];

    const MapRoute = await getMapRoute();
    render(<MapRoute map={mockMap} pins={pins} />);

    const callArg = mockPolyline.mock.calls[0][0];
    expect(callArg.path).toEqual([
      { lat: 26.20, lng: 127.70 }, // sort_order 1
      { lat: 26.21, lng: 127.71 }, // sort_order 2
      { lat: 26.22, lng: 127.72 }, // sort_order 3
    ]);
  });

  it('6. 飯店（sortOrder=-1）排在最前，entry 依序跟隨', async () => {
    const entryPins = makePins(2);
    const pins = [entryPins[1], HOTEL_PIN, entryPins[0]]; // 故意亂序

    const MapRoute = await getMapRoute();
    render(<MapRoute map={mockMap} pins={pins} />);

    const callArg = mockPolyline.mock.calls[0][0];
    expect(callArg.path[0]).toEqual({ lat: HOTEL_PIN.lat, lng: HOTEL_PIN.lng });
  });
});

describe('MapRoute — 動態更新', () => {
  it('7. pins 增加 → 呼叫 setPath 更新，不重新建立 Polyline', async () => {
    const MapRoute = await getMapRoute();
    const { rerender } = render(<MapRoute map={mockMap} pins={makePins(2)} />);

    expect(mockPolyline).toHaveBeenCalledTimes(1);

    rerender(<MapRoute map={mockMap} pins={makePins(3)} />);

    // 不重建 Polyline，只更新路徑
    expect(mockPolyline).toHaveBeenCalledTimes(1);
    expect(mockSetPath).toHaveBeenCalledTimes(1);
  });
});

describe('MapRoute — cleanup', () => {
  it('8. unmount → setMap(null) 清除 Polyline', async () => {
    const MapRoute = await getMapRoute();
    const { unmount } = render(<MapRoute map={mockMap} pins={makePins(2)} />);

    unmount();

    expect(mockSetMap).toHaveBeenCalledWith(null);
  });

  it('9. pins 從 2 降到 1 → 清除現有 Polyline（setMap(null)）', async () => {
    const MapRoute = await getMapRoute();
    const { rerender } = render(<MapRoute map={mockMap} pins={makePins(2)} />);

    rerender(<MapRoute map={mockMap} pins={makePins(1)} />);

    expect(mockSetMap).toHaveBeenCalledWith(null);
  });
});

describe('MapRoute — strokeColor', () => {
  it('10. getComputedStyle 回傳空值 → strokeColor 使用 #007AFF fallback', async () => {
    vi.spyOn(window, 'getComputedStyle').mockReturnValue({
      getPropertyValue: () => '',
    } as unknown as CSSStyleDeclaration);

    const MapRoute = await getMapRoute();
    render(<MapRoute map={mockMap} pins={makePins(2)} />);

    const callArg = mockPolyline.mock.calls[0][0];
    expect(callArg.strokeColor).toBe('#007AFF');
  });

  it('11. getComputedStyle 回傳 accent 值 → strokeColor 使用該值', async () => {
    vi.spyOn(window, 'getComputedStyle').mockReturnValue({
      getPropertyValue: () => ' #FF6B35 ',
    } as unknown as CSSStyleDeclaration);

    const MapRoute = await getMapRoute();
    render(<MapRoute map={mockMap} pins={makePins(2)} />);

    const callArg = mockPolyline.mock.calls[0][0];
    expect(callArg.strokeColor).toBe('#FF6B35');
  });
});
