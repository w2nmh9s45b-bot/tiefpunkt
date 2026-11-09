"use strict";
/* Ausgabe „Panzweiler“ für Rheinbaron – die Ortsgemeinde Panzweiler (mundartlich „Pansad“, die Leute „Pansada“),
   Verbandsgemeinde Zell (Mosel), Landkreis Cochem-Zell, auf der Hunsrückhöhe an der B 421.
   Gemeindeschlüssel 07135070 (Kreis Cochem-Zell), PLZ 56865 – nicht zu verwechseln mit dem Gemündener Ortsteil Panzweiler.

   Quellen (Recherche, Stand 09.11.2026):
   - OpenStreetMap über Overpass (User-Agent spieltisch-recherche): Straßen Am Zehrech, Brunnenstraße, Gutenbergstraße,
     Zur Schönen Aussicht, Johannisstraße, Hauptstraße, Ringstraße, Hubertusweg, Am Wachthübel, Ober der Kirche,
     Kapellenweg; Kapelle St. Johannes (Hauptstraße 4); Feuerwehrhaus; Wasserwerk (man_made=water_works) Am Wachthübel;
     Rasthof Panzweiler; Restaurant Gassenhof; Bushaltestellen „Panzweiler, Ober der Kirche“ und „Blankenrath, Gassenhof“;
     Kapellchen mit Wegkreuz und Bänken nördlich des Orts; Windräder östlich Richtung Haserich; Krähenhütte und
     Pfarrkirche Maria Himmelfahrt in Blankenrath; Aussichtspunkt Hohe Felsen; Hunsrück-Mosel-Radweg; Buslinien 752
     (Zell – Blankenrath, Busbahnhof) und 755 (Kirchberg – Bullay, Bahnhof). https://www.openstreetmap.org
   - Wikipedia: https://de.wikipedia.org/wiki/Panzweiler (Wohnplätze Gassenhof und Lager, römische Villen, 1259/1276
     „Panzwilre“, Kirchspiel/Pfarrei Mastershausen, Oberamt Kastellaun, Kleve’sches Lehengericht)
     und https://de.wikipedia.org/wiki/Liste_der_Kulturdenkmäler_in_Panzweiler (Kapelle St. Johannes Baptist 1791,
     Quereinhaus Johannisstraße 2)
   - Ortsgemeinde: https://panzweiler.de/ und https://panzweiler.de/mitteilungen („unser schönes Pansad“, die Pansada,
     Johanniskirmes/Pansada Kirmes der Freiwilligen Feuerwehr, Kirmesbaum, Advent an der Kapelle, Oster-Klappern,
     Lange Picknick-Tafel, Walking-Treff, Begegnungscafé, Seniorentreff, über 130 Störche auf den Dächern am 09.08.2025,
     WhatsApp-Kanal des Dorfs)
   - Zeller Land: https://www.zellerland.de/ihr-zeller-land/unsere-ferienregion/panzweiler (Kapelle 1792, verschieferter
     Glockenturm, Kirchspiel-Wanderweg)
   - Kirchspiel-Wanderweg und MTB-Tour (Flur „Das Loch“ am Bach zwischen Panzweiler und Walhausen, Schutzhütte Panzweiler):
     https://www.outdooractive.com/de/route/mountainbike/hunsrueck/mtb-tour-durch-das-kirchspiel/801533334/
     und https://www.blankenrath.de/tourismus/Wandern/
   - Betriebe Am Wachthübel (Hunsrücker Braugerstenlager, Hunsrücker Genuss Kontor mit Kaffeerösterei) und am Gassenhof
     (Steakhaus-Pizzeria): https://www.genuss-kontor-hunsrueck.de/ , https://gassenhof.net/kontakt.html ,
     https://www.unternehmensverzeichnis.org/hunsruecker-braugerstenlager-gmbh-panzweiler-2500819460340
   - Windpark Haserich (Pfalzwind): https://www.thewindpower.net/windfarm_de_12613_haserich.php
   - Rasthof/Gassenhof an der B 421: https://www.cochem-zell.de/aktuelles/nachrichten-aus-der-verwaltung/2025/maerz/l-202-im-bereich-panzweiler-gassenhof-richtung-blankenrath-am-22-03-2025-gesperrt/

   Echt: alle Feldnamen (Straßen, Wohnplatz Lager, Kapelle, Betriebe, Haltestellen, Bahnhof Bullay, Wasserwerk,
   Windpark Haserich, Krähenhütte, Pfarrkirche Blankenrath, Hohe Felsen, Burg Kastellaun, Flughafen Hahn, Geierlay,
   Marienburg, Weinlage Zeller Schwarze Katz), der Flurname „Das Loch“, Ortsschild, Kapellchen mit Wegkreuz und Bank,
   Kirmesbaum, Oster-Klappern, Advent an der Kapelle, Lange Picknick-Tafel, Begegnungscafé, Störche.
   Erfunden bzw. nur ortstypisch: „Das Loch“ als Gefängnis und die Strickleiter als Freikarte, die Steuerfelder
   „Kirmesbaum-Umlage“ und „Klappergeld“, die Kartenstapel „Dorfkanal“ und „Kirmeskasse“, die Gruppennamen,
   die Beschreibungen mit Augenzwinkern und sämtliche Anlässe auf den Karten (z. B. Tombola, Windrad-Pacht,
   Kirmesbaum-Klau). Keine Privatpersonen; Betriebe nur freundlich und ohne Familiennamen. */
