/*
 * Inhalte der Stadttour – mehrsprachig (en / hu / ro).
 *
 * Übersetzbare Felder sind Objekte { en: "...", hu: "...", ro: "..." }.
 * Fehlt eine Sprache, zeigt die App die englische Fassung.
 *
 * Jede Station hat:
 *   id        – eindeutiger Schlüssel; Audio liegt unter audio/<sprache>/<id>.mp3
 *   title, subtitle, address, text – übersetzbar
 *   year      – Leitjahr
 *   coords    – [Breite, Länge] (WGS84, ungefähre Werte – vor Ort prüfen!)
 *   media     – optional: Archivbilder [{src, caption}]
 *   activity  – optional: {icon, title, text, items, photo}
 *   links     – optional: [{label, url}]
 *   draftLocation – true, wenn der genaue Ort noch festgelegt werden muss
 *
 * QUELLE der Fakten und Bilder zu 1792–1906: Erzsébet Zakariás, „The 200th
 * Anniversary of the Hungarian Theatre Company's First Permanent Venue“,
 * huntheater.ro (Dokumentationszentrum des Ungarischen Theaters Cluj).
 * Die Bilder stammen von huntheater.ro; Nutzungsrechte mit dem Theater klären.
 *
 * HINWEIS: Die Texte sind Entwürfe für den Prototyp und sollten vom Theater
 * geprüft, die ungarischen und rumänischen Fassungen von Muttersprachlern
 * gegengelesen werden.
 */
