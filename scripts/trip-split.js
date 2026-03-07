#!/usr/bin/env node
// trip-split.js — JSON → Markdown splitter（一次性遷移用）
const fs = require('fs');
const path = require('path');

const slug = process.argv[2] || 'okinawa-trip-2026-Ray';
const tripPath = path.join(__dirname, '..', 'data', 'trips', slug + '.json');
const trip = JSON.parse(fs.readFileSync(tripPath, 'utf8'));
const outDir = path.join(__dirname, '..', 'data', 'trips-md', slug);
if (fs.existsSync(outDir)) {
  fs.readdirSync(outDir).forEach(function(f) {
    fs.unlinkSync(path.join(outDir, f));
  });
} else {
  fs.mkdirSync(outDir, { recursive: true });
}

// ─── Helpers ───

function extractQuery(url) {
  if (!url) return '';
  // Format: /maps/search/<encoded>
  var m1 = url.match(/\/maps\/search\/(.+)$/);
  if (m1) return decodeURIComponent(m1[1].replace(/\+/g, ' '));
  // Format: ?q=<encoded>
  var m2 = url.match(/[?&]q=([^&]+)/);
  if (m2) return decodeURIComponent(m2[1].replace(/\+/g, ' '));
  return '';
}

function mapsLine(loc) {
  const query = extractQuery(loc.googleQuery);
  const name = loc.name || query;
  if (name && query && name !== query) return name + ' | ' + query;
  return query || name || '';
}

function escPipe(s) {
  return (s || '').replace(/\|/g, '\\|');
}

function writeMd(filename, content) {
  fs.writeFileSync(path.join(outDir, filename), content.replace(/\n{3,}/g, '\n\n').trimEnd() + '\n');
}

// ─── Location formatting ───

function appleOverride(loc) {
  var gq = extractQuery(loc.googleQuery);
  var aq = extractQuery(loc.appleQuery);
  return (aq && aq !== gq) ? aq : '';
}

function fmtLocations(locations) {
  if (!locations || !locations.length) return [];
  var lines = [];
  locations.forEach(function(loc) {
    lines.push('- maps: ' + mapsLine(loc));
    if (loc.label) lines.push('- label: ' + loc.label);
    if (loc.mapcode) lines.push('- mapcode: ' + loc.mapcode);
    var ao = appleOverride(loc);
    if (ao) lines.push('- apple: ' + ao);
    if (loc.naverQuery) lines.push('- naver: ' + loc.naverQuery);
  });
  return lines;
}

// ─── Travel formatting ───

function fmtTravel(travel) {
  if (!travel) return '';
  return '- travel: ' + travel.type + ' ' + travel.text;
}

// ─── InfoBox formatting ───

function fmtRestaurantTable(box) {
  var lines = ['#### restaurants: ' + (box.title || ''), ''];
  var cols = ['name', 'category', 'hours', 'price', 'reservation', 'description', 'blog', 'rating', 'maps', 'mapcode', 'source'];
  // Check if any restaurant has reservationUrl, url, naver, or appleMaps override
  var hasResUrl = box.restaurants.some(function(r) { return r.reservationUrl; });
  var hasUrl = box.restaurants.some(function(r) { return r.url; });
  var hasNaver = box.restaurants.some(function(r) { return r.location && r.location.naverQuery; });
  var hasAppleOverride = box.restaurants.some(function(r) { return r.location && appleOverride(r.location); });
  if (hasResUrl) cols.push('reservationUrl');
  if (hasUrl) cols.push('url');
  if (hasNaver) cols.push('naver');
  if (hasAppleOverride) cols.push('appleMaps');

  lines.push('| ' + cols.join(' | ') + ' |');
  lines.push('|' + cols.map(function() { return '---'; }).join('|') + '|');

  box.restaurants.forEach(function(r) {
    var mapsQuery = r.location ? mapsLine(r.location) : '';
    var mc = (r.location && r.location.mapcode) ? r.location.mapcode : '';
    var row = [
      escPipe(r.name || ''),
      escPipe(r.category || ''),
      escPipe(r.hours || ''),
      escPipe(r.price || ''),
      escPipe(typeof r.reservation === 'object' ? JSON.stringify(r.reservation) : (r.reservation || '')),
      escPipe(r.description || ''),
      escPipe(r.blogUrl || ''),
      r.googleRating != null ? r.googleRating : '',
      escPipe(mapsQuery),
      escPipe(mc),
      escPipe(r.source || '')
    ];
    if (hasResUrl) row.push(escPipe(r.reservationUrl || ''));
    if (hasUrl) row.push(escPipe(r.url || ''));
    if (hasNaver) row.push(escPipe(r.location && r.location.naverQuery ? r.location.naverQuery : ''));
    if (hasAppleOverride) row.push(escPipe(r.location ? appleOverride(r.location) : ''));
    lines.push('| ' + row.join(' | ') + ' |');
  });
  return lines;
}

