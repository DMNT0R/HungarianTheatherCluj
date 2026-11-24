/*
 * Inhalte der Stadttour.
 *
 * Jede Station hat:
 *   id        – eindeutiger Schlüssel (auch Dateiname für Audio: audio/<id>.mp3)
 *   title     – Name der Station
 *   subtitle  – Kurzbeschreibung / Ort
 *   year      – Leitjahr für die Zeitleiste
 *   coords    – [Breite, Länge] (WGS84, ungefähre Werte – vor Ort prüfen!)
 *   address   – heutige Adresse
 *   audio     – Pfad zur Audiodatei; fehlt sie, liest die App den Text per
 *               Sprachausgabe des Geräts vor (Prototyp-Fallback)
 *   text      – Erzähltext (Absätze durch Leerzeile getrennt)
 *   activity  – optional: Mitmach-Element {icon, title, text, photo, items}
 *               photo: true  -> Button „Foto aufnehmen" (bleibt auf dem Gerät)
 *               items: [...] -> Liste (z. B. Gräber, Filmtitel)
 *   links     – optional: [{label, url}]
 *   draftLocation – true, wenn der genaue Ort noch festgelegt werden muss
 *
 * HINWEIS: Die Texte sind Entwürfe für den Prototyp. Daten und Namen müssen
 * vom Ungarischen Theater Cluj (Kolozsvári Állami Magyar Színház)
 * historisch geprüft und freigegeben werden.
 */
