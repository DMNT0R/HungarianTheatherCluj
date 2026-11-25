/*
 * Start der App: kurze Einführung (einmalig) → Auswahl von Stadt und Tour.
 * Boot.resolveTour() liefert die gewählte Tour im Format von window.TOUR.
 *
 * Touren kommen aus zwei Quellen:
 *  - eingebaute Tour (js/stations.js), funktioniert auch offline
 *  - Touren registrierter Institute vom Server (/api/tours)
 */
(function () {
  const STORE_KEY = "theatre-city-map-v1";
  const BUILTIN_ID = "cluj-theatre";
  const I = window.I18N;
  const $ = id => document.getElementById(id);

  function store() { try { return JSON.parse(localStorage.getItem(STORE_KEY) || "{}"); } catch (e) { return {}; } }
  function saveStore(patch) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(Object.assign(store(), patch))); } catch (e) { /* privat */ }
  }
  function lang() {
    const s = store().lang;
    if (s && I.strings[s]) return s;
    for (const p of navigator.languages || [navigator.language || ""]) {
      const c = (p || "").slice(0, 2).toLowerCase();
      if (I.strings[c]) return c;
    }
    return I.fallback;
  }
  function t(key, vars) {
    let s = (I.strings[lang()] || {})[key] ?? I.strings[I.fallback][key] ?? key;
    if (vars) s = s.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "");
    return s;
  }
  function tr(v) {
    if (v && typeof v === "object" && !Array.isArray(v)) return v[lang()] ?? v[I.fallback] ?? Object.values(v)[0] ?? "";
    return v ?? "";
  }
  function esc(x) {
    return String(x ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  }

  function builtinTour() {
    const T = window.TOUR;
    T.id = BUILTIN_ID;
    T.builtin = true;
    T.city = T.city || "Cluj-Napoca";
    T.country = T.country || "România";
    T.languages = T.languages || I.languages.map(l => l.code);
    return T;
  }
  function builtinSummary() {
    const T = builtinTour();
    return { id: BUILTIN_ID, builtin: true, city: T.city, country: T.country, title: T.title, subtitle: T.subtitle,
             institution: tr(T.organizer), stops: T.stations.length, places: (T.places || []).length, languages: T.languages };
  }

  async function fetchJSON(url, ms) {
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), ms || 6000);
    try {
      const r = await fetch(url, { signal: ctl.signal, headers: { accept: "application/json" } });
      if (!r.ok) throw new Error(r.status);
      return await r.json();
    } finally { clearTimeout(timer); }
  }

  async function loadTour(id) {
    if (id === BUILTIN_ID) return builtinTour();
    const T = await fetchJSON(`/api/tours/${encodeURIComponent(id)}`);
    T.builtin = false;
    return T;
  }

  // ---------- Einführung ----------
  const STEPS = [
    { icon: "🗺️", title: "obT1", text: "obX1" },
    { icon: "📍", title: "obT2", text: "obX2" },
    { icon: "🎧", title: "obT3", text: "obX3" },
    { icon: "◐", title: "obT4", text: "obX4" },
  ];
  function showOnboarding() {
    return new Promise(resolve => {
      let step = 0;
      const box = $("onboard");
      const render = () => {
        document.documentElement.lang = lang();
        const s = STEPS[step];
        $("ob-icon").textContent = s.icon;
        $("ob-title").textContent = t(s.title);
        $("ob-text").textContent = t(s.text);
        $("ob-dots").innerHTML = STEPS.map((_, k) => `<span class="${k === step ? "on" : ""}"></span>`).join("");
        $("ob-next").textContent = step < STEPS.length - 1 ? t("obNext") : t("obStart");
        $("ob-skip").textContent = t("obSkip");
        $("ob-skip").hidden = step === STEPS.length - 1;
        $("ob-head").textContent = t("howItWorks");
        box.querySelectorAll(".ob-lang button").forEach(b => b.setAttribute("aria-pressed", b.dataset.lang === lang()));
      };
      box.querySelector(".ob-lang").innerHTML = I.languages
        .map(l => `<button type="button" data-lang="${l.code}" lang="${l.code}">${l.short}</button>`).join("");
      box.querySelectorAll(".ob-lang button").forEach(b => { b.onclick = () => { saveStore({ lang: b.dataset.lang }); render(); }; });
      const finish = () => { box.hidden = true; saveStore({ onboarded: true }); resolve(); };
      $("ob-next").onclick = () => { if (step < STEPS.length - 1) { step++; render(); } else finish(); };
      $("ob-skip").onclick = finish;
      render();
      box.hidden = false;
      $("ob-next").focus();
    });
  }

  // ---------- Auswahl von Stadt und Tour ----------
  function showChooser() {
    return new Promise(resolve => {
      const box = $("chooser");
      box.hidden = false;
      document.documentElement.lang = lang();
      $("ch-title").textContent = t("chooseTitle");
      $("ch-sub").textContent = t("chooseSub");
      $("ch-help").textContent = t("howItWorks");
      $("ai-chooser").textContent = t("aiShort");
      $("ch-help").onclick = async () => { box.hidden = true; await showOnboarding(); box.hidden = false; render(list); };
      $("ch-list").innerHTML = `<p class="ch-note">${esc(t("chooseLoading"))}</p>`;
      let list = [builtinSummary()];
      let offline = false;

      const render = (items) => {
        const byCity = {};
        items.forEach(x => { (byCity[x.city] = byCity[x.city] || []).push(x); });
        const cities = Object.keys(byCity).sort((a, b) => a.localeCompare(b));
        $("ch-list").innerHTML = cities.map(city => `
          <section class="ch-city">
            <h2>${esc(city)} <small>${esc(byCity[city][0].country || "")}</small></h2>
            ${byCity[city].map(x => `
              <button type="button" class="ch-tour" data-id="${esc(x.id)}">
                <span class="ch-cover"${x.cover ? "" : ' data-empty="1"'}>${x.cover ? `<img src="${esc(x.cover)}" alt="" loading="lazy">` : "🎭"}</span>
                <span class="ch-info">
                  <strong>${esc(tr(x.title))}</strong>
                  <span>${esc(tr(x.subtitle))}</span>
                  <small>${esc(t("byInst", { name: x.institution }))} · ${esc(x.stops === 1 ? t("stopOne") : t("stopsCount", { n: x.stops }))}${x.places ? " · " + esc(x.places === 1 ? t("placeOne") : t("placesCount", { n: x.places })) : ""} · ${esc((x.languages || []).join(" · ").toUpperCase())}</small>
                </span>
              </button>`).join("")}
          </section>`).join("") + (offline ? `<p class="ch-note">${esc(t("chooseOffline"))}</p>` : "");
        $("ch-list").querySelectorAll(".ch-tour").forEach(b => {
          b.onclick = async () => {
            b.classList.add("loading");
            try {
              const T = await loadTour(b.dataset.id);
              saveStore({ tour: b.dataset.id });
              box.hidden = true;
              resolve(T);
            } catch (e) {
              b.classList.remove("loading");
              $("ch-error").textContent = t("chooseFailed");
              $("ch-error").hidden = false;
            }
          };
        });
      };
      render(list);
      fetchJSON("/api/tours", 5000)
        .then(remote => { list = [builtinSummary(), ...remote.map(x => ({ ...x, builtin: false }))]; render(list); })
        .catch(() => { offline = true; render(list); });
    });
  }

  async function resolveTour() {
    const params = new URLSearchParams(location.search);
    const st = store();
    if (!st.onboarded) await showOnboarding();
    const wanted = params.get("tour") || (params.has("choose") ? null : st.tour);
    if (wanted) {
      try {
        const T = await loadTour(wanted);
        saveStore({ tour: wanted });
        return T;
      } catch (e) { /* Tour nicht mehr verfügbar → Auswahl zeigen */ }
    }
    return showChooser();
  }

  // ---------- KI-Hinweis ----------
  function showAiNotice() {
    $("ai-title").textContent = t("aiTitle");
    $("ai-text").innerHTML = t("aiText").split("\n\n").map(p => `<p>${esc(p)}</p>`).join("");
    $("ai-close").textContent = t("aiClose");
    $("ai-modal").hidden = false;
    $("ai-close").focus({ preventScroll: true });
    document.querySelector(".ai-card").scrollTop = 0;
  }
  document.addEventListener("click", e => {
    if (e.target.closest("#ai-intro, #ai-chooser, #ai-menu")) showAiNotice();
    if (e.target.id === "ai-close" || e.target.id === "ai-modal") $("ai-modal").hidden = true;
  });
  document.addEventListener("keydown", e => { if (e.key === "Escape") $("ai-modal").hidden = true; });

  function chooseAnother() { location.href = location.pathname + "?choose=1"; }

  window.Boot = { resolveTour, showOnboarding, chooseAnother, showAiNotice, BUILTIN_ID };
})();
