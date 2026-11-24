#!/usr/bin/env bash
# Erzeugt alle Audiodateien der Tour neu mit Azure Speech (Erzählerin + Schauspieler).
# Voraussetzungen: python3, node, ffmpeg und ein Azure-Speech-Schlüssel (Tarif F0 genügt).
#   AZURE_SPEECH_KEY=... bash tools/make_audio_azure.sh            # alles (~15 min)
#   AZURE_SPEECH_KEY=... bash tools/make_audio_azure.sh --only=hu/03-farkas
set -euo pipefail
cd "$(dirname "$0")/.."
TMP="$(mktemp -d)"
node tools/export_sentences.js > "$TMP/sentences.json"
python3 tools/make_audio_azure.py "$TMP/sentences.json" audio "$@"
rm -rf "$TMP"
