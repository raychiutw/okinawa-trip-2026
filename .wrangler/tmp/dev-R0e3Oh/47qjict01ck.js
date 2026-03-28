var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// .wrangler/tmp/pages-FtGuxx/functionsWorker-0.9882864001966281.mjs
var __defProp2 = Object.defineProperty;
var __name2 = /* @__PURE__ */ __name((target, value) => __defProp2(target, "name", { value, configurable: true }), "__name");
function validateDayBody(body) {
  const missing = [];
  if (!body.date) missing.push("date");
  if (!body.dayOfWeek) missing.push("dayOfWeek");
  if (!body.label) missing.push("label");
  if (missing.length > 0) {
    return { ok: false, status: 400, error: `\u5FC5\u586B\u6B04\u4F4D\u7F3A\u5931: ${missing.join(", ")}` };
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(body.date)) {
    return { ok: false, status: 400, error: "date \u683C\u5F0F\u5FC5\u9808\u70BA YYYY-MM-DD" };
  }
  if (body.label.length > 8) {
    return { ok: false, status: 400, error: "label \u4E0D\u5F97\u8D85\u904E 8 \u5B57" };
  }
  return { ok: true, status: 200 };
}
__name(validateDayBody, "validateDayBody");
__name2(validateDayBody, "validateDayBody");
function validateEntryBody(body) {
  if (!body.title) {
    return { ok: false, status: 400, error: "\u5FC5\u586B\u6B04\u4F4D\u7F3A\u5931: title" };
  }
  return { ok: true, status: 200 };
}
__name(validateEntryBody, "validateEntryBody");
__name2(validateEntryBody, "validateEntryBody");
function detectGarbledText(text) {
  if (!text || typeof text !== "string") return false;
  if (text.includes("\uFFFD")) return true;
  if (/[\u0080-\u00FF]{3,}/.test(text)) return true;
  if (/[\x80-\x9F]/.test(text)) return true;
  return false;
}
__name(detectGarbledText, "detectGarbledText");
__name2(detectGarbledText, "detectGarbledText");
function validateRestaurantBody(body) {
  if (!body.name) {
    return { ok: false, status: 400, error: "\u5FC5\u586B\u6B04\u4F4D\u7F3A\u5931: name" };
  }
  return { ok: true, status: 200 };
}
__name(validateRestaurantBody, "validateRestaurantBody");
__name2(validateRestaurantBody, "validateRestaurantBody");
async function logAudit(db, opts) {
  let finalDiffJson = opts.diffJson ?? null;
  if (finalDiffJson && detectGarbledText(finalDiffJson)) {
    try {
      const parsed = JSON.parse(finalDiffJson);
      parsed._encoding_warning = true;
      finalDiffJson = JSON.stringify(parsed);
    } catch {
    }
  }
  try {
    await db.prepare(
      "INSERT INTO audit_log (trip_id, table_name, record_id, action, changed_by, request_id, diff_json, snapshot) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
    ).bind(
      opts.tripId,
      opts.tableName,
      opts.recordId,
      opts.action,
      opts.changedBy,
      opts.requestId ?? null,
      finalDiffJson,
      opts.snapshot ?? null
    ).run();
  } catch (err) {
    console.error("[audit] logAudit failed (non-fatal):", err);
  }
}
__name(logAudit, "logAudit");
__name2(logAudit, "logAudit");
function computeDiff(oldRow, newFields) {
  const diff = {};
  for (const key of Object.keys(newFields)) {
    const oldVal = oldRow[key];
    const newVal = newFields[key];
    const oldStr = typeof oldVal === "object" && oldVal !== null ? JSON.stringify(oldVal) : oldVal;
    const newStr = typeof newVal === "object" && newVal !== null ? JSON.stringify(newVal) : newVal;
    if (oldStr !== newStr) {
      diff[key] = { old: oldVal, new: newVal };
    }
  }
  return JSON.stringify(diff);
}
__name(computeDiff, "computeDiff");
__name2(computeDiff, "computeDiff");
function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } });
}
__name(json, "json");
__name2(json, "json");
function getAuth(context) {
  return context.data?.auth ?? null;
}
__name(getAuth, "getAuth");
__name2(getAuth, "getAuth");
async function parseJsonBody(request) {
  try {
    return await request.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }
}
__name(parseJsonBody, "parseJsonBody");
__name2(parseJsonBody, "parseJsonBody");
function parseIntParam(s) {
  if (!/^\d+$/.test(s)) return null;
  const n = Number(s);
  return n > 0 ? n : null;
}
__name(parseIntParam, "parseIntParam");
__name2(parseIntParam, "parseIntParam");
function buildUpdateClause(body, allowedFields) {
  const fields = Object.keys(body).filter((k) => allowedFields.includes(k));
  if (fields.length === 0) return null;
  const setClauses = [...fields.map((f) => `${f} = ?`), "updated_at = CURRENT_TIMESTAMP"].join(", ");
  const values = fields.map((f) => body[f]);
  return { fields, setClauses, values };
}
__name(buildUpdateClause, "buildUpdateClause");
__name2(buildUpdateClause, "buildUpdateClause");
var ALLOWED_TABLES = ["trips", "trip_days", "hotels", "trip_entries", "restaurants", "shopping", "trip_docs", "trip_requests", "trip_permissions"];
var TABLE_COLUMNS = {
  trips: ["id", "name", "owner", "title", "description", "og_description", "self_drive", "countries", "published", "food_prefs", "auto_scroll", "footer", "created_at", "updated_at"],
  trip_days: ["id", "trip_id", "day_num", "date", "day_of_week", "label", "updated_at"],
  hotels: ["id", "day_id", "name", "checkout", "source", "details", "breakfast", "note", "parking"],
  trip_entries: ["id", "day_id", "sort_order", "time", "title", "description", "source", "maps", "mapcode", "google_rating", "note", "travel_type", "travel_desc", "travel_min", "location", "updated_at"],
  restaurants: ["id", "entry_id", "sort_order", "name", "category", "hours", "price", "reservation", "reservation_url", "description", "note", "google_rating", "maps", "mapcode", "source"],
  shopping: ["id", "parent_type", "parent_id", "sort_order", "name", "category", "hours", "must_buy", "note", "google_rating", "maps", "mapcode", "source"],
  trip_docs: ["id", "trip_id", "doc_type", "content", "updated_at"],
  trip_requests: ["id", "trip_id", "mode", "message", "submitted_by", "reply", "status", "created_at"],
  trip_permissions: ["id", "email", "trip_id", "role", "created_at"]
};
var onRequestPost = /* @__PURE__ */ __name2(async (context) => {
  const auth = getAuth(context);
  if (!auth) return json({ error: "\u672A\u8A8D\u8B49" }, 401);
  if (!auth.isAdmin) return json({ error: "\u50C5\u7BA1\u7406\u8005\u53EF\u57F7\u884C\u56DE\u6EFE" }, 403);
  const { id, aid } = context.params;
  const db = context.env.DB;
  const changedBy = auth.email;
  const auditRow = await db.prepare("SELECT * FROM audit_log WHERE id = ? AND trip_id = ?").bind(Number(aid), id).first();
  if (!auditRow) return json({ error: "Audit log entry not found" }, 404);
  const { table_name, record_id, action, diff_json, snapshot } = auditRow;
  const safeTable = ALLOWED_TABLES.find((t) => t === table_name);
  if (!safeTable) {
    return json({ error: "Invalid table name" }, 400);
  }
  const allowedCols = TABLE_COLUMNS[safeTable];
  if (action === "delete") {
    if (!snapshot) return json({ error: "No snapshot available for rollback" }, 400);
    let snapshotRow;
    try {
      snapshotRow = JSON.parse(snapshot);
    } catch {
      return json({ error: "Invalid snapshot JSON" }, 400);
    }
    const snapshotKeys = Object.keys(snapshotRow).filter((k) => k !== "updated_at" && k !== "created_at");
    const invalidSnapshotCols = snapshotKeys.filter((k) => !allowedCols.includes(k));
    if (invalidSnapshotCols.length > 0) {
      return json({ error: `Invalid column(s) in snapshot: ${invalidSnapshotCols.join(", ")}` }, 400);
    }
    const cols = snapshotKeys.join(", ");
    const placeholders = snapshotKeys.map(() => "?").join(", ");
    const values = snapshotKeys.map((k) => snapshotRow[k] ?? null);
    if (snapshotRow.id != null) {
      const existing = await db.prepare(`SELECT 1 FROM ${safeTable} WHERE id = ?`).bind(snapshotRow.id).first();
      if (existing) {
        return json({ error: "Cannot rollback: a record with this id already exists" }, 409);
      }
    }
    await db.prepare(`INSERT INTO ${safeTable} (${cols}) VALUES (${placeholders})`).bind(...values).run();
    await logAudit(db, {
      tripId: id,
      tableName: safeTable,
      recordId: record_id,
      action: "insert",
      changedBy,
      diffJson: JSON.stringify({ rollback_of: auditRow.id, original_action: "delete" })
    });
    return json({ ok: true, rolled_back: "delete->re-insert" });
  }
  if (action === "update") {
    if (!diff_json) return json({ error: "No diff_json available for rollback" }, 400);
    if (record_id === null) return json({ error: "No record_id for update rollback" }, 400);
    let diff;
    try {
      diff = JSON.parse(diff_json);
    } catch {
      return json({ error: "Invalid diff_json" }, 400);
    }
    const revertFields = Object.keys(diff);
    if (revertFields.length === 0) return json({ error: "No fields to revert" }, 400);
    const invalidDiffCols = revertFields.filter((f) => !allowedCols.includes(f));
    if (invalidDiffCols.length > 0) {
      return json({ error: `Invalid column(s) in diff: ${invalidDiffCols.join(", ")}` }, 400);
    }
    const setClauses = [...revertFields.map((f) => `${f} = ?`), "updated_at = CURRENT_TIMESTAMP"].join(", ");
    const values = [...revertFields.map((f) => diff[f].old ?? null), record_id];
    const result = await db.prepare(`UPDATE ${safeTable} SET ${setClauses} WHERE id = ?`).bind(...values).run();
    if (result.meta.changes === 0) return json({ error: "Record not found for revert" }, 404);
    const revertedFields = Object.fromEntries(revertFields.map((f) => [f, diff[f].old]));
    await logAudit(db, {
      tripId: id,
      tableName: safeTable,
      recordId: record_id,
      action: "update",
      changedBy,
      diffJson: JSON.stringify({ rollback_of: auditRow.id, reverted: revertedFields })
    });
    return json({ ok: true, rolled_back: "update->revert" });
  }
  if (action === "insert") {
    if (record_id === null) return json({ error: "No record_id for insert rollback" }, 400);
    const oldRow = await db.prepare(`SELECT * FROM ${safeTable} WHERE id = ?`).bind(record_id).first();
    await db.prepare(`DELETE FROM ${safeTable} WHERE id = ?`).bind(record_id).run();
    await logAudit(db, {
      tripId: id,
      tableName: safeTable,
      recordId: record_id,
      action: "delete",
      changedBy,
      snapshot: oldRow ? JSON.stringify(oldRow) : void 0,
      diffJson: JSON.stringify({ rollback_of: auditRow.id, original_action: "insert" })
    });
    return json({ ok: true, rolled_back: "insert->delete" });
  }
  return json({ error: `Unknown action: ${action}` }, 400);
}, "onRequestPost");
async function hasPermission(db, email, tripId, isAdmin) {
  if (isAdmin) return true;
  const row = await db.prepare("SELECT 1 FROM trip_permissions WHERE email = ? AND (trip_id = ? OR trip_id = ?)").bind(email.toLowerCase(), tripId, "*").first();
  return !!row;
}
__name(hasPermission, "hasPermission");
__name2(hasPermission, "hasPermission");
async function verifyEntryBelongsToTrip(db, entryId, tripId) {
  const row = await db.prepare("SELECT 1 FROM trip_entries e JOIN trip_days d ON e.day_id = d.id WHERE e.id = ? AND d.trip_id = ?").bind(entryId, tripId).first();
  return !!row;
}
__name(verifyEntryBelongsToTrip, "verifyEntryBelongsToTrip");
__name2(verifyEntryBelongsToTrip, "verifyEntryBelongsToTrip");
async function verifyRestaurantBelongsToTrip(db, restaurantId, tripId) {
  const row = await db.prepare("SELECT 1 FROM restaurants r JOIN trip_entries e ON r.entry_id = e.id JOIN trip_days d ON e.day_id = d.id WHERE r.id = ? AND d.trip_id = ?").bind(restaurantId, tripId).first();
  return !!row;
}
__name(verifyRestaurantBelongsToTrip, "verifyRestaurantBelongsToTrip");
__name2(verifyRestaurantBelongsToTrip, "verifyRestaurantBelongsToTrip");
async function verifyShoppingBelongsToTrip(db, shoppingId, tripId) {
  const row = await db.prepare(`
      SELECT 1 FROM shopping s
      LEFT JOIN trip_entries e ON s.parent_type = 'entry' AND s.parent_id = e.id
      LEFT JOIN hotels h ON s.parent_type = 'hotel' AND s.parent_id = h.id
      LEFT JOIN trip_days de ON e.day_id = de.id
      LEFT JOIN trip_days dh ON h.day_id = dh.id
      WHERE s.id = ? AND (de.trip_id = ? OR dh.trip_id = ?)
    `).bind(shoppingId, tripId, tripId).first();
  return !!row;
}
__name(verifyShoppingBelongsToTrip, "verifyShoppingBelongsToTrip");
__name2(verifyShoppingBelongsToTrip, "verifyShoppingBelongsToTrip");
async function verifyHotelBelongsToTrip(db, hotelId, tripId) {
  const row = await db.prepare("SELECT 1 FROM hotels h JOIN trip_days d ON h.day_id = d.id WHERE h.id = ? AND d.trip_id = ?").bind(hotelId, tripId).first();
  return !!row;
}
__name(verifyHotelBelongsToTrip, "verifyHotelBelongsToTrip");
__name2(verifyHotelBelongsToTrip, "verifyHotelBelongsToTrip");
var onRequestPost2 = /* @__PURE__ */ __name2(async (context) => {
  const auth = getAuth(context);
  if (!auth) return json({ error: "\u672A\u8A8D\u8B49" }, 401);
  const { id, eid: eidStr } = context.params;
  const eid = parseIntParam(eidStr);
  if (!eid) return json({ error: "Invalid id" }, 400);
  const db = context.env.DB;
  if (!await hasPermission(db, auth.email, id, auth.isAdmin)) {
    return json({ error: "\u6B0A\u9650\u4E0D\u8DB3" }, 403);
  }
  if (!await verifyEntryBelongsToTrip(db, eid, id)) {
    return json({ error: "Not found" }, 404);
  }
  const bodyOrError = await parseJsonBody(context.request);
  if (bodyOrError instanceof Response) return bodyOrError;
  const body = bodyOrError;
  const validation = validateRestaurantBody(body);
  if (!validation.ok) return json({ error: validation.error }, validation.status);
  const maxResult = await db.prepare("SELECT COALESCE(MAX(sort_order), -1) AS max_sort FROM restaurants WHERE entry_id = ?").bind(eid).first();
  const sortOrder = (maxResult?.max_sort ?? -1) + 1;
  const row = await db.prepare(`INSERT INTO restaurants (entry_id, sort_order, name, category, hours, price, reservation, reservation_url, description, note, google_rating, maps, mapcode, source)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING *`).bind(
    eid,
    sortOrder,
    body.name ?? null,
    body.category ?? null,
    body.hours ?? null,
    body.price ?? null,
    body.reservation ?? null,
    body.reservation_url ?? null,
    body.description ?? null,
    body.note ?? null,
    body.google_rating ?? null,
    body.maps ?? null,
    body.mapcode ?? null,
    body.source ?? null
  ).first();
  const changedBy = auth.email;
  const newRow = row;
  await logAudit(db, {
    tripId: id,
    tableName: "restaurants",
    recordId: newRow ? newRow.id : null,
    action: "insert",
    changedBy,
    diffJson: JSON.stringify(body)
  });
  return json(row, 201);
}, "onRequestPost");
var ALLOWED_FIELDS = ["name", "category", "hours", "must_buy", "note", "google_rating", "maps", "mapcode", "source"];
var onRequestPost3 = /* @__PURE__ */ __name2(async (context) => {
  const auth = getAuth(context);
  if (!auth) return json({ error: "\u672A\u8A8D\u8B49" }, 401);
  const { id, eid: eidStr } = context.params;
  const eid = parseIntParam(eidStr);
  if (!eid) return json({ error: "Invalid id" }, 400);
  const db = context.env.DB;
  const changedBy = auth.email;
  if (!await hasPermission(db, auth.email, id, auth.isAdmin)) {
    return json({ error: "\u6B0A\u9650\u4E0D\u8DB3" }, 403);
  }
  if (!await verifyEntryBelongsToTrip(db, eid, id)) {
    return json({ error: "Not found" }, 404);
  }
  const bodyOrError = await parseJsonBody(context.request);
  if (bodyOrError instanceof Response) return bodyOrError;
  const body = bodyOrError;
  const fields = Object.keys(body).filter((k) => ALLOWED_FIELDS.includes(k));
  if (fields.length === 0) return json({ error: "No valid fields to insert" }, 400);
  const cols = ["parent_type", "parent_id", ...fields].join(", ");
  const placeholders = ["?", "?", ...fields.map(() => "?")].join(", ");
  const values = ["entry", eid, ...fields.map((f) => body[f] ?? null)];
  const row = await db.prepare(`INSERT INTO shopping (${cols}) VALUES (${placeholders}) RETURNING *`).bind(...values).first();
  const newRow = row;
  await logAudit(db, {
    tripId: id,
    tableName: "shopping",
    recordId: newRow ? newRow.id : null,
    action: "insert",
    changedBy,
    diffJson: JSON.stringify({ parent_type: "entry", parent_id: eid, ...Object.fromEntries(fields.map((f) => [f, body[f]])) })
  });
  return json(row, 201);
}, "onRequestPost");
var ALLOWED_FIELDS2 = ["name", "category", "hours", "must_buy", "note", "google_rating", "maps", "mapcode", "source"];
var onRequestPost4 = /* @__PURE__ */ __name2(async (context) => {
  const auth = getAuth(context);
  if (!auth) return json({ error: "\u672A\u8A8D\u8B49" }, 401);
  const { id, hid: hidStr } = context.params;
  const hid = parseIntParam(hidStr);
  if (!hid) return json({ error: "Invalid id" }, 400);
  const db = context.env.DB;
  const changedBy = auth.email;
  if (!await hasPermission(db, auth.email, id, auth.isAdmin)) {
    return json({ error: "\u6B0A\u9650\u4E0D\u8DB3" }, 403);
  }
  if (!await verifyHotelBelongsToTrip(db, hid, id)) {
    return json({ error: "Not found" }, 404);
  }
  const bodyOrError = await parseJsonBody(context.request);
  if (bodyOrError instanceof Response) return bodyOrError;
  const body = bodyOrError;
  const fields = Object.keys(body).filter((k) => ALLOWED_FIELDS2.includes(k));
  if (fields.length === 0) return json({ error: "No valid fields to insert" }, 400);
  const cols = ["parent_type", "parent_id", ...fields].join(", ");
  const placeholders = ["?", "?", ...fields.map(() => "?")].join(", ");
  const values = ["hotel", hid, ...fields.map((f) => body[f] ?? null)];
  const row = await db.prepare(`INSERT INTO shopping (${cols}) VALUES (${placeholders}) RETURNING *`).bind(...values).first();
  const newRow = row;
  await logAudit(db, {
    tripId: id,
    tableName: "shopping",
    recordId: newRow ? newRow.id : null,
    action: "insert",
    changedBy,
    diffJson: JSON.stringify({ parent_type: "hotel", parent_id: hid, ...Object.fromEntries(fields.map((f) => [f, body[f]])) })
  });
  return json(row, 201);
}, "onRequestPost");
function parseJsonField(row, field) {
  if (row[field] && typeof row[field] === "string") {
    try {
      row[field] = JSON.parse(row[field]);
    } catch {
    }
  }
  if (field.endsWith("_json") && field in row) {
    const shortName = field.slice(0, -5);
    row[shortName] = row[field];
    delete row[field];
  }
}
__name(parseJsonField, "parseJsonField");
__name2(parseJsonField, "parseJsonField");
var onRequestGet = /* @__PURE__ */ __name2(async (context) => {
  const { id, num } = context.params;
  const db = context.env.DB;
  const day = await db.prepare("SELECT * FROM trip_days WHERE trip_id = ? AND day_num = ?").bind(id, Number(num)).first();
  if (!day) return json({ error: "Not found" }, 404);
  const dayId = day.id;
  const [hotelResult, entriesResult, allRestaurantsResult, allShoppingResult] = await Promise.all([
    db.prepare("SELECT * FROM hotels WHERE day_id = ?").bind(dayId).first(),
    db.prepare("SELECT * FROM trip_entries WHERE day_id = ? ORDER BY sort_order ASC").bind(dayId).all(),
    db.prepare("SELECT * FROM restaurants WHERE entry_id IN (SELECT id FROM trip_entries WHERE day_id = ?)").bind(dayId).all(),
    db.prepare("SELECT * FROM shopping WHERE parent_id IN (SELECT id FROM trip_entries WHERE day_id = ?) AND parent_type = 'entry'").bind(dayId).all()
  ]);
  let hotel = null;
  if (hotelResult) {
    const hotelRow = hotelResult;
    parseJsonField(hotelRow, "parking");
    parseJsonField(hotelRow, "location");
    const hotelId = hotelRow.id;
    const { results: hotelShopping } = await db.prepare("SELECT * FROM shopping WHERE parent_type = 'hotel' AND parent_id = ?").bind(hotelId).all();
    hotel = { ...hotelRow, shopping: hotelShopping };
  }
  const restaurantsByEntry = /* @__PURE__ */ new Map();
  for (const r of allRestaurantsResult.results) {
    const row = r;
    const eid = row.entry_id;
    if (!restaurantsByEntry.has(eid)) restaurantsByEntry.set(eid, []);
    restaurantsByEntry.get(eid).push(r);
  }
  const shoppingByEntry = /* @__PURE__ */ new Map();
  for (const s of allShoppingResult.results) {
    const row = s;
    const eid = row.parent_id;
    if (!shoppingByEntry.has(eid)) shoppingByEntry.set(eid, []);
    shoppingByEntry.get(eid).push(s);
  }
  const timeline = entriesResult.results.map((e) => {
    const entry = e;
    parseJsonField(entry, "location");
    const eid = entry.id;
    const travel = entry.travel_type ? {
      type: entry.travel_type,
      desc: entry.travel_desc,
      min: entry.travel_min
    } : null;
    return {
      ...entry,
      travel,
      restaurants: restaurantsByEntry.get(eid) ?? [],
      shopping: shoppingByEntry.get(eid) ?? []
    };
  });
  return json({
    id: dayId,
    day_num: day.day_num,
    date: day.date,
    day_of_week: day.day_of_week,
    label: day.label,
    weather: day.weather,
    hotel,
    timeline
  });
}, "onRequestGet");
var onRequestPut = /* @__PURE__ */ __name2(async (context) => {
  const auth = getAuth(context);
  if (!auth) return json({ error: "\u672A\u8A8D\u8B49" }, 401);
  const { id, num } = context.params;
  const changedBy = auth.email;
  const db = context.env.DB;
  if (!await hasPermission(db, auth.email, id, auth.isAdmin)) {
    return json({ error: "\u6B0A\u9650\u4E0D\u8DB3" }, 403);
  }
  const day = await db.prepare("SELECT id FROM trip_days WHERE trip_id = ? AND day_num = ?").bind(id, Number(num)).first();
  if (!day) return json({ error: "Not found" }, 404);
  const dayId = day.id;
  const [oldHotel, oldEntries, oldRestaurants, oldEntryShopping] = await Promise.all([
    db.prepare("SELECT * FROM hotels WHERE day_id = ?").bind(dayId).first(),
    db.prepare("SELECT * FROM trip_entries WHERE day_id = ? ORDER BY sort_order ASC").bind(dayId).all(),
    db.prepare(
      "SELECT r.* FROM restaurants r JOIN trip_entries e ON r.entry_id = e.id WHERE e.day_id = ?"
    ).bind(dayId).all(),
    db.prepare(
      "SELECT s.* FROM shopping s JOIN trip_entries e ON s.parent_id = e.id WHERE s.parent_type = 'entry' AND e.day_id = ?"
    ).bind(dayId).all()
  ]);
  const oldHotelShopping = oldHotel ? await db.prepare(
    "SELECT * FROM shopping WHERE parent_type = 'hotel' AND parent_id = ?"
  ).bind(oldHotel.id).all() : { results: [] };
  const snapshot = JSON.stringify({
    dayId,
    hotel: oldHotel,
    entries: oldEntries.results,
    restaurants: oldRestaurants.results,
    entryShopping: oldEntryShopping.results,
    hotelShopping: oldHotelShopping.results
  });
  const bodyOrError = await parseJsonBody(context.request);
  if (bodyOrError instanceof Response) return bodyOrError;
  const body = bodyOrError;
  const validation = validateDayBody(body);
  if (!validation.ok) {
    return json({ error: validation.error }, validation.status);
  }
  const entryTextFields = ["title", "description", "note", "travel_desc"];
  const timelineEntries = Array.isArray(body.timeline) ? body.timeline : [];
  for (let i = 0; i < timelineEntries.length; i++) {
    const e = timelineEntries[i];
    for (const f of entryTextFields) {
      const val = f === "travel_desc" ? e.travel?.desc : e[f];
      if (typeof val === "string" && detectGarbledText(val)) {
        return json({ error: `timeline[${i}].${f} \u5305\u542B\u7591\u4F3C\u4E82\u78BC\uFF0C\u8ACB\u78BA\u8A8D encoding \u70BA UTF-8` }, 400);
      }
    }
  }
  await logAudit(db, {
    tripId: id,
    tableName: "trip_days",
    recordId: dayId,
    action: "update",
    changedBy,
    snapshot,
    diffJson: JSON.stringify({ day_num: Number(num), overwrite: true })
  });
  const batch1 = [];
  batch1.push(
    db.prepare("DELETE FROM shopping WHERE parent_type = 'hotel' AND parent_id IN (SELECT id FROM hotels WHERE day_id = ?)").bind(dayId),
    db.prepare("DELETE FROM hotels WHERE day_id = ?").bind(dayId),
    db.prepare("DELETE FROM restaurants WHERE entry_id IN (SELECT id FROM trip_entries WHERE day_id = ?)").bind(dayId),
    db.prepare("DELETE FROM shopping WHERE parent_type = 'entry' AND parent_id IN (SELECT id FROM trip_entries WHERE day_id = ?)").bind(dayId),
    db.prepare("DELETE FROM trip_entries WHERE day_id = ?").bind(dayId)
  );
  batch1.push(
    db.prepare("UPDATE trip_days SET date = ?, day_of_week = ?, label = ? WHERE id = ?").bind(
      body.date,
      body.dayOfWeek,
      body.label,
      dayId
    )
  );
  const HOTEL_IDX = body.hotel ? batch1.length : -1;
  if (body.hotel) {
    const h = body.hotel;
    batch1.push(
      db.prepare("INSERT INTO hotels (day_id, name, checkout, details, breakfast, note, parking, location) VALUES (?, ?, ?, ?, ?, ?, ?, ?) RETURNING id").bind(
        dayId,
        h.name ?? null,
        h.checkout ?? null,
        h.details ?? h.address ?? null,
        h.breakfast ?? null,
        h.note ?? null,
        h.parking ? JSON.stringify(h.parking) : null,
        h.location ? JSON.stringify(h.location) : null
      )
    );
  }
  const ENTRIES_START_IDX = batch1.length;
  const timeline = Array.isArray(body.timeline) ? body.timeline : [];
  for (let i = 0; i < timeline.length; i++) {
    const e = timeline[i];
    const travel = e.travel;
    batch1.push(
      db.prepare("INSERT INTO trip_entries (day_id, sort_order, time, title, description, maps, google_rating, note, travel_type, travel_desc, travel_min) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING id").bind(
        dayId,
        i,
        e.time ?? null,
        e.title ?? null,
        e.body ?? e.description ?? null,
        e.maps ?? null,
        e.rating ?? e.google_rating ?? null,
        e.note ?? null,
        travel?.type ?? null,
        travel?.desc ?? null,
        travel?.min ?? null
      )
    );
  }
  try {
    const batch1Results = await db.batch(batch1);
    let hotelId = null;
    if (HOTEL_IDX >= 0) {
      const hotelRows = batch1Results[HOTEL_IDX].results;
      hotelId = hotelRows[0]?.id ?? null;
    }
    const entryIds = [];
    for (let i = 0; i < timeline.length; i++) {
      const entryRows = batch1Results[ENTRIES_START_IDX + i].results;
      entryIds.push(entryRows[0]?.id ?? 0);
    }
    const batch2 = [];
    if (body.hotel && hotelId !== null && Array.isArray(body.hotel.shopping)) {
      for (const [idx, s] of body.hotel.shopping.entries()) {
        batch2.push(
          db.prepare("INSERT INTO shopping (parent_type, parent_id, sort_order, name, category, hours, must_buy, note, google_rating, maps, mapcode, source) VALUES ('hotel', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)").bind(hotelId, idx, s.name ?? null, s.category ?? null, s.hours ?? null, s.must_buy ?? null, s.note ?? null, s.rating ?? s.google_rating ?? null, s.maps ?? null, s.mapcode ?? null, s.source ?? null)
        );
      }
    }
    for (let i = 0; i < timeline.length; i++) {
      const e = timeline[i];
      const entryId = entryIds[i];
      if (Array.isArray(e.restaurants)) {
        for (const r of e.restaurants) {
          batch2.push(
            db.prepare("INSERT INTO restaurants (entry_id, name, category, hours, price, reservation, reservation_url, description, note, google_rating, maps, mapcode, source) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)").bind(entryId, r.name ?? null, r.category ?? null, r.hours ?? null, r.price ?? null, r.reservation ?? null, r.reservation_url ?? null, r.description ?? null, r.note ?? null, r.rating ?? r.google_rating ?? null, r.maps ?? null, r.mapcode ?? null, r.source ?? null)
          );
        }
      }
      if (Array.isArray(e.shopping)) {
        for (const [sIdx, s] of e.shopping.entries()) {
          batch2.push(
            db.prepare("INSERT INTO shopping (parent_type, parent_id, sort_order, name, category, hours, must_buy, note, google_rating, maps, mapcode, source) VALUES ('entry', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)").bind(entryId, sIdx, s.name ?? null, s.category ?? null, s.hours ?? null, s.must_buy ?? null, s.note ?? null, s.rating ?? s.google_rating ?? null, s.maps ?? null, s.mapcode ?? null, s.source ?? null)
          );
        }
      }
    }
    if (batch2.length > 0) await db.batch(batch2);
  } catch (err) {
    await logAudit(db, {
      tripId: id,
      tableName: "trip_days",
      recordId: dayId,
      action: "update",
      changedBy,
      diffJson: JSON.stringify({ error: "Partial write failure", message: err instanceof Error ? err.message : String(err) })
    });
    return json({ error: "\u5132\u5B58\u5931\u6557\uFF0C\u8ACB\u7A0D\u5F8C\u518D\u8A66" }, 500);
  }
  return json({ ok: true });
}, "onRequestPut");
var VALID_TYPES = /* @__PURE__ */ new Set(["flights", "checklist", "backup", "suggestions", "emergency"]);
var onRequestGet2 = /* @__PURE__ */ __name2(async (context) => {
  const { id, type } = context.params;
  if (!VALID_TYPES.has(type)) return json({ error: "Invalid doc type" }, 400);
  const row = await context.env.DB.prepare("SELECT doc_type, content, updated_at FROM trip_docs WHERE trip_id = ? AND doc_type = ?").bind(id, type).first();
  if (!row) return json({ error: "Not found" }, 404);
  return json(row);
}, "onRequestGet");
var onRequestPut2 = /* @__PURE__ */ __name2(async (context) => {
  const auth = getAuth(context);
  if (!auth) return json({ error: "\u672A\u8A8D\u8B49" }, 401);
  const { id, type } = context.params;
  if (!VALID_TYPES.has(type)) return json({ error: "Invalid doc type" }, 400);
  if (!await hasPermission(context.env.DB, auth.email, id, auth.isAdmin)) {
    return json({ error: "\u6B0A\u9650\u4E0D\u8DB3" }, 403);
  }
  const bodyOrError = await parseJsonBody(context.request);
  if (bodyOrError instanceof Response) return bodyOrError;
  const body = bodyOrError;
  const content = body.content ?? "";
  const changedBy = auth.email;
  await context.env.DB.prepare("INSERT OR REPLACE INTO trip_docs (trip_id, doc_type, content, updated_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP)").bind(id, type, content).run();
  await logAudit(context.env.DB, {
    tripId: id,
    tableName: "trip_docs",
    recordId: null,
    action: "update",
    changedBy,
    diffJson: JSON.stringify({ doc_type: type })
  });
  return json({ ok: true });
}, "onRequestPut");
var ALLOWED_FIELDS3 = ["sort_order", "time", "title", "description", "source", "maps", "mapcode", "google_rating", "note", "travel_type", "travel_desc", "travel_min", "location"];
var onRequestPatch = /* @__PURE__ */ __name2(async (context) => {
  const auth = getAuth(context);
  if (!auth) return json({ error: "\u672A\u8A8D\u8B49" }, 401);
  const { id, eid: eidStr } = context.params;
  const eid = parseIntParam(eidStr);
  if (!eid) return json({ error: "Invalid id" }, 400);
  const db = context.env.DB;
  const changedBy = auth.email;
  if (!await hasPermission(db, auth.email, id, auth.isAdmin)) {
    return json({ error: "\u6B0A\u9650\u4E0D\u8DB3" }, 403);
  }
  if (!await verifyEntryBelongsToTrip(db, eid, id)) {
    return json({ error: "Not found" }, 404);
  }
  const oldRow = await db.prepare("SELECT * FROM trip_entries WHERE id = ?").bind(eid).first();
  if (!oldRow) return json({ error: "Not found" }, 404);
  const bodyOrError = await parseJsonBody(context.request);
  if (bodyOrError instanceof Response) return bodyOrError;
  const body = bodyOrError;
  if ("title" in body) {
    const validation = validateEntryBody(body);
    if (!validation.ok) return json({ error: validation.error }, validation.status);
  }
  const textFields = ["title", "description", "note", "travel_desc"];
  for (const f of textFields) {
    if (f in body && typeof body[f] === "string" && detectGarbledText(body[f])) {
      return json({ error: `\u6B04\u4F4D ${f} \u5305\u542B\u7591\u4F3C\u4E82\u78BC\uFF0C\u8ACB\u78BA\u8A8D encoding \u70BA UTF-8` }, 400);
    }
  }
  const update = buildUpdateClause(body, ALLOWED_FIELDS3);
  if (!update) return json({ error: "No valid fields to update" }, 400);
  let row;
  try {
    row = await db.prepare(`UPDATE trip_entries SET ${update.setClauses} WHERE id = ? RETURNING *`).bind(...update.values, eid).first();
  } catch (err) {
    return new Response(JSON.stringify({ error: "DB \u66AB\u6642\u7121\u6CD5\u8655\u7406\uFF0C\u8ACB\u7A0D\u5F8C\u91CD\u8A66" }), {
      status: 503,
      headers: { "Content-Type": "application/json", "Retry-After": "2" }
    });
  }
  if (!row) return json({ error: "Not found" }, 404);
  const newFields = Object.fromEntries(update.fields.map((f) => [f, body[f]]));
  await logAudit(db, {
    tripId: id,
    tableName: "trip_entries",
    recordId: eid,
    action: "update",
    changedBy,
    diffJson: computeDiff(oldRow, newFields)
  });
  return json(row);
}, "onRequestPatch");
var onRequestDelete = /* @__PURE__ */ __name2(async (context) => {
  const auth = getAuth(context);
  if (!auth) return json({ error: "\u672A\u8A8D\u8B49" }, 401);
  const { id, eid: eidStr } = context.params;
  const eid = parseIntParam(eidStr);
  if (!eid) return json({ error: "Invalid id" }, 400);
  const db = context.env.DB;
  const changedBy = auth.email;
  if (!await hasPermission(db, auth.email, id, auth.isAdmin)) {
    return json({ error: "\u6B0A\u9650\u4E0D\u8DB3" }, 403);
  }
  if (!await verifyEntryBelongsToTrip(db, eid, id)) {
    return json({ error: "Not found" }, 404);
  }
  const oldRow = await db.prepare("SELECT * FROM trip_entries WHERE id = ?").bind(eid).first();
  if (!oldRow) return json({ error: "Not found" }, 404);
  try {
    await db.batch([
      db.prepare("DELETE FROM restaurants WHERE entry_id = ?").bind(eid),
      db.prepare("DELETE FROM shopping WHERE parent_type = 'entry' AND parent_id = ?").bind(eid),
      db.prepare("DELETE FROM trip_entries WHERE id = ?").bind(eid)
    ]);
  } catch (err) {
    return new Response(JSON.stringify({ error: "DB \u66AB\u6642\u7121\u6CD5\u8655\u7406\uFF0C\u8ACB\u7A0D\u5F8C\u91CD\u8A66" }), {
      status: 503,
      headers: { "Content-Type": "application/json", "Retry-After": "2" }
    });
  }
  await logAudit(db, {
    tripId: id,
    tableName: "trip_entries",
    recordId: eid,
    action: "delete",
    changedBy,
    snapshot: JSON.stringify(oldRow)
  });
  return json({ ok: true });
}, "onRequestDelete");
var ALLOWED_FIELDS4 = ["sort_order", "name", "category", "hours", "price", "reservation", "reservation_url", "description", "note", "google_rating", "maps", "mapcode", "source"];
var onRequestPatch2 = /* @__PURE__ */ __name2(async (context) => {
  const auth = getAuth(context);
  if (!auth) return json({ error: "\u672A\u8A8D\u8B49" }, 401);
  const { id, rid: ridStr } = context.params;
  const rid = parseIntParam(ridStr);
  if (!rid) return json({ error: "Invalid id" }, 400);
  const db = context.env.DB;
  const changedBy = auth.email;
  if (!await hasPermission(db, auth.email, id, auth.isAdmin)) {
    return json({ error: "\u6B0A\u9650\u4E0D\u8DB3" }, 403);
  }
  if (!await verifyRestaurantBelongsToTrip(db, rid, id)) {
    return json({ error: "Not found" }, 404);
  }
  const oldRow = await db.prepare("SELECT * FROM restaurants WHERE id = ?").bind(rid).first();
  if (!oldRow) return json({ error: "Not found" }, 404);
  const bodyOrError = await parseJsonBody(context.request);
  if (bodyOrError instanceof Response) return bodyOrError;
  const body = bodyOrError;
  if ("name" in body) {
    const validation = validateRestaurantBody(body);
    if (!validation.ok) return json({ error: validation.error }, validation.status);
  }
  const update = buildUpdateClause(body, ALLOWED_FIELDS4);
  if (!update) return json({ error: "No valid fields to update" }, 400);
  const row = await db.prepare(`UPDATE restaurants SET ${update.setClauses} WHERE id = ? RETURNING *`).bind(...update.values, rid).first();
  if (!row) return json({ error: "Not found" }, 404);
  const newFields = Object.fromEntries(update.fields.map((f) => [f, body[f]]));
  await logAudit(db, {
    tripId: id,
    tableName: "restaurants",
    recordId: rid,
    action: "update",
    changedBy,
    diffJson: computeDiff(oldRow, newFields)
  });
  return json(row);
}, "onRequestPatch");
var onRequestDelete2 = /* @__PURE__ */ __name2(async (context) => {
  const auth = getAuth(context);
  if (!auth) return json({ error: "\u672A\u8A8D\u8B49" }, 401);
  const { id, rid: ridStr } = context.params;
  const rid = parseIntParam(ridStr);
  if (!rid) return json({ error: "Invalid id" }, 400);
  const db = context.env.DB;
  if (!await hasPermission(db, auth.email, id, auth.isAdmin)) {
    return json({ error: "\u6B0A\u9650\u4E0D\u8DB3" }, 403);
  }
  if (!await verifyRestaurantBelongsToTrip(db, rid, id)) {
    return json({ error: "Not found" }, 404);
  }
  const changedBy = auth.email;
  const oldRow = await db.prepare("SELECT * FROM restaurants WHERE id = ?").bind(rid).first();
  await db.prepare("DELETE FROM restaurants WHERE id = ?").bind(rid).run();
  await logAudit(db, {
    tripId: id,
    tableName: "restaurants",
    recordId: rid,
    action: "delete",
    changedBy,
    snapshot: oldRow ? JSON.stringify(oldRow) : void 0
  });
  return json({ ok: true });
}, "onRequestDelete");
var ALLOWED_FIELDS5 = ["sort_order", "name", "category", "hours", "must_buy", "note", "google_rating", "maps", "mapcode", "source"];
var onRequestPatch3 = /* @__PURE__ */ __name2(async (context) => {
  const auth = getAuth(context);
  if (!auth) return json({ error: "\u672A\u8A8D\u8B49" }, 401);
  const { id, sid: sidStr } = context.params;
  const sid = parseIntParam(sidStr);
  if (!sid) return json({ error: "Invalid id" }, 400);
  const db = context.env.DB;
  const changedBy = auth.email;
  if (!await hasPermission(db, auth.email, id, auth.isAdmin)) {
    return json({ error: "\u6B0A\u9650\u4E0D\u8DB3" }, 403);
  }
  if (!await verifyShoppingBelongsToTrip(db, sid, id)) {
    return json({ error: "Not found" }, 404);
  }
  const oldRow = await db.prepare("SELECT * FROM shopping WHERE id = ?").bind(sid).first();
  if (!oldRow) return json({ error: "Not found" }, 404);
  const bodyOrError = await parseJsonBody(context.request);
  if (bodyOrError instanceof Response) return bodyOrError;
  const body = bodyOrError;
  const update = buildUpdateClause(body, ALLOWED_FIELDS5);
  if (!update) return json({ error: "No valid fields to update" }, 400);
  const row = await db.prepare(`UPDATE shopping SET ${update.setClauses} WHERE id = ? RETURNING *`).bind(...update.values, sid).first();
  if (!row) return json({ error: "Not found" }, 404);
  const newFields = Object.fromEntries(update.fields.map((f) => [f, body[f]]));
  await logAudit(db, {
    tripId: id,
    tableName: "shopping",
    recordId: sid,
    action: "update",
    changedBy,
    diffJson: computeDiff(oldRow, newFields)
  });
  return json(row);
}, "onRequestPatch");
var onRequestDelete3 = /* @__PURE__ */ __name2(async (context) => {
  const auth = getAuth(context);
  if (!auth) return json({ error: "\u672A\u8A8D\u8B49" }, 401);
  const { id, sid: sidStr } = context.params;
  const sid = parseIntParam(sidStr);
  if (!sid) return json({ error: "Invalid id" }, 400);
  const db = context.env.DB;
  const changedBy = auth.email;
  if (!await hasPermission(db, auth.email, id, auth.isAdmin)) {
    return json({ error: "\u6B0A\u9650\u4E0D\u8DB3" }, 403);
  }
  if (!await verifyShoppingBelongsToTrip(db, sid, id)) {
    return json({ error: "Not found" }, 404);
  }
  const oldRow = await db.prepare("SELECT * FROM shopping WHERE id = ?").bind(sid).first();
  await db.prepare("DELETE FROM shopping WHERE id = ?").bind(sid).run();
  await logAudit(db, {
    tripId: id,
    tableName: "shopping",
    recordId: sid,
    action: "delete",
    changedBy,
    snapshot: oldRow ? JSON.stringify(oldRow) : void 0
  });
  return json({ ok: true });
}, "onRequestDelete");
var onRequestGet3 = /* @__PURE__ */ __name2(async (context) => {
  const auth = getAuth(context);
  if (!auth) return json({ error: "\u672A\u8A8D\u8B49" }, 401);
  if (!auth.isAdmin) return json({ error: "\u50C5\u7BA1\u7406\u8005\u53EF\u5B58\u53D6" }, 403);
  const { id } = context.params;
  const db = context.env.DB;
  const url = new URL(context.request.url);
  const limit = Math.max(1, Math.min(Number(url.searchParams.get("limit") || "20"), 100));
  const requestId = url.searchParams.get("request_id");
  let sql = "SELECT * FROM audit_log WHERE trip_id = ?";
  const params = [id];
  if (requestId) {
    sql += " AND request_id = ?";
    params.push(Number(requestId));
  }
  sql += " ORDER BY created_at DESC LIMIT ?";
  params.push(limit);
  const { results } = await db.prepare(sql).bind(...params).all();
  return json(results);
}, "onRequestGet");
var onRequestGet4 = /* @__PURE__ */ __name2(async (context) => {
  const { id } = context.params;
  const { results } = await context.env.DB.prepare("SELECT id, day_num, date, day_of_week, label FROM trip_days WHERE trip_id = ? ORDER BY day_num ASC").bind(id).all();
  return json(results);
}, "onRequestGet");
async function getAccessPolicyEmails(env) {
  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${env.CF_ACCOUNT_ID}/access/apps/${env.CF_ACCESS_APP_ID}/policies/${env.CF_ACCESS_POLICY_ID}`,
    { headers: { Authorization: `Bearer ${env.CF_API_TOKEN}`, "Content-Type": "application/json" } }
  );
  if (!res.ok) throw new Error(`Access API GET failed: ${res.status}`);
  const data = await res.json();
  return data.result.include.filter((rule) => rule.email).map((rule) => rule.email.email.toLowerCase());
}
__name(getAccessPolicyEmails, "getAccessPolicyEmails");
__name2(getAccessPolicyEmails, "getAccessPolicyEmails");
async function updateAccessPolicyEmails(env, emails) {
  const include = emails.map((email) => ({ email: { email } }));
  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${env.CF_ACCOUNT_ID}/access/apps/${env.CF_ACCESS_APP_ID}/policies/${env.CF_ACCESS_POLICY_ID}`,
    {
      method: "PUT",
      headers: { Authorization: `Bearer ${env.CF_API_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify({ name: "\u5141\u8A31\u7684\u65C5\u4F34", decision: "allow", include })
    }
  );
  if (!res.ok) throw new Error(`Access API PUT failed: ${res.status}`);
}
__name(updateAccessPolicyEmails, "updateAccessPolicyEmails");
__name2(updateAccessPolicyEmails, "updateAccessPolicyEmails");
async function addEmailToAccessPolicy(env, email) {
  const emails = await getAccessPolicyEmails(env);
  const lower = email.toLowerCase();
  if (emails.includes(lower)) return;
  emails.push(lower);
  await updateAccessPolicyEmails(env, emails);
}
__name(addEmailToAccessPolicy, "addEmailToAccessPolicy");
__name2(addEmailToAccessPolicy, "addEmailToAccessPolicy");
async function removeEmailFromAccessPolicy(env, email) {
  const emails = await getAccessPolicyEmails(env);
  const lower = email.toLowerCase();
  const filtered = emails.filter((e) => e !== lower);
  if (filtered.length === emails.length) return;
  await updateAccessPolicyEmails(env, filtered);
}
__name(removeEmailFromAccessPolicy, "removeEmailFromAccessPolicy");
__name2(removeEmailFromAccessPolicy, "removeEmailFromAccessPolicy");
var onRequestGet5 = /* @__PURE__ */ __name2(async (context) => {
  const auth = getAuth(context);
  if (!auth.isAdmin) return json({ error: "\u50C5\u7BA1\u7406\u8005\u53EF\u64CD\u4F5C" }, 403);
  const url = new URL(context.request.url);
  const tripId = url.searchParams.get("tripId");
  if (!tripId) {
    return json({ error: "\u7F3A\u5C11 tripId \u53C3\u6578" }, 400);
  }
  const { results } = await context.env.DB.prepare("SELECT * FROM trip_permissions WHERE trip_id = ? ORDER BY email").bind(tripId).all();
  return json(results);
}, "onRequestGet");
var onRequestPost5 = /* @__PURE__ */ __name2(async (context) => {
  const auth = getAuth(context);
  if (!auth.isAdmin) return json({ error: "\u50C5\u7BA1\u7406\u8005\u53EF\u64CD\u4F5C" }, 403);
  const bodyOrError = await parseJsonBody(context.request);
  if (bodyOrError instanceof Response) return bodyOrError;
  const body = bodyOrError;
  const { email, tripId, role = "member" } = body;
  if (!email || !tripId) {
    return json({ error: "\u7F3A\u5C11\u5FC5\u8981\u6B04\u4F4D\uFF1Aemail, tripId" }, 400);
  }
  const lowerEmail = email.toLowerCase();
  const existing = await context.env.DB.prepare("SELECT 1 FROM trip_permissions WHERE email = ? AND trip_id = ?").bind(lowerEmail, tripId).first();
  if (existing) {
    return json({ error: "\u6B64 email \u5DF2\u6709\u6B64\u884C\u7A0B\u7684\u6B0A\u9650" }, 409);
  }
  const result = await context.env.DB.prepare("INSERT INTO trip_permissions (email, trip_id, role) VALUES (?, ?, ?) RETURNING *").bind(lowerEmail, tripId, role).first();
  try {
    await addEmailToAccessPolicy(context.env, lowerEmail);
  } catch (err) {
    await context.env.DB.prepare("DELETE FROM trip_permissions WHERE email = ? AND trip_id = ?").bind(lowerEmail, tripId).run();
    return json({ error: "\u540C\u6B65 Access policy \u5931\u6557\uFF0C\u5DF2\u56DE\u6EFE", detail: String(err) }, 500);
  }
  await logAudit(context.env.DB, {
    tripId,
    tableName: "trip_permissions",
    recordId: result?.id ?? null,
    action: "insert",
    changedBy: auth.email,
    diffJson: JSON.stringify({ email: lowerEmail, role })
  });
  return json(result, 201);
}, "onRequestPost");
var onRequestDelete4 = /* @__PURE__ */ __name2(async (context) => {
  const auth = getAuth(context);
  if (!auth.isAdmin) return json({ error: "\u50C5\u7BA1\u7406\u8005\u53EF\u64CD\u4F5C" }, 403);
  const id = context.params.id;
  const record = await context.env.DB.prepare("SELECT * FROM trip_permissions WHERE id = ?").bind(id).first();
  if (!record) {
    return json({ error: "\u627E\u4E0D\u5230\u8A72\u6B0A\u9650\u8A18\u9304" }, 404);
  }
  await context.env.DB.prepare("DELETE FROM trip_permissions WHERE id = ?").bind(id).run();
  const remaining = await context.env.DB.prepare("SELECT 1 FROM trip_permissions WHERE email = ? AND trip_id != ?").bind(record.email, "*").first();
  if (!remaining) {
    try {
      await removeEmailFromAccessPolicy(context.env, record.email);
    } catch (err) {
      await context.env.DB.prepare("INSERT INTO trip_permissions (id, email, trip_id, role) VALUES (?, ?, ?, ?)").bind(record.id, record.email, record.trip_id, record.role).run();
      return json({ error: "\u540C\u6B65 Access policy \u5931\u6557\uFF0C\u5DF2\u56DE\u6EFE", detail: String(err) }, 500);
    }
  }
  await logAudit(context.env.DB, {
    tripId: record.trip_id,
    tableName: "trip_permissions",
    recordId: record.id,
    action: "delete",
    changedBy: auth.email,
    snapshot: JSON.stringify(record),
    diffJson: JSON.stringify({ email: record.email, role: record.role })
  });
  return json({ ok: true });
}, "onRequestDelete");
var onRequestPatch4 = /* @__PURE__ */ __name2(async (context) => {
  const { env, params } = context;
  const auth = getAuth(context);
  if (!auth) return json({ error: "\u672A\u8A8D\u8B49" }, 401);
  const id = params.id;
  if (!auth.isAdmin) {
    return json({ error: "\u50C5\u7BA1\u7406\u8005\u53EF\u66F4\u65B0\u8ACB\u6C42" }, 403);
  }
  const bodyOrError = await parseJsonBody(context.request);
  if (bodyOrError instanceof Response) return bodyOrError;
  const body = bodyOrError;
  const updates = [];
  const values = [];
  if (body.reply !== void 0) {
    updates.push("reply = ?");
    values.push(body.reply);
  }
  if (body.status !== void 0) {
    const validStatuses = ["open", "received", "processing", "completed"];
    if (!validStatuses.includes(body.status)) {
      return json({ error: "status \u5FC5\u9808\u662F open\u3001received\u3001processing \u6216 completed" }, 400);
    }
    updates.push("status = ?");
    values.push(body.status);
  }
  if (updates.length === 0) {
    return json({ error: "\u6C92\u6709\u8981\u66F4\u65B0\u7684\u6B04\u4F4D" }, 400);
  }
  const oldRow = await env.DB.prepare("SELECT * FROM trip_requests WHERE id = ?").bind(id).first();
  values.push(id);
  const result = await env.DB.prepare(`UPDATE trip_requests SET ${updates.join(", ")} WHERE id = ? RETURNING *`).bind(...values).first();
  if (!result) {
    return json({ error: "\u627E\u4E0D\u5230\u8A72\u8ACB\u6C42" }, 404);
  }
  const tripId = result.trip_id;
  const newFields = Object.fromEntries(
    Object.entries(body).filter(([, v]) => v !== void 0)
  );
  await logAudit(env.DB, {
    tripId,
    tableName: "trip_requests",
    recordId: Number(id),
    action: "update",
    changedBy: auth.email,
    diffJson: oldRow ? computeDiff(oldRow, newFields) : JSON.stringify(newFields)
  });
  return json(result);
}, "onRequestPatch");
var ALLOWED_FIELDS6 = ["name", "owner", "title", "description", "og_description", "self_drive", "countries", "published", "food_prefs", "auto_scroll", "footer"];
var onRequestGet6 = /* @__PURE__ */ __name2(async (context) => {
  const { id } = context.params;
  const row = await context.env.DB.prepare("SELECT * FROM trips WHERE id = ?").bind(id).first();
  if (!row) return json({ error: "Not found" }, 404);
  row.tripId = row.id;
  if (row.footer && typeof row.footer === "string") {
    try {
      row.footer = JSON.parse(row.footer);
    } catch {
    }
  }
  return json(row);
}, "onRequestGet");
var onRequestPut3 = /* @__PURE__ */ __name2(async (context) => {
  const auth = getAuth(context);
  if (!auth) return json({ error: "\u672A\u8A8D\u8B49" }, 401);
  const { id } = context.params;
  if (!await hasPermission(context.env.DB, auth.email, id, auth.isAdmin)) {
    return json({ error: "\u6B0A\u9650\u4E0D\u8DB3" }, 403);
  }
  const existing = await context.env.DB.prepare("SELECT * FROM trips WHERE id = ?").bind(id).first();
  if (!existing) return json({ error: "Not found" }, 404);
  const bodyOrError = await parseJsonBody(context.request);
  if (bodyOrError instanceof Response) return bodyOrError;
  const body = bodyOrError;
  const update = buildUpdateClause(body, ALLOWED_FIELDS6);
  if (!update) return json({ error: "No valid fields to update" }, 400);
  const changedBy = auth.email;
  const newFields = Object.fromEntries(update.fields.map((f) => [f, body[f]]));
  await context.env.DB.prepare(`UPDATE trips SET ${update.setClauses} WHERE id = ?`).bind(...update.values, id).run();
  await logAudit(context.env.DB, {
    tripId: id,
    tableName: "trips",
    recordId: null,
    action: "update",
    changedBy,
    diffJson: computeDiff(existing, newFields)
  });
  return json({ ok: true });
}, "onRequestPut");
var onRequestGet7 = /* @__PURE__ */ __name2(async (context) => {
  const { env } = context;
  const auth = getAuth(context);
  let results;
  if (auth.isAdmin) {
    const { results: rows } = await env.DB.prepare("SELECT DISTINCT trip_id AS tripId FROM trip_permissions WHERE trip_id != ? ORDER BY trip_id").bind("*").all();
    results = rows;
  } else {
    const { results: rows } = await env.DB.prepare("SELECT trip_id AS tripId FROM trip_permissions WHERE email = ? AND trip_id != ? ORDER BY trip_id").bind(auth.email.toLowerCase(), "*").all();
    results = rows;
  }
  return json(results);
}, "onRequestGet");
var onRequestGet8 = /* @__PURE__ */ __name2(async (context) => {
  const { env, request } = context;
  const auth = getAuth(context);
  if (!auth) return json({ error: "\u672A\u8A8D\u8B49" }, 401);
  const url = new URL(request.url);
  const tripId = url.searchParams.get("tripId");
  const status = url.searchParams.get("status");
  const limitParam = url.searchParams.get("limit");
  const before = url.searchParams.get("before");
  const beforeId = url.searchParams.get("beforeId");
  if (!tripId && !auth.isAdmin) {
    return json({ error: "\u7F3A\u5C11 tripId \u53C3\u6578" }, 400);
  }
  if (tripId && !await hasPermission(env.DB, auth.email, tripId, auth.isAdmin)) {
    return json({ error: "\u7121\u6B64\u884C\u7A0B\u6B0A\u9650" }, 403);
  }
  const isPaginated = limitParam !== null || before !== null;
  const limit = Math.min(Math.max(parseInt(limitParam || "10", 10) || 10, 1), 50);
  let sql = "SELECT * FROM trip_requests";
  const params = [];
  const conditions = [];
  if (tripId) {
    conditions.push("trip_id = ?");
    params.push(tripId);
  }
  if (status) {
    conditions.push("status = ?");
    params.push(status);
  }
  if (before) {
    if (beforeId) {
      conditions.push("(created_at < ? OR (created_at = ? AND id < ?))");
      params.push(before, before, parseInt(beforeId, 10) || 0);
    } else {
      conditions.push("created_at < ?");
      params.push(before);
    }
  }
  if (conditions.length > 0) {
    sql += " WHERE " + conditions.join(" AND ");
  }
  sql += " ORDER BY created_at DESC, id DESC";
  sql += isPaginated ? ` LIMIT ${limit + 1}` : " LIMIT 50";
  const { results } = await env.DB.prepare(sql).bind(...params).all();
  if (isPaginated) {
    const hasMore = (results ?? []).length > limit;
    const items = hasMore ? (results ?? []).slice(0, limit) : results ?? [];
    return json({ items, hasMore });
  }
  return json(results);
}, "onRequestGet");
var onRequestPost6 = /* @__PURE__ */ __name2(async (context) => {
  const { env, request } = context;
  const auth = getAuth(context);
  if (!auth) return json({ error: "\u672A\u8A8D\u8B49" }, 401);
  const bodyOrError = await parseJsonBody(request);
  if (bodyOrError instanceof Response) return bodyOrError;
  const body = bodyOrError;
  const { tripId, mode } = body;
  const message = body.message || [body.title, body.body].filter(Boolean).join("\n") || "";
  if (!tripId || !mode || !message) {
    return json({ error: "\u7F3A\u5C11\u5FC5\u8981\u6B04\u4F4D\uFF1AtripId, mode, message" }, 400);
  }
  if (mode !== "trip-edit" && mode !== "trip-plan") {
    return json({ error: "mode \u5FC5\u9808\u662F trip-edit \u6216 trip-plan" }, 400);
  }
  if (!await hasPermission(env.DB, auth.email, tripId, auth.isAdmin)) {
    return json({ error: "\u7121\u6B64\u884C\u7A0B\u6B0A\u9650" }, 403);
  }
  const existing = await env.DB.prepare(
    "SELECT * FROM trip_requests WHERE trip_id = ? AND message = ? AND submitted_by = ? AND created_at > datetime('now', '-30 seconds') ORDER BY created_at DESC LIMIT 1"
  ).bind(tripId, message, auth.email).first();
  if (existing) {
    return json(existing, 200);
  }
  const result = await env.DB.prepare(
    "INSERT INTO trip_requests (trip_id, mode, message, submitted_by) VALUES (?, ?, ?, ?) RETURNING *"
  ).bind(tripId, mode, message, auth.email).first();
  const newRow = result;
  try {
    await logAudit(env.DB, {
      tripId,
      tableName: "trip_requests",
      recordId: newRow ? newRow.id : null,
      action: "insert",
      changedBy: auth.email,
      diffJson: JSON.stringify({ mode, message: message.substring(0, 100) })
    });
  } catch (auditErr) {
    console.error("[requests] logAudit failed (non-fatal):", auditErr);
  }
  return json(result, 201);
}, "onRequestPost");
var onRequestGet9 = /* @__PURE__ */ __name2(async (context) => {
  const url = new URL(context.request.url);
  const showAll = url.searchParams.get("all") === "1";
  const auth = getAuth(context);
  let sql;
  if (showAll && auth?.isAdmin) {
    sql = "SELECT id AS tripId, name, owner, title, self_drive, countries, published, auto_scroll, footer, is_default FROM trips ORDER BY name ASC";
  } else {
    sql = "SELECT id AS tripId, name, owner, title, self_drive, countries, published, auto_scroll, footer, is_default FROM trips WHERE published = 1 ORDER BY name ASC";
  }
  const { results } = await context.env.DB.prepare(sql).all();
  return json(results);
}, "onRequestGet");
var NOT_FOUND_HTML = `<!DOCTYPE html>
<html lang="zh-TW">
<head><meta charset="UTF-8"><title>\u627E\u4E0D\u5230\u884C\u7A0B \u2014 Tripline</title></head>
<body><h1>404 \u627E\u4E0D\u5230\u884C\u7A0B</h1><p>\u8ACB\u78BA\u8A8D\u884C\u7A0B\u7DB2\u5740\u662F\u5426\u6B63\u78BA\u3002</p></body>
</html>`;
var onRequestGet10 = /* @__PURE__ */ __name2(async (context) => {
  const url = new URL(context.request.url);
  const pathParts = url.pathname.replace(/^\/trip\//, "").split("/");
  const tripId = pathParts[0];
  if (!tripId) {
    return new Response(NOT_FOUND_HTML, {
      status: 404,
      headers: { "Content-Type": "text/html; charset=UTF-8" }
    });
  }
  const trip = await context.env.DB.prepare("SELECT id, name, title, countries FROM trips WHERE id = ?").bind(tripId).first();
  if (!trip) {
    return new Response(NOT_FOUND_HTML, {
      status: 404,
      headers: { "Content-Type": "text/html; charset=UTF-8" }
    });
  }
  const ogTitle = `${trip.title} \u2014 Tripline`;
  const ogDescription = trip.countries ? `${trip.countries} \u884C\u7A0B` : "\u884C\u7A0B\u898F\u5283";
  const assetResponse = await context.env.ASSETS.fetch(
    new Request("https://placeholder/index.html")
  );
  return new HTMLRewriter().on("title", {
    element(el) {
      el.setInnerContent(ogTitle);
    }
  }).on('meta[property="og:title"]', {
    element(el) {
      el.setAttribute("content", ogTitle);
    }
  }).on('meta[property="og:description"]', {
    element(el) {
      el.setAttribute("content", ogDescription);
    }
  }).on('meta[property="og:site_name"]', {
    element(el) {
      el.setAttribute("content", "Tripline");
    }
  }).transform(assetResponse);
}, "onRequestGet");
function getCookie(request, name) {
  const cookieHeader = request.headers.get("Cookie");
  if (!cookieHeader) return null;
  const cookies = cookieHeader.split(";").map((c) => c.trim());
  for (const cookie of cookies) {
    const [key, ...valueParts] = cookie.split("=");
    if (key.trim() === name) return valueParts.join("=");
  }
  return null;
}
__name(getCookie, "getCookie");
__name2(getCookie, "getCookie");
function decodeJwtPayload(token) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const decoded = atob(payload);
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}
__name(decodeJwtPayload, "decodeJwtPayload");
__name2(decodeJwtPayload, "decodeJwtPayload");
var onRequest = /* @__PURE__ */ __name2(async (context) => {
  const start = Date.now();
  const { request, env } = context;
  const url = new URL(request.url);
  try {
    const response = await handleAuth(context);
    const duration = Date.now() - start;
    if (response.status >= 400) {
      context.waitUntil(
        env.DB.prepare(
          "INSERT INTO api_logs (method, path, status, duration) VALUES (?, ?, ?, ?)"
        ).bind(request.method, url.pathname, response.status, duration).run()
      );
    }
    return response;
  } catch (err) {
    console.error("[API ERROR]", url.pathname, err instanceof Error ? err.message : String(err), err instanceof Error ? err.stack : "");
    const duration = Date.now() - start;
    context.waitUntil(
      env.DB.prepare(
        "INSERT INTO api_logs (method, path, status, error, duration) VALUES (?, ?, ?, ?, ?)"
      ).bind(
        request.method,
        url.pathname,
        500,
        err instanceof Error ? err.message : String(err),
        duration
      ).run()
    );
    return new Response(JSON.stringify({ error: "Internal Server Error", debug: err instanceof Error ? err.message : String(err) }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}, "onRequest");
var PRODUCTION_ORIGIN = "https://trip-planner-dby.pages.dev";
function isAllowedOrigin(origin, env) {
  if (/^https?:\/\/localhost(:\d+)?$/.test(origin)) return true;
  if (origin === PRODUCTION_ORIGIN) return true;
  if (/^https:\/\/[a-f0-9]+\.trip-planner-dby\.pages\.dev$/.test(origin)) return true;
  if (env.ALLOWED_ORIGIN) {
    const allowed = env.ALLOWED_ORIGIN.split(",").map((s) => s.trim());
    if (allowed.includes(origin)) return true;
  }
  return false;
}
__name(isAllowedOrigin, "isAllowedOrigin");
__name2(isAllowedOrigin, "isAllowedOrigin");
function checkCsrf(request, env) {
  const method = request.method.toUpperCase();
  const mutating = ["POST", "PUT", "PATCH", "DELETE"].includes(method);
  if (!mutating) return null;
  const origin = request.headers.get("Origin");
  if (!origin) {
    const hasServiceToken = !!request.headers.get("CF-Access-Client-Id") && !!request.headers.get("CF-Access-Client-Secret");
    if (hasServiceToken) return null;
    return new Response(JSON.stringify({ error: "Origin header required" }), {
      status: 403,
      headers: { "Content-Type": "application/json" }
    });
  }
  if (!isAllowedOrigin(origin, env)) {
    return new Response(JSON.stringify({ error: "Forbidden: invalid origin" }), {
      status: 403,
      headers: { "Content-Type": "application/json" }
    });
  }
  return null;
}
__name(checkCsrf, "checkCsrf");
__name2(checkCsrf, "checkCsrf");
async function handleAuth(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const csrfError = checkCsrf(request, env);
  if (csrfError) return csrfError;
  const method = request.method.toUpperCase();
  if (["POST", "PUT", "PATCH"].includes(method)) {
    const cloned = request.clone();
    try {
      const decoder = new TextDecoder("utf-8", { fatal: true });
      decoder.decode(new Uint8Array(await cloned.arrayBuffer()));
    } catch {
      return new Response(JSON.stringify({ error: "Request body is not valid UTF-8" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const cloned2 = request.clone();
    try {
      const bodyText = await cloned2.text();
      if (detectGarbledText(bodyText)) {
        return json({ error: "Request body \u5305\u542B\u7591\u4F3C\u4E82\u78BC\uFF0C\u8ACB\u78BA\u8A8D encoding \u70BA UTF-8" }, 400);
      }
    } catch {
    }
  }
  if (request.method === "GET" && url.pathname.startsWith("/api/trips")) {
    const stClientId = request.headers.get("CF-Access-Client-Id");
    const stClientSecret = request.headers.get("CF-Access-Client-Secret");
    if (stClientId && stClientSecret) {
      context.data.auth = {
        email: env.ADMIN_EMAIL,
        isAdmin: true,
        isServiceToken: true
      };
      return context.next();
    }
    const token2 = getCookie(request, "CF_Authorization");
    if (token2) {
      const payload2 = decodeJwtPayload(token2);
      if (payload2?.email) {
        const email2 = String(payload2.email).toLowerCase();
        context.data.auth = {
          email: email2,
          isAdmin: env.ADMIN_EMAIL ? email2 === env.ADMIN_EMAIL.toLowerCase() : false,
          isServiceToken: false
        };
      } else if (payload2?.common_name) {
        context.data.auth = {
          email: env.ADMIN_EMAIL,
          isAdmin: true,
          isServiceToken: true
        };
      }
    }
    return context.next();
  }
  const clientId = request.headers.get("CF-Access-Client-Id");
  const clientSecret = request.headers.get("CF-Access-Client-Secret");
  if (clientId && clientSecret) {
    context.data.auth = {
      email: env.ADMIN_EMAIL,
      isAdmin: true,
      isServiceToken: true
    };
    return context.next();
  }
  const token = getCookie(request, "CF_Authorization");
  if (!token) {
    return new Response(JSON.stringify({ error: "\u672A\u8A8D\u8B49" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }
  const payload = decodeJwtPayload(token);
  if (!payload) {
    return new Response(JSON.stringify({ error: "\u7121\u6548\u7684\u8A8D\u8B49 token" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }
  if (!payload.email && payload.common_name) {
    context.data.auth = {
      email: env.ADMIN_EMAIL,
      isAdmin: true,
      isServiceToken: true
    };
    return context.next();
  }
  if (!payload.email) {
    return new Response(JSON.stringify({ error: "\u7121\u6548\u7684\u8A8D\u8B49 token" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }
  const email = String(payload.email).toLowerCase();
  const isAdmin = email === env.ADMIN_EMAIL.toLowerCase();
  context.data.auth = {
    email,
    isAdmin,
    isServiceToken: false
  };
  return context.next();
}
__name(handleAuth, "handleAuth");
__name2(handleAuth, "handleAuth");
var routes = [
  {
    routePath: "/api/trips/:id/audit/:aid/rollback",
    mountPath: "/api/trips/:id/audit/:aid",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost]
  },
  {
    routePath: "/api/trips/:id/entries/:eid/restaurants",
    mountPath: "/api/trips/:id/entries/:eid",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost2]
  },
  {
    routePath: "/api/trips/:id/entries/:eid/shopping",
    mountPath: "/api/trips/:id/entries/:eid",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost3]
  },
  {
    routePath: "/api/trips/:id/hotels/:hid/shopping",
    mountPath: "/api/trips/:id/hotels/:hid",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost4]
  },
  {
    routePath: "/api/trips/:id/days/:num",
    mountPath: "/api/trips/:id/days",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet]
  },
  {
    routePath: "/api/trips/:id/days/:num",
    mountPath: "/api/trips/:id/days",
    method: "PUT",
    middlewares: [],
    modules: [onRequestPut]
  },
  {
    routePath: "/api/trips/:id/docs/:type",
    mountPath: "/api/trips/:id/docs",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet2]
  },
  {
    routePath: "/api/trips/:id/docs/:type",
    mountPath: "/api/trips/:id/docs",
    method: "PUT",
    middlewares: [],
    modules: [onRequestPut2]
  },
  {
    routePath: "/api/trips/:id/entries/:eid",
    mountPath: "/api/trips/:id/entries",
    method: "DELETE",
    middlewares: [],
    modules: [onRequestDelete]
  },
  {
    routePath: "/api/trips/:id/entries/:eid",
    mountPath: "/api/trips/:id/entries",
    method: "PATCH",
    middlewares: [],
    modules: [onRequestPatch]
  },
  {
    routePath: "/api/trips/:id/restaurants/:rid",
    mountPath: "/api/trips/:id/restaurants",
    method: "DELETE",
    middlewares: [],
    modules: [onRequestDelete2]
  },
  {
    routePath: "/api/trips/:id/restaurants/:rid",
    mountPath: "/api/trips/:id/restaurants",
    method: "PATCH",
    middlewares: [],
    modules: [onRequestPatch2]
  },
  {
    routePath: "/api/trips/:id/shopping/:sid",
    mountPath: "/api/trips/:id/shopping",
    method: "DELETE",
    middlewares: [],
    modules: [onRequestDelete3]
  },
  {
    routePath: "/api/trips/:id/shopping/:sid",
    mountPath: "/api/trips/:id/shopping",
    method: "PATCH",
    middlewares: [],
    modules: [onRequestPatch3]
  },
  {
    routePath: "/api/trips/:id/audit",
    mountPath: "/api/trips/:id",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet3]
  },
  {
    routePath: "/api/trips/:id/days",
    mountPath: "/api/trips/:id",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet4]
  },
  {
    routePath: "/api/permissions/:id",
    mountPath: "/api/permissions",
    method: "DELETE",
    middlewares: [],
    modules: [onRequestDelete4]
  },
  {
    routePath: "/api/requests/:id",
    mountPath: "/api/requests",
    method: "PATCH",
    middlewares: [],
    modules: [onRequestPatch4]
  },
  {
    routePath: "/api/trips/:id",
    mountPath: "/api/trips",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet6]
  },
  {
    routePath: "/api/trips/:id",
    mountPath: "/api/trips",
    method: "PUT",
    middlewares: [],
    modules: [onRequestPut3]
  },
  {
    routePath: "/api/my-trips",
    mountPath: "/api",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet7]
  },
  {
    routePath: "/api/permissions",
    mountPath: "/api",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet5]
  },
  {
    routePath: "/api/permissions",
    mountPath: "/api",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost5]
  },
  {
    routePath: "/api/requests",
    mountPath: "/api",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet8]
  },
  {
    routePath: "/api/requests",
    mountPath: "/api",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost6]
  },
  {
    routePath: "/api/trips",
    mountPath: "/api",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet9]
  },
  {
    routePath: "/trip/:path*",
    mountPath: "/trip",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet10]
  },
  {
    routePath: "/api",
    mountPath: "/api",
    method: "",
    middlewares: [onRequest],
    modules: []
  }
];
function lexer(str) {
  var tokens = [];
  var i = 0;
  while (i < str.length) {
    var char = str[i];
    if (char === "*" || char === "+" || char === "?") {
      tokens.push({ type: "MODIFIER", index: i, value: str[i++] });
      continue;
    }
    if (char === "\\") {
      tokens.push({ type: "ESCAPED_CHAR", index: i++, value: str[i++] });
      continue;
    }
    if (char === "{") {
      tokens.push({ type: "OPEN", index: i, value: str[i++] });
      continue;
    }
    if (char === "}") {
      tokens.push({ type: "CLOSE", index: i, value: str[i++] });
      continue;
    }
    if (char === ":") {
      var name = "";
      var j = i + 1;
      while (j < str.length) {
        var code = str.charCodeAt(j);
        if (
          // `0-9`
          code >= 48 && code <= 57 || // `A-Z`
          code >= 65 && code <= 90 || // `a-z`
          code >= 97 && code <= 122 || // `_`
          code === 95
        ) {
          name += str[j++];
          continue;
        }
        break;
      }
      if (!name)
        throw new TypeError("Missing parameter name at ".concat(i));
      tokens.push({ type: "NAME", index: i, value: name });
      i = j;
      continue;
    }
    if (char === "(") {
      var count = 1;
      var pattern = "";
      var j = i + 1;
      if (str[j] === "?") {
        throw new TypeError('Pattern cannot start with "?" at '.concat(j));
      }
      while (j < str.length) {
        if (str[j] === "\\") {
          pattern += str[j++] + str[j++];
          continue;
        }
        if (str[j] === ")") {
          count--;
          if (count === 0) {
            j++;
            break;
          }
        } else if (str[j] === "(") {
          count++;
          if (str[j + 1] !== "?") {
            throw new TypeError("Capturing groups are not allowed at ".concat(j));
          }
        }
        pattern += str[j++];
      }
      if (count)
        throw new TypeError("Unbalanced pattern at ".concat(i));
      if (!pattern)
        throw new TypeError("Missing pattern at ".concat(i));
      tokens.push({ type: "PATTERN", index: i, value: pattern });
      i = j;
      continue;
    }
    tokens.push({ type: "CHAR", index: i, value: str[i++] });
  }
  tokens.push({ type: "END", index: i, value: "" });
  return tokens;
}
__name(lexer, "lexer");
__name2(lexer, "lexer");
function parse(str, options) {
  if (options === void 0) {
    options = {};
  }
  var tokens = lexer(str);
  var _a = options.prefixes, prefixes = _a === void 0 ? "./" : _a, _b = options.delimiter, delimiter = _b === void 0 ? "/#?" : _b;
  var result = [];
  var key = 0;
  var i = 0;
  var path = "";
  var tryConsume = /* @__PURE__ */ __name2(function(type) {
    if (i < tokens.length && tokens[i].type === type)
      return tokens[i++].value;
  }, "tryConsume");
  var mustConsume = /* @__PURE__ */ __name2(function(type) {
    var value2 = tryConsume(type);
    if (value2 !== void 0)
      return value2;
    var _a2 = tokens[i], nextType = _a2.type, index = _a2.index;
    throw new TypeError("Unexpected ".concat(nextType, " at ").concat(index, ", expected ").concat(type));
  }, "mustConsume");
  var consumeText = /* @__PURE__ */ __name2(function() {
    var result2 = "";
    var value2;
    while (value2 = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR")) {
      result2 += value2;
    }
    return result2;
  }, "consumeText");
  var isSafe = /* @__PURE__ */ __name2(function(value2) {
    for (var _i = 0, delimiter_1 = delimiter; _i < delimiter_1.length; _i++) {
      var char2 = delimiter_1[_i];
      if (value2.indexOf(char2) > -1)
        return true;
    }
    return false;
  }, "isSafe");
  var safePattern = /* @__PURE__ */ __name2(function(prefix2) {
    var prev = result[result.length - 1];
    var prevText = prefix2 || (prev && typeof prev === "string" ? prev : "");
    if (prev && !prevText) {
      throw new TypeError('Must have text between two parameters, missing text after "'.concat(prev.name, '"'));
    }
    if (!prevText || isSafe(prevText))
      return "[^".concat(escapeString(delimiter), "]+?");
    return "(?:(?!".concat(escapeString(prevText), ")[^").concat(escapeString(delimiter), "])+?");
  }, "safePattern");
  while (i < tokens.length) {
    var char = tryConsume("CHAR");
    var name = tryConsume("NAME");
    var pattern = tryConsume("PATTERN");
    if (name || pattern) {
      var prefix = char || "";
      if (prefixes.indexOf(prefix) === -1) {
        path += prefix;
        prefix = "";
      }
      if (path) {
        result.push(path);
        path = "";
      }
      result.push({
        name: name || key++,
        prefix,
        suffix: "",
        pattern: pattern || safePattern(prefix),
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    var value = char || tryConsume("ESCAPED_CHAR");
    if (value) {
      path += value;
      continue;
    }
    if (path) {
      result.push(path);
      path = "";
    }
    var open = tryConsume("OPEN");
    if (open) {
      var prefix = consumeText();
      var name_1 = tryConsume("NAME") || "";
      var pattern_1 = tryConsume("PATTERN") || "";
      var suffix = consumeText();
      mustConsume("CLOSE");
      result.push({
        name: name_1 || (pattern_1 ? key++ : ""),
        pattern: name_1 && !pattern_1 ? safePattern(prefix) : pattern_1,
        prefix,
        suffix,
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    mustConsume("END");
  }
  return result;
}
__name(parse, "parse");
__name2(parse, "parse");
function match(str, options) {
  var keys = [];
  var re = pathToRegexp(str, keys, options);
  return regexpToFunction(re, keys, options);
}
__name(match, "match");
__name2(match, "match");
function regexpToFunction(re, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.decode, decode = _a === void 0 ? function(x) {
    return x;
  } : _a;
  return function(pathname) {
    var m = re.exec(pathname);
    if (!m)
      return false;
    var path = m[0], index = m.index;
    var params = /* @__PURE__ */ Object.create(null);
    var _loop_1 = /* @__PURE__ */ __name2(function(i2) {
      if (m[i2] === void 0)
        return "continue";
      var key = keys[i2 - 1];
      if (key.modifier === "*" || key.modifier === "+") {
        params[key.name] = m[i2].split(key.prefix + key.suffix).map(function(value) {
          return decode(value, key);
        });
      } else {
        params[key.name] = decode(m[i2], key);
      }
    }, "_loop_1");
    for (var i = 1; i < m.length; i++) {
      _loop_1(i);
    }
    return { path, index, params };
  };
}
__name(regexpToFunction, "regexpToFunction");
__name2(regexpToFunction, "regexpToFunction");
function escapeString(str) {
  return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
__name(escapeString, "escapeString");
__name2(escapeString, "escapeString");
function flags(options) {
  return options && options.sensitive ? "" : "i";
}
__name(flags, "flags");
__name2(flags, "flags");
function regexpToRegexp(path, keys) {
  if (!keys)
    return path;
  var groupsRegex = /\((?:\?<(.*?)>)?(?!\?)/g;
  var index = 0;
  var execResult = groupsRegex.exec(path.source);
  while (execResult) {
    keys.push({
      // Use parenthesized substring match if available, index otherwise
      name: execResult[1] || index++,
      prefix: "",
      suffix: "",
      modifier: "",
      pattern: ""
    });
    execResult = groupsRegex.exec(path.source);
  }
  return path;
}
__name(regexpToRegexp, "regexpToRegexp");
__name2(regexpToRegexp, "regexpToRegexp");
function arrayToRegexp(paths, keys, options) {
  var parts = paths.map(function(path) {
    return pathToRegexp(path, keys, options).source;
  });
  return new RegExp("(?:".concat(parts.join("|"), ")"), flags(options));
}
__name(arrayToRegexp, "arrayToRegexp");
__name2(arrayToRegexp, "arrayToRegexp");
function stringToRegexp(path, keys, options) {
  return tokensToRegexp(parse(path, options), keys, options);
}
__name(stringToRegexp, "stringToRegexp");
__name2(stringToRegexp, "stringToRegexp");
function tokensToRegexp(tokens, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.strict, strict = _a === void 0 ? false : _a, _b = options.start, start = _b === void 0 ? true : _b, _c = options.end, end = _c === void 0 ? true : _c, _d = options.encode, encode = _d === void 0 ? function(x) {
    return x;
  } : _d, _e = options.delimiter, delimiter = _e === void 0 ? "/#?" : _e, _f = options.endsWith, endsWith = _f === void 0 ? "" : _f;
  var endsWithRe = "[".concat(escapeString(endsWith), "]|$");
  var delimiterRe = "[".concat(escapeString(delimiter), "]");
  var route = start ? "^" : "";
  for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
    var token = tokens_1[_i];
    if (typeof token === "string") {
      route += escapeString(encode(token));
    } else {
      var prefix = escapeString(encode(token.prefix));
      var suffix = escapeString(encode(token.suffix));
      if (token.pattern) {
        if (keys)
          keys.push(token);
        if (prefix || suffix) {
          if (token.modifier === "+" || token.modifier === "*") {
            var mod = token.modifier === "*" ? "?" : "";
            route += "(?:".concat(prefix, "((?:").concat(token.pattern, ")(?:").concat(suffix).concat(prefix, "(?:").concat(token.pattern, "))*)").concat(suffix, ")").concat(mod);
          } else {
            route += "(?:".concat(prefix, "(").concat(token.pattern, ")").concat(suffix, ")").concat(token.modifier);
          }
        } else {
          if (token.modifier === "+" || token.modifier === "*") {
            throw new TypeError('Can not repeat "'.concat(token.name, '" without a prefix and suffix'));
          }
          route += "(".concat(token.pattern, ")").concat(token.modifier);
        }
      } else {
        route += "(?:".concat(prefix).concat(suffix, ")").concat(token.modifier);
      }
    }
  }
  if (end) {
    if (!strict)
      route += "".concat(delimiterRe, "?");
    route += !options.endsWith ? "$" : "(?=".concat(endsWithRe, ")");
  } else {
    var endToken = tokens[tokens.length - 1];
    var isEndDelimited = typeof endToken === "string" ? delimiterRe.indexOf(endToken[endToken.length - 1]) > -1 : endToken === void 0;
    if (!strict) {
      route += "(?:".concat(delimiterRe, "(?=").concat(endsWithRe, "))?");
    }
    if (!isEndDelimited) {
      route += "(?=".concat(delimiterRe, "|").concat(endsWithRe, ")");
    }
  }
  return new RegExp(route, flags(options));
}
__name(tokensToRegexp, "tokensToRegexp");
__name2(tokensToRegexp, "tokensToRegexp");
function pathToRegexp(path, keys, options) {
  if (path instanceof RegExp)
    return regexpToRegexp(path, keys);
  if (Array.isArray(path))
    return arrayToRegexp(path, keys, options);
  return stringToRegexp(path, keys, options);
}
__name(pathToRegexp, "pathToRegexp");
__name2(pathToRegexp, "pathToRegexp");
var escapeRegex = /[.+?^${}()|[\]\\]/g;
function* executeRequest(request) {
  const requestPath = new URL(request.url).pathname;
  for (const route of [...routes].reverse()) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult) {
      for (const handler of route.middlewares.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: mountMatchResult.path
        };
      }
    }
  }
  for (const route of routes) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: true
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult && route.modules.length) {
      for (const handler of route.modules.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: matchResult.path
        };
      }
      break;
    }
  }
}
__name(executeRequest, "executeRequest");
__name2(executeRequest, "executeRequest");
var pages_template_worker_default = {
  async fetch(originalRequest, env, workerContext) {
    let request = originalRequest;
    const handlerIterator = executeRequest(request);
    let data = {};
    let isFailOpen = false;
    const next = /* @__PURE__ */ __name2(async (input, init) => {
      if (input !== void 0) {
        let url = input;
        if (typeof input === "string") {
          url = new URL(input, request.url).toString();
        }
        request = new Request(url, init);
      }
      const result = handlerIterator.next();
      if (result.done === false) {
        const { handler, params, path } = result.value;
        const context = {
          request: new Request(request.clone()),
          functionPath: path,
          next,
          params,
          get data() {
            return data;
          },
          set data(value) {
            if (typeof value !== "object" || value === null) {
              throw new Error("context.data must be an object");
            }
            data = value;
          },
          env,
          waitUntil: workerContext.waitUntil.bind(workerContext),
          passThroughOnException: /* @__PURE__ */ __name2(() => {
            isFailOpen = true;
          }, "passThroughOnException")
        };
        const response = await handler(context);
        if (!(response instanceof Response)) {
          throw new Error("Your Pages function should return a Response");
        }
        return cloneResponse(response);
      } else if ("ASSETS") {
        const response = await env["ASSETS"].fetch(request);
        return cloneResponse(response);
      } else {
        const response = await fetch(request);
        return cloneResponse(response);
      }
    }, "next");
    try {
      return await next();
    } catch (error) {
      if (isFailOpen) {
        const response = await env["ASSETS"].fetch(request);
        return cloneResponse(response);
      }
      throw error;
    }
  }
};
var cloneResponse = /* @__PURE__ */ __name2((response) => (
  // https://fetch.spec.whatwg.org/#null-body-status
  new Response(
    [101, 204, 205, 304].includes(response.status) ? null : response.body,
    response
  )
), "cloneResponse");
var drainBody = /* @__PURE__ */ __name2(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
__name2(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name2(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = pages_template_worker_default;
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
__name2(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
__name2(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");
__name2(__facade_invoke__, "__facade_invoke__");
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  static {
    __name(this, "___Facade_ScheduledController__");
  }
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name2(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name2(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name2(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
__name2(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name2((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name2((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
__name2(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;

// ../../../AppData/Local/npm-cache/_npx/32026684e21afda6/node_modules/wrangler/templates/pages-dev-util.ts
function isRoutingRuleMatch(pathname, routingRule) {
  if (!pathname) {
    throw new Error("Pathname is undefined.");
  }
  if (!routingRule) {
    throw new Error("Routing rule is undefined.");
  }
  const ruleRegExp = transformRoutingRuleToRegExp(routingRule);
  return pathname.match(ruleRegExp) !== null;
}
__name(isRoutingRuleMatch, "isRoutingRuleMatch");
function transformRoutingRuleToRegExp(rule) {
  let transformedRule;
  if (rule === "/" || rule === "/*") {
    transformedRule = rule;
  } else if (rule.endsWith("/*")) {
    transformedRule = `${rule.substring(0, rule.length - 2)}(/*)?`;
  } else if (rule.endsWith("/")) {
    transformedRule = `${rule.substring(0, rule.length - 1)}(/)?`;
  } else if (rule.endsWith("*")) {
    transformedRule = rule;
  } else {
    transformedRule = `${rule}(/)?`;
  }
  transformedRule = `^${transformedRule.replaceAll(/\./g, "\\.").replaceAll(/\*/g, ".*")}$`;
  return new RegExp(transformedRule);
}
__name(transformRoutingRuleToRegExp, "transformRoutingRuleToRegExp");

// .wrangler/tmp/pages-FtGuxx/47qjict01ck.js
var define_ROUTES_default = {
  version: 1,
  include: ["/api/*", "/trip/*"],
  exclude: ["/assets/*", "/icons/*", "/manifest.json"]
};
var routes2 = define_ROUTES_default;
var pages_dev_pipeline_default = {
  fetch(request, env, context) {
    const { pathname } = new URL(request.url);
    for (const exclude of routes2.exclude) {
      if (isRoutingRuleMatch(pathname, exclude)) {
        return env.ASSETS.fetch(request);
      }
    }
    for (const include of routes2.include) {
      if (isRoutingRuleMatch(pathname, include)) {
        const workerAsHandler = middleware_loader_entry_default;
        if (workerAsHandler.fetch === void 0) {
          throw new TypeError("Entry point missing `fetch` handler");
        }
        return workerAsHandler.fetch(request, env, context);
      }
    }
    return env.ASSETS.fetch(request);
  }
};

// ../../../AppData/Local/npm-cache/_npx/32026684e21afda6/node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody2 = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default2 = drainBody2;

// ../../../AppData/Local/npm-cache/_npx/32026684e21afda6/node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError2(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError2(e.cause)
  };
}
__name(reduceError2, "reduceError");
var jsonError2 = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError2(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default2 = jsonError2;

// .wrangler/tmp/bundle-XDHiJC/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__2 = [
  middleware_ensure_req_body_drained_default2,
  middleware_miniflare3_json_error_default2
];
var middleware_insertion_facade_default2 = pages_dev_pipeline_default;

// ../../../AppData/Local/npm-cache/_npx/32026684e21afda6/node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__2 = [];
function __facade_register__2(...args) {
  __facade_middleware__2.push(...args.flat());
}
__name(__facade_register__2, "__facade_register__");
function __facade_invokeChain__2(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__2(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__2, "__facade_invokeChain__");
function __facade_invoke__2(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__2(request, env, ctx, dispatch, [
    ...__facade_middleware__2,
    finalMiddleware
  ]);
}
__name(__facade_invoke__2, "__facade_invoke__");

// .wrangler/tmp/bundle-XDHiJC/middleware-loader.entry.ts
var __Facade_ScheduledController__2 = class ___Facade_ScheduledController__2 {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__2)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler2(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__2 === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__2.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__2) {
    __facade_register__2(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__2(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__2(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler2, "wrapExportedHandler");
function wrapWorkerEntrypoint2(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__2 === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__2.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__2) {
    __facade_register__2(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__2(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__2(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint2, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY2;
if (typeof middleware_insertion_facade_default2 === "object") {
  WRAPPED_ENTRY2 = wrapExportedHandler2(middleware_insertion_facade_default2);
} else if (typeof middleware_insertion_facade_default2 === "function") {
  WRAPPED_ENTRY2 = wrapWorkerEntrypoint2(middleware_insertion_facade_default2);
}
var middleware_loader_entry_default2 = WRAPPED_ENTRY2;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__2 as __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default2 as default
};
//# sourceMappingURL=47qjict01ck.js.map
