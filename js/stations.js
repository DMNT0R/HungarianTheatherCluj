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
 *   activity  – optional: {icon, title, text, items, photo}
 *   links     – optional: [{label, url}]
 *   draftLocation – true, wenn der genaue Ort noch festgelegt werden muss
 *
 * HINWEIS: Die Texte sind Entwürfe für den Prototyp. Fakten müssen vom
 * Ungarischen Theater Cluj geprüft werden; die ungarischen und rumänischen
 * Fassungen sollten von Muttersprachlern gegengelesen werden.
 */
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
  stations: [
    {
      id: "01-rhedey",
      year: 1792,
      coords: [46.76975, 23.58890],
      draftLocation: true,
      title: { en: "Rhédey Palace & Rhédey Café", hu: "Rhédey-palota és Rhédey Kávéház", ro: "Palatul Rhédey și Rhédey Café" },
      subtitle: { en: "Main Square · Piața Unirii · Főtér", hu: "Főtér · Piața Unirii", ro: "Piața Unirii · Főtér" },
      address: { en: "Piața Unirii, Cluj-Napoca", hu: "Főtér (Piața Unirii), Kolozsvár", ro: "Piața Unirii, Cluj-Napoca" },
      text: {
        en: `Welcome to Cluj – or Kolozsvár, as the city is called in Hungarian. You are standing on the Main Square, the heart of the city, beside the Gothic St Michael's Church and the equestrian statue of King Matthias Corvinus.

This is where our story begins. In 1792 a theatre company was founded in Kolozsvár that, for the first time, performed regularly in Hungarian. There was no theatre building yet. The first performances took place in an aristocratic palace – the palace of the Rhédey family, here on the Main Square.

Imagine it: candlelight, a hall full of nobles and townspeople in silk and velvet, and on an improvised stage, actors performing in their own language for the first time. The Hungarian Theatre of Cluj considers this year its birth.

Today the Rhédey Café welcomes guests within these old walls. And you are invited to become part of this story yourself: slip into a costume and stand, for a moment, on the stage of 1792.`,
        hu: `Üdvözöljük Kolozsváron! A Főtéren áll, a város szívében, a gótikus Szent Mihály-templom és Mátyás király lovasszobra mellett.

Itt kezdődik történetünk. 1792-ben Kolozsváron megalakult az a színtársulat, amely először játszott rendszeresen magyar nyelven. Színházépület még nem volt. Az első előadásokat egy főúri palotában tartották – a Rhédey család palotájában, itt a Főtéren.

Képzelje el: gyertyafény, selyembe és bársonyba öltözött nemesekkel és polgárokkal teli terem, a rögtönzött színpadon pedig színészek, akik először játszanak a saját anyanyelvükön. A Kolozsvári Állami Magyar Színház ezt az évet tekinti születése évének.

Ma a Rhédey Kávéház várja a vendégeket az öreg falak között. Önt pedig arra hívjuk, hogy maga is részese legyen ennek a történetnek: bújjon jelmezbe, és álljon egy pillanatra 1792 színpadára.`,
        ro: `Bine ați venit la Cluj – sau Kolozsvár, cum se numește orașul în limba maghiară. Vă aflați în Piața Unirii, inima orașului, lângă Biserica gotică Sfântul Mihail și statuia ecvestră a regelui Matia Corvin.

Aici începe povestea noastră. În 1792 s-a înființat la Cluj o trupă de teatru care, pentru prima dată, juca în mod regulat în limba maghiară. Nu exista încă o clădire de teatru. Primele spectacole au avut loc într-un palat nobiliar – palatul familiei Rhédey, aici, în piața centrală.

Imaginați-vă: lumina lumânărilor, o sală plină de nobili și orășeni îmbrăcați în mătase și catifea, iar pe o scenă improvizată, actori care joacă pentru prima dată în propria lor limbă. Teatrul Maghiar de Stat Cluj consideră acest an drept anul nașterii sale.

Astăzi, Rhédey Café își primește oaspeții între aceste ziduri vechi. Iar dumneavoastră sunteți invitați să deveniți parte din această poveste: îmbrăcați un costum și urcați, pentru o clipă, pe scena anului 1792.`
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
      }
    },
    {
      id: "02-matthias",
      year: 1443,
      coords: [46.77125, 23.58775],
      title: { en: "Birthplace of King Matthias", hu: "Mátyás király szülőháza", ro: "Casa natală a regelui Matia Corvin" },
      subtitle: { en: "Casa Matei Corvin · Mátyás király szülőháza", hu: "Mátyás király szülőháza", ro: "Casa Matei Corvin" },
      address: { en: "Str. Matei Corvin 6, Cluj-Napoca", hu: "Mátyás király utca (Str. Matei Corvin) 6, Kolozsvár", ro: "Str. Matei Corvin 6, Cluj-Napoca" },
      text: {
        en: `In this Gothic town house Matthias Hunyadi was born in 1443 – later King Matthias Corvinus. From 1458 to 1490 he ruled the Kingdom of Hungary and turned his court into one of the first centres of the Renaissance north of the Alps.

For the theatre, Matthias remains a grateful figure to this day. In popular tradition he became "Matthias the Just", who travels the country in disguise, uncovers injustice and exposes the powerful. These stories were told, sung and performed – at fairs, in schools and later on the great stages.

Today the house is used by the University of Art and Design. Art and Cluj still belong together here.

Our next stop takes us to Farkas Street, where the first permanent stage stood.`,
        hu: `Ebben a gótikus polgárházban született 1443-ban Hunyadi Mátyás, a későbbi Mátyás király. 1458 és 1490 között uralkodott a Magyar Királyság felett, udvarát pedig az Alpoktól északra a reneszánsz egyik első központjává tette.

A színház számára Mátyás ma is hálás figura. A néphagyományban ő lett „Igazságos Mátyás”, aki álruhában járja az országot, leleplezi az igazságtalanságot és megszégyeníti a hatalmasokat. Ezeket a történeteket mesélték, énekelték és eljátszották – vásárokon, iskolákban, később pedig a nagy színpadokon.

Ma a Művészeti és Design Egyetem használja az épületet. A művészet és Kolozsvár itt ma is összetartozik.

Következő állomásunk a Farkas utca, ahol az első állandó színház állt.`,
        ro: `În această casă gotică s-a născut în 1443 Matia Hunyadi, viitorul rege Matia Corvin. Între 1458 și 1490 a condus Regatul Ungariei și a transformat curtea sa într-unul dintre primele centre ale Renașterii la nord de Alpi.

Pentru teatru, Matia rămâne până astăzi un personaj îndrăgit. În tradiția populară a devenit „Matia cel Drept”, care cutreieră țara deghizat, descoperă nedreptățile și îi demască pe cei puternici. Aceste povești au fost spuse, cântate și jucate – la târguri, în școli și, mai târziu, pe marile scene.

Astăzi, clădirea este folosită de Universitatea de Artă și Design. Arta și Clujul sunt și aici strâns legate.

Următoarea oprire ne duce pe strada Kogălniceanu, vechea Farkas utca, unde s-a aflat prima scenă permanentă.`
      }
    },
    {
      id: "03-farkas",
      year: 1821,
      coords: [46.76735, 23.59195],
      title: { en: "The first stone theatre", hu: "Az első kőszínház", ro: "Primul teatru din piatră" },
      subtitle: { en: "Farkas utca · Str. Mihail Kogălniceanu", hu: "Farkas utca", ro: "Str. Mihail Kogălniceanu · Farkas utca" },
      address: { en: "Str. Mihail Kogălniceanu, Cluj-Napoca", hu: "Farkas utca (Str. Mihail Kogălniceanu), Kolozsvár", ro: "Str. Mihail Kogălniceanu, Cluj-Napoca" },
      text: {
        en: `Farkas Street was the street of scholars: here stand the Reformed Church from the time of King Matthias, old colleges and the university.

And here theatre history was made. In 1821 a stone theatre opened in this street – the first permanent building constructed specifically for performances in Hungarian. It was paid for by Transylvanian nobles and townspeople through donations.

For almost ninety years the house on Farkas Street was the company's home. A permanent ensemble grew up here, and great names of the Hungarian stage performed here.

Nothing of the building can be seen today. But if you close your eyes, perhaps you can still hear the applause.

We continue south, up the hill, to the Central Cemetery.`,
        hu: `A Farkas utca a tudósok utcája volt: itt áll a Mátyás király korából származó református templom, a régi kollégiumok és az egyetem.

És itt született színháztörténet. 1821-ben ebben az utcában nyílt meg egy kőszínház – az első állandó épület, amelyet kifejezetten magyar nyelvű előadások számára emeltek. Erdélyi nemesek és polgárok adományaiból épült.

Közel kilencven évig a Farkas utcai színház volt a társulat otthona. Itt alakult ki az állandó társulat, és itt léptek fel a magyar színjátszás nagy alakjai.

Az épületből ma már semmi sem látható. De ha becsukja a szemét, talán még hallja a tapsot.

Délnek folytatjuk utunkat, fel a dombra, a Házsongárdi temetőbe.`,
        ro: `Strada Farkas, astăzi strada Mihail Kogălniceanu, era strada învățaților: aici se află Biserica Reformată din vremea regelui Matia, vechile colegii și universitatea.

Și aici s-a scris istoria teatrului. În 1821 s-a deschis pe această stradă un teatru din piatră – prima clădire permanentă construită special pentru spectacole în limba maghiară. A fost finanțată prin donații ale nobililor și orășenilor din Transilvania.

Timp de aproape nouăzeci de ani, teatrul de pe strada Farkas a fost casa trupei. Aici s-a format un ansamblu permanent și aici au jucat mari nume ale scenei maghiare.

Din clădire nu se mai vede astăzi nimic. Dar dacă închideți ochii, poate mai auziți aplauzele.

Continuăm spre sud, urcând dealul, către Cimitirul Central.`
      }
    },
    {
      id: "04-hazsongard",
      year: 1585,
      coords: [46.7625, 23.5910],
      title: { en: "Házsongárd Central Cemetery", hu: "Házsongárdi temető", ro: "Cimitirul Central (Hajongard)" },
      subtitle: { en: "Házsongárdi temető · Cimitirul Central", hu: "Házsongárdi temető · Központi temető", ro: "Cimitirul Central · Házsongárdi temető" },
      address: { en: "Str. Avram Iancu, Cluj-Napoca", hu: "Avram Iancu utca, Kolozsvár", ro: "Str. Avram Iancu, Cluj-Napoca" },
      text: {
        en: `The Házsongárd Cemetery, today officially the Central Cemetery, is one of the oldest surviving cemeteries in Central Europe. The people of Cluj have been buried here since the sixteenth century.

A walk among the old gravestones is a walk through the cultural history of Transylvania: scholars, writers and artists rest here – and many people of the theatre. Actresses and actors, singers, directors and managers who shaped the stage of this city for generations.

Take a moment. Theatre is the most fleeting of all arts – every performance exists only once. What remains is the memory of the people who were there.

From here we return to the centre, to a magnificent theatre building with a surprising story.`,
        hu: `A Házsongárdi temető – hivatalos nevén ma Központi temető – Közép-Európa egyik legrégebbi fennmaradt temetője. A tizenhatodik század óta itt temetik el Kolozsvár polgárait.

Egy séta a régi sírkövek között séta Erdély kultúrtörténetében: itt nyugszanak tudósok, írók és művészek – és a színház sok embere. Színésznők és színészek, énekesek, rendezők és igazgatók, akik nemzedékeken át formálták e város színpadát.

Álljon meg egy pillanatra. A színház a legmúlandóbb művészet – minden előadás csak egyszer létezik. Ami megmarad, az azok emléke, akik ott voltak.

Innen visszatérünk a központba, egy pompás színházépülethez, amelynek meglepő története van.`,
        ro: `Cimitirul Central, cunoscut și sub numele de Hajongard sau Házsongárd, este unul dintre cele mai vechi cimitire păstrate din Europa Centrală. Locuitorii Clujului sunt înmormântați aici încă din secolul al XVI-lea.

O plimbare printre pietrele funerare vechi este o plimbare prin istoria culturală a Transilvaniei: aici odihnesc savanți, scriitori și artiști – și mulți oameni ai teatrului. Actrițe și actori, cântăreți, regizori și directori care au modelat scena acestui oraș timp de generații.

Opriți-vă pentru o clipă. Teatrul este cea mai efemeră dintre arte – fiecare spectacol există o singură dată. Ceea ce rămâne este amintirea celor care au fost de față.

De aici ne întoarcem în centru, la o clădire de teatru impresionantă, cu o poveste surprinzătoare.`
      },
      activity: {
        icon: "🕯️",
        title: { en: "On the trail: actors' graves", hu: "Nyomkeresés: színészsírok", ro: "Pe urmele actorilor: morminte" },
        text: {
          en: "Find the graves of great theatre people. (List and site plan to be added by the theatre.)",
          hu: "Keresse meg nagy színházi emberek sírjait. (A listát és a helyszínrajzot a színház egészíti ki.)",
          ro: "Găsiți mormintele unor mari oameni de teatru. (Lista și planul vor fi completate de teatru.)"
        },
        items: {
          en: ["Grave 1 – name, dates, most famous role", "Grave 2 – name, dates, most famous role", "Grave 3 – name, dates, most famous role"],
          hu: ["1. sír – név, életévek, leghíresebb szerep", "2. sír – név, életévek, leghíresebb szerep", "3. sír – név, életévek, leghíresebb szerep"],
          ro: ["Mormântul 1 – nume, ani, cel mai cunoscut rol", "Mormântul 2 – nume, ani, cel mai cunoscut rol", "Mormântul 3 – nume, ani, cel mai cunoscut rol"]
        }
      }
    },
    {
      id: "05-nationaltheater",
      year: 1906,
      coords: [46.77035, 23.59745],
      title: { en: "A Romanian theatre, built as Hungarian", hu: "Román színház – magyarnak épült", ro: "Un teatru românesc, construit ca teatru maghiar" },
      subtitle: { en: "Piața Ștefan cel Mare · Hunyadi tér", hu: "Hunyadi tér · Piața Ștefan cel Mare", ro: "Piața Ștefan cel Mare · Hunyadi tér" },
      address: { en: "Piața Ștefan cel Mare 2–4, Cluj-Napoca", hu: "Hunyadi tér (Piața Ștefan cel Mare) 2–4, Kolozsvár", ro: "Piața Ștefan cel Mare 2–4, Cluj-Napoca" },
      text: {
        en: `In front of you stands the Romanian National Theatre together with the Romanian Opera. What many visitors don't know: this house was built as a Hungarian theatre.

The Viennese architects Fellner and Helmer, who built theatres all over Central Europe, designed the neo-baroque building. In 1906 it opened as the new Hungarian National Theatre of Kolozsvár. Its director was Jenő Janovics, one of the defining figures of our story.

Then came the break. After the First World War, Transylvania became part of Romania, and in 1919 the building was handed over to the newly founded Romanian National Theatre. The Hungarian company had to leave its splendid house.

Two theatres, two languages, one city: to this day the Romanian and the Hungarian theatres of Cluj perform just a few hundred metres apart.

But Janovics was not only a man of the theatre. Our next stop takes us into the world of film – all the way to Hollywood.`,
        hu: `Ön előtt a Román Nemzeti Színház és a Román Opera épülete áll. Amit sok látogató nem tud: ezt a házat magyar színháznak építették.

A neobarokk épületet a bécsi Fellner és Helmer tervezte, akik egész Közép-Európában építettek színházakat. 1906-ban nyílt meg Kolozsvár új magyar Nemzeti Színházaként. Igazgatója Janovics Jenő volt, történetünk egyik meghatározó alakja.

Aztán jött a törés. Az első világháború után Erdély Romániához került, és 1919-ben az épületet átadták az újonnan alapított Román Nemzeti Színháznak. A magyar társulatnak el kellett hagynia pompás otthonát.

Két színház, két nyelv, egy város: Kolozsvár román és magyar színháza ma is csak néhány száz méterre játszik egymástól.

Janovics azonban nemcsak színházi ember volt. Következő állomásunk a film világába visz – egészen Hollywoodig.`,
        ro: `În fața dumneavoastră se află Teatrul Național și Opera Națională Română. Ceea ce mulți vizitatori nu știu: această clădire a fost construită ca teatru maghiar.

Arhitecții vienezi Fellner și Helmer, care au construit teatre în toată Europa Centrală, au proiectat clădirea în stil neobaroc. În 1906 a fost inaugurată ca noul Teatru Național Maghiar din Cluj. Director era Jenő Janovics, una dintre figurile definitorii ale poveștii noastre.

Apoi a venit ruptura. După Primul Război Mondial, Transilvania a devenit parte a României, iar în 1919 clădirea a fost predată noului Teatru Național Român. Trupa maghiară a trebuit să-și părăsească splendida casă.

Două teatre, două limbi, un singur oraș: până astăzi, teatrul românesc și cel maghiar din Cluj joacă la doar câteva sute de metri unul de celălalt.

Dar Janovics nu a fost doar un om de teatru. Următoarea oprire ne duce în lumea filmului – până la Hollywood.`
      }
    },
    {
      id: "06-casablanca",
      year: 1942,
      coords: [46.76880, 23.58380],
      draftLocation: true,
      title: { en: "From Kolozsvár to Casablanca", hu: "Kolozsvártól Casablancáig", ro: "De la Cluj la Casablanca" },
      subtitle: { en: "Kertész Mihály · Michael Curtiz", hu: "Kertész Mihály · Michael Curtiz", ro: "Mihály Kertész · Michael Curtiz" },
      address: { en: "Central Park", hu: "Sétatér (Parcul Central)", ro: "Parcul Central" },
      text: {
        en: `Jenő Janovics was a film pioneer. From 1913, silent films were made in Kolozsvár, shot with actors from the theatre, often outdoors here in the city. For a few years Kolozsvár became a centre of Hungarian film.

One of the directors who worked for Janovics at the time was a young man from Budapest: Mihály Kertész. A few years later he went to Hollywood and called himself Michael Curtiz.

In 1942 Curtiz made a film there that wrote film history: "Casablanca", starring Humphrey Bogart and Ingrid Bergman. Curtiz won the Oscar for Best Director for it.

And Curtiz was not alone in Hollywood. In front of the camera in "Casablanca" there were also actors from Hungary: Peter Lorre, born László Löwenstein, and S. Z. Sakall, known in Budapest as Szőke Szakáll.

"I think this is the beginning of a beautiful friendship" – and a piece of this story began here, in Kolozsvár.`,
        hu: `Janovics Jenő a filmezés úttörője volt. 1913-tól Kolozsváron némafilmek készültek a színház színészeivel, gyakran a szabad ég alatt, itt a városban. Néhány évig Kolozsvár a magyar film egyik központja volt.

Az egyik rendező, aki akkoriban Janovicsnak dolgozott, egy fiatal budapesti férfi volt: Kertész Mihály. Néhány évvel később Hollywoodba ment, és Michael Curtiznek nevezte magát.

1942-ben Curtiz ott forgatta azt a filmet, amely filmtörténetet írt: a „Casablancát” Humphrey Bogart és Ingrid Bergman főszereplésével. Curtiz ezért megkapta a legjobb rendezőnek járó Oscar-díjat.

És Curtiz nem volt egyedül Hollywoodban. A „Casablanca” kamerái előtt magyar színészek is álltak: Peter Lorre, született Löwenstein László, és S. Z. Sakall, akit Budapesten Szőke Szakállként ismertek.

„Azt hiszem, ez egy gyönyörű barátság kezdete” – és ennek a történetnek egy darabja itt, Kolozsváron kezdődött.`,
        ro: `Jenő Janovics a fost un pionier al filmului. Începând din 1913, la Cluj s-au realizat filme mute, cu actori ai teatrului, adesea în aer liber, aici, în oraș. Timp de câțiva ani, Clujul a devenit un centru al filmului maghiar.

Unul dintre regizorii care lucrau atunci pentru Janovics era un tânăr din Budapesta: Mihály Kertész. Câțiva ani mai târziu a plecat la Hollywood și și-a luat numele de Michael Curtiz.

În 1942, Curtiz a realizat acolo un film care a intrat în istoria cinematografiei: „Casablanca”, cu Humphrey Bogart și Ingrid Bergman. Pentru acest film, Curtiz a primit Premiul Oscar pentru cea mai bună regie.

Iar Curtiz nu era singur la Hollywood. În fața camerei, în „Casablanca”, au jucat și actori din Ungaria: Peter Lorre, născut László Löwenstein, și S. Z. Sakall, cunoscut la Budapesta drept Szőke Szakáll.

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
      coords: [46.7696, 23.5817],
      title: { en: "The Hungarian Theatre today", hu: "A Magyar Színház ma", ro: "Teatrul Maghiar astăzi" },
      subtitle: { en: "Kolozsvári Állami Magyar Színház", hu: "Kolozsvári Állami Magyar Színház", ro: "Teatrul Maghiar de Stat Cluj" },
      address: { en: "Str. Emil Isac 26–28, Cluj-Napoca", hu: "Emil Isac utca 26–28, Kolozsvár", ro: "Str. Emil Isac 26–28, Cluj-Napoca" },
      text: {
        en: `You have reached the end of the tour. This building was originally a summer stage on the edge of the city park. After 1919, when the great house on Hunyadi Square had been lost, it became the new home of the Hungarian company – a temporary solution that became a home.

From 1948 the house became the State Hungarian Theatre, and the Hungarian Opera of Cluj was founded in the same building. Around 1960 the theatre was given its present, modern form.

Since 1990 the director Gábor Tompa has led the house. Under him, the Hungarian Theatre of Cluj has become one of the most internationally acclaimed stages in Romania, touring all over Europe.

More than two hundred and thirty years after the first performances in the Rhédey Palace, Hungarian theatre is still performed here every evening.

Thank you for joining us. We would be delighted to welcome you in our audience soon.`,
        hu: `Megérkezett. Ez az épület eredetileg nyári színkör volt a Sétatér szélén. 1919 után, amikor a Hunyadi téri nagy épület elveszett, a magyar társulat új otthona lett – ideiglenes megoldás, amelyből otthon lett.

1948-tól az épület az Állami Magyar Színház lett, és ugyanebben az épületben alakult meg a Kolozsvári Magyar Opera. 1960 körül nyerte el a színház mai, modern formáját.

1990 óta Tompa Gábor rendező vezeti a színházat. Irányítása alatt a Kolozsvári Állami Magyar Színház Románia egyik nemzetközileg legelismertebb színpada lett, egész Európában vendégszerepel.

Több mint kétszázharminc évvel a Rhédey-palotában tartott első előadások után itt ma is minden este magyarul játszanak.

Köszönjük, hogy velünk tartott. Szeretettel várjuk hamarosan a nézőtéren!`,
        ro: `Ați ajuns la final. Această clădire a fost la origine o scenă de vară la marginea parcului orașului. După 1919, când marea clădire din actuala Piață Ștefan cel Mare a fost pierdută, a devenit noua casă a trupei maghiare – o soluție provizorie care a devenit acasă.

Din 1948, clădirea a devenit Teatrul Maghiar de Stat, iar în aceeași clădire a luat ființă Opera Maghiară din Cluj. În jurul anului 1960, teatrul și-a primit forma modernă de astăzi.

Din 1990, regizorul Gábor Tompa conduce teatrul. Sub conducerea sa, Teatrul Maghiar de Stat Cluj a devenit una dintre cele mai apreciate scene din România pe plan internațional, cu turnee în toată Europa.

La peste două sute treizeci de ani după primele spectacole din Palatul Rhédey, aici se joacă și astăzi, în fiecare seară, teatru în limba maghiară.

Vă mulțumim că ne-ați însoțit. Ne-ar bucura să vă revedem curând în sală.`
      }
    }
  ]
};
