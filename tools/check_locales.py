#!/usr/bin/env python3
import collections
import json
import re
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LANGUAGES = ["en", "hu", "ro", "tr", "fa", "es", "ca", "de", "ar", "fr"]
ADDED_LANGUAGES = LANGUAGES[3:]


def fail(message):
    raise SystemExit(f"Localization check failed: {message}")


def object_end(source, start):
    depth = 0
    quote = None
    escaped = False
    for index in range(start, len(source)):
        char = source[index]
        if quote:
            if escaped:
                escaped = False
            elif char == "\\":
                escaped = True
            elif char == quote:
                quote = None
            continue
        if char in ('"', "'", "`"):
            quote = char
        elif char == "{":
            depth += 1
        elif char == "}":
            depth -= 1
            if depth == 0:
                return index + 1
    fail("unterminated JavaScript object")


def quote_object_keys(source):
    output = []
    index = 0
    quote = None
    escaped = False
    while index < len(source):
        char = source[index]
        if quote:
            output.append(char)
            if escaped:
                escaped = False
            elif char == "\\":
                escaped = True
            elif char == quote:
                quote = None
            index += 1
            continue
        if char in ('"', "'", "`"):
            quote = char
            output.append(char)
            index += 1
            continue
        output.append(char)
        index += 1
        if char not in "{,":
            continue
        whitespace_start = index
        while index < len(source) and source[index].isspace():
            index += 1
        key_match = re.match(r"[A-Za-z_$][\w$]*", source[index:])
        if not key_match:
            output.append(source[whitespace_start:index])
            continue
        key_end = index + key_match.end()
        colon = key_end
        while colon < len(source) and source[colon].isspace():
            colon += 1
        if colon >= len(source) or source[colon] != ":":
            output.append(source[whitespace_start:index])
            continue
        output.extend((source[whitespace_start:index], '"', source[index:key_end], '"'))
        index = key_end
    return "".join(output)


def strip_trailing_commas(source):
    output = []
    index = 0
    quote = None
    escaped = False
    while index < len(source):
        char = source[index]
        if quote:
            output.append(char)
            if escaped:
                escaped = False
            elif char == "\\":
                escaped = True
            elif char == quote:
                quote = None
            index += 1
            continue
        if char in ('"', "'", "`"):
            quote = char
        if char == ",":
            lookahead = index + 1
            while lookahead < len(source) and source[lookahead].isspace():
                lookahead += 1
            if lookahead < len(source) and source[lookahead] in "}]":
                index += 1
                continue
        output.append(char)
        index += 1
    return "".join(output)


def parse_object(source, marker):
    start = source.index(marker) + len(marker)
    end = object_end(source, start)
    raw = source[start:end]
    return json.loads(strip_trailing_commas(quote_object_keys(raw)))


def localized_keys(block):
    return set(re.findall(r'(?:^|[,{]\s*)([A-Za-z_]\w*):\s*["\']', block, re.M))


def signatures(value):
    placeholders = collections.Counter(re.findall(r"\{[A-Za-z_]\w*\}", value))
    tags = collections.Counter(re.findall(r"</?[A-Za-z][^>]*>", value))
    return placeholders, tags


def verify_markup(context, key, value, english):
    if signatures(value) != signatures(english):
        fail(f"{context} {key} has different placeholders or HTML tags")


def verify_language_data():
    if len(LANGUAGES) != 10:
        fail(f"expected exactly 10 languages, found {len(LANGUAGES)}")
    i18n_source = (ROOT / "js/i18n.js").read_text()
    extra_source = (ROOT / "js/i18n-extra.js").read_text()
    base = parse_object(i18n_source, "  strings: ")
    added = parse_object(extra_source, "  const strings = ")
    expected_keys = set(base["en"]) | {"obX3More"}
    string_maps = {}
    for code in LANGUAGES[:3]:
        values = dict(base[code])
        match = re.search(rf"I\.strings\.{code}\.obX3More\s*=\s*(\"(?:[^\"\\]|\\.)*\")", extra_source)
        if not match:
            fail(f"{code} missing additive onboarding language note")
        values["obX3More"] = json.loads(match.group(1))
        string_maps[code] = values
    for code in ADDED_LANGUAGES:
        if code not in added:
            fail(f"{code} app translations missing")
        string_maps[code] = added[code]

    for code in LANGUAGES:
        values = string_maps[code]
        missing = expected_keys - set(values)
        if missing:
            fail(f"{code} app strings missing: {sorted(missing)}")
        for key in expected_keys:
            value = values[key]
            if not isinstance(value, str) or not value.strip():
                fail(f"{code} app string empty or invalid: {key}")
            verify_markup(f"{code} app strings", key, value, string_maps["en"][key])

    rows = parse_object(extra_source, "  const pageRows = ")
    page_french = parse_object(extra_source, "  const pageFrench = ")
    if set(page_french) != set(rows):
        fail(f"French portal/admin rows differ: missing={sorted(set(rows) - set(page_french))}, "
             f"extra={sorted(set(page_french) - set(rows))}")
    if not re.search(r'const pageLanguages = \["en", "hu", "ro", "tr", "fa", "es", "ca", "de", "ar", "fr"\]', extra_source):
        fail("portal/admin language column order is not the required 10 languages")
    for key, values in rows.items():
        values = values + [page_french[key]]
        if len(values) != len(LANGUAGES):
            fail(f"{key} has {len(values)} page translations, expected {len(LANGUAGES)}")
        if not all(isinstance(value, str) and value.strip() for value in values):
            fail(f"{key} has an empty or invalid page translation")
        for code, value in zip(LANGUAGES, values):
            verify_markup(f"{code} portal/admin rows", key, value, values[0])

    row_keys = set(rows)
    html_keys = set()
    for name in ["portal.html", "admin.html"]:
        html_keys.update(re.findall(r'data-page-i18n="([^"]+)"', (ROOT / name).read_text()))
        html_keys.update(re.findall(r'data-page-placeholder="([^"]+)"', (ROOT / name).read_text()))
    js_keys = set()
    for name in ["js/portal.js", "js/admin.js"]:
        code = (ROOT / name).read_text()
        js_keys.update(re.findall(r'\bt\("([A-Za-z0-9]+)"', code))
        js_keys.update(re.findall(r'PageI18n\.t\("([A-Za-z0-9]+)"', code))
    missing = (html_keys | js_keys) - row_keys
    if missing:
        fail(f"portal/admin references untranslated keys: {sorted(missing)}")
    return len(expected_keys), len(row_keys)


