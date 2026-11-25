/* Admin: Institute freischalten/sperren, Touren verbergen. */
(function () {
  const $ = id => document.getElementById(id);
  const esc = x => String(x ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const t = (key, vars) => window.PageI18n.t(key, vars);
  const tr = v => window.PageI18n.tr(v);
  const date = s => s ? new Date(s).toLocaleDateString(window.PageI18n.lang()) : "";
  let toastTimer;
  function toast(m) { const el = $("toast"); el.textContent = m; el.classList.add("show"); clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove("show"), 2500); }
  const errorKeys = {
    server_not_configured: "adminPasswordMissing", wrong_credentials: "wrongPassword",
    weak_password: "errorWeakPassword", email_exists: "errorEmailExists", invalid_email: "errorInvalidEmail",
    pending: "errorPending", not_approved: "errorNotApproved", missing_stops: "errorMissingStops",
    missing_languages: "errorMissingLanguages", missing_tour_title: "errorMissingTourTitle",
    missing_city: "errorMissingCity", unsupported_type: "errorUnsupportedType",
    file_too_large: "errorFileTooLarge", invalid_website: "errorInvalidWebsite",
    not_logged_in: "errorNotLoggedIn"
  };
  const errorText = error => t(errorKeys[error] || "errorGeneric", { error });
  async function api(method, path, data) {
    const r = await fetch(path, { method, credentials: "same-origin", headers: { "x-ioi": "1", "content-type": "application/json" }, body: data === undefined ? undefined : JSON.stringify(data) });
    let b = null; try { b = await r.json(); } catch (e) { /* leer */ }
    if (!r.ok) throw new Error((b && b.error) || "http_" + r.status);
    return b;
  }
  const STATUS = {
    pending: "statusPending", approved: "statusApproved", rejected: "statusRejected", suspended: "statusSuspended",
    published: "statusPublished", draft: "statusDraft"
  };
  const statusText = status => STATUS[status] ? t(STATUS[status]) : status;

  async function load() {
    const [insts, tours] = await Promise.all([api("GET", "/api/admin/institutions"), api("GET", "/api/admin/tours")]);
    const pending = insts.filter(i => i.status === "pending");
    $("admin-pending").innerHTML = pending.length ? pending.map(i => `
      <article class="pt-card">
        <h2>${esc(i.name)} <span class="pill pending">${esc(i.type)}</span></h2>
        <p>${esc(i.city)}${i.country ? ", " + esc(i.country) : ""}${i.address ? " · " + esc(i.address) : ""}</p>
        <p>${esc(i.contact_name)} · <a href="mailto:${esc(i.email)}">${esc(i.email)}</a>${i.phone ? " · " + esc(i.phone) : ""}${i.website ? ` · <a href="${esc(i.website)}" target="_blank" rel="noopener noreferrer">${esc(i.website)}</a>` : ""}</p>
        ${i.description ? `<p class="pt-quote">${esc(i.description)}</p>` : ""}
        <p class="pt-small">${esc(t("appliedOn", { date: date(i.created_at) }))}</p>
        <div class="pt-actions">
          <button class="btn btn-primary" data-status="approved" data-id="${esc(i.id)}" type="button">${esc(t("approve"))}</button>
          <button class="btn btn-ghost danger" data-status="rejected" data-id="${esc(i.id)}" type="button">${esc(t("reject"))}</button>
        </div>
      </article>`).join("") : `<p class="pt-card pt-small">${esc(t("noOpenApplications"))}</p>`;
    $("admin-inst").innerHTML = `<thead><tr><th>${esc(t("institution"))}</th><th>${esc(t("city"))}</th><th>${esc(t("contact"))}</th><th>${esc(t("tours"))}</th><th>${esc(t("status"))}</th><th></th></tr></thead><tbody>` +
      insts.map(i => `<tr>
        <td><strong>${esc(i.name)}</strong><br><small>${esc(i.type)}</small></td>
        <td>${esc(i.city)}</td>
        <td>${esc(i.contact_name)}<br><small>${esc(i.email)}</small></td>
        <td>${i.tours}</td>
        <td><span class="pill ${esc(i.status)}">${esc(statusText(i.status))}</span></td>
        <td class="pt-actions">${i.status === "approved"
          ? `<button class="btn btn-ghost danger" data-status="suspended" data-id="${esc(i.id)}" type="button">${esc(t("suspend"))}</button>`
          : `<button class="btn btn-ghost" data-status="approved" data-id="${esc(i.id)}" type="button">${esc(t("approve"))}</button>`}</td>
      </tr>`).join("") + "</tbody>";
    $("admin-tours").innerHTML = `<thead><tr><th>${esc(t("tour"))}</th><th>${esc(t("institution"))}</th><th>${esc(t("city"))}</th><th>${esc(t("stops"))}</th><th>${esc(t("status"))}</th><th></th></tr></thead><tbody>` +
      (tours.map(t => `<tr>
        <td><strong>${esc(tr(t.title))}</strong><br><small>${esc(window.PageI18n.t("updatedOn", { date: date(t.updated_at) }))}</small></td>
        <td>${esc(t.institution)}</td><td>${esc(t.city)}</td><td>${t.stops}</td>
        <td><span class="pill ${t.blocked ? "blocked" : esc(t.status)}">${t.blocked ? esc(window.PageI18n.t("hidden")) : esc(statusText(t.status))}</span></td>
        <td class="pt-actions">
          ${t.status === "published" && !t.blocked ? `<a class="btn btn-ghost" href="./?tour=${encodeURIComponent(t.id)}" target="_blank" rel="noopener">${esc(window.PageI18n.t("openApp"))} ↗</a>` : ""}
          <button class="btn btn-ghost ${t.blocked ? "" : "danger"}" data-block="${esc(t.id)}" data-to="${t.blocked ? 0 : 1}" type="button">${esc(window.PageI18n.t(t.blocked ? "showAgain" : "hide"))}</button>
        </td></tr>`).join("") || `<tr><td colspan="6" class="pt-small">${esc(window.PageI18n.t("noToursYet"))}</td></tr>`) + "</tbody>";
    document.querySelectorAll("[data-status]").forEach(b => {
      b.onclick = async () => {
        if (b.dataset.status !== "approved" && !confirm(window.PageI18n.t("confirmStatus", { status: statusText(b.dataset.status) }))) return;
        await api("POST", `/api/admin/institutions/${b.dataset.id}/status`, { status: b.dataset.status });
        toast(window.PageI18n.t("saved")); load();
      };
    });
    document.querySelectorAll("[data-block]").forEach(b => {
      b.onclick = async () => { await api("POST", `/api/admin/tours/${b.dataset.block}/blocked`, { blocked: b.dataset.to === "1" }); toast(window.PageI18n.t("saved")); load(); };
    });
  }

  // Eingebaute Tour (aus js/stations.js, liegt nicht in der Datenbank)
  function renderBuiltin() {
    const T = window.TOUR;
    if (!T || !$("admin-builtin")) return;
    const S = T.stations || [], P = T.places || [];
    const LANGS = ((window.I18N && window.I18N.languages) || [{ code: "en" }, { code: "hu" }, { code: "ro" }]).map(l => l.code);
    const KIND = { cafe: "☕", restaurant: "🍽️", shop: "🛍️", museum: "🏛️", institution: "📚", other: "📍" };
    const osm = c => `https://www.openstreetmap.org/?mlat=${c[0]}&mlon=${c[1]}#map=18/${c[0]}/${c[1]}`;
    $("admin-builtin").innerHTML = `
      <article class="pt-card">
        <div class="pt-row">
          <h2>${esc(tr(T.title))} <span class="pill published">built-in</span></h2>
          <a class="btn btn-ghost" href="./?tour=cluj-theatre" target="_blank" rel="noopener">Open ↗</a>
        </div>
        <p>${esc(tr(T.subtitle))}<br><small class="pt-small">${esc(tr(T.organizer))} · Cluj-Napoca · ${S.length} stops · ${P.length} places · EN / HU / RO</small></p>
        <p class="pt-small">This tour is part of the app code (<code>js/stations.js</code>, audio in <code>audio/&lt;lang&gt;/</code>), so it is shown here read-only and cannot be hidden. Audio: AI voices (Azure). To use your own voice recordings later, replace <code>audio/&lt;lang&gt;/&lt;stop&gt;.mp3</code> under the same name and delete the matching <code>.json</code> (its sentence timings would no longer fit).</p>
        <details class="pt-item"><summary>Stops (${S.length})</summary>
          ${S.map((s, i) => `
            <div class="pt-stop">
              <p><strong>${i + 1}. ${esc(tr(s.title))}</strong> <small class="pt-small">${esc(s.year || "")}</small>
                ${s.optional ? ` <span class="pill">optional</span>` : ""}
                ${s.draftLocation ? ` <span class="pill pending">location to confirm</span>` : ""}<br>
                <small class="pt-small">${esc(tr(s.address))} · <a href="${osm(s.coords)}" target="_blank" rel="noopener noreferrer">${s.coords.join(", ")}</a> ·
                ${(s.media || []).length} archive pictures · ${s.rephoto ? s.rephoto.images.length : 0} then/now</small></p>
              ${LANGS.map(l => `<div class="pt-media-row"><span class="pill">${l.toUpperCase()}</span> <small class="pt-small">${esc((s.title && s.title[l]) || "")}</small>
                <audio controls preload="none" src="audio/${l}/${encodeURIComponent(s.id)}.mp3"></audio></div>`).join("")}
            </div>`).join("")}
        </details>
        <details class="pt-item"><summary>Places (${P.length})</summary>
          ${P.map(p => `<div class="pt-media-row"><span>${KIND[p.kind] || "📍"}</span> <strong>${esc(tr(p.title))}</strong>
            ${p.partner ? `<span class="pill approved">tour partner</span>` : ""}
            <small class="pt-small">${esc(tr(p.address))}${p.website ? ` · <a href="${esc(p.website)}" target="_blank" rel="noopener noreferrer">website</a>` : ""}</small></div>`).join("")}
        </details>
      </article>`;
  }

  $("admin-login").onsubmit = async e => {
    e.preventDefault();
    const msg = e.target.querySelector("[data-msg]");
    msg.textContent = "";
    try { await api("POST", "/api/admin/login", { password: e.target.password.value }); start(); }
    catch (err) {
      msg.textContent = errorText(err.message);
      msg.className = "pt-msg err";
    }
  };
  $("admin-logout").onclick = async () => { await api("POST", "/api/logout"); location.reload(); };

  async function start() {
    const me = await api("GET", "/api/me").catch(() => ({ role: null }));
    const isAdmin = me.role === "admin";
    $("admin-login").hidden = isAdmin;
    $("admin-main").hidden = !isAdmin;
    $("admin-user").hidden = !isAdmin;
    if (isAdmin) { renderBuiltin(); load().catch(e => toast(errorText(e.message))); }
  }
  start();
})();
