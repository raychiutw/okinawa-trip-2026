#!/usr/bin/env node
// build-all.js — Split + Build all trips for Cloudflare Pages deployment
var fs = require('fs');
var path = require('path');
var childProcess = require('child_process');

var tripsDir = path.join(__dirname, '..', 'data', 'trips');
var slugs = fs.readdirSync(tripsDir)
  .filter(function(f) { return f.endsWith('.json'); })
  .map(function(f) { return f.replace(/\.json$/, ''); });

if (!slugs.length) {
  console.log('No trip files found in data/trips/');
  process.exit(0);
}

console.log('Building ' + slugs.length + ' trips...');

var failed = [];
slugs.forEach(function(slug) {
  // Step 1: Split JSON → Markdown
  var splitResult = childProcess.spawnSync('node', [path.join(__dirname, 'trip-split.js'), slug], { stdio: 'inherit' });
  if (splitResult.status !== 0) {
    console.error('FAIL split: ' + slug);
    failed.push(slug);
    return;
  }

  // Step 2: Build Markdown → dist JSON
  var buildResult = childProcess.spawnSync('node', [path.join(__dirname, 'trip-build.js'), slug], { stdio: 'inherit' });
  if (buildResult.status !== 0) {
    console.error('FAIL build: ' + slug);
    failed.push(slug);
    return;
  }

  console.log('OK: ' + slug);
});

if (failed.length) {
  console.error('\n' + failed.length + ' trip(s) failed: ' + failed.join(', '));
  process.exit(1);
}

console.log('\nAll ' + slugs.length + ' trips built successfully.');
