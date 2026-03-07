import { describe, it, expect, beforeEach } from 'vitest';

const { createSkeleton, renderSlotError } = require('../../js/app.js');

/* ===== 3.4 Skeleton DOM + Slot Error ===== */

describe('createSkeleton', () => {
  it('creates day sections for each dayId', () => {
    const html = createSkeleton([1, 2, 3]);
    expect(html).toContain('data-day="1"');
    expect(html).toContain('data-day="2"');
    expect(html).toContain('data-day="3"');
  });

  it('includes loading placeholder in day slots', () => {
    const html = createSkeleton([1]);
    expect(html).toContain('slot-loading');
    expect(html).toContain('載入中');
  });

  it('includes info section slots', () => {
    const html = createSkeleton([1]);
    expect(html).toContain('id="flights-slot"');
    expect(html).toContain('id="checklist-slot"');
    expect(html).toContain('id="backup-slot"');
    expect(html).toContain('id="emergency-slot"');
    expect(html).toContain('id="suggestions-slot"');
    expect(html).toContain('id="footer-slot"');
  });

  it('includes driving-slot', () => {
    const html = createSkeleton([1]);
    expect(html).toContain('id="driving-slot"');
  });

  it('creates correct day-slot ids', () => {
    const html = createSkeleton([1, 2]);
    expect(html).toContain('id="day-slot-1"');
    expect(html).toContain('id="day-slot-2"');
  });

  it('day sections are hidden by default', () => {
    const html = createSkeleton([1]);
    expect(html).toContain('display:none');
  });
});

describe('renderSlotError', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="test-slot"></div>';
  });

  it('renders error message in slot', () => {
    renderSlotError('test-slot', 'Something went wrong');
    const el = document.getElementById('test-slot');
    expect(el.innerHTML).toContain('slot-error');
    expect(el.innerHTML).toContain('Something went wrong');
  });

  it('includes icon', () => {
    renderSlotError('test-slot', 'error');
    const el = document.getElementById('test-slot');
    expect(el.innerHTML).toContain('svg-icon');
  });

  it('does nothing when slot not found', () => {
    renderSlotError('nonexistent', 'error');
    // No error thrown
    expect(true).toBe(true);
  });

  it('escapes HTML in message', () => {
    renderSlotError('test-slot', '<script>alert(1)</script>');
    const el = document.getElementById('test-slot');
    expect(el.innerHTML).not.toContain('<script>');
    expect(el.innerHTML).toContain('&lt;script&gt;');
  });
});