function fmtShopTable(box) {
  var lines = ['#### shopping: ' + (box.title || ''), ''];
  // Use ### for hotel-level infoBoxes (will be adjusted by caller)
  var cols = ['name', 'category', 'hours', 'mustBuy', 'blog', 'rating', 'maps', 'mapcode', 'source'];
  var hasAppleOverride = box.shops.some(function(s) { return s.location && appleOverride(s.location); });
  var hasNaver = box.shops.some(function(s) { return s.location && s.location.naverQuery; });
  if (hasAppleOverride) cols.push('appleMaps');
  if (hasNaver) cols.push('naver');
  lines.push('| ' + cols.join(' | ') + ' |');
  lines.push('|' + cols.map(function() { return '---'; }).join('|') + '|');

  box.shops.forEach(function(s) {
    var mapsQuery = s.location ? mapsLine(s.location) : '';
    var mc = (s.location && s.location.mapcode) ? s.location.mapcode : '';
    var row = [
      escPipe(s.name || ''),
      escPipe(s.category || ''),
      escPipe(s.hours || ''),
      escPipe((s.mustBuy || []).join(', ')),
      escPipe(s.blogUrl || ''),
      s.googleRating != null ? s.googleRating : '',
      escPipe(mapsQuery),
      escPipe(mc),
      escPipe(s.source || '')
    ];
    if (hasAppleOverride) row.push(escPipe(s.location ? appleOverride(s.location) : ''));
    if (hasNaver) row.push(escPipe(s.location && s.location.naverQuery ? s.location.naverQuery : ''));
    lines.push('| ' + row.join(' | ') + ' |');
  });
  return lines;
}

function fmtParkingBox(box) {
  var lines = ['#### parking: ' + (box.title || '')];
  if (box.price) lines.push('- price: ' + box.price);
  if (box.note) lines.push('- note: ' + box.note);
  if (box.location) {
    lines.push('- maps: ' + mapsLine(box.location));
    if (box.location.mapcode) lines.push('- mapcode: ' + box.location.mapcode);
  }
  return lines;
}

function fmtReservationBox(box) {
  var lines = ['#### reservation: ' + (box.title || '')];
  if (box.items) {
    box.items.forEach(function(item) { lines.push('- ' + item); });
  }
  return lines;
}

function fmtGasStationBox(box) {
  var lines = ['#### gasStation: ' + (box.title || '')];
  if (box.googleRating != null) lines.push('- rating: ' + box.googleRating);
  if (box.station) {
    var s = box.station;
    if (s.name) lines.push('- name: ' + s.name);
    if (s.address) lines.push('- address: ' + s.address);
    if (s.hours) lines.push('- hours: ' + s.hours);
    if (s.service) lines.push('- service: ' + s.service);
    if (s.phone) lines.push('- phone: ' + s.phone);
    if (s.location) {
      lines.push('- maps: ' + mapsLine(s.location));
      if (s.location.mapcode) lines.push('- mapcode: ' + s.location.mapcode);
    }
    if (s.source) lines.push('- source: ' + s.source);
  }
  return lines;
}

