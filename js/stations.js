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
 * Die Bilder werden direkt von huntheater.ro geladen; Nutzungsrechte mit
 * dem Theater klären.
 *
 * HINWEIS: Die Texte sind Entwürfe für den Prototyp und sollten vom Theater
 * geprüft, die ungarischen und rumänischen Fassungen von Muttersprachlern
 * gegengelesen werden.
 */
(function () {
  const ARCHIVE = "https://www.huntheater.ro/upload/img/ck/thumb/15/";
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
    title: { en: "Ioi!Cluj", hu: "Ioi!Cluj", ro: "Ioi!Cluj" },
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
    mediaCredit: {
      en: "Images: Documentation Centre of the Hungarian Theatre of Cluj",
      hu: "Képek: a Kolozsvári Állami Magyar Színház Dokumentációs Központja",
      ro: "Imagini: Centrul de Documentare al Teatrului Maghiar de Stat Cluj"
    },
    stations: [
      {
        id: "01-rhedey",
        year: 1792,
        coords: [46.76873, 23.58938],
        title: { en: "Rhédey Palace & Rhédey Café", hu: "Rhédey-palota és Rhédey Kávéház", ro: "Palatul Rhédey și Rhédey Café" },
        subtitle: { en: "Main Square · Piața Unirii · Főtér", hu: "Főtér · Piața Unirii", ro: "Piața Unirii · Főtér" },
        address: { en: "Piața Unirii 9, corner of Str. Napoca, Cluj-Napoca", hu: "Főtér (Piața Unirii) 9, a Napoca utca sarkán, Kolozsvár", ro: "Piața Unirii 9, colț cu Str. Napoca, Cluj-Napoca" },
        media: [
          img("15885-kamsz_archi_bir_5684.jpg", {
            en: "Rhédey House, the first venue of the Hungarian theatre in Cluj",
            hu: "A Rhédey-ház, a kolozsvári magyar színjátszás első helyszíne",
            ro: "Casa Rhédey, primul spațiu al teatrului maghiar din Cluj"
          })
        ],
        text: {
          en: `Welcome to Cluj – or Kolozsvár, as the city is called in Hungarian. Look for the corner of the Main Square and Napoca Street, where the memorial of the 1989 revolution, the “Shot Pillars”, stands today. The building behind it is the Rhédey Palace.

This is where our story begins. In October 1792 a group of young nobles led by János Fejér asked the authorities for permission to perform plays in Hungarian. They wanted more than entertainment: they wanted to enrich and refine the Hungarian language. They were granted permission – in a reply that was more tolerant than enthusiastic.

But where to perform? Countess Rhédey, born Baroness Terézia Bánffy, offered them the ballroom of this palace, free of charge, for an entire year. On 17 December 1792 the company gave its first performance here, a play called “A titkos ellenkezés vagy Köleséri”. Hungarian-language theatre in Cluj has never stopped since – the Hungarian Theatre of Cluj counts its birthday from that night.

Imagine it: candlelight, a ballroom full of nobles and townspeople in silk and velvet, and young actors on an improvised stage, performing in their own language. Today the Rhédey Café welcomes guests within these old walls. And you are invited to become part of this story yourself: slip into a costume and stand, for a moment, on the stage of 1792.`,
          hu: `Üdvözöljük Kolozsváron! Keresse meg a Főtér és a Napoca utca sarkát, ahol ma az 1989-es forradalom emlékműve, a „Stâlpii Împușcați” áll. A mögötte álló épület a Rhédey-palota.

Itt kezdődik történetünk. 1792 októberében Fejér János vezetésével néhány fiatal nemes engedélyt kért arra, hogy magyar nyelvű színdarabokat adhasson elő. Nem csupán szórakoztatni akartak: a magyar nyelvet akarták gazdagítani és csiszolni. Az engedélyt megkapták – inkább türelmes, mint lelkes válasz formájában.

De hol játsszanak? Rhédey grófné, született Bánffy Terézia bárónő egy teljes évre ingyen átengedte nekik palotája báltermét. 1792. december 17-én itt tartotta a társulat első előadását, „A titkos ellenkezés vagy Köleséri” című darabot. Azóta Kolozsváron megszakítás nélkül folyik a magyar nyelvű színjátszás – a Kolozsvári Állami Magyar Színház ettől az estétől számítja születésnapját.

Képzelje el: gyertyafény, selyembe és bársonyba öltözött nemesekkel és polgárokkal teli bálterem, a rögtönzött színpadon pedig fiatal színészek, akik a saját anyanyelvükön játszanak. Ma a Rhédey Kávéház várja a vendégeket az öreg falak között. Önt pedig arra hívjuk, hogy maga is részese legyen ennek a történetnek: bújjon jelmezbe, és álljon egy pillanatra 1792 színpadára.`,
          ro: `Bine ați venit la Cluj – sau Kolozsvár, cum se numește orașul în limba maghiară. Căutați colțul dintre Piața Unirii și strada Napoca, unde se află astăzi monumentul revoluției din 1989, „Stâlpii Împușcați”. Clădirea din spatele lui este Palatul Rhédey.

Aici începe povestea noastră. În octombrie 1792, un grup de tineri nobili condus de János Fejér a cerut permisiunea de a juca piese de teatru în limba maghiară. Nu voiau doar să distreze publicul: voiau să îmbogățească și să rafineze limba maghiară. Au primit permisiunea – printr-un răspuns mai degrabă tolerant decât entuziast.

Dar unde să joace? Contesa Rhédey, născută baroneasa Terézia Bánffy, le-a oferit sala de bal a palatului, gratuit, pentru un an întreg. Pe 17 decembrie 1792, trupa a jucat aici primul său spectacol, piesa „A titkos ellenkezés vagy Köleséri”. De atunci, teatrul în limba maghiară nu s-a mai oprit la Cluj – Teatrul Maghiar de Stat Cluj își numără anii începând cu acea seară.

Imaginați-vă: lumina lumânărilor, o sală de bal plină de nobili și orășeni îmbrăcați în mătase și catifea, iar pe o scenă improvizată, tineri actori care joacă în propria lor limbă. Astăzi, Rhédey Café își primește oaspeții între aceste ziduri vechi. Iar dumneavoastră sunteți invitați să deveniți parte din această poveste: îmbrăcați un costum și urcați, pentru o clipă, pe scena anului 1792.`
        },
        activity: {
          icon: "🎭",
          photo: true,
          title: { en: "In costume, back to 1792", hu: "Jelmezben 1792-be", ro: "În costum, înapoi în 1792" },
          text: {
            en: "Historical costumes from the Hungarian Theatre's wardrobe are waiting for you at the Rhédey Café. Dress up, take a souvenir photo – and share it with #IoiCluj.",
            hu: "A Rhédey Kávéházban a Magyar Színház jelmeztárából származó történelmi jelmezek várják. Öltözzön be, készítsen emlékfotót – és ossza meg a #IoiCluj címkével.",
            ro: "La Rhédey Café vă așteaptă costume istorice din garderoba Teatrului Maghiar. Îmbrăcați-vă, faceți o fotografie de amintire – și distribuiți-o cu #IoiCluj."
          }
        },
        links: [ARTICLE]
      },
      {
        id: "02-matthias",
        year: 1443,
        coords: [46.77113, 23.58756],
        title: { en: "Birthplace of King Matthias", hu: "Mátyás király szülőháza", ro: "Casa natală a regelui Matia Corvin" },
        subtitle: { en: "Casa Matei Corvin · Mátyás király szülőháza", hu: "Mátyás király szülőháza", ro: "Casa Matei Corvin" },
        address: { en: "Str. Matei Corvin 6, Cluj-Napoca", hu: "Mátyás király utca (Str. Matei Corvin) 6, Kolozsvár", ro: "Str. Matei Corvin 6, Cluj-Napoca" },
        text: {
          en: `In this Gothic town house Matthias Hunyadi was born in 1443 – later King Matthias Corvinus. From 1458 to 1490 he ruled the Kingdom of Hungary and turned his court into one of the first centres of the Renaissance north of the Alps.

For the theatre, Matthias remains a grateful figure to this day. In popular tradition he became “Matthias the Just”, who travels the country in disguise, uncovers injustice and exposes the powerful. These stories were told, sung and performed – at fairs, in schools and on the great stages.

In fact, when the Hungarian actors of Cluj gave their first performance in their own permanent theatre in 1821, they chose a play about him: “King Matthias” by László Szentjóbi Szabó.

Today the house is used by the University of Art and Design. Art and Cluj still belong together here. Our next stop takes us to Farkas Street, where that first permanent theatre stood.`,
          hu: `Ebben a gótikus polgárházban született 1443-ban Hunyadi Mátyás, a későbbi Mátyás király. 1458 és 1490 között uralkodott a Magyar Királyság felett, udvarát pedig az Alpoktól északra a reneszánsz egyik első központjává tette.

A színház számára Mátyás ma is hálás figura. A néphagyományban ő lett „Igazságos Mátyás”, aki álruhában járja az országot, leleplezi az igazságtalanságot és megszégyeníti a hatalmasokat. Ezeket a történeteket mesélték, énekelték és eljátszották – vásárokon, iskolákban és a nagy színpadokon.

Amikor a kolozsvári magyar színészek 1821-ben első előadásukat tartották saját, állandó színházukban, róla szóló darabot választottak: Szentjóbi Szabó László „Mátyás király” című művét.

Ma a Művészeti és Design Egyetem használja az épületet. A művészet és Kolozsvár itt ma is összetartozik. Következő állomásunk a Farkas utca, ahol ez az első állandó színház állt.`,
          ro: `În această casă gotică s-a născut în 1443 Matia Hunyadi, viitorul rege Matia Corvin. Între 1458 și 1490 a condus Regatul Ungariei și a transformat curtea sa într-unul dintre primele centre ale Renașterii la nord de Alpi.

Pentru teatru, Matia rămâne până astăzi un personaj îndrăgit. În tradiția populară a devenit „Matia cel Drept”, care cutreieră țara deghizat, descoperă nedreptățile și îi demască pe cei puternici. Aceste povești au fost spuse, cântate și jucate – la târguri, în școli și pe marile scene.

De altfel, când actorii maghiari din Cluj au jucat pentru prima dată în propriul lor teatru permanent, în 1821, au ales o piesă despre el: „Regele Matia” de László Szentjóbi Szabó.

Astăzi, clădirea este folosită de Universitatea de Artă și Design. Arta și Clujul sunt și aici strâns legate. Următoarea oprire ne duce pe strada Kogălniceanu, vechea Farkas utca, unde s-a aflat acest prim teatru permanent.`
        }
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
          })
        ],
        text: {
          en: `You are standing at the corner of Farkas Street – Wolf Street, today Kogălniceanu Street – and the former Theatre Street, today Emmanuel de Martonne Street. Here stood the first stone theatre ever built for performances in Hungarian.

The actors had dreamed of their own house since 1793. In 1803 five aristocrats bought the plot from the Reformed College, and construction began, paid for by donations. In 1807 the money ran out, and work stopped for four years. Only in 1821 was the theatre designed by the Cluj architect Antal Alföldi finished: 800 seats, 50 boxes, and a stage lit by 200 candles.

The opening lasted two nights. On 12 March 1821 aristocratic amateurs played Theodor Körner's tragedy “Zrínyi” and afterwards donated their costly costumes to the theatre. On 13 March the professional company followed with “King Matthias”. For the opening a playwriting competition was also announced – and for it József Katona wrote “Bánk bán”, which became the Hungarian national drama.

For 85 years this was the company's home. Déryné Róza Széppataki sang here, and in 1869 the young Mari Jászai began the career that made her the greatest Hungarian tragedienne. And in January 1899 a young actor and director, Jenő Janovics, showed film scenes inside a play on this stage for the first time. Remember his name.

The theatre closed on 7 September 1906. Later it passed to the university, served as a store for the botanical museum and was finally demolished. In 1937 King Carol the Second opened the building you see today, the Academic College; since 1955 the Transilvania Philharmonic has played concerts in its Auditorium Maximum. So this corner has remained a stage. Look for the memorial plaque on the wall.

We continue south, up the hill, to the Central Cemetery, where some of these actors rest.`,
          hu: `Ön a Farkas utca – ma Mihail Kogălniceanu utca – és az egykori Színház utca, a mai Emmanuel de Martonne utca sarkán áll. Itt állt az első kőszínház, amelyet magyar nyelvű előadások számára építettek.

A színészek már 1793 óta saját házról álmodtak. 1803-ban öt főnemes megvásárolta a telket a Református Kollégiumtól, és adományokból megkezdődött az építkezés. 1807-ben elfogyott a pénz, a munka négy évre leállt. Csak 1821-ben készült el a kolozsvári Alföldi Antal tervezte színház: 800 férőhely, 50 páholy, a színpadot pedig 200 gyertya világította meg.

A megnyitó két estén át tartott. 1821. március 12-én főúri műkedvelők adták elő Theodor Körner „Zrínyi” című tragédiáját, drága jelmezeiket pedig utána a színháznak ajándékozták. Március 13-án a hivatásos társulat következett a „Mátyás király” című darabbal. A megnyitó alkalmából drámapályázatot is hirdettek – erre írta Katona József a „Bánk bánt”, amelyből a magyar nemzeti dráma lett.

Nyolcvanöt évig ez volt a társulat otthona. Itt énekelt Déryné Széppataki Róza, és itt kezdte 1869-ben pályáját a fiatal Jászai Mari, aki később a legnagyobb magyar tragika lett. 1899 januárjában pedig egy fiatal színész és rendező, Janovics Jenő, ezen a színpadon vetített először filmjeleneteket egy színházi előadásban. Jegyezze meg a nevét!

A színház 1906. szeptember 7-én bezárt. Később az egyetemé lett, a botanikus múzeum raktáraként szolgált, végül lebontották. 1937-ben II. Károly király avatta fel a ma itt álló épületet, az Akadémiai Kollégiumot; Auditorium Maximum termében 1955 óta a kolozsvári filharmónia hangversenyez. Ez a sarok tehát színpad maradt. Keresse meg a falon az emléktáblát!

Délnek folytatjuk utunkat, fel a dombra, a Házsongárdi temetőbe, ahol e színészek közül többen nyugszanak.`,
          ro: `Vă aflați la colțul străzii Farkas – strada Lupilor, astăzi Mihail Kogălniceanu – cu fosta stradă a Teatrului, astăzi Emmanuel de Martonne. Aici s-a aflat primul teatru din piatră construit pentru spectacole în limba maghiară.

Actorii visau la propria clădire încă din 1793. În 1803, cinci aristocrați au cumpărat terenul de la Colegiul Reformat, iar construcția a început din donații. În 1807 banii s-au terminat, iar lucrările au stat patru ani. Abia în 1821 a fost gata teatrul proiectat de arhitectul clujean Antal Alföldi: 800 de locuri, 50 de loje și o scenă luminată de 200 de lumânări.

Inaugurarea a durat două seri. Pe 12 martie 1821, actori amatori aristocrați au jucat tragedia „Zrínyi” de Theodor Körner, apoi au donat teatrului costumele lor scumpe. Pe 13 martie a urmat trupa profesionistă, cu piesa „Regele Matia”. Cu ocazia inaugurării a fost anunțat și un concurs de dramaturgie – pentru el a scris József Katona piesa „Bánk bán”, devenită drama națională maghiară.

Timp de 85 de ani, aceasta a fost casa trupei. Aici a cântat Déryné Róza Széppataki, iar în 1869 și-a început aici cariera tânăra Mari Jászai, care a devenit apoi cea mai mare tragediană maghiară. Iar în ianuarie 1899, un tânăr actor și regizor, Jenő Janovics, a proiectat pentru prima dată pe această scenă scene de film în cadrul unui spectacol. Rețineți-i numele.

Teatrul s-a închis pe 7 septembrie 1906. Mai târziu a trecut la universitate, a servit drept depozit al muzeului botanic și, în cele din urmă, a fost demolat. În 1937, regele Carol al II-lea a inaugurat clădirea de astăzi, Colegiul Academic; în sala Auditorium Maximum concertează din 1955 Filarmonica „Transilvania”. Așadar, acest colț a rămas o scenă. Căutați placa memorială de pe zid.

Continuăm spre sud, urcând dealul, către Cimitirul Central, unde se odihnesc câțiva dintre acești actori.`
        },
        links: [ARTICLE]
      },
      {
        id: "04-hazsongard",
        year: 1585,
        coords: [46.76266, 23.59300],
        draftLocation: true,
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
          en: `The Házsongárd Cemetery, today the Central Cemetery, was founded in 1585, during a plague, on the town's melon field. From the very beginning anyone could be buried here, whatever their religion or language. Scholars, writers and artists rest here – and many people of the theatre.

One of them is Pál Jantsó Gidófalvi, one of the young nobles who founded the company in 1792. He longed to play heroes, but his tall, lanky figure, his top hat and his hooked nose made audiences laugh. Legend has it that one night he trampled the laurel wreath he was given and shouted: “Yesterday, when I played a proud, wise man, you whistled. Today, when I play a jackass, you applaud!” He became the first true comedian of the Cluj stage. Next to him rests his colleague Celesztin Pergő. Here, too, lies Mária Néb, a brilliant comic actress who was lured to Buda in vain – she could not leave her city.

And here lies Jenő Janovics, the man who will accompany us for the rest of the tour. He died in 1945, on the very day the theatre season opened. His grave lies where the actress Anikó Ungár was once buried – one of the great actresses of the Farkas Street stage, whom he deeply admired.

Take a moment. Theatre is the most fleeting of all arts – every performance exists only once. What remains is the memory of the people who were there.`,
          hu: `A Házsongárdi temetőt – ma hivatalosan Központi temető – 1585-ben, pestisjárvány idején alapították a város dinnyeföldjén. Kezdettől fogva bárki ide temetkezhetett, vallásától és nyelvétől függetlenül. Tudósok, írók, művészek nyugszanak itt – és a színház sok embere.

Közéjük tartozik Gidófalvi Jantsó Pál, az 1792-es alapító fiatal nemesek egyike. Hősöket szeretett volna játszani, de magas, nyurga alakja, cilindere és horgas orra nevetésre fakasztotta a közönséget. A legenda szerint egy este lábbal taposta meg a neki nyújtott babérkoszorút, és így kiáltott: „Tegnap, amikor büszke, okos embert játszottam, kifütyültek. Ma, amikor egy szamarat játszom, tapsolnak!” Ő lett a kolozsvári színpad első igazi komikusa. Mellette nyugszik kollégája, Pergő Celesztin. Itt nyugszik Néb Mária is, a ragyogó vígjátéki színésznő, akit hiába csábítottak Budára – nem tudott megválni városától.

És itt nyugszik Janovics Jenő, aki túránk hátralévő részében végig elkísér bennünket. 1945-ben halt meg, éppen a színházi évadnyitás napján. Sírja ott van, ahol egykor Székelyné Ungár Anikó nyugodott – a Farkas utcai színpad egyik nagy színésznője, akit mélyen tisztelt.

Álljon meg egy pillanatra. A színház a legmúlandóbb művészet – minden előadás csak egyszer létezik. Ami megmarad, az azok emléke, akik ott voltak.`,
          ro: `Cimitirul Central, cunoscut și ca Házsongárd sau Hajongard, a fost înființat în 1585, în timpul unei epidemii de ciumă, pe fostul teren cu pepeni al orașului. De la început, aici putea fi înmormântat oricine, indiferent de religie sau limbă. Aici odihnesc savanți, scriitori, artiști – și mulți oameni ai teatrului.

Unul dintre ei este Pál Jantsó Gidófalvi, unul dintre tinerii nobili care au fondat trupa în 1792. Și-ar fi dorit să joace eroi, dar silueta lui înaltă și deșirată, jobenul și nasul coroiat stârneau râsul publicului. Legenda spune că într-o seară a călcat în picioare coroana de lauri primită și a strigat: „Ieri, când am jucat un om mândru și înțelept, m-ați fluierat. Azi, când joc un măgar, mă aplaudați!” A devenit primul adevărat actor de comedie al scenei clujene. Lângă el se odihnește colegul său, Celesztin Pergő. Tot aici se află Mária Néb, o strălucită actriță de comedie, pe care cei din Buda au încercat în zadar să o atragă – nu s-a putut despărți de orașul ei.

Și tot aici se odihnește Jenő Janovics, omul care ne va însoți pe tot restul turului. A murit în 1945, chiar în ziua deschiderii stagiunii. Mormântul lui se află pe locul unde fusese înmormântată actrița Anikó Ungár – una dintre marile actrițe ale scenei de pe strada Farkas, pe care el o admira profund.

Opriți-vă pentru o clipă. Teatrul este cea mai efemeră dintre arte – fiecare spectacol există o singură dată. Ceea ce rămâne este amintirea celor care au fost de față.`
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
          }),
          img("15916-kep-13.5..jpg", {
            en: "Poster of the festive performance, 1906",
            hu: "Az 1906-os díszelőadás plakátja",
            ro: "Afișul spectacolului festiv din 1906"
          })
        ],
        text: {
          en: `In front of you stands the Lucian Blaga National Theatre, which is also home to the Romanian Opera. It was built as the new Hungarian National Theatre, designed by the Viennese architects Fellner and Helmer, and opened on 8 September 1906 under its director Jenő Janovics. Into the new stage he set a piece of the floorboards of the old Farkas Street theatre – as a sign that the story goes on.

Then the First World War ended. On 21 December 1918, with Romanian troops close to the city, Janovics gathered about two hundred and fifty actors, musicians and stagehands on this stage at dawn. “As long as I breathe, I will defend this theatre that has been entrusted to me.” His wife, the actress Lili Poór, answered: “We stay here!” – and everyone repeated it.

Transylvania became part of Romania. For Romanians, who had long been hindered here from playing theatre in their own language, taking over this house was a matter of national pride. In May 1919 the takeover was ordered. On 30 September 1919 the Hungarian company played here for the last time: Hamlet, with Janovics in the title role. The censors had cut the great monologue down to its first line. When Janovics spoke “To be, or not to be” straight to the audience, a woman cried out: “We want to live!” – and two thousand voices joined in. Police cleared the house. The next morning the building passed to the Romanian National Theatre.

Between 1940 and 1945, after the Second Vienna Award, the Hungarian company played here once more. Today the Romanian and the Hungarian theatres of Cluj perform a few hundred metres apart – and both belong to this city.

But Janovics was not only a man of the theatre. Our next stop takes us into the world of film.`,
          hu: `Ön előtt a Lucian Blaga Nemzeti Színház áll, amelyben a Román Opera is otthonra talált. Új magyar Nemzeti Színháznak épült, a bécsi Fellner és Helmer tervei szerint, és 1906. szeptember 8-án nyílt meg Janovics Jenő igazgatása alatt. Az új színpadba Janovics beépíttetett egy darabot a régi Farkas utcai színpad deszkáiból – annak jeléül, hogy a történet folytatódik.

Aztán véget ért az első világháború. 1918. december 21-én hajnalban, amikor a román csapatok már a város közelében jártak, Janovics mintegy kétszázötven színészt, zenészt és műszaki dolgozót gyűjtött össze ezen a színpadon. „Ezt a színházat, amelyet gondozásomra bíztak, védeni fogom, amíg lélegzem.” Felesége, Poór Lili színésznő így felelt: „Itt maradunk!” – és mindenki megismételte.

Erdély Romániához került. A románok számára, akiket itt sokáig akadályoztak abban, hogy saját nyelvükön színházat játsszanak, a ház átvétele nemzeti büszkeség kérdése volt. 1919 májusában elrendelték az átvételt. 1919. szeptember 30-án a magyar társulat utoljára játszott itt: a Hamletet adták, a címszerepben Janovics Jenővel. A cenzúra a nagymonológból csak az első sort hagyta meg. Amikor Janovics a „Lenni vagy nem lenni” kérdését egyenesen a közönséghez intézte, egy nő felkiáltott: „Élni akarunk!” – és kétezer hang csatlakozott hozzá. A rendőrség ürítette ki a nézőteret. Másnap reggel az épület a Román Nemzeti Színházé lett.

1940 és 1945 között, a második bécsi döntés után, a magyar társulat még egyszer itt játszott. Ma Kolozsvár román és magyar színháza néhány száz méterre játszik egymástól – és mindkettő ehhez a városhoz tartozik.

Janovics azonban nemcsak színházi ember volt. Következő állomásunk a film világába visz.`,
          ro: `În fața dumneavoastră se află Teatrul Național „Lucian Blaga”, care adăpostește și Opera Națională Română. A fost construit ca noul Teatru Național Maghiar, după planurile arhitecților vienezi Fellner și Helmer, și s-a deschis pe 8 septembrie 1906, sub conducerea directorului Jenő Janovics. În noua scenă, Janovics a încorporat o bucată din scândurile vechii scene de pe strada Farkas – ca semn că povestea continuă.

Apoi s-a încheiat Primul Război Mondial. Pe 21 decembrie 1918, în zori, cu trupele române aproape de oraș, Janovics a adunat pe această scenă aproximativ două sute cincizeci de actori, muzicieni și tehnicieni. „Atâta timp cât respir, voi apăra acest teatru care mi-a fost încredințat.” Soția lui, actrița Lili Poór, a răspuns: „Rămânem aici!” – și toți au repetat.

Transilvania a devenit parte a României. Pentru români, care fuseseră multă vreme împiedicați aici să joace teatru în propria limbă, preluarea acestei clădiri a fost o chestiune de mândrie națională. În mai 1919 s-a dispus preluarea. Pe 30 septembrie 1919, trupa maghiară a jucat aici pentru ultima dată: Hamlet, cu Janovics în rolul titular. Cenzura redusese marele monolog la primul vers. Când Janovics a adresat întrebarea „A fi sau a nu fi” direct publicului, o femeie a strigat: „Vrem să trăim!” – și două mii de voci i s-au alăturat. Poliția a evacuat sala. A doua zi dimineață, clădirea a trecut la Teatrul Național Român.

Între 1940 și 1945, după Dictatul de la Viena, trupa maghiară a jucat aici încă o dată. Astăzi, teatrul românesc și cel maghiar din Cluj joacă la câteva sute de metri unul de celălalt – și amândouă aparțin acestui oraș.

Dar Janovics nu a fost doar un om de teatru. Următoarea oprire ne duce în lumea filmului.`
        },
        links: [ARTICLE]
      },
      {
        id: "06-casablanca",
        year: 1942,
        coords: [46.77138, 23.58308],
        draftLocation: true,
        title: { en: "From Kolozsvár to Casablanca", hu: "Kolozsvártól Casablancáig", ro: "De la Cluj la Casablanca" },
        subtitle: { en: "Kertész Mihály · Michael Curtiz", hu: "Kertész Mihály · Michael Curtiz", ro: "Mihály Kertész · Michael Curtiz" },
        address: { en: "Central Park", hu: "Sétatér (Parcul Central)", ro: "Parcul Central" },
        media: [
          img("15913-kep-13.4.1..jpg", {
            en: "Film on the Cluj stage, 1899",
            hu: "Film a kolozsvári színpadon, 1899",
            ro: "Film pe scena clujeană, 1899"
          }),
          img("15932-janovits.jpg", {
            en: "Jenő Janovics, theatre director and film pioneer",
            hu: "Janovics Jenő színigazgató, a film úttörője",
            ro: "Jenő Janovics, director de teatru și pionier al filmului"
          })
        ],
        text: {
          en: `Jenő Janovics was fascinated by film long before most theatre people took it seriously. As early as 1907 he was filming in the streets of Kolozsvár, and in 1913 his film “The Yellow Foal”, made together with the French company Pathé, became an international success. Between 1914 and 1920 his studio produced 65 silent films. It stood just ahead of you, in the courtyard of the summer theatre – a simple hall with a glass roof – and many scenes were shot outdoors, here in the park. With the money from his 26 cinemas he kept the theatre alive.

Janovics brought young talent to Kolozsvár. One was Mihály Kertész from Budapest. In 1914 Kertész filmed “Bánk bán” for him, with the great Mari Jászai as the Queen. Another was Sándor Korda, later Sir Alexander Korda, one of the great producers of British cinema.

Kertész went to Hollywood and called himself Michael Curtiz. In 1942 he made “Casablanca” there, starring Humphrey Bogart and Ingrid Bergman, and won the Oscar for Best Director. In front of the camera there were Hungarians too: Peter Lorre, born László Löwenstein, and S. Z. Sakall, known in Budapest as Szőke Szakáll.

“I think this is the beginning of a beautiful friendship” – and a piece of this story began here, in Kolozsvár.`,
          hu: `Janovics Jenőt már akkor lenyűgözte a film, amikor a legtöbb színházi ember még nem vette komolyan. Már 1907-ben forgatott Kolozsvár utcáin, és 1913-ban a francia Pathé céggel közösen készített filmje, a „Sárga csikó” világsikert aratott. 1914 és 1920 között stúdiója hatvanöt némafilmet készített. Közvetlenül Ön előtt állt, a nyári színkör udvarán – egy egyszerű, üvegtetős csarnok –, és sok jelenetet a szabadban forgattak, itt, a Sétatéren. Huszonhat mozijának bevételéből tartotta életben a színházat.

Janovics fiatal tehetségeket hozott Kolozsvárra. Egyikük a budapesti Kertész Mihály volt. 1914-ben Kertész forgatta le neki a „Bánk bánt”, a királyné szerepében a nagy Jászai Marival. Egy másik Korda Sándor volt, a későbbi Sir Alexander Korda, a brit filmgyártás egyik legnagyobb producere.

Kertész Hollywoodba ment, és Michael Curtiznek nevezte magát. 1942-ben ott forgatta a „Casablancát” Humphrey Bogart és Ingrid Bergman főszereplésével, és megkapta a legjobb rendezőnek járó Oscar-díjat. A kamera előtt magyarok is álltak: Peter Lorre, született Löwenstein László, és S. Z. Sakall, akit Budapesten Szőke Szakállként ismertek.

„Azt hiszem, ez egy gyönyörű barátság kezdete” – és ennek a történetnek egy darabja itt, Kolozsváron kezdődött.`,
          ro: `Jenő Janovics era fascinat de film cu mult înainte ca majoritatea oamenilor de teatru să-l ia în serios. Încă din 1907 filma pe străzile Clujului, iar în 1913 filmul său „Mânzul galben”, realizat împreună cu compania franceză Pathé, a avut un succes internațional. Între 1914 și 1920, studioul său a produs 65 de filme mute. Se afla chiar în fața dumneavoastră, în curtea teatrului de vară – o hală simplă, cu acoperiș de sticlă – iar multe scene au fost filmate în aer liber, aici, în parc. Cu banii din cele 26 de cinematografe ale sale a ținut în viață teatrul.

Janovics a adus la Cluj tineri talentați. Unul dintre ei a fost Mihály Kertész, din Budapesta. În 1914, Kertész a filmat pentru el „Bánk bán”, cu marea Mari Jászai în rolul reginei. Altul a fost Sándor Korda, viitorul Sir Alexander Korda, unul dintre marii producători ai cinematografiei britanice.

Kertész a plecat la Hollywood și și-a luat numele de Michael Curtiz. În 1942 a realizat acolo „Casablanca”, cu Humphrey Bogart și Ingrid Bergman, și a primit Premiul Oscar pentru cea mai bună regie. În fața camerei au jucat și maghiari: Peter Lorre, născut László Löwenstein, și S. Z. Sakall, cunoscut la Budapesta drept Szőke Szakáll.

„Cred că acesta este începutul unei frumoase prietenii” – iar o parte din această poveste a început aici, la Cluj.`
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
          { label: { en: "Hungarian actors (actors.hu)", hu: "Magyar színészek (actors.hu)", ro: "Actori maghiari (actors.hu)" }, url: "https://actors.hu" }
        ]
      },
      {
        id: "07-ungarisches-theater",
        year: 1919,
        coords: [46.77261, 23.58414],
        title: { en: "The Hungarian Theatre today", hu: "A Magyar Színház ma", ro: "Teatrul Maghiar astăzi" },
        subtitle: { en: "Kolozsvári Állami Magyar Színház", hu: "Kolozsvári Állami Magyar Színház", ro: "Teatrul Maghiar de Stat Cluj" },
        address: { en: "Str. Emil Isac 26–28, Cluj-Napoca", hu: "Emil Isac utca 26–28, Kolozsvár", ro: "Str. Emil Isac 26–28, Cluj-Napoca" },
        text: {
          en: `You have reached the end of the tour. From 1874 a wooden summer stage stood here at the entrance to the park. In 1910 Janovics replaced it with this brick theatre – and paid for it out of his own pocket. When the Hungarian company lost the great house on Hunyadi Square, it moved in here. In October 1919 Janovics opened the season – in a building without heating.

The street outside is named after Emil Isac, a Romanian poet who in 1919 helped shape the new cultural policy of Transylvania. Janovics, for his part, brought Romanian authors such as Caragiale and Blaga to the Hungarian stage and took his company on tour to Bucharest – and was attacked for it by nationalists on both sides. In 1923 he was offered the directorship of the National Theatre in Budapest. He declined: “I cannot cut the ties that bind me to Kolozsvár.”

Apart from the years 1940 to 1945, this has been the company's home ever since. It was given its present form between 1959 and 1961, and it shares its stage with the Hungarian Opera. Directors such as György Harag and, since 1990, Gábor Tompa have made it one of the most acclaimed theatres in Romania and a member of the Union of the Theatres of Europe.

More than two hundred and thirty years after the first performance in Countess Rhédey's ballroom, Hungarian theatre is still performed here every evening – with Romanian and English surtitles. Thank you for joining us. We would be delighted to welcome you in our audience soon.`,
          hu: `Megérkezett. Itt, a Sétatér bejáratánál 1874-től fából épült nyári színkör állt. 1910-ben Janovics ezt a kőszínházat építtette helyette – a saját pénzéből. Amikor a magyar társulat elvesztette a Hunyadi téri nagy épületet, ide költözött. 1919 októberében Janovics itt nyitotta meg az évadot – egy fűtetlen épületben.

A ház előtti utca Emil Isac román költő nevét viseli, aki 1919-ben Erdély új kultúrpolitikájának egyik alakítója volt. Janovics a maga részéről román szerzőket, köztük Caragialét és Blagát vitte magyar színpadra, társulatával Bukarestben is vendégszerepelt – és ezért mindkét oldal nacionalistái támadták. 1923-ban felkínálták neki a budapesti Nemzeti Színház igazgatását. Nemet mondott: „Nem tudom elszakítani a kapcsokat, amelyek engem Kolozsvárhoz kötnek.”

Az 1940 és 1945 közötti éveket leszámítva azóta is ez a társulat otthona. Mai formáját 1959 és 1961 között nyerte el, színpadán a Kolozsvári Magyar Operával osztozik. Olyan rendezők, mint Harag György és 1990 óta Tompa Gábor, Románia egyik legelismertebb színházává és az Európai Színházi Unió tagjává tették.

Több mint kétszázharminc évvel a Rhédey grófné báltermében tartott első előadás után itt ma is minden este magyarul játszanak – román és angol felirattal. Köszönjük, hogy velünk tartott. Szeretettel várjuk hamarosan a nézőtéren!`,
          ro: `Ați ajuns la final. Aici, la intrarea în parc, se afla din 1874 un teatru de vară din lemn. În 1910, Janovics l-a înlocuit cu această clădire din cărămidă – plătită din propriul buzunar. Când trupa maghiară a pierdut marea clădire din Piața Hunyadi, s-a mutat aici. În octombrie 1919, Janovics a deschis stagiunea – într-o clădire fără încălzire.

Strada din fața teatrului poartă numele lui Emil Isac, poet român care în 1919 a contribuit la noua politică culturală a Transilvaniei. Janovics, la rândul său, a adus pe scena maghiară autori români precum Caragiale și Blaga și a dus trupa în turneu la București – fiind atacat pentru asta de naționaliștii ambelor părți. În 1923 i s-a oferit conducerea Teatrului Național din Budapesta. A refuzat: „Nu pot rupe legăturile care mă leagă de Cluj.”

Cu excepția anilor dintre 1940 și 1945, aceasta este de atunci casa trupei. Clădirea și-a primit forma actuală între 1959 și 1961 și își împarte scena cu Opera Maghiară. Regizori precum György Harag și, din 1990, Gábor Tompa au făcut din ea unul dintre cele mai apreciate teatre din România și membru al Uniunii Teatrelor din Europa.

La peste două sute treizeci de ani după primul spectacol din sala de bal a contesei Rhédey, aici se joacă și astăzi, în fiecare seară, teatru în limba maghiară – cu supratitrare în română și engleză. Vă mulțumim că ne-ați însoțit. Ne-ar bucura să vă revedem curând în sală.`
        }
      }
    ]
  };
})();
