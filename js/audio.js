/*
 * Audio-Player für die Stationen.
 *
 * Modus 1 – Datei: Wenn audio/<id>.mp3 existiert, wird die echte Aufnahme
 *                  (z. B. gesprochen von Ensemblemitgliedern) abgespielt.
 * Modus 2 – Sprachausgabe: Fehlt die Datei, liest die Sprachsynthese des
 *                  Geräts den Text satzweise vor. Satzweise, weil Pause/Resume
 *                  der Web Speech API auf vielen Mobilgeräten unzuverlässig ist.
 */
(function () {
  const CHARS_PER_SEC = 14; // grobe Schätzung für die Dauer der Sprachausgabe

  function fmt(sec) {
    if (!isFinite(sec) || sec < 0) sec = 0;
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return m + ":" + String(s).padStart(2, "0");
  }

  function splitParagraph(p) {
    return (p.replace(/\s+/g, " ").match(/[^.!?…]+[.!?…]+["“”„«»]?\s*|[^.!?…]+$/g) || [])
      .map(s => s.trim())
      .filter(Boolean);
  }

  /** Absätze -> Sätze. Liefert eine flache Liste (für die Wiedergabe). */
  function splitSentences(text) {
    return paragraphs(text).flat();
  }

  /** Liefert [[Satz, Satz], [Satz], …] – ein Array pro Absatz (für die Anzeige). */
  function paragraphs(text) {
    return text.split(/\n\s*\n/).map(splitParagraph).filter(p => p.length);
  }

  class StationAudio {
    constructor(lang) {
      this.lang = lang || "de-DE";
      this.rate = 1;
      this.mode = null;          // "file" | "tts"
      this.playing = false;
      this.listeners = { update: [], ended: [] };
      this.el = new Audio();
      this.el.preload = "metadata";
      this.el.addEventListener("timeupdate", () => this._emit());
      this.el.addEventListener("play", () => { this.playing = true; this._emit(); });
      this.el.addEventListener("pause", () => { this.playing = false; this._emit(); });
      this.el.addEventListener("ended", () => { this.playing = false; this._emit(); this._fire("ended"); });
      this.el.addEventListener("loadedmetadata", () => this._emit());
      this.tts = "speechSynthesis" in window ? window.speechSynthesis : null;
      this.voice = null;
      if (this.tts) {
        this._pickVoice();
        this.tts.addEventListener && this.tts.addEventListener("voiceschanged", () => this._pickVoice());
      }
    }

    _pickVoice() {
      if (!this.tts) return;
      const voices = this.tts.getVoices();
      const norm = l => (l || "").replace("_", "-").toLowerCase();
      const lang = norm(this.lang), base = lang.split("-")[0];
      this.voice =
        voices.find(v => norm(v.lang) === lang && /natural|neural|premium|enhanced/i.test(v.name)) ||
        voices.find(v => norm(v.lang) === lang) ||
        voices.find(v => norm(v.lang).startsWith(base)) || null;
    }

    /** Sprache der Sprachausgabe wechseln, z. B. "hu-HU" */
    setLang(lang) {
      this.lang = lang;
      this._pickVoice();
    }

    /** Gibt es auf dem Gerät eine Stimme für die aktuelle Sprache? (null = noch unbekannt) */
    hasVoice() {
      if (!this.tts) return false;
      if (!this.tts.getVoices().length) return null;
      return !!this.voice;
    }

    on(evt, cb) { this.listeners[evt].push(cb); }
    _fire(evt) { this.listeners[evt].forEach(cb => cb(this.state())); }
    _emit() { this._fire("update"); }

    /** Lädt eine Station. Prüft, ob die Audiodatei existiert, sonst Sprachausgabe. */
    load(station) {
      this.stop();
      this.station = station;
      this.sentences = splitSentences(station.text);
      this.sentenceDur = this.sentences.map(s => s.length / CHARS_PER_SEC);
      this.ttsTotal = this.sentenceDur.reduce((a, b) => a + b, 0);
      this.idx = 0;
      this.mode = "tts";
      this._emit();

      if (!station.audio) return Promise.resolve(this.mode);
      return new Promise(resolve => {
        const src = station.audio;
        const ok = () => { cleanup(); if (this.station === station) { this.mode = "file"; this._emit(); } resolve(this.mode); };
        const fail = () => { cleanup(); resolve(this.mode); };
        const cleanup = () => {
          this.el.removeEventListener("loadedmetadata", ok);
          this.el.removeEventListener("error", fail);
        };
        this.el.addEventListener("loadedmetadata", ok);
        this.el.addEventListener("error", fail);
        this.el.src = src;
        this.el.load();
      });
    }

    play() {
      if (this.mode === "file") {
        this.el.playbackRate = this.rate;
        this.el.play().catch(() => {});
        return;
      }
      if (!this.tts) return;
      if (this.idx >= this.sentences.length) this.idx = 0;
      this.playing = true;
      this._speakFrom(this.idx);
      this._emit();
    }

    _speakFrom(i) {
      this.tts.cancel();
      const token = (this._token = {});
      const speakNext = () => {
        if (token !== this._token || !this.playing) return;
        if (this.idx >= this.sentences.length) {
          this.playing = false;
          this._emit();
          this._fire("ended");
          return;
        }
        const u = new SpeechSynthesisUtterance(this.sentences[this.idx]);
        u.lang = this.lang;
        if (this.voice) u.voice = this.voice;
        u.rate = this.rate;
        u.onend = () => {
          if (token !== this._token) return;
          this.idx++;
          this._emit();
          speakNext();
        };
        u.onerror = u.onend;
        this.tts.speak(u);
      };
      this.idx = i;
      speakNext();
    }

    pause() {
      if (this.mode === "file") { this.el.pause(); return; }
      this.playing = false;
      this._token = null;
      if (this.tts) this.tts.cancel();
      this._emit();
    }

    toggle() { this.playing ? this.pause() : this.play(); }

    stop() {
      this.el.pause();
      this.el.removeAttribute("src");
      this.playing = false;
      this._token = null;
      if (this.tts) this.tts.cancel();
    }

    /** Springt zu einem Anteil 0..1 */
    seek(frac) {
      frac = Math.min(Math.max(frac, 0), 1);
      if (this.mode === "file") {
        if (isFinite(this.el.duration)) this.el.currentTime = frac * this.el.duration;
        return;
      }
      let t = frac * this.ttsTotal, i = 0;
      while (i < this.sentenceDur.length - 1 && t > this.sentenceDur[i]) { t -= this.sentenceDur[i]; i++; }
      this._jump(i);
    }

    back(sec) {
      if (this.mode === "file") { this.el.currentTime = Math.max(0, this.el.currentTime - sec); return; }
      let i = this.idx, acc = 0;
      while (i > 0 && acc < sec) { i--; acc += this.sentenceDur[i]; }
      this._jump(i);
    }

    _jump(i) {
      this.idx = i;
      if (this.playing) this._speakFrom(i); else this._emit();
    }

    cycleRate() {
      const rates = [1, 1.25, 1.5, 0.75];
      this.rate = rates[(rates.indexOf(this.rate) + 1) % rates.length];
      if (this.mode === "file") this.el.playbackRate = this.rate;
      else if (this.playing) this._speakFrom(this.idx);
      this._emit();
      return this.rate;
    }

    state() {
      if (this.mode === "file") {
        const d = this.el.duration, c = this.el.currentTime;
        return {
          mode: "file", playing: this.playing, rate: this.rate,
          progress: isFinite(d) && d > 0 ? c / d : 0,
          time: fmt(c) + (isFinite(d) ? " / " + fmt(d) : ""),
          sentence: -1
        };
      }
      const done = (this.sentenceDur || []).slice(0, this.idx || 0).reduce((a, b) => a + b, 0);
      return {
        mode: "tts", playing: this.playing, rate: this.rate,
        progress: this.ttsTotal ? done / this.ttsTotal : 0,
        time: "≈ " + fmt(done / this.rate) + " / " + fmt((this.ttsTotal || 0) / this.rate),
        sentence: this.playing ? this.idx : -1,
        available: !!this.tts
      };
    }
  }

  window.StationAudio = StationAudio;
  window.storyParagraphs = paragraphs;
})();
