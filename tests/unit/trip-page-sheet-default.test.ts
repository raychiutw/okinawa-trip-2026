/**
 * TripPage — InfoSheet 初始狀態測試
 * 驗證 activeSheet state 預設為 null，mobile 進頁不會打開 sheet。
 * 使用靜態程式碼分析（避免 TripPage 重度 mock）。
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const tripPageSrc = readFileSync(resolve(__dirname, '../../src/pages/TripPage.tsx'), 'utf-8');

describe('TripPage — InfoSheet 初始關閉', () => {
  it('activeSheet useState 初始值必須是 null（不是字串）', () => {
    // 必須是 useState<string | null>(null)，不可以是非 null 字串
    const match = tripPageSrc.match(/useState<string\s*\|\s*null>\(([^)]+)\)/);
    expect(match).not.toBeNull();
    const initialValue = match![1].trim();
    expect(initialValue).toBe('null');
  });

  it('InfoSheet open prop 是 !!activeSheet（null → false → sheet 關閉）', () => {
    expect(tripPageSrc).toContain('open={!!activeSheet}');
  });

  it('mount 時沒有 useEffect 將 activeSheet 設為非 null 的初始值', () => {
    // 找所有 useEffect，確認沒有直接 setActiveSheet('something') 在 [] 依賴
    // 用簡單模式：setActiveSheet 的呼叫不應在 dependency=[] 的 useEffect 裡
    // 粗略驗證：不存在 setActiveSheet 傳入非 null 字串且搭配空依賴陣列
    const effectBlocks = tripPageSrc.split('useEffect(');
    for (const block of effectBlocks.slice(1)) {
      // 取到 }, []) 的最近一個依賴陣列
      const closeParen = block.lastIndexOf(', [])');
      if (closeParen === -1) continue;
      const effectBody = block.slice(0, closeParen);
      // 如果 effect 依賴陣列是空且裡面有 setActiveSheet 設非 null 值 → 違規
      if (/setActiveSheet\(['"]/.test(effectBody)) {
        throw new Error('找到 useEffect([], 空依賴) 裡設置 activeSheet 為非 null — 會導致進頁自動開 sheet');
      }
    }
    expect(true).toBe(true); // 沒有違規
  });
});
