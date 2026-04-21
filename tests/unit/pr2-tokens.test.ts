/**
 * PR 2 — tokens.css + CSS glass 統一性測試
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'fs';
import { resolve, extname } from 'path';

const ROOT = resolve(__dirname, '../../');
const tokensPath = resolve(ROOT, 'css/tokens.css');
const tokens = readFileSync(tokensPath, 'utf-8');

// ——— Item 2: tokens.css 新 token ———
describe('tokens.css — 新 token', () => {
  it('包含 --font-size-eyebrow: 0.625rem (10px)', () => {
    expect(tokens).toMatch(/--font-size-eyebrow:\s*0\.625rem/);
  });

  it('包含 --font-size-caption2: 0.6875rem (11px)', () => {
    expect(tokens).toMatch(/--font-size-caption2:\s*0\.6875rem/);
  });

  it('包含 --blur-glass token', () => {
    expect(tokens).toContain('--blur-glass:');
  });

  it('--blur-glass 值為 14px', () => {
    expect(tokens).toMatch(/--blur-glass:\s*14px/);
  });

  it('包含 --color-warning token', () => {
    expect(tokens).toMatch(/--color-warning:\s*#F48C06/);
  });
});

// ——— Item 3/4: Glass blur 統一 14px ———
describe('CSS glass blur 統一性', () => {
  it('tokens.css 不存在 blur(12px)', () => {
    expect(tokens).not.toContain('blur(12px)');
  });

  it('tokens.css 不存在 blur(6px)', () => {
    expect(tokens).not.toContain('blur(6px)');
  });
});

// ——— Item 4: InfoSheet saturate 移除 ———
const infoSheetPath = resolve(ROOT, 'src/components/trip/InfoSheet.tsx');
const infoSheet = readFileSync(infoSheetPath, 'utf-8');

describe('InfoSheet — glass 清理', () => {
  it('InfoSheet 不存在 saturate(180%)', () => {
    expect(infoSheet).not.toContain('saturate(180%)');
  });

  it('InfoSheet 不存在 blur(28px)', () => {
    expect(infoSheet).not.toContain('blur(28px)');
  });
});

// ——— Item 5: hardcode 10/11px 改 token ———
describe('hardcode px → token 替換', () => {
  function collectFiles(dir: string, exts: Set<string>): string[] {
    const results: string[] = [];
    try {
      for (const entry of readdirSync(dir)) {
        const full = resolve(dir, entry);
        const stat = statSync(full);
        if (stat.isDirectory()) {
          results.push(...collectFiles(full, exts));
        } else if (exts.has(extname(entry))) {
          results.push(full);
        }
      }
    } catch { /* skip inaccessible dirs */ }
    return results;
  }

  const SCAN_EXTS = new Set(['.css', '.tsx']);
  const files = [
    ...collectFiles(resolve(ROOT, 'css'), SCAN_EXTS),
    ...collectFiles(resolve(ROOT, 'src'), SCAN_EXTS),
  ];

  it('css/ + src/ 不存在 font-size: 10px hardcode（應改 var(--font-size-eyebrow)）', () => {
    const violations: string[] = [];
    for (const file of files) {
      const content = readFileSync(file, 'utf-8');
      // 找 font-size: 10px（排除 @theme 中的 token 定義本身）
      const lines = content.split('\n');
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i] ?? '';
        if (/font-size:\s*10px/.test(line) && !line.includes('--font-size-eyebrow')) {
          violations.push(`${file.replace(ROOT, '')}:${i + 1}: ${line.trim()}`);
        }
      }
    }
    if (violations.length > 0) {
      throw new Error(`找到 hardcode 10px font-size（應改 var(--font-size-eyebrow)）：\n${violations.join('\n')}`);
    }
    expect(violations).toHaveLength(0);
  });

  it('css/ + src/ 不存在 font-size: 11px hardcode（應改 var(--font-size-caption2)）', () => {
    const violations: string[] = [];
    for (const file of files) {
      const content = readFileSync(file, 'utf-8');
      const lines = content.split('\n');
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i] ?? '';
        if (/font-size:\s*11px/.test(line) && !line.includes('--font-size-caption2')) {
          violations.push(`${file.replace(ROOT, '')}:${i + 1}: ${line.trim()}`);
        }
      }
    }
    if (violations.length > 0) {
      throw new Error(`找到 hardcode 11px font-size（應改 var(--font-size-caption2)）：\n${violations.join('\n')}`);
    }
    expect(violations).toHaveLength(0);
  });
});

// ——— Item 7: AI 編輯 pill 改 Ocean fill ———
const tokensContent = tokens;

describe('AI 編輯 pill — Ocean fill', () => {
  it('.ocean-tb-ai 使用 var(--color-accent) 作為 background', () => {
    // 找 .ocean-tb-ai 區塊後確認 background: var(--color-accent)
    const aiBlock = tokensContent.match(/\.ocean-tb-btn\.ocean-tb-ai\s*\{[^}]+\}/s)?.[0] ?? '';
    expect(aiBlock).toContain('var(--color-accent)');
  });

  it('.ocean-tb-ai::before cyan dot 已移除', () => {
    // ::before 中不應再有 background: #00B4D8 (cyan)
    const beforeBlock = tokensContent.match(/\.ocean-tb-btn\.ocean-tb-ai::before\s*\{[^}]+\}/s)?.[0] ?? '';
    expect(beforeBlock).not.toContain('#00B4D8');
  });
});

// ——— Item 8: 注意事項 warning amber ———
const daySectionPath = resolve(ROOT, 'src/components/trip/DaySection.tsx');
const daySection = readFileSync(daySectionPath, 'utf-8');

describe('注意事項卡 — warning amber', () => {
  it('DaySection 警告區塊 className 不含 bg-destructive-bg', () => {
    // 搜尋 warnings.length > 0 後的 className
    const warningSection = daySection.match(/warnings\.length > 0[\s\S]{0,400}/)?.[0] ?? '';
    expect(warningSection).not.toContain('bg-destructive-bg');
    expect(warningSection).not.toContain('text-destructive');
  });

  it('DaySection 警告區塊 使用 warning 色調 className', () => {
    const warningSection = daySection.match(/warnings\.length > 0[\s\S]{0,400}/)?.[0] ?? '';
    expect(warningSection).toMatch(/warning/);
  });
});
