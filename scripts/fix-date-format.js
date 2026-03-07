#!/usr/bin/env node
// fix-date-format.js — Convert all trip dates to ISO YYYY-MM-DD + separate dayOfWeek field
var fs = require('fs');
var path = require('path');

var tripsDir = path.join(__dirname, '..', 'data', 'trips');
var DAY_NAMES = ['日', '一', '二', '三', '四', '五', '六'];

var files = fs.readdirSync(tripsDir).filter(function(f) { return f.endsWith('.json'); });

files.forEach(function(file) {
  var filePath = path.join(tripsDir, file);
  var trip = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  var slug = file.replace('.json', '');
  var changed = false;

  if (!trip.days || !trip.autoScrollDates) {
    console.log(slug + ': skipped (no days or autoScrollDates)');
    return;
  }

  if (trip.days.length !== trip.autoScrollDates.length) {
    console.log(slug + ': WARNING — days.length=' + trip.days.length + ' != autoScrollDates.length=' + trip.autoScrollDates.length);
    return;
  }

  trip.days.forEach(function(day, i) {
    var isoDate = trip.autoScrollDates[i]; // e.g. "2026-07-29"
    var d = new Date(isoDate + 'T00:00:00');
    var dow = DAY_NAMES[d.getDay()];

    var oldDate = day.date;
    var oldDow = day.dayOfWeek;

    // Set ISO date
    if (day.date !== isoDate) {
      day.date = isoDate;
      changed = true;
    }

    // Set dayOfWeek
    if (day.dayOfWeek !== dow) {
      // Insert dayOfWeek right after date by rebuilding the object
      var newDay = {};
      Object.keys(day).forEach(function(k) {
        newDay[k] = day[k];
        if (k === 'date') newDay.dayOfWeek = dow;
      });
      if (!newDay.dayOfWeek) newDay.dayOfWeek = dow;
      // Copy back
      Object.keys(day).forEach(function(k) { delete day[k]; });
      Object.keys(newDay).forEach(function(k) { day[k] = newDay[k]; });
      changed = true;
    }

    if (oldDate !== day.date || oldDow !== day.dayOfWeek) {
      console.log('  day-' + (i + 1) + ': ' + oldDate + ' → ' + day.date + ' (' + dow + ')');
    }
  });

  if (changed) {
    fs.writeFileSync(filePath, JSON.stringify(trip, null, 2) + '\n');
    console.log(slug + ': updated');
  } else {
    console.log(slug + ': already correct');
  }
});
