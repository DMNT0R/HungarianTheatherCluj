(function () {
  const T = window.TOUR;
  const S = T.stations;
  const I = window.I18N;
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
      (d.visited || []).forEach(id => state.visited.add(id));
      state.demo = !!d.demo;
      state.lang = d.lang || null;
      return d;
    } catch (e) { return {}; }
  }
  function save(extra) {
    try {
      const prev = JSON.parse(localStorage.getItem(STORE_KEY) || "{}");
      localStorage.setItem(STORE_KEY, JSON.stringify(Object.assign(prev, {
        visited: [...state.visited], demo: state.demo, lang: state.lang
      }, extra || {})));
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
    if (v && typeof v === "object" && !Array.isArray(v)) return v[state.lang] ?? v[I.fallback];
    return v;
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
    document.querySelectorAll("[data-i18n]").forEach(el => { el.innerHTML = t(el.dataset.i18n); });
    document.querySelectorAll("[data-i18n-aria]").forEach(el => el.setAttribute("aria-label", t(el.dataset.i18nAria)));
    document.title = tr(T.title);
    $("tour-title").textContent = tr(T.title);
    $("intro-title").textContent = tr(T.title);
    $("intro-subtitle").textContent = tr(T.subtitle);
    $("intro-organizer").textContent = tr(T.organizer);
    $("intro-count").textContent = S.length;
    $("lang-btn").textContent = langInfo().short;
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
        .map(l => `<button type="button" data-lang="${l.code}" lang="${l.code}">${l.label}</button>`).join("");
      box.querySelectorAll("button").forEach(b => { b.onclick = () => setLang(b.dataset.lang); });
    });
    $("lang-btn").onclick = () => setLang(LANGS[(LANGS.indexOf(state.lang) + 1) % LANGS.length]);
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
    const i = S.findIndex(s => !state.visited.has(s.id));
    return i === -1 ? null : i;
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

  L.polyline(S.map(s => s.coords), { color: "#6e1a26", weight: 4, opacity: .55, dashArray: "2 10", lineCap: "round" }).addTo(map);

  const markers = S.map((s, i) => {
    const m = L.marker(s.coords, { icon: icon(i), keyboard: true }).addTo(map);
    m.on("click", () => openSheet(i));
    L.circle(s.coords, { radius: ARRIVAL_RADIUS, color: "#c79a3b", weight: 1, fillOpacity: .06, interactive: false }).addTo(map);
    return m;
  });

  function icon(i) {
    const s = S[i];
    const cls = state.visited.has(s.id) ? "visited" : i === nextIdx() ? "next" : "";
    return L.divIcon({
      className: "",
      html: `<div class="pin ${cls}"><span>${state.visited.has(s.id) ? "✓" : i + 1}</span></div>`,
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
    renderNext();
  }

  function checkArrival() {
    if (!state.userPos) return;
    S.forEach((s, i) => {
      const d = dist(state.userPos, s.coords);
      if (d <= ARRIVAL_RADIUS && !state.arrived.has(s.id)) {
        state.arrived.add(s.id);
        if (navigator.vibrate) navigator.vibrate([120, 60, 120]);
        toast(`<strong>${t("arrived", { i: i + 1 })}</strong><br>${esc(tr(s.title))}`);
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
          if (dist(ll, S[0].coords) > 20000) toast(t("notInCluj"), 6000);
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
    const n = state.visited.size;
    $("progress-label").textContent = t("progress", { n, total: S.length });
    $("progress-fill").style.width = (n / S.length * 100) + "%";
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
    $("next-num").textContent = i + 1;
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
    $("station-list").innerHTML = S.map((s, i) => `
      <li class="${state.visited.has(s.id) ? "visited" : ""} ${i === nextIdx() ? "next" : ""}">
        <button data-i="${i}">
          <span class="li-num">${state.visited.has(s.id) ? "✓" : i + 1}</span>
          <span class="li-text">
            <span class="li-title">${esc(tr(s.title))}</span>
            <span class="li-sub">${s.year} · ${esc(tr(s.subtitle))}</span>
          </span>
        </button>
      </li>`).join("");
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

  // ---------- Stationsdetail & Audio ----------
  const player = new StationAudio("en-GB");

  function openSheet(i, opts) {
    const s = S[i];
    state.openIdx = i;
    $("sheet-num").textContent = t("stationOf", { i: i + 1, n: S.length });
    $("sheet-year").textContent = s.year;
    $("sheet-subtitle").textContent = tr(s.subtitle);
    $("sheet-title").textContent = tr(s.title);
    $("sheet-address").innerHTML = esc(tr(s.address)) +
      (s.draftLocation ? ` <span class="badge">${esc(t("draftLocation"))}</span>` : "");
    $("sheet-hero").style.setProperty("--hue", (350 + i * 9) % 360);
    renderActivity(s);

    const text = tr(s.text);
    let k = 0;
    $("sheet-text").lang = state.lang;
    $("sheet-text").innerHTML = storyParagraphs(text)
      .map(p => "<p>" + p.map(sen => `<span data-s="${k++}">${esc(sen)}</span>`).join(" ") + "</p>")
      .join("");

    $("sheet-next").textContent = i < S.length - 1 ? t("continueTo", { n: i + 2 }) : t("finishTour");
    $("player-source").textContent = "";
    player.load({ text, audio: `audio/${state.lang}/${s.id}.mp3` }).then(mode => {
      if (state.openIdx !== i) return;
      $("player-source").textContent = mode === "file" ? t("recording") : t("tts");
    });

    $("sheet").classList.add("open");
    $("sheet").setAttribute("aria-hidden", "false");
    $("sheet").scrollTop = 0;
    $("scrim").classList.add("show");
    if (!(opts && opts.keepMap)) map.flyTo(s.coords, 17, { duration: .8 });
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
    toast(esc(t("nextToast", { n: n + 1, t: tr(S[n].title) })));
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
