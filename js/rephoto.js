/*
 * „Damals & Heute“: historisches Bild live über das Kamerabild legen.
 *
 *  - Überblenden: Deckkraft des alten Bildes per Regler
 *  - Wischen: Trennlinie, links damals – rechts heute
 *  - Ausrichten: ein Finger verschiebt, zwei Finger zoomen (Mausrad am Rechner)
 *  - Auslöser: speichert Kamera + Überlagerung als ein Bild zum Teilen
 *  - Ohne Kamera (abgelehnt, nicht vorhanden): Foto aufnehmen/auswählen und
 *    das alte Bild darüberlegen
 *
 * Die historischen Bilder müssen von derselben Domain kommen, sonst darf das
 * kombinierte Foto nicht gespeichert werden (Canvas-Sicherheitsregel).
 */
(function () {
  const $ = id => document.getElementById(id);
  const S = {
    images: [], idx: 0, mode: "blend", value: 55,
    tx: 0, ty: 0, scale: 1,
    stream: null, stillUrl: null, resultBlob: null, resultUrl: null,
    ctx: null, pointers: new Map(), gesture: null
  };

  function applyTransform() {
    const img = $("rp-img");
    img.style.transform = `translate(${S.tx}px, ${S.ty}px) scale(${S.scale})`;
    const layer = $("rp-layer");
    if (S.mode === "blend") {
      img.style.opacity = S.value / 100;
      layer.style.clipPath = "none";
      $("rp-divider").hidden = true;
    } else {
      img.style.opacity = 1;
      layer.style.clipPath = `inset(0 ${100 - S.value}% 0 0)`;
      $("rp-divider").hidden = false;
      $("rp-divider").style.left = S.value + "%";
    }
    $("rp-mode-blend").setAttribute("aria-pressed", S.mode === "blend");
    $("rp-mode-swipe").setAttribute("aria-pressed", S.mode === "swipe");
  }

  function resetTransform() { S.tx = 0; S.ty = 0; S.scale = 1; applyTransform(); }

  function showImage(i) {
    const { tr, esc, credits } = S.ctx;
    S.idx = i;
    const im = S.images[i];
    $("rp-img").src = im.src;
    $("rp-img").alt = tr(im.caption);
    $("rp-caption").textContent = tr(im.caption);
    $("rp-year").textContent = im.year || "";
    $("rp-credit").textContent = credits && credits[im.credit] ? "© " + tr(credits[im.credit]) : "";
    $("rp-thumbs").querySelectorAll("button").forEach((b, k) => b.setAttribute("aria-pressed", k === i));
    resetTransform();
  }

  // ---------- Kamera ----------
  async function startCamera() {
    const { t } = S.ctx;
    hideMsg();
    if (!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) return showMsg(t("rpNoCamera"));
    try {
      S.stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" }, width: { ideal: 1920 }, height: { ideal: 1080 } },
        audio: false
      });
      const v = $("rp-video");
      v.srcObject = S.stream;
      v.hidden = false;
      await v.play().catch(() => {});
    } catch (e) {
      showMsg(t("rpNoCamera"));
    }
  }
  function stopCamera() {
    if (S.stream) S.stream.getTracks().forEach(tr => tr.stop());
    S.stream = null;
    $("rp-video").srcObject = null;
  }
  function showMsg(text) { $("rp-msg-text").textContent = text; $("rp-msg").hidden = false; }
  function hideMsg() { $("rp-msg").hidden = true; }

  // Ersatz ohne Live-Kamera: ein normales Foto als Hintergrund
  function useStill(file) {
    if (!file) return;
    if (S.stillUrl) URL.revokeObjectURL(S.stillUrl);
    S.stillUrl = URL.createObjectURL(file);
    stopCamera();
    $("rp-video").hidden = true;
    $("rp-still").src = S.stillUrl;
    $("rp-still").hidden = false;
    hideMsg();
  }

  // ---------- Gesten: verschieben & zoomen ----------
  function onDown(e) {
    S.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    e.currentTarget.setPointerCapture(e.pointerId);
    startGesture();
  }
  function startGesture() {
    const pts = [...S.pointers.values()];
    if (pts.length === 1) S.gesture = { type: "pan", x: pts[0].x, y: pts[0].y, tx: S.tx, ty: S.ty };
    else if (pts.length >= 2) {
      const [a, b] = pts;
      S.gesture = { type: "pinch", d: Math.hypot(a.x - b.x, a.y - b.y), mx: (a.x + b.x) / 2, my: (a.y + b.y) / 2, tx: S.tx, ty: S.ty, scale: S.scale };
    }
  }
  function onMove(e) {
    if (!S.pointers.has(e.pointerId)) return;
    S.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const g = S.gesture, pts = [...S.pointers.values()];
    if (!g) return;
    if (g.type === "pan" && pts.length === 1) {
      S.tx = g.tx + pts[0].x - g.x;
      S.ty = g.ty + pts[0].y - g.y;
    } else if (g.type === "pinch" && pts.length >= 2) {
      const [a, b] = pts;
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      S.scale = Math.min(6, Math.max(0.3, g.scale * d / g.d));
      S.tx = g.tx + (a.x + b.x) / 2 - g.mx;
      S.ty = g.ty + (a.y + b.y) / 2 - g.my;
    }
    applyTransform();
  }
  function onUp(e) {
    S.pointers.delete(e.pointerId);
    startGesture();
    if (!S.pointers.size) S.gesture = null;
  }
  function onWheel(e) {
    e.preventDefault();
    S.scale = Math.min(6, Math.max(0.3, S.scale * (e.deltaY < 0 ? 1.08 : 1 / 1.08)));
    applyTransform();
  }

  // ---------- Foto aufnehmen ----------
  function drawCover(ctx, src, sw, sh, W, H) {
    const k = Math.max(W / sw, H / sh);
    const dw = sw * k, dh = sh * k;
    ctx.drawImage(src, (W - dw) / 2, (H - dh) / 2, dw, dh);
  }
  function capture() {
    const { tr, t } = S.ctx;
    const root = $("rp").getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = Math.round(root.width * dpr), H = Math.round(root.height * dpr);
    const c = document.createElement("canvas");
    c.width = W; c.height = H;
    const ctx = c.getContext("2d");
    ctx.fillStyle = "#111"; ctx.fillRect(0, 0, W, H);

    const v = $("rp-video"), still = $("rp-still");
    if (!v.hidden && v.videoWidth) drawCover(ctx, v, v.videoWidth, v.videoHeight, W, H);
    else if (!still.hidden && still.naturalWidth) drawCover(ctx, still, still.naturalWidth, still.naturalHeight, W, H);

    const img = $("rp-img");
    const r = img.getBoundingClientRect();
    ctx.save();
    if (S.mode === "swipe") {
      ctx.beginPath(); ctx.rect(0, 0, W * S.value / 100, H); ctx.clip();
    } else {
      ctx.globalAlpha = S.value / 100;
    }
    ctx.drawImage(img, (r.left - root.left) * dpr, (r.top - root.top) * dpr, r.width * dpr, r.height * dpr);
    ctx.restore();
    if (S.mode === "swipe") {
      ctx.fillStyle = "#fff"; ctx.fillRect(W * S.value / 100 - dpr, 0, 2 * dpr, H);
    }

    // kleine Beschriftung unten
    const im = S.images[S.idx];
    const label = `Ioi!Cluj · ${tr(im.caption)}${im.year ? " · " + im.year : ""}`;
    const fs = Math.round(14 * dpr);
    ctx.font = `600 ${fs}px system-ui, sans-serif`;
    const pad = 8 * dpr, tw = ctx.measureText(label).width;
    ctx.fillStyle = "rgba(0,0,0,.55)";
    ctx.fillRect(pad, H - fs - 3 * pad, tw + 2 * pad, fs + 2 * pad);
    ctx.fillStyle = "#fff";
    ctx.fillText(label, 2 * pad, H - 2 * pad - fs * 0.15);

    try {
      c.toBlob(blob => {
        if (!blob) return;
        if (S.resultUrl) URL.revokeObjectURL(S.resultUrl);
        S.resultBlob = blob;
        S.resultUrl = URL.createObjectURL(blob);
        $("rp-result-img").src = S.resultUrl;
        $("rp-result").hidden = false;
      }, "image/jpeg", 0.9);
    } catch (e) {
      showMsg(t("rpNoCamera"));
    }
  }
  async function share() {
    const { t } = S.ctx;
    if (!S.resultBlob) return;
    const file = new File([S.resultBlob], "ioi-cluj-then-and-now.jpg", { type: "image/jpeg" });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try { await navigator.share({ files: [file], text: t("rpShareText") }); } catch (e) { /* abgebrochen */ }
    } else {
      const a = document.createElement("a");
      a.href = S.resultUrl; a.download = file.name; a.click();
    }
  }

  // ---------- Öffnen / Schließen ----------
  function open(station, ctx) {
    S.ctx = ctx;
    const { tr, t, esc } = ctx;
    S.images = station.rephoto.images;
    S.mode = "blend"; S.value = 55;
    $("rp-slider").value = S.value;
    $("rp-hint").textContent = tr(station.rephoto.hint) + " " + t("rpAlign");
    $("rp-hint").hidden = false;
    $("rp-thumbs").innerHTML = S.images.length > 1
      ? S.images.map((im, k) => `<button type="button" data-k="${k}" aria-label="${esc(tr(im.caption))}"><img src="${esc(im.src)}" alt=""><span>${esc(im.year || "")}</span></button>`).join("")
      : "";
    $("rp-thumbs").querySelectorAll("button").forEach(b => { b.onclick = () => showImage(+b.dataset.k); });
    $("rp-mode-blend").textContent = t("rpBlend");
    $("rp-mode-swipe").textContent = t("rpSwipe");
    $("rp-reset").textContent = t("rpReset");
    $("rp-photo-btn").textContent = t("rpUsePhoto");
    $("rp-back").textContent = t("rpBack");
    $("rp-share").textContent = t("share");
    $("rp-shutter").setAttribute("aria-label", t("rpCapture"));
    $("rp-slider").setAttribute("aria-label", t("rpBlend"));
    $("rp-close").setAttribute("aria-label", t("aClose"));
    $("rp-still").hidden = true;
    $("rp-result").hidden = true;
    showImage(0);
    $("rp").hidden = false;
    document.body.classList.add("rp-open");
    startCamera();
    setTimeout(() => { $("rp-hint").hidden = true; }, 9000);
  }
  function close() {
    stopCamera();
    $("rp").hidden = true;
    document.body.classList.remove("rp-open");
    if (S.stillUrl) { URL.revokeObjectURL(S.stillUrl); S.stillUrl = null; }
    if (S.resultUrl) { URL.revokeObjectURL(S.resultUrl); S.resultUrl = null; }
    S.resultBlob = null;
    S.pointers.clear();
  }

  function init() {
    $("rp-close").onclick = close;
    $("rp-slider").oninput = e => { S.value = +e.target.value; applyTransform(); };
    $("rp-mode-blend").onclick = () => { S.mode = "blend"; applyTransform(); };
    $("rp-mode-swipe").onclick = () => { S.mode = "swipe"; S.value = 50; $("rp-slider").value = 50; applyTransform(); };
    $("rp-reset").onclick = resetTransform;
    $("rp-shutter").onclick = capture;
    $("rp-share").onclick = share;
    $("rp-back").onclick = () => { $("rp-result").hidden = true; };
    $("rp-photo-btn").onclick = () => $("rp-file").click();
    $("rp-file").onchange = e => useStill(e.target.files && e.target.files[0]);
    $("rp-hint").onclick = () => { $("rp-hint").hidden = true; };
    const layer = $("rp-gestures");
    layer.addEventListener("pointerdown", onDown);
    layer.addEventListener("pointermove", onMove);
    layer.addEventListener("pointerup", onUp);
    layer.addEventListener("pointercancel", onUp);
    layer.addEventListener("wheel", onWheel, { passive: false });
    document.addEventListener("keydown", e => { if (e.key === "Escape" && !$("rp").hidden) close(); });
    document.addEventListener("visibilitychange", () => {
      // Kamera freigeben, wenn die App in den Hintergrund geht; danach neu starten
      if ($("rp").hidden || !$("rp-still").hidden) return;
      if (document.hidden) stopCamera(); else startCamera();
    });
  }

  window.Rephoto = { open, close, init, isOpen: () => !$("rp").hidden };
})();
