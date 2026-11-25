/*
 * Portal für Institute: registrieren, anmelden, Touren anlegen und bearbeiten.
 * Spricht mit dem Server unter /api (siehe worker/index.js).
 */
(function () {
  const $ = id => document.getElementById(id);
  const LANGS = [["en", "English"], ["hu", "Magyar"], ["ro", "Română"]];
  const KINDS = [["cafe", "☕ Café"], ["restaurant", "🍽️ Restaurant"], ["shop", "🛍️ Shop"], ["museum", "🏛️ Museum"], ["institution", "📚 Institution"], ["other", "📍 Other"]];
  const ERR = {
    weak_password: "The password needs at least 10 characters.", email_exists: "This e-mail address is already registered.",
    invalid_email: "Please enter a valid e-mail address.", wrong_credentials: "E-mail or password is wrong.",
    pending: "Your application has not been approved yet.", not_approved: "This account is not active.",
    missing_stops: "Add at least one stop.", missing_languages: "Choose at least one language.", missing_tour_title: "Give the tour a title.",
    missing_city: "Enter the city.", unsupported_type: "This file type is not supported (use MP3/M4A/OGG audio or JPG/PNG/WebP images).",
    file_too_large: "The file is too large (audio max. 20 MB, images max. 8 MB).", invalid_website: "The website must start with http:// or https://.",
    server_not_configured: "The server is not configured yet (admin password missing).", not_logged_in: "Please log in again.",
  };
  const errText = (e) => {
    if (ERR[e]) return ERR[e];
    let m = /^missing_title_stop_(\d+)$/.exec(e); if (m) return `Stop ${m[1]} needs a title.`;
    m = /^missing_location_(\d+)$/.exec(e); if (m) return `Set the location of stop ${m[1]} on the map.`;
    m = /^missing_title_place_(\d+)$/.exec(e); if (m) return `Place ${m[1]} needs a name.`;
    m = /^missing_location_place_(\d+)$/.exec(e); if (m) return `Set the location of place ${m[1]} on the map.`;
    return "Something went wrong (" + e + ").";
  };
  const esc = x => String(x ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  let toastTimer;
  function toast(msg) {
    const el = $("toast"); el.textContent = msg; el.classList.add("show");
    clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove("show"), 3000);
  }

  async function api(method, path, data, raw) {
    const opts = { method, headers: { "x-ioi": "1" }, credentials: "same-origin" };
    if (raw) { opts.body = raw; opts.headers["content-type"] = raw.type || "application/octet-stream"; }
    else if (data !== undefined) { opts.body = JSON.stringify(data); opts.headers["content-type"] = "application/json"; }
    const r = await fetch(path, opts);
    let body = null; try { body = await r.json(); } catch (e) { /* leer */ }
    if (!r.ok) throw new Error((body && body.error) || "http_" + r.status);
    return body;
  }

  function show(view) {
    ["view-auth", "view-dash", "view-edit"].forEach(v => { $(v).hidden = v !== view; });
    window.scrollTo(0, 0);
  }

  // ---------------------------------------------------------------- Anmelden / Registrieren
  function tab(which) {
    $("tab-login").setAttribute("aria-selected", which === "login");
    $("tab-register").setAttribute("aria-selected", which === "register");
    $("form-login").hidden = which !== "login";
    $("form-register").hidden = which !== "register";
  }
  $("tab-login").onclick = () => tab("login");
  $("tab-register").onclick = () => tab("register");
  function formData(form) { return Object.fromEntries(new FormData(form).entries()); }

  $("form-login").onsubmit = async e => {
    e.preventDefault();
    const msg = e.target.querySelector("[data-msg]");
    msg.textContent = ""; msg.className = "pt-msg";
    try { await api("POST", "/api/login", formData(e.target)); await boot(); }
    catch (err) { msg.textContent = errText(err.message); msg.classList.add("err"); }
  };
  $("form-register").onsubmit = async e => {
    e.preventDefault();
    const msg = e.target.querySelector("[data-msg]");
    msg.textContent = ""; msg.className = "pt-msg";
    const d = formData(e.target);
    if (!d.name || !d.city || !d.contact_name || !d.email) { msg.textContent = "Please fill in all fields marked with *."; msg.classList.add("err"); return; }
    try {
      await api("POST", "/api/register", d);
      e.target.reset();
      msg.textContent = "Thank you! Your application has been sent. You will be able to log in once it has been approved.";
      msg.classList.add("ok");
    } catch (err) { msg.textContent = errText(err.message); msg.classList.add("err"); }
  };
  $("pt-logout").onclick = async () => { await api("POST", "/api/logout"); location.reload(); };

  // ---------------------------------------------------------------- Meine Touren
  const tr = v => (v && (v.en || v.hu || v.ro)) || "";
  async function loadDash() {
    show("view-dash");
    const list = await api("GET", "/api/my/tours");
    $("tour-list").innerHTML = list.length ? list.map(t => `
      <article class="pt-card pt-tour">
        <div>
          <h2>${esc(tr(t.title) || "Untitled tour")}</h2>
          <p>${esc(t.city)} · ${t.stops} stop${t.stops === 1 ? "" : "s"} ·
            <span class="pill ${t.blocked ? "blocked" : t.status}">${t.blocked ? "hidden by admin" : t.status === "published" ? "published" : "draft"}</span></p>
        </div>
        <div class="pt-actions">
          <button class="btn btn-ghost" data-edit="${esc(t.id)}" type="button">Edit</button>
          <button class="btn btn-ghost" data-publish="${esc(t.id)}" data-to="${t.status === "published" ? "draft" : "published"}" type="button">${t.status === "published" ? "Unpublish" : "Publish"}</button>
          ${t.status === "published" && !t.blocked ? `<a class="btn btn-ghost" href="./?tour=${encodeURIComponent(t.id)}" target="_blank" rel="noopener">Open in app ↗</a>` : ""}
          <button class="btn btn-ghost danger" data-delete="${esc(t.id)}" type="button">Delete</button>
        </div>
      </article>`).join("") : `<p class="pt-card">You have no tours yet. Create your first tour with “New tour”.</p>`;
    $("tour-list").querySelectorAll("[data-edit]").forEach(b => { b.onclick = () => openEditor(b.dataset.edit); });
    $("tour-list").querySelectorAll("[data-publish]").forEach(b => {
      b.onclick = async () => {
        try { await api("POST", `/api/my/tours/${b.dataset.publish}/status`, { status: b.dataset.to }); toast(b.dataset.to === "published" ? "Tour published." : "Tour is a draft again."); loadDash(); }
        catch (e) { toast(errText(e.message)); }
      };
    });
    $("tour-list").querySelectorAll("[data-delete]").forEach(b => {
      b.onclick = async () => {
        if (!confirm("Delete this tour permanently?")) return;
        await api("DELETE", `/api/my/tours/${b.dataset.delete}`); loadDash();
      };
    });
  }
  $("new-tour").onclick = () => openEditor(null);
  $("edit-back").onclick = () => { if (!dirty || confirm("Leave without saving?")) loadDash(); };

  // ---------------------------------------------------------------- Editor
  let tour = null, tourId = null, dirty = false, map = null, layer = null, picking = null;
  const emptyI18n = () => ({});
  function blankTour() {
    return { title: emptyI18n(), subtitle: emptyI18n(), description: emptyI18n(), city: me.city || "", country: me.country || "", languages: ["en"], stations: [], places: [] };
  }
  async function openEditor(id) {
    tourId = id;
    tour = id ? await api("GET", `/api/my/tours/${id}`) : blankTour();
    $("edit-status").textContent = id ? (tour.status === "published" ? "Published – changes are live after saving" : "Draft") : "New tour";
    dirty = false;
    show("view-edit");
    renderEditor();
  }

  function getPath(obj, path) { return path.split(".").reduce((o, k) => (o == null ? o : o[k]), obj); }
  function setPath(obj, path, value) {
    const keys = path.split(".");
    let o = obj;
    keys.slice(0, -1).forEach((k, i) => { if (o[k] == null) o[k] = /^\d+$/.test(keys[i + 1]) ? [] : {}; o = o[k]; });
    o[keys[keys.length - 1]] = value;
  }
  const field = (label, path, opts = {}) => {
    const v = getPath(tour, path) ?? "";
    const tag = opts.area
      ? `<textarea data-path="${path}" rows="${opts.rows || 6}" maxlength="${opts.max || 20000}">${esc(v)}</textarea>`
      : `<input data-path="${path}" value="${esc(v)}" maxlength="${opts.max || 300}" ${opts.type ? `type="${opts.type}"` : ""} placeholder="${esc(opts.placeholder || "")}">`;
    return `<label class="${opts.wide ? "wide" : ""}">${esc(label)}${tag}</label>`;
  };
  const i18nFields = (label, base, opts = {}) => tour.languages.map(l => field(`${label} (${l.toUpperCase()})`, `${base}.${l}`, { wide: true, ...opts })).join("");
  const mediaUrl = key => key ? `/media/${key}` : "";

  function renderEditor() {
    const langBoxes = LANGS.map(([c, n]) => `<label class="pt-check"><input type="checkbox" data-lang="${c}" ${tour.languages.includes(c) ? "checked" : ""}> ${n}</label>`).join("");
    $("editor").innerHTML = `
      <section class="pt-card">
        <h2>Tour</h2>
        <div class="pt-grid">
          ${field("City *", "city", { max: 100 })}
          ${field("Country", "country", { max: 100 })}
          <div class="wide"><span class="pt-label">Languages of this tour *</span><div class="pt-checks">${langBoxes}</div></div>
          ${i18nFields("Title *", "title", { max: 200 })}
          ${i18nFields("Subtitle", "subtitle", { max: 300 })}
          ${i18nFields("Short description", "description", { area: true, rows: 3, max: 3000 })}
        </div>
      </section>

      <section class="pt-card">
        <h2>Map</h2>
        <p class="pt-small" id="pick-hint">Stops are numbered, places have symbols. Use “Set location on map” on a stop or place, then click on the map.</p>
        <div id="pt-map" class="pt-map"></div>
      </section>

      <section>
        <div class="pt-row"><h2>Stops (${tour.stations.length})</h2><button class="btn btn-ghost" data-add="stop" type="button">+ Add stop</button></div>
        ${tour.stations.map((s, i) => stopCard(s, i)).join("") || `<p class="pt-card pt-small">No stops yet.</p>`}
      </section>

      <section>
        <div class="pt-row"><h2>Places along the tour (${tour.places.length})</h2><button class="btn btn-ghost" data-add="place" type="button">+ Add place</button></div>
        <p class="pt-small">Cafés, shops, museums or other institutions near the route. They appear as symbols on the map and under “Places nearby”.</p>
        ${tour.places.map((p, i) => placeCard(p, i)).join("")}
      </section>`;
    bindEditor();
    renderMap();
  }

  function locLine(base, coords) {
    return `<div class="pt-loc wide"><span>${coords ? `📍 ${coords[0].toFixed(5)}, ${coords[1].toFixed(5)}` : "📍 No location yet"}</span>
      <button class="btn btn-ghost" type="button" data-pick="${base}">Set location on map</button></div>`;
  }
  function uploadBtn(label, accept, target) {
    return `<label class="btn btn-ghost pt-upload">${esc(label)}<input type="file" accept="${accept}" data-upload="${target}" hidden></label>`;
  }
  function stopCard(s, i) {
    const b = `stations.${i}`;
    const audio = tour.languages.map(l => `
      <div class="pt-media-row"><strong>${l.toUpperCase()}</strong>
        ${s.audio && s.audio[l] ? `<audio controls preload="none" src="${mediaUrl(s.audio[l])}"></audio><button class="btn btn-ghost" type="button" data-clear="${b}.audio.${l}">Remove</button>`
          : `<span class="pt-small">No recording – the app will read the text aloud.</span>`}
        ${uploadBtn("Upload audio", "audio/*", `${b}.audio.${l}`)}
      </div>`).join("");
    const images = (s.media || []).map((m, k) => `
      <div class="pt-img"><img src="${mediaUrl(m.key)}" alt="">
        <div>${tour.languages.map(l => field(`Caption (${l.toUpperCase()})`, `${b}.media.${k}.caption.${l}`, { max: 300 })).join("")}
        <button class="btn btn-ghost" type="button" data-remove="${b}.media.${k}">Remove picture</button></div></div>`).join("");
    const pairs = (s.compare || []).map((c, k) => `
      <div class="pt-pair">
        <div><span class="pt-label">Then</span>${c.then && c.then.key ? `<img src="${mediaUrl(c.then.key)}" alt="">` : ""}${uploadBtn(c.then && c.then.key ? "Replace" : "Upload historic picture", "image/*", `${b}.compare.${k}.then.key`)}</div>
        <div><span class="pt-label">Now (optional)</span>${c.now && c.now.key ? `<img src="${mediaUrl(c.now.key)}" alt="">` : `<p class="pt-small">Without a current photo, visitors can take one on site.</p>`}${uploadBtn(c.now && c.now.key ? "Replace" : "Upload current photo", "image/*", `${b}.compare.${k}.now.key`)}</div>
        <div class="pt-pair-fields">${field("Year", `${b}.compare.${k}.then.year`, { max: 30 })}${tour.languages.map(l => field(`Caption (${l.toUpperCase()})`, `${b}.compare.${k}.then.caption.${l}`, { max: 300 })).join("")}
          <button class="btn btn-ghost" type="button" data-remove="${b}.compare.${k}">Remove pair</button></div>
      </div>`).join("");
    return `
      <details class="pt-card pt-item" ${s._open ? "open" : ""} data-open="${b}">
        <summary><span class="pt-num">${i + 1}</span> ${esc(tr(s.title) || "New stop")}<span class="pt-small">${s.coords ? "" : " · no location"}</span></summary>
        <div class="pt-grid">
          ${i18nFields("Title *", `${b}.title`, { max: 200 })}
          ${i18nFields("Subtitle", `${b}.subtitle`, { max: 200 })}
          ${field("Year", `${b}.year`, { max: 20, placeholder: "e.g. 1821" })}
          ${locLine(b, s.coords)}
          ${i18nFields("Address", `${b}.address`, { max: 300 })}
          ${i18nFields("Story (shown and read aloud)", `${b}.text`, { area: true, rows: 8 })}
        </div>
        <h3>Audio</h3>${audio}
        <h3>Pictures</h3>${images}${uploadBtn("+ Add picture", "image/*", `${b}.media.${(s.media || []).length}.key`)}
        <h3>Then &amp; now</h3>${pairs}<button class="btn btn-ghost" type="button" data-addpair="${i}">+ Add then/now pair</button>
        <div class="pt-actions pt-item-actions">
          <button class="btn btn-ghost" type="button" data-move="${i}" data-dir="-1" ${i === 0 ? "disabled" : ""}>↑ Up</button>
          <button class="btn btn-ghost" type="button" data-move="${i}" data-dir="1" ${i === tour.stations.length - 1 ? "disabled" : ""}>↓ Down</button>
          <button class="btn btn-ghost danger" type="button" data-remove="${b}">Delete stop</button>
        </div>
      </details>`;
  }
  function placeCard(p, i) {
    const b = `places.${i}`;
    return `
      <details class="pt-card pt-item" ${p._open ? "open" : ""} data-open="${b}">
        <summary>${(KINDS.find(k => k[0] === p.kind) || KINDS[5])[1].split(" ")[0]} ${esc(tr(p.title) || "New place")}<span class="pt-small">${p.coords ? "" : " · no location"}</span></summary>
        <div class="pt-grid">
          <label>Type<select data-path="${b}.kind">${KINDS.map(([v, n]) => `<option value="${v}" ${p.kind === v ? "selected" : ""}>${n}</option>`).join("")}</select></label>
          ${field("Website", `${b}.website`, { type: "url", placeholder: "https://", max: 500 })}
          ${locLine(b, p.coords)}
          ${i18nFields("Name *", `${b}.title`, { max: 200 })}
          ${i18nFields("Short description", `${b}.text`, { area: true, rows: 3, max: 2000 })}
          ${i18nFields("Address", `${b}.address`, { max: 300 })}
          ${i18nFields("Opening hours", `${b}.hours`, { max: 300 })}
          ${i18nFields("Offer for visitors (optional)", `${b}.offer`, { max: 300 })}
          <label class="pt-check wide"><input type="checkbox" data-path="${b}.partner" ${p.partner ? "checked" : ""}> Tour partner (paid or sponsored mention, visitors see a “Tour partner” label)</label>
          <div class="wide">${p.image ? `<img class="pt-thumb" src="${mediaUrl(p.image)}" alt="">` : ""}${uploadBtn(p.image ? "Replace picture" : "Add picture", "image/*", `${b}.image`)}</div>
        </div>
        <div class="pt-actions pt-item-actions"><button class="btn btn-ghost danger" type="button" data-remove="${b}">Delete place</button></div>
      </details>`;
  }

  function changed() { dirty = true; }
  function rememberOpen() {
    document.querySelectorAll("#editor details[data-open]").forEach(d => { const o = getPath(tour, d.dataset.open); if (o) o._open = d.open; });
  }
  function rerender() { rememberOpen(); renderEditor(); }

  function bindEditor() {
    const ed = $("editor");
    ed.querySelectorAll("[data-path]").forEach(el => {
      if (el.type === "checkbox") { el.addEventListener("change", () => { setPath(tour, el.dataset.path, el.checked); changed(); }); return; }
      el.addEventListener(el.tagName === "SELECT" ? "change" : "input", () => { setPath(tour, el.dataset.path, el.value); changed(); });
    });
    ed.querySelectorAll("[data-lang]").forEach(el => {
      el.onchange = () => {
        const set = new Set(tour.languages);
        el.checked ? set.add(el.dataset.lang) : set.delete(el.dataset.lang);
        if (!set.size) { el.checked = true; return; }
        tour.languages = LANGS.map(l => l[0]).filter(l => set.has(l));
        changed(); rerender();
      };
    });
    ed.querySelectorAll("[data-add]").forEach(b => {
      b.onclick = () => {
        const center = map ? [map.getCenter().lat, map.getCenter().lng] : null;
        if (b.dataset.add === "stop") tour.stations.push({ title: {}, subtitle: {}, address: {}, text: {}, audio: {}, media: [], compare: [], coords: null, _open: true });
        else tour.places.push({ kind: "cafe", title: {}, text: {}, address: {}, hours: {}, offer: {}, website: "", coords: null, _open: true });
        changed(); rerender();
        toast("Now set the location on the map.");
        void center;
      };
    });
    ed.querySelectorAll("[data-addpair]").forEach(b => {
      b.onclick = () => { const s = tour.stations[+b.dataset.addpair]; (s.compare = s.compare || []).push({ then: { key: null, year: "", caption: {} }, now: null }); s._open = true; changed(); rerender(); };
    });
    ed.querySelectorAll("[data-remove]").forEach(b => {
      b.onclick = () => {
        const keys = b.dataset.remove.split("."), idx = +keys.pop(), parent = getPath(tour, keys.join("."));
        parent.splice(idx, 1); changed(); rerender();
      };
    });
    ed.querySelectorAll("[data-clear]").forEach(b => { b.onclick = () => { setPath(tour, b.dataset.clear, null); changed(); rerender(); }; });
    ed.querySelectorAll("[data-move]").forEach(b => {
      b.onclick = () => {
        const i = +b.dataset.move, j = i + +b.dataset.dir, a = tour.stations;
        [a[i], a[j]] = [a[j], a[i]]; changed(); rerender();
      };
    });
    ed.querySelectorAll("[data-pick]").forEach(b => {
      b.onclick = () => {
        picking = b.dataset.pick;
        $("pick-hint").textContent = "Click on the map to set the location.";
        $("pick-hint").classList.add("active");
        $("pt-map").scrollIntoView({ behavior: "smooth", block: "center" });
      };
    });
    ed.querySelectorAll("[data-upload]").forEach(inp => {
      inp.onchange = async () => {
        const f = inp.files && inp.files[0];
        if (!f) return;
        const target = inp.dataset.upload;
        toast("Uploading …");
        try {
          const r = await api("POST", "/api/my/media", undefined, f);
          setPath(tour, target, r.key);
          if (/\.media\.\d+\.key$/.test(target)) { const base = target.replace(/\.key$/, ""); if (!getPath(tour, base + ".caption")) setPath(tour, base + ".caption", {}); }
          changed(); toast("Uploaded."); rerender();
        } catch (e) { toast(errText(e.message)); }
      };
    });
    ed.querySelectorAll("details[data-open]").forEach(d => { d.addEventListener("toggle", () => { const o = getPath(tour, d.dataset.open); if (o) o._open = d.open; }); });
  }

  function renderMap() {
    if (map) { map.remove(); map = null; }
    map = L.map("pt-map");
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19, attribution: "&copy; OpenStreetMap" }).addTo(map);
    layer = L.layerGroup().addTo(map);
    const pts = [];
    tour.stations.forEach((s, i) => {
      if (!s.coords) return;
      pts.push(s.coords);
      L.marker(s.coords, { icon: L.divIcon({ className: "", html: `<div class="pin"><span>${i + 1}</span></div>`, iconSize: [36, 44], iconAnchor: [18, 42] }) }).addTo(layer);
    });
    const withC = tour.stations.filter(s => s.coords).map(s => s.coords);
    if (withC.length > 1) L.polyline(withC, { color: "#6e1a26", weight: 3, opacity: .5, dashArray: "2 8" }).addTo(layer);
    tour.places.forEach(p => {
      if (!p.coords) return;
      pts.push(p.coords);
      L.marker(p.coords, { icon: L.divIcon({ className: "", html: `<div class="place-pin">${(KINDS.find(k => k[0] === p.kind) || KINDS[5])[1].split(" ")[0]}</div>`, iconSize: [30, 30], iconAnchor: [15, 15] }) }).addTo(layer);
    });
    if (pts.length) map.fitBounds(pts, { padding: [40, 40], maxZoom: 17 });
    else map.setView([46.7712, 23.6236], 13);
    map.on("click", e => {
      if (!picking) return;
      setPath(tour, picking + ".coords", [+e.latlng.lat.toFixed(6), +e.latlng.lng.toFixed(6)]);
      picking = null;
      changed(); rerender();
      toast("Location set.");
    });
  }

  function cleanForSave(t) {
    return JSON.parse(JSON.stringify(t, (k, v) => (k === "_open" ? undefined : v)));
  }
  $("edit-save").onclick = async () => {
    const msg = $("edit-msg");
    msg.textContent = ""; msg.className = "pt-msg";
    const data = cleanForSave(tour);
    data.stations.forEach(s => { s.compare = (s.compare || []).filter(c => c.then && c.then.key); s.media = (s.media || []).filter(m => m.key); });
    try {
      if (tourId) await api("PUT", `/api/my/tours/${tourId}`, data);
      else { const r = await api("POST", "/api/my/tours", data); tourId = r.id; }
      dirty = false;
      msg.textContent = "Saved."; msg.classList.add("ok");
      toast("Saved.");
    } catch (e) { msg.textContent = errText(e.message); msg.classList.add("err"); msg.scrollIntoView({ block: "center" }); }
  };
  window.addEventListener("beforeunload", e => { if (dirty) { e.preventDefault(); e.returnValue = ""; } });

  // ---------------------------------------------------------------- Start
  let me = {};
  async function boot() {
    let r;
    try { r = await api("GET", "/api/me"); } catch (e) { r = { role: null }; }
    if (r.role === "inst") {
      me = r.institution;
      $("pt-user").hidden = false;
      $("pt-user-name").textContent = me.name;
      loadDash();
    } else {
      $("pt-user").hidden = true;
      show("view-auth");
      if (location.hash === "#apply") tab("register");
    }
  }
  boot();
})();
