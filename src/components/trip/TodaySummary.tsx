/* ===== TodaySummary Component ===== */
/* Displays current day's timeline entries as a compact list for InfoPanel. */

import { memo } from 'react';
import Icon from '../shared/Icon';
import { escUrl } from '../../lib/sanitize';
import type { Entry } from '../../types/trip';

interface TodaySummaryProps {
  entries: Entry[];
  onEntryClick?: (index: number) => void;
}

/** Build Google Maps URL from entry's maps field or title fallback */
function getGoogleUrl(entry: Entry): string {
  const q = escUrl(entry.maps || '');
  if (q && /^https?:/i.test(q)) return q;
  return 'https://maps.google.com/?q=' + encodeURIComponent(entry.title || '');
}

/** Build Naver Map URL from entry's location.naverQuery if present */
function getNaverUrl(entry: Entry): string | null {
  const loc = entry.location;
  if (!loc) return null;
  const nq = escUrl(String((loc as Record<string, unknown>).naverQuery || ''));
  if (nq && /^https?:/i.test(nq)) return nq;
  return null;
}

export const TodaySummary = memo(function TodaySummary({ entries, onEntryClick }: TodaySummaryProps) {
  if (entries.length === 0) return null;

  return (
    <div className="info-card today-summary">
      <div className="info-label"><Icon name="timer" /> 今日行程</div>
      <ul className="today-summary-list">
        {entries.map((e, i) => {
          const timeStr = e.time?.split('-')[0]?.trim() || '';
          const googleUrl = getGoogleUrl(e);
          const naverUrl = getNaverUrl(e);
          return (
            <li
              key={e.id ?? i}
              className="today-summary-item"
              onClick={() => onEntryClick?.(i)}
              onKeyDown={(ev) => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); onEntryClick?.(i); } }}
              role={onEntryClick ? 'button' : undefined}
              tabIndex={onEntryClick ? 0 : undefined}
            >
              <span className="today-summary-time">{timeStr}</span>
              <span className="today-summary-title">{e.title}</span>
              <span className="today-summary-links" onClick={(ev) => ev.stopPropagation()}>
                <a href={googleUrl} target="_blank" rel="noopener noreferrer" className="today-summary-map-link" aria-label="Google Map">
                  <span className="g-icon">G</span>
                </a>
                {naverUrl && (
                  <a href={naverUrl} target="_blank" rel="noopener noreferrer" className="today-summary-map-link naver" aria-label="Naver Map">
                    <span className="n-icon">N</span>
                  </a>
                )}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
});

export default TodaySummary;
