# Ioi!Cluj (prototype)

**Ioi!Cluj** is a location-based mobile web app that maps the history of the **Hungarian Theatre of Cluj
(Kolozsvári Állami Magyar Színház / Teatrul Maghiar de Stat Cluj)** onto the city.
Built for the challenge *“Theatre City Map”* at the EUTOPIA Innovation Challenge Week,
Cluj-Napoca, 23–27 November 2026.

Walking through Cluj, visitors are guided from place to place. The phone's location
detects where they are and opens the story connected to that place: text, audio and
interactive elements.

**Live:** https://ioi.dvwit.org · QR codes for slides and posters in `promo/`

## Languages

The app is available in **English, Hungarian (Magyar) and Romanian (Română)**.

- On first start, the language follows the phone's settings (fallback: English).
- Users can switch at any time: on the start screen, in the menu, or with the language
  button in the top bar. The choice is remembered.
- Story texts and UI texts are both translated; audio and text-to-speech follow the language.

## Features

- **Interactive map** (Leaflet + OpenStreetMap) with numbered stops and route
- **Live GPS location** with distance and walking time to the next stop
- **Automatic arrival detection**: within 40 m a stop opens by itself (with vibration)
- **Audio player** per stop: play/pause, −15 s, speed, seeking
  - If a recording exists at `audio/<lang>/<stop-id>.mp3`, it is played.
  - Otherwise the device's **text-to-speech** reads the story, highlighting the current sentence.
- **Archive images** per stop from the theatre's Documentation Centre, with captions in
  all three languages and a full-screen viewer (swipe or arrow keys)
- **Interactive elements** per stop, e.g. a costume photo taken with the phone camera
  (stays on the device, can be shared) or search lists
- **Progress** is saved on the device
- **Demo mode** (menu): set your location by tapping the map. Use it to test or present
  the app outside Cluj, e.g. at the Demo Day.
- **Installable** (web app manifest); the app shell works offline (service worker)

## Stops (draft)

| # | Stop | Year | Interactive |
|---|------|------|-------------|
| 1 | Rhédey Palace & Rhédey Café (Main Square): first Hungarian performances | 1792 | 🎭 Try on costumes + souvenir photo |
| 2 | Birthplace of King Matthias | 1443 | |
| 3 | Farkas utca: the first stone theatre | 1821 | |
| 4 | Házsongárd Central Cemetery | 16th c. | 🕯️ On the trail of actors' graves |
| 5 | A Romanian theatre, built as Hungarian (1906, Fellner & Helmer) | 1906 | |
| 6 | From Kolozsvár to Casablanca: Curtiz and the Hungarian actors | 1942 | 🎬 Hungarians in “Casablanca”, link to actors.hu |
| 7 | The Hungarian Theatre today (Str. Emil Isac 26–28) | 1919 → today | |

**Open points:** exact location of stop 1 (Rhédey House) and stop 6 (Casablanca);
exact position of the Casa Universitarilor plaque (stop 3); grave locations for stop 4;
more archive material (documents, videos) and image rights.

## Sources

