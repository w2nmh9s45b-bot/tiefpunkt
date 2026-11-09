/* Kritzelraten – Begriffe zum Zeichnen. Alle selbst zusammengestellt, familientauglich, in drei Stufen.
   leicht: Dinge, die man mit wenigen Strichen erkennt. mittel: braucht eine kleine Szene. schwer: zusammengesetzt,
   Tätigkeiten oder Ideen. Mehrere erlaubte Lösungen mit „|“ trennen: der erste Begriff wird gezeigt, die anderen
   gelten beim Raten ebenfalls (z. B. 'Fahrrad|Rad'). */
"use strict";
(function () {
  const ROH = {
    leicht: `Haus|Baum|Sonne|Mond|Stern|Auto|Fahrrad|Ball|Apfel|Banane|Birne|Kirsche|Erdbeere|Blume|Herz|Fisch|Katze|Hund|Maus|Vogel|
      Schlange|Schnecke|Spinne|Biene|Schmetterling|Hase|Pferd|Kuh|Schwein|Schaf|Ente|Huhn|Elefant|Giraffe|Löwe|Krokodil|Schildkröte|Frosch|Eule|Pinguin|
      Wal|Hai|Krake|Igel|Bär|Affe|Zebra|Kamel|Schiff|Boot|Flugzeug|Zug|Bus|Rakete|Hubschrauber|Traktor|Brille|Hut|Schuh|Socke|
      Hose|Kleid|Mütze|Schal|Handschuh|Regenschirm|Uhr|Schlüssel|Schloss|Tür|Fenster|Leiter|Stuhl|Tisch|Bett|Lampe|Kerze|Buch|Stift|Schere|
      Löffel|Gabel|Messer|Teller|Tasse|Glas|Flasche|Topf|Pfanne|Eis|Kuchen|Brot|Käse|Ei|Pizza|Wurst|Möhre|Pilz|Tomate|Zitrone|
      Ananas|Trauben|Brezel|Lolli|Bonbon|Torte|Wolke|Regen|Schnee|Blitz|Regenbogen|Berg|Insel|Welle|Feuer|Tropfen|Blatt|Kaktus|Tulpe|Rose|
      Gras|Tanne|Palme|Nest|Feder|Knochen|Zahn|Auge|Nase|Ohr|Mund|Hand|Fuß|Daumen|Bauch|Haare|Krone|Geschenk|Ballon|Drachen|
      Trommel|Gitarre|Glocke|Pfeife|Telefon|Handy|Fernseher|Computer|Kamera|Radio|Würfel|Puzzle|Teddy|Puppe|Roboter|Schneemann|Gespenst|Hexe|Pirat|Anker|
      Kreuz|Pfeil|Zelt|Burg|Kirche|Turm|Brücke|Ampel|Straße|Zaun|Briefkasten|Brief|Kiste|Korb|Tasche|Rucksack|Koffer|Gürtel|Ring|Kette`,
    mittel: `Leuchtturm|Windmühle|Vulkan|Wasserfall|Iglu|Pyramide|Wüste|Strand|Hafen|Bahnhof|Flughafen|Spielplatz|Schaukel|Rutsche|Karussell|Riesenrad|Zirkus|Clown|Zauberer|Ritter|
      Prinzessin|Drache|Einhorn|Meerjungfrau|Zwerg|Engel|Weihnachtsbaum|Osterhase|Adventskranz|Kürbis|Laterne|Feuerwerk|Konfetti|Geburtstag|Hochzeit|Picknick|Lagerfeuer|Taucher|Astronaut|Feuerwehr|
      Polizist|Arzt|Koch|Bäcker|Maler|Gärtner|Bauer|Lehrer|Friseur|Fußballer|Schiedsrichter|Torwart|Tennis|Golf|Kegeln|Angeln|Reiten|Skifahren|Schlittschuh|Surfen|
      Boxen|Schwimmen|Turnen|Fallschirm|Heißluftballon|Seilbahn|Wohnmobil|Motorrad|Roller|Skateboard|Kinderwagen|Rollstuhl|Krankenwagen|Bagger|Kran|Müllauto|Tankstelle|Parkhaus|Zebrastreifen|Kreisverkehr|
      Badewanne|Dusche|Toilette|Waschmaschine|Kühlschrank|Staubsauger|Bügeleisen|Föhn|Zahnbürste|Spiegel|Sofa|Kamin|Treppe|Dachboden|Keller|Garage|Gartenzwerg|Gießkanne|Schubkarre|Rasenmäher|
      Vogelhaus|Hundehütte|Aquarium|Spinnennetz|Ameisenhaufen|Bienenstock|Maulwurf|Fledermaus|Papagei|Flamingo|Pfau|Storch|Möwe|Delfin|Seestern|Qualle|Hummer|Krabbe|Robbe|Eisbär|
      Känguru|Koala|Faultier|Nashorn|Nilpferd|Gorilla|Wolf|Fuchs|Eichhörnchen|Hirsch|Dinosaurier|Mammut|Marienkäfer|Libelle|Regenwurm|Raupe|Kokosnuss|Wassermelone|Popcorn|Pommes|
      Hamburger|Hotdog|Spiegelei|Spaghetti|Suppe|Sandwich|Muffin|Donut|Waffel|Pfannkuchen|Honig|Marmelade|Müsli|Kaffee|Tee|Milchshake|Saft|Zuckerwatte|Schokolade|Keks|
      Kompass|Lupe|Fernglas|Teleskop|Mikroskop|Magnet|Batterie|Glühbirne|Steckdose|Kabel|Hammer|Säge|Schraube|Nagel|Zange|Pinsel|Farbeimer|Klebeband|Büroklammer|Taschenrechner|
      Kalender|Wecker|Sanduhr|Waage|Thermometer|Pflaster|Spritze|Tablette|Zahnarzt|Krücke|Fußabdruck|Schatten|Kuss|Lachen|Weinen|Schlafen|Niesen|Gähnen|Winken|Tanzen`,
    schwer: `Achterbahn|Geisterbahn|Autowaschanlage|Rolltreppe|Fahrstuhl|Wolkenkratzer|Freiheitsstatue|Eiffelturm|Raumstation|Sternschnuppe|Mondfinsternis|Polarlicht|Tornado|Erdbeben|Lawine|Ebbe|Sonnenuntergang|Gewitter|Nebel|Hagel|
      Gänsehaut|Muskelkater|Ohrwurm|Kopfschmerzen|Schluckauf|Sonnenbrand|Albtraum|Heimweh|Langeweile|Eifersucht|Geheimnis|Überraschung|Idee|Glück|Pech|Zeitreise|Schwerkraft|Echo|Spiegelbild|Gedanke|
      Stromausfall|Stau|Umleitung|Baustelle|Einbahnstraße|Sackgasse|Parkverbot|Tunnel|Grenze|Zoll|Hängematte|Liegestuhl|Sandburg|Luftmatratze|Schnorchel|Rettungsring|Flaschenpost|Schatzkarte|Schatztruhe|Kanone|
      Ritterrüstung|Zugbrücke|Burggraben|Kerker|Thron|Zepter|Hofnarr|Wikinger|Indianerzelt|Höhlenmensch|Mumie|Vampir|Werwolf|Zombie|Außerirdischer|Ufo|Zeitmaschine|Zauberstab|Kristallkugel|Fliegender Teppich|
      Weltreise|Reisepass|Fahrkarte|Gepäckband|Sicherheitsgurt|Notausgang|Feuerlöscher|Rauchmelder|Alarmanlage|Tresor|Fingerabdruck|Handschellen|Gefängnis|Gericht|Detektiv|Spion|Bankraub|Lösegeld|Steckbrief|Verfolgungsjagd|
      Hochsprung|Weitsprung|Staffellauf|Siegerpodest|Medaille|Pokal|Elfmeter|Abseits|Eigentor|Fallrückzieher|Seilspringen|Tauziehen|Sackhüpfen|Verstecken|Fangen|Purzelbaum|Handstand|Spagat|Kopfsprung|Arschbombe|
      Kopfkissenschlacht|Schneeballschlacht|Wasserschlacht|Seifenblase|Kaugummiblase|Knallbonbon|Wunderkerze|Glücksklee|Hufeisen|Glücksschwein|Schornsteinfeger|Weihnachtsmann|Nikolausstiefel|Wunschzettel|Christkind|Ostereier|Karneval|Maske|Kostüm|Konzert|
      Dirigent|Orchester|Chor|Ballett|Pantomime|Puppentheater|Kino|Popcornmaschine|Eintrittskarte|Applaus|Selfie|Videoanruf|Fernbedienung|Ladekabel|Kopfhörer|Tastatur|Drucker|Schneckenpost|Briefmarke|Paketbote|
      Wäscheleine|Kleiderbügel|Reißverschluss|Sicherheitsnadel|Nähmaschine|Stricken|Wollknäuel|Bücherwurm|Leseratte|Naschkatze|Angsthase|Schlafmütze|Pechvogel|Glückspilz|Frechdachs|Faulpelz|Hausaufgaben|Zeugnis|Schultüte|Pausenbrot|
      Kassenzettel|Einkaufswagen|Sonderangebot|Warteschlange|Wahlurne|Bürgermeister|Rathaus|Denkmal|Springbrunnen|Marktplatz|Flohmarkt|Weinberg|Bergsteiger|Gipfelkreuz|Hängebrücke|Floß|Kanu|Segelboot|U-Boot|Containerschiff`
  };
  const BEGRIFFE = [];
  for (const stufe of ['leicht', 'mittel', 'schwer'])
    for (const roh of ROH[stufe].split('|').map(s => s.trim()).filter(Boolean)) BEGRIFFE.push({ b: roh, s: stufe });
  // Erlaubte Zweitlösungen (gelten beim Raten, gezeigt wird der erste Begriff)
  const AUCH = { 'Fahrrad': ['Rad'], 'Handy': ['Smartphone'], 'Fernseher': ['Fernsehen'], 'Teddy': ['Teddybär'], 'Möhre': ['Karotte', 'Mohrrübe'],
    'Trauben': ['Weintrauben', 'Traube'], 'Lolli': ['Lutscher'], 'Ufo': ['Raumschiff'], 'Außerirdischer': ['Alien'], 'Pommes': ['Pommes frites'],
    'Hamburger': ['Burger'], 'Dinosaurier': ['Dino'], 'Fahrstuhl': ['Aufzug', 'Lift'], 'Kopfhörer': ['Kopfhoerer'], 'Feuerwehr': ['Feuerwehrauto'],
    'Krankenwagen': ['Rettungswagen'], 'Polizist': ['Polizei'], 'Fußballer': ['Fußball'], 'Schlittschuh': ['Schlittschuhlaufen', 'Eislaufen'],
    'Skifahren': ['Ski'], 'Tennis': ['Tennisschläger'], 'Golf': ['Golfen'], 'Angeln': ['Angel'], 'Reiten': ['Reiter'], 'Surfen': ['Surfer'],
    'Schwimmen': ['Schwimmer'], 'Taucher': ['Tauchen'], 'Arzt': ['Ärztin', 'Doktor'], 'Koch': ['Köchin'], 'Lehrer': ['Lehrerin'], 'Maler': ['Malerin'],
    'Zug': ['Eisenbahn', 'Lok'], 'Ballon': ['Luftballon'], 'Krake': ['Tintenfisch', 'Oktopus'], 'Pilz': ['Fliegenpilz'], 'Stift': ['Bleistift'],
    'Weihnachtsbaum': ['Tannenbaum', 'Christbaum'], 'Weihnachtsmann': ['Nikolaus'], 'Gespenst': ['Geist'], 'Wal': ['Walfisch'], 'Hai': ['Haifisch'] };
  BEGRIFFE.forEach(e => { if (AUCH[e.b]) e.auch = AUCH[e.b]; });
  if (typeof module !== 'undefined') module.exports = BEGRIFFE; else window.KRITZELN_BEGRIFFE = BEGRIFFE;
})();
