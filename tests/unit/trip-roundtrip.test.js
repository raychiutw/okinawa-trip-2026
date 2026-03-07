import { describe, it, expect } from 'vitest';
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..');
const TRIPS_DIR = path.join(ROOT, 'data', 'trips');

// All trip slugs
const SLUGS = fs.readdirSync(TRIPS_DIR)
  .filter(f => f.endsWith('.json'))
  .map(f => f.replace('.json', ''));

function sortKeys(o) {
  if (Array.isArray(o)) return o.map(sortKeys);
  if (o && typeof o === 'object') {
    const s = {};
    Object.keys(o).sort().forEach(k => { s[k] = sortKeys(o[k]); });
    return s;
  }
  return o;
}

SLUGS.forEach(slug => {
  describe(`round-trip: ${slug}`, () => {
    const origPath = path.join(TRIPS_DIR, slug + '.json');
    const distDir = path.join(ROOT, 'data', 'dist', slug);
    let orig;

    it('split + build succeeds', () => {
      execSync('node scripts/trip-split.js ' + slug, { cwd: ROOT, stdio: 'pipe' });
      execSync('node scripts/trip-build.js ' + slug, { cwd: ROOT, stdio: 'pipe' });
      orig = JSON.parse(fs.readFileSync(origPath, 'utf8'));
    }, 30000);

    function roundTripTest(name, getOrig, getRebuilt) {
      it(name + ' round-trips without data loss', () => {
        const a = JSON.stringify(sortKeys(getOrig()));
        const b = JSON.stringify(sortKeys(getRebuilt()));
        expect(b).toBe(a);
      });
    }

    roundTripTest('meta', () => orig.meta, () => {
      return JSON.parse(fs.readFileSync(path.join(distDir, 'meta.json'), 'utf8')).meta;
    });

    roundTripTest('footer', () => orig.footer, () => {
      return JSON.parse(fs.readFileSync(path.join(distDir, 'meta.json'), 'utf8')).footer;
    });

    roundTripTest('autoScrollDates', () => orig.autoScrollDates, () => {
      return JSON.parse(fs.readFileSync(path.join(distDir, 'meta.json'), 'utf8')).autoScrollDates;
    });

    roundTripTest('flights', () => orig.flights, () => {
      const fp = path.join(distDir, 'flights.json');
      return fs.existsSync(fp) ? JSON.parse(fs.readFileSync(fp, 'utf8')) : undefined;
    });

    roundTripTest('checklist', () => orig.checklist, () => {
      return JSON.parse(fs.readFileSync(path.join(distDir, 'checklist.json'), 'utf8'));
    });

    roundTripTest('backup', () => orig.backup, () => {
      return JSON.parse(fs.readFileSync(path.join(distDir, 'backup.json'), 'utf8'));
    });

    roundTripTest('suggestions', () => orig.suggestions, () => {
      return JSON.parse(fs.readFileSync(path.join(distDir, 'suggestions.json'), 'utf8'));
    });

    roundTripTest('emergency', () => orig.emergency, () => {
      const fp = path.join(distDir, 'emergency.json');
      return fs.existsSync(fp) ? JSON.parse(fs.readFileSync(fp, 'utf8')) : undefined;
    });

    // Days - dynamic count (weather is now embedded in each day)
    it('days round-trip', () => {
      orig.days.forEach((day, idx) => {
        const dayFile = path.join(distDir, 'day-' + (idx + 1) + '.json');
        const rebuilt = JSON.parse(fs.readFileSync(dayFile, 'utf8'));
        const a = JSON.stringify(sortKeys(day));
        const b = JSON.stringify(sortKeys(rebuilt));
        expect(b, `day-${idx + 1} mismatch`).toBe(a);
      });
    });
  });
});