function fmtInfoBox(box, headingLevel) {
  var prefix = headingLevel === 3 ? '###' : '####';
  var lines;
  if (box.type === 'restaurants') {
    lines = fmtRestaurantTable(box);
    lines[0] = prefix + ' restaurants: ' + (box.title || '');
  } else if (box.type === 'shopping') {
    lines = fmtShopTable(box);
    lines[0] = prefix + ' shopping: ' + (box.title || '');
  } else if (box.type === 'parking') {
    lines = fmtParkingBox(box);
    lines[0] = prefix + ' parking: ' + (box.title || '');
  } else if (box.type === 'reservation') {
    lines = fmtReservationBox(box);
    lines[0] = prefix + ' reservation: ' + (box.title || '');
  } else if (box.type === 'gasStation') {
    lines = fmtGasStationBox(box);
    lines[0] = prefix + ' gasStation: ' + (box.title || '');
  } else {
    lines = [prefix + ' ' + box.type + ': ' + (box.title || '')];
  }
  return lines;
}

// ─── Hotel formatting ───

function fmtHotel(hotel) {
  var lines = ['## Hotel: ' + hotel.name];
  if (hotel.url) lines.push('- url: ' + hotel.url);
  if (hotel.checkout) lines.push('- checkout: ' + hotel.checkout);
  if (hotel.blogUrl) lines.push('- blog: ' + hotel.blogUrl);
  if (hotel.googleRating != null) lines.push('- rating: ' + hotel.googleRating);
  if (hotel.source) lines.push('- source: ' + hotel.source);
  if (hotel.details && hotel.details.length) {
    lines.push('- details: ' + hotel.details.join(', '));
  }
  if (hotel.breakfast) {
    if (hotel.breakfast.included === true) {
      var bf = '- breakfast: true';
      if (hotel.breakfast.note) bf += ' ' + hotel.breakfast.note;
      lines.push(bf);
    } else if (hotel.breakfast.included === false) {
      var bf2 = '- breakfast: false';
      if (hotel.breakfast.note) bf2 += ' ' + hotel.breakfast.note;
      lines.push(bf2);
    }
    // null → omit (default)
  }
  // hotel infoBoxes (use ### heading level)
  if (hotel.infoBoxes) {
    hotel.infoBoxes.forEach(function(box) {
      lines.push('');
      lines = lines.concat(fmtInfoBox(box, 3));
    });
  }
  return lines;
}

// ─── Timeline event formatting ───

function fmtEvent(ev) {
  var lines = ['### ' + ev.time + ' ' + ev.title];
  if (ev.description) lines.push(ev.description);
  if (ev.titleUrl) lines.push('- web: ' + ev.titleUrl);
  if (ev.blogUrl != null) lines.push('- blog: ' + ev.blogUrl);
  if (ev.note) lines.push('- note: ' + ev.note);
  if (ev.source) lines.push('- source: ' + ev.source);
  lines = lines.concat(fmtLocations(ev.locations));
  if (ev.googleRating != null) lines.push('- rating: ' + ev.googleRating);
  if (ev.travel) lines.push(fmtTravel(ev.travel));
  // event infoBoxes (use #### heading level)
  if (ev.infoBoxes) {
    ev.infoBoxes.forEach(function(box) {
      lines.push('');
      lines = lines.concat(fmtInfoBox(box, 4));
    });
  }
  return lines;
}

// ─── Day formatting ───

function fmtDay(day, idx) {
  var lines = [
    '---',
    'id: ' + day.id,
    'date: ' + day.date,
    'dayOfWeek: ' + (day.dayOfWeek || ''),
    'label: ' + day.label,
  ].concat(day.weather ? ['weather: ' + JSON.stringify(day.weather)] : []).concat([
    '---',
    ''
  ]);
  // Hotel (optional on last day)
  if (day.content.hotel) {
    lines = lines.concat(fmtHotel(day.content.hotel));
    lines.push('');
  }
  // Timeline
  lines.push('## Timeline');
  day.content.timeline.forEach(function(ev) {
    lines.push('');
    lines = lines.concat(fmtEvent(ev));
  });
  return lines.join('\n');
}

// ─── Meta formatting ───

function fmtMeta() {
  var lines = ['---'];
  lines.push('title: ' + trip.meta.title);
  lines.push('description: ' + trip.meta.description);
  if (trip.meta.ogDescription) lines.push('ogDescription: ' + trip.meta.ogDescription);
  if (trip.meta.foodPreferences) lines.push('foodPreferences: ' + trip.meta.foodPreferences.join(', '));
  if (trip.meta.selfDrive != null) lines.push('selfDrive: ' + trip.meta.selfDrive);
  if (trip.meta.countries) lines.push('countries: ' + trip.meta.countries.join(', '));
  if (trip.autoScrollDates) lines.push('autoScrollDates: ' + trip.autoScrollDates.join(', '));
  lines.push('---');
  // Footer as separate section
  if (trip.footer) {
    lines.push('');
    lines.push('## Footer');
    Object.keys(trip.footer).forEach(function(k) {
      lines.push('- ' + k + ': ' + trip.footer[k]);
    });
  }
  return lines.join('\n');
}

