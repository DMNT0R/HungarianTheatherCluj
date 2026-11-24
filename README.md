# Bühne Kolozsvár – Audio-Stadttour durch Cluj (Prototyp)

Mobile Web-App für eine geführte Stadttour durch Cluj-Napoca / Kolozsvár, organisiert vom
**Ungarischen Theater Cluj (Kolozsvári Állami Magyar Színház)**. Die Tour erzählt die
Geschichte der Ungarn in der Stadt, vor allem die Geschichte des Theaters, seiner Häuser
und seiner Schauspielerinnen und Schauspieler.

## Funktionen

- **Interaktive Karte** (Leaflet + OpenStreetMap) mit nummerierten Stationen und Route
- **Live-Standort per GPS** mit Entfernung und Gehzeit zur nächsten Station
- **Automatische Ankunftserkennung**: im Umkreis von 40 m öffnet sich die Station (mit Vibration)
- **Audio-Player** pro Station: Play/Pause, −15 s, Geschwindigkeit, Spulen
  - Liegt eine Aufnahme unter `audio/<station-id>.mp3`, wird sie abgespielt.
  - Fehlt sie, liest die **Sprachausgabe des Geräts** den Text vor. Der aktuelle Satz
    wird dabei im Text hervorgehoben.
- **Fortschritt**: besuchte Stationen werden auf dem Gerät gespeichert
- **Demo-Modus** (Menü → „Demo-Modus"): Standort per Tipp auf die Karte setzen,
  zum Testen ohne Aufenthalt in Cluj
- **Installierbar** (Web-App-Manifest) und App-Hülle offline verfügbar (Service Worker)

## Stationen (Entwurf)

| # | Station | Jahr |
|---|---------|------|
| 1 | Hauptplatz (Főtér / Piața Unirii): erste ungarische Truppe | 1792 |
| 2 | Geburtshaus von König Matthias | 1443 |
| 3 | Farkas utca: erstes steinernes Theater | 1821 |
| 4 | Házsongárd-Friedhof: Erinnerung | 16. Jh. |
| 5 | Nationaltheater von 1906 (heute Rumänisches Nationaltheater/Oper) | 1906 |
| 6 | Ungarisches Theater heute (Str. Emil Isac 26–28) | 1919 → heute |

> ⚠️ **Die Texte und Koordinaten sind Entwürfe für den Prototyp.** Daten, Namen und
> genaue Orte müssen vom Theater historisch geprüft und freigegeben werden.

## Starten

Es gibt keinen Build-Schritt. Die App muss nur über einen Webserver ausgeliefert werden
(GPS und Service Worker brauchen `http://localhost` oder HTTPS):

```bash
python3 -m http.server 8000
# dann http://localhost:8000 öffnen
```

Zum Testen auf dem Smartphone: die App auf einen HTTPS-Host legen (z. B. GitHub Pages,
Netlify) und dort öffnen.

## Inhalte bearbeiten

Alle Inhalte stehen in **`js/stations.js`**: Titel, Koordinaten, Adresse, Erzähltext.
Eine Station hinzufügen heißt, einen Eintrag in diese Liste zu schreiben.

### Echte Audioaufnahmen einbinden

1. Aufnahme als MP3 exportieren (z. B. gesprochen von Ensemblemitgliedern).
2. Unter dem Namen der Station ablegen, z. B. `audio/01-hauptplatz.mp3`.
3. Fertig: Die App erkennt die Datei und spielt sie statt der Sprachausgabe ab.

## Aufbau

```
index.html            Oberfläche
css/style.css         Gestaltung (mobil zuerst, mit Dunkelmodus)
js/stations.js        Tour-Inhalte
js/audio.js           Audio-Player (MP3 oder Sprachausgabe)
js/app.js             Karte, GPS, Fortschritt, UI-Logik
sw.js                 Offline-Cache
vendor/leaflet/       Kartenbibliothek Leaflet 1.9.4 (BSD-2-Lizenz)
audio/                Audioaufnahmen (noch leer)
```

## Ideen für die nächsten Schritte

- Mehrsprachigkeit (Ungarisch, Rumänisch, Englisch); die Datenstruktur ist dafür vorbereitet
- Historische Fotos aus dem Theaterarchiv pro Station, Vorher/Nachher-Vergleich
- Echte Fußwegroute statt Luftlinie
- Kartenkacheln für die Offline-Nutzung vorab laden
- Hinweis auf aktuelle Vorstellungen und Ticketlink an der letzten Station
