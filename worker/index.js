/*
 * Ioi! Tours – Server (Cloudflare Worker)
 *
 * Statische App-Dateien kommen weiter aus den Assets; dieser Worker beantwortet
 * nur /api/* und /media/*.
 *
 * Bindings (wrangler.jsonc):  DB = D1-Datenbank, MEDIA = KV (Audio/Bilder),
 *                             ASSETS = statische Dateien
 * Secret:                     ADMIN_PASSWORD  (Admin-Anmeldung; signiert auch Sitzungen)
 *
 * Ablauf: Institut registriert sich (pending) → Admin schaltet frei (approved)
 *         → Institut meldet sich an, legt Touren an, lädt Dateien hoch, veröffentlicht.
 */

const LANGS = ["en", "hu", "ro"];
const PLACE_KINDS = ["cafe", "restaurant", "shop", "museum", "institution", "other"];
const INSTITUTION_TYPES = ["theatre", "museum", "library", "university", "city", "business", "association", "other"];
const AUDIO_TYPES = ["audio/mpeg", "audio/mp3", "audio/mp4", "audio/x-m4a", "audio/aac", "audio/ogg", "audio/wav", "audio/webm"];
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_AUDIO = 20 * 1024 * 1024;
const MAX_IMAGE = 8 * 1024 * 1024;
const SESSION_DAYS = 7;