window.TOUR = {
  title: "Bühne Kolozsvár",
  subtitle: "Ein Spaziergang durch die ungarische Theatergeschichte von Cluj",
  organizer: "Ungarisches Theater Cluj · Kolozsvári Állami Magyar Színház",
  lang: "de-DE",
  stations: [
    {
      id: "01-rhedey",
      title: "Rhédey-Palais & Rhédey Café",
      subtitle: "Főtér · Piața Unirii",
      year: 1792,
      coords: [46.76975, 23.58890],
      draftLocation: true,
      address: "Piața Unirii, Cluj-Napoca",
      audio: "audio/01-rhedey.mp3",
      text: `Willkommen in Kolozsvár – so heißt Cluj auf Ungarisch. Sie stehen am Hauptplatz, dem Herzen der Stadt, mit der gotischen Sankt-Michaels-Kirche und dem Reiterstandbild von König Matthias Corvinus.

Hier beginnt unsere Geschichte. Im Jahr 1792 gründete sich in Kolozsvár eine Schauspieltruppe, die erstmals regelmäßig in ungarischer Sprache spielte. Ein Theatergebäude gab es noch nicht. Die ersten Vorstellungen fanden in einem Adelspalais statt – im Palais der Familie Rhédey, hier am Hauptplatz.

Man muss sich das vorstellen: Kerzenlicht, ein Saal voller Adliger und Bürger in Seide und Samt, und auf einer improvisierten Bühne Schauspieler, die zum ersten Mal in ihrer eigenen Sprache spielen. Das Ungarische Theater Cluj sieht in diesem Jahr seine Geburtsstunde.

Heute lädt das Rhédey Café in die alten Mauern ein. Und Sie sind eingeladen, selbst ein Teil dieser Geschichte zu werden: Schlüpfen Sie in ein Kostüm und stehen Sie für einen Moment auf der Bühne von 1792.`,
      activity: {
        icon: "🎭",
        title: "Kostümiert ins Jahr 1792",
        text: "Im Rhédey Café liegen historische Kostüme aus dem Fundus des Ungarischen Theaters bereit. Verkleiden Sie sich, machen Sie ein Erinnerungsfoto – und teilen Sie es mit #BühneKolozsvár.",
        photo: true
      }
    },
    {
      id: "02-matthias",
      title: "Das Geburtshaus von König Matthias",
      subtitle: "Mátyás király szülőháza",
      year: 1443,
      coords: [46.77125, 23.58775],
      address: "Str. Matei Corvin 6, Cluj-Napoca",
      audio: "audio/02-matthias.mp3",
      text: `In diesem gotischen Bürgerhaus wurde im Jahr 1443 Matthias Hunyadi geboren, der spätere König Matthias Corvinus. Von 1458 bis 1490 regierte er das Königreich Ungarn und machte seinen Hof zu einem der ersten Zentren der Renaissance nördlich der Alpen.

Für das Theater ist Matthias bis heute eine dankbare Figur. Im Volksmund wurde er zu „Matthias dem Gerechten", der verkleidet durch das Land zieht, Ungerechtigkeit aufdeckt und die Mächtigen bloßstellt. Diese Geschichten wurden erzählt, gesungen und gespielt – auf Jahrmärkten, in Schulen und später auf den großen Bühnen.

Heute nutzt die Universität für Kunst und Design das Haus. Kunst und Kolozsvár gehören hier also immer noch zusammen.

Unsere nächste Station führt uns in die Farkas-Straße, wo die erste feste Bühne stand.`
    },
    {
      id: "03-farkas",
      title: "Das erste steinerne Theater",
      subtitle: "Farkas utca · Str. Mihail Kogălniceanu",
      year: 1821,
      coords: [46.76735, 23.59195],
      address: "Str. Mihail Kogălniceanu, Cluj-Napoca",
      audio: "audio/03-farkas.mp3",
      text: `Die Farkas-Straße war die Straße der Gelehrten: Hier stehen die reformierte Kirche aus der Zeit von König Matthias, alte Kollegien und die Universität.

Und hier wurde Theatergeschichte geschrieben. Im Jahr 1821 öffnete in dieser Straße ein Theater aus Stein – das erste feste Haus, das eigens für Aufführungen in ungarischer Sprache gebaut worden war. Bezahlt hatten es siebenbürgische Adlige und Bürger mit Spenden.

Fast neunzig Jahre lang war das Haus in der Farkas-Straße die Heimat der Truppe. Hier entwickelte sich ein festes Ensemble, hier spielten große Namen der ungarischen Bühne.

Vom Gebäude ist heute nichts mehr zu sehen. Aber wenn Sie die Augen schließen, hören Sie vielleicht noch den Applaus.

Weiter geht es nach Süden, den Hügel hinauf, zum Zentralfriedhof.`
    },
    {
      id: "04-hazsongard",
      title: "Zentralfriedhof Házsongárd",
      subtitle: "Házsongárdi temető · Cimitirul Central",
      year: 1585,
      coords: [46.7625, 23.5910],
      address: "Str. Avram Iancu, Cluj-Napoca",
      audio: "audio/04-hazsongard.mp3",
      text: `Der Házsongárd-Friedhof, heute offiziell Zentralfriedhof, gehört zu den ältesten erhaltenen Friedhöfen Mitteleuropas. Seit dem sechzehnten Jahrhundert werden hier die Bürger von Kolozsvár begraben.

Ein Spaziergang zwischen den alten Grabsteinen ist ein Spaziergang durch die Kulturgeschichte Siebenbürgens: Hier ruhen Gelehrte, Schriftsteller und Künstler – und viele Menschen des Theaters. Schauspielerinnen und Schauspieler, Sänger, Regisseure und Direktoren, die die Bühne dieser Stadt über Generationen geprägt haben.

Nehmen Sie sich einen Moment Zeit. Theater ist die flüchtigste aller Künste – jede Vorstellung gibt es nur ein einziges Mal. Was bleibt, ist die Erinnerung der Menschen, die dabei waren.

Von hier gehen wir zurück ins Zentrum, zu einem prachtvollen Theaterbau, der eine überraschende Geschichte hat.`,
      activity: {
        icon: "🕯️",
        title: "Spurensuche: Gräber der Schauspieler",
        text: "Finden Sie die Gräber großer Theaterleute. (Liste und Lageplan werden vom Theater ergänzt.)",
        items: [
          "Grab 1 – Name, Lebensdaten, berühmteste Rolle",
          "Grab 2 – Name, Lebensdaten, berühmteste Rolle",
          "Grab 3 – Name, Lebensdaten, berühmteste Rolle"
        ]
      }
    },
    {
      id: "05-nationaltheater",
      title: "Rumänisches Theater, ungarisch erbaut",
      subtitle: "Hunyadi tér · Piața Ștefan cel Mare",
      year: 1906,
      coords: [46.77035, 23.59745],
      address: "Piața Ștefan cel Mare 2–4, Cluj-Napoca",
      audio: "audio/05-nationaltheater.mp3",
      text: `Vor Ihnen steht das Rumänische Nationaltheater mit der Rumänischen Oper. Was viele Besucher nicht wissen: Gebaut wurde dieses Haus als ungarisches Theater.

Die Wiener Architekten Fellner und Helmer, die in ganz Mitteleuropa Theater bauten, entwarfen das neobarocke Gebäude. Im Jahr 1906 wurde es als neues ungarisches Nationaltheater von Kolozsvár eröffnet. Direktor war Jenő Janovics, eine der prägenden Gestalten unserer Geschichte.

Dann kam der Bruch. Nach dem Ersten Weltkrieg wurde Siebenbürgen Teil Rumäniens, und 1919 ging das Gebäude an das neu gegründete Rumänische Nationaltheater über. Die ungarische Truppe musste ihr prachtvolles Haus verlassen.

Zwei Theater, zwei Sprachen, eine Stadt: Bis heute spielen das rumänische und das ungarische Theater in Cluj nur wenige hundert Meter voneinander entfernt.

Doch Janovics war nicht nur Theatermann. Unsere nächste Station führt uns in die Welt des Films – und bis nach Hollywood.`
    },
    {
      id: "06-casablanca",
      title: "Von Kolozsvár nach Casablanca",
      subtitle: "Kertész Mihály · Michael Curtiz",
      year: 1942,
      coords: [46.76880, 23.58380],
      draftLocation: true,
      address: "Zentralpark (Ort vorläufig)",
      audio: "audio/06-casablanca.mp3",
      text: `Jenő Janovics war ein Pionier des Films. Ab 1913 entstanden in Kolozsvár Stummfilme, gedreht mit Schauspielern des Theaters, oft unter freiem Himmel hier in der Stadt. Kolozsvár wurde für einige Jahre zu einem Zentrum des ungarischen Films.

Einer der Regisseure, die damals für Janovics arbeiteten, war ein junger Mann aus Budapest: Mihály Kertész. Wenige Jahre später ging er nach Hollywood und nannte sich Michael Curtiz.

Im Jahr 1942 drehte Curtiz dort einen Film, der Filmgeschichte schrieb: „Casablanca", mit Humphrey Bogart und Ingrid Bergman. Curtiz erhielt dafür den Oscar für die beste Regie.

Und Curtiz war in Hollywood nicht allein. Auch vor der Kamera standen in „Casablanca" Schauspieler aus Ungarn: Peter Lorre, geboren als László Löwenstein, und S. Z. Sakall, in Budapest bekannt als Szőke Szakáll.

„Ich glaube, dies ist der Beginn einer wunderbaren Freundschaft" – und ein Stück dieser Geschichte begann hier, in Kolozsvár.`,
      activity: {
        icon: "🎬",
        title: "Ungarn in „Casablanca“",
        text: "Wer gehört dazu?",
        items: [
          "Michael Curtiz (Kertész Mihály) – Regie, Oscar 1944",
          "Peter Lorre (Löwenstein László) – als Ugarte",
          "S. Z. Sakall (Szőke Szakáll) – als Oberkellner Carl"
        ]
      },
      links: [
        { label: "Ungarische Schauspieler (actors.hu)", url: "https://actors.hu" }
      ]
    },
    {
      id: "07-ungarisches-theater",
      title: "Das Ungarische Theater heute",
      subtitle: "Kolozsvári Állami Magyar Színház",
      year: 1919,
      coords: [46.7696, 23.5817],
      address: "Str. Emil Isac 26–28, Cluj-Napoca",
      audio: "audio/07-ungarisches-theater.mp3",
      text: `Sie sind am Ziel. Dieses Gebäude war ursprünglich eine Sommerbühne am Rand des Stadtparks. Nach 1919, als das große Haus am Hunyadi-Platz verloren war, wurde es zur neuen Heimat des ungarischen Ensembles – ein Provisorium, das zum Zuhause wurde.

Ab 1948 wurde das Haus zum staatlichen Ungarischen Theater, und im selben Gebäude entstand die Ungarische Oper Cluj. Um 1960 erhielt das Theater seine heutige, moderne Gestalt.

Seit 1990 leitet der Regisseur Gábor Tompa das Haus. Unter ihm wurde das Ungarische Theater Cluj zu einer der international beachtetsten Bühnen Rumäniens, mit Gastspielen in ganz Europa.

Mehr als zweihundertdreißig Jahre nach den ersten Vorstellungen im Rhédey-Palais wird hier noch immer jeden Abend ungarisch gespielt.

Vielen Dank, dass Sie uns begleitet haben. Wir würden uns freuen, Sie bald im Publikum zu begrüßen.`
    }
  ]
};
