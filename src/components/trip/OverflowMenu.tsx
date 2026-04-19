import { useState, useCallback, useRef, useEffect } from 'react';
import clsx from 'clsx';
import Icon from '../shared/Icon';

/* ===== Menu item config ===== */

type MenuAction = 'sheet' | 'download';

interface MenuItem {
  key: string;
  icon: string;
  label: string;
  action: MenuAction;
  /** If true, disable when offline (write actions only). */
  requiresOnline?: boolean;
}

/** Items that don't have a topbar home — overflow menu hosts them. */
export const OVERFLOW_ITEMS: MenuItem[] = [
  /* Info sheets */
  { key: 'checklist', icon: 'check-circle', label: '出發清單', action: 'sheet' },
  { key: 'backup', icon: 'backup', label: '雨天備案', action: 'sheet' },
  { key: 'driving', icon: 'car', label: '交通統計', action: 'sheet' },
  /* Settings */
  { key: 'trip-select', icon: 'swap-horiz', label: '切換行程', action: 'sheet', requiresOnline: true },
  { key: 'appearance', icon: 'palette', label: '外觀設定', action: 'sheet' },
  /* Downloads */
  { key: 'download-pdf', icon: 'download', label: '匯出 PDF', action: 'download' },
  { key: 'download-md', icon: 'doc', label: '匯出 Markdown', action: 'download' },
  { key: 'download-json', icon: 'code', label: '匯出 JSON', action: 'download' },
  { key: 'download-csv', icon: 'table', label: '匯出 CSV', action: 'download' },
];

/* ===== Props ===== */

interface OverflowMenuProps {
  onSheet: (key: string) => void;
  onDownload: (format: string) => void;
  isOnline?: boolean;
}

/* ===== Component ===== */

export default function OverflowMenu({ onSheet, onDownload, isOnline = true }: OverflowMenuProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setOpen(false), []);

  /* --- Escape + click-outside --- */
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
        triggerRef.current?.focus();
      }
    }
    function onClick(e: MouseEvent) {
      const target = e.target as Node;
      if (menuRef.current && !menuRef.current.contains(target) && !triggerRef.current?.contains(target)) {
        close();
      }
    }
    window.addEventListener('keydown', onKey);
    window.addEventListener('mousedown', onClick);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('mousedown', onClick);
    };
  }, [open, close]);

  const handleItem = useCallback((item: MenuItem) => {
    if (!isOnline && item.requiresOnline) return;
    if (item.action === 'sheet') onSheet(item.key);
    else if (item.action === 'download') onDownload(item.key.replace('download-', ''));
    close();
  }, [onSheet, onDownload, isOnline, close]);

  return (
    <div className="ocean-overflow-wrap">
      <button
        ref={triggerRef}
        type="button"
        className="ocean-tb-btn"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="更多功能"
        onClick={() => setOpen((v) => !v)}
      >
        <span aria-hidden="true">☰</span>
        <span className="ocean-tb-label">更多</span>
      </button>

      {open && (
        <div
          ref={menuRef}
          role="menu"
          className="ocean-overflow-menu"
          aria-label="更多功能"
        >
          {OVERFLOW_ITEMS.map((item, i) => {
            const disabled = !isOnline && !!item.requiresOnline;
            const prev = OVERFLOW_ITEMS[i - 1];
            const needsDivider = prev && prev.action !== item.action;
            return (
              <>
                {needsDivider && <div key={`div-${item.key}`} className="ocean-overflow-divider" role="separator" />}
                <button
                  key={item.key}
                  type="button"
                  role="menuitem"
                  className={clsx('ocean-overflow-item', disabled && 'is-disabled')}
                  disabled={disabled}
                  onClick={() => handleItem(item)}
                >
                  <Icon name={item.icon} />
                  <span>{item.label}</span>
                </button>
              </>
            );
          })}
        </div>
      )}
    </div>
  );
}
