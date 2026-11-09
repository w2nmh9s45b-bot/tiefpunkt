"use strict";
/* Ausgabe „Rhein & Lahn“ für Rheinbaron – die ursprüngliche Fassung des Bretts (Taunusrand, Blaues Ländchen, Lahntal,
   Lahnstein, Burgen am Rhein, Ehrenbreitstein, Koblenzer Altstadt, Deutsches Eck). Zugleich die Referenz-Ausgabe für
   das Format in AUSGABEN.md: Die Logik (rheinbaron.logik.js) trägt dieselben Texte als eingebaute Vorgabe.
   Alle Orte sind echt (Rhein-Lahn-Kreis und Koblenz); die Kartentexte sind eigene, frei erfundene Anlässe.
   Erfunden bzw. nur ortstypisch: Hexenturm als Gefängnis, „Leinen los“ (Start an der Fähre), „Uferpause“. */
(function () {
  const A = {
    id: 'rheinlahn', name: 'Rhein & Lahn', reihenfolge: 5,
    spielname: 'Rheinbaron',
    unter: 'Kaufen, bauen, kassieren – von Frücht bis zum Deutschen Eck.',
    beschreibung: 'Das Original: vom Taunusrand über Lahntal und Burgen bis zum Deutschen Eck.',
    regelnIntro: '<p>Zieht um das Brett zwischen Taunus, Lahn und Rhein, kauft Orte, baut Häuser und kassiert Miete. Wer am Ende als Einzige oder Einziger nicht pleite ist, gewinnt.</p>',
    begriffe: {
      start: 'Leinen los',
      turm: 'Hexenturm', imTurm: 'im Hexenturm', inDenTurm: 'in den Hexenturm', ausDemTurm: 'aus dem Hexenturm',
      abInTurm: 'Ab in den Hexenturm',
      pause: 'Uferpause', pauseText: 'Hier passiert nichts',
      schluessel: 'Turmschlüssel', schluesselMz: 'Turmschlüssel',
      bahnhof: 'Bahnhof', bahnhoefe: 'Bahnhöfe',
      werk: 'Werk', werke: 'Werke',
      ereignis: 'Ereignis', gemeinschaft: 'Gemeinschaft',
      steuer: 'Steuer'
    },
    gruppen: {
      braun: "Taunusrand", hellblau: "Blaues Ländchen", pink: "Lahntal", orange: "Lahnstein", rot: "Burgen am Rhein", gelb: "Ehrenbreitstein", gruen: "Koblenzer Altstadt", blau: "Am Deutschen Eck"
    },
    felder: [
      {n: "Leinen los"},  // 0 start
      {n: "Frücht", ort: "Dorf über dem Lahntal bei Bad Ems"},  // 1 strasse braun 60 €
      {trenn: "Gemein\u00adschaft"},  // 2 gemeinschaft
      {n: "Friedrichssegen", ort: "Altes Bergbaudorf, Stadtteil von Lahnstein", trenn: "Fried\u00adrichs\u00adsegen"},  // 3 strasse braun 60 €
      {n: "Einkommensteuer", trenn: "Einkommen\u00adsteuer"},  // 4 steuer
      {n: "Bahnhof Niederlahnstein", ort: "Wo Lahntalbahn und rechte Rheinstrecke sich treffen", trenn: "Nieder\u00adlahn\u00adstein"},  // 5 bahnhof 200 €
      {n: "Miehlen", ort: "Ort im Blauen Ländchen"},  // 6 strasse hellblau 100 €
      {},  // 7 ereignis
      {n: "Nastätten", ort: "Kleinstadt im Blauen Ländchen"},  // 8 strasse hellblau 100 €
      {n: "Eschbach", ort: "Dorf auf der Höhe zwischen Rhein und Taunus"},  // 9 strasse hellblau 120 €
      {},  // 10 turm
      {n: "Dausenau", ort: "Fachwerkort mit schiefem Turm an der Lahn"},  // 11 strasse pink 140 €
      {n: "Stadtwerke", ort: "Strom für Lahnstein und das untere Lahntal", trenn: "Stadt\u00adwerke"},  // 12 werk 150 €
      {n: "Nassau", ort: "Stammsitz der Nassauer an der Lahn"},  // 13 strasse pink 140 €
      {n: "Bad Ems", ort: "Kurstadt an der Lahn"},  // 14 strasse pink 160 €
      {n: "Bahnhof Bad Ems", ort: "Station der Lahntalbahn", trenn: "Bad Ems"},  // 15 bahnhof 200 €
      {n: "Salhofplatz", ort: "Platz in Oberlahnstein mit dem Salhof", trenn: "Salhof\u00adplatz"},  // 16 strasse orange 180 €
      {trenn: "Gemein\u00adschaft"},  // 17 gemeinschaft
      {n: "Hochstraße", ort: "Einkaufsstraße in Oberlahnstein", trenn: "Hoch\u00adstraße"},  // 18 strasse orange 180 €
      {n: "Burg Lahneck", ort: "Burg über der Lahnmündung", trenn: "Burg Lahn\u00adeck"},  // 19 strasse orange 200 €
      {},  // 20 pause
      {n: "Braubach", ort: "Städtchen am Rhein unter der Marksburg"},  // 21 strasse rot 220 €
      {},  // 22 ereignis
      {n: "Schloss Stolzenfels", ort: "Schloss am linken Rheinufer gegenüber Lahnstein", trenn: "Schloss Stolzen\u00adfels"},  // 23 strasse rot 220 €
      {n: "Marksburg", ort: "Nie zerstörte Höhenburg über Braubach", trenn: "Marks\u00adburg"},  // 24 strasse rot 240 €
      {n: "Bahnhof Braubach", ort: "Station an der rechten Rheinstrecke", trenn: "Braubach"},  // 25 bahnhof 200 €
      {n: "Ehrenbreitstein", ort: "Stadtteil von Koblenz am rechten Rheinufer", trenn: "Ehren\u00adbreit\u00adstein"},  // 26 strasse gelb 260 €
      {n: "Rheinseilbahn", ort: "Seilbahn über den Rhein in Koblenz", trenn: "Rhein\u00adseil\u00adbahn"},  // 27 strasse gelb 260 €
      {n: "Wasserwerk", ort: "Trinkwasser aus den Brunnen am Rhein", trenn: "Wasser\u00adwerk"},  // 28 werk 150 €
      {n: "Festung Ehrenbreitstein", ort: "Festung hoch über dem Deutschen Eck", trenn: "Festung Ehren\u00adbreit\u00adstein"},  // 29 strasse gelb 280 €
      {},  // 30 abInTurm
      {n: "Löhrstraße", ort: "Einkaufsstraße in Koblenz", trenn: "Löhr\u00adstraße"},  // 31 strasse gruen 300 €
      {n: "Görresplatz", ort: "Platz mit der Historiensäule in Koblenz", trenn: "Görres\u00adplatz"},  // 32 strasse gruen 300 €
      {trenn: "Gemein\u00adschaft"},  // 33 gemeinschaft
      {n: "Jesuitenplatz", ort: "Platz am Koblenzer Rathaus", trenn: "Jesuiten\u00adplatz"},  // 34 strasse gruen 320 €
      {n: "Koblenz Hauptbahnhof", ort: "Größter Bahnhof der Gegend", trenn: "Koblenz Haupt\u00adbahn\u00adhof"},  // 35 bahnhof 200 €
      {},  // 36 ereignis
      {n: "Kurfürstliches Schloss", ort: "Klassizistisches Schloss am Koblenzer Rheinufer", trenn: "Kurfürst\u00adliches Schloss"},  // 37 strasse blau 350 €
      {n: "Zusatzsteuer", trenn: "Zusatz\u00adsteuer"},  // 38 steuer
      {n: "Deutsches Eck", ort: "Landzunge am Zusammenfluss von Rhein und Mosel"}  // 39 strasse blau 400 €
    ],
    karten: {
      E1: "Der Fährmann winkt dich als Erste durch. Rücke vor bis „Leinen los“ und ziehe 200 € ein.",
      E2: "Burgfest auf der Marksburg! Rücke vor bis zur Marksburg. Kommst du über „Leinen los“, ziehe 200 € ein.",
      E3: "Wandertag im Lahntal. Rücke vor bis Dausenau. Kommst du über „Leinen los“, ziehe 200 € ein.",
      E4: "Sonnenuntergang am Zusammenfluss. Rücke vor bis zum Deutschen Eck.",
      E5: "Der Zug wartet nicht. Rücke vor bis zum nächsten Bahnhof. Gehört er jemandem, zahle die doppelte Miete. Ist er frei, darfst du ihn kaufen.",
      E6: "Schienenersatzverkehr fällt aus – du nimmst den nächsten Zug. Rücke vor bis zum nächsten Bahnhof. Gehört er jemandem, zahle die doppelte Miete. Ist er frei, darfst du ihn kaufen.",
      E7: "Stromausfall im Viertel. Rücke vor bis zum nächsten Werk. Gehört es jemandem, würfle und zahle das Zehnfache der Augen. Ist es frei, darfst du es kaufen.",
      E8: "Fahrt mit der Lahntalbahn. Rücke vor bis zum Bahnhof Niederlahnstein. Kommst du über „Leinen los“, ziehe 200 € ein.",
      E9: "Deine Anteile an der Winzergenossenschaft werfen eine Dividende ab. Ziehe 50 € ein.",
      E10: "Der Turmwächter schuldet dir einen Gefallen. Du kommst aus dem Hexenturm frei. Behalte diesen Schlüssel, bis du ihn brauchst oder verkaufst.",
      E11: "Falsche Ausfahrt auf der B 42. Gehe 3 Felder zurück.",
      E12: "Beim Schwarzangeln an der Lahn erwischt. Gehe direkt in den Hexenturm. Geh nicht über „Leinen los“, ziehe keine 200 € ein.",
      E13: "Die Fassaden brauchen frische Farbe. Zahle 25 € je Haus und 100 € je Hotel.",
      E14: "Geblitzt auf der Rheinuferstraße. Zahle 15 € Strafe.",
      E15: "Du wirst in den Vorstand des Heimatvereins gewählt. Zahle allen anderen je 50 €.",
      E16: "Dein Bausparvertrag wird fällig. Ziehe 150 € ein.",
      G1: "Rückenwind auf dem Rheinradweg. Rücke vor bis „Leinen los“ und ziehe 200 € ein.",
      G2: "Die Bank hat sich verrechnet – zu deinen Gunsten. Ziehe 200 € ein.",
      G3: "Zeckenbiss beim Wandern auf dem Rheinsteig. Zahle 50 € Arztkosten.",
      G4: "Du verkaufst deine Aktien der Sektkellerei. Ziehe 50 € ein.",
      G5: "Gute Freunde im Rathaus: Du kommst aus dem Hexenturm frei. Behalte diesen Schlüssel, bis du ihn brauchst oder verkaufst.",
      G6: "Beim Feuerwerk am Rhein ohne Genehmigung gezündelt. Gehe direkt in den Hexenturm. Geh nicht über „Leinen los“, ziehe keine 200 € ein.",
      G7: "Dein Urlaubsgeld ist da. Ziehe 100 € ein.",
      G8: "Das Finanzamt erstattet dir zu viel gezahlte Steuer. Ziehe 20 € ein.",
      G9: "Du hast Geburtstag und lädst ans Lahnufer ein. Alle anderen schenken dir je 10 €.",
      G10: "Deine Lebensversicherung wird ausgezahlt. Ziehe 100 € ein.",
      G11: "Sturz mit dem Fahrrad am Leinpfad. Zahle 100 € für das Krankenhaus.",
      G12: "Die Musikschule schickt die Gebühren. Zahle 50 €.",
      G13: "Du berätst das Weinfest bei der Planung. Ziehe 25 € Honorar ein.",
      G14: "Nach dem Hochwasser werden die Straßen ausgebessert. Zahle 40 € je Haus und 115 € je Hotel.",
      G15: "Zweiter Platz beim Kürbiswettbewerb in Eschbach. Ziehe 10 € ein.",
      G16: "Eine Tante aus Braubach vererbt dir 100 €."
    },
    design: {
      papier: '#f6f0e3',
      rand: '#1b2a2f',
      mitte: '#133a49',
      akzent: '#5cc48a',
      // Rhein (breit, von oben nach unten) und Lahn (von rechts), ganz zart auf dem dunklen Mittelfenster
      mitteMotiv: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" preserveAspectRatio="none"><g transform="scale(10)" fill="none">' +
        '<path d="M30 -2C36 14 22 26 30 40S44 58 38 72S30 90 36 102" stroke="rgba(108,199,216,.10)" stroke-width="9"/>' +
        '<path d="M102 44C88 40 78 48 66 46S46 50 36 53" stroke="rgba(108,199,216,.08)" stroke-width="4.5"/>' +
        '<path d="M-2 22C10 26 18 20 28 26" stroke="rgba(108,199,216,.07)" stroke-width="5"/></g></svg>',
      ecken: {
        start: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 24"><path d="M56 12H10M19 3L7 12l12 9" fill="none" stroke="#d8483c" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
        turm: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 46"><path d="M8 44V14h3V8h4v6h4V8h4v6h4V8h4v6h3v30z" fill="#c9b99a" stroke="#1b2a2f" stroke-width="2"/><path d="M15 44v-9a5 5 0 0 1 10 0v9z" fill="#1b2a2f"/><rect x="17" y="19" width="6" height="8" rx="3" fill="#1b2a2f"/><path d="M19.5 19v8M17 23h6" stroke="#c9b99a" stroke-width="1.2"/></svg>',
        pause: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 36"><path d="M8 18h44M10 18v12M50 18v12M12 10h36" stroke="#1b2a2f" stroke-width="4" stroke-linecap="round"/><path d="M4 32c8-4 14 4 22 0s14 4 22 0 8 2 10 0" stroke="#4b9bd4" stroke-width="3" fill="none"/></svg>',
        abInTurm: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 46"><path d="M8 44V14h3V8h4v6h4V8h4v6h4V8h4v6h3v30z" fill="#c9b99a" stroke="#1b2a2f" stroke-width="2"/><path d="M15 44v-9a5 5 0 0 1 10 0v9z" fill="#1b2a2f"/><rect x="17" y="19" width="6" height="8" rx="3" fill="#1b2a2f"/><path d="M19.5 19v8M17 23h6" stroke="#c9b99a" stroke-width="1.2"/></svg>'
      }
    }
  };
  if (typeof module !== 'undefined') module.exports = A;
  else (window.RheinbaronAusgaben = window.RheinbaronAusgaben || {})[A.id] = A;
})();