(function () {
  const ARCHIVE = "img/rephoto/black_white/";
  const img = (file, caption) => ({ src: ARCHIVE + file, caption });
  const ARTICLE = {
    label: {
      en: "Read more: 200 years of the Farkas Street theatre (huntheater.ro)",
      hu: "Bővebben: 200 éves a Farkas utcai színház (huntheater.ro)",
      ro: "Mai multe: 200 de ani de la teatrul de pe strada Farkas (huntheater.ro)"
    },
    url: "https://www.huntheater.ro/en/news/1452/the-200th-anniversary-of-the-hungarian-theatre-companys-first-permanent-venue/"
  };

  window.TOUR = {
    title: { en: "(T) Our.Cluj", hu: "(T) Our.Cluj", ro: "(T) Our.Cluj" },
    subtitle: {
      en: "A walk through the Hungarian theatre history of Cluj",
      hu: "Séta Kolozsvár magyar színháztörténetében",
      ro: "O plimbare prin istoria teatrului maghiar din Cluj"
    },
    organizer: {
      en: "Hungarian Theatre of Cluj",
      hu: "Kolozsvári Állami Magyar Színház",
      ro: "Teatrul Maghiar de Stat Cluj"
    },
    rephotoCredits: {
      theatre: { en: "Documentation Centre of the Hungarian Theatre of Cluj", hu: "Kolozsvári Állami Magyar Színház, Dokumentációs Központ", ro: "Centrul de Documentare al Teatrului Maghiar de Stat Cluj" },
      enyedi: { en: "Historic photo, reproduced in D. Enyedi, Studia UBB Dramatica 2018", hu: "Korabeli fotó, közölve: Enyedi D., Studia UBB Dramatica 2018", ro: "Fotografie istorică, reprodusă în D. Enyedi, Studia UBB Dramatica 2018" }
    },
    mediaCredit: {
      en: "Images: Documentation Centre of the Hungarian Theatre of Cluj",
      hu: "Képek: a Kolozsvári Állami Magyar Színház Dokumentációs Központja",
      ro: "Imagini: Centrul de Documentare al Teatrului Maghiar de Stat Cluj"
    },
    placesNote: {
      en: "Example entry for the prototype – opening hours from OpenStreetMap, please check before visiting.",
      hu: "Példa a prototípushoz – a nyitvatartás az OpenStreetMapből származik, látogatás előtt ellenőrizze.",
      ro: "Exemplu pentru prototip – programul provine din OpenStreetMap, vă rugăm verificați înainte de vizită."
    },
    places: [
      {
        id: "rhedey-cafe", kind: "cafe", coords: [46.76876, 23.58951],
        title: { en: "Rhédey Café", hu: "Rhédey Kávéház", ro: "Rhédey Café" },
        text: { en: "Café in the Rhédey Palace, where the first Hungarian theatre company performed in 1792.", hu: "Kávézó a Rhédey-palotában, ahol 1792-ben az első magyar színtársulat játszott.", ro: "Cafenea în Palatul Rhédey, unde a jucat în 1792 prima trupă de teatru maghiară." },
        address: { en: "Piața Unirii 8–9", hu: "Főtér (Piața Unirii) 8–9", ro: "Piața Unirii 8–9" },
        hours: { en: "Sun–Thu 9:00–23:00, Fri–Sat 9:00–24:00", hu: "V–Cs 9:00–23:00, P–Szo 9:00–24:00", ro: "Du–Jo 9:00–23:00, Vi–Sâ 9:00–24:00" }
      },
      {
        id: "art-museum", kind: "museum", coords: [46.77060, 23.59034], website: "https://www.macluj.ro/",
        title: { en: "Art Museum – Bánffy Palace", hu: "Művészeti Múzeum – Bánffy-palota", ro: "Muzeul de Artă – Palatul Bánffy" },
        text: { en: "Baroque palace on the Main Square, home of the Cluj Art Museum.", hu: "Barokk palota a Főtéren, a kolozsvári Művészeti Múzeum otthona.", ro: "Palat baroc în Piața Unirii, sediul Muzeului de Artă Cluj." },
        address: { en: "Piața Unirii 30", hu: "Főtér (Piața Unirii) 30", ro: "Piața Unirii 30" },
        hours: { en: "Wed–Sun 10:00–17:00", hu: "Sze–V 10:00–17:00", ro: "Mi–Du 10:00–17:00" }
      },
      {
        id: "ethnographic-museum", kind: "museum", coords: [46.76922, 23.58661], website: "https://www.muzeul-etnografic.ro/",
        title: { en: "Ethnographic Museum of Transylvania", hu: "Erdélyi Néprajzi Múzeum", ro: "Muzeul Etnografic al Transilvaniei" },
        text: { en: "In the Reduta Palace.", hu: "A Redut épületében.", ro: "În Palatul Reduta." },
        address: { en: "Str. Memorandumului 21", hu: "Memorandumului utca 21", ro: "Str. Memorandumului 21" },
        hours: { en: "Wed–Sun 10:00–18:00 (last entry 17:00)", hu: "Sze–V 10:00–18:00 (utolsó belépés 17:00)", ro: "Mi–Du 10:00–18:00 (ultima intrare 17:00)" }
      },
      {
        id: "academy-library", kind: "institution", coords: [46.76767, 23.59403], website: "http://acad-cluj.ro",
        title: { en: "Romanian Academy Library", hu: "Román Akadémia Könyvtára", ro: "Biblioteca Academiei Române" },
        text: { en: "The oldest theatre posters of Cluj are shown in its entrance hall (Actual de Cluj, 2015).", hu: "Előcsarnokában Kolozsvár legrégebbi színlapjai láthatók (Actual de Cluj, 2015).", ro: "În holul ei sunt expuse cele mai vechi afișe de teatru din Cluj (Actual de Cluj, 2015)." },
        address: { en: "Str. Mihail Kogălniceanu 12–14", hu: "Farkas utca (Str. Mihail Kogălniceanu) 12–14", ro: "Str. Mihail Kogălniceanu 12–14" },
        hours: { en: "Mon–Fri 8:00–14:00", hu: "H–P 8:00–14:00", ro: "Lu–Vi 8:00–14:00" }
      },
      {
        id: "history-museum", kind: "museum", coords: [46.77164, 23.58638], website: "https://www.mnit.ro/",
        title: { en: "National Museum of Transylvanian History", hu: "Erdélyi Nemzeti Történeti Múzeum", ro: "Muzeul Național de Istorie a Transilvaniei" },
        address: { en: "Str. Constantin Daicoviciu 2", hu: "Constantin Daicoviciu utca 2", ro: "Str. Constantin Daicoviciu 2" }
      }
    ],
    stations: [
      {
        id: "01-rhedey",
        year: 1792,
        coords: [46.76873, 23.58938],
        title: { en: "Rhédey Palace & Rhédey Café", hu: "Rhédey-palota és Rhédey Kávéház", ro: "Palatul Rhédey și Rhédey Café" },
        subtitle: { en: "Main Square · Piața Unirii · Főtér", hu: "Főtér · Piața Unirii", ro: "Piața Unirii · Főtér" },
        address: { en: "Piața Unirii 9, corner of Str. Napoca, Cluj-Napoca", hu: "Főtér (Piața Unirii) 9, a Napoca utca sarkán, Kolozsvár", ro: "Piața Unirii 9, colț cu Str. Napoca, Cluj-Napoca" },
        media: [
          img("15885-kamsz_archi_bir_5684 (1).jpg", {
            en: "Rhédey House, the first venue of the Hungarian theatre in Cluj",
            hu: "A Rhédey-ház, a kolozsvári magyar színjátszás első helyszíne",
            ro: "Casa Rhédey, primul spațiu al teatrului maghiar din Cluj"
          })
        ],
        rephoto: {
          hint: { en: "Stand on the opposite pavement of Napoca Street and point your camera at the palace front.", hu: "Álljon a Napoca utca túloldali járdájára, és fordítsa a kamerát a palota homlokzata felé.", ro: "Stați pe trotuarul opus al străzii Napoca și îndreptați camera spre fațada palatului." },
          images: [
            { src: "img/rephoto/black_white/rhedey-house.jpg", year: "1900s", credit: "theatre", caption: { en: "The Rhédey House on Napoca Street", hu: "A Rhédey-ház a Napoca utca felől", ro: "Casa Rhédey dinspre strada Napoca" } }
          ]
        },
        text: {
          en: `Welcome to Cluj – or Kolozsvár, as the city is called in Hungarian. Look for the corner of the Main Square and Napoca Street, where the memorial of the 1989 revolution, the “Shot Pillars”, stands today. The building behind it is the Rhédey Palace – take a look at its façade facing the Main Square.

This is where our story begins. In October 1792 a group of young nobles led by János Fejér asked the authorities for permission to perform plays in Hungarian. They wanted more than entertainment: they wanted to enrich and refine the Hungarian language. They were granted permission – in a reply that was more tolerant than enthusiastic.

But where to perform? Countess Rhédey, born Baroness Terézia Bánffy, offered them the ballroom of this palace, free of charge, for an entire year. On 17 December 1792 the company gave its first performance here, a play called “A titkos ellenkezés vagy Köleséri”. Hungarian-language theatre in Cluj has never stopped since – the Hungarian Theatre of Cluj counts its birthday from that night.

Imagine it: candlelight, a ballroom full of nobles and townspeople in silk and velvet, and young actors on an improvised stage, performing in their own language. Today the Rhédey Café welcomes guests within these old walls. And you are invited to become part of this story yourself: slip into a costume and stand, for a moment, on the stage of 1792.`,
          hu: `Üdvözöljük Kolozsváron! Keresse meg a Főtér és a Napoca utca sarkát, ahol ma az 1989-es forradalom emlékműve, a „Stâlpii Împușcați” áll. A mögötte álló épület a Rhédey-palota – nézze meg a Főtérre néző homlokzatát!

Itt kezdődik történetünk. 1792 októberében Fejér János vezetésével néhány fiatal nemes engedélyt kért arra, hogy magyar nyelvű színdarabokat adhasson elő. Nem csupán szórakoztatni akartak: a magyar nyelvet akarták gazdagítani és csiszolni. Az engedélyt megkapták – inkább türelmes, mint lelkes válasz formájában.

De hol játsszanak? Rhédey grófné, született Bánffy Terézia bárónő egy teljes évre ingyen átengedte nekik palotája báltermét. 1792. december 17-én itt tartotta a társulat első előadását, „A titkos ellenkezés vagy Köleséri” című darabot. Azóta Kolozsváron megszakítás nélkül folyik a magyar nyelvű színjátszás – a Kolozsvári Állami Magyar Színház ettől az estétől számítja születésnapját.

Képzelje el: gyertyafény, selyembe és bársonyba öltözött nemesekkel és polgárokkal teli bálterem, a rögtönzött színpadon pedig fiatal színészek, akik a saját anyanyelvükön játszanak. Ma a Rhédey Kávéház várja a vendégeket az öreg falak között. Önt pedig arra hívjuk, hogy maga is részese legyen ennek a történetnek: bújjon jelmezbe, és álljon egy pillanatra 1792 színpadára.`,
          ro: `Bine ați venit la Cluj – sau Kolozsvár, cum se numește orașul în limba maghiară. Căutați colțul dintre Piața Unirii și strada Napoca, unde se află astăzi monumentul revoluției din 1989, „Stâlpii Împușcați”. Clădirea din spatele lui este Palatul Rhédey – priviți fațada dinspre Piața Unirii.

Aici începe povestea noastră. În octombrie 1792, un grup de tineri nobili condus de János Fejér a cerut permisiunea de a juca piese de teatru în limba maghiară. Nu voiau doar să distreze publicul: voiau să îmbogățească și să rafineze limba maghiară. Au primit permisiunea – printr-un răspuns mai degrabă tolerant decât entuziast.

Dar unde să joace? Contesa Rhédey, născută baroneasa Terézia Bánffy, le-a oferit sala de bal a palatului, gratuit, pentru un an întreg. Pe 17 decembrie 1792, trupa a jucat aici primul său spectacol, piesa „A titkos ellenkezés vagy Köleséri”. De atunci, teatrul în limba maghiară nu s-a mai oprit la Cluj – Teatrul Maghiar de Stat Cluj își numără anii începând cu acea seară.

Imaginați-vă: lumina lumânărilor, o sală de bal plină de nobili și orășeni îmbrăcați în mătase și catifea, iar pe o scenă improvizată, tineri actori care joacă în propria lor limbă. Astăzi, Rhédey Café își primește oaspeții între aceste ziduri vechi. Iar dumneavoastră sunteți invitați să deveniți parte din această poveste: îmbrăcați un costum și urcați, pentru o clipă, pe scena anului 1792.`
        },
        activity: {
          icon: "🎭",
          photo: true,
          title: { en: "In costume, back to 1792", hu: "Jelmezben 1792-be", ro: "În costum, înapoi în 1792" },
          text: {
            en: "Historical costumes from the Hungarian Theatre's wardrobe are waiting for you at the Rhédey Café. Dress up, take a souvenir photo – and share it with #TOurCluj.",
            hu: "A Rhédey Kávéházban a Magyar Színház jelmeztárából származó történelmi jelmezek várják. Öltözzön be, készítsen emlékfotót – és ossza meg a #TOurCluj címkével.",
            ro: "La Rhédey Café vă așteaptă costume istorice din garderoba Teatrului Maghiar. Îmbrăcați-vă, faceți o fotografie de amintire – și distribuiți-o cu #TOurCluj."
          }
        },
        fact: { en: "Did you know? According to the commemorative plaque on the building’s Napoca (formerly Jókai) Street façade, the Transylvanian Hungarian Noble Theatre Company began performing here on 11 November 1792, but later theatre history research established that the first performance actually took place on 17 December 1792.", hu: "Érdekesség: Az épület Jókai (Napoca) utca felőli homlokzatán található emléktábla szerint az Erdélyi Magyar Nemes Színjátszó Társaság 1792. november 11-én kezdte meg itt előadásait, a későbbi színháztörténeti kutatások azonban igazolták, hogy az első előadásra 1792. december 17-én került sor.", ro: "Curiozitate: Potrivit plăcii comemorative de pe fațada clădirii dinspre strada Napoca (fosta stradă Jókai), Societatea Teatrală a Nobililor Maghiari din Transilvania și-a început aici activitatea la 11 noiembrie 1792, însă cercetările istorice ulterioare au demonstrat că prima reprezentație a avut loc, de fapt, la 17 decembrie 1792.", tr: "Biliyor muydunuz? Binanın Napoca (eski adıyla Jókai) Caddesi'ne bakan cephesindeki anı plakasına göre Erdélyli Macar Soylular Tiyatro Topluluğu gösterilerine burada 11 Kasım 1792'de başladı; ancak sonraki tiyatro tarihi araştırmaları ilk gösterinin aslında 17 Aralık 1792'de yapıldığını ortaya koydu.", fa: "آیا می‌دانستید؟ بر پایهٔ لوح یادبودی که بر نمای ساختمان رو به خیابان ناپوکا (نام پیشین: یوکای) نصب شده، «انجمن تئاتر اشراف مجار ترانسیلوانیا» اجراهای خود را در ۱۱ نوامبر ۱۷۹۲ در اینجا آغاز کرد؛ اما پژوهش‌های بعدی تاریخ تئاتر نشان داد که نخستین اجرا در واقع در ۱۷ دسامبر ۱۷۹۲ برگزار شد.", es: "¿Sabías que…? Según la placa conmemorativa de la fachada del edificio que da a la calle Napoca (antes calle Jókai), la Compañía Teatral de la Nobleza Húngara de Transilvania comenzó sus funciones aquí el 11 de noviembre de 1792; sin embargo, la investigación posterior en historia del teatro demostró que la primera función tuvo lugar en realidad el 17 de diciembre de 1792.", ca: "Sabies que…? Segons la placa commemorativa de la façana de l’edifici que dona al carrer Napoca (abans carrer Jókai), la Companyia Teatral de la Noblesa Hongaresa de Transsilvània va començar aquí les seves funcions l’11 de novembre de 1792; però la recerca posterior en història del teatre va demostrar que la primera funció va tenir lloc, de fet, el 17 de desembre de 1792.", de: "Schon gewusst? Laut der Gedenktafel an der Fassade zur Napoca-Straße (früher Jókai-Straße) begann die Siebenbürgisch-Ungarische Adelige Theatergesellschaft hier am 11. November 1792 zu spielen. Spätere theatergeschichtliche Forschungen haben jedoch gezeigt, dass die erste Vorstellung tatsächlich am 17. Dezember 1792 stattfand.", ar: "هل تعلم؟ وفقًا للوحة التذكارية على واجهة المبنى المطلّة على شارع نابوكا (شارع يوكاي سابقًا)، بدأت جمعية المسرح المجرية للنبلاء في ترانسيلفانيا عروضها هنا في 11 نوفمبر 1792، لكن أبحاث تاريخ المسرح اللاحقة أثبتت أن العرض الأول أُقيم في الواقع في 17 ديسمبر 1792.", fr: "Le saviez-vous ? D’après la plaque commémorative apposée sur la façade du bâtiment côté rue Napoca (ancienne rue Jókai), la Société théâtrale de la noblesse hongroise de Transylvanie commença ici ses représentations le 11 novembre 1792 ; les recherches ultérieures en histoire du théâtre ont toutefois établi que la première représentation eut lieu en réalité le 17 décembre 1792." },
        readMore: [
          { t: "Molnár Géza: Adatok a kolozsvári első színjátszó társaság történetéhez. Erdélyi Múzeum, 1912", url: "https://epa.oszk.hu/00900/00979/00208/pdf/EM-1912_29_06epa.pdf" },
          { t: "Ferenczi Zoltán: Az erdélyi magyar játékszín kezdete. Erdélyi Múzeum, 1892 (I)", url: "https://epa.oszk.hu/00900/00979/00046/pdf/EM_1892_09_08_454-488.pdf" },
          { t: "Ferenczi Zoltán: Az erdélyi magyar játékszín kezdete. Erdélyi Múzeum, 1892 (II)", url: "https://real.mtak.hu/189972/1/EM_1892_09_09_522-537.pdf" },
          { t: "Ferenczi Zoltán: A kolozsvári színészet és színház története. Kolozsvár, 1897", url: "https://www.scribd.com/document/743430114/Ferenczi-Zoltan-A-Kolozsvari-Szineszet-Es-Szinhaz" },
          { t: "Enyedi Sándor: Az erdélyi magyar színjátszás kezdetei 1792–1821. Kriterion, Bukarest, 1972 (library record)", url: "https://opac.elte.hu/Record/opac-EUL01-000507349" },
          { t: "Kolozsvári Állami Magyar Színház: Kétszáz éve nyitották meg az első magyar kőszínházat a kolozsvári Farkas utcában", url: "https://www.huntheater.ro/hirek/1452/ketszaz-eve-nyitottak-meg-az-elso-magyar-koszinhazat-a-kolozsvari-farkas-utcaban/" }
        ]
      },
      {
        id: "03-farkas",
        year: 1821,
        coords: [46.76772, 23.59252],
        title: { en: "The first stone theatre", hu: "Az első kőszínház", ro: "Primul teatru din piatră" },
        subtitle: { en: "Farkas utca · Str. Mihail Kogălniceanu", hu: "Farkas utca", ro: "Str. Mihail Kogălniceanu · Farkas utca" },
        address: {
          en: "Colegiul Academic (Auditorium Maximum), Str. Mihail Kogălniceanu 5, corner of Str. Emmanuel de Martonne",
          hu: "Colegiul Academic (Auditorium Maximum), Farkas utca (Str. Mihail Kogălniceanu) 5, a Színház utca (Str. Emmanuel de Martonne) sarkán",
          ro: "Colegiul Academic (Auditorium Maximum), Str. Mihail Kogălniceanu 5, colț cu Str. Emmanuel de Martonne"
        },
        media: [
          img("15886-a-farkas-utcai-szinhaz-az-1850-es-evekben.jpg", {
            en: "The Farkas Street Theatre in the 1850s",
            hu: "A Farkas utcai színház az 1850-es években",
            ro: "Teatrul de pe strada Farkas în anii 1850"
          }),
          img("15887-a-farkas-utcai-szinhaz-az-1865-os-atepitest-koveto-idokbol.jpg", {
            en: "The theatre after its reconstruction in 1865",
            hu: "A színház az 1865-ös átépítés után",
            ro: "Teatrul după reconstrucția din 1865"
          }),
          img("15888-az-1821.-marcius-12-ei-fouri-eloadas-plakatja.jpg", {
            en: "Poster of the aristocrats' opening performance, 12 March 1821",
            hu: "Az 1821. március 12-i főúri előadás plakátja",
            ro: "Afișul spectacolului inaugural al aristocraților, 12 martie 1821"
          }),
          img("15892-kep-3.5.-kotsi.jpg", {
            en: "The only surviving drawing of János Kótsi Patkó (1763–1842)",
            hu: "Kótsi Patkó János (1763–1842) egyetlen fennmaradt rajza",
            ro: "Singurul desen păstrat al lui János Kótsi Patkó (1763–1842)"
          }),
          img("15899-kep-7.1..jpg", {
            en: "Déryné Róza Széppataki (1793–1872), the first opera prima donna of Cluj",
            hu: "Déryné Széppataki Róza (1793–1872), Kolozsvár első operaprimadonnája",
            ro: "Déryné Róza Széppataki (1793–1872), prima primadonă de operă a Clujului"
          }),
          img("15900-a-fiatal-jaszai-mari.jpg", {
            en: "The young Mari Jászai",
            hu: "A fiatal Jászai Mari",
            ro: "Tânăra Mari Jászai"
          }),
          img("15923-jaszai-elso-szerepe-kolozsvaron1869.04.22..jpg", {
            en: "Mari Jászai's first role in Cluj, 22 April 1869",
            hu: "Jászai Mari első kolozsvári szerepe, 1869. április 22.",
            ro: "Primul rol al lui Mari Jászai la Cluj, 22 aprilie 1869"
          }),
          img("15917-kep-13.6.jpg", {
            en: "The last performance at the Farkas Street Theatre, 1906",
            hu: "Az utolsó előadás a Farkas utcai színházban, 1906",
            ro: "Ultimul spectacol la teatrul de pe strada Farkas, 1906"
          }),
          img("15929-kep-13.8.jpg", {
            en: "The memorial plaque on the Academic College (formerly Casa Universitarilor)",
            hu: "Az emléktábla az Akadémiai Kollégium (egykori Casa Universitarilor) falán",
            ro: "Placa memorială de pe clădirea Colegiului Academic (fosta Casă a Universitarilor)"
          }),
          img("15913-kep-13.4.1..jpg", { en: "Playbill of “Mozgó fényképek” (Moving Pictures), 3 January 1899 – the first film scenes on the Cluj stage", hu: "A „Mozgó fényképek” színlapja, 1899. január 3. – az első filmjelenetek a kolozsvári színpadon", ro: "Afișul spectacolului „Mozgó fényképek” (Fotografii mișcătoare), 3 ianuarie 1899 – primele scene de film pe scena clujeană" }),
          img("15916-kep-13.5..jpg", { en: "Playbill of the last performance at the Farkas Street theatre: “Bánk bán”, 17 June 1906, with Mari Jászai", hu: "A Farkas utcai színház utolsó előadásának színlapja: „Bánk bán”, 1906. június 17., Jászai Marival", ro: "Afișul ultimului spectacol al teatrului de pe strada Farkas: „Bánk bán”, 17 iunie 1906, cu Mari Jászai" })
        ],
        rephoto: {
          hint: { en: "Stand diagonally opposite the corner of Kogălniceanu and Emmanuel de Martonne streets – the old theatre will appear where the Academic College stands.", hu: "Álljon átlósan szemben a Kogălniceanu és az Emmanuel de Martonne utca sarkával – a régi színház ott jelenik meg, ahol ma az Akadémiai Kollégium áll.", ro: "Stați în diagonală față de colțul străzilor Kogălniceanu și Emmanuel de Martonne – vechiul teatru va apărea acolo unde se află astăzi Colegiul Academic." },
          images: [
            { src: "img/rephoto/black_white/farkas-photo.jpg", year: "c. 1900", credit: "enyedi", caption: { en: "The old theatre on Farkas Street", hu: "A régi Farkas utcai színház", ro: "Vechiul teatru de pe strada Farkas" } },
            { src: "img/rephoto/black_white/farkas-1865.jpg", year: "1865", credit: "theatre", caption: { en: "After the reconstruction of 1865", hu: "Az 1865-ös átépítés után", ro: "După reconstrucția din 1865" } },
            { src: "img/rephoto/black_white/farkas-1850s.jpg", year: "1850s", credit: "theatre", caption: { en: "The theatre in the 1850s", hu: "A színház az 1850-es években", ro: "Teatrul în anii 1850" } }
          ]
        },
        text: {
          en: `You are standing at the corner of Farkas Street – Wolf Street, today Kogălniceanu Street – and the former Theatre Street, today Emmanuel de Martonne Street. Here stood the first stone theatre ever built for performances in Hungarian.

The actors had dreamed of their own house since 1793. In 1803 five aristocrats bought the plot from the Reformed College, and construction began, paid for by donations. In 1807 the money ran out, and work stopped for four years. Only in 1821 was the theatre designed by the Cluj architect Antal Alföldi finished: 800 seats, 50 boxes, and a stage lit by 200 candles.

The opening lasted two nights. On 12 March 1821 aristocratic amateurs played Theodor Körner's tragedy “Zrínyi” and afterwards donated their costly costumes to the theatre. On 13 March the professional company followed with “King Matthias”. For the opening a playwriting competition was also announced – and for it József Katona wrote “Bánk bán”, which became the Hungarian national drama.

For 85 years this was the company's home. Déryné Róza Széppataki sang here, and in 1869 the young Mari Jászai began the career that made her the greatest Hungarian tragedienne. And in January 1899 a young actor and director, Jenő Janovics, showed film scenes inside a play on this stage for the first time. Remember his name.

The theatre closed on 7 September 1906. Later it passed to the university, served as a store for the botanical museum and was finally demolished. In 1937 King Carol the Second opened the building you see today, the Academic College; since 1955 the Transilvania Philharmonic has played concerts in its Auditorium Maximum. So this corner has remained a stage. Look for the memorial plaque on the wall.

From here we walk to Hunyadi Square, to the great theatre that took over from this one in 1906.`,
          hu: `Ön a Farkas utca – ma Mihail Kogălniceanu utca – és az egykori Színház utca, a mai Emmanuel de Martonne utca sarkán áll. Itt állt az első kőszínház, amelyet magyar nyelvű előadások számára építettek.

A színészek már 1793 óta saját házról álmodtak. 1803-ban öt főnemes megvásárolta a telket a Református Kollégiumtól, és adományokból megkezdődött az építkezés. 1807-ben elfogyott a pénz, a munka négy évre leállt. Csak 1821-ben készült el a kolozsvári Alföldi Antal tervezte színház: 800 férőhely, 50 páholy, a színpadot pedig 200 gyertya világította meg.

A megnyitó két estén át tartott. 1821. március 12-én főúri műkedvelők adták elő Theodor Körner „Zrínyi” című tragédiáját, drága jelmezeiket pedig utána a színháznak ajándékozták. Március 13-án a hivatásos társulat következett a „Mátyás király” című darabbal. A megnyitó alkalmából drámapályázatot is hirdettek – erre írta Katona József a „Bánk bánt”, amelyből a magyar nemzeti dráma lett.

Nyolcvanöt évig ez volt a társulat otthona. Itt énekelt Déryné Széppataki Róza, és itt kezdte 1869-ben pályáját a fiatal Jászai Mari, aki később a legnagyobb magyar tragika lett. 1899 januárjában pedig egy fiatal színész és rendező, Janovics Jenő, ezen a színpadon vetített először filmjeleneteket egy színházi előadásban. Jegyezze meg a nevét!

A színház 1906. szeptember 7-én bezárt. Később az egyetemé lett, a botanikus múzeum raktáraként szolgált, végül lebontották. 1937-ben II. Károly király avatta fel a ma itt álló épületet, az Akadémiai Kollégiumot; Auditorium Maximum termében 1955 óta a kolozsvári filharmónia hangversenyez. Ez a sarok tehát színpad maradt. Keresse meg a falon az emléktáblát!

Innen a Hunyadi térre sétálunk, ahhoz a nagy színházhoz, amely 1906-ban átvette ennek a helyét.`,
          ro: `Vă aflați la colțul străzii Farkas – strada Lupilor, astăzi Mihail Kogălniceanu – cu fosta stradă a Teatrului, astăzi Emmanuel de Martonne. Aici s-a aflat primul teatru din piatră construit pentru spectacole în limba maghiară.

Actorii visau la propria clădire încă din 1793. În 1803, cinci aristocrați au cumpărat terenul de la Colegiul Reformat, iar construcția a început din donații. În 1807 banii s-au terminat, iar lucrările au stat patru ani. Abia în 1821 a fost gata teatrul proiectat de arhitectul clujean Antal Alföldi: 800 de locuri, 50 de loje și o scenă luminată de 200 de lumânări.

Inaugurarea a durat două seri. Pe 12 martie 1821, actori amatori aristocrați au jucat tragedia „Zrínyi” de Theodor Körner, apoi au donat teatrului costumele lor scumpe. Pe 13 martie a urmat trupa profesionistă, cu piesa „Regele Matia”. Cu ocazia inaugurării a fost anunțat și un concurs de dramaturgie – pentru el a scris József Katona piesa „Bánk bán”, devenită drama națională maghiară.

Timp de 85 de ani, aceasta a fost casa trupei. Aici a cântat Déryné Róza Széppataki, iar în 1869 și-a început aici cariera tânăra Mari Jászai, care a devenit apoi cea mai mare tragediană maghiară. Iar în ianuarie 1899, un tânăr actor și regizor, Jenő Janovics, a proiectat pentru prima dată pe această scenă scene de film în cadrul unui spectacol. Rețineți-i numele.

Teatrul s-a închis pe 7 septembrie 1906. Mai târziu a trecut la universitate, a servit drept depozit al muzeului botanic și, în cele din urmă, a fost demolat. În 1937, regele Carol al II-lea a inaugurat clădirea de astăzi, Colegiul Academic; în sala Auditorium Maximum concertează din 1955 Filarmonica „Transilvania”. Așadar, acest colț a rămas o scenă. Căutați placa memorială de pe zid.

De aici mergem în Piața Hunyadi, azi Piața Ștefan cel Mare, la marele teatru care a preluat locul acestuia în 1906.`
        },
        readMore: [
          { t: "Salat-Zakariás Erzsébet: A fiatal Janovics és a Mozgó fényképek. Korunk, 2011/12, 80–87", url: "https://epa.oszk.hu/00400/00458/00575/pdf/EPA00458_korunk_2011_12_080-091.pdf" },
          { t: "Bartha Katalin Ágnes: Színházi professzió és presztízs Kolozsváron a 19. század utolsó harmadában. Erdélyi Múzeum, 2015/3, 46–78", url: "https://epa.oszk.hu/00900/00979/00440/pdf/EPA00979_erdelyi_muzeum_2015_3_046-078.pdf" },
          { t: "Bartha Katalin Ágnes: Theatre Inauguration Ceremony and Symbolic Representation. Studia UBB Dramatica, 2017/2, 23–50 (English)", url: "https://dramatica.ro/index.php/j/article/view/201" },
          { t: "Szabó-Reznek Eszter: Az arisztokrácia önreprezentációja az erdélyi hivatásos színjátszás centenáriumi ünnepségén. Korall, 2017/69, 46–67", url: "https://polecolit.btk.mta.hu/wp-content/uploads/2019/11/szabo_reznek_arisztokracia.pdf" },
          { t: "Gajdó Tamás: „Vagy nem lenni” – Janovics Jenő színházigazgatói szerepei. Jelenkor, 2008/6", url: "https://www.jelenkor.net/userfiles/archivum/2008-6.pdf" },
          { t: "Kolozsvári színházépítés (1809–1821). In: Kerényi Ferenc (szerk.): Magyar színháztörténet 1790–1873. Akadémiai Kiadó, 1990", url: "https://mek.oszk.hu/02000/02065/html/1kotet/18.html" },
          { t: "Gaal György: A kőszínház dicsősége és pusztulása. Kincses Kolozsvár Kalendáriuma, 2023–2024", url: "https://kincseskolozsvar.ro/wp-content/uploads/2024/09/KKK-2023-00_compressed.pdf" },
          { t: "Ferenczi Zoltán: A kolozsvári színészet és színház története. Kolozsvár, 1897", url: "https://www.scribd.com/document/743430114/Ferenczi-Zoltan-A-Kolozsvari-Szineszet-Es-Szinhaz" },
          { t: "Janovics Jenő: A Farkas-utcai színház. Singer és Wolfner, Budapest, 1941" }
        ]
      },
      {
        id: "05-nationaltheater",
        year: 1906,
        coords: [46.77013, 23.59749],
        title: { en: "A Romanian theatre, built as Hungarian", hu: "Román színház – magyarnak épült", ro: "Un teatru românesc, construit ca teatru maghiar" },
        subtitle: { en: "Piața Ștefan cel Mare · Hunyadi tér", hu: "Hunyadi tér · Piața Ștefan cel Mare", ro: "Piața Ștefan cel Mare · Hunyadi tér" },
        address: { en: "Piața Ștefan cel Mare 2–4, Cluj-Napoca", hu: "Hunyadi tér (Piața Ștefan cel Mare) 2–4, Kolozsvár", ro: "Piața Ștefan cel Mare 2–4, Cluj-Napoca" },
        media: [
          img("15928-kep-13.10.jpg", {
            en: "The theatre on today's Ștefan cel Mare Square",
            hu: "A színház a mai Ștefan cel Mare téren",
            ro: "Teatrul din actuala Piață Ștefan cel Mare"
          }),
          img("15935-janovits-j..jpg", {
            en: "Jenő Janovics (1872–1945), director of the theatre from 1905",
            hu: "Janovics Jenő (1872–1945), 1905-től a színház igazgatója",
            ro: "Jenő Janovics (1872–1945), directorul teatrului din 1905"
          })
        ],
        rephoto: {
          hint: { en: "Stand in the square in front of the main entrance and frame the whole façade.", hu: "Álljon a főbejárat előtti téren, és vegye kamerába az egész homlokzatot.", ro: "Stați în piața din fața intrării principale și încadrați toată fațada." },
          images: [
            { src: "img/rephoto/black_white/national-theatre-postcard.jpg", year: "c. 1910", credit: "theatre", caption: { en: "Postcard: “Kolozsvár, Nemzeti színház”", hu: "Képeslap: „Kolozsvár, Nemzeti színház”", ro: "Carte poștală: „Kolozsvár, Nemzeti színház”" } },
            { src: "img/rephoto/black_white/national-theatre-square.jpg", year: "c. 1910", credit: "enyedi", caption: { en: "The National Theatre and Hunyadi Square", hu: "A Nemzeti Színház és a Hunyadi tér", ro: "Teatrul Național și Piața Hunyadi" } }
          ]
        },
        text: {
          en: `In front of you stands the Lucian Blaga National Theatre, which is also home to the Romanian Opera. It was built as the new Hungarian National Theatre, designed by the Viennese architects Fellner and Helmer, and opened on 8 September 1906 under its director Jenő Janovics. Into the new stage he set a piece of the floorboards of the old Farkas Street theatre – as a sign that the story goes on.

Then the First World War ended. On 21 December 1918, with Romanian troops close to the city, Janovics gathered about two hundred and fifty actors, musicians and stagehands on this stage at dawn. “As long as I breathe, I will defend this theatre that has been entrusted to me.” His wife, the actress Lili Poór, answered: “We stay here!” – and everyone repeated it.

Transylvania became part of Romania. For Romanians, who had long been hindered here from playing theatre in their own language, taking over this house was a matter of national pride. In May 1919 the takeover was ordered. On 30 September 1919 the Hungarian company played here for the last time: Hamlet, with Janovics in the title role. The censors had cut the great monologue down to its first line. When Janovics spoke “To be, or not to be” straight to the audience, a woman cried out: “We want to live!” – and two thousand voices joined in. Police cleared the house. The next morning the building passed to the Romanian National Theatre.

Between 1940 and 1945, after the Second Vienna Award, the Hungarian company played here once more. Today the Romanian and the Hungarian theatres of Cluj perform a few hundred metres apart – and both belong to this city.

Janovics was also a pioneer of film – you will hear that story at the end of the tour. But first we walk to the birthplace of King Matthias, the hero of the very first evening on Farkas Street.`,
          hu: `Ön előtt a Lucian Blaga Nemzeti Színház áll, amelyben a Román Opera is otthonra talált. Új magyar Nemzeti Színháznak épült, a bécsi Fellner és Helmer tervei szerint, és 1906. szeptember 8-án nyílt meg Janovics Jenő igazgatása alatt. Az új színpadba Janovics beépíttetett egy darabot a régi Farkas utcai színpad deszkáiból – annak jeléül, hogy a történet folytatódik.

Aztán véget ért az első világháború. 1918. december 21-én hajnalban, amikor a román csapatok már a város közelében jártak, Janovics mintegy kétszázötven színészt, zenészt és műszaki dolgozót gyűjtött össze ezen a színpadon. „Ezt a színházat, amelyet gondozásomra bíztak, védeni fogom, amíg lélegzem.” Felesége, Poór Lili színésznő így felelt: „Itt maradunk!” – és mindenki megismételte.

Erdély Romániához került. A románok számára, akiket itt sokáig akadályoztak abban, hogy saját nyelvükön színházat játsszanak, a ház átvétele nemzeti büszkeség kérdése volt. 1919 májusában elrendelték az átvételt. 1919. szeptember 30-án a magyar társulat utoljára játszott itt: a Hamletet adták, a címszerepben Janovics Jenővel. A cenzúra a nagymonológból csak az első sort hagyta meg. Amikor Janovics a „Lenni vagy nem lenni” kérdését egyenesen a közönséghez intézte, egy nő felkiáltott: „Élni akarunk!” – és kétezer hang csatlakozott hozzá. A rendőrség ürítette ki a nézőteret. Másnap reggel az épület a Román Nemzeti Színházé lett.

1940 és 1945 között, a második bécsi döntés után, a magyar társulat még egyszer itt játszott. Ma Kolozsvár román és magyar színháza néhány száz méterre játszik egymástól – és mindkettő ehhez a városhoz tartozik.

Janovics a film egyik úttörője is volt – erről a séta végén hall majd. Előbb azonban Mátyás király szülőházához sétálunk, a Farkas utcai legelső este hőséhez.`,
          ro: `În fața dumneavoastră se află Teatrul Național „Lucian Blaga”, care adăpostește și Opera Națională Română. A fost construit ca noul Teatru Național Maghiar, după planurile arhitecților vienezi Fellner și Helmer, și s-a deschis pe 8 septembrie 1906, sub conducerea directorului Jenő Janovics. În noua scenă, Janovics a încorporat o bucată din scândurile vechii scene de pe strada Farkas – ca semn că povestea continuă.

Apoi s-a încheiat Primul Război Mondial. Pe 21 decembrie 1918, în zori, cu trupele române aproape de oraș, Janovics a adunat pe această scenă aproximativ două sute cincizeci de actori, muzicieni și tehnicieni. „Atâta timp cât respir, voi apăra acest teatru care mi-a fost încredințat.” Soția lui, actrița Lili Poór, a răspuns: „Rămânem aici!” – și toți au repetat.

Transilvania a devenit parte a României. Pentru români, care fuseseră multă vreme împiedicați aici să joace teatru în propria limbă, preluarea acestei clădiri a fost o chestiune de mândrie națională. În mai 1919 s-a dispus preluarea. Pe 30 septembrie 1919, trupa maghiară a jucat aici pentru ultima dată: Hamlet, cu Janovics în rolul titular. Cenzura redusese marele monolog la primul vers. Când Janovics a adresat întrebarea „A fi sau a nu fi” direct publicului, o femeie a strigat: „Vrem să trăim!” – și două mii de voci i s-au alăturat. Poliția a evacuat sala. A doua zi dimineață, clădirea a trecut la Teatrul Național Român.

Între 1940 și 1945, după Dictatul de la Viena, trupa maghiară a jucat aici încă o dată. Astăzi, teatrul românesc și cel maghiar din Cluj joacă la câteva sute de metri unul de celălalt – și amândouă aparțin acestui oraș.

Janovics a fost și un pionier al filmului – veți auzi această poveste la finalul turului. Dar mai întâi mergem la casa natală a regelui Matia, eroul primei seri de pe strada Farkas.`
        },
        readMore: [
          { t: "Delia Enyedi: Written on the Walls: The Hungarian-Romanian Transfer of the National Theatre Building from Kolozsvár/Cluj", url: "https://www.dramatica.ro/index.php/j/article/view/183" },
          { t: "Gajdó Tamás: „Vagy nem lenni” – Janovics Jenő színházigazgatói szerepei", url: "https://www.jelenkor.net/userfiles/archivum/2008-6.pdf" },
          { t: "P. Kovács Klára: Nemzeti Színház, Kolozsvár", url: "https://lexikon.adatbank.ro/muemlek.php?id=161" },
          { t: "Juhász Gabriella: Ferdinand Fellner és Hermann Helmer magyarországi színházépítészete", url: "https://disszertacio.ppke.hu/id/eprint/602/" },
          { t: "Justin Ceuca: Zaharia Bârsan and the Establishment of the National Theatre in Cluj", url: "https://www.dramatica.ro/index.php/j/article/view/182" },
          { t: "Janovics Jenő: A Hunyadi téri színház (list of manuscripts)", url: "https://adatbank.ro/inchtm.php?akod=1229" },
          { t: "Salat-Zakariás Erzsébet: Janovics Jenő, a színész, a rendező, az irodalomtudós és a színházigazgató", url: "https://kultura.hu/a-szinpadtol-a-mozivaszonig-janovics-jeno-palyakepe/" }
        ]
      },
      {
        id: "02-matthias",
        year: 1443,
        coords: [46.77113, 23.58756],
        title: { en: "Birthplace of King Matthias", hu: "Mátyás király szülőháza", ro: "Casa natală a regelui Matia Corvin" },
        subtitle: { en: "Casa Matei Corvin · Mátyás király szülőháza", hu: "Mátyás király szülőháza", ro: "Casa Matei Corvin" },
        address: { en: "Str. Matei Corvin 6, Cluj-Napoca", hu: "Mátyás király utca (Str. Matei Corvin) 6, Kolozsvár", ro: "Str. Matei Corvin 6, Cluj-Napoca" },
        readMore: [
          { t: "Lupescu Radu: Mátyás király szülőháza, Kolozsvár", url: "https://lexikon.adatbank.ro/muemlek.php?id=325" },
          { t: "Lupescu Radu: Casa Matia Corvin, Cluj-Napoca", url: "https://enciclopedie.transindex.adatbank.ro/monument.php?id=322" },
          { t: "Lupescu Radu: Mátyás király szülőháza (Rubicon)", url: "https://rubicon.hu/hu/cikkek/matyas-kiraly-szulohaza" },
          { t: "Kubinyi András: Mátyás király", url: "https://mandadb.hu/tetel/182454/Matyas_kiraly" },
          { t: "Horváth Richárd: Mesék és sztereotípiák helyett: Mátyás király és uralkodása", url: "https://mta.hu/tudomany_hirei/mesek-es-sztereotipiak-helyett-matyas-kiraly-es-uralkodasa-108635" },
          { t: "Ioan-Aurel Pop: Numele din familia regelui Matia Corvinul", url: "https://dspace.bcucluj.ro/bitstream/123456789/48214/1/Pop%2BIoan%2BAurel-Numele%2Bdin%2Bfamilia%2Bregelu%2BMatia%2BCorvinul-2008.pdf" },
          { t: "Bibliotheca Corvina Virtualis – Országos Széchényi Könyvtár", url: "https://corvina.hu/" }
        ],
        text: {
          en: `In this Gothic town house Matthias Hunyadi was born in 1443 – later King Matthias Corvinus. From 1458 to 1490 he ruled the Kingdom of Hungary and turned his court into one of the first centres of the Renaissance north of the Alps.

For the theatre, Matthias remains a grateful figure to this day. In popular tradition he became “Matthias the Just”, who travels the country in disguise, uncovers injustice and exposes the powerful. These stories were told, sung and performed – at fairs, in schools and on the great stages.

In fact, when the Hungarian actors of Cluj gave their first performance in their own permanent theatre in 1821, they chose a play about him: “King Matthias” by László Szentjóbi Szabó.

King Matthias Corvinus holds an important place in both Hungarian and Romanian historical memory: his family roots, humanist education and commitment to Renaissance culture make him a significant figure in our shared cultural heritage. Today the house is used by the University of Art and Design. Art and Cluj still belong together here. Our next stop is the Hungarian Theatre, the company's home today.`,
          hu: `Ebben a gótikus polgárházban született 1443-ban Hunyadi Mátyás, a későbbi Mátyás király. 1458 és 1490 között uralkodott a Magyar Királyság felett, udvarát pedig az Alpoktól északra a reneszánsz egyik első központjává tette.

A színház számára Mátyás ma is hálás figura. A néphagyományban ő lett „Igazságos Mátyás”, aki álruhában járja az országot, leleplezi az igazságtalanságot és megszégyeníti a hatalmasokat. Ezeket a történeteket mesélték, énekelték és eljátszották – vásárokon, iskolákban és a nagy színpadokon.

Amikor a kolozsvári magyar színészek 1821-ben első előadásukat tartották saját, állandó színházukban, róla szóló darabot választottak: Szentjóbi Szabó László „Mátyás király” című művét.

Mátyás király alakja a magyar és a román történelmi emlékezetben egyaránt fontos helyet foglal el: családi gyökerei, humanista műveltsége és a reneszánsz kultúra iránti elkötelezettsége közös kulturális örökség meghatározó alakjává teszik. Ma a Művészeti és Design Egyetem használja az épületet. A művészet és Kolozsvár itt ma is összetartozik. Következő állomásunk a Magyar Színház, a társulat mai otthona.`,
          ro: `În această casă gotică s-a născut în 1443 Matia Hunyadi, viitorul rege Matia Corvin. Între 1458 și 1490 a condus Regatul Ungariei și a transformat curtea sa într-unul dintre primele centre ale Renașterii la nord de Alpi.

Pentru teatru, Matia rămâne până astăzi un personaj îndrăgit. În tradiția populară a devenit „Matia cel Drept”, care cutreieră țara deghizat, descoperă nedreptățile și îi demască pe cei puternici. Aceste povești au fost spuse, cântate și jucate – la târguri, în școli și pe marile scene.

De altfel, când actorii maghiari din Cluj au jucat pentru prima dată în propriul lor teatru permanent, în 1821, au ales o piesă despre el: „Regele Matia” de László Szentjóbi Szabó.

Regele Matia Corvin ocupă un loc important atât în memoria istorică maghiară, cât și în cea românească: rădăcinile sale familiale, cultura sa umanistă și atașamentul față de valorile Renașterii fac din el o personalitate marcantă a patrimoniului nostru cultural comun. Astăzi, clădirea este folosită de Universitatea de Artă și Design. Arta și Clujul sunt și aici strâns legate. Următoarea oprire este Teatrul Maghiar, casa de azi a trupei.`
        }
      },
      {
        id: "07-ungarisches-theater",
        year: 1919,
        coords: [46.77261, 23.58414],
        title: { en: "The Hungarian Theatre today", hu: "A Magyar Színház ma", ro: "Teatrul Maghiar astăzi" },
        subtitle: { en: "Kolozsvári Állami Magyar Színház", hu: "Kolozsvári Állami Magyar Színház", ro: "Teatrul Maghiar de Stat Cluj" },
        address: { en: "Str. Emil Isac 26–28, Cluj-Napoca", hu: "Emil Isac utca 26–28, Kolozsvár", ro: "Str. Emil Isac 26–28, Cluj-Napoca" },
        rephoto: {
          hint: { en: "Stand in front of the main entrance. In 1959–61 the original Art Nouveau façade was replaced – see what it looked like.", hu: "Álljon a főbejárat elé. Az eredeti szecessziós homlokzatot 1959–61-ben lecserélték – nézze meg, milyen volt.", ro: "Stați în fața intrării principale. Fațada originală Art Nouveau a fost înlocuită în 1959–61 – vedeți cum arăta." },
          images: [
            { src: "img/rephoto/black_white/summer-theatre-1910.jpg", year: "c. 1910", credit: "enyedi", caption: { en: "The summer theatre with its original façade", hu: "A nyári színkör eredeti homlokzatával", ro: "Teatrul de vară cu fațada originală" } },
            { src: "img/rephoto/black_white/summer-theatre-street.jpg", year: "1910s", credit: "enyedi", caption: { en: "The summer theatre seen from the street", hu: "A nyári színkör az utca felől", ro: "Teatrul de vară văzut din stradă" } }
          ]
        },
        readMore: [
          { t: "Demeter Kata: A kolozsvári Nyári Színkör épülete. Játéktér, 2017/2", url: "https://real-j.mtak.hu/27921/1/EPA02997_jatekter_2017_2.pdf" },
          { t: "Kápolnási Zsolt: A kolozsvári mozihálózat kiépülése a századfordulón (1896–1918)", url: "https://filmtett.ro/cikk/1719/a-kolozsvari-mozihalozat-kiepulese-a-szazadfordulon-1896-1918" },
          { t: "Balogh Gyöngyi: Filológiai útvesztőkben", url: "https://www.filmkultura.hu/regi/2002/articles/essays/bgyongyi2.hu.html" },
          { t: "Beyond Everydayness – Exhibition of Theatre Architecture in Central Europe (catalogue, p. 32)", url: "https://www.theatre-architecture.eu/res/archive/068/007855.pdf" },
          { t: "BME: Nemeuklideszi terek – Kolozsvár", url: "https://kozep.bme.hu/hirek/nemeuklideszi-terek-2" }
        ],
        text: {
          en: `Welcome to the Hungarian Theatre of Cluj. From 1874 a wooden summer stage stood here at the entrance to the park. In 1910 Janovics replaced it with this brick theatre – and paid for it out of his own pocket. When the Hungarian company lost the great house on Hunyadi Square, it moved in here. In October 1919 Janovics opened the season – in a building without heating.

The street outside is named after Emil Isac, a Romanian poet who in 1919 helped shape the new cultural policy of Transylvania. Janovics, for his part, brought Romanian authors such as Caragiale and Blaga to the Hungarian stage and took his company on tour to Bucharest – and was attacked for it by nationalists on both sides. In 1923 he was offered the directorship of the National Theatre in Budapest. He declined: “I cannot cut the ties that bind me to Kolozsvár.”

Apart from the years 1940 to 1945, this has been the company's home ever since. It was given its present form between 1959 and 1961, and it shares its stage with the Hungarian Opera. Directors such as György Harag and, since 1990, Gábor Tompa have made it one of the most acclaimed theatres in Romania and a member of the Union of the Theatres of Europe.

More than two hundred and thirty years after the first performance in Countess Rhédey's ballroom, Hungarian theatre is still performed here every evening – with Romanian and English surtitles. For the finale of our walk, we go round to the back of the theatre, towards the river – to where a piece of film history began.`,
          hu: `Üdvözöljük a Kolozsvári Állami Magyar Színháznál! Itt, a Sétatér bejáratánál 1874-től fából épült nyári színkör állt. 1910-ben Janovics ezt a kőszínházat építtette helyette – a saját pénzéből. Amikor a magyar társulat elvesztette a Hunyadi téri nagy épületet, ide költözött. 1919 októberében Janovics itt nyitotta meg az évadot – egy fűtetlen épületben.

A ház előtti utca Emil Isac román költő nevét viseli, aki 1919-ben Erdély új kultúrpolitikájának egyik alakítója volt. Janovics a maga részéről román szerzőket, köztük Caragialét és Blagát vitte magyar színpadra, társulatával Bukarestben is vendégszerepelt – és ezért mindkét oldal nacionalistái támadták. 1923-ban felkínálták neki a budapesti Nemzeti Színház igazgatását. Nemet mondott: „Nem tudom elszakítani a kapcsokat, amelyek engem Kolozsvárhoz kötnek.”

Az 1940 és 1945 közötti éveket leszámítva azóta is ez a társulat otthona. Mai formáját 1959 és 1961 között nyerte el, színpadán a Kolozsvári Magyar Operával osztozik. Olyan rendezők, mint Harag György és 1990 óta Tompa Gábor, Románia egyik legelismertebb színházává és az Európai Színházi Unió tagjává tették.

Több mint kétszázharminc évvel a Rhédey grófné báltermében tartott első előadás után itt ma is minden este magyarul játszanak – román és angol felirattal. Sétánk fináléjához megkerüljük a színházat a folyó felé – oda, ahol a filmtörténet egy darabja kezdődött.`,
          ro: `Bine ați venit la Teatrul Maghiar de Stat din Cluj. Aici, la intrarea în parc, se afla din 1874 un teatru de vară din lemn. În 1910, Janovics l-a înlocuit cu această clădire din cărămidă – plătită din propriul buzunar. Când trupa maghiară a pierdut marea clădire din Piața Hunyadi, s-a mutat aici. În octombrie 1919, Janovics a deschis stagiunea – într-o clădire fără încălzire.

Strada din fața teatrului poartă numele lui Emil Isac, poet român care în 1919 a contribuit la noua politică culturală a Transilvaniei. Janovics, la rândul său, a adus pe scena maghiară autori români precum Caragiale și Blaga și a dus trupa în turneu la București – fiind atacat pentru asta de naționaliștii ambelor părți. În 1923 i s-a oferit conducerea Teatrului Național din Budapesta. A refuzat: „Nu pot rupe legăturile care mă leagă de Cluj.”

Cu excepția anilor dintre 1940 și 1945, aceasta este de atunci casa trupei. Clădirea și-a primit forma actuală între 1959 și 1961 și își împarte scena cu Opera Maghiară. Regizori precum György Harag și, din 1990, Gábor Tompa au făcut din ea unul dintre cele mai apreciate teatre din România și membru al Uniunii Teatrelor din Europa.

La peste două sute treizeci de ani după primul spectacol din sala de bal a contesei Rhédey, aici se joacă și astăzi, în fiecare seară, teatru în limba maghiară – cu supratitrare în română și engleză. Pentru finalul plimbării, ocolim teatrul spre râu – acolo unde a început o bucată din istoria filmului.`
        }
      },
      {
        id: "06-casablanca",
        year: 1942,
        coords: [46.772844, 23.584413],
        title: { en: "From Kolozsvár to Casablanca", hu: "Kolozsvártól Casablancáig", ro: "De la Cluj la Casablanca" },
        subtitle: { en: "Kertész Mihály · Michael Curtiz", hu: "Kertész Mihály · Michael Curtiz", ro: "Mihály Kertész · Michael Curtiz" },
        address: { en: "Str. Emil Isac 26–28 (behind the theatre)", hu: "Emil Isac utca 26–28 (a színház mögött)", ro: "Str. Emil Isac 26–28 (în spatele teatrului)" },
        media: [
          img("15932-janovits.jpg", {
            en: "Jenő Janovics, theatre director and film pioneer",
            hu: "Janovics Jenő színigazgató, a film úttörője",
            ro: "Jenő Janovics, director de teatru și pionier al filmului"
          }),
          img("casa_blanca.png", { en: "On the set of “Casablanca” (1942): Humphrey Bogart and Ingrid Bergman", hu: "A „Casablanca” forgatásán (1942): Humphrey Bogart és Ingrid Bergman", ro: "La filmările pentru „Casablanca” (1942): Humphrey Bogart și Ingrid Bergman" })
        ],
        readMore: [
          { t: "Zágoni Bálint – Kurutz Márton: Janovics Jenő – A kolozsvári filmgyártás megteremtője (NFI)", url: "https://nfi.hu/filmarchivum/hirek-1/janovics-jeno-a-kolozsvari-filmgyartas-megteremtoje.html" },
          { t: "Meghiúsult tervek és félreértett címek: pontosítások a Janovics Jenő kolozsvári filmgyárában készült produkciók kapcsán", url: "https://filmtett.ro/cikk/meghiusult-tervek-es-felreertett-cimek-janovics-kolozsvari-filmgyar-pontositasok-tanulmany" },
          { t: "Balogh Gyöngyi – Zágoni Bálint (szerk.): A kolozsvári filmgyártás képes története 1913-tól 1920-ig", url: "https://filmtett.ro/32305/balogh-gyongyi-zagoni-balint-szerk-a-kolozsvari-filmgyartas-kepes-tortenete-1913-tol-1920-ig/" },
          { t: "Janovics Jenő munkássága a két világháború között – A némafilmektől a híradó- és oktatófilmekig", url: "https://filmtett.ro/cikk/a-nemafilmektol-a-hirado-es-oktatofilmekig-janovics-jeno-munkassaga-a-ket-vilaghaboru-kozott" },
          { t: "Kolozsvári Állami Magyar Színház: Műszaki leírás – Stúdióterem", url: "https://www.huntheater.ro/a-szinhaz/muszaki-leiras/" },
          { t: "Hungarian Theatre of Cluj: Janovics (performance)", url: "https://www.huntheater.ro/en/shows/661/janovics/" }
        ],
        text: {
          en: `The present-day Studio Theatre was built in 2008, during Gábor Tompa’s tenure as artistic director, based on designs by architect Teodor Raiciu, on the site where Jenő Janovics’s film studio once stood.

Jenő Janovics was fascinated by cinema at a time when most theatre professionals did not yet take it seriously. As early as 1907, he was filming on the streets of Cluj, and in 1913, his film The Yellow Foal, produced in collaboration with the French company Pathé, was screened in nearly forty countries. By 1920, his studio had produced more than sixty silent films. His film studio stood right here, in the courtyard of the Summer Theatre, today’s Hungarian Theatre: a simple glass-roofed hall. Many scenes were filmed outdoors, right here in Central Park. He also used the revenue from his cinemas to support the theatre.

Janovics brought young talents to Cluj. One of them was Mihály Kertész from Budapest. In 1914, Kertész directed The Undesirable for Janovics, featuring Mari Jászai, a legendary figure of Hungarian theatre. It is the only surviving film featuring Mari Jászai: an English-language print was discovered in the basement of the Hungarian House in New York. Another young talent was Sándor Korda, later known as Sir Alexander Korda, one of the most prominent producers in British cinema.

Kertész went to Hollywood, where he became internationally famous under the name Michael Curtiz. In 1942, he directed Casablanca, starring Humphrey Bogart and Ingrid Bergman, for which he received the Academy Award for Best Director. Actors of Hungarian origin also appeared in front of the camera: Peter Lorre, born László Löwenstein, and S. Z. Sakall, known in Budapest as Szőke Szakáll.

“I think this is the beginning of a beautiful friendship” – and part of this story began right here, in Cluj.

This is where our walk comes to an end. Thank you for joining us! If you still have some time, two additional, optional stops await you.

At the theatre’s Documentation Centre, many elements of the story you have just discovered come to life through original documents, historical objects, plays, scripts, playbills and photographs.

At the Házsongárd Cemetery (Central Cemetery), you can find the resting places of many of the theatre personalities you have encountered along the way. A peaceful walk among centuries-old gravestones, in the shade of the trees, can be a fitting conclusion to this journey through history.

Feeling tired? It might be time for a little break! Thank you for joining us, enjoy discovering more of Cluj, and we hope to see you in the theatre audience soon!`,
          hu: `A mai Stúdiószínház 2008-ban, Tompa Gábor igazgatása idején, Teodor Raiciu építész tervei alapján épült, azon a helyen, ahol egykor Janovics Jenő filmstúdiója működött.

Janovics Jenőt már akkor lenyűgözte a film, amikor a legtöbb színházi ember még nem vette komolyan. Már 1907-ben forgatott Kolozsvár utcáin, és 1913-ban a francia Pathé céggel közösen készített filmjét, a „Sárga csikót” csaknem negyven országban vetítették. 1920-ig stúdiója több mint hatvan némafilmet készített. Éppen itt állt a műterme, a Nyári Színkör, a mai Magyar Színház udvarán: egy egyszerű, üvegtetős csarnok. Sok jelenetet a szabadban forgattak, itt, a Sétatéren. Mozijainak bevételéből a színház működését is finanszírozta.

Janovics fiatal tehetségeket hozott Kolozsvárra. Egyikük a budapesti Kertész Mihály volt. 1914-ben Kertész rendezte neki „A tolonc” című filmet, amelyben a magyar színjátszás legendás alakja, Jászai Mari is szerepelt. Ez Jászai Mari egyetlen fennmaradt filmje: angol nyelvű kópiája a New York-i Magyar Ház pincéjéből került elő. Egy másik fiatal tehetség Korda Sándor volt, a későbbi Sir Alexander Korda, a brit filmgyártás egyik legjelentősebb producere.

Kertész Hollywoodba ment, és Michael Curtiz néven vált világhírűvé. 1942-ben ott forgatta a „Casablancát” Humphrey Bogart és Ingrid Bergman főszereplésével, amelyért megkapta a legjobb rendezőnek járó Oscar-díjat. A kamera előtt magyar származású színészek is álltak: Peter Lorre, született Löwenstein László, és S. Z. Sakall, akit Budapesten Szőke Szakállként ismertek.

„Azt hiszem, ez egy gyönyörű barátság kezdete” – és ennek a történetnek egy darabja itt, Kolozsváron kezdődött.

Itt ér véget sétánk. Köszönjük, hogy velünk tartott! Ha még van ideje, két további, választható állomás várja.

A színház Dokumentációs Tárában az imént megismert történet számos emléke elevenedik meg eredeti dokumentumok, korabeli tárgyak, színdarabok, szövegkönyvek, színlapok és fényképek révén.

A Házsongárdi temetőben pedig megtalálhatja a sétánk során megismert számos színházi személyiség nyughelyét. Az évszázados síremlékek között, a fák árnyékában tett séta méltó és nyugalmas lezárása lehet ennek a történelmi utazásnak.

Ha elfáradt, itt az ideje egy kis pihenésnek! Köszönjük, hogy velünk tartott, további szép felfedezéseket kívánunk Kolozsváron, és reméljük, hamarosan a színház nézőterén is találkozunk!`,
          ro: `Actuala Sală Studio a fost construită în anul 2008, în perioada directoratului lui Gábor Tompa, după planurile arhitectului Teodor Raiciu, pe locul unde odinioară funcționa studioul cinematografic al lui Jenő Janovics.

Jenő Janovics era fascinat de cinematografie într-o perioadă în care majoritatea oamenilor de teatru încă nu o luau în serios. Încă din 1907 filma pe străzile Clujului, iar în 1913 filmul său Mânzul galben, realizat în colaborare cu compania franceză Pathé, a fost proiectat în aproape patruzeci de țări. Până în 1920, studioul său a produs peste șaizeci de filme mute. Studioul cinematografic se afla chiar aici, în curtea Teatrului de Vară, actualul Teatru Maghiar: o hală simplă, cu acoperiș de sticlă. Numeroase scene au fost filmate în aer liber, chiar aici, în Parcul Central. Din veniturile cinematografelor sale, Janovics susținea și activitatea teatrului.

Janovics a atras la Cluj tinere talente. Unul dintre acestea a fost Mihály Kertész, originar din Budapesta. În 1914, Kertész a regizat pentru Janovics filmul A tolonc (Deportata), în care a jucat și Mari Jászai, o personalitate legendară a teatrului maghiar. Acesta este singurul film păstrat în care apare Mari Jászai: o copie în limba engleză a fost descoperită în subsolul Casei Maghiare din New York. Un alt tânăr talent a fost Sándor Korda, cunoscut mai târziu sub numele de Sir Alexander Korda, unul dintre cei mai importanți producători ai cinematografiei britanice.

Kertész a plecat la Hollywood, unde a devenit celebru în întreaga lume sub numele de Michael Curtiz. În 1942 a regizat filmul Casablanca, cu Humphrey Bogart și Ingrid Bergman în rolurile principale, pentru care a primit premiul Oscar pentru cea mai bună regie. În fața camerei s-au aflat și actori de origine maghiară: Peter Lorre, născut László Löwenstein, și S. Z. Sakall, cunoscut la Budapesta sub numele de Szőke Szakáll.

„Cred că acesta este începutul unei frumoase prietenii” – iar o parte din această poveste a început chiar aici, la Cluj.

Aici se încheie plimbarea noastră. Vă mulțumim că ne-ați însoțit! Dacă mai aveți timp, vă așteaptă încă două opriri opționale.

În Centrul de Documentare al teatrului, numeroase mărturii ale istoriei pe care tocmai ați descoperit-o prind viață prin documente originale, obiecte de epocă, piese de teatru, texte dramatice, afișe de spectacol și fotografii.

În Cimitirul Central (Házsongárd) veți putea descoperi locurile de veci ale multor personalități teatrale pe care le-ați întâlnit pe parcursul traseului. O plimbare liniștită printre monumentele funerare vechi de secole, la umbra copacilor, poate fi o încheiere potrivită a acestei călătorii în istorie.

Ați obosit? Poate că este timpul pentru o mică pauză! Vă mulțumim că ne-ați însoțit, vă dorim noi descoperiri frumoase la Cluj și sperăm să ne revedem curând în sala de spectacole!`
        },
        activity: {
          icon: "🎬",
          title: { en: "Hungarians in “Casablanca”", hu: "Magyarok a „Casablancában”", ro: "Maghiari în „Casablanca”" },
          text: { en: "Who are they?", hu: "Kik ők?", ro: "Cine sunt?" },
          items: {
            en: ["Michael Curtiz (Kertész Mihály) – director, Oscar 1944", "Peter Lorre (Löwenstein László) – as Ugarte", "S. Z. Sakall (Szőke Szakáll) – as head waiter Carl"],
            hu: ["Michael Curtiz (Kertész Mihály) – rendező, Oscar-díj 1944", "Peter Lorre (Löwenstein László) – Ugarte szerepében", "S. Z. Sakall (Szőke Szakáll) – Carl főpincér szerepében"],
            ro: ["Michael Curtiz (Mihály Kertész) – regie, Oscar 1944", "Peter Lorre (László Löwenstein) – în rolul lui Ugarte", "S. Z. Sakall (Szőke Szakáll) – în rolul chelnerului-șef Carl"]
          }
        },
        links: [
          { label: { en: "Watch “A tolonc” (1914) – National Film Institute", hu: "„A tolonc” (1914) – Nemzeti Filmintézet", ro: "Vizionați „A tolonc” (1914) – Institutul Național de Film" }, url: "https://nfi.hu/alapfilmek-1/alapfilmek-filmek/jatekfilm/a-tolonc-1.html" },
        { label: { en: "Hungarian actors (actors.hu)", hu: "Magyar színészek (actors.hu)", ro: "Actori maghiari (actors.hu)" }, url: "https://actors.hu" }
        ]
      },
      {
        id: "08-dokumentation",
        optional: true,
        year: "",
        coords: [46.767892, 23.587263],
        title: { en: "Documentation Centre of the Hungarian Theatre", hu: "A Magyar Színház Dokumentációs Tára", ro: "Centrul de Documentare al Teatrului Maghiar", tr: "Macar Tiyatrosu Dokümantasyon Merkezi", fa: "مرکز اسناد تئاتر مجاری", es: "Centro de Documentación del Teatro Húngaro", ca: "Centre de Documentació del Teatre Hongarès", de: "Dokumentationszentrum des Ungarischen Theaters", ar: "مركز توثيق المسرح المجري", fr: "Centre de documentation du Théâtre hongrois" },
        subtitle: { en: "The theatre's memory", hu: "A színház emlékezete", ro: "Memoria teatrului", tr: "Tiyatronun belleği", fa: "حافظهٔ تئاتر", es: "La memoria del teatro", ca: "La memòria del teatre", de: "Das Gedächtnis des Theaters", ar: "ذاكرة المسرح", fr: "La mémoire du théâtre" },
        address: { en: "Str. Napoca 16, corner of Str. Samuil Micu", hu: "Napoca utca 16, a Samuil Micu utca sarkán", ro: "Str. Napoca 16, colț cu Str. Samuil Micu", tr: "Str. Napoca 16, Str. Samuil Micu köşesi", fa: "خیابان ناپوکا ۱۶، نبش خیابان ساموئیل میکو", es: "Str. Napoca 16, esquina con Str. Samuil Micu", ca: "Str. Napoca 16, cantonada amb Str. Samuil Micu", de: "Str. Napoca 16, Ecke Str. Samuil Micu", ar: "شارع نابوكا 16، عند تقاطعه مع شارع صموئيل ميكو", fr: "Str. Napoca 16, à l’angle de la Str. Samuil Micu" },
        media: [
          { src: "img/photos/doktar.jpg", caption: { en: "In the Documentation Centre of the Hungarian Theatre", hu: "A Magyar Színház Dokumentációs Tárában", ro: "În Centrul de Documentare al Teatrului Maghiar", tr: "Macar Tiyatrosu Dokümantasyon Merkezi'nde", fa: "در مرکز اسناد تئاتر مجاری", es: "En el Centro de Documentación del Teatro Húngaro", ca: "Al Centre de Documentació del Teatre Hongarès", de: "Im Dokumentationszentrum des Ungarischen Theaters", ar: "في مركز توثيق المسرح المجري", fr: "Au Centre de documentation du Théâtre hongrois" } }
        ],
        text: {
          en: `The theatre’s Documentation Centre preserves more than two centuries of theatrical heritage. Its collection includes numerous handwritten plays from the 19th century, scripts, historical playbills, photographs, costume designs and memorabilia, including valuable objects and documents dating back to the era of Jenő Janovics. The collection continues to grow with materials related to the theatre’s productions.

The process of separating and systematically organising materials of historical value was initiated by theatre historian Erzsébet Salat-Zakariás in the early 1990s. Since 2022, the Documentation Centre has been headed by Tünde Kocsis, theatre pedagogue and archivist.

The Centre is open daily from 12 noon to 4 pm, primarily for researchers, but it also warmly welcomes visitors, who can request a guided tour.

If you are curious to discover the original documents and objects behind the stories you have just encountered, this place is well worth a visit. Here, the past becomes tangible, and previously hidden stories come to light.`,
          hu: `A színház Dokumentációs Tára több mint két évszázad színháztörténeti örökségét őrzi. Gyűjteményében számos 19. századi kézzel írott színmű, szövegkönyv, korabeli színlap, fénykép, jelmezterv és emléktárgy található, köztük Janovics Jenő korszakából fennmaradt értékes tárgyak és dokumentumok. A gyűjtemény folyamatosan gyarapszik a színház előadásaihoz kapcsolódó anyagokkal.

A történeti értékű anyagok elkülönítését és szisztematikus rendszerezését Salat-Zakariás Erzsébet színháztörténész kezdte meg az 1990-es évek elején. A Dokumentációs Tárat 2022 óta Kocsis Tünde színházpedagógus és archivárius vezeti.

A Tár naponta 12 és 16 óra között tart nyitva, elsősorban kutatók számára, de szeretettel várja az érdeklődő látogatókat is, akik igény szerint tárlatvezetést kérhetnek.

Ha kíváncsi arra, milyen eredeti dokumentumok és tárgyak mesélnek az imént megismert történetekről, érdemes ellátogatnia ide. A múlt itt kézzelfogható közelségbe kerül, és újabb, eddig rejtett történetek tárulnak fel.`,
          ro: `Centrul de Documentare al teatrului păstrează un patrimoniu teatral de peste două secole. Colecția sa cuprinde numeroase piese de teatru în manuscris din secolul al XIX-lea, texte dramatice, afișe de epocă, fotografii, schițe de costume și obiecte memoriale, printre care obiecte și documente valoroase din perioada lui Jenő Janovics. Colecția se îmbogățește continuu cu materiale legate de spectacolele teatrului.

Separarea și organizarea sistematică a materialelor cu valoare istorică au fost inițiate la începutul anilor 1990 de către istoricul de teatru Erzsébet Salat-Zakariás. Din 2022, Centrul de Documentare este coordonat de Tünde Kocsis, pedagog teatral și arhivist.

Centrul este deschis zilnic între orele 12:00 și 16:00, fiind destinat în primul rând cercetătorilor, dar îi întâmpină cu drag și pe vizitatorii interesați, care pot solicita un tur ghidat.

Dacă sunteți curioși să descoperiți documentele și obiectele originale din spatele poveștilor pe care tocmai le-ați cunoscut, merită să vizitați acest loc. Aici, trecutul devine palpabil, iar povești până acum ascunse ies la lumină.`,
          tr: `Tiyatronun Dokümantasyon Merkezi, iki yüzyılı aşkın bir tiyatro mirasını koruyor. Koleksiyonunda 19. yüzyıldan kalma çok sayıda el yazması oyun, metin, dönem afişleri, fotoğraflar, kostüm tasarımları ve hatıra eşyaları, bunların arasında Jenő Janovics döneminden kalma değerli nesneler ve belgeler bulunuyor. Koleksiyon, tiyatronun yapımlarıyla ilgili malzemelerle sürekli zenginleşiyor.

Tarihî değeri olan malzemelerin ayrılması ve sistemli biçimde düzenlenmesi, 1990'ların başında tiyatro tarihçisi Erzsébet Salat-Zakariás tarafından başlatıldı. Merkezi 2022'den bu yana tiyatro pedagogu ve arşivci Tünde Kocsis yönetiyor.

Merkez her gün 12.00–16.00 arasında açık; öncelikle araştırmacılara hizmet veriyor, ancak ilgilenen ziyaretçileri de memnuniyetle ağırlıyor. Ziyaretçiler isterlerse rehberli tur talep edebilir.

Az önce dinlediğiniz öykülerin ardındaki özgün belgeleri ve nesneleri merak ediyorsanız, burası ziyarete değer. Burada geçmiş elle tutulur hâle geliyor ve şimdiye dek gizli kalmış öyküler gün yüzüne çıkıyor.`,
          fa: `مرکز اسناد تئاتر میراثی تئاتری از بیش از دو سده را نگهداری می‌کند. مجموعهٔ آن شامل شمار زیادی نمایشنامهٔ دست‌نویس سدهٔ نوزدهم، متن‌های اجرا، پوسترهای تاریخی، عکس‌ها، طرح‌های لباس و یادگارهاست؛ از جمله اشیا و اسناد ارزشمندی از دوران یِنو یانوویچ. این مجموعه با مواد مربوط به اجراهای تئاتر پیوسته گسترش می‌یابد.

جداسازی و سامان‌دهی نظام‌مند مواد دارای ارزش تاریخی را اِرژبت شَلات-زاکاریاش، تاریخ‌نگار تئاتر، در آغاز دههٔ ۱۹۹۰ آغاز کرد. از سال ۲۰۲۲ مدیریت مرکز اسناد بر عهدهٔ توندِه کوچیش، مربی تئاتر و بایگان، است.

این مرکز هر روز از ساعت ۱۲ تا ۱۶ باز است و در درجهٔ نخست به پژوهشگران خدمت می‌کند، اما بازدیدکنندگان علاقه‌مند را نیز با گرمی می‌پذیرد؛ آنان می‌توانند درخواست بازدید همراه با راهنما کنند.

اگر کنجکاوید اسناد و اشیای اصلی پشت داستان‌هایی را که هم‌اکنون شنیدید ببینید، این مکان ارزش بازدید دارد. اینجا گذشته ملموس می‌شود و داستان‌هایی که تاکنون پنهان مانده بودند آشکار می‌شوند.`,
          es: `El Centro de Documentación del teatro conserva un patrimonio teatral de más de dos siglos. Su colección incluye numerosas obras manuscritas del siglo XIX, libretos, carteles de época, fotografías, figurines de vestuario y objetos de recuerdo, entre ellos valiosos objetos y documentos de la época de Jenő Janovics. La colección sigue creciendo con materiales relacionados con los montajes del teatro.

La separación y la organización sistemática de los materiales de valor histórico las inició a comienzos de la década de 1990 la historiadora del teatro Erzsébet Salat-Zakariás. Desde 2022 dirige el Centro Tünde Kocsis, pedagoga teatral y archivera.

El Centro abre todos los días de 12:00 a 16:00, principalmente para investigadores, pero también recibe con gusto a los visitantes interesados, que pueden solicitar una visita guiada.

Si sientes curiosidad por ver los documentos y objetos originales que hay detrás de las historias que acabas de conocer, merece la pena visitarlo. Aquí el pasado se vuelve tangible y salen a la luz historias hasta ahora ocultas.`,
          ca: `El Centre de Documentació del teatre conserva un patrimoni teatral de més de dos segles. La seva col·lecció inclou nombroses obres manuscrites del segle XIX, llibrets, cartells d’època, fotografies, figurins de vestuari i objectes de record, entre els quals objectes i documents valuosos de l’època de Jenő Janovics. La col·lecció continua creixent amb materials relacionats amb els muntatges del teatre.

La separació i l’organització sistemàtica dels materials de valor històric les va iniciar a principis dels anys noranta la historiadora del teatre Erzsébet Salat-Zakariás. Des del 2022 dirigeix el Centre Tünde Kocsis, pedagoga teatral i arxivera.

El Centre obre cada dia de 12 a 16 h, principalment per a investigadors, però també rep amb molt de gust els visitants interessats, que poden demanar una visita guiada.

Si tens curiositat per veure els documents i objectes originals que hi ha darrere de les històries que acabes de conèixer, val la pena visitar-lo. Aquí el passat es fa tangible i surten a la llum històries fins ara amagades.`,
          de: `Das Dokumentationszentrum des Theaters bewahrt ein Theatererbe aus mehr als zwei Jahrhunderten. Zur Sammlung gehören zahlreiche handgeschriebene Stücke aus dem 19. Jahrhundert, Textbücher, historische Theaterzettel, Fotografien, Kostümentwürfe und Erinnerungsstücke, darunter wertvolle Gegenstände und Dokumente aus der Ära von Jenő Janovics. Die Sammlung wächst ständig um Material zu den Inszenierungen des Theaters.

Mit der Aussonderung und systematischen Ordnung der historisch wertvollen Bestände begann die Theaterhistorikerin Erzsébet Salat-Zakariás Anfang der 1990er-Jahre. Seit 2022 leitet die Theaterpädagogin und Archivarin Tünde Kocsis das Dokumentationszentrum.

Das Zentrum ist täglich von 12 bis 16 Uhr geöffnet, vor allem für Forschende, heißt aber auch interessierte Besucherinnen und Besucher herzlich willkommen; auf Wunsch gibt es eine Führung.

Wenn du neugierig bist, welche Originaldokumente und Gegenstände hinter den Geschichten stehen, die du gerade gehört hast, lohnt sich ein Besuch. Hier wird die Vergangenheit greifbar, und bisher verborgene Geschichten kommen ans Licht.`,
          ar: `يحفظ مركز التوثيق التابع للمسرح تراثًا مسرحيًا يمتد لأكثر من قرنين. وتضم مجموعته مسرحيات كثيرة مكتوبة بخط اليد من القرن التاسع عشر، ونصوصًا مسرحية، وملصقات عروض تاريخية، وصورًا، وتصاميم أزياء، وتذكارات، من بينها قطع ووثائق قيّمة من عهد يينو يانوفيتش. وتنمو المجموعة باستمرار بمواد تتعلق بعروض المسرح.

بدأت مؤرخة المسرح إرجيبت شالات-زاكارياش في مطلع تسعينيات القرن العشرين فرز المواد ذات القيمة التاريخية وتنظيمها بصورة منهجية. ومنذ عام 2022 تدير مركز التوثيق تونده كوتشيش، المربية المسرحية وأمينة الأرشيف.

يفتح المركز أبوابه يوميًا من الساعة 12 ظهرًا حتى 4 عصرًا، وهو مخصص أساسًا للباحثين، لكنه يرحب أيضًا بالزوار المهتمين الذين يمكنهم طلب جولة بصحبة مرشد.

إذا كنت تتشوق إلى رؤية الوثائق والقطع الأصلية التي تقف وراء الحكايات التي سمعتها للتو، فهذا المكان يستحق الزيارة. هنا يصبح الماضي ملموسًا، وتظهر إلى النور حكايات ظلت مخفية حتى الآن.`,
          fr: `Le Centre de documentation du théâtre conserve un patrimoine théâtral de plus de deux siècles. Sa collection comprend de nombreuses pièces manuscrites du XIXe siècle, des livrets, des affiches d’époque, des photographies, des maquettes de costumes et des souvenirs, dont des objets et documents précieux de l’époque de Jenő Janovics. La collection s’enrichit sans cesse de documents liés aux spectacles du théâtre.

Le tri et le classement systématique des documents ayant une valeur historique ont été entrepris au début des années 1990 par l’historienne du théâtre Erzsébet Salat-Zakariás. Depuis 2022, le Centre est dirigé par Tünde Kocsis, pédagogue théâtrale et archiviste.

Le Centre est ouvert tous les jours de 12 h à 16 h, en premier lieu pour les chercheurs, mais il accueille aussi chaleureusement les visiteurs intéressés, qui peuvent demander une visite guidée.

Si vous êtes curieux de découvrir les documents et objets originaux qui se cachent derrière les histoires que vous venez d’entendre, cet endroit mérite une visite. Ici, le passé devient tangible et des histoires jusque-là cachées voient le jour.`
        }
      },
      {
        id: "04-hazsongard",
        optional: true,
        year: 1585,
        coords: [46.765747, 23.591716],
        title: { en: "Házsongárd Central Cemetery", hu: "Házsongárdi temető", ro: "Cimitirul Central (Hajongard)" },
        subtitle: { en: "Házsongárdi temető · Cimitirul Central", hu: "Házsongárdi temető · Központi temető", ro: "Cimitirul Central · Házsongárdi temető" },
        address: { en: "Str. Avram Iancu, Cluj-Napoca", hu: "Avram Iancu utca, Kolozsvár", ro: "Str. Avram Iancu, Cluj-Napoca" },
        media: [
          img("15921-hazsongard2.jpg", {
            en: "The tomb of Mária Néb in the Házsongárd Cemetery",
            hu: "Néb Mária sírja a Házsongárdi temetőben",
            ro: "Mormântul Máriei Néb în Cimitirul Central"
          }),
          img("15895-gidofalvi-jantso-pal.jpg", {
            en: "Pál Jantsó Gidófalvi (1761–1845), the “serious comedian”",
            hu: "Gidófalvi Jantsó Pál (1761–1845), a „komoly komikus”",
            ro: "Pál Jantsó Gidófalvi (1761–1845), „comicul serios”"
          })
        ],
        text: {
          en: `Házsongárd Cemetery was established in 1585, during a plague epidemic, on land belonging to the city that had been used for growing melons. From the very beginning, anyone could be buried here, regardless of their religion or language. Scholars, writers and artists rest here – along with many figures from the world of theatre.

Among them is Gidófalvi Pál Jantsó, one of the young nobles who founded the theatre company in 1792. He wanted to play heroes, but his tall, lanky figure, top hat and hooked nose made audiences laugh. According to legend, one evening he trampled on the laurel wreath presented to him and exclaimed: “Yesterday, when I played a proud and intelligent man, they booed me. Today, when I play a donkey, they applaud!” He became the first true comedian of the Cluj stage. Also buried here is Mária Néb, a brilliant comedy actress who resisted attempts to persuade her to move to Buda – she could not bear to leave her beloved city.

And here rests Jenő Janovics, whose name has accompanied us throughout our walk. He died in 1945, on the very day the theatre season was due to open. His grave stands where Anikó Székelyné Ungár was once buried – one of the great actresses of the Farkas Street Theatre, whom he deeply admired.

Pause for a moment. Theatre is the most ephemeral of all art forms – every performance exists only once. What remains is the memory of those who were there.`,
          hu: `A Házsongárdi temetőt 1585-ben, pestisjárvány idején alapították a város dinnyeföldjén. Kezdettől fogva bárki ide temetkezhetett, vallásától és nyelvétől függetlenül. Tudósok, írók, művészek nyugszanak itt – és a színház sok embere.

Közéjük tartozik Gidófalvi Jantsó Pál, az 1792-es alapító fiatal nemesek egyike. Hősöket szeretett volna játszani, de magas, nyurga alakja, cilindere és horgas orra nevetésre fakasztotta a közönséget. A legenda szerint egy este lábbal taposta meg a neki nyújtott babérkoszorút, és így kiáltott: „Tegnap, amikor büszke, okos embert játszottam, kifütyültek. Ma, amikor egy szamarat játszom, tapsolnak!” Ő lett a kolozsvári színpad első igazi komikusa. Itt nyugszik Néb Mária is, a ragyogó vígjátéki színésznő, akit hiába csábítottak Budára – nem tudott megválni városától.

És itt nyugszik Janovics Jenő, akinek neve az egész sétán végigkísért bennünket. 1945-ben halt meg, éppen a színházi évadnyitás napján. Sírja ott van, ahol egykor Székelyné Ungár Anikó nyugodott – a Farkas utcai színpad egyik nagy színésznője, akit mélyen tisztelt.

Álljon meg egy pillanatra. A színház a legmúlandóbb művészet – minden előadás csak egyszer létezik. Ami megmarad, az azok emléke, akik ott voltak.`,
          ro: `Cimitirul Házsongárd a fost înființat în 1585, în timpul unei epidemii de ciumă, pe un teren al orașului folosit pentru cultivarea pepenilor. Încă de la început, aici putea fi înmormântat oricine, indiferent de religie sau de limba vorbită. Aici își dorm somnul de veci oameni de știință, scriitori, artiști – și numeroase personalități ale teatrului.

Printre aceștia se numără Gidófalvi Jantsó Pál, unul dintre tinerii nobili care au fondat trupa de teatru în 1792. Își dorea să interpreteze roluri de eroi, însă statura sa înaltă și deșirată, jobenul și nasul acvilin stârneau râsul publicului. Potrivit legendei, într-o seară a călcat în picioare cununa de lauri care îi fusese oferită și a exclamat: „Ieri, când am interpretat rolul unui om mândru și inteligent, m-au fluierat. Astăzi, când joc rolul unui măgar, mă aplaudă!” A devenit primul adevărat actor de comedie al scenei clujene. Tot aici se odihnește și Néb Mária, o strălucită actriță de comedie, pe care au încercat în zadar să o atragă la Buda – nu se putea despărți de orașul său îndrăgit.

Și tot aici își doarme somnul de veci Janovics Jenő, al cărui nume ne-a însoțit pe tot parcursul plimbării. A murit în 1945, chiar în ziua în care urma să se deschidă stagiunea teatrală. Mormântul său se află în locul în care odinioară fusese înmormântată Székelyné Ungár Anikó – una dintre marile actrițe ale teatrului de pe strada Farkas, pe care Janovics o admira profund.

Opriți-vă pentru o clipă. Teatrul este cea mai efemeră dintre arte – fiecare reprezentație există o singură dată. Ceea ce rămâne este amintirea celor care au fost acolo.`
        },
        activity: {
          icon: "🕯️",
          title: { en: "On the trail: actors' graves", hu: "Nyomkeresés: színészsírok", ro: "Pe urmele actorilor: morminte" },
          text: {
            en: "Can you find these graves? (Exact locations to be added by the theatre.)",
            hu: "Megtalálja ezeket a sírokat? (A pontos helyeket a színház egészíti ki.)",
            ro: "Puteți găsi aceste morminte? (Locațiile exacte vor fi completate de teatru.)"
          },
          items: {
            en: ["Jenő Janovics (1872–1945) – director and film pioneer; section II. A, listed monument", "Pál Jantsó Gidófalvi (1761–1845) – co-founder, the first comedian", "Celesztin Pergő (1784–1858) – actor and director, next to Jantsó", "Mária Néb (1799–1884) – comic actress"],
            hu: ["Janovics Jenő (1872–1945) – színigazgató, a film úttörője; II. A parcella, műemlék", "Gidófalvi Jantsó Pál (1761–1845) – alapító, az első komikus", "Pergő Celesztin (1784–1858) – színész és igazgató, Jantsó mellett", "Néb Mária (1799–1884) – vígjátéki színésznő"],
            ro: ["Jenő Janovics (1872–1945) – director de teatru, pionier al filmului; parcela II. A, monument istoric", "Pál Jantsó Gidófalvi (1761–1845) – cofondator, primul actor de comedie", "Celesztin Pergő (1784–1858) – actor și director, lângă Jantsó", "Mária Néb (1799–1884) – actriță de comedie"]
          }
        }
      }
    ]
  };
})();
