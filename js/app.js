(async function () {
  const I = window.I18N;
  const T = await Boot.resolveTour();
  if (location.search) history.replaceState(null, "", location.pathname);
  const S = T.stations;
  const PL = T.places || [];
  const TOUR_ID = T.id;
  // Hauptroute und optionale Stationen (optional: true) – Optionale haben Buchstaben statt Nummern
  const MAIN = S.map((s, i) => i).filter(i => !S[i].optional);
  const OPT = S.map((s, i) => i).filter(i => S[i].optional);
  const label = i => S[i].optional ? String.fromCharCode(65 + OPT.indexOf(i)) : String(MAIN.indexOf(i) + 1);
  const ARRIVAL_RADIUS = 40;   // Meter: ab hier gilt eine Station als erreicht
  const WALK_SPEED = 75;       // Meter pro Minute
  const STORE_KEY = "theatre-city-map-v1";

  const $ = id => document.getElementById(id);

  // ---------- Zustand ----------
  const state = {
    lang: null,
    visited: new Set(),
    arrived: new Set(),   // bereits per GPS gemeldete Ankünfte (keine Doppelmeldung)
    userPos: null,
    demo: false,
    openIdx: null,
    watchId: null
  };

  function load() {
    try {
      const d = JSON.parse(localStorage.getItem(STORE_KEY) || "{}");
      const mine = (d.tours || {})[TOUR_ID] || (TOUR_ID === Boot.BUILTIN_ID ? { visited: d.visited, started: d.started } : {});
      (mine.visited || []).forEach(id => state.visited.add(id));
      state.demo = !!d.demo;
      state.lang = d.lang || null;
      return { started: !!mine.started };
    } catch (e) { return {}; }
  }
  function save(extra) {
    try {
      const prev = JSON.parse(localStorage.getItem(STORE_KEY) || "{}");
      const tours = prev.tours || {};
      tours[TOUR_ID] = Object.assign(tours[TOUR_ID] || {}, { visited: [...state.visited] }, extra || {});
      delete prev.visited; delete prev.started;
      localStorage.setItem(STORE_KEY, JSON.stringify(Object.assign(prev, { tours, demo: state.demo, lang: state.lang })));
    } catch (e) { /* privates Fenster o. ä. */ }
  }

  // ---------- Sprache ----------
  const LANGS = I.languages.map(l => l.code);
  function detectLang() {
    const prefs = navigator.languages || [navigator.language || ""];
    for (const p of prefs) {
      const c = (p || "").slice(0, 2).toLowerCase();
      if (LANGS.includes(c)) return c;
    }
    return I.fallback;
  }
  /** Übersetzbaren Wert in der aktuellen Sprache liefern */
  function tr(v) {
    if (v && typeof v === "object" && !Array.isArray(v)) return v[state.lang] ?? v[I.fallback] ?? Object.values(v)[0] ?? "";
    return v ?? "";
  }
  /** Oberflächentext mit Platzhaltern */
  function t(key, vars) {
    let s = (I.strings[state.lang] || {})[key] ?? I.strings[I.fallback][key] ?? key;
    if (vars) s = s.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "");
    return s;
  }
  const langInfo = () => I.languages.find(l => l.code === state.lang);

  function applyStaticTexts() {
    document.documentElement.lang = state.lang;
    document.documentElement.dir = langInfo().dir || "ltr";
    document.querySelectorAll("[data-i18n]").forEach(el => { el.innerHTML = t(el.dataset.i18n); });
    document.querySelectorAll("[data-i18n-aria]").forEach(el => el.setAttribute("aria-label", t(el.dataset.i18nAria)));
    document.title = tr(T.title);
    $("tour-title").textContent = tr(T.title);
    $("intro-title").textContent = tr(T.title);
    $("intro-subtitle").textContent = tr(T.subtitle);
    $("intro-organizer").textContent = tr(T.organizer);
    $("intro-count").textContent = MAIN.length;
    $("intro-optional").textContent = OPT.length ? t("optionalCount", { n: OPT.length }) : "";
    const routeM = MAIN.slice(1).reduce((sum, i, k) => sum + dist(S[MAIN[k]].coords, S[i].coords), 0) * 1.3; // Umwege grob einrechnen
    $("intro-km").textContent = t("approxKm", { km: num(Math.max(0.5, Math.round(routeM / 500) / 2)) });
    $("intro-min").textContent = t("approxMin", { min: Math.round((routeM / WALK_SPEED + MAIN.length * 5) / 10) * 10 });
    $("drawer-lang").innerHTML = `🌐 ${esc(t("chooseLang"))}: <img class="lang-flag" src="img/flags/${state.lang}.svg" alt="" aria-hidden="true"> ${esc(langInfo().label)}`;
    $("lang-btn").innerHTML = `<img class="lang-flag" src="img/flags/${state.lang}.svg" alt="" aria-hidden="true">${esc(langInfo().short)}`;
    document.querySelectorAll(".lang-switch button").forEach(b => {
      b.setAttribute("aria-pressed", b.dataset.lang === state.lang ? "true" : "false");
    });
  }

  function setLang(code) {
    if (!LANGS.includes(code)) code = I.fallback;
    state.lang = code;
    player.setLang(langInfo().speech);
    applyStaticTexts();
    markers.forEach((m, i) => { const el = m.getElement(); if (el) el.title = tr(S[i].title); });
    renderProgress();
    if (state.openIdx != null) openSheet(state.openIdx, { keepMap: true });
    save();
  }

  function buildLangSwitches() {
    document.querySelectorAll(".lang-switch").forEach(box => {
      box.innerHTML = I.languages
        .map(l => `<button type="button" data-lang="${l.code}" lang="${l.code}"><img class="lang-flag" src="img/flags/${l.code}.svg" alt="" aria-hidden="true">${l.label}</button>`).join("");
      box.querySelectorAll("button").forEach(b => { b.onclick = () => { setLang(b.dataset.lang); toggleLangMenu(false); }; });
    });
    $("lang-btn").onclick = e => { e.stopPropagation(); toggleLangMenu(); };
    $("drawer-lang").onclick = e => { e.stopPropagation(); closeDrawer(); toggleLangMenu(true); };
    document.addEventListener("click", e => { if (!$("lang-menu").hidden && !$("lang-menu").contains(e.target)) toggleLangMenu(false); });
    document.addEventListener("keydown", e => { if (e.key === "Escape") toggleLangMenu(false); });
  }
  // Sprachmenü in der Kopfzeile: alle Sprachen auf einen Blick, ein Tipp genügt
  function toggleLangMenu(open) {
    const menu = $("lang-menu");
    open = open ?? menu.hidden;
    menu.hidden = !open;
    $("lang-btn").setAttribute("aria-expanded", open ? "true" : "false");
    if (open) (menu.querySelector('[aria-pressed="true"]') || menu.querySelector("button")).focus();
  }

  // ---------- Hilfsfunktionen ----------
  function dist(a, b) {
    const R = 6371000, r = Math.PI / 180;
    const dLat = (b[0] - a[0]) * r, dLng = (b[1] - a[1]) * r;
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(a[0] * r) * Math.cos(b[0] * r) * Math.sin(dLng / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(h));
  }
  function num(x) { return x.toLocaleString(state.lang); }
  function fmtDist(m) {
    return m < 1000 ? Math.round(m / 10) * 10 + " m" : num(Math.round(m / 100) / 10) + " km";
  }
  function nextIdx() {
    const i = MAIN.find(k => !state.visited.has(S[k].id));
    return i === undefined ? null : i;
  }
  function esc(x) {
    return String(x).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  }
  let toastTimer;
  function toast(msg, ms) {
    const el = $("toast");
    el.innerHTML = msg;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("show"), ms || 3500);
  }

  // ---------- Karte ----------
  const map = L.map("map", { zoomControl: false, attributionControl: true });
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);
  L.control.zoom({ position: "bottomright" }).addTo(map);

  const bounds = L.latLngBounds(S.map(s => s.coords));
  map.fitBounds(bounds, { padding: [40, 40] });

  L.polyline(MAIN.map(i => S[i].coords), { color: "#6e1a26", weight: 4, opacity: .55, dashArray: "2 10", lineCap: "round" }).addTo(map);

  const markers = S.map((s, i) => {
    const m = L.marker(s.coords, { icon: icon(i), keyboard: true }).addTo(map);
    m.on("click", () => openSheet(i));
    L.circle(s.coords, { radius: ARRIVAL_RADIUS, color: "#c79a3b", weight: 1, fillOpacity: .06, interactive: false }).addTo(map);
    return m;
  });

  // ---------- Lokale Orte: Cafés, Geschäfte, Museen ----------
  const PLACE_ICONS = { cafe: "☕", restaurant: "🍽️", shop: "🛍️", museum: "🏛️", institution: "📚", other: "📍" };
  const placeMarkers = PL.map(pl => {
    const m = L.marker(pl.coords, {
      icon: L.divIcon({ className: "", html: `<div class="place-pin${pl.partner ? " partner" : ""}" data-kind="${esc(pl.kind)}">${PLACE_ICONS[pl.kind] || "📍"}</div>`, iconSize: [30, 30], iconAnchor: [15, 15] }),
      keyboard: true, zIndexOffset: -100
    }).addTo(map);
    m.bindPopup(() => placePopup(pl), { maxWidth: 280, className: "place-popup" });
    return m;
  });
  function placePopup(pl) {
    const row = (label, v) => v ? `<p><span>${esc(label)}</span> ${esc(v)}</p>` : "";
    return `<div class="pp">
      ${pl.image ? `<img src="${esc(pl.image)}" alt="">` : ""}
      <small>${PLACE_ICONS[pl.kind] || "📍"} ${esc(t("kind_" + pl.kind))}${pl.partner ? ` · <b class="pp-partner">${esc(t("partner"))}</b>` : ""}</small>
      <strong>${esc(tr(pl.title))}</strong>
      ${tr(pl.text) ? `<p>${esc(tr(pl.text))}</p>` : ""}
      ${row(t("placeAddress"), tr(pl.address))}
      ${row(t("placeHours"), tr(pl.hours))}
      ${tr(pl.offer) ? `<p class="pp-offer">🎟️ ${esc(tr(pl.offer))}</p>` : ""}
      ${pl.website ? `<a href="${esc(pl.website)}" target="_blank" rel="noopener">${esc(t("placeWebsite"))} ↗</a>` : ""}
      ${tr(T.placesNote) ? `<p class="pp-note">${esc(tr(T.placesNote))}</p>` : ""}
    </div>`;
  }
  function openPlace(k) {
    closeSheet();
    map.flyTo(PL[k].coords, 18, { duration: .6 });
    setTimeout(() => placeMarkers[k].openPopup(), 650);
  }
  const placeSeen = new Set();
  function checkPlaces() {
    PL.forEach((pl, k) => {
      if (!state.userPos || placeSeen.has(k) || dist(state.userPos, pl.coords) > ARRIVAL_RADIUS) return;
      placeSeen.add(k);
      toast(`${PLACE_ICONS[pl.kind] || "📍"} <strong>${esc(t("placeNearby"))}</strong><br>${esc(tr(pl.title))}`, 4500);
    });
  }

  function icon(i) {
    const s = S[i];
    const cls = (state.visited.has(s.id) ? "visited" : i === nextIdx() ? "next" : "") + (s.optional ? " optional" : "");
    return L.divIcon({
      className: "",
      html: `<div class="pin ${cls}"><span>${state.visited.has(s.id) ? "✓" : label(i)}</span></div>`,
      iconSize: [36, 44],
      iconAnchor: [18, 42]
    });
  }

  let userMarker, accCircle;
  function setUserPos(latlng, accuracy) {
    state.userPos = latlng;
    if (!userMarker) {
      userMarker = L.marker(latlng, {
        icon: L.divIcon({ className: "", html: '<div class="me"></div>', iconSize: [22, 22], iconAnchor: [11, 11] }),
        interactive: false, zIndexOffset: 1000
      }).addTo(map);
      accCircle = L.circle(latlng, { radius: accuracy || 0, color: "#2f6fd6", weight: 1, fillOpacity: .1, interactive: false }).addTo(map);
    } else {
      userMarker.setLatLng(latlng);
      accCircle.setLatLng(latlng).setRadius(accuracy || 0);
    }
    checkArrival();
    checkPlaces();
    renderNext();
  }

  function checkArrival() {
    if (!state.userPos) return;
    S.forEach((s, i) => {
      const d = dist(state.userPos, s.coords);
      if (d <= ARRIVAL_RADIUS && !state.arrived.has(s.id)) {
        state.arrived.add(s.id);
        if (navigator.vibrate) navigator.vibrate([120, 60, 120]);
        toast(`<strong>${(s.optional ? t("optionalStop") + " " + label(i) : t("arrived", { i: label(i) }))}</strong><br>${esc(tr(s.title))}`);
        if (state.openIdx !== i) openSheet(i);
      } else if (d > ARRIVAL_RADIUS * 2.5) {
        state.arrived.delete(s.id); // erneutes Betreten später wieder melden
      }
    });
  }

  // ---------- Geolokalisierung ----------
  function startGeo() {
    if (state.demo) return;
    if (!("geolocation" in navigator)) { toast(t("noGeo"), 5000); return; }
    let first = true;
    state.watchId = navigator.geolocation.watchPosition(
      p => {
        const ll = [p.coords.latitude, p.coords.longitude];
        if (first) {
          first = false;
          if (dist(ll, S[0].coords) > 20000) toast(t("farFromTour"), 6000);
        }
        if (!state.demo) setUserPos(ll, p.coords.accuracy);
      },
      () => toast(t("geoUnavailable"), 5000),
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 20000 }
    );
  }
  function stopGeo() {
    if (state.watchId != null) navigator.geolocation.clearWatch(state.watchId);
    state.watchId = null;
  }

  function setDemo(on) {
    state.demo = on;
    $("demo-toggle").checked = on;
    $("demo-banner").hidden = !on;
    document.body.classList.toggle("demo", on);
    if (on) stopGeo(); else startGeo();
    save();
  }
  map.on("click", e => { if (state.demo) setUserPos([e.latlng.lat, e.latlng.lng], 8); });

  $("locate-btn").onclick = () => {
    if (state.userPos) map.flyTo(state.userPos, 17);
    else toast(state.demo ? t("demoTap") : t("searching"));
  };

  // ---------- Fortschritt & nächste Station ----------
  function renderProgress() {
    const n = MAIN.filter(i => state.visited.has(S[i].id)).length;
    $("progress-label").textContent = t("progress", { n, total: MAIN.length });
    $("progress-fill").style.width = (n / MAIN.length * 100) + "%";
    markers.forEach((m, i) => m.setIcon(icon(i)));
    markers.forEach((m, i) => { const el = m.getElement(); if (el) el.title = tr(S[i].title); });
    renderList();
    renderNext();
  }

  function renderNext() {
    const i = nextIdx();
    if (i === null) {
      $("next-num").textContent = "★";
      $("next-label").textContent = t("tourDone");
      $("next-title").textContent = t("thanks");
      $("next-meta").textContent = t("seeYou");
      $("next-open").textContent = t("restart");
      return;
    }
    const s = S[i];
    $("next-num").textContent = label(i);
    $("next-label").textContent = state.visited.size ? t("nextStation") : t("firstStation");
    $("next-title").textContent = tr(s.title);
    if (state.userPos) {
      const d = dist(state.userPos, s.coords);
      $("next-meta").textContent = d <= ARRIVAL_RADIUS
        ? t("youAreHere")
        : t("distance", { d: fmtDist(d), min: Math.max(1, Math.round(d / WALK_SPEED)) });
    } else {
      $("next-meta").textContent = tr(s.address);
    }
    $("next-open").textContent = t("open");
  }

  $("next-open").onclick = () => {
    const i = nextIdx();
    if (i === null) { resetProgress(); return; }
    openSheet(i);
  };
  $("next-card").querySelector(".next-info").onclick = () => {
    const i = nextIdx();
    if (i !== null) map.flyTo(S[i].coords, 17);
  };

  // ---------- Stationsliste ----------
  function renderList() {
    const item = i => { const s = S[i]; return `
      <li class="${state.visited.has(s.id) ? "visited" : ""} ${i === nextIdx() ? "next" : ""} ${s.optional ? "optional" : ""}">
        <button data-i="${i}">
          <span class="li-num">${state.visited.has(s.id) ? "✓" : label(i)}</span>
          <span class="li-text">
            <span class="li-title">${esc(tr(s.title))}</span>
            <span class="li-sub">${[s.year, tr(s.subtitle)].filter(Boolean).map(esc).join(" · ")}</span>
          </span>
        </button>
      </li>`; };
    $("station-list").innerHTML = MAIN.map(item).join("") +
      (OPT.length ? `<li class="list-head">${esc(t("optionalStops"))}</li>` + OPT.map(item).join("") : "");
    $("station-list").querySelectorAll("button").forEach(b => {
      b.onclick = () => { closeDrawer(); openSheet(+b.dataset.i); };
    });
  }
  function openDrawer() { $("drawer").classList.add("open"); $("scrim").classList.add("show"); $("drawer").setAttribute("aria-hidden", "false"); }
  function closeDrawer() { $("drawer").classList.remove("open"); $("scrim").classList.remove("show"); $("drawer").setAttribute("aria-hidden", "true"); }
  $("list-btn").onclick = openDrawer;
  $("drawer-close").onclick = closeDrawer;
  $("scrim").onclick = () => { closeDrawer(); closeSheet(); };
  $("demo-toggle").onchange = e => setDemo(e.target.checked);

  function resetProgress() {
    state.visited.clear();
    state.arrived.clear();
    save();
    renderProgress();
    closeDrawer();
    map.fitBounds(bounds, { padding: [40, 40] });
    toast(t("resetDone"));
  }
  $("reset-btn").onclick = resetProgress;
  $("change-tour-btn").onclick = Boot.chooseAnother;
  $("intro-change").onclick = Boot.chooseAnother;
  $("help-btn").onclick = async () => { closeDrawer(); await Boot.showOnboarding(); };

  // ---------- Stationsdetail & Audio ----------
  const player = new StationAudio("en-GB");

  function openSheet(i, opts) {
    const s = S[i];
    state.openIdx = i;
    $("sheet-num").textContent = s.optional ? `${t("optionalStop")} ${label(i)}` : t("stationOf", { i: label(i), n: MAIN.length });
    $("sheet-year").textContent = s.year;
    $("sheet-subtitle").textContent = tr(s.subtitle);
    $("sheet-title").textContent = tr(s.title);
    $("sheet-address").innerHTML = esc(tr(s.address)) +
      (s.draftLocation ? ` <span class="badge">${esc(t("draftLocation"))}</span>` : "");
    $("sheet-hero").style.setProperty("--hue", (350 + i * 9) % 360);
    renderMedia(s);
    renderActivity(s);
    renderCompare(s);
    renderNearby(s);

    const text = tr(s.text);
    let k = 0;
    $("sheet-text").lang = state.lang;
    $("sheet-text").innerHTML = storyParagraphs(text)
      .map(p => "<p>" + p.map(sen => `<span data-s="${k++}">${esc(sen)}</span>`).join(" ") + "</p>")
      .join("");

    const after = MAIN.find(k => k !== i && !state.visited.has(S[k].id) && (s.optional || MAIN.indexOf(k) > MAIN.indexOf(i)));
    $("sheet-next").textContent = after !== undefined ? t("continueTo", { n: label(after) }) : t("finishTour");
    $("player-source").textContent = "";
    const audioSrc = T.builtin ? `audio/${state.lang}/${s.id}.mp3` : ((s.audio || {})[state.lang] || null);
    player.load({ text, audio: audioSrc, timings: T.builtin ? `audio/${state.lang}/${s.id}.json` : null }).then(mode => {
      if (state.openIdx !== i) return;
      $("player-source").textContent = mode === "file" ? t("recording") : t("tts");
    });

    $("sheet").classList.add("open");
    $("sheet").setAttribute("aria-hidden", "false");
    $("sheet").scrollTop = 0;
    $("scrim").classList.add("show");
    if (!(opts && opts.keepMap)) map.flyTo(s.coords, 17, { duration: .8 });
  }

  // ---------- Archivbilder & Vollbildansicht ----------
  let lbItems = [], lbIdx = 0;
  function renderMedia(s) {
    const items = s.media || [];
    $("sheet-media-wrap").hidden = !items.length;
    $("media-credit").textContent = tr(T.mediaCredit) || "";
    $("sheet-media").innerHTML = items.map((m, k) => `
      <button type="button" data-k="${k}" aria-label="${esc(t("aOpenImg"))}: ${esc(tr(m.caption))}">
        <img src="${esc(m.src)}" alt="${esc(tr(m.caption))}" loading="lazy" referrerpolicy="no-referrer">
        <span>${esc(tr(m.caption))}</span>
      </button>`).join("");
    $("sheet-media").scrollLeft = 0;
    $("sheet-media").querySelectorAll("button").forEach(b => {
      b.onclick = () => openLightbox(items, +b.dataset.k);
    });
    // Bilder, die nicht laden (z. B. offline), ausblenden
    $("sheet-media").querySelectorAll("img").forEach(im => {
      im.onerror = () => { im.parentElement.hidden = true; };
    });
  }
  function showLightbox() {
    const m = lbItems[lbIdx];
    $("lightbox-img").src = m.src;
    $("lightbox-img").alt = tr(m.caption);
    $("lightbox-cap").textContent = `${tr(m.caption)}  (${lbIdx + 1}/${lbItems.length})`;
    $("lightbox-prev").hidden = $("lightbox-next").hidden = lbItems.length < 2;
  }
  function openLightbox(items, k) {
    lbItems = items; lbIdx = k;
    showLightbox();
    $("lightbox").hidden = false;
  }
  function closeLightbox() { $("lightbox").hidden = true; $("lightbox-img").removeAttribute("src"); }
  function stepLightbox(d) { lbIdx = (lbIdx + d + lbItems.length) % lbItems.length; showLightbox(); }
  $("lightbox-close").onclick = closeLightbox;
  $("lightbox-prev").onclick = e => { e.stopPropagation(); stepLightbox(-1); };
  $("lightbox-next").onclick = e => { e.stopPropagation(); stepLightbox(1); };
  $("lightbox").onclick = e => { if (e.target === $("lightbox")) closeLightbox(); };
  let touchX = null;
  $("lightbox").addEventListener("touchstart", e => { touchX = e.touches[0].clientX; }, { passive: true });
  $("lightbox").addEventListener("touchend", e => {
    if (touchX == null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50 && lbItems.length > 1) stepLightbox(dx < 0 ? 1 : -1);
    touchX = null;
  });

  // ---------- Damals & Heute: Schieberegler ----------
  const cmp = { pairs: [], idx: 0, value: 50, userNow: {} };
  function renderCompare(s) {
    cmp.pairs = s.compare || (s.rephoto ? s.rephoto.images.map(im => ({ then: im, now: null })) : []);
    cmp.stationId = s.id;
    $("sheet-compare").hidden = !cmp.pairs.length;
    if (!cmp.pairs.length) return;
    $("cmp-hint").textContent = s.rephoto ? tr(s.rephoto.hint) : "";
    $("cmp-thumbs").innerHTML = cmp.pairs.length > 1
      ? cmp.pairs.map((p, k) => `<button type="button" data-k="${k}"><img src="${esc(p.then.src)}" alt=""><span>${esc(p.then.year || "")}</span></button>`).join("")
      : "";
    $("cmp-thumbs").querySelectorAll("button").forEach(b => { b.onclick = () => showPair(+b.dataset.k); });
    showPair(0);
  }
  function showPair(k) {
    cmp.idx = k;
    const p = cmp.pairs[k];
    const userKey = cmp.stationId + ":" + k;
    const nowSrc = cmp.userNow[userKey] || (p.now && p.now.src) || "";
    $("cmp-then").src = p.then.src;
    $("cmp-then").alt = tr(p.then.caption);
    $("cmp-then").onload = () => {
      const im = $("cmp-then");
      if (im.naturalWidth) $("cmp-stage").style.aspectRatio = `${im.naturalWidth} / ${im.naturalHeight}`;
    };
    $("cmp-now").hidden = !nowSrc;
    if (nowSrc) $("cmp-now").src = nowSrc; else $("cmp-now").removeAttribute("src");
    $("cmp-empty").hidden = !!nowSrc;
    $("cmp-range").hidden = !nowSrc;
    $("cmp-handle").hidden = !nowSrc;
    $("cmp-tag-now").hidden = !nowSrc;
    $("cmp-caption").textContent = [tr(p.then.caption), p.then.year].filter(Boolean).join(" · ");
    $("cmp-tag-then").textContent = p.then.year || t("cmpThen");
    const credit = p.then.credit && T.rephotoCredits ? tr(T.rephotoCredits[p.then.credit]) : "";
    $("cmp-credit").textContent = credit ? "© " + credit : "";
    $("cmp-photo").textContent = nowSrc ? t("cmpRetake") : t("cmpTakePhoto");
    $("cmp-thumbs").querySelectorAll("button").forEach((b, j) => b.setAttribute("aria-pressed", j === k));
    setCompare(nowSrc ? 50 : 100);
  }
  function setCompare(v) {
    cmp.value = v;
    $("cmp-range").value = v;
    $("cmp-then-wrap").style.clipPath = `inset(0 ${100 - v}% 0 0)`;
    $("cmp-handle").style.left = v + "%";
  }
  $("cmp-range").oninput = e => setCompare(+e.target.value);
  $("cmp-photo").onclick = () => $("cmp-file").click();
  $("cmp-file").onchange = e => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const key = cmp.stationId + ":" + cmp.idx;
    if (cmp.userNow[key]) URL.revokeObjectURL(cmp.userNow[key]);
    cmp.userNow[key] = URL.createObjectURL(f);
    e.target.value = "";
    showPair(cmp.idx);
  };

  function renderNearby(s) {
    const near = PL.map((pl, k) => ({ pl, k, d: dist(s.coords, pl.coords) })).filter(x => x.d <= 250).sort((a, b) => a.d - b.d);
    $("sheet-nearby").hidden = !near.length;
    $("nearby-list").innerHTML = near.map(x => `<button type="button" class="nearby-chip" data-k="${x.k}">${PLACE_ICONS[x.pl.kind] || "📍"} ${esc(tr(x.pl.title))}${x.pl.partner ? ` <b class="pp-partner">${esc(t("partner"))}</b>` : ""} <small>${Math.round(x.d / 10) * 10} m</small></button>`).join("");
    $("nearby-list").querySelectorAll("button").forEach(b => { b.onclick = () => openPlace(+b.dataset.k); });
  }

  // ---------- Mitmach-Element, Kostümfoto, Links ----------
  let photoFile = null, photoUrl = null;
  function renderActivity(s) {
    const a = s.activity;
    $("sheet-activity").hidden = !a;
    if (a) {
      $("act-icon").textContent = a.icon || "★";
      $("act-title").textContent = tr(a.title);
      $("act-text").textContent = tr(a.text) || "";
      $("act-items").innerHTML = (tr(a.items) || []).map(x => `<li>${esc(x)}</li>`).join("");
      $("act-photo").hidden = !a.photo;
    }
    resetPhoto();
    $("sheet-links").innerHTML = (s.links || [])
      .map(l => `<a class="btn btn-ghost" href="${esc(l.url)}" target="_blank" rel="noopener">${esc(tr(l.label))} ↗</a>`)
      .join("");
  }
  function resetPhoto() {
    if (photoUrl) URL.revokeObjectURL(photoUrl);
    photoFile = photoUrl = null;
    $("photo-preview").hidden = true;
    $("photo-share").hidden = true;
    $("photo-btn").textContent = t("photoTake");
    $("photo-input").value = "";
  }
  $("photo-btn").onclick = () => $("photo-input").click();
  $("photo-input").onchange = e => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    if (photoUrl) URL.revokeObjectURL(photoUrl);
    photoFile = f;
    photoUrl = URL.createObjectURL(f);
    $("photo-preview").src = photoUrl;
    $("photo-preview").hidden = false;
    $("photo-share").hidden = false;
    $("photo-btn").textContent = t("photoNew");
  };
  $("photo-share").onclick = async () => {
    if (!photoFile) return;
    const data = { files: [photoFile], title: tr(T.title), text: t("photoShareText") };
    if (navigator.canShare && navigator.canShare({ files: [photoFile] })) {
      try { await navigator.share(data); } catch (e) { /* abgebrochen */ }
    } else {
      const a = document.createElement("a");
      a.href = photoUrl;
      a.download = "ioi-cluj-costume.jpg";
      a.click();
    }
  };

  function closeSheet() {
    player.stop();
    state.openIdx = null;
    $("sheet").classList.remove("open");
    $("sheet").setAttribute("aria-hidden", "true");
    if (!$("drawer").classList.contains("open")) $("scrim").classList.remove("show");
  }
  $("sheet-close").onclick = closeSheet;

  function markVisited(i) {
    if (state.visited.has(S[i].id)) return;
    state.visited.add(S[i].id);
    save();
    renderProgress();
  }

  $("sheet-next").onclick = () => {
    markVisited(state.openIdx);
    closeSheet();
    const n = nextIdx();
    if (n === null) { toast(t("bravo"), 5000); return; }
    map.flyTo(S[n].coords, 16);
    toast(esc(t("nextToast", { n: label(n), t: tr(S[n].title) })));
  };

  $("route-btn").onclick = () => {
    const c = S[state.openIdx].coords;
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${c[0]},${c[1]}&travelmode=walking&hl=${state.lang}`, "_blank", "noopener");
  };

  $("play-btn").onclick = () => {
    const st = player.state();
    if (st.mode === "tts") {
      if (!st.available) { toast(t("noAudio")); return; }
      if (!st.playing && player.hasVoice() === false) toast(t("noVoice"), 5000);
    }
    player.toggle();
  };
  $("back-btn").onclick = () => player.back(15);
  $("rate-btn").onclick = () => { $("rate-btn").textContent = num(player.cycleRate()) + "×"; };
  $("player-track").onclick = e => {
    const r = e.currentTarget.getBoundingClientRect();
    player.seek((e.clientX - r.left) / r.width);
  };

  let lastSentence = -2;
  player.on("update", st => {
    $("player").classList.toggle("playing", st.playing);
    $("play-btn").setAttribute("aria-label", st.playing ? t("aPause") : t("aPlay"));
    $("player-fill").style.width = (st.progress * 100) + "%";
    $("player-time").textContent = st.time;
    if (st.sentence !== lastSentence) {
      lastSentence = st.sentence;
      $("sheet-text").querySelectorAll(".speaking").forEach(el => el.classList.remove("speaking"));
      const el = $("sheet-text").querySelector(`[data-s="${st.sentence}"]`);
      if (el) {
        el.classList.add("speaking");
        el.scrollIntoView({ block: "center", behavior: "smooth" });
      }
    }
  });
  player.on("ended", () => {
    if (state.openIdx != null) {
      markVisited(state.openIdx);
      toast(t("storyEnded"));
    }
  });

  document.addEventListener("keydown", e => {
    if (!$("lightbox").hidden) {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") stepLightbox(-1);
      if (e.key === "ArrowRight") stepLightbox(1);
      return;
    }
    if (e.key === "Escape") { closeSheet(); closeDrawer(); }
  });

  // ---------- Start ----------
  const saved = load();
  buildLangSwitches();
  setLang(state.lang || detectLang());

  function begin() {
    $("intro").classList.add("hide");
    setTimeout(() => map.invalidateSize(), 50);
    setDemo(state.demo);
    save({ started: true });
  }
  $("start-btn").onclick = begin;
  if (saved.started) begin();

  if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }
})();
