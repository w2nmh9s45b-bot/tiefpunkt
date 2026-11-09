"use strict";
/* Ausgabe „Blaues Ländchen“ für Rheinbaron – die Region um Nastätten (Verbandsgemeinde Nastätten, Rhein-Lahn-Kreis):
   Stadt Nastätten und 31 Ortsgemeinden. Recherche-Stand 09.11.2026.

   QUELLEN
   - Wikipedia: Blaues Ländchen (Name: blau gefärbtes Leinen aus Flachs, Färberwaid; Fastenbrezel; Museum)
     https://de.wikipedia.org/wiki/Blaues_L%C3%A4ndchen
   - Wikipedia: Nastätten (893 erwähnt, Stadtrecht 1817, Seidenweberei 1907–1970, Paulinenstift, Freibad, Kino,
     Segelfluggelände) https://de.wikipedia.org/wiki/Nast%C3%A4tten
   - Wikipedia: Liste der Kulturdenkmäler in Nastätten (Altes Rathaus Römerstraße 1 von 1609, Bahnhof Bahnhofstraße,
     Hahnenmühle, Hof Schwall mit Sauerbrunnen) https://de.wikipedia.org/wiki/Liste_der_Kulturdenkm%C3%A4ler_in_Nast%C3%A4tten
   - Wikipedia: Verbandsgemeinde Nastätten (31 Ortsgemeinden, Einwohnerzahlen 2025)
     https://de.wikipedia.org/wiki/Verbandsgemeinde_Nast%C3%A4tten
   - Wikipedia: Nassauische Kleinbahn (Meterspur ab Nastätten nach St. Goarshausen, Zollhaus und Braubach; Halte
     Bogel, Holzhausen, Miehlen, Marienfels; Personenverkehr St. Goarshausen bis 1952; Trasse heute Loreley-Aar-Radweg)
     https://de.wikipedia.org/wiki/Nassauische_Kleinbahn
   - Wikipedia: Miehlen (Marktrecht 1475, Hauserbacher See seit 1970, Schinderhannes „nicht zweifelsfrei“ hier geboren,
     Großmutter von Walt Disney aus Miehlen) https://de.wikipedia.org/wiki/Miehlen
   - Wikipedia: Kastell Holzhausen (am Grauen Kopf, sehr gut erhalten, UNESCO-Welterbe Limes)
     https://de.wikipedia.org/wiki/Kastell_Holzhausen
   - Wikipedia: Kloster Schönau (Strüth) (Benediktiner 1126, Elisabeth von Schönau) https://de.wikipedia.org/wiki/Kloster_Sch%C3%B6nau_(Str%C3%BCth)
   - VG Nastätten, Sehenswertes: Burgen (Lipporner Schanze, Burg Heppenheft bei Niederwallmenach), Kirchen
     (Marienfels, Gemmerich, Niederbachheim, Miehlen, Oelsberger Kapelle …), Natur (Sauerbrunnen Schwall – Tafelwasser
     „Sinaro“ bis nach England, Buch mit blauem Pferd, Alte Eiche Endlichhofen, Streuobstgarten Bogel, Obstlehrpfad
     Berg), Aussichten https://www.vgnastaetten.de/tourismus-freizeit/sehenswertes-im-blauen-laendchen/
   - Oktobermarkt (größte Kirmes im Kreis, Fackelzug, Fassbieranstich am Kerbebaum, Feuerwerk, Marktplatz) und
     Blaufärbermarkt (Römerstraße): https://ben-kurier.de/2025/10/24/nastaetter-oktobermarkt-eroeffnet-karnevals-bruderschaft-mit-fackelzug-trotz-regenwetter/
     https://www.museum-leben-und-arbeiten.de/ (Regionalmuseum mit Kleinbahn-Modellen und Mineralwasserkrügen)
   - ABO Energy, Windenergie VG Nastätten (Windpark Himmighofen-Kasdorf genehmigt 2024)
     https://www.aboenergy.com/de/entwicklung-errichtung/projekte/rheinland-pfalz/windenergie-vg-nastaetten/index.php
   - OpenStreetMap/Overpass (Abruf 09.11.2026, User-Agent spieltisch-recherche): Lage aller Orte (Mittelbild),
     Mühlbach, Limes-Wachtürme, Nicolaus-August-Otto-Museum Holzhausen, Kunstwerk „Blauschimmel oder Blaues Wunder“ in
     Buch, Marktplatz/Römerstraße, Waldschwimmbad, Campingplatz Zum Mühlbachtal, Hauserbachsee.

   ECHT: alle Feldnamen (Orte, Bauwerke, Kleinbahn-Halte, Windpark, Sauerbrunnen), Oktobermarkt mit Kerbebaum,
   Blaufärbermarkt, Fastenbrezel, Flachs/Blaufärberei, Bäderstraße (B 260), Loreley-Aar-Radweg, Limeswanderweg.
   ERFUNDEN bzw. nur ortstypisch: der „Färberbottich“ als Gefängnis und der „Färberhaken“ als Frei-Karte, „Bank am
   Mühlbach“ (Frei Parken), die Stapelnamen „Blaues Wunder“ und „Ländchenkasse“, alle Anlässe der Kartentexte
   (Fastenbrezel-Wettbewerb, Kürbiswiegen, Mineralwasserkrug-Verkauf …), die Abgabe „Kerbe-Standgeld“.
   Die Kleinbahnhöfe sind historisch – die Kleinbahn fährt seit den 1950er-Jahren nicht mehr. */
