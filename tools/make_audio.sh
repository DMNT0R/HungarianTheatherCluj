#!/usr/bin/env bash
# Erzeugt alle Audiodateien der Tour neu (Piper, Open Source, läuft lokal).
# Voraussetzungen: python3, node, ffmpeg, curl. Aufruf im Projektordner:
#   bash tools/make_audio.sh
set -euo pipefail
cd "$(dirname "$0")/.."
WORK="${WORK:-$HOME/.cache/ioi-cluj-tts}"
mkdir -p "$WORK/voices"
[ -d "$WORK/venv" ] || python3 -m venv "$WORK/venv"
"$WORK/venv/bin/pip" install -q piper-tts
BASE=https://huggingface.co/rhasspy/piper-voices/resolve/main
for v in en/en_GB/cori/high/en_GB-cori-high hu/hu_HU/berta/medium/hu_HU-berta-medium ro/ro_RO/mihai/medium/ro_RO-mihai-medium; do
  f="$WORK/voices/$(basename "$v")"
  [ -s "$f.onnx" ] || curl -sSL -o "$f.onnx" "$BASE/$v.onnx"
  [ -s "$f.onnx.json" ] || curl -sSL -o "$f.onnx.json" "$BASE/$v.onnx.json"
done
node tools/export_sentences.js > "$WORK/sentences.json"
"$WORK/venv/bin/python" tools/make_audio.py "$WORK/sentences.json" "$WORK/voices" audio hu=hu_HU-berta-medium "$@"
