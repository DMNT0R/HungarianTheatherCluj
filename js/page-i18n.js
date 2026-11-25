(function () {
  const I = window.I18N;
  const STORE_KEY = "theatre-city-map-v1";
  function getStore() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY) || "{}"); } catch (e) { return {}; }
  }
  function lang() {
    const saved = getStore().lang;
    if (I.strings[saved]) return saved;
    for (const value of navigator.languages || [navigator.language || ""]) {
      const code = (value || "").slice(0, 2).toLowerCase();
      if (I.strings[code]) return code;
    }
    return I.fallback;
  }
  function t(key, vars) {
    const code = lang();
    let value = (I.page && I.page[code] && I.page[code][key]) || (I.page && I.page.en && I.page.en[key]) || key;
    if (vars) value = value.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "");
    return value;
  }
  function tr(value) {
    if (value && typeof value === "object" && !Array.isArray(value)) return value[lang()] ?? value.en ?? value.hu ?? value.ro ?? "";
    return value ?? "";
  }
  function mount() {
    document.documentElement.lang = lang();
    document.documentElement.dir = (I.languages.find(l => l.code === lang()) || {}).dir || "ltr";
    document.querySelectorAll("[data-page-i18n]").forEach(el => { el.innerHTML = t(el.dataset.pageI18n); });
    document.querySelectorAll("[data-page-placeholder]").forEach(el => { el.placeholder = t(el.dataset.pagePlaceholder); });
    const box = document.getElementById("page-languages");
    if (box) {
      box.setAttribute("aria-label", (I.strings[lang()] || I.strings.en).chooseLang);
      box.innerHTML = I.languages.map(l => `<button type="button" lang="${l.code}" data-lang="${l.code}" aria-pressed="${l.code === lang()}"><img class="lang-flag" src="img/flags/${l.code}.svg" alt="" aria-hidden="true"><span>${l.label}</span></button>`).join("");
      box.querySelectorAll("button").forEach(button => {
        button.onclick = () => {
          try { localStorage.setItem(STORE_KEY, JSON.stringify({ ...getStore(), lang: button.dataset.lang })); } catch (e) { /* private browsing */ }
          location.reload();
        };
      });
    }
  }
  window.PageI18n = { lang, t, tr, mount };
  mount();
})();