(function () {
  const A = {
    id: 'blauesland', name: 'Blaues Ländchen', reihenfolge: 3,
    spielname: 'Ländchenbaron',
    unter: 'Kaufen, bauen, kassieren – von Ehr bis zum Nastätter Marktplatz.',
    beschreibung: 'Das Blaue Ländchen rund um Nastätten: Dörfer, Limes, Kloster, Kleinbahn und Oktobermarkt.',
    regelnIntro: '<p>Zieht durchs Blaue Ländchen – von Ehr und Endlichhofen über Limes, Kloster und alte Kleinbahn bis zum Nastätter Marktplatz. Kauft Dörfer und Sehenswürdigkeiten, baut Häuser und kassiert Miete. Wer am Ende als Einzige oder Einziger nicht pleite ist, gewinnt.</p>',
    begriffe: {
      start: 'Kerbebaum',
      turm: 'Färberbottich', imTurm: 'im Färberbottich', inDenTurm: 'in den Färberbottich', ausDemTurm: 'aus dem Färberbottich',
      abInTurm: 'Ab in den Färberbottich',
      pause: 'Bank am Mühlbach', pauseText: 'Füße hoch, nichts passiert',
      schluessel: 'Färberhaken', schluesselMz: 'Färberhaken',
      bahnhof: 'Kleinbahnhof', bahnhoefe: 'Kleinbahnhöfe',
      werk: 'Kraftquelle', werke: 'Kraftquellen',
      ereignis: 'Blaues Wunder', gemeinschaft: 'Ländchenkasse',
      steuer: 'Abgabe'
    },
    gruppen: {
      braun: 'Kleinste Dörfer', hellblau: 'Rheinhöhe', pink: 'Bachheimer Grund', orange: 'Nastätter Nachbarn',
      rot: 'Am Limes', gelb: 'Südliches Ländchen', gruen: 'An der Bäderstraße', blau: 'Nastätter Stadtmitte'
    },
    felder: [
      {n: 'Kerbebaum', trenn: 'Kerbe\u00adbaum'},  // 0 start
      {n: 'Ehr', ort: 'Kleinste Gemeinde des Ländchens – rund 90 Leute, aber jeder kennt jeden'},  // 1 braun 60 €
      {trenn: 'Länd\u00adchen\u00adkasse'},  // 2 gemeinschaft
      {n: 'Endlichhofen', ort: 'Kleines Dorf mit der uralten Eiche am Ortseingang', trenn: 'Endlich\u00adhofen'},  // 3 braun 60 €
      {n: 'Verbandsgemeindeumlage', trenn: 'Verbands\u00adgemeinde\u00adumlage'},  // 4 steuer 200 €
      {n: 'Kleinbahn Marienfels', ort: 'Einstiger Halt der Kleinbahn Nastätten–Braubach, Personenzüge bis 1929', trenn: 'Klein\u00adbahn Marien\u00adfels'},  // 5 bahnhof 200 €
      {n: 'Winterwerb', ort: 'Kleines Dorf auf der Höhe über dem Rheintal', trenn: 'Winter\u00adwerb'},  // 6 hellblau 100 €
      {trenn: 'Blaues Wunder'},  // 7 ereignis
      {n: 'Eschbach', ort: 'Dorf am Westrand des Ländchens, nur sechs Kilometer vom Rhein', trenn: 'Esch\u00adbach'},  // 8 hellblau 100 €
      {n: 'Gemmerich', ort: 'Trinitatiskirche mit Kanzel von 1730 und Barockorgel', trenn: 'Gemme\u00adrich'},  // 9 hellblau 120 €
      {},  // 10 turm
      {n: 'Niederbachheim', ort: 'Hoch gelegene Kirche mit Wandtabernakel aus dem 14. Jahrhundert', trenn: 'Nieder\u00adbach\u00adheim'},  // 11 pink 140 €
      {n: 'Windpark Himmighofen', ort: 'Strom vom Wind auf der Höhe zwischen Himmighofen und Kasdorf', trenn: 'Wind\u00adpark Himmig\u00adhofen'},  // 12 werk 150 €
      {n: 'Oberbachheim', ort: 'Dorf im Bachheimer Grund, ganz im Westen der Verbandsgemeinde', trenn: 'Ober\u00adbach\u00adheim'},  // 13 pink 140 €
      {n: 'Marienfels', ort: 'Romanische Kirche auf dem Fels, älteste im Nassauer Land', trenn: 'Marien\u00adfels'},  // 14 pink 160 €
      {n: 'Kleinbahn Miehlen', ort: 'Bahnhof der Kleinbahn nach Braubach, Güterzüge bis 1955', trenn: 'Klein\u00adbahn Mieh\u00adlen'},  // 15 bahnhof 200 €
      {n: 'Oelsberger Kapelle', ort: 'Alte Wallfahrtskapelle mit Wandmalereien von etwa 1480', trenn: 'Oels\u00adberger Kapelle'},  // 16 orange 180 €
      {trenn: 'Länd\u00adchen\u00adkasse'},  // 17 gemeinschaft
      {n: 'Blauschimmel von Buch', ort: 'Das blaue Pferd auf der Wiese am Bucher Sauerbrunnen', trenn: 'Blau\u00adschimmel von Buch'},  // 18 orange 180 €
      {n: 'Streuobstgarten Bogel', ort: 'Lehrpfad mit alten nassauischen Obstsorten', trenn: 'Streu\u00adobst\u00adgarten Bogel'},  // 19 orange 200 €
      {},  // 20 pause
      {n: 'Obstlehrpfad Berg', ort: 'Römisch-germanischer Obstlehrpfad am Limeswanderweg', trenn: 'Obst\u00adlehr\u00adpfad Berg'},  // 21 rot 220 €
      {trenn: 'Blaues Wunder'},  // 22 ereignis
      {n: 'Limesweg Hunzel', ort: 'Der Limeswanderweg führt mitten durch den Ort', trenn: 'Limes\u00adweg Hunzel'},  // 23 rot 220 €
      {n: 'Kastell Holzhausen', ort: 'Sehr gut erhaltenes Römerkastell am Grauen Kopf, UNESCO-Welterbe', trenn: 'Kastell Holz\u00adhausen'},  // 24 rot 240 €
      {n: 'Kleinbahn Bogel', ort: 'Halt der Kleinbahn nach St. Goarshausen – heute Loreley-Aar-Radweg', trenn: 'Klein\u00adbahn Bogel'},  // 25 bahnhof 200 €
      {n: 'Lipporner Schanze', ort: 'Wallburg aus dem 10. Jahrhundert, dahinter die Alte Burg', trenn: 'Lip\u00adporner Schanze'},  // 26 gelb 260 €
      {n: 'Burgruine Heppenheft', ort: 'Fast vergessene kleine Burg auf einem Felssporn bei Niederwallmenach', trenn: 'Burg\u00adruine Heppen\u00adheft'},  // 27 gelb 260 €
      {n: 'Sauerbrunnen Schwall', ort: 'Mineralquelle im Mühlbachtal – einst als Tafelwasser „Sinaro“ bis nach England verkauft', trenn: 'Sauer\u00adbrunnen Schwall'},  // 28 werk 150 €
      {n: 'Kloster Schönau', ort: 'Benediktinerkloster bei Strüth, Wirkungsort der heiligen Elisabeth von Schönau', trenn: 'Kloster Schön\u00adau'},  // 29 gelb 280 €
      {},  // 30 abInTurm
      {n: 'Hauserbachsee', ort: 'Stausee bei Miehlen von 1970, mit Campingplatz und Anglern', trenn: 'Hauser\u00adbach\u00adsee'},  // 31 gruen 300 €
      {n: 'Nicolaus-August-Otto-Museum', kurz: 'Otto-Museum', ort: 'In Holzhausen kam 1832 der Erfinder des Ottomotors zur Welt', trenn: 'Otto-Museum'},  // 32 gruen 300 €
      {trenn: 'Länd\u00adchen\u00adkasse'},  // 33 gemeinschaft
      {n: 'Miehlen', ort: 'Größte Ortsgemeinde, Marktrecht seit 1475 – hier soll der Schinderhannes geboren sein', trenn: 'Mieh\u00adlen'},  // 34 gruen 320 €
      {n: 'Kleinbahnhof Nastätten', ort: 'Knoten der Nassauischen Kleinbahn – das Bahnhofsgebäude steht noch', trenn: 'Klein\u00adbahn\u00adhof Nas\u00adtät\u00adten'},  // 35 bahnhof 200 €
      {trenn: 'Blaues Wunder'},  // 36 ereignis
      {n: 'Römerstraße', ort: 'Nastätter Einkaufsstraße mit Altem Rathaus von 1609 und Blaufärbermarkt', trenn: 'Römer\u00adstraße'},  // 37 blau 350 €
      {n: 'Kerbe-Standgeld', trenn: 'Kerbe-Stand\u00adgeld'},  // 38 steuer 100 €
      {n: 'Marktplatz Nastätten', ort: 'Herz des Ländchens – hier tobt jeden Oktober der Oktobermarkt', trenn: 'Markt\u00adplatz Nas\u00adtät\u00adten'}  // 39 blau 400 €
    ],
    karten: {
      E1: 'Der Fackelzug zum Oktobermarkt nimmt dich mit. Rücke vor bis zum Kerbebaum und ziehe 200 € ein.',
      E2: 'Römertag am Limes! Rücke vor bis zum Kastell Holzhausen. Kommst du über den Kerbebaum, ziehe 200 € ein.',
      E3: 'Sonntagsspaziergang durch den Bachheimer Grund. Rücke vor bis Niederbachheim. Kommst du über den Kerbebaum, ziehe 200 € ein.',
      E4: 'Großes Feuerwerk zum Oktobermarkt! Rücke vor bis zum Marktplatz Nastätten.',
      E5: 'Die Kleinbahn fährt seit 1952 nicht mehr – du läufst trotzdem los. Rücke vor bis zum nächsten Kleinbahnhof. Gehört er jemandem, zahle doppelte Miete. Frei: kaufen erlaubt.',
      E6: 'Der Bus kommt nicht, also nimmst du den alten Bahndamm. Rücke vor bis zum nächsten Kleinbahnhof. Gehört er jemandem, zahle doppelte Miete. Ist er frei, darfst du ihn kaufen.',
      E7: 'Flaute im Ländchen. Rücke vor bis zur nächsten Kraftquelle. Gehört sie jemandem, würfle und zahle das Zehnfache der Augen. Ist sie frei, darfst du sie kaufen.',
      E8: 'Im Museum fährt die Modell-Kleinbahn – du fährst mit. Rücke vor bis zur Kleinbahn Marienfels. Kommst du über den Kerbebaum, ziehe 200 € ein.',
      E9: 'Deine Fastenbrezeln gewinnen den Bäckerpreis des Ländchens. Ziehe 50 € ein.',
      E10: 'Eine Blaufärberin reicht dir die Hand. Du kommst aus dem Färberbottich frei. Behalte den Färberhaken, bis du ihn brauchst oder verkaufst.',
      E11: 'Auf der Bäderstraße die Abfahrt verpasst. Gehe 3 Felder zurück.',
      E12: 'Zu tief in den Indigo geschaut – jetzt bist du blau. Gehe direkt in den Färberbottich. Geh nicht über den Kerbebaum, ziehe keine 200 € ein.',
      E13: 'Blaudruck ist wieder in Mode: Alle Fensterläden bekommen neue Farbe. Zahle 25 € je Haus und 100 € je Hotel.',
      E14: 'Mit dem Traktor mitten auf dem Marktplatz geparkt. Zahle 15 € Verwarnungsgeld.',
      E15: 'Du gibst beim Blaufärbermarkt eine Runde Apfelwein aus. Zahle allen anderen je 50 €.',
      E16: 'Dein Flachsacker bringt die beste Ernte seit hundert Jahren. Ziehe 150 € ein.',
      G1: 'Rückenwind auf dem Loreley-Aar-Radweg. Rücke vor bis zum Kerbebaum und ziehe 200 € ein.',
      G2: 'Die Ländchenkasse hat sich verrechnet – zu deinen Gunsten. Ziehe 200 € ein.',
      G3: 'Beim Sprung ins Waldschwimmbad den Zeh gestoßen. Zahle 50 € Arztkosten.',
      G4: 'Das Museum kauft dir einen alten Mineralwasserkrug für seine Sammlung ab. Ziehe 50 € ein.',
      G5: 'Der Heimatverein legt ein gutes Wort für dich ein. Du kommst aus dem Färberbottich frei. Behalte den Färberhaken, bis du ihn brauchst oder verkaufst.',
      G6: 'Ohne Angelschein am Hauserbachsee erwischt. Gehe direkt in den Färberbottich. Geh nicht über den Kerbebaum, ziehe keine 200 € ein.',
      G7: 'Dein Urlaubsgeld ist da – ab auf den Campingplatz im Mühlbachtal. Ziehe 100 € ein.',
      G8: 'Die Verbandsgemeinde erstattet dir zu viel gezahlte Hundesteuer. Ziehe 20 € ein.',
      G9: 'Du hast Geburtstag und lädst zum Grillen an die Schutzhütte ein. Alle anderen schenken dir je 10 €.',
      G10: 'Deine Lebensversicherung wird ausgezahlt – das reicht für eine ganze Woche Oktobermarkt. Ziehe 100 € ein.',
      G11: 'Auf dem Oktobermarkt fünfmal hintereinander Kettenkarussell gefahren. Zahle 100 € fürs Krankenhaus.',
      G12: 'Die Musikschule schickt die Gebühren für die Blockflöte. Zahle 50 €.',
      G13: 'Du führst eine Wandergruppe über den Limeswanderweg. Ziehe 25 € Honorar ein.',
      G14: 'Nach dem Winter werden die Feldwege im Ländchen ausgebessert. Zahle 40 € je Haus und 115 € je Hotel.',
      G15: 'Zweiter Platz beim Kürbiswiegen auf dem Blaufärbermarkt. Ziehe 10 € ein.',
      G16: 'Eine Großtante aus Miehlen – angeblich mit Hollywood verwandt – vererbt dir 100 €.'
    },
    design: {
      papier: '#f3eee0',   // ungebleichtes Leinen
      rand: '#1c2340',     // Indigo-Tinte
      mitte: '#18245a',    // Blaufärber-Indigo
      akzent: '#e0a83a',   // warmes Flachs-Gold
      // Stilisierte Karte des Ländchens: alle 32 Orte an ihrer echten Lage (Nastätten mit Ring), der Mühlbach von Süd
      // nach Nord, der Limes mit Wachtürmen und Kastell Holzhausen, die drei alten Kleinbahnstrecken (gepunktet),
      // Höhenlinien um den Grauen Kopf, Hauserbachsee, Kreuz für Kloster Schönau – darunter ein zartes Blaudruck-Muster.
      mitteMotiv: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice"><defs><pattern id="bl-druck" width="84" height="84" patternUnits="userSpaceOnUse"><g fill="rgba(255,255,255,.035)"><circle cx="21" cy="21" r="6"/><circle cx="21" cy="9" r="3"/><circle cx="21" cy="33" r="3"/><circle cx="9" cy="21" r="3"/><circle cx="33" cy="21" r="3"/><circle cx="63" cy="63" r="6"/><circle cx="63" cy="51" r="3"/><circle cx="63" cy="75" r="3"/><circle cx="51" cy="63" r="3"/><circle cx="75" cy="63" r="3"/><circle cx="63" cy="21" r="2"/><circle cx="21" cy="63" r="2"/></g></pattern></defs><rect width="1000" height="1000" fill="url(#bl-druck)"/><ellipse cx="859" cy="425" rx="150" ry="108" fill="none" stroke="rgba(150,200,140,.07)" stroke-width="3"/><ellipse cx="859" cy="425" rx="105" ry="75" fill="none" stroke="rgba(150,200,140,.07)" stroke-width="3"/><ellipse cx="859" cy="425" rx="62" ry="44" fill="none" stroke="rgba(150,200,140,.07)" stroke-width="3"/><ellipse cx="859" cy="425" rx="26" ry="18" fill="none" stroke="rgba(150,200,140,.07)" stroke-width="3"/><ellipse cx="634" cy="719" rx="95" ry="68" fill="none" stroke="rgba(150,200,140,.07)" stroke-width="3"/><ellipse cx="634" cy="719" rx="60" ry="43" fill="none" stroke="rgba(150,200,140,.07)" stroke-width="3"/><ellipse cx="634" cy="719" rx="28" ry="20" fill="none" stroke="rgba(150,200,140,.07)" stroke-width="3"/><ellipse cx="317" cy="425" rx="80" ry="57" fill="none" stroke="rgba(150,200,140,.07)" stroke-width="3"/><ellipse cx="317" cy="425" rx="48" ry="34" fill="none" stroke="rgba(150,200,140,.07)" stroke-width="3"/><ellipse cx="317" cy="425" rx="20" ry="14" fill="none" stroke="rgba(150,200,140,.07)" stroke-width="3"/><ellipse cx="569" cy="850" rx="70" ry="50" fill="none" stroke="rgba(150,200,140,.07)" stroke-width="3"/><ellipse cx="569" cy="850" rx="40" ry="28" fill="none" stroke="rgba(150,200,140,.07)" stroke-width="3"/><path d="M545 506 C512 514 404 527 348 556 C291 584 265 637 207 675 C149 712 34 763 0 781" fill="none" stroke="rgba(240,220,170,.11)" stroke-width="5" stroke-dasharray="2 14" stroke-linecap="round"/><path d="M545 506 C528 478 473 380 448 338 C422 295 449 279 390 250 C330 220 163 185 93 163 C22 140 -12 121 -34 113" fill="none" stroke="rgba(240,220,170,.11)" stroke-width="5" stroke-dasharray="2 14" stroke-linecap="round"/><path d="M545 506 C574 485 671 434 724 381 C776 328 816 261 862 188 C908 114 977 -20 1000 -62" fill="none" stroke="rgba(240,220,170,.11)" stroke-width="5" stroke-dasharray="2 14" stroke-linecap="round"/><path d="M345 -62 L397 169 L572 175 L607 225 L655 331 L855 406 L1017 563" fill="none" stroke="rgba(230,170,120,.12)" stroke-width="5" stroke-dasharray="26 12"/><rect x="390" y="162" width="14" height="14" fill="rgba(230,170,120,.14)"/><rect x="600" y="218" width="14" height="14" fill="rgba(230,170,120,.14)"/><rect x="648" y="324" width="14" height="14" fill="rgba(230,170,120,.14)"/><rect x="838" y="392" width="34" height="28" rx="4" fill="none" stroke="rgba(230,170,120,.16)" stroke-width="4"/><path d="M662 969 C658 953 646 907 638 875 C629 842 621 816 610 775 C599 733 582 669 572 625 C561 580 556 540 545 506 C533 471 519 447 503 419 C486 391 464 366 448 338 C432 309 417 285 407 250 C396 214 392 177 386 125 C379 73 369 -30 366 -62" fill="none" stroke="rgba(120,180,255,.16)" stroke-width="9" stroke-linecap="round"/><ellipse cx="486" cy="263" rx="26" ry="13" transform="rotate(-25 486 263)" fill="rgba(120,180,255,.14)"/><circle cx="450" cy="336" r="12" fill="rgba(255,255,255,.15)"/><circle cx="92" cy="413" r="8" fill="rgba(255,255,255,.13)"/><circle cx="295" cy="464" r="8" fill="rgba(255,255,255,.13)"/><circle cx="368" cy="497" r="8" fill="rgba(255,255,255,.13)"/><circle cx="654" cy="934" r="8" fill="rgba(255,255,255,.13)"/><circle cx="222" cy="199" r="8" fill="rgba(255,255,255,.13)"/><circle cx="726" cy="381" r="12" fill="rgba(255,255,255,.15)"/><circle cx="282" cy="358" r="8" fill="rgba(255,255,255,.13)"/><circle cx="469" cy="510" r="8" fill="rgba(255,255,255,.13)"/><circle cx="599" cy="735" r="8" fill="rgba(255,255,255,.13)"/><circle cx="545" cy="506" r="34" fill="none" stroke="rgba(255,255,255,.16)" stroke-width="5"/><circle cx="545" cy="506" r="17" fill="rgba(255,255,255,.18)"/><circle cx="655" cy="233" r="8" fill="rgba(255,255,255,.13)"/><circle cx="391" cy="248" r="8" fill="rgba(255,255,255,.13)"/><circle cx="486" cy="699" r="8" fill="rgba(255,255,255,.13)"/><circle cx="631" cy="786" r="8" fill="rgba(255,255,255,.13)"/><circle cx="229" cy="426" r="8" fill="rgba(255,255,255,.13)"/><circle cx="292" cy="264" r="8" fill="rgba(255,255,255,.13)"/><circle cx="562" cy="873" r="8" fill="rgba(255,255,255,.13)"/><circle cx="408" cy="488" r="8" fill="rgba(255,255,255,.13)"/><circle cx="350" cy="555" r="12" fill="rgba(255,255,255,.15)"/><circle cx="390" cy="163" r="8" fill="rgba(255,255,255,.13)"/><circle cx="385" cy="722" r="8" fill="rgba(255,255,255,.13)"/><circle cx="203" cy="130" r="8" fill="rgba(255,255,255,.13)"/><circle cx="588" cy="291" r="8" fill="rgba(255,255,255,.13)"/><circle cx="607" cy="468" r="8" fill="rgba(255,255,255,.13)"/><circle cx="198" cy="327" r="8" fill="rgba(255,255,255,.13)"/><circle cx="445" cy="736" r="8" fill="rgba(255,255,255,.13)"/><circle cx="476" cy="200" r="8" fill="rgba(255,255,255,.13)"/><circle cx="136" cy="271" r="8" fill="rgba(255,255,255,.13)"/><circle cx="450" cy="841" r="8" fill="rgba(255,255,255,.13)"/><circle cx="651" cy="882" r="8" fill="rgba(255,255,255,.13)"/><circle cx="169" cy="213" r="8" fill="rgba(255,255,255,.13)"/><path d="M689 855v30M679 865h20" stroke="rgba(255,255,255,.14)" stroke-width="4"/></svg>',
      ecken: {
        start: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 40"><path d="M44 28H9M18 19l-11 9 11 9" fill="none" stroke="#d8483c" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><path d="M60 40V11" stroke="#8a5a3c" stroke-width="2.6" stroke-linecap="round"/><path d="M60 0l-5 6h2.5l-4.5 6h14l-4.5-6H65z" fill="#5a8f3c" stroke="#3f7a34" stroke-width="1" stroke-linejoin="round"/><ellipse cx="60" cy="17" rx="6.5" ry="2.4" fill="none" stroke="#3f7a34" stroke-width="2.4"/><path d="M54.5 18c-2 3 1 5-1.5 8s0 5-2 7M57 19c-1 3 1 5 0 8M63 19c1 3-1 5 0 8M65.5 18c2 3-1 5 1.5 8s0 5 2 7" fill="none" stroke="#2f5fb3" stroke-width="1.6" stroke-linecap="round"/></svg>',
        turm: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 46"><path d="M5 14h30l-3 30H8z" fill="#b98a5a" stroke="#1c2340" stroke-width="2" stroke-linejoin="round"/><path d="M12 14l1 30M20 14v30M28 14l-1 30" stroke="#8a5a3c" stroke-width="1.3"/><path d="M6 21h28M7.5 37h25" stroke="#1c2340" stroke-width="2.6"/><ellipse cx="20" cy="14" rx="15" ry="4" fill="#2f5fb3" stroke="#1c2340" stroke-width="2"/><path d="M13 13c3 1.5 6-1.5 9 0s5 1 7 0" stroke="#8fb4ec" stroke-width="1.4" fill="none" stroke-linecap="round"/><path d="M27 13L36 2" stroke="#8a5a3c" stroke-width="2.4" stroke-linecap="round"/><path d="M36 2l3 2" stroke="#1c2340" stroke-width="2" stroke-linecap="round"/></svg>',
        pause: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 36"><path d="M8 18h44M10 18v11M50 18v11M12 10h36" stroke="#1c2340" stroke-width="4" stroke-linecap="round"/><path d="M14 10v8M46 10v8" stroke="#1c2340" stroke-width="2.5"/><path d="M3 32c8-4 14 4 22 0s14 4 22 0 8 2 10 0" stroke="#2f5fb3" stroke-width="3" fill="none" stroke-linecap="round"/><g fill="#4f7fd6"><circle cx="55" cy="6" r="2.2"/><circle cx="58.6" cy="8.6" r="2.2"/><circle cx="57.2" cy="12.8" r="2.2"/><circle cx="52.8" cy="12.8" r="2.2"/><circle cx="51.4" cy="8.6" r="2.2"/></g><circle cx="55" cy="9.8" r="1.5" fill="#e0a83a"/><path d="M55 15v8" stroke="#5a8f3c" stroke-width="1.5"/></svg>',
        abInTurm: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 46"><path d="M5 20h30l-3 24H8z" fill="#b98a5a" stroke="#1c2340" stroke-width="2" stroke-linejoin="round"/><path d="M12 20l1 24M20 20v24M28 20l-1 24" stroke="#8a5a3c" stroke-width="1.3"/><path d="M6 27h28M7.5 38h25" stroke="#1c2340" stroke-width="2.6"/><ellipse cx="20" cy="20" rx="15" ry="4" fill="#2f5fb3" stroke="#1c2340" stroke-width="2"/><path d="M20 2v11M14.5 8l5.5 6 5.5-6" fill="none" stroke="#d8483c" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/><g fill="#2f5fb3"><circle cx="7" cy="12" r="2"/><circle cx="33" cy="11" r="2.2"/><circle cx="4" cy="17" r="1.4"/><circle cx="36.5" cy="16" r="1.5"/></g></svg>'
      }
    }
  };
  if (typeof module !== 'undefined') module.exports = A;
  else (window.RheinbaronAusgaben = window.RheinbaronAusgaben || {})[A.id] = A;
})();