Facts and images for 1792–1906 come from the theatre's own article
[“The 200th Anniversary of the Hungarian Theatre Company's First Permanent Venue”](https://www.huntheater.ro/en/news/1452/the-200th-anniversary-of-the-hungarian-theatre-companys-first-permanent-venue/)
by Erzsébet Zakariás (huntheater.ro). The images are loaded directly from huntheater.ro
and are not stored in this repository. **Image rights must be cleared with the theatre**
before a public release.

Note: the article gives the first performance as 17 December 1792 in one place and
16 December 1792 in another. The app uses 17 December; please confirm.

> ⚠️ **Texts and coordinates are drafts.** Facts must be checked by the theatre's
> Documentation Centre. The Hungarian and Romanian versions should be proofread by
> native speakers.

## Running it

### On a computer

No build step. Serve the folder with any web server (GPS and the service worker need
`http://localhost` or HTTPS):

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

Use **demo mode** (menu) to set your position by clicking on the map. Alternatively,
in Chrome DevTools: device toolbar (phone view) and *Sensors → Location* to fake GPS.

### Publishing it (HTTPS, for smartphones)

GPS and installation as an app need HTTPS. Three options:

#### A) Self-hosted on a NAS behind a Cloudflare Tunnel

The repository contains `docker-compose.yml` and `deploy/nginx.conf`.

1. On the NAS, get the code:
   ```bash
   git clone -b <branch> https://github.com/DMNT0R/HungarianTheatherCluj.git ioi-cluj
   cd ioi-cluj
   docker compose up -d
   ```
   The app is now reachable in the home network at `http://<NAS-IP>:8088`.
   (Synology: *Container Manager → Project → Create*, path = the cloned folder.)
2. Cloudflare dashboard → **Zero Trust → Networks → Tunnels** → your tunnel →
   **Public Hostname → Add a public hostname**:
   - Subdomain: e.g. `ioi`, Domain: your domain
   - Service: `HTTP` → `localhost:8088` (if cloudflared runs directly on the NAS) or
     `ioi-cluj:80` (if cloudflared runs as a container in the same Docker network)
3. Done: `https://ioi.<your-domain>` – Cloudflare provides the certificate.

**Updates:** `git pull` in the folder on the NAS. No restart needed: nginx serves the
files directly, and `Cache-Control: no-cache` on HTML/JS/CSS makes browsers and the
Cloudflare cache pick up changes immediately.

nginx does not serve `.git`, `deploy/` or `docker-compose.yml`.

#### B) Cloudflare Workers (no server needed)

The repository contains `wrangler.jsonc` (static assets only, no server code) and
`.assetsignore` (keeps `.git`, README, Docker files etc. out of the public site).

1. Cloudflare dashboard → **Workers & Pages → Create → Import a repository** → select this repository
2. Project name: **`hungariantheathercluj`** (must match `name` in `wrangler.jsonc`),
   build command **empty**, deploy command **`npx wrangler deploy`** → **Deploy**
3. The app is live at `https://hungariantheathercluj.<account>.workers.dev`
4. Worker → **Settings → Domains & Routes → Add → Custom domain** → e.g. `ioi.<your-domain>`

Every push to the default branch deploys automatically. Cache rules are in `_headers`.

#### C) GitHub Pages

Repository → **Settings → Pages** → *Source*: **Deploy from a branch** → branch with the
app, folder **/ (root)**. URL: `https://<user>.github.io/<repository>/`
(free for public repositories only).

#### Install on the phone

Open the URL, allow location access, then
iPhone (Safari) → *Share → Add to Home Screen*; Android (Chrome) → *⋮ → Install app*.

Opening the app via the computer's local IP (e.g. `http://192.168.x.x:8000`) works for a
quick look, but browsers block GPS without HTTPS – use demo mode there.

## Editing content

| File | Content |
|------|---------|
| `js/stations.js` | Stops: coordinates, texts in all languages, interactive elements, links |
| `js/i18n.js` | Interface texts (buttons, messages) in all languages |

Translatable fields look like `{ en: "…", hu: "…", ro: "…" }`. If a language is
missing, the English version is shown.

**Adding a language:** add an entry to `languages` and a block to `strings` in
`js/i18n.js`, then add the language code to the texts in `js/stations.js`.

### Audio

Every stop has a narrated audio file per language in `audio/<lang>/<stop-id>.mp3`,
generated with the open-source TTS engine [Piper](https://github.com/rhasspy/piper)
(voices: English *cori*, Hungarian *berta*, Romanian *mihai*). Next to each MP3 is a
`.json` file with the start time of every sentence, so the app highlights the sentence
being spoken. If an MP3 is missing, the app falls back to the phone's own speech output.

**After changing a story text, regenerate the audio** (needs python3, node, ffmpeg):

```bash
bash tools/make_audio.sh                    # all stops, all languages
bash tools/make_audio.sh --only=hu/03-farkas   # a single file
```

**Real recordings** (e.g. read by members of the ensemble) simply replace the MP3 under the
same name. Then delete the matching `.json` file – its sentence timings would no longer fit.

## Structure

```
index.html            User interface
css/style.css         Styling (mobile-first, dark mode)
js/i18n.js            Interface texts (en / hu / ro)
js/stations.js        Tour content (en / hu / ro)
js/audio.js           Audio player (MP3 or text-to-speech)
js/app.js             Map, GPS, language, progress, UI logic
sw.js                 Offline cache
docker-compose.yml    Self-hosting with nginx (NAS)
deploy/nginx.conf     nginx configuration
_headers              Cache rules for Cloudflare
wrangler.jsonc        Cloudflare Workers configuration
.assetsignore         Files Cloudflare must not publish
vendor/leaflet/       Leaflet 1.9.4 map library (BSD-2 licence)
audio/en|hu|ro/       Narration per language (MP3 + sentence timings)
tools/                Audio generation (Piper)
```

## Next steps

- Archival photos, documents and videos per stop from the Documentation Centre
  (as described in the challenge proposal)
- Real walking route instead of straight lines
- Pre-cache map tiles for offline use
- Show current performances and a ticket link at the last stop
