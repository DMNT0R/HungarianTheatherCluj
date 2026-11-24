// Exportiert die Stationstexte so, wie die App sie in Sätze zerlegt.
// Aufruf (im Projektordner): node tools/export_sentences.js > /tmp/sentences.json
global.window = {};
require("../js/stations.js");
require("../js/audio.js");
const out = {};
for (const lang of ["en", "hu", "ro"]) {
  out[lang] = {};
  for (const s of window.TOUR.stations) out[lang][s.id] = window.storyParagraphs(s.text[lang]);
}
process.stdout.write(JSON.stringify(out, null, 1));
