"""Erzeugt die Audiodateien der Tour mit Piper (Satz für Satz) plus Satz-Zeitmarken.

Aufruf (normalerweise über tools/make_audio.sh): python make_audio.py <sentences.json> <voices-dir> <audio-out-dir> [lang=voice ...] [--only lang/id]
"""
import json, re, subprocess, sys, wave, io, os
from piper import PiperVoice, SynthesisConfig

sent_file, voice_dir, out_dir = sys.argv[1:4]
args = sys.argv[4:]
only = None
voices = {"en": "en_GB-cori-high", "hu": "hu_HU-berta-medium", "ro": "ro_RO-mihai-medium"}
for a in args:
    if a.startswith("--only="):
        only = a.split("=", 1)[1]
    elif "=" in a:
        k, v = a.split("=", 1)
        voices[k] = v

SENT_GAP = 0.35   # Pause zwischen Sätzen (s)
PARA_GAP = 0.9    # Pause zwischen Absätzen (s)


def speakable(t):
    """Text für die Sprachausgabe glätten (Anzeige bleibt unverändert)."""
    t = re.sub(r"[„“”\"«»]", "", t)          # Anführungszeichen nicht vorlesen
    t = t.replace("–", ",").replace("—", ",")   # Gedankenstrich = kurze Pause
    t = re.sub(r"\s*,\s*,", ",", t)
    return t.strip()


data = json.load(open(sent_file, encoding="utf-8"))
loaded = {}
for lang, stations in data.items():
    vname = voices[lang]
    if vname not in loaded:
        loaded[vname] = PiperVoice.load(os.path.join(voice_dir, vname + ".onnx"))
    voice = loaded[vname]
    rate = voice.config.sample_rate
    cfg = SynthesisConfig(length_scale=1.08)  # etwas ruhigeres Tempo
    os.makedirs(os.path.join(out_dir, lang), exist_ok=True)
    for sid, paragraphs in stations.items():
        if only and only != f"{lang}/{sid}":
            continue
        pcm = bytearray()
        starts = []
        for pi, para in enumerate(paragraphs):
            for si, sentence in enumerate(para):
                starts.append(round(len(pcm) / 2 / rate, 2))
                for chunk in voice.synthesize(speakable(sentence), syn_config=cfg):
                    pcm += chunk.audio_int16_bytes
                gap = PARA_GAP if si == len(para) - 1 else SENT_GAP
                pcm += b"\x00\x00" * int(rate * gap)
        wav_path = os.path.join(out_dir, lang, sid + ".wav")
        with wave.open(wav_path, "wb") as w:
            w.setnchannels(1); w.setsampwidth(2); w.setframerate(rate); w.writeframes(bytes(pcm))
        mp3_path = os.path.join(out_dir, lang, sid + ".mp3")
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", wav_path,
                        "-af", "loudnorm=I=-16:TP=-1.5:LRA=11",
                        "-ac", "1", "-ar", "24000", "-b:a", "64k", mp3_path], check=True)
        os.remove(wav_path)
        dur = round(len(pcm) / 2 / rate, 2)
        json.dump({"voice": vname, "duration": dur, "sentences": starts},
                  open(os.path.join(out_dir, lang, sid + ".json"), "w"))
        print(f"{lang}/{sid}: {dur:.0f}s, {len(starts)} sentences, {os.path.getsize(mp3_path)//1024} KB, voice {vname}", flush=True)
