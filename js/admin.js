/* Admin: Institute freischalten/sperren, Touren verbergen. */
(function () {
  const $ = id => document.getElementById(id);
  const esc = x => String(x ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const tr = v => (v && (v.en || v.hu || v.ro)) || "";
  const date = s => s ? new Date(s).toLocaleDateString() : "";
  let toastTimer;
  function toast(m) { const el = $("toast"); el.textContent = m; el.classList.add("show"); clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove("show"), 2500); }
  async function api(method, path, data) {
    const r = await fetch(path, { method, credentials: "same-origin", headers: { "x-ioi": "1", "content-type": "application/json" }, body: data === undefined ? undefined : JSON.stringify(data) });
    let b = null; try { b = await r.json(); } catch (e) { /* leer */ }
    if (!r.ok) throw new Error((b && b.error) || "http_" + r.status);
    return b;
  }
  const STATUS = { pending: "pending", approved: "approved", rejected: "rejected", suspended: "suspended" };

  async function load() {
    const [insts, tours] = await Promise.all([api("GET", "/api/admin/institutions"), api("GET", "/api/admin/tours")]);
    const pending = insts.filter(i => i.status === "pending");
    $("ad-pending").innerHTML = pending.length ? pending.map(i => `
      <article class="pt-card">
        <h2>${esc(i.name)} <span class="pill pending">${esc(i.type)}</span></h2>
        <p>${esc(i.city)}${i.country ? ", " + esc(i.country) : ""}${i.address ? " · " + esc(i.address) : ""}</p>
        <p>${esc(i.contact_name)} · <a href="mailto:${esc(i.email)}">${esc(i.email)}</a>${i.phone ? " · " + esc(i.phone) : ""}${i.website ? ` · <a href="${esc(i.website)}" target="_blank" rel="noopener noreferrer">${esc(i.website)}</a>` : ""}</p>
        ${i.description ? `<p class="pt-quote">${esc(i.description)}</p>` : ""}
        <p class="pt-small">Applied ${date(i.created_at)}</p>
        <div class="pt-actions">
          <button class="btn btn-primary" data-status="approved" data-id="${esc(i.id)}" type="button">Approve</button>
          <button class="btn btn-ghost danger" data-status="rejected" data-id="${esc(i.id)}" type="button">Reject</button>
        </div>
      </article>`).join("") : `<p class="pt-card pt-small">No open applications.</p>`;
    $("ad-inst").innerHTML = `<thead><tr><th>Institution</th><th>City</th><th>Contact</th><th>Tours</th><th>Status</th><th></th></tr></thead><tbody>` +
      insts.map(i => `<tr>
        <td><strong>${esc(i.name)}</strong><br><small>${esc(i.type)}</small></td>
        <td>${esc(i.city)}</td>
        <td>${esc(i.contact_name)}<br><small>${esc(i.email)}</small></td>
        <td>${i.tours}</td>
        <td><span class="pill ${esc(i.status)}">${esc(STATUS[i.status] || i.status)}</span></td>
        <td class="pt-actions">${i.status === "approved"
          ? `<button class="btn btn-ghost danger" data-status="suspended" data-id="${esc(i.id)}" type="button">Suspend</button>`
          : `<button class="btn btn-ghost" data-status="approved" data-id="${esc(i.id)}" type="button">Approve</button>`}</td>
      </tr>`).join("") + "</tbody>";
    $("ad-tours").innerHTML = `<thead><tr><th>Tour</th><th>Institution</th><th>City</th><th>Stops</th><th>Status</th><th></th></tr></thead><tbody>` +
      (tours.map(t => `<tr>
        <td><strong>${esc(tr(t.title))}</strong><br><small>updated ${date(t.updated_at)}</small></td>
        <td>${esc(t.institution)}</td><td>${esc(t.city)}</td><td>${t.stops}</td>
        <td><span class="pill ${t.blocked ? "blocked" : esc(t.status)}">${t.blocked ? "hidden" : esc(t.status)}</span></td>
        <td class="pt-actions">
          ${t.status === "published" && !t.blocked ? `<a class="btn btn-ghost" href="./?tour=${encodeURIComponent(t.id)}" target="_blank" rel="noopener">Open ↗</a>` : ""}
          <button class="btn btn-ghost ${t.blocked ? "" : "danger"}" data-block="${esc(t.id)}" data-to="${t.blocked ? 0 : 1}" type="button">${t.blocked ? "Show again" : "Hide"}</button>
        </td></tr>`).join("") || `<tr><td colspan="6" class="pt-small">No tours yet.</td></tr>`) + "</tbody>";
    document.querySelectorAll("[data-status]").forEach(b => {
      b.onclick = async () => {
        if (b.dataset.status !== "approved" && !confirm(`Set status to “${b.dataset.status}”?`)) return;
        await api("POST", `/api/admin/institutions/${b.dataset.id}/status`, { status: b.dataset.status });
        toast("Saved."); load();
      };
    });
    document.querySelectorAll("[data-block]").forEach(b => {
      b.onclick = async () => { await api("POST", `/api/admin/tours/${b.dataset.block}/blocked`, { blocked: b.dataset.to === "1" }); toast("Saved."); load(); };
    });
  }

  $("ad-login").onsubmit = async e => {
    e.preventDefault();
    const msg = e.target.querySelector("[data-msg]");
    msg.textContent = "";
    try { await api("POST", "/api/admin/login", { password: e.target.password.value }); start(); }
    catch (err) {
      msg.textContent = err.message === "server_not_configured" ? "ADMIN_PASSWORD is not set on the server yet." : "Wrong password.";
      msg.className = "pt-msg err";
    }
  };
  $("ad-logout").onclick = async () => { await api("POST", "/api/logout"); location.reload(); };

  async function start() {
    const me = await api("GET", "/api/me").catch(() => ({ role: null }));
    const isAdmin = me.role === "admin";
    $("ad-login").hidden = isAdmin;
    $("ad-main").hidden = !isAdmin;
    $("ad-user").hidden = !isAdmin;
    if (isAdmin) load().catch(e => toast(e.message));
  }
  start();
})();