const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS institutions (
     id TEXT PRIMARY KEY, name TEXT NOT NULL, type TEXT, city TEXT NOT NULL, country TEXT,
     address TEXT, website TEXT, contact_name TEXT, email TEXT NOT NULL UNIQUE, phone TEXT,
     description TEXT, password_hash TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'pending',
     created_at TEXT NOT NULL, decided_at TEXT)`,
  `CREATE TABLE IF NOT EXISTS tours (
     id TEXT PRIMARY KEY, institution_id TEXT NOT NULL, city TEXT NOT NULL, country TEXT,
     content TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'draft', blocked INTEGER NOT NULL DEFAULT 0,
     created_at TEXT NOT NULL, updated_at TEXT NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS media (
     key TEXT PRIMARY KEY, institution_id TEXT NOT NULL, content_type TEXT NOT NULL,
     size INTEGER NOT NULL, created_at TEXT NOT NULL)`,
  `CREATE INDEX IF NOT EXISTS tours_by_inst ON tours(institution_id)`,
];

class HttpError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}

// ---------------------------------------------------------------- Hilfen
const enc = new TextEncoder();
const now = () => new Date().toISOString();
const newId = (p) => p + "_" + crypto.randomUUID().replace(/-/g, "").slice(0, 16);

function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      "x-content-type-options": "nosniff",
      ...headers,
    },
  });
}
function b64url(buf) {
  let s = "";
  new Uint8Array(buf).forEach((b) => (s += String.fromCharCode(b)));
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function fromB64url(str) {
  const s = atob(str.replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from(s, (c) => c.charCodeAt(0));
}
function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}
function str(v, max, { required = false, name = "field" } = {}) {
  const s = typeof v === "string" ? v.trim() : "";
  if (required && !s) throw new HttpError(400, `missing_${name}`);
  if (s.length > max) throw new HttpError(400, `too_long_${name}`);
  return s;
}
function url(v, name) {
  const s = str(v, 500, { name });
  if (!s) return "";
  let u;
  try { u = new URL(s); } catch { throw new HttpError(400, `invalid_${name}`); }
  if (!["http:", "https:"].includes(u.protocol)) throw new HttpError(400, `invalid_${name}`);
  return u.toString();
}
function i18n(v, max) {
  const out = {};
  if (v && typeof v === "object") for (const l of LANGS) { const s = str(v[l], max, { name: l }); if (s) out[l] = s; }
  return out;
}
function num(v, min, max, name) {
  const n = Number(v);
  if (!Number.isFinite(n) || n < min || n > max) throw new HttpError(400, `invalid_${name}`);
  return n;
}
async function body(req) {
  try { return await req.json(); } catch { throw new HttpError(400, "invalid_json"); }
}

// ---------------------------------------------------------------- Passwörter & Sitzungen
async function hashPassword(pw, saltB64) {
  const salt = saltB64 ? fromB64url(saltB64) : crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey("raw", enc.encode(pw), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt, iterations: 100000 }, key, 256);
  return `pbkdf2$100000$${b64url(salt)}$${b64url(bits)}`;
}
async function verifyPassword(pw, stored) {
  const [, , salt] = (stored || "").split("$");
  if (!salt) return false;
  return timingSafeEqual(await hashPassword(pw, salt), stored);
}
async function sessionKey(env) {
  if (!env.ADMIN_PASSWORD) throw new HttpError(503, "server_not_configured");
  const base = await crypto.subtle.importKey("raw", enc.encode(env.ADMIN_PASSWORD), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const derived = await crypto.subtle.sign("HMAC", base, enc.encode("ioi-session-v1"));
  return crypto.subtle.importKey("raw", derived, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
}
async function makeSession(env, role, id) {
  const payload = b64url(enc.encode(JSON.stringify({ r: role, id, exp: Date.now() + SESSION_DAYS * 864e5 })));
  const sig = b64url(await crypto.subtle.sign("HMAC", await sessionKey(env), enc.encode(payload)));
  return `${payload}.${sig}`;
}
async function readSession(req, env) {
  const m = (req.headers.get("cookie") || "").match(/(?:^|;\s*)ioi_s=([^;]+)/);
  if (!m || !env.ADMIN_PASSWORD) return null;
  const [payload, sig] = m[1].split(".");
  if (!payload || !sig) return null;
  const expected = b64url(await crypto.subtle.sign("HMAC", await sessionKey(env), enc.encode(payload)));
  if (!timingSafeEqual(expected, sig)) return null;
  try {
    const s = JSON.parse(new TextDecoder().decode(fromB64url(payload)));
    return s.exp > Date.now() ? s : null;
  } catch { return null; }
}
function cookie(token, maxAge) {
  return `ioi_s=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAge}`;
}

// ---------------------------------------------------------------- Datenbank
let schemaReady = null;
function ensureSchema(env) {
  if (!schemaReady) {
    schemaReady = env.DB.batch(SCHEMA.map((s) => env.DB.prepare(s))).catch((e) => { schemaReady = null; throw e; });
  }
  return schemaReady;
}

// ---------------------------------------------------------------- Touren prüfen & ausliefern
async function sanitizeTour(env, input, institutionId) {
  const languages = Array.isArray(input.languages) ? input.languages.filter((l) => LANGS.includes(l)) : [];
  if (!languages.length) throw new HttpError(400, "missing_languages");
  const usedKeys = new Set();
  const mediaKey = (k) => {
    if (!k) return null;
    if (typeof k !== "string" || !/^m_[a-f0-9]{16}$/.test(k)) throw new HttpError(400, "invalid_media");
    usedKeys.add(k);
    return k;
  };
  const coords = (c, name) => {
    if (!Array.isArray(c) || c.length !== 2) throw new HttpError(400, `missing_location_${name}`);
    return [num(c[0], -90, 90, "lat"), num(c[1], -180, 180, "lng")];
  };
  const stations = (Array.isArray(input.stations) ? input.stations : []).slice(0, 40).map((s, i) => {
    const title = i18n(s.title, 200);
    if (!Object.keys(title).length) throw new HttpError(400, `missing_title_stop_${i + 1}`);
    const audio = {};
    if (s.audio && typeof s.audio === "object") for (const l of LANGS) { const k = mediaKey(s.audio[l]); if (k) audio[l] = k; }
    const media = (Array.isArray(s.media) ? s.media : []).slice(0, 12).map((m) => ({ key: mediaKey(m.key), caption: i18n(m.caption, 300) })).filter((m) => m.key);
    const compare = (Array.isArray(s.compare) ? s.compare : []).slice(0, 6).map((c) => ({
      then: c.then && mediaKey(c.then.key) ? { key: c.then.key, year: str(c.then.year, 30, { name: "year" }), caption: i18n(c.then.caption, 300) } : null,
      now: c.now && mediaKey(c.now.key) ? { key: c.now.key, caption: i18n(c.now.caption, 300) } : null,
    })).filter((c) => c.then);
    return {
      id: typeof s.id === "string" && /^[a-z0-9_-]{1,40}$/i.test(s.id) ? s.id : newId("s"),
      coords: coords(s.coords, i + 1),
      year: str(String(s.year ?? ""), 20, { name: "year" }),
      title, subtitle: i18n(s.subtitle, 200), address: i18n(s.address, 300), text: i18n(s.text, 20000),
      audio, media, compare,
    };
  });
  if (!stations.length) throw new HttpError(400, "missing_stops");
  const places = (Array.isArray(input.places) ? input.places : []).slice(0, 60).map((p, i) => {
    const title = i18n(p.title, 200);
    if (!Object.keys(title).length) throw new HttpError(400, `missing_title_place_${i + 1}`);
    return {
      id: typeof p.id === "string" && /^[a-z0-9_-]{1,40}$/i.test(p.id) ? p.id : newId("p"),
      kind: PLACE_KINDS.includes(p.kind) ? p.kind : "other",
      coords: coords(p.coords, `place_${i + 1}`),
      title, text: i18n(p.text, 2000), address: i18n(p.address, 300), hours: i18n(p.hours, 300), offer: i18n(p.offer, 300),
      website: url(p.website, "website"),
      image: mediaKey(p.image),
      partner: p.partner === true,
    };
  });
  const title = i18n(input.title, 200);
  if (!Object.keys(title).length) throw new HttpError(400, "missing_tour_title");
  const content = {
    title, subtitle: i18n(input.subtitle, 300), description: i18n(input.description, 3000),
    city: str(input.city, 100, { required: true, name: "city" }),
    country: str(input.country, 100, { name: "country" }),
    languages, stations, places,
  };
  // Dateien müssen dem Institut gehören
  if (usedKeys.size) {
    const keys = [...usedKeys];
    const rows = await env.DB.prepare(`SELECT key FROM media WHERE institution_id = ? AND key IN (${keys.map(() => "?").join(",")})`)
      .bind(institutionId, ...keys).all();
    if (rows.results.length !== keys.length) throw new HttpError(400, "unknown_media");
  }
  return content;
}

function publicTour(row, inst) {
  const c = JSON.parse(row.content);
  const m = (k) => (k ? `/media/${k}` : null);
  return {
    id: row.id, source: "server",
    title: c.title, subtitle: c.subtitle, description: c.description,
    organizer: { en: inst.name, hu: inst.name, ro: inst.name },
    institution: { name: inst.name, website: inst.website || "" },
    city: c.city, country: c.country, languages: c.languages,
    stations: c.stations.map((s) => ({
      id: s.id, coords: s.coords, year: s.year, title: s.title, subtitle: s.subtitle, address: s.address, text: s.text,
      audio: Object.fromEntries(Object.entries(s.audio || {}).map(([l, k]) => [l, m(k)])),
      media: (s.media || []).map((x) => ({ src: m(x.key), caption: x.caption })),
      compare: (s.compare || []).map((x) => ({
        then: { src: m(x.then.key), year: x.then.year, caption: x.then.caption },
        now: x.now ? { src: m(x.now.key), caption: x.now.caption } : null,
      })),
    })),
    places: (c.places || []).map((p) => ({ ...p, image: m(p.image) })),
  };
}

// ---------------------------------------------------------------- API
async function requireRole(req, env, role) {
  const s = await readSession(req, env);
  if (!s || s.r !== role) throw new HttpError(401, "not_logged_in");
  if (role === "inst") {
    const inst = await env.DB.prepare("SELECT * FROM institutions WHERE id = ?").bind(s.id).first();
    if (!inst || inst.status !== "approved") throw new HttpError(403, "not_approved");
    return inst;
  }
  return s;
}

async function api(req, env, u) {
  const p = u.pathname.replace(/\/+$/, "");
  const method = req.method;
  // Schutz gegen Anfragen fremder Seiten (CSRF): Änderungen nur mit eigenem Header
  if (method !== "GET" && req.headers.get("x-ioi") !== "1") throw new HttpError(403, "missing_header");

  // ---- öffentlich
  if (p === "/api/tours" && method === "GET") {
    const rows = await env.DB.prepare(
      `SELECT t.*, i.name AS inst_name, i.website AS inst_website FROM tours t JOIN institutions i ON i.id = t.institution_id
       WHERE t.status = 'published' AND t.blocked = 0 AND i.status = 'approved' ORDER BY t.city, t.updated_at DESC`).all();
    return json(rows.results.map((r) => {
      const c = JSON.parse(r.content);
      const cover = c.stations.flatMap((s) => (s.media || []).map((m) => m.key))[0];
      return { id: r.id, city: c.city, country: c.country, title: c.title, subtitle: c.subtitle, languages: c.languages,
               institution: r.inst_name, stops: c.stations.length, places: (c.places || []).length, cover: cover ? `/media/${cover}` : null };
    }), 200, { "cache-control": "no-cache" });
  }
  let m = p.match(/^\/api\/tours\/([a-z0-9_]+)$/i);
  if (m && method === "GET") {
    const row = await env.DB.prepare("SELECT * FROM tours WHERE id = ? AND status = 'published' AND blocked = 0").bind(m[1]).first();
    if (!row) throw new HttpError(404, "not_found");
    const inst = await env.DB.prepare("SELECT name, website, status FROM institutions WHERE id = ?").bind(row.institution_id).first();
    if (!inst || inst.status !== "approved") throw new HttpError(404, "not_found");
    return json(publicTour(row, inst), 200, { "cache-control": "no-cache" });
  }
  if (p === "/api/register" && method === "POST") {
    const b = await body(req);
    if (b.website_confirm) return json({ ok: true }); // Honigtopf-Feld für Spam-Bots
    const email = str(b.email, 200, { required: true, name: "email" }).toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new HttpError(400, "invalid_email");
    const password = typeof b.password === "string" ? b.password : "";
    if (password.length < 10 || password.length > 200) throw new HttpError(400, "weak_password");
    const exists = await env.DB.prepare("SELECT id FROM institutions WHERE email = ?").bind(email).first();
    if (exists) throw new HttpError(409, "email_exists");
    await env.DB.prepare(
      `INSERT INTO institutions (id, name, type, city, country, address, website, contact_name, email, phone, description, password_hash, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?)`).bind(
      newId("i"), str(b.name, 200, { required: true, name: "name" }),
      INSTITUTION_TYPES.includes(b.type) ? b.type : "other",
      str(b.city, 100, { required: true, name: "city" }), str(b.country, 100, { name: "country" }),
      str(b.address, 300, { name: "address" }), url(b.website, "website"),
      str(b.contact_name, 200, { required: true, name: "contact_name" }), email,
      str(b.phone, 50, { name: "phone" }), str(b.description, 3000, { name: "description" }),
      await hashPassword(password), now()).run();
    return json({ ok: true, status: "pending" }, 201);
  }
  if (p === "/api/login" && method === "POST") {
    const b = await body(req);
    const email = str(b.email, 200, { name: "email" }).toLowerCase();
    const inst = await env.DB.prepare("SELECT * FROM institutions WHERE email = ?").bind(email).first();
    if (!inst || !(await verifyPassword(String(b.password || ""), inst.password_hash))) {
      await new Promise((r) => setTimeout(r, 800));
      throw new HttpError(401, "wrong_credentials");
    }
    if (inst.status !== "approved") throw new HttpError(403, inst.status === "pending" ? "pending" : "not_approved");
    return json({ ok: true, name: inst.name }, 200, { "set-cookie": cookie(await makeSession(env, "inst", inst.id), SESSION_DAYS * 86400) });
  }
  if (p === "/api/logout" && method === "POST") return json({ ok: true }, 200, { "set-cookie": cookie("", 0) });
  if (p === "/api/me" && method === "GET") {
    const s = await readSession(req, env);
    if (!s) return json({ role: null });
    if (s.r === "admin") return json({ role: "admin" });
    const inst = await env.DB.prepare("SELECT id, name, type, city, country, website, email, status FROM institutions WHERE id = ?").bind(s.id).first();
    return json(inst && inst.status === "approved" ? { role: "inst", institution: inst } : { role: null });
  }

  // ---- Admin
  if (p === "/api/admin/login" && method === "POST") {
    const b = await body(req);
    const key = await sessionKey(env);
    const a = b64url(await crypto.subtle.sign("HMAC", key, enc.encode(String(b.password || ""))));
    const e = b64url(await crypto.subtle.sign("HMAC", key, enc.encode(env.ADMIN_PASSWORD)));
    if (!timingSafeEqual(a, e)) { await new Promise((r) => setTimeout(r, 1000)); throw new HttpError(401, "wrong_credentials"); }
    return json({ ok: true }, 200, { "set-cookie": cookie(await makeSession(env, "admin", "admin"), 86400) });
  }
  if (p.startsWith("/api/admin/")) {
    await requireRole(req, env, "admin");
    if (p === "/api/admin/institutions" && method === "GET") {
      const rows = await env.DB.prepare(
        `SELECT id, name, type, city, country, address, website, contact_name, email, phone, description, status, created_at, decided_at,
                (SELECT COUNT(*) FROM tours t WHERE t.institution_id = institutions.id) AS tours
         FROM institutions ORDER BY CASE status WHEN 'pending' THEN 0 ELSE 1 END, created_at DESC`).all();
      return json(rows.results);
    }
    m = p.match(/^\/api\/admin\/institutions\/(i_[a-f0-9]{16})\/status$/);
    if (m && method === "POST") {
      const b = await body(req);
      if (!["approved", "rejected", "suspended", "pending"].includes(b.status)) throw new HttpError(400, "invalid_status");
      const r = await env.DB.prepare("UPDATE institutions SET status = ?, decided_at = ? WHERE id = ?").bind(b.status, now(), m[1]).run();
      if (!r.meta.changes) throw new HttpError(404, "not_found");
      return json({ ok: true });
    }
    if (p === "/api/admin/tours" && method === "GET") {
      const rows = await env.DB.prepare(
        `SELECT t.id, t.city, t.status, t.blocked, t.updated_at, t.content, i.name AS institution FROM tours t
         JOIN institutions i ON i.id = t.institution_id ORDER BY t.updated_at DESC`).all();
      return json(rows.results.map((r) => { const c = JSON.parse(r.content); delete r.content; return { ...r, title: c.title, stops: c.stations.length }; }));
    }
    m = p.match(/^\/api\/admin\/tours\/(t_[a-f0-9]{16})\/blocked$/);
    if (m && method === "POST") {
      const b = await body(req);
      await env.DB.prepare("UPDATE tours SET blocked = ? WHERE id = ?").bind(b.blocked ? 1 : 0, m[1]).run();
      return json({ ok: true });
    }
    throw new HttpError(404, "not_found");
  }

  // ---- Institut (angemeldet und freigeschaltet)
  if (p.startsWith("/api/my/")) {
    const inst = await requireRole(req, env, "inst");
    if (p === "/api/my/media" && method === "POST") {
      const type = (req.headers.get("content-type") || "").split(";")[0].trim().toLowerCase();
      const isAudio = AUDIO_TYPES.includes(type), isImage = IMAGE_TYPES.includes(type);
      if (!isAudio && !isImage) throw new HttpError(415, "unsupported_type");
      const data = await req.arrayBuffer();
      if (!data.byteLength) throw new HttpError(400, "empty_file");
      if (data.byteLength > (isAudio ? MAX_AUDIO : MAX_IMAGE)) throw new HttpError(413, "file_too_large");
      const key = "m_" + crypto.randomUUID().replace(/-/g, "").slice(0, 16);
      await env.MEDIA.put(key, data, { metadata: { type } });
      await env.DB.prepare("INSERT INTO media (key, institution_id, content_type, size, created_at) VALUES (?, ?, ?, ?, ?)")
        .bind(key, inst.id, type, data.byteLength, now()).run();
      return json({ key, url: `/media/${key}`, type }, 201);
    }
    if (p === "/api/my/tours" && method === "GET") {
      const rows = await env.DB.prepare("SELECT id, city, status, blocked, updated_at, content FROM tours WHERE institution_id = ? ORDER BY updated_at DESC").bind(inst.id).all();
      return json(rows.results.map((r) => { const c = JSON.parse(r.content); delete r.content; return { ...r, title: c.title, stops: c.stations.length }; }));
    }
    if (p === "/api/my/tours" && method === "POST") {
      const b = await body(req);
      const content = await sanitizeTour(env, b, inst.id);
      const id = newId("t");
      await env.DB.prepare("INSERT INTO tours (id, institution_id, city, country, content, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, 'draft', ?, ?)")
        .bind(id, inst.id, content.city, content.country, JSON.stringify(content), now(), now()).run();
      return json({ id }, 201);
    }
    m = p.match(/^\/api\/my\/tours\/(t_[a-f0-9]{16})(\/status)?$/);
    if (m) {
      const row = await env.DB.prepare("SELECT * FROM tours WHERE id = ? AND institution_id = ?").bind(m[1], inst.id).first();
      if (!row) throw new HttpError(404, "not_found");
      if (m[2] && method === "POST") {
        const b = await body(req);
        if (!["draft", "published"].includes(b.status)) throw new HttpError(400, "invalid_status");
        await env.DB.prepare("UPDATE tours SET status = ?, updated_at = ? WHERE id = ?").bind(b.status, now(), row.id).run();
        return json({ ok: true });
      }
      if (method === "GET") {
        const c = JSON.parse(row.content);
        return json({ id: row.id, status: row.status, blocked: row.blocked, ...c });
      }
      if (method === "PUT") {
        const content = await sanitizeTour(env, await body(req), inst.id);
        await env.DB.prepare("UPDATE tours SET city = ?, country = ?, content = ?, updated_at = ? WHERE id = ?")
          .bind(content.city, content.country, JSON.stringify(content), now(), row.id).run();
        return json({ ok: true });
      }
      if (method === "DELETE") {
        await env.DB.prepare("DELETE FROM tours WHERE id = ?").bind(row.id).run();
        return json({ ok: true });
      }
    }
  }
  throw new HttpError(404, "not_found");
}

async function media(req, env, u) {
  const key = u.pathname.slice("/media/".length);
  if (!/^m_[a-f0-9]{16}$/.test(key)) return new Response("Not found", { status: 404 });
  const { value, metadata } = await env.MEDIA.getWithMetadata(key, { type: "stream" });
  if (!value) return new Response("Not found", { status: 404 });
  const type = metadata && (AUDIO_TYPES.includes(metadata.type) || IMAGE_TYPES.includes(metadata.type)) ? metadata.type : "application/octet-stream";
  return new Response(value, {
    headers: {
      "content-type": type,
      "cache-control": "public, max-age=31536000, immutable",
      "x-content-type-options": "nosniff",
      "content-security-policy": "default-src 'none'; sandbox",
    },
  });
}

export default {
  async fetch(req, env) {
    const u = new URL(req.url);
    try {
      if (u.pathname.startsWith("/media/")) return await media(req, env, u);
      if (u.pathname.startsWith("/api/")) {
        await ensureSchema(env);
        return await api(req, env, u);
      }
      return env.ASSETS.fetch(req);
    } catch (e) {
      if (e instanceof HttpError) return json({ error: e.message }, e.status);
      console.error(e);
      return json({ error: "server_error" }, 500);
    }
  },
};
