(function () {
  const T = window.TOUR;
  const S = T.stations;
  const ARRIVAL_RADIUS = 40;   // Meter: ab hier gilt eine Station als erreicht
  const WALK_SPEED = 75;       // Meter pro Minute
  const STORE_KEY = "buehne-kolozsvar-v1";

  const $ = id => document.getElementById(id);

  // ---------- Zustand ----------
  const state = {
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
      return d;
    } catch (e) { return {}; }
  }
  function save() {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify({ visited: [...state.visited], demo: state.demo, started: true }));
    } catch (e) { /* privates Fenster o. ä. */ }
  }

  // ---------- Hilfsfunktionen ----------
  function dist(a, b) {
    const R = 6371000, r = Math.PI / 180;
    const dLat = (b[0] - a[0]) * r, dLng = (b[1] - a[1]) * r;
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(a[0] * r) * Math.cos(b[0] * r) * Math.sin(dLng / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(h));
  }
  function fmtDist(m) {
    return m < 1000 ? Math.round(m / 10) * 10 + " m" : (m / 1000).toFixed(1).replace(".", ",") + " km";
  }
  function nextIdx() {
    const i = S.findIndex(s => !state.visited.has(s.id));
    return i === -1 ? null : i;
  }
  let toastTimer;
  function toast(msg, ms) {
    const t = $("toast");
    t.innerHTML = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), ms || 3500);
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
    const m = L.marker(s.coords, { icon: icon(i), title: s.title, keyboard: true }).addTo(map);
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
        toast(`<strong>Station ${i + 1} erreicht</strong><br>${s.title}`);
        if (state.openIdx !== i) openSheet(i);
      } else if (d > ARRIVAL_RADIUS * 2.5) {
        state.arrived.delete(s.id); // erneutes Betreten später wieder melden
      }
    });
  }

  // ---------- Geolokalisierung ----------
  function startGeo() {
    if (state.demo) return;
    if (!("geolocation" in navigator)) {
      toast("Ihr Gerät unterstützt keine Standortbestimmung. Der Demo-Modus ist im Menü verfügbar.", 5000);
      return;
    }
    let first = true;
    state.watchId = navigator.geolocation.watchPosition(
      p => {
        const ll = [p.coords.latitude, p.coords.longitude];
        if (first) {
          first = false;
          if (dist(ll, S[0].coords) > 20000) {
            toast("Sie scheinen nicht in Cluj zu sein. Tipp: Im Menü den <strong>Demo-Modus</strong> aktivieren.", 6000);
          }
        }
        if (!state.demo) setUserPos(ll, p.coords.accuracy);
      },
      () => toast("Standort nicht verfügbar. Im Menü können Sie den Demo-Modus aktivieren.", 5000),
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
    if (on) { stopGeo(); } else { startGeo(); }
    save();
  }
  map.on("click", e => { if (state.demo) setUserPos([e.latlng.lat, e.latlng.lng], 8); });

  $("locate-btn").onclick = () => {
    if (state.userPos) map.flyTo(state.userPos, 17);
    else if (state.demo) toast("Demo-Modus: Tippen Sie auf die Karte, um einen Standort zu setzen.");
    else toast("Standort wird noch gesucht …");
  };

  // ---------- Fortschritt & nächste Station ----------
  function renderProgress() {
    const n = state.visited.size;
    $("progress-label").textContent = `${n} / ${S.length} Stationen`;
    $("progress-fill").style.width = (n / S.length * 100) + "%";
    markers.forEach((m, i) => m.setIcon(icon(i)));
    renderList();
    renderNext();
  }

  function renderNext() {
    const i = nextIdx();
    const card = $("next-card");
    if (i === null) {
      $("next-num").textContent = "★";
      $("next-label").textContent = "Tour abgeschlossen";
      $("next-title").textContent = "Danke für Ihren Besuch!";
      $("next-meta").textContent = "Wir sehen uns im Theater.";
      $("next-open").textContent = "Neu starten";
      card.dataset.idx = "";
      return;
    }
    const s = S[i];
    $("next-num").textContent = i + 1;
    $("next-label").textContent = state.visited.size ? "Nächste Station" : "Erste Station";
    $("next-title").textContent = s.title;
    if (state.userPos) {
      const d = dist(state.userPos, s.coords);
      $("next-meta").textContent = d <= ARRIVAL_RADIUS
        ? "Sie sind da"
        : `${fmtDist(d)} · ca. ${Math.max(1, Math.round(d / WALK_SPEED))} min zu Fuß`;
    } else {
      $("next-meta").textContent = s.address;
    }
    $("next-open").textContent = "Öffnen";
    card.dataset.idx = i;
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
            <span class="li-title">${s.title}</span>
            <span class="li-sub">${s.year} · ${s.subtitle}</span>
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
    toast("Fortschritt zurückgesetzt.");
  }
  $("reset-btn").onclick = resetProgress;

  // ---------- Stationsdetail & Audio ----------
  const player = new StationAudio(T.lang);

  function openSheet(i) {
    const s = S[i];
    state.openIdx = i;
    $("sheet-num").textContent = `Station ${i + 1} von ${S.length}`;
    $("sheet-year").textContent = s.year;
    $("sheet-subtitle").textContent = s.subtitle;
    $("sheet-title").textContent = s.title;
    $("sheet-address").textContent = s.address;
    $("sheet-hero").style.setProperty("--hue", (350 + i * 9) % 360);

    let k = 0;
    $("sheet-text").innerHTML = storyParagraphs(s.text)
      .map(p => "<p>" + p.map(sen => `<span data-s="${k++}">${sen}</span>`).join(" ") + "</p>")
      .join("");

    $("sheet-next").textContent = i < S.length - 1 ? "Weiter zu Station " + (i + 2) : "Tour abschließen";
    $("player-source").textContent = "";
    player.load(s).then(mode => {
      if (state.openIdx !== i) return;
      $("player-source").textContent = mode === "file" ? "Aufnahme" : "Sprachausgabe";
    });

    $("sheet").classList.add("open");
    $("sheet").setAttribute("aria-hidden", "false");
    $("sheet").scrollTop = 0;
    $("scrim").classList.add("show");
    map.flyTo(s.coords, 17, { duration: .8 });
  }

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
    const i = state.openIdx;
    markVisited(i);
    closeSheet();
    const n = nextIdx();
    if (n === null) {
      toast("<strong>Bravo!</strong> Sie haben alle Stationen besucht.", 5000);
      return;
    }
    map.flyTo(S[n].coords, 16);
    toast(`Weiter zu Station ${n + 1}: ${S[n].title}`);
  };

  $("route-btn").onclick = () => {
    const c = S[state.openIdx].coords;
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${c[0]},${c[1]}&travelmode=walking`, "_blank", "noopener");
  };

  $("play-btn").onclick = () => {
    const st = player.state();
    if (st.mode === "tts" && !st.available) {
      toast("Keine Audiodatei und keine Sprachausgabe verfügbar. Bitte lesen Sie den Text.");
      return;
    }
    player.toggle();
  };
  $("back-btn").onclick = () => player.back(15);
  $("rate-btn").onclick = () => { $("rate-btn").textContent = String(player.cycleRate()).replace(".", ",") + "×"; };
  $("player-track").onclick = e => {
    const r = e.currentTarget.getBoundingClientRect();
    player.seek((e.clientX - r.left) / r.width);
  };

  let lastSentence = -2;
  player.on("update", st => {
    $("player").classList.toggle("playing", st.playing);
    $("play-btn").setAttribute("aria-label", st.playing ? "Pause" : "Abspielen");
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
      toast("Geschichte beendet. Weiter zur nächsten Station!");
    }
  });

  document.addEventListener("keydown", e => {
    if (e.key === "Escape") { closeSheet(); closeDrawer(); }
  });

  // ---------- Start ----------
  const saved = load();
  $("tour-title").textContent = T.title;
  $("intro-title").textContent = T.title;
  $("intro-subtitle").textContent = T.subtitle;
  $("intro-organizer").textContent = T.organizer;
  $("intro-count").textContent = S.length;
  renderProgress();

  function begin() {
    $("intro").classList.add("hide");
    setTimeout(() => map.invalidateSize(), 50);
    setDemo(state.demo);
    save();
  }
  $("start-btn").onclick = begin;
  if (saved.started) begin();

  if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }
})();
