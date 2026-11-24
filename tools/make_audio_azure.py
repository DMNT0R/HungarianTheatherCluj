"""Erzeugt die Audiodateien der Tour mit Azure Speech (neuronale HD-Stimmen).

Zwei Stimmen pro Sprache: eine Erzählerin und ein Schauspieler, der die
wörtlichen Zitate spricht (z. B. Jantsós Ausruf, das Casablanca-Zitat).
Jeder Satz wird einzeln erzeugt, damit die App den gesprochenen Satz
hervorheben kann (Zeitmarken in audio/<lang>/<id>.json).

Aufruf (im Projektordner):
  node tools/export_sentences.js > /tmp/sentences.json
  AZURE_SPEECH_KEY=... python3 tools/make_audio_azure.py /tmp/sentences.json audio [--only=hu/03-farkas]

Kostenloser Tarif F0: 500.000 Zeichen/Monat, max. 20 Anfragen pro Minute –
das Skript wartet deshalb zwischen den Anfragen. Ein kompletter Lauf
(21 Dateien, ca. 40.000 Zeichen) dauert rund 15 Minuten.
"""
import io, json, os, re, subprocess, sys, time, urllib.request, urllib.error, wave
from xml.sax.saxutils import escape

REGION = os.environ.get("AZURE_SPEECH_REGION", "westeurope")
KEY = os.environ.get("AZURE_SPEECH_KEY", "proxy-injected")
URL = f"https://{REGION}.tts.speech.microsoft.com/cognitiveservices/v1"
RATE = 24000
MIN_INTERVAL = 3.2          # Sekunden zwischen Anfragen (F0: 20 pro Minute)
SENT_GAP, PARA_GAP = 0.25, 0.8
QUOTE_MIN = 36              # kürzere Anführungen (Werktitel) liest die Erzählerin

VOICES = {
    "en": {"locale": "en-GB", "narrator": "en-GB-Sonia:DragonHDLatestNeural", "actor": "en-GB-Ollie:DragonHDLatestNeural", "style": None},
    "hu": {"locale": "hu-HU", "narrator": "hu-HU-Harper:MAI-Voice-2.1", "actor": "hu-HU-Levente:MAI-Voice-2.1", "style": "audiobook"},
    "ro": {"locale": "ro-RO", "narrator": "ro-RO-Ioana:MAI-Voice-2.1", "actor": "ro-RO-Andrei:MAI-Voice-2.1", "style": None},
}
QUOTES = re.compile(r"[“„\"]([^“”„\"]+)[”\"]")

sent_file, out_dir = sys.argv[1], sys.argv[2]
only = next((a.split("=", 1)[1] for a in sys.argv[3:] if a.startswith("--only=")), None)
_last = [0.0]


def speakable(t):
    t = re.sub(r"[„“”\"«»]", "", t)
    t = t.replace("–", ",").replace("—", ",")
    return re.sub(r"\s*,\s*,", ",", t).strip()


def segments(paragraph_sentences):
    """Teilt jeden Satz in (Text, ist_Zitat)-Stücke; Zitate dürfen über Satzgrenzen gehen."""
    text = " ".join(paragraph_sentences)
    actor = [False] * len(text)
    for m in QUOTES.finditer(text):
        if len(m.group(1)) >= QUOTE_MIN:
            for i in range(m.start(), m.end()):
                actor[i] = True
    out, pos = [], 0
    for s in paragraph_sentences:
        start = text.index(s, pos)
        pos = start + len(s)
        pieces, cur, flag = [], "", None
        for i in range(start, pos):
            if flag is None or actor[i] == flag:
                cur += text[i]
            else:
                pieces.append((cur, flag)); cur = text[i]
            flag = actor[i]
        pieces.append((cur, flag))
        out.append([(speakable(p), f) for p, f in pieces if speakable(p).strip(" ,.")])
    return out


def ssml(lang, pieces):
    v = VOICES[lang]
    parts = []
    for text, is_actor in pieces:
        body = escape(text)
        if not is_actor and v["style"]:
            body = f"<mstts:express-as style='{v['style']}'>{body}</mstts:express-as>"
        parts.append(f"<voice name='{v['actor'] if is_actor else v['narrator']}'>{body}</voice>")
    return ("<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' "
            f"xmlns:mstts='https://www.w3.org/2001/mstts' xml:lang='{v['locale']}'>{''.join(parts)}</speak>")


def synth(doc):
    for attempt in range(6):
        wait = MIN_INTERVAL - (time.time() - _last[0])
        if wait > 0:
            time.sleep(wait)
        _last[0] = time.time()
        req = urllib.request.Request(URL, data=doc.encode("utf-8"), method="POST", headers={
            "Ocp-Apim-Subscription-Key": KEY,
            "Content-Type": "application/ssml+xml",
            "X-Microsoft-OutputFormat": "riff-24khz-16bit-mono-pcm",
            "User-Agent": "ioi-cluj-audio",
        })
        try:
            with urllib.request.urlopen(req, timeout=120) as r:
                with wave.open(io.BytesIO(r.read())) as w:
                    return w.readframes(w.getnframes())
        except urllib.error.HTTPError as e:
            if e.code in (429, 500, 502, 503) and attempt < 5:
                time.sleep(15 * (attempt + 1)); continue
            raise RuntimeError(f"HTTP {e.code}: {e.read()[:200]!r}")
    raise RuntimeError("giving up")


data = json.load(open(sent_file, encoding="utf-8"))
chars = 0
for lang, stations in data.items():
    os.makedirs(os.path.join(out_dir, lang), exist_ok=True)
    for sid, paragraphs in stations.items():
        if only and only != f"{lang}/{sid}":
            continue
        pcm, starts = bytearray(), []
        for para in paragraphs:
            for si, pieces in enumerate(segments(para)):
                starts.append(round(len(pcm) / 2 / RATE, 2))
                doc = ssml(lang, pieces)
                chars += sum(len(p) for p, _ in pieces)
                pcm += synth(doc)
                pcm += b"\x00\x00" * int(RATE * (PARA_GAP if si == len(para) - 1 else SENT_GAP))
        wav_path = os.path.join(out_dir, lang, sid + ".wav")
        with wave.open(wav_path, "wb") as w:
            w.setnchannels(1); w.setsampwidth(2); w.setframerate(RATE); w.writeframes(bytes(pcm))
        mp3_path = os.path.join(out_dir, lang, sid + ".mp3")
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", wav_path,
                        "-af", "loudnorm=I=-16:TP=-1.5:LRA=11",
                        "-ac", "1", "-ar", "24000", "-b:a", "64k", mp3_path], check=True)
        os.remove(wav_path)
        dur = round(len(pcm) / 2 / RATE, 2)
        voices = VOICES[lang]
        json.dump({"voice": voices["narrator"], "actor": voices["actor"], "duration": dur, "sentences": starts},
                  open(os.path.join(out_dir, lang, sid + ".json"), "w"))
        print(f"{lang}/{sid}: {dur:.0f}s, {len(starts)} sentences, {os.path.getsize(mp3_path)//1024} KB", flush=True)
print("characters sent:", chars)
