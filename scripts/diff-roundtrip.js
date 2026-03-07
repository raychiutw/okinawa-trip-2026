#!/usr/bin/env node
// diff-roundtrip.js — Compare original trip JSON with split+build output
var fs = require('fs');
var path = require('path');

function sortKeys(obj) {
  if (Array.isArray(obj)) return obj.map(sortKeys);
  if (obj && typeof obj === 'object') {
    var sorted = {};
    Object.keys(obj).sort().forEach(function(k) { sorted[k] = sortKeys(obj[k]); });
    return sorted;
  }
  return obj;
}

function findDiffs(p, a, b) {
  if (JSON.stringify(a) === JSON.stringify(b)) return;
  if (a === undefined && b === undefined) return;
  if (typeof a !== typeof b) {
    var aVal = a !== undefined ? JSON.stringify(a).substring(0, 60) : 'undefined';
    var bVal = b !== undefined ? JSON.stringify(b).substring(0, 60) : 'undefined';
    console.log(p + ': TYPE ' + typeof a + '(' + aVal + ') vs ' + typeof b + '(' + bVal + ')');
    return;
  }
  if (Array.isArray(a)) {
    for (var i = 0; i < Math.max(a.length, (b || []).length); i++) {
      findDiffs(p + '[' + i + ']', a[i], (b || [])[i]);
    }
    return;
  }
  if (a && typeof a === 'object') {
    var ks = new Set(Object.keys(a).concat(Object.keys(b || {})));
    ks.forEach(function(k) { findDiffs(p + '.' + k, a[k], (b || {})[k]); });
    return;
  }
  console.log(p + ': ' + JSON.stringify(a) + ' -> ' + JSON.stringify(b));
}

var slugs = fs.readdirSync('data/trips')
  .filter(function(f) { return f.endsWith('.json'); })
  .map(function(f) { return f.replace('.json', ''); });

slugs.forEach(function(slug) {
  var orig = JSON.parse(fs.readFileSync('data/trips/' + slug + '.json', 'utf8'));
  var distDir = 'data/dist/' + slug;
  var hasDiff = false;

  // Meta
  var meta = JSON.parse(fs.readFileSync(path.join(distDir, 'meta.json'), 'utf8'));
  ['meta', 'footer', 'autoScrollDates'].forEach(function(s) {
    if (JSON.stringify(sortKeys(orig[s])) !== JSON.stringify(sortKeys(meta[s]))) {
      console.log('\n[' + slug + '] ' + s + ':');
      findDiffs(s, sortKeys(orig[s]), sortKeys(meta[s]));
      hasDiff = true;
    }
  });

  // Flights
  if (orig.flights) {
    try {
      var fl = JSON.parse(fs.readFileSync(distDir + '/flights.json', 'utf8'));
      if (JSON.stringify(sortKeys(orig.flights)) !== JSON.stringify(sortKeys(fl))) {
        console.log('\n[' + slug + '] flights:');
        findDiffs('flights', sortKeys(orig.flights), sortKeys(fl));
        hasDiff = true;
      }
    } catch (e) { console.log('\n[' + slug + '] flights: ERROR ' + e.message); hasDiff = true; }
  }

  // Checklist, backup, suggestions
  ['checklist', 'backup', 'suggestions'].forEach(function(s) {
    var data = JSON.parse(fs.readFileSync(distDir + '/' + s + '.json', 'utf8'));
    if (JSON.stringify(sortKeys(orig[s])) !== JSON.stringify(sortKeys(data))) {
      console.log('\n[' + slug + '] ' + s + ':');
      findDiffs(s, sortKeys(orig[s]), sortKeys(data));
      hasDiff = true;
    }
  });

  // Emergency
  if (orig.emergency) {
    try {
      var em = JSON.parse(fs.readFileSync(distDir + '/emergency.json', 'utf8'));
      if (JSON.stringify(sortKeys(orig.emergency)) !== JSON.stringify(sortKeys(em))) {
        console.log('\n[' + slug + '] emergency:');
        findDiffs('emergency', sortKeys(orig.emergency), sortKeys(em));
        hasDiff = true;
      }
    } catch (e) { console.log('\n[' + slug + '] emergency: ERROR ' + e.message); hasDiff = true; }
  }

  // Days
  orig.days.forEach(function(day, i) {
    var rb = JSON.parse(fs.readFileSync(path.join(distDir, 'day-' + (i + 1) + '.json'), 'utf8'));
    if (JSON.stringify(sortKeys(day)) !== JSON.stringify(sortKeys(rb))) {
      console.log('\n[' + slug + '] day-' + (i + 1) + ':');
      findDiffs('d' + (i + 1), sortKeys(day), sortKeys(rb));
      hasDiff = true;
    }
  });

  if (!hasDiff) console.log('\nPASS: ' + slug);
});
