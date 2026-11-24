/*
 * Inhalte der Stadttour.
 *
 * Jede Station hat:
 *   id       – eindeutiger Schlüssel (auch Dateiname für Audio: audio/<id>.mp3)
 *   title    – Name der Station
 *   subtitle – Kurzbeschreibung / Ort
 *   year     – Leitjahr für die Zeitleiste
 *   coords   – [Breite, Länge] (WGS84, ungefähre Werte – vor Ort prüfen!)
 *   address  – heutige Adresse
 *   audio    – Pfad zur Audiodatei; fehlt sie, liest die App den Text per
 *              Sprachausgabe des Geräts vor (Prototyp-Fallback)
 *   text     – Erzähltext (Absätze durch Leerzeile getrennt)
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
      id: "01-hauptplatz",
      title: "Der Hauptplatz",
      subtitle: "Főtér · Piața Unirii",
      year: 1792,
      coords: [46.76993, 23.58975],
      address: "Piața Unirii, Cluj-Napoca",
      audio: "audio/01-hauptplatz.mp3",
      text: `Willkommen in Kolozsvár – so heißt Cluj auf Ungarisch. Sie stehen auf dem Hauptplatz, dem Herzen der Stadt. Über Ihnen ragt die gotische Sankt-Michaels-Kirche auf, davor reitet König Matthias Corvinus in Bronze, ein Werk des Bildhauers János Fadrusz, enthüllt im Jahr 1902.

Über Jahrhunderte war Kolozsvár das geistige Zentrum der Ungarn in Siebenbürgen. Hier tagten Landtage, hier wurden Schulen gegründet, hier wurde gedruckt, gestritten und gedichtet.

Und hier beginnt unsere Geschichte: Im Jahr 1792 gründete sich in Kolozsvár eine Schauspieltruppe, die erstmals regelmäßig in ungarischer Sprache spielte. Eine Bühne gab es noch nicht. Gespielt wurde in Adelspalais und improvisierten Sälen rund um diesen Platz. Das Ungarische Theater Cluj sieht in diesem Jahr seine Geburtsstunde – und zählt damit zu den ältesten ungarischsprachigen Theatern überhaupt.

Gehen Sie nun ein paar Schritte nach Nordwesten, in die Matthias-Corvinus-Straße. Dort wartet ein König auf uns.`
    },
    {
      id: "02-matthias",
      title: "Das Geburtshaus von König Matthias",
      subtitle: "Mátyás király szülőháza",
      year: 1443,
      coords: [46.77125, 23.58775],
      address: "Str. Matei Corvin 6, Cluj-Napoca",
      audio: "audio/02-matthias.mp3",
      text: `In diesem gotischen Bürgerhaus wurde im Jahr 1443 Matthias Hunyadi geboren, der spätere König Matthias Corvinus. Von 1458 bis 1490 regierte er das Königreich Ungarn und machte seinen Hof zu einem der ersten Zentren der Renaissance nördlich der Alpen. Seine Bibliothek, die Bibliotheca Corviniana, war in ganz Europa berühmt.

Für das Theater ist Matthias bis heute eine dankbare Figur. Im Volksmund wurde er zu „Matthias dem Gerechten", der verkleidet durch das Land zieht, Ungerechtigkeit aufdeckt und die Mächtigen bloßstellt. Diese Geschichten wurden erzählt, gesungen und gespielt – auf Jahrmärkten, in Schulen und später auf den großen Bühnen.

Heute nutzt die Universität für Kunst und Design das Haus. Kunst und Kolozsvár gehören hier also immer noch zusammen.

Unsere nächste Station führt uns zurück über den Hauptplatz und dann in die Farkas-Straße, wo die erste feste Bühne stand.`
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

Und hier wurde Theatergeschichte geschrieben. Am 12. März 1821 öffnete in dieser Straße ein Theater aus Stein – das erste feste Haus, das eigens für Aufführungen in ungarischer Sprache gebaut worden war. Bezahlt hatten es siebenbürgische Adlige und Bürger mit Spenden und Subskriptionen. Das Theater in Pest, das spätere Nationaltheater, folgte erst sechzehn Jahre danach.

Fast neunzig Jahre lang war das Haus in der Farkas-Straße die Heimat der Truppe. Hier entwickelte sich ein festes Ensemble, hier spielten große Namen der ungarischen Bühne, darunter in jungen Jahren die Tragödin Mari Jászai.

Vom Gebäude ist heute nichts mehr zu sehen. Aber wenn Sie die Augen schließen, hören Sie vielleicht noch den Applaus.

Weiter geht es nach Süden, den Hügel hinauf, zum Házsongárd-Friedhof.`
    },
    {
      id: "04-hazsongard",
      title: "Der Házsongárd-Friedhof",
      subtitle: "Házsongárdi temető · Cimitirul Central",
      year: 1585,
      coords: [46.7625, 23.5910],
      address: "Str. Avram Iancu, Cluj-Napoca",
      audio: "audio/04-hazsongard.mp3",
      text: `Der Házsongárd-Friedhof gehört zu den ältesten erhaltenen Friedhöfen Mitteleuropas. Seit dem sechzehnten Jahrhundert werden hier die Bürger von Kolozsvár begraben.

Ein Spaziergang zwischen den alten Grabsteinen ist ein Spaziergang durch die ungarische Kulturgeschichte Siebenbürgens: Hier ruhen Gelehrte, Schriftsteller, Professoren, Künstler – und viele Menschen des Theaters. Schauspielerinnen und Schauspieler, Sänger, Regisseure und Direktoren, die die Bühne dieser Stadt über Generationen geprägt haben.

Nehmen Sie sich einen Moment Zeit. Theater ist die flüchtigste aller Künste – jede Vorstellung gibt es nur ein einziges Mal. Was bleibt, ist die Erinnerung der Menschen, die dabei waren.

Von hier gehen wir zurück ins Zentrum, zu einem prachtvollen Theaterbau aus dem Jahr 1906.`
    },
    {
      id: "05-nationaltheater",
      title: "Das Nationaltheater von 1906",
      subtitle: "Hunyadi tér · Piața Ștefan cel Mare",
      year: 1906,
      coords: [46.77035, 23.59745],
      address: "Piața Ștefan cel Mare 2–4, Cluj-Napoca",
      audio: "audio/05-nationaltheater.mp3",
      text: `Dieses neobarocke Theater wurde von den Wiener Architekten Fellner und Helmer entworfen, die in ganz Mitteleuropa Theater bauten. Im September 1906 wurde es als neues ungarisches Nationaltheater von Kolozsvár eröffnet.

Direktor war Jenő Janovics, eine der prägenden Gestalten unserer Geschichte. Janovics war nicht nur Theatermann, sondern auch Filmpionier: Ab 1913 entstanden in Kolozsvár Stummfilme, und hier arbeitete ein junger Regisseur namens Mihály Kertész – der Welt später bekannt als Michael Curtiz, Regisseur von „Casablanca".

Dann kam der Bruch. Nach dem Ersten Weltkrieg wurde Siebenbürgen Teil Rumäniens, und 1919 ging das Gebäude an das neu gegründete Rumänische Nationaltheater über. Bis heute spielen hier das Rumänische Nationaltheater und die Rumänische Oper.

Die ungarische Truppe musste umziehen. Wohin? Das erfahren Sie an unserer letzten Station, am Rand des Zentralparks.`
    },
    {
      id: "06-ungarisches-theater",
      title: "Das Ungarische Theater heute",
      subtitle: "Kolozsvári Állami Magyar Színház",
      year: 1919,
      coords: [46.7696, 23.5817],
      address: "Str. Emil Isac 26–28, Cluj-Napoca",
      audio: "audio/06-ungarisches-theater.mp3",
      text: `Sie sind am Ziel. Dieses Gebäude war ursprünglich eine Sommerbühne am Rand des Stadtparks. Nach 1919 wurde es zur neuen Heimat des ungarischen Ensembles – ein Provisorium, das zum Zuhause wurde.

Jenő Janovics führte die Truppe durch die schwierigen Jahre. Ab 1948 wurde das Haus zum staatlichen Ungarischen Theater, und im selben Gebäude entstand die Ungarische Oper Cluj. Um 1960 erhielt das Theater seine heutige, moderne Gestalt.

Seit 1990 leitet der Regisseur Gábor Tompa das Haus. Unter ihm wurde das Ungarische Theater Cluj zu einer der international beachtetsten Bühnen Rumäniens, mit Gastspielen in ganz Europa und Mitglied der Union der Theater Europas.

Mehr als zweihundertdreißig Jahre nach den ersten Vorstellungen in den Palais am Hauptplatz wird hier noch immer jeden Abend ungarisch gespielt.

Vielen Dank, dass Sie uns begleitet haben. Wir würden uns freuen, Sie bald im Publikum zu begrüßen.`
    }
  ]
};
