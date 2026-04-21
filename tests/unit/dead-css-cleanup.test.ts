/**
 * dead-css-cleanup.test.ts — F001 TDD red test
 *
 * 驗證 tokens.css 不含 top-level (非 @media print 內) 的 dead CSS selectors：
 * - .ocean-body
 * - .ocean-main
 * - .ocean-side（非 .ocean-side-card 等衍生 class）
 * - .info-panel（InfoPanel 已 orphan）
 *
 * @media print 內部允許保留（未檢查）
 */

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

const tokensPath = join(process.cwd(), 'css', 'tokens.css');
const css = readFileSync(tokensPath, 'utf-8');

/**
 * 從 CSS 移除 @media print block 後的內容，
 * 再去除所有 body.print-mode 規則，以排除 print-mode 相關合法保留。
 */
function removePrintBlocks(src: string): string {
  // Remove body.print-mode {...} rule blocks
  return src.replace(/body\.print-mode\s+[^{]*\{[^}]*\}/g, '');
}

const nonPrintCss = removePrintBlocks(css);

describe('tokens.css — dead CSS 清理 (F001)', () => {
  it('不含 top-level .ocean-body selector（非 print-mode）', () => {
    // Match standalone .ocean-body { (not inside body.print-mode)
    const match = nonPrintCss.match(/(?<![a-z-])\.(ocean-body)\s*\{/);
    expect(match).toBeNull();
  });

  it('不含 top-level .ocean-main selector', () => {
    const match = nonPrintCss.match(/(?<![a-z-])\.(ocean-main)\s*\{/);
    expect(match).toBeNull();
  });

  it('不含 top-level .ocean-side selector（ocean-side-card 允許保留）', () => {
    // Match .ocean-side { but not .ocean-side-card
    const match = nonPrintCss.match(/\.(ocean-side)\s*\{/);
    expect(match).toBeNull();
  });

  it('不含 .info-panel selector（InfoPanel 已 orphan）', () => {
    const match = css.match(/\.(info-panel)\s*[\{,]/);
    expect(match).toBeNull();
  });

  it('不含 --info-panel-w CSS variable 宣告', () => {
    const match = css.match(/--info-panel-w\s*:/);
    expect(match).toBeNull();
  });
});
