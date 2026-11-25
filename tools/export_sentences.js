// Exportiert die Stationstexte so, wie die App sie in Sätze zerlegt.
// Aufruf (im Projektordner): node tools/export_sentences.js > /tmp/sentences.json
global.window = {};
require("../js/i18n.js");
require("../js/i18n-extra.js");
require("../js/stations.js");
require("../js/stations-locales.js");
require("../js/audio.js");
const out = {};
const only = process.argv.slice(2);
for (const lang of window.I18N.languages.map(l => l.code).filter(l => !only.length || only.includes(l))) {
  out[lang] = {};
  for (const s of window.TOUR.stations) out[lang][s.id] = window.storyParagraphs(s.text[lang]);
}
process.stdout.write(JSON.stringify(out, null, 1));