def words(value):
    return len(re.findall(r"\b[\w’'-]+\b", value, re.UNICODE))


def verify_tour_data():
    source = (ROOT / "js/stations.js").read_text()
    overlay_source = (ROOT / "js/stations-locales.js").read_text()
    locales = parse_object(overlay_source, "  const locales = ")
    if list(locales) != ADDED_LANGUAGES:
        fail(f"station overlay languages are {list(locales)}")
    station_ids = re.findall(r'id: "(\d{2}-[^"]+)"', source)
    places_source = source.split("places: [", 1)[1].split("],\n    stations:", 1)[0]
    place_ids = re.findall(r'id: "([^"]+)"', places_source)
    required_tour = {"subtitle", "organizer", "mediaCredit", "placesNote", "theatreCredit", "enyediCredit", "article"}
    station_word_counts = []
    for code, locale in locales.items():
        if set(locale) != {"tour", "places", "stations"}:
            fail(f"{code} tour overlay has unexpected or missing top-level fields")
        if set(locale["stations"]) != set(station_ids):
            fail(f"{code} station IDs do not match the built-in tour")
        if set(locale["places"]) != set(place_ids):
            fail(f"{code} place IDs do not match the built-in tour")
        if required_tour - set(locale["tour"]):
            fail(f"{code} tour metadata missing: {sorted(required_tour - set(locale['tour']))}")
        if not all(isinstance(locale["tour"][key], str) and locale["tour"][key].strip() for key in required_tour):
            fail(f"{code} has empty tour metadata")
        for place_id, values in locale["places"].items():
            if len(values) != 4 or not values[0] or not values[2]:
                fail(f"{code} place data incomplete: {place_id}")
            if any(value is not None and (not isinstance(value, str) or not value.strip()) for value in values):
                fail(f"{code} place data contains an invalid field: {place_id}")
            place_chunk = places_source.split(f'id: "{place_id}"', 1)[1]
            following = place_chunk.find("\n      {\n        id:", 1)
            place_chunk = place_chunk[:following] if following >= 0 else place_chunk
            for index, field in enumerate(["title", "text", "address", "hours"]):
                source_has_field = bool(re.search(rf"\b{field}:\s*\{{\s*en:", place_chunk))
                if source_has_field != (values[index] is not None):
                    fail(f"{code} place {place_id} {field} translation does not match source coverage")
        for station_id in station_ids:
            chunk = source.split(f'id: "{station_id}"', 1)[1]
            following = chunk.find("\n      {\n        id:", 1)
            chunk = chunk[:following] if following >= 0 else chunk
            translated = locale["stations"][station_id]
            for field in ["title", "subtitle", "address", "text"]:
                if not isinstance(translated.get(field), str) or not translated[field].strip():
                    fail(f"{code} {station_id} missing {field}")
            english_story = re.search(r'text:\s*\{\s*en:\s*`([\s\S]*?)`,\s*hu:', chunk)
            if not english_story:
                fail(f"could not read English story source for {station_id}")
            story = translated["text"]
            english_paragraphs = [
                part for part in re.split(r"\n\s*\n", english_story.group(1).strip()) if part.strip()
            ]
            paragraphs = [part for part in re.split(r"\n\s*\n", story.strip()) if part.strip()]
            ratio = len(story) / max(len(english_story.group(1)), 1)
            if ratio < 0.7:
                fail(f"{code} {station_id} story appears abbreviated ({ratio:.0%} of English source length)")
            if len(paragraphs) != len(english_paragraphs):
                fail(
                    f"{code} {station_id} story has {len(paragraphs)} paragraphs; "
                    f"English source has {len(english_paragraphs)}"
                )
            for index, (paragraph, english_paragraph) in enumerate(zip(paragraphs, english_paragraphs), 1):
                paragraph_ratio = len(paragraph) / max(len(english_paragraph), 1)
                if paragraph_ratio < 0.6:
                    fail(
                        f"{code} {station_id} paragraph {index} appears abbreviated "
                        f"({paragraph_ratio:.0%} of English source length)"
                    )
            station_word_counts.append(words(story))
            media_match = re.search(r"media:\s*\[(.*?)\n\s*\]", chunk, re.S)
            media_count = len(re.findall(r"\bimg\(", media_match.group(1))) if media_match else 0
            if len(translated.get("media", [])) != media_count or not all(translated.get("media", [])):
                fail(f"{code} {station_id} media captions incomplete")
            if "rephoto:" in chunk:
                rephoto_count = len(re.findall(r'\{\s*src:\s*"img/rephoto/', chunk))
                if not translated.get("hint") or len(translated.get("rephoto", [])) != rephoto_count or not all(translated.get("rephoto", [])):
                    fail(f"{code} {station_id} rephoto captions/hint incomplete")
            activity = translated.get("activity")
            if "activity:" in chunk:
                expected_activity_size = 3 if "items:" in chunk else 2
                if not activity or len(activity) != expected_activity_size or not all(activity[:2]):
                    fail(f"{code} {station_id} activity localization incomplete")
                if len(activity) == 3 and (
                    not isinstance(activity[2], list) or not all(isinstance(item, str) and item.strip() for item in activity[2])
                ):
                    fail(f"{code} {station_id} activity items missing")
            links_match = re.search(r"links:\s*\[(.*?)\n\s*\]", chunk, re.S)
            if links_match:
                expected_links = len(re.findall(r"\bARTICLE\b|\{\s*label:", links_match.group(1)))
                if len(translated.get("links", [])) != expected_links or not all(translated.get("links", [])):
                    fail(f"{code} {station_id} links incomplete")
    return len(station_ids), round(sum(station_word_counts) / len(station_word_counts))