(function () {
  const ORT = '„Ortsschild Pansad“';
  const A = {
    id: 'panzweiler', name: 'Panzweiler', reihenfolge: 2,
    spielname: 'Pansada Dorfbaron',
    unter: 'Kaufen, bauen, kassieren – vom Wohnplatz Lager bis zur Zeller Schwarzen Katz.',
    beschreibung: 'Panzweiler im Hunsrück: Kapelle, Gassenhof, Windräder auf der Höhe und die Mosel unten im Tal.',
    regelnIntro: '<p>Zieht rund um Pansad – so nennen die Pansada ihr Panzweiler – kauft Straßen, Höfe und Aussichten ' +
      'zwischen Hunsrückhöhe und Mosel, baut Häuser und kassiert Miete. Wer am Ende als Einzige oder Einziger ' +
      'nicht pleite ist, gewinnt.</p>',
    begriffe: {
      start: 'Ortsschild Pansad',
      turm: 'Das Loch', imTurm: 'im Loch', inDenTurm: 'ins Loch', ausDemTurm: 'aus dem Loch',
      abInTurm: 'Ab ins Loch',
      pause: 'Bank am Kapellchen', pauseText: 'Hier weht nur der Wind',
      schluessel: 'Strickleiter', schluesselMz: 'Strickleitern',
      bahnhof: 'Haltestelle', bahnhoefe: 'Haltestellen',
      werk: 'Versorger', werke: 'Versorger',
      ereignis: 'Dorfkanal', gemeinschaft: 'Kirmeskasse',
      steuer: 'Abgabe'
    },
    gruppen: {
      braun: 'Am Ortsrand', hellblau: 'Unterdorf', pink: 'Ortsmitte', orange: 'Oberdorf & Gassenhof',
      rot: 'Am Wachthübel', gelb: 'Rund ums Kirchspiel', gruen: 'Weiter Hunsrück', blau: 'An der Mosel'
    },
    felder: [
      {n: 'Ortsschild Pansad', trenn: 'Orts­schild Pansad'},  // 0 start
      {n: 'Am Zehrech', ort: 'Kurzes Sträßchen am Ortsrand – mehr Wiese als Asphalt', trenn: 'Am Zeh­rech'},  // 1 braun 60 €
      {trenn: 'Kirmes­kasse'},  // 2 gemeinschaft
      {n: 'Wohnplatz Lager', ort: 'Der kleinste Teil von Panzweiler – ein paar Häuser, viel Himmel', trenn: 'Wohn­platz Lager'},  // 3 braun 60 €
      {n: 'Kirmesbaum-Umlage', ort: 'Wer mitfeiert, zahlt mit: für Baum, Zelt und Musik zur Johanniskirmes', trenn: 'Kirmes­baum-Umlage'},  // 4 steuer 200 €
      {n: 'Haltestelle Ober der Kirche', kurz: 'Ober der Kirche', ort: 'Bushalt mitten im Dorf, gleich oberhalb der Kapelle', trenn: 'Ober der Kirche'},  // 5 bahnhof 200 €
      {n: 'Brunnenstraße', ort: 'Wohnstraße im Unterdorf, ein paar Schritte unterhalb der Kapelle', trenn: 'Brunnen­straße'},  // 6 hellblau 100 €
      {trenn: 'Dorf­kanal'},  // 7 ereignis
      {n: 'Gutenbergstraße', ort: 'Ruhige Straße am Südrand – gleich dahinter lag einst eine römische Siedlung', trenn: 'Gutenberg­straße'},  // 8 hellblau 100 €
      {n: 'Zur Schönen Aussicht', ort: 'Der Name hält, was er verspricht: Blick weit über den Hunsrück', trenn: 'Zur Schönen Aus­sicht'},  // 9 hellblau 120 €
      {},  // 10 turm
      {n: 'Johannisstraße', ort: 'Mit dem denkmalgeschützten Quereinhaus aus Fachwerk und Schiefer', trenn: 'Johannis­straße'},  // 11 pink 140 €
      {n: 'Windpark Haserich', ort: 'Windräder zwischen Panzweiler und Haserich – der Höhenwind kostet nichts', trenn: 'Wind­park Hase­rich'},  // 12 werk (Strom) 150 €
      {n: 'Hauptstraße', ort: 'Die Dorfstraße mit Kapelle und Feuerwehrhaus', trenn: 'Haupt­straße'},  // 13 pink 140 €
      {n: 'Kapelle St. Johannes', ort: 'Kapelle von 1791 mit verschiefertem Türmchen und Glocken aus dem Mittelalter', trenn: 'Kapelle St. Johannes'},  // 14 pink 160 €
      {n: 'Haltestelle Gassenhof', kurz: 'Gassenhof', ort: 'Bushalt an der Kreuzung von B 421 und L 202', trenn: 'Gassen­hof'},  // 15 bahnhof 200 €
      {n: 'Ringstraße', ort: 'Dreht im Oberdorf eine Runde und kommt wieder an', trenn: 'Ring­straße'},  // 16 orange 180 €
      {trenn: 'Kirmes­kasse'},  // 17 gemeinschaft
      {n: 'Hubertusweg', ort: 'Wohnweg im Oberdorf – der Jagdpatron lässt grüßen', trenn: 'Huber­tus­weg'},  // 18 orange 180 €
      {n: 'Steakhaus Gassenhof', ort: 'Steakhaus und Pizzeria am Wohnplatz Gassenhof an der B 421', trenn: 'Steak­haus Gassen­hof'},  // 19 orange 200 €
      {},  // 20 pause
      {n: 'Braugerstenlager', ort: 'Am Wachthübel lagert die Hunsrücker Gerste, aus der einmal Bier wird', trenn: 'Brau­gersten­lager'},  // 21 rot 220 €
      {},  // 22 ereignis
      {n: 'Kaffeerösterei', ort: 'Das Hunsrücker Genuss Kontor röstet hier Kaffee in der Trommel', trenn: 'Kaffee­röste­rei'},  // 23 rot 220 €
      {n: 'Rasthof Panzweiler', ort: 'Einkehr an der B 421 – für Fernfahrer, Wandernde und Pansada', trenn: 'Rast­hof Panz­weiler'},  // 24 rot 240 €
      {n: 'Busbahnhof Blankenrath', kurz: 'Blankenrath', ort: 'Knoten der Buslinien im Kirchspiel – Richtung Zell, Cochem und Kastellaun', trenn: 'Blanken­rath'},  // 25 bahnhof 200 €
      {n: 'Krähenhütte', ort: 'Grillhütte bei Blankenrath zum Feiern und Verweilen', trenn: 'Krähen­hütte'},  // 26 gelb 260 €
      {n: 'Pfarrkirche Blankenrath', kurz: 'Pfarrkirche', ort: 'Maria Himmelfahrt, Mitte des Kirchspiels, zu dem Panzweiler gehört', trenn: 'Pfarr­kirche'},  // 27 gelb 260 €
      {n: 'Wasserwerk am Wachthübel', kurz: 'Wasserwerk', ort: 'Pumpt das gute Hunsrückwasser bis in jede Pansada Küche', trenn: 'Wasser­werk'},  // 28 werk (Wasser) 150 €
      {n: 'Hohe Felsen', ort: 'Aussichtspunkt bei Mastershausen, der alten Pfarrei von Panzweiler', trenn: 'Hohe Felsen'},  // 29 gelb 280 €
      {},  // 30 abInTurm
      {n: 'Burg Kastellaun', ort: 'Sitz des alten Oberamts, zu dem Panzweiler unter den Sponheimern gehörte', trenn: 'Burg Kastel­laun'},  // 31 gruen 300 €
      {n: 'Flughafen Hahn', ort: 'Gleich um die Ecke geht es in die weite Welt – oder wenigstens nach Mallorca', trenn: 'Flug­hafen Hahn'},  // 32 gruen 300 €
      {trenn: 'Kirmes­kasse'},  // 33 gemeinschaft
      {n: 'Geierlay', ort: 'Die berühmte Hängeseilbrücke im Hunsrück – nichts für weiche Knie', trenn: 'Geier­lay'},  // 34 gruen 320 €
      {n: 'Bahnhof Bullay', kurz: 'Bullay', ort: 'Unten an der Mosel: Von hier fährt der Zug nach Koblenz und Trier', trenn: 'Bullay'},  // 35 bahnhof 200 €
      {trenn: 'Dorf­kanal'},  // 36 ereignis
      {n: 'Marienburg', ort: 'Auf dem Bergrücken über der Moselschleife bei Pünderich und Alf', trenn: 'Marien­burg'},  // 37 blau 350 €
      {n: 'Klappergeld', ort: 'Die Kinder vom Oster-Klappern stehen vor der Tür – da gibt jeder gern', trenn: 'Klapper­geld'},  // 38 steuer 100 €
      {n: 'Zeller Schwarze Katz', ort: 'Die berühmteste Weinlage der Verbandsgemeinde, unten in Zell an der Mosel', trenn: 'Zeller Schwarze Katz'}  // 39 blau 400 €
    ],
    karten: {
      E1: `Der Bus kommt pünktlich – ein Wunder! Rücke vor bis zum ${ORT} und ziehe 200 € ein.`,
      E2: `Schnitzeltag an der B 421! Rücke vor bis zum Rasthof Panzweiler. Kommst du über das ${ORT}, ziehe 200 € ein.`,
      E3: `Frischer Kuchen am Fachwerkhaus. Rücke vor bis zur Johannisstraße. Kommst du über das ${ORT}, ziehe 200 € ein.`,
      E4: 'Weinprobe unten im Tal. Rücke vor bis zur Weinlage „Zeller Schwarze Katz“.',
      E5: 'Schulbus verpasst! Rücke vor bis zur nächsten Haltestelle. Gehört sie jemandem, zahle die doppelte Miete. Ist sie frei, darfst du sie kaufen.',
      E6: 'Der Rufbus hat dich vergessen. Rücke vor bis zur nächsten Haltestelle. Gehört sie jemandem, zahle die doppelte Miete. Ist sie frei, darfst du sie kaufen.',
      E7: 'Flaute auf der Höhe. Rücke vor bis zum nächsten Versorger. Gehört er jemandem, würfle und zahle das Zehnfache der Augen. Ist er frei, darfst du ihn kaufen.',
      E8: `Heute nimmst du den Bus. Rücke vor bis zur Haltestelle Ober der Kirche. Kommst du über das ${ORT}, ziehe 200 € ein.`,
      E9: 'Deine Braugerste ist die schönste im ganzen Lager. Ziehe 50 € ein.',
      E10: 'Die Feuerwehr lässt dir eine Strickleiter herab: Du kommst aus dem Loch frei. Behalte die Karte, bis du sie brauchst oder verkaufst.',
      E11: 'Am Gassenhof die Abzweigung verpasst. Gehe 3 Felder zurück.',
      E12: `Beim Kirmesbaum-Klauen erwischt! Gehe direkt ins Loch. Geh nicht über das ${ORT}, ziehe keine 200 € ein.`,
      E13: 'Der Höhenwind hat Schieferplatten von den Dächern geweht. Zahle 25 € je Haus und 100 € je Hotel.',
      E14: 'Geblitzt auf der B 421 kurz vor dem Gassenhof. Zahle 15 €.',
      E15: 'Du wirst Kirmesvater und gibst im Festzelt eine Runde aus. Zahle allen anderen je 50 €.',
      E16: 'Dein Anteil am Bürgerwindrad wirft ab – der Hunsrück weht für dich. Ziehe 150 € ein.',
      G1: `Rückenwind von der Höhe schiebt dich heim. Rücke vor bis zum ${ORT} und ziehe 200 € ein.`,
      G2: 'Die Pacht für das Windrad auf deinem Acker ist da. Ziehe 200 € ein.',
      G3: 'Zeckenbiss auf dem Kirchspiel-Wanderweg. Zahle 50 € Arztkosten.',
      G4: 'Du hast beim Aufstellen des Kirmesbaums mit angepackt. Ziehe 50 € Helferlohn ein.',
      G5: 'Die Kinder vom Oster-Klappern werfen dir eine Strickleiter zu: Du kommst aus dem Loch frei. Behalte die Karte, bis du sie brauchst oder verkaufst.',
      G6: `Beim Advent an der Kapelle Waffeln stibitzt. Gehe direkt ins Loch. Geh nicht über das ${ORT}, ziehe keine 200 € ein.`,
      G7: 'Hauptgewinn bei der Tombola der Langen Picknick-Tafel. Ziehe 100 € ein.',
      G8: 'Der Briefträger bringt eine Steuererstattung bis ans Ende der Ringstraße. Ziehe 20 € ein.',
      G9: 'Du hast Geburtstag, und ganz Pansad kommt gratulieren. Alle anderen zahlen dir je 10 €.',
      G10: 'Deine Kartoffeln vom Höhenacker gehen weg wie warme Semmeln. Ziehe 100 € ein.',
      G11: 'Sturz mit dem Rad auf dem Hunsrück-Mosel-Radweg. Zahle 100 € fürs Krankenhaus.',
      G12: 'Jahresbeitrag für den Förderverein der Feuerwehr. Zahle 50 €.',
      G13: 'Dein Streuselkuchen war im Begegnungscafé als Erstes weg. Ziehe 25 € ein.',
      G14: 'Nach dem Wintersturm müssen Dachrinnen und Schiefer neu. Zahle 40 € je Haus und 115 € je Hotel.',
      G15: 'Zweiter Platz beim Störche-Zählen: Du hattest 129, es waren über 130. Ziehe 10 € ein.',
      G16: 'Eine Tante von der Mosel vererbt dir ein Fässchen Wein. Du verkaufst es für 100 € – ziehe sie ein.'
    },
    design: {
      papier: '#eef0e3',       // helles Wiesenpapier
      rand: '#283338',         // Schiefergrau
      mitte: '#1c3328',        // tiefes Hunsrückgrün
      akzent: '#8fc458',       // Wiesengrün
      // Hunsrückhöhe bei Nacht: Moselschleife mit Weinbergzeilen, Hügelkämme mit Windrädern, Panzweiler mit Kapelle
      // und Schieferdächern, zwei Störche – alles zart, damit die helle Schrift darüber lesbar bleibt.
      mitteMotiv: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice">' +
        // Moselschleife oben links (Zeller Hamm) mit Weinbergzeilen innen
        '<path d="M-20 360C70 360 130 330 150 270S140 140 230 115S380 135 370 225S300 345 380 375S540 395 640 345" fill="none" stroke="rgba(120,180,225,.10)" stroke-width="26" stroke-linecap="round"/>' +
        '<g stroke="rgba(190,110,140,.11)" stroke-width="5" stroke-linecap="round">' +
          '<path d="M212 175l90 -8M206 200l104 -8M212 225l94 -7M226 250l70 -5M244 275l40 -3"/></g>' +
        // hintere Höhe mit Windrädern
        '<path d="M0 640C120 600 230 590 360 610S600 570 740 590S920 600 1000 580V1000H0z" fill="rgba(150,200,120,.07)"/>' +
        '<g stroke="rgba(230,240,232,.17)" stroke-width="5" stroke-linecap="round" fill="none">' +
          '<path d="M600 584V420M600 420l0 -62M600 420l54 31M600 420l-54 31"/>' +
          '<path d="M700 590V450M700 450l18 -48M700 450l32 40M700 450l-50 8"/>' +
          '<path d="M800 594V440M800 440l-30 -50M800 440l58 2M800 440l-28 50"/>' +
          '<path d="M900 590V470M900 470l0 -50M900 470l43 25M900 470l-43 25"/>' +
          '<path d="M480 600V480M480 480l38 -26M480 480l4 46M480 480l-42 -20"/></g>' +
        '<g fill="rgba(230,240,232,.17)"><circle cx="600" cy="420" r="7"/><circle cx="700" cy="450" r="6"/><circle cx="800" cy="440" r="7"/><circle cx="900" cy="470" r="6"/><circle cx="480" cy="480" r="6"/></g>' +
        // vordere Höhe
        '<path d="M0 760C160 720 300 740 460 730S760 700 1000 720V1000H0z" fill="rgba(150,200,120,.08)"/>' +
        // Dorf: Häuser mit steilen Schieferdächern, Kapelle mit Dachreiter in der Mitte
        '<g fill="rgba(215,228,222,.12)">' +
          '<path d="M250 760V715l35 -32l35 32V760z"/><path d="M330 760V720l28 -26l28 26V760z"/>' +
          '<path d="M600 760V712l40 -36l40 36V760z"/><path d="M690 760V722l26 -24l26 24V760z"/>' +
          '<path d="M180 770V735l24 -22l24 22V770z"/><path d="M760 770V738l22 -20l22 20V770z"/>' +
          '<path d="M420 760V690l80 -58l80 58V760z"/>' +
          '<path d="M488 640V612l12 -34l12 34V640z"/></g>' +
        '<g stroke="rgba(215,228,222,.16)" stroke-width="4" stroke-linecap="round"><path d="M500 578V552M491 562h18"/></g>' +
        '<path d="M486 760V728a14 14 0 0 1 28 0V760z" fill="rgba(28,51,40,.5)"/>' +
        '<g fill="rgba(240,220,140,.10)"><rect x="446" y="700" width="14" height="22" rx="7"/><rect x="540" y="700" width="14" height="22" rx="7"/>' +
          '<rect x="276" y="728" width="12" height="12"/><rect x="626" y="726" width="12" height="12"/></g>' +
        // Straße durchs Dorf
        '<path d="M0 880C200 860 380 800 520 790S820 820 1000 800" fill="none" stroke="rgba(215,228,222,.07)" stroke-width="14"/>' +
        // zwei Störche
        '<g fill="none" stroke="rgba(235,240,235,.16)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">' +
          '<path d="M760 170l34 10l30 -16M794 180l-6 18M824 164l26 -6"/>' +
          '<path d="M840 240l26 8l24 -12M866 248l-5 14M890 236l20 -4"/></g>' +
        // ein paar Sterne
        '<g fill="rgba(240,240,220,.14)"><circle cx="560" cy="120" r="3"/><circle cx="640" cy="80" r="2.5"/><circle cx="930" cy="110" r="3"/><circle cx="470" cy="210" r="2"/><circle cx="980" cy="320" r="2.5"/></g>' +
        '</svg>',
      ecken: {
        // Gelbes Ortsschild mit angedeuteter Schrift und Pfeil
        start: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30">' +
          '<rect x="16" y="3" width="40" height="22" rx="2" fill="#f2c94c" stroke="#283338" stroke-width="2.4"/>' +
          '<path d="M23 11h26M27 17h18" stroke="#283338" stroke-width="2.6" stroke-linecap="round"/>' +
          '<path d="M14 14H3M8 9l-5 5 5 5" fill="none" stroke="#c0392b" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
        // „Das Loch“: Senke am Bach mit Gras, dunkler Tiefe und Wasser
        turm: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">' +
          '<path d="M2 18h36v20H2z" fill="#7aa858"/>' +
          '<ellipse cx="20" cy="26" rx="14" ry="9" fill="#283338"/>' +
          '<ellipse cx="20" cy="28.5" rx="9" ry="4.5" fill="#141c1f"/>' +
          '<path d="M10 33c4 -2 8 2 12 0s6 2 8 0" fill="none" stroke="#6cb7e0" stroke-width="1.8" stroke-linecap="round"/>' +
          '<path d="M5 18l2 -6 2 6M31 18l2 -7 2 7M14 18l1.5 -4 1.5 4" fill="none" stroke="#4f8a3a" stroke-width="1.8" stroke-linejoin="round"/></svg>',
        // Bank vor dem Kapellchen, Windrad dahinter
        pause: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 36">' +
          '<path d="M46 34V12M46 12l0 -9M46 12l8 4.5M46 12l-8 4.5" stroke="#9aa6aa" stroke-width="2" stroke-linecap="round" fill="none"/>' +
          '<path d="M24 34V18l7 -7 7 7v16z" fill="#f4f0e2" stroke="#283338" stroke-width="2"/>' +
          '<path d="M24 18l7 -7 7 7" fill="none" stroke="#283338" stroke-width="3.2" stroke-linejoin="round"/>' +
          '<path d="M31 6v6M28.5 8h5" stroke="#283338" stroke-width="1.8" stroke-linecap="round"/>' +
          '<path d="M29 34v-6a2 2 0 0 1 4 0v6z" fill="#283338"/>' +
          '<path d="M3 24h18M5 24v9M19 24v9M4 19h16" stroke="#8a5a3c" stroke-width="3" stroke-linecap="round"/>' +
          '<path d="M0 34h60" stroke="#7aa858" stroke-width="2.4"/></svg>',
        // „Ab ins Loch“: Pfeil hinab in die Senke
        abInTurm: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 46">' +
          '<path d="M2 24h36v20H2z" fill="#7aa858"/>' +
          '<ellipse cx="20" cy="32" rx="14" ry="9" fill="#283338"/>' +
          '<ellipse cx="20" cy="34.5" rx="9" ry="4.5" fill="#141c1f"/>' +
          '<path d="M20 2v20M13 15l7 8 7 -8" fill="none" stroke="#c0392b" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>'
      }
    }
  };
  if (typeof module !== 'undefined') module.exports = A;
  else (window.RheinbaronAusgaben = window.RheinbaronAusgaben || {})[A.id] = A;
})();
