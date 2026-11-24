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
          en: `Welcome to Cluj – or Kolozsvár, as the city is called in Hungarian. You are standing on the Main Square, the heart of the city, beside the Gothic St Michael's Church and the equestrian statue of King Matthias Corvinus.

This is where our story begins. In October 1792 a group of young nobles led by János Fejér asked the authorities for permission to perform plays in Hungarian. Their aim was not only to entertain, but to enrich and refine the Hungarian language. They were granted permission – in a reply that was more tolerant than enthusiastic.

But where to perform? Countess Rhédey, born Baroness Terézia Bánffy, came to their rescue: she offered them her ballroom here on the Main Square, free of charge, for an entire year. On 17 December 1792 the company premiered its first play, “A titkos ellenkezés vagy Köleséri”. Permanent Hungarian-language theatre in Cluj had begun.

Imagine it: candlelight, a hall full of nobles and townspeople in silk and velvet, and on an improvised stage, young actors performing in their own language. Today the Rhédey Café welcomes guests within these old walls. And you are invited to become part of this story yourself: slip into a costume and stand, for a moment, on the stage of 1792.`,
          hu: `Üdvözöljük Kolozsváron! A Főtéren áll, a város szívében, a gótikus Szent Mihály-templom és Mátyás király lovasszobra mellett.

Itt kezdődik történetünk. 1792 októberében Fejér János vezetésével néhány fiatal nemes engedélyt kért arra, hogy magyar nyelvű színdarabokat adhasson elő. Céljuk nem csupán a szórakoztatás volt, hanem a magyar nyelv gazdagítása és csiszolása. Az engedélyt megkapták – inkább türelmes, mint lelkes válasz formájában.

De hol játsszanak? Rhédey grófné, született Bánffy Terézia bárónő sietett segítségükre: egy teljes évre ingyen átengedte nekik bálteremét itt, a Főtéren. 1792. december 17-én a társulat bemutatta első előadását, „A titkos ellenkezés vagy Köleséri” című darabot. Ezzel elkezdődött Kolozsváron az állandó magyar nyelvű színjátszás.

Képzelje el: gyertyafény, selyembe és bársonyba öltözött nemesekkel és polgárokkal teli terem, a rögtönzött színpadon pedig fiatal színészek, akik a saját anyanyelvükön játszanak. Ma a Rhédey Kávéház várja a vendégeket az öreg falak között. Önt pedig arra hívjuk, hogy maga is részese legyen ennek a történetnek: bújjon jelmezbe, és álljon egy pillanatra 1792 színpadára.`,
          ro: `Bine ați venit la Cluj – sau Kolozsvár, cum se numește orașul în limba maghiară. Vă aflați în Piața Unirii, inima orașului, lângă Biserica gotică Sfântul Mihail și statuia ecvestră a regelui Matia Corvin.

Aici începe povestea noastră. În octombrie 1792, un grup de tineri nobili condus de János Fejér a cerut permisiunea de a juca piese de teatru în limba maghiară. Scopul lor nu era doar distracția, ci îmbogățirea și rafinarea limbii maghiare. Au primit permisiunea – printr-un răspuns mai degrabă tolerant decât entuziast.

Dar unde să joace? Contesa Rhédey, născută baroneasa Terézia Bánffy, le-a venit în ajutor: le-a oferit sala ei de bal, aici, în piața centrală, gratuit, pentru un an întreg. Pe 17 decembrie 1792, trupa a prezentat primul său spectacol, „A titkos ellenkezés vagy Köleséri”. Începuse teatrul permanent în limba maghiară la Cluj.

Imaginați-vă: lumina lumânărilor, o sală plină de nobili și orășeni îmbrăcați în mătase și catifea, iar pe o scenă improvizată, tineri actori care joacă în propria lor limbă. Astăzi, Rhédey Café își primește oaspeții între aceste ziduri vechi. Iar dumneavoastră sunteți invitați să deveniți parte din această poveste: îmbrăcați un costum și urcați, pentru o clipă, pe scena anului 1792.`
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
            en: "The memorial plaque on the Casa Universitarilor",
            hu: "Az emléktábla a Casa Universitarilor falán",
            ro: "Placa memorială de pe clădirea Casei Universitarilor"
          })
        ],
        text: {
          en: `Farkas Street was the street of scholars, with the Reformed Church, old colleges and the university. And here, in 1821, the first permanent venue of the Hungarian theatre company opened.

The actors had dreamed of their own theatre since 1793. In September 1803 the foundation stone was laid, after five patrons – Count Ferenc Teleki, Baron Miklós Wesselényi, Baron József Thoroczkay, Count Lajos Teleki and Baron József Bánffy – bought the plot from the Reformed College. With many donors and craftsmen working for free, the building designed by the Cluj architect Antal Alföldi was finally completed.

The grand opening lasted two nights. On 12 March 1821, aristocratic amateur actors performed Theodor Körner's tragedy “Zrínyi” – and afterwards donated their costly costumes to the theatre. On 13 March the professional company took the stage with “King Matthias” by László Szentjóbi Szabó.

Great names played here: János Kótsi Patkó, who spoke the very first words on stage in 1792; Déryné Róza Széppataki, who made Cluj a cradle of Hungarian opera; and the young Mari Jászai, who began her career here in 1869 and later became the greatest Hungarian tragedienne.

On 7 September 1906 the old house closed. It stood empty until 1935, when it was demolished and the Casa Universitarilor was built in its place. Look for the memorial plaque on its wall.

We continue south, up the hill, to the Central Cemetery – where some of these actors rest.`,
          hu: `A Farkas utca a tudósok utcája volt: itt áll a református templom, a régi kollégiumok és az egyetem. És itt nyílt meg 1821-ben a magyar színtársulat első állandó játszóhelye.

A színészek már 1793 óta saját színházról álmodtak. 1803 szeptemberében tették le az alapkövet, miután öt pártfogó – gróf Teleki Ferenc, báró Wesselényi Miklós, báró Thoroczkay József, gróf Teleki Lajos és báró Bánffy József – megvásárolta a telket a Református Kollégiumtól. Sok adományozó és ingyen dolgozó mesterember segítségével végül elkészült a kolozsvári Alföldi Antal tervezte épület.

A díszes megnyitó két estén át tartott. 1821. március 12-én főúri műkedvelők adták elő Theodor Körner „Zrínyi” című tragédiáját – drága jelmezeiket pedig utána a színháznak ajándékozták. Március 13-án a hivatásos társulat lépett színpadra Szentjóbi Szabó László „Mátyás király” című darabjával.

Nagy nevek játszottak itt: Kótsi Patkó János, aki 1792-ben az első szót mondta ki a színpadon; Déryné Széppataki Róza, aki Kolozsvárt a magyar opera bölcsőjévé tette; és a fiatal Jászai Mari, aki 1869-ben itt kezdte pályáját, és később a legnagyobb magyar tragika lett.

1906. szeptember 7-én a régi színház bezárt. 1935-ig üresen állt, ekkor lebontották, és a helyére épült a Casa Universitarilor. Keresse meg falán az emléktáblát!

Délnek folytatjuk utunkat, fel a dombra, a Házsongárdi temetőbe – ahol e színészek közül többen nyugszanak.`,
          ro: `Strada Farkas, astăzi strada Mihail Kogălniceanu, era strada învățaților, cu Biserica Reformată, vechile colegii și universitatea. Și aici s-a deschis, în 1821, primul spațiu permanent al trupei de teatru maghiare.

Actorii visau la propriul teatru încă din 1793. În septembrie 1803 a fost pusă piatra de temelie, după ce cinci patroni – contele Ferenc Teleki, baronul Miklós Wesselényi, baronul József Thoroczkay, contele Lajos Teleki și baronul József Bánffy – au cumpărat terenul de la Colegiul Reformat. Cu ajutorul multor donatori și meșteșugari care au lucrat gratuit, clădirea proiectată de arhitectul clujean Antal Alföldi a fost în sfârșit terminată.

Inaugurarea festivă a durat două seri. Pe 12 martie 1821, actori amatori aristocrați au jucat tragedia „Zrínyi” de Theodor Körner – iar apoi au donat teatrului costumele lor scumpe. Pe 13 martie, trupa profesionistă a urcat pe scenă cu piesa „Regele Matia” de László Szentjóbi Szabó.

Aici au jucat nume mari: János Kótsi Patkó, care a rostit primele cuvinte pe scenă în 1792; Déryné Róza Széppataki, care a făcut din Cluj leagănul operei maghiare; și tânăra Mari Jászai, care și-a început aici cariera în 1869 și a devenit apoi cea mai mare tragediană maghiară.

Pe 7 septembrie 1906, vechiul teatru s-a închis. A stat gol până în 1935, când a fost demolat, iar în locul lui a fost construită Casa Universitarilor. Căutați placa memorială de pe zidul clădirii.

Continuăm spre sud, urcând dealul, către Cimitirul Central – unde se odihnesc câțiva dintre acești actori.`
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
          en: `The Házsongárd Cemetery, today officially the Central Cemetery, is one of the oldest surviving cemeteries in Central Europe. Scholars, writers and artists rest here – and many people of the theatre.

One of them is Pál Jantsó Gidófalvi. He was among the young nobles who founded the company in 1792, and he acted for more than half a century. He longed to play heroes, but his tall, lanky figure, his top hat and his hooked nose made audiences laugh. Legend has it that one night he trampled the laurel wreath he was given and shouted: “Yesterday, when I played a proud, wise man, you whistled. Today, when I play a jackass, you applaud!” He became the first true comedian of the Cluj stage. Next to him rests his colleague Celesztin Pergő, actor and theatre director.

Here, too, lies Mária Néb, a brilliant comic actress who was lured to Buda in vain – she could not part with her city.

Take a moment. Theatre is the most fleeting of all arts – every performance exists only once. What remains is the memory of the people who were there.`,
          hu: `A Házsongárdi temető – hivatalos nevén ma Központi temető – Közép-Európa egyik legrégebbi fennmaradt temetője. Tudósok, írók, művészek nyugszanak itt – és a színház sok embere.

Közéjük tartozik Gidófalvi Jantsó Pál. Ott volt azok között a fiatal nemesek között, akik 1792-ben megalapították a társulatot, és több mint fél évszázadon át játszott. Hősöket szeretett volna játszani, de magas, nyurga alakja, cilindere és horgas orra nevetésre fakasztotta a közönséget. A legenda szerint egy este lábbal taposta meg a neki nyújtott babérkoszorút, és így kiáltott: „Tegnap, amikor büszke, okos embert játszottam, kifütyültek. Ma, amikor egy szamarat játszom, tapsolnak!” Ő lett a kolozsvári színpad első igazi komikusa. Mellette nyugszik kollégája, Pergő Celesztin színész és igazgató.

Itt nyugszik Néb Mária is, a ragyogó vígjátéki színésznő, akit hiába csábítottak Budára – nem tudott megválni városától.

Álljon meg egy pillanatra. A színház a legmúlandóbb művészet – minden előadás csak egyszer létezik. Ami megmarad, az azok emléke, akik ott voltak.`,
          ro: `Cimitirul Central, cunoscut și sub numele de Hajongard sau Házsongárd, este unul dintre cele mai vechi cimitire păstrate din Europa Centrală. Aici odihnesc savanți, scriitori, artiști – și mulți oameni ai teatrului.

Unul dintre ei este Pál Jantsó Gidófalvi. A fost printre tinerii nobili care au fondat trupa în 1792 și a jucat mai bine de jumătate de secol. Și-ar fi dorit să joace eroi, dar silueta lui înaltă și deșirată, jobenul și nasul coroiat stârneau râsul publicului. Legenda spune că într-o seară a călcat în picioare coroana de lauri primită și a strigat: „Ieri, când am jucat un om mândru și înțelept, m-ați fluierat. Azi, când joc un măgar, mă aplaudați!” A devenit primul adevărat actor de comedie al scenei clujene. Lângă el se odihnește colegul său, Celesztin Pergő, actor și director de teatru.

Tot aici se află Mária Néb, o strălucită actriță de comedie, pe care cei din Buda au încercat în zadar să o atragă – nu s-a putut despărți de orașul ei.

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
            en: ["Pál Jantsó Gidófalvi (1761–1845) – co-founder, the first comedian", "Celesztin Pergő (1784–1858) – actor and director, next to Jantsó", "Mária Néb (1799–1884) – comic actress"],
            hu: ["Gidófalvi Jantsó Pál (1761–1845) – alapító, az első komikus", "Pergő Celesztin (1784–1858) – színész és igazgató, Jantsó mellett", "Néb Mária (1799–1884) – vígjátéki színésznő"],
            ro: ["Pál Jantsó Gidófalvi (1761–1845) – cofondator, primul actor de comedie", "Celesztin Pergő (1784–1858) – actor și director, lângă Jantsó", "Mária Néb (1799–1884) – actriță de comedie"]
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
          en: `In front of you stands the Lucian Blaga National Theatre together with the Romanian Opera. What many visitors don't know: this house was built as a Hungarian theatre.

The Viennese architects Fellner and Helmer, who built theatres all over Central Europe, designed the neo-baroque building. Jenő Janovics, director of the Hungarian company from 1905, opened it with a two-night celebration – just as the Farkas Street theatre had been opened in 1821. On 7 September 1906 the old house gave its very last performance. The next evening, on 8 September, the new theatre opened with Ferenc Herczeg's play “Színházavatás” – “Theatre Inauguration”.

Then came the break. After the First World War, Transylvania became part of Romania, and in 1919 the Hungarian company had to hand the building over to the Romanian National Theatre. Janovics wanted to renovate the old Farkas Street theatre and move back there – but the new authorities refused.

Two theatres, two languages, one city: to this day the Romanian and the Hungarian theatres of Cluj perform just a few hundred metres apart.

But Janovics was not only a man of the theatre. Our next stop takes us into the world of film – all the way to Hollywood.`,
          hu: `Ön előtt a Lucian Blaga Nemzeti Színház és a Román Opera épülete áll. Amit sok látogató nem tud: ezt a házat magyar színháznak építették.

A neobarokk épületet a bécsi Fellner és Helmer tervezte, akik egész Közép-Európában építettek színházakat. Janovics Jenő, a magyar társulat 1905-től igazgatója, kétestés ünnepséggel nyitotta meg – ahogyan 1821-ben a Farkas utcai színházat is. 1906. szeptember 7-én a régi ház utolsó előadását tartotta. Másnap este, szeptember 8-án Herczeg Ferenc „Színházavatás” című darabjával megnyílt az új színház.

Aztán jött a törés. Az első világháború után Erdély Romániához került, és 1919-ben a magyar társulatnak át kellett adnia az épületet a Román Nemzeti Színháznak. Janovics fel akarta újítani a régi Farkas utcai színházat, hogy oda költözzenek vissza – de az új hatalom ezt megtagadta.

Két színház, két nyelv, egy város: Kolozsvár román és magyar színháza ma is csak néhány száz méterre játszik egymástól.

Janovics azonban nemcsak színházi ember volt. Következő állomásunk a film világába visz – egészen Hollywoodig.`,
          ro: `În fața dumneavoastră se află Teatrul Național „Lucian Blaga” și Opera Națională Română. Ceea ce mulți vizitatori nu știu: această clădire a fost construită ca teatru maghiar.

Arhitecții vienezi Fellner și Helmer, care au construit teatre în toată Europa Centrală, au proiectat clădirea în stil neobaroc. Jenő Janovics, directorul trupei maghiare din 1905, a inaugurat-o printr-o sărbătoare de două seri – la fel cum fusese deschis în 1821 teatrul de pe strada Farkas. Pe 7 septembrie 1906, vechiul teatru a jucat ultimul său spectacol. A doua zi seara, pe 8 septembrie, noul teatru s-a deschis cu piesa lui Ferenc Herczeg „Színházavatás” – „Inaugurarea teatrului”.

Apoi a venit ruptura. După Primul Război Mondial, Transilvania a devenit parte a României, iar în 1919 trupa maghiară a trebuit să predea clădirea Teatrului Național Român. Janovics a vrut să renoveze vechiul teatru de pe strada Farkas și să se mute înapoi acolo – dar noile autorități au refuzat.

Două teatre, două limbi, un singur oraș: până astăzi, teatrul românesc și cel maghiar din Cluj joacă la doar câteva sute de metri unul de celălalt.

Dar Janovics nu a fost doar un om de teatru. Următoarea oprire ne duce în lumea filmului – până la Hollywood.`
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
          en: `Jenő Janovics was fascinated by film long before most theatre people took it seriously. As early as 1899 he built film scenes into a stage play in Cluj. From 1913 silent films were made in Kolozsvár, with actors from the theatre, often shot outdoors here in the city.

One of the directors who worked for Janovics was a young man from Budapest: Mihály Kertész. In 1914 he filmed “Bánk bán” for Janovics – with the great Mari Jászai, who had begun her career on the Farkas Street stage, as the Queen. A few years later Kertész went to Hollywood and called himself Michael Curtiz.

In 1942 Curtiz made a film there that wrote film history: “Casablanca”, starring Humphrey Bogart and Ingrid Bergman. Curtiz won the Oscar for Best Director for it.

And he was not alone. In front of the camera in “Casablanca” there were also actors from Hungary: Peter Lorre, born László Löwenstein, and S. Z. Sakall, known in Budapest as Szőke Szakáll.

“I think this is the beginning of a beautiful friendship” – and a piece of this story began here, in Kolozsvár.`,
          hu: `Janovics Jenőt már akkor lenyűgözte a film, amikor a legtöbb színházi ember még nem vette komolyan. Már 1899-ben filmjeleneteket épített be egy kolozsvári színpadi előadásba. 1913-tól Kolozsváron némafilmek készültek a színház színészeivel, gyakran a szabad ég alatt, itt a városban.

Az egyik rendező, aki Janovicsnak dolgozott, egy fiatal budapesti férfi volt: Kertész Mihály. 1914-ben ő forgatta le Janovicsnak a „Bánk bán”-t – a királyné szerepében a nagy Jászai Marival, aki a Farkas utcai színpadon kezdte pályáját. Néhány évvel később Kertész Hollywoodba ment, és Michael Curtiznek nevezte magát.

1942-ben Curtiz ott forgatta azt a filmet, amely filmtörténetet írt: a „Casablancát” Humphrey Bogart és Ingrid Bergman főszereplésével. Curtiz ezért megkapta a legjobb rendezőnek járó Oscar-díjat.

És nem volt egyedül. A „Casablanca” kamerái előtt magyar színészek is álltak: Peter Lorre, született Löwenstein László, és S. Z. Sakall, akit Budapesten Szőke Szakállként ismertek.

„Azt hiszem, ez egy gyönyörű barátság kezdete” – és ennek a történetnek egy darabja itt, Kolozsváron kezdődött.`,
          ro: `Jenő Janovics era fascinat de film cu mult înainte ca majoritatea oamenilor de teatru să-l ia în serios. Încă din 1899 a introdus scene filmate într-un spectacol de teatru la Cluj. Începând din 1913, la Cluj s-au realizat filme mute, cu actori ai teatrului, adesea în aer liber, aici, în oraș.

Unul dintre regizorii care lucrau pentru Janovics era un tânăr din Budapesta: Mihály Kertész. În 1914 a filmat pentru Janovics „Bánk bán” – cu marea Mari Jászai, care își începuse cariera pe scena de pe strada Farkas, în rolul reginei. Câțiva ani mai târziu, Kertész a plecat la Hollywood și și-a luat numele de Michael Curtiz.

În 1942, Curtiz a realizat acolo un film care a intrat în istoria cinematografiei: „Casablanca”, cu Humphrey Bogart și Ingrid Bergman. Pentru acest film, Curtiz a primit Premiul Oscar pentru cea mai bună regie.

Și nu era singur. În fața camerei, în „Casablanca”, au jucat și actori din Ungaria: Peter Lorre, născut László Löwenstein, și S. Z. Sakall, cunoscut la Budapesta drept Szőke Szakáll.

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
          en: `You have reached the end of the tour. This building was originally the Színkör, the summer stage beside the Someș River, where the company played every summer season. After 1919, when the great house on Hunyadi Square had been lost, it became the new home of the Hungarian company – a temporary solution that became a home.

From 1948 the house became the State Hungarian Theatre, and the Hungarian Opera of Cluj was founded in the same building. Around 1960 the theatre was given its present, modern form.

Since 1990 the director Gábor Tompa has led the house. Under him, the Hungarian Theatre of Cluj has become one of the most internationally acclaimed stages in Romania, touring all over Europe.

More than two hundred and thirty years after the first performance in Countess Rhédey's ballroom, Hungarian theatre is still performed here every evening.

Thank you for joining us. We would be delighted to welcome you in our audience soon.`,
          hu: `Megérkezett. Ez az épület eredetileg a Színkör volt, a Szamos-parti nyári színpad, ahol a társulat minden nyári évadban játszott. 1919 után, amikor a Hunyadi téri nagy épület elveszett, a magyar társulat új otthona lett – ideiglenes megoldás, amelyből otthon lett.

1948-tól az épület az Állami Magyar Színház lett, és ugyanebben az épületben alakult meg a Kolozsvári Magyar Opera. 1960 körül nyerte el a színház mai, modern formáját.

1990 óta Tompa Gábor rendező vezeti a színházat. Irányítása alatt a Kolozsvári Állami Magyar Színház Románia egyik nemzetközileg legelismertebb színpada lett, egész Európában vendégszerepel.

Több mint kétszázharminc évvel a Rhédey grófné báltermében tartott első előadás után itt ma is minden este magyarul játszanak.

Köszönjük, hogy velünk tartott. Szeretettel várjuk hamarosan a nézőtéren!`,
          ro: `Ați ajuns la final. Această clădire a fost la origine Színkör, scena de vară de pe malul Someșului, unde trupa juca în fiecare stagiune de vară. După 1919, când marea clădire din actuala Piață Ștefan cel Mare a fost pierdută, a devenit noua casă a trupei maghiare – o soluție provizorie care a devenit acasă.

Din 1948, clădirea a devenit Teatrul Maghiar de Stat, iar în aceeași clădire a luat ființă Opera Maghiară din Cluj. În jurul anului 1960, teatrul și-a primit forma modernă de astăzi.

Din 1990, regizorul Gábor Tompa conduce teatrul. Sub conducerea sa, Teatrul Maghiar de Stat Cluj a devenit una dintre cele mai apreciate scene din România pe plan internațional, cu turnee în toată Europa.

La peste două sute treizeci de ani după primul spectacol din sala de bal a contesei Rhédey, aici se joacă și astăzi, în fiecare seară, teatru în limba maghiară.

Vă mulțumim că ne-ați însoțit. Ne-ar bucura să vă revedem curând în sală.`
        }
      }
    ]
  };
})();