// ─── Flights formatting ───

function fmtFlights() {
  var f = trip.flights;
  var lines = ['# ' + f.title];
  if (f.content.airline) {
    var a = f.content.airline;
    lines.push(a.name + (a.note ? '｜' + a.note : ''));
  }
  lines.push('');
  lines.push('| label | route | time |');
  lines.push('|-------|-------|------|');
  f.content.segments.forEach(function(s) {
    lines.push('| ' + s.label + ' | ' + s.route + ' | ' + s.time + ' |');
  });
  return lines.join('\n');
}

// ─── Checklist formatting ───

function fmtChecklist() {
  var c = trip.checklist;
  var lines = ['# ' + c.title];
  c.content.cards.forEach(function(card) {
    lines.push('');
    var colorTag = card.color === 'var(--sand-light)' ? ' {sand}' : '';
    lines.push('## ' + card.title + colorTag);
    card.items.forEach(function(item) {
      lines.push('- [ ] ' + item);
    });
  });
  return lines.join('\n');
}

// ─── Backup formatting ───

function fmtBackup() {
  var b = trip.backup;
  var lines = ['# ' + b.title];
  b.content.cards.forEach(function(card) {
    lines.push('');
    var colorTag = card.color === 'var(--sand-light)' ? ' {sand}' : '';
    lines.push('## ' + card.title + colorTag);
    (card.weatherItems || card.items || []).forEach(function(item) {
      lines.push('- ' + item);
    });
  });
  return lines.join('\n');
}

// ─── Suggestions formatting ───

function fmtSuggestions() {
  var s = trip.suggestions;
  var lines = ['# ' + s.title];
  s.content.cards.forEach(function(card) {
    lines.push('');
    lines.push('## ' + card.priority);
    card.items.forEach(function(item) {
      lines.push('- ' + item);
    });
  });
  return lines.join('\n');
}

// ─── Emergency formatting ───

function fmtEmergency() {
  var e = trip.emergency;
  var lines = ['# ' + e.title];
  e.content.cards.forEach(function(card) {
    lines.push('');
    var colorTag = card.color === 'var(--sand-light)' ? ' {sand}' : '';
    lines.push('## ' + card.title + colorTag);
    if (card.address) lines.push('- address: ' + card.address);
    if (card.contacts) {
      if (card.contacts.length === 0) {
        lines.push('- contacts: []');
      } else {
        card.contacts.forEach(function(c) {
          var line = '- ' + c.label + ': ' + c.phone;
          if (c.url && c.url !== 'tel:' + c.phone) {
            line += ' | ' + c.url;
          }
          lines.push(line);
        });
      }
    }
    if (card.notes) {
      card.notes.forEach(function(n) {
        lines.push('> ' + n);
      });
    }
  });
  return lines.join('\n');
}

// ─── Main ───

console.log('Splitting ' + slug + ' ...');

// Meta
writeMd('meta.md', fmtMeta());
console.log('  meta.md');

// Flights
if (trip.flights) {
  writeMd('flights.md', fmtFlights());
  console.log('  flights.md');
}

// Days
trip.days.forEach(function(day, i) {
  var filename = 'day-' + (i + 1) + '.md';
  writeMd(filename, fmtDay(day, i));
  console.log('  ' + filename);
});

// Checklist
writeMd('checklist.md', fmtChecklist());
console.log('  checklist.md');

// Backup
writeMd('backup.md', fmtBackup());
console.log('  backup.md');

// Suggestions
writeMd('suggestions.md', fmtSuggestions());
console.log('  suggestions.md');

// Emergency
if (trip.emergency) {
  writeMd('emergency.md', fmtEmergency());
  console.log('  emergency.md');
}

console.log('Done! Output: data/trips-md/' + slug + '/');