def verify_assets_and_rtl():
    for code in LANGUAGES:
        flag = ROOT / "img/flags" / f"{code}.svg"
        if not flag.exists():
            fail(f"missing flag: {code}")
        try:
            ET.parse(flag)
        except ET.ParseError as error:
            fail(f"invalid SVG flag {code}: {error}")
    extra = (ROOT / "js/i18n-extra.js").read_text()
    metadata = extra.split("  const languages = [", 1)[1].split("  ];", 1)[0]
    metadata_codes = re.findall(r'code:\s*"([a-z]+)"', metadata)
    if metadata_codes != ADDED_LANGUAGES:
        fail(f"language metadata mismatch: {metadata_codes}")
    for code in ["fa", "ar"]:
        if not re.search(rf'code: "{code}"[^}}]*dir: "rtl"', metadata):
            fail(f"{code} missing RTL metadata")
    css = (ROOT / "css/style.css").read_text()
    portal_css = (ROOT / "css/portal.css").read_text()
    for selector in ['html[dir="rtl"] .drawer', 'html[dir="rtl"] .next-card', 'html[dir="rtl"] .activity-items']:
        if selector not in css:
            fail(f"RTL app layout rule missing: {selector}")
    if 'html[dir="rtl"] .pt-table' not in portal_css:
        fail("RTL portal/admin layout rule missing")
    worker = (ROOT / "worker/index.js").read_text()
    match = re.search(r"const LANGS = \[([^\]]+)\]", worker)
    allowlist = re.findall(r'"([a-z]+)"', match.group(1)) if match else []
    if allowlist != LANGUAGES:
        fail(f"server language allowlist mismatch: {allowlist}")
    shell = (ROOT / "sw.js").read_text()
    for asset in ["js/i18n-extra.js", "js/stations-locales.js", *[f"img/flags/{code}.svg" for code in LANGUAGES]]:
        if f'"{asset}"' not in shell:
            fail(f"offline shell missing {asset}")
    app = (ROOT / "js/app.js").read_text()
    page = (ROOT / "js/page-i18n.js").read_text()
    if 'const STORE_KEY = "theatre-city-map-v1"' not in app or 'const STORE_KEY = "theatre-city-map-v1"' not in page:
        fail("app and portal/admin do not share the persisted language preference")
    portal = (ROOT / "js/portal.js").read_text()
    if "window.I18N.languages.map" not in portal:
        fail("portal editor language selection is not driven by the shared language list")


if __name__ == "__main__":
    app_count, page_count = verify_language_data()
    station_count, average_story_words = verify_tour_data()
    verify_assets_and_rtl()
    print(
        f"Localization coverage passed: {len(LANGUAGES)} languages, {app_count} app strings, "
        f"{page_count} portal/admin strings, {station_count} stations, "
        f"complete narratives (average {average_story_words} words; every source paragraph, each at least 60% "
        "of its English source length, and each story at least 70%), "
        f"all nested tour fields, "
        f"{len(LANGUAGES)} valid flags, RTL, persistence and server/offline support."
    )
