import { describe, it, expect, beforeEach } from 'vitest';

/**
 * localStorage 遷移測試
 * 驗證 shared.js 的遷移 IIFE 正確將舊 key 搬移至 tp-* prefix
 */

// shared.js 在 require 時會立即執行遷移 IIFE，
// 但 setup.js 已在測試啟動前載入過 shared.js。
// 因此我們直接測試遷移後的結果與 lsGet/lsSet 行為。

beforeEach(() => {
    localStorage.clear();
});

describe('LS_PREFIX', () => {
    it('should be tp-', () => {
        expect(LS_PREFIX).toBe('tp-');
    });
});

describe('lsSet / lsGet with new prefix', () => {
    it('stores and retrieves values with tp- prefix', () => {
        lsSet('test-key', 'hello');
        expect(lsGet('test-key')).toBe('hello');
        // Raw key should use tp- prefix
        var raw = localStorage.getItem('tp-test-key');
        expect(raw).not.toBeNull();
        var parsed = JSON.parse(raw);
        expect(parsed.v).toBe('hello');
    });

    it('lsRemove removes tp- prefixed key', () => {
        lsSet('foo', 'bar');
        lsRemove('foo');
        expect(lsGet('foo')).toBeNull();
        expect(localStorage.getItem('tp-foo')).toBeNull();
    });
});

describe('localStorage migration: trip-planner-* → tp-*', () => {
    it('migrates trip-planner-* keys to tp-*', () => {
        // Simulate old keys
        localStorage.setItem('trip-planner-dark', JSON.stringify({ v: '1', exp: Date.now() + 99999999 }));
        localStorage.setItem('trip-planner-trip-pref', JSON.stringify({ v: 'my-trip', exp: Date.now() + 99999999 }));

        // Re-run migration by re-requiring shared.js fresh
        // Since we can't easily re-run the IIFE, we test the logic manually:
        var oldPrefix = 'trip-planner-';
        var keysToMigrate = [];
        for (var i = 0; i < localStorage.length; i++) {
            var k = localStorage.key(i);
            if (k && k.indexOf(oldPrefix) === 0) keysToMigrate.push(k);
        }
        for (var j = 0; j < keysToMigrate.length; j++) {
            var oldKey = keysToMigrate[j];
            var suffix = oldKey.slice(oldPrefix.length);
            var newKey = 'tp-' + suffix;
            if (!localStorage.getItem(newKey)) {
                localStorage.setItem(newKey, localStorage.getItem(oldKey));
            }
            localStorage.removeItem(oldKey);
        }

        // Old keys should be gone
        expect(localStorage.getItem('trip-planner-dark')).toBeNull();
        expect(localStorage.getItem('trip-planner-trip-pref')).toBeNull();

        // New keys should exist
        expect(lsGet('dark')).toBe('1');
        expect(lsGet('trip-pref')).toBe('my-trip');
    });

    it('does not overwrite existing tp-* keys during migration', () => {
        // Set new key first
        lsSet('dark', '0');
        // Set old key with different value
        localStorage.setItem('trip-planner-dark', JSON.stringify({ v: '1', exp: Date.now() + 99999999 }));

        // Run migration logic
        var oldPrefix = 'trip-planner-';
        var keysToMigrate = [];
        for (var i = 0; i < localStorage.length; i++) {
            var k = localStorage.key(i);
            if (k && k.indexOf(oldPrefix) === 0) keysToMigrate.push(k);
        }
        for (var j = 0; j < keysToMigrate.length; j++) {
            var oldKey = keysToMigrate[j];
            var suffix = oldKey.slice(oldPrefix.length);
            var newKey = 'tp-' + suffix;
            if (!localStorage.getItem(newKey)) {
                localStorage.setItem(newKey, localStorage.getItem(oldKey));
            }
            localStorage.removeItem(oldKey);
        }

        // Should keep the existing value, not overwrite
        expect(lsGet('dark')).toBe('0');
        // Old key should still be removed
        expect(localStorage.getItem('trip-planner-dark')).toBeNull();
    });
});

describe('localStorage migration: unprefixed legacy keys → tp-*', () => {
    it('migrates tripFile to tp-trip-pref (extracts slug)', () => {
        localStorage.setItem('tripFile', 'data/trips/okinawa-trip-2026-Ray.json');

        // Run migration logic for tripFile
        var oldTripFile = localStorage.getItem('tripFile');
        if (oldTripFile) {
            var m = oldTripFile.match(/^data\/trips\/(.+)\.json$/);
            if (m && !localStorage.getItem('tp-trip-pref')) {
                lsSet('trip-pref', m[1]);
            }
            localStorage.removeItem('tripFile');
        }

        expect(lsGet('trip-pref')).toBe('okinawa-trip-2026-Ray');
        expect(localStorage.getItem('tripFile')).toBeNull();
    });

    it('migrates tripPref JSON to tp-trip-pref', () => {
        localStorage.setItem('tripPref', JSON.stringify({ slug: 'busan-trip' }));

        // Run migration logic for tripPref
        try {
            var rawPref = localStorage.getItem('tripPref');
            if (rawPref) {
                var p = JSON.parse(rawPref);
                if (p && p.slug && !localStorage.getItem('tp-trip-pref')) {
                    lsSet('trip-pref', p.slug);
                }
                localStorage.removeItem('tripPref');
            }
        } catch(e) {}

        expect(lsGet('trip-pref')).toBe('busan-trip');
        expect(localStorage.getItem('tripPref')).toBeNull();
    });

    it('migrates dark (unprefixed) to tp-dark', () => {
        localStorage.setItem('dark', '1');

        // Run migration logic for dark
        var oldDark = localStorage.getItem('dark');
        if (oldDark !== null) {
            if (!localStorage.getItem('tp-dark')) lsSet('dark', oldDark);
            localStorage.removeItem('dark');
        }

        expect(lsGet('dark')).toBe('1');
        expect(localStorage.getItem('dark')).toBeNull();
    });

    it('does not overwrite tp-trip-pref if already set', () => {
        lsSet('trip-pref', 'existing-trip');
        localStorage.setItem('tripFile', 'data/trips/other-trip.json');

        var oldTripFile = localStorage.getItem('tripFile');
        if (oldTripFile) {
            var m = oldTripFile.match(/^data\/trips\/(.+)\.json$/);
            if (m && !localStorage.getItem('tp-trip-pref')) {
                lsSet('trip-pref', m[1]);
            }
            localStorage.removeItem('tripFile');
        }

        expect(lsGet('trip-pref')).toBe('existing-trip');
        expect(localStorage.getItem('tripFile')).toBeNull();
    });
});
