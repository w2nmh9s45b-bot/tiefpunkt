"use strict";
/* Rheinbaron – reine Spielregeln (ohne DOM). Seite: rheinbaron.html, Prüfung: Werkzeuge/proben/rheinbaron.test.mjs

   REGELQUELLE
   Offizielle deutsche Spielanleitung des Vorbilds, aktuelle Euro-Ausgabe (Hasbro C1009, „© 1935, 2017“, Anleitung
   mit Besitzrechtkarten), abgerufen 08.11.2026 von hasbro.com (PDF 15BC20AF8742499EBC3A6BCA91594560.pdf).
   Daraus übernommen, ohne Änderung:
   - Startkapital 1.500 €, über Los oder auf Los 200 €, Einkommensteuer 200 €, Zusatzsteuer 100 €.
   - Pasch: Zug normal ausführen, danach erneut würfeln. Dritter Pasch in Folge: sofort ins Gefängnis, dritten Zug
     nicht ausführen.
   - Freies Grundstück: kaufen oder versteigern lassen. Versteigerung: Anfangsgebot 10 €, Schritte zu 1 €, alle
     dürfen mitbieten (auch wer nicht kaufen wollte), ohne Reihenfolge; Ende, wenn niemand mehr erhöht; will niemand
     bieten, bleibt das Grundstück bei der Bank.
   - Miete: Straßen laut Karte, doppelt bei ganzer Farbgruppe ohne Häuser; Bahnhöfe 25/50/100/200 nach Anzahl;
     Werke: Würfel werfen, Augen × 4 (ein Werk) bzw. × 10 (beide). Mit Hypothek belastete Grundstücke bringen keine
     Miete; die unbelasteten derselben Gruppe behalten die höhere Miete (gilt auch für Bahnhöfe und Werke).
   - Gefängnis: kein Los-Geld, Zug endet. Im Gefängnis darf man Miete kassieren, mitbieten, bauen, Hypotheken
     aufnehmen und handeln. Raus: (1) zu Beginn des Zuges 50 € zahlen, dann normal würfeln und ziehen;
     (2) Frei-Karte spielen (zurück unter ihren Stapel), dann würfeln und ziehen; (3) Pasch würfeln: sofort frei,
     mit diesem Wurf ziehen, Zug beendet. Drei Versuche; klappt es auch beim dritten nicht: 50 € zahlen und mit dem
     letzten Wurf ziehen.
   - Häuser: ganze Farbgruppe nötig, gleichmäßig bauen, höchstens 4 Häuser, dann Hotel (4 Häuser zurück an die
     Bank + Hotelpreis). Nicht bauen, wenn eine Straße der Gruppe belastet ist. Bauen jederzeit, nicht nur im eigenen
     Zug. 32 Häuser, 12 Hotels. Mangel: Wollen mehrere das letzte Haus/Hotel, wird es versteigert (ab 10 €, Schritte
     1 €, Betrag an die Bank). Keine Gebäude mehr: warten.
   - Verkauf an die Bank zum halben Preis, gleichmäßig; ein Hotel wird gegen 4 Häuser getauscht.
   - Hypothek: erst alle Gebäude der Farbgruppe verkaufen; Bank zahlt den Hypothekenwert (halber Kaufpreis);
     Ablösen: Hypothekenwert + 10 %.
   - Handeln: jederzeit Grundstücke (ohne Gebäude in der Farbgruppe), Geld und Frei-Karten, Preise frei vereinbart.
     Belastete Grundstücke: der neue Besitzer löst sofort ab ODER zahlt sofort 10 % Zinsen und behält die Hypothek.
   - Pleite gegenüber Mitspieler: alles (Geld, Grundstücke, Frei-Karten) an ihn; er muss für jedes belastete Grundstück
     sofort ablösen oder 10 % zahlen. Pleite gegenüber der Bank: Grundstücke an die Bank, Hypotheken verfallen,
     Grundstücke werden sofort einzeln versteigert, Frei-Karten zurück unter ihren Stapel.
   - Frei Parken: es passiert nichts, kein Geld in der Mitte. Karten: ziehen, sofort ausführen, unter den Stapel.
   - Werte der Besitzrechtkarten (Preis, Mieten, Hauspreis, Hypothek) entsprechen der Euro-Ausgabe; die Anleitung
     zeigt Chaussee-/Elisen-/Poststraße mit 6/12/30/90/270/400/550 bzw. 8/…/600, Bahnhof 200 €, Werke 150 €,
     Opernplatz 240 € – identisch mit der international einheitlichen Tabelle, die hier vollständig übernommen ist.

   KARTEN: Die Anleitung nennt nur 16 Ereignis- und 16 Gemeinschaftskarten. Die Wirkungen folgen dem einheitlichen
   Kartensatz der Euro-/Dollar-Ausgaben ab 2008 (dieselben Beträge wie die übrigen Werte dieser Ausgabe):
   Ereignis: Los, Ziel 24, Ziel 11, Ziel 39, 2× nächster Bahnhof (doppelte Miete), nächstes Werk (Wurf × 10),
   Ausflug zu Feld 5, Dividende 50, Frei-Karte, 3 Felder zurück, Gefängnis, Renovierung 25/100, Strafe 15,
   jedem 50 zahlen, Bausparvertrag 150.  Gemeinschaft: Los, Bankirrtum 200, Arzt 50, Aktien 50, Frei-Karte,
   Gefängnis, Urlaubsgeld 100, Steuererstattung 20, Geburtstag 10 von jedem, Lebensversicherung 100,
   Krankenhaus 100, Schulgeld 50, Honorar 25, Straßenausbesserung 40/115, Wettbewerb 10, Erbschaft 100.
   Den Wortlaut der deutschen Karten konnte ich nicht als Volltext finden; die Texte hier sind ohnehin eigene.

   AUSLEGUNGEN (wo die Anleitung offen lässt oder das iPad die Bank ist)
   A1 Die App ist Bankhalter. Miete wird nicht „verschlafen“: die App fordert sie immer ein (alle sehen alles).
   A2 Werk-Miete: wie in der Anleitung („Werfen Sie die Würfel, um die Miete zu ermitteln“) mit einem eigenen Wurf.
      Ein Pasch bei diesem Wurf zählt nicht als Pasch.
   A3 Startspieler: alle würfeln, höchste Augensumme beginnt, bei Gleichstand würfeln die Gleichen erneut; danach
      in der Reihenfolge der Anmeldung (im Uhrzeigersinn).
   A4 Bieten nur bis zum eigenen Bargeld. Wer das nächste Mindestgebot nicht bezahlen kann, ist automatisch raus.
      Wer das Höchstgebot hält, kann nicht aussteigen. Die Versteigerung endet, wenn alle anderen ausgestiegen sind.
   A5 Kaufen zum Listenpreis nur mit genug Bargeld; vorher darf man Hypotheken aufnehmen oder Häuser verkaufen.
   A6 10 % Zinsen und „Hypothekenwert + 10 %“ werden auf ganze Euro aufgerundet (z. B. 75 → 83 bzw. 8).
   A7 Hotel verkaufen braucht 4 freie Häuser in der Bank. Fehlen sie, kann man alle Gebäude der Farbgruppe auf einmal
      verkaufen (je Stufe der halbe Hauspreis).
   A8 Mangel: Die App fragt nach, sobald jemand das letzte Haus bzw. letzte Hotel der Bank kaufen will und noch jemand
      anderes es setzen könnte. Wer ersteigert, zahlt das Gebot an die Bank und setzt das Gebäude sofort.
   A9 Bankrott ist erst möglich, wenn Bargeld + Erlös aus allen Gebäuden + alle möglichen Hypotheken die Schuld nicht
      decken. Gebäude werden dabei an die Bank verkauft (halber Preis). Bei mehreren Gläubigern in einem Zug (Karte
      „jedem 50 zahlen“) wird der Reihe nach gezahlt; Bankrott gilt gegenüber dem, dessen Zahlung offen ist.
   A10 Zeitlimit ist eine beschriftete Option (nicht in der Anleitung): nach Ablauf wird der laufende Zug beendet,
       dann zählt das Vermögen: Bargeld + Kaufpreis unbelasteter Grundstücke + Hypothekenwert belasteter
       + Gebäude zum Kaufpreis (Hotel = 5 Hauspreise). Vorgabe: kein Zeitlimit, Spiel bis eine Person übrig ist.
   A11 Handel ist erlaubt, solange keine Versteigerung läuft und keine Karte offen liegt.

   AUSGABEN (Spielbretter für verschiedene Orte, Format siehe AUSGABEN.md)
   ausgabeSetzen(daten) tauscht nur Texte: Feldnamen und -beschreibungen, Gruppennamen, Kartentexte, Stapelnamen und
   die Begriffe (Start, Gefängnis, Frei Parken, Frei-Karte, Bahnhof, Werk …), die auch in Verlauf und Meldungen stehen.
   Preise, Mieten, Feldarten und Kartenwirkungen bleiben unverändert. Die eingebauten Texte sind die Ausgabe
   „Rhein & Lahn“ (id rheinlahn); ausgabeSetzen(null) stellt sie wieder her. Ein Spielstand trägt die id in s.ausgabe;
   Spielstände ohne s.ausgabe gelten als rheinlahn.
*/
(function () {
  const START_GELD = 1500, LOS_GELD = 200, TURM_STRAFE = 50, MIN_GEBOT = 10, HAEUSER = 32, HOTELS = 12;
  const BAHN_MIETE = [0, 25, 50, 100, 200];
  const TURM = 10;

  const GRUPPEN = {
    braun: {name: 'Taunusrand', farbe: '#8a5a3c'},
    hellblau: {name: 'Blaues Ländchen', farbe: '#8ccbe8'},
    pink: {name: 'Lahntal', farbe: '#d65a9a'},
    orange: {name: 'Lahnstein', farbe: '#ef8a2e'},
    rot: {name: 'Burgen am Rhein', farbe: '#d8483c'},
    gelb: {name: 'Ehrenbreitstein', farbe: '#f2c94c'},
    gruen: {name: 'Koblenzer Altstadt', farbe: '#2f9a5a'},
    blau: {name: 'Am Deutschen Eck', farbe: '#2c5bb8'}
  };
  const S = (n, g, p, m, h, ort) => ({n, t: 'strasse', g, p, m, h, hy: p / 2, ort});
  const FELDER = [
    {n: 'Leinen los', t: 'start'},
    S('Frücht', 'braun', 60, [2, 10, 30, 90, 160, 250], 50, 'Dorf über dem Lahntal bei Bad Ems'),
    {n: 'Gemeinschaft', t: 'gemeinschaft'},
    S('Friedrichssegen', 'braun', 60, [4, 20, 60, 180, 320, 450], 50, 'Altes Bergbaudorf, Stadtteil von Lahnstein'),
    {n: 'Einkommensteuer', t: 'steuer', betrag: 200},
    {n: 'Bahnhof Niederlahnstein', t: 'bahnhof', p: 200, hy: 100, ort: 'Wo Lahntalbahn und rechte Rheinstrecke sich treffen'},
    S('Miehlen', 'hellblau', 100, [6, 30, 90, 270, 400, 550], 50, 'Ort im Blauen Ländchen'),
    {n: 'Ereignis', t: 'ereignis'},
    S('Nastätten', 'hellblau', 100, [6, 30, 90, 270, 400, 550], 50, 'Kleinstadt im Blauen Ländchen'),
    S('Eschbach', 'hellblau', 120, [8, 40, 100, 300, 450, 600], 50, 'Dorf auf der Höhe zwischen Rhein und Taunus'),
    {n: 'Hexenturm', t: 'turm'},
    S('Dausenau', 'pink', 140, [10, 50, 150, 450, 625, 750], 100, 'Fachwerkort mit schiefem Turm an der Lahn'),
    {n: 'Stadtwerke', t: 'werk', p: 150, hy: 75, art: 'strom', ort: 'Strom für Lahnstein und das untere Lahntal'},
    S('Nassau', 'pink', 140, [10, 50, 150, 450, 625, 750], 100, 'Stammsitz der Nassauer an der Lahn'),
    S('Bad Ems', 'pink', 160, [12, 60, 180, 500, 700, 900], 100, 'Kurstadt an der Lahn'),
    {n: 'Bahnhof Bad Ems', t: 'bahnhof', p: 200, hy: 100, ort: 'Station der Lahntalbahn'},
    S('Salhofplatz', 'orange', 180, [14, 70, 200, 550, 750, 950], 100, 'Platz in Oberlahnstein mit dem Salhof'),
    {n: 'Gemeinschaft', t: 'gemeinschaft'},
    S('Hochstraße', 'orange', 180, [14, 70, 200, 550, 750, 950], 100, 'Einkaufsstraße in Oberlahnstein'),
    S('Burg Lahneck', 'orange', 200, [16, 80, 220, 600, 800, 1000], 100, 'Burg über der Lahnmündung'),
    {n: 'Uferpause', t: 'pause'},
    S('Braubach', 'rot', 220, [18, 90, 250, 700, 875, 1050], 150, 'Städtchen am Rhein unter der Marksburg'),
    {n: 'Ereignis', t: 'ereignis'},
    S('Schloss Stolzenfels', 'rot', 220, [18, 90, 250, 700, 875, 1050], 150, 'Schloss am linken Rheinufer gegenüber Lahnstein'),
    S('Marksburg', 'rot', 240, [20, 100, 300, 750, 925, 1100], 150, 'Nie zerstörte Höhenburg über Braubach'),
    {n: 'Bahnhof Braubach', t: 'bahnhof', p: 200, hy: 100, ort: 'Station an der rechten Rheinstrecke'},
    S('Ehrenbreitstein', 'gelb', 260, [22, 110, 330, 800, 975, 1150], 150, 'Stadtteil von Koblenz am rechten Rheinufer'),
    S('Rheinseilbahn', 'gelb', 260, [22, 110, 330, 800, 975, 1150], 150, 'Seilbahn über den Rhein in Koblenz'),
    {n: 'Wasserwerk', t: 'werk', p: 150, hy: 75, art: 'wasser', ort: 'Trinkwasser aus den Brunnen am Rhein'},
    S('Festung Ehrenbreitstein', 'gelb', 280, [24, 120, 360, 850, 1025, 1200], 150, 'Festung hoch über dem Deutschen Eck'),
    {n: 'Ab in den Hexenturm', t: 'abInTurm'},
    S('Löhrstraße', 'gruen', 300, [26, 130, 390, 900, 1100, 1275], 200, 'Einkaufsstraße in Koblenz'),
    S('Görresplatz', 'gruen', 300, [26, 130, 390, 900, 1100, 1275], 200, 'Platz mit der Historiensäule in Koblenz'),
    {n: 'Gemeinschaft', t: 'gemeinschaft'},
    S('Jesuitenplatz', 'gruen', 320, [28, 150, 450, 1000, 1200, 1400], 200, 'Platz am Koblenzer Rathaus'),
    {n: 'Koblenz Hauptbahnhof', t: 'bahnhof', p: 200, hy: 100, ort: 'Größter Bahnhof der Gegend'},
    {n: 'Ereignis', t: 'ereignis'},
    S('Kurfürstliches Schloss', 'blau', 350, [35, 175, 500, 1100, 1300, 1500], 200, 'Klassizistisches Schloss am Koblenzer Rheinufer'),
    {n: 'Zusatzsteuer', t: 'steuer', betrag: 100},
    S('Deutsches Eck', 'blau', 400, [50, 200, 600, 1400, 1700, 2000], 200, 'Landzunge am Zusammenfluss von Rhein und Mosel')
  ];
  FELDER.forEach((f, i) => { f.i = i; });
  Object.keys(GRUPPEN).forEach(g => { GRUPPEN[g].felder = FELDER.filter(f => f.g === g).map(f => f.i); });
  const KAUFBAR = FELDER.filter(f => f.p).map(f => f.i);
  const BAHNHOEFE = FELDER.filter(f => f.t === 'bahnhof').map(f => f.i);
  const WERKE = FELDER.filter(f => f.t === 'werk').map(f => f.i);

  /* Karten: Texte eigen, Wirkung wie die offiziellen Karten (siehe oben). */
  const KARTEN = {
    E1: {text: 'Der Fährmann winkt dich als Erste durch. Rücke vor bis „Leinen los“ und ziehe 200 € ein.', w: {art: 'ziel', nach: 0}},
    E2: {text: 'Burgfest auf der Marksburg! Rücke vor bis zur Marksburg. Kommst du über „Leinen los“, ziehe 200 € ein.', w: {art: 'ziel', nach: 24}},
    E3: {text: 'Wandertag im Lahntal. Rücke vor bis Dausenau. Kommst du über „Leinen los“, ziehe 200 € ein.', w: {art: 'ziel', nach: 11}},
    E4: {text: 'Sonnenuntergang am Zusammenfluss. Rücke vor bis zum Deutschen Eck.', w: {art: 'ziel', nach: 39}},
    E5: {text: 'Der Zug wartet nicht. Rücke vor bis zum nächsten Bahnhof. Gehört er jemandem, zahle die doppelte Miete. Ist er frei, darfst du ihn kaufen.', w: {art: 'bahnhof'}},
    E6: {text: 'Schienenersatzverkehr fällt aus – du nimmst den nächsten Zug. Rücke vor bis zum nächsten Bahnhof. Gehört er jemandem, zahle die doppelte Miete. Ist er frei, darfst du ihn kaufen.', w: {art: 'bahnhof'}},
    E7: {text: 'Stromausfall im Viertel. Rücke vor bis zum nächsten Werk. Gehört es jemandem, würfle und zahle das Zehnfache der Augen. Ist es frei, darfst du es kaufen.', w: {art: 'werk'}},
    E8: {text: 'Fahrt mit der Lahntalbahn. Rücke vor bis zum Bahnhof Niederlahnstein. Kommst du über „Leinen los“, ziehe 200 € ein.', w: {art: 'ziel', nach: 5}},
    E9: {text: 'Deine Anteile an der Winzergenossenschaft werfen eine Dividende ab. Ziehe 50 € ein.', w: {art: 'geld', betrag: 50}},
    E10: {text: 'Der Turmwächter schuldet dir einen Gefallen. Du kommst aus dem Hexenturm frei. Behalte diesen Schlüssel, bis du ihn brauchst oder verkaufst.', w: {art: 'frei'}},
    E11: {text: 'Falsche Ausfahrt auf der B 42. Gehe 3 Felder zurück.', w: {art: 'zurueck', n: 3}},
    E12: {text: 'Beim Schwarzangeln an der Lahn erwischt. Gehe direkt in den Hexenturm. Geh nicht über „Leinen los“, ziehe keine 200 € ein.', w: {art: 'turm'}},
    E13: {text: 'Die Fassaden brauchen frische Farbe. Zahle 25 € je Haus und 100 € je Hotel.', w: {art: 'reparatur', haus: 25, hotel: 100}},
    E14: {text: 'Geblitzt auf der Rheinuferstraße. Zahle 15 € Strafe.', w: {art: 'zahlen', betrag: 15}},
    E15: {text: 'Du wirst in den Vorstand des Heimatvereins gewählt. Zahle allen anderen je 50 €.', w: {art: 'jedemZahlen', betrag: 50}},
    E16: {text: 'Dein Bausparvertrag wird fällig. Ziehe 150 € ein.', w: {art: 'geld', betrag: 150}},
    G1: {text: 'Rückenwind auf dem Rheinradweg. Rücke vor bis „Leinen los“ und ziehe 200 € ein.', w: {art: 'ziel', nach: 0}},
    G2: {text: 'Die Bank hat sich verrechnet – zu deinen Gunsten. Ziehe 200 € ein.', w: {art: 'geld', betrag: 200}},
    G3: {text: 'Zeckenbiss beim Wandern auf dem Rheinsteig. Zahle 50 € Arztkosten.', w: {art: 'zahlen', betrag: 50}},
    G4: {text: 'Du verkaufst deine Aktien der Sektkellerei. Ziehe 50 € ein.', w: {art: 'geld', betrag: 50}},
    G5: {text: 'Gute Freunde im Rathaus: Du kommst aus dem Hexenturm frei. Behalte diesen Schlüssel, bis du ihn brauchst oder verkaufst.', w: {art: 'frei'}},
    G6: {text: 'Beim Feuerwerk am Rhein ohne Genehmigung gezündelt. Gehe direkt in den Hexenturm. Geh nicht über „Leinen los“, ziehe keine 200 € ein.', w: {art: 'turm'}},
    G7: {text: 'Dein Urlaubsgeld ist da. Ziehe 100 € ein.', w: {art: 'geld', betrag: 100}},
    G8: {text: 'Das Finanzamt erstattet dir zu viel gezahlte Steuer. Ziehe 20 € ein.', w: {art: 'geld', betrag: 20}},
    G9: {text: 'Du hast Geburtstag und lädst ans Lahnufer ein. Alle anderen schenken dir je 10 €.', w: {art: 'vonJedem', betrag: 10}},
    G10: {text: 'Deine Lebensversicherung wird ausgezahlt. Ziehe 100 € ein.', w: {art: 'geld', betrag: 100}},
    G11: {text: 'Sturz mit dem Fahrrad am Leinpfad. Zahle 100 € für das Krankenhaus.', w: {art: 'zahlen', betrag: 100}},
    G12: {text: 'Die Musikschule schickt die Gebühren. Zahle 50 €.', w: {art: 'zahlen', betrag: 50}},
    G13: {text: 'Du berätst das Weinfest bei der Planung. Ziehe 25 € Honorar ein.', w: {art: 'geld', betrag: 25}},
    G14: {text: 'Nach dem Hochwasser werden die Straßen ausgebessert. Zahle 40 € je Haus und 115 € je Hotel.', w: {art: 'reparatur', haus: 40, hotel: 115}},
    G15: {text: 'Zweiter Platz beim Kürbiswettbewerb in Eschbach. Ziehe 10 € ein.', w: {art: 'geld', betrag: 10}},
    G16: {text: 'Eine Tante aus Braubach vererbt dir 100 €.', w: {art: 'geld', betrag: 100}}
  };
  const DECKNAME = {E: 'Ereignis', G: 'Gemeinschaft'};

  /* ---------- Ausgaben: Begriffe und Texte austauschbar ---------- */
  const BEGRIFFE = {
    start: 'Leinen los', turm: 'Hexenturm', imTurm: 'im Hexenturm', inDenTurm: 'in den Hexenturm', ausDemTurm: 'aus dem Hexenturm',
    abInTurm: 'Ab in den Hexenturm', pause: 'Uferpause', pauseText: 'Hier passiert nichts',
    schluessel: 'Turmschlüssel', schluesselMz: 'Turmschlüssel', bahnhof: 'Bahnhof', bahnhoefe: 'Bahnhöfe', werk: 'Werk', werke: 'Werke',
    ereignis: 'Ereignis', gemeinschaft: 'Gemeinschaft', steuer: 'Steuer'
  };
  const AUSGABE = {id: 'rheinlahn'};
  // Abzug der eingebauten Texte (= Ausgabe rheinlahn), damit jede Ausgabe vom selben Grundstand aus gesetzt wird
  const GRUND = {
    begriffe: Object.assign({}, BEGRIFFE),
    felder: FELDER.map(f => ({n: f.n, ort: f.ort})),
    gruppen: Object.fromEntries(Object.keys(GRUPPEN).map(g => [g, GRUPPEN[g].name])),
    karten: Object.fromEntries(Object.keys(KARTEN).map(k => [k, KARTEN[k].text]))
  };
  const ECKE = {0: 'start', 10: 'turm', 20: 'pause', 30: 'abInTurm'};
  function ausgabeSetzen(daten) {
    const d = daten || {};
    if (daten && (!Array.isArray(d.felder) || d.felder.length !== 40)) throw new Error('Ausgabe ' + (d.id || '?') + ': genau 40 Felder nötig');
    const txt = (v, alt) => (typeof v === 'string' && v.trim() ? v : alt);
    Object.keys(GRUND.begriffe).forEach(k => { BEGRIFFE[k] = txt(d.begriffe && d.begriffe[k], GRUND.begriffe[k]); });
    Object.keys(GRUPPEN).forEach(g => { GRUPPEN[g].name = txt(d.gruppen && d.gruppen[g], GRUND.gruppen[g]); });
    FELDER.forEach((F, i) => {
      const a = daten ? (d.felder[i] || {}) : GRUND.felder[i];
      delete F.kurz; delete F.trenn;
      if (ECKE[i] != null) F.n = ECKE[i] === 'start' ? txt(a.n, BEGRIFFE.start) : BEGRIFFE[ECKE[i]];
      else if (F.t === 'ereignis' || F.t === 'gemeinschaft') F.n = BEGRIFFE[F.t];
      else F.n = txt(a.n, GRUND.felder[i].n);
      if (F.p) F.ort = txt(a.ort, daten ? '' : GRUND.felder[i].ort); else if (a.ort) F.ort = a.ort; else delete F.ort;
      if (daten && typeof a.kurz === 'string' && a.kurz.trim()) F.kurz = a.kurz;
      if (daten && typeof a.trenn === 'string' && a.trenn.trim()) F.trenn = a.trenn;
    });
    Object.keys(KARTEN).forEach(k => { KARTEN[k].text = txt(d.karten && d.karten[k], GRUND.karten[k]); });
    DECKNAME.E = BEGRIFFE.ereignis; DECKNAME.G = BEGRIFFE.gemeinschaft;
    AUSGABE.id = daten ? String(d.id || 'rheinlahn') : 'rheinlahn';
    return AUSGABE.id;
  }
  const ausgabeId = () => AUSGABE.id;
  const B = BEGRIFFE;

  /* ---------- Hilfen ---------- */
  const euro = n => (n < 0 ? '−' : '') + Math.abs(n).toLocaleString('de-DE') + ' €';
  const fehler = text => { const e = new Error(text); e.regel = true; return e; };
  const zinsen = f => Math.ceil(FELDER[f].hy * 0.1);
  const abloesePreis = f => Math.ceil(FELDER[f].hy * 1.1);
  const aktive = s => s.spieler.map((p, i) => i).filter(i => !s.spieler[i].raus);
  const besitz = (s, f) => s.besitz[f];
  const felderVon = (s, sp) => KAUFBAR.filter(f => s.besitz[f].von === sp);
  const hatGruppe = (s, sp, g) => GRUPPEN[g].felder.every(f => s.besitz[f].von === sp);
  const stufen = (s, g) => GRUPPEN[g].felder.map(f => s.besitz[f].h);
  const gruppeBebaut = (s, g) => !!g && stufen(s, g).some(h => h > 0);
  function log(s, text) { s.log.push(text); if (s.log.length > 80) s.log.splice(0, s.log.length - 80); }
  const nm = (s, i) => i == null ? 'die Bank' : s.spieler[i].name;

  function zufallStd(n) { return Math.floor(Math.random() * n); }
  function mischen(arr, zufall) { for (let i = arr.length - 1; i > 0; i--) { const j = zufall(i + 1); [arr[i], arr[j]] = [arr[j], arr[i]]; } return arr; }

  /* ---------- Spiel anlegen ---------- */
  function neu({namen, farben = [], figuren = [], optionen = {}, zufall = zufallStd, startspieler = null} = {}) {
    if (!namen || namen.length < 2 || namen.length > 6) throw fehler('2 bis 6 Personen');
    const s = {
      v: 1,
      spieler: namen.map((name, i) => ({name, farbe: farben[i] || '#ccc', figur: figuren[i] ?? i, geld: START_GELD, pos: 0,
        turm: false, versuche: 0, karten: [], raus: false, rausZug: null})),
      besitz: {}, bank: {haeuser: HAEUSER, hotels: HOTELS},
      stapel: {E: mischen(Object.keys(KARTEN).filter(k => k[0] === 'E'), zufall), G: mischen(Object.keys(KARTEN).filter(k => k[0] === 'G'), zufall)},
      dran: 0, pasch: 0, wurf: null, letzterPasch: false, keinNochmal: false,
      q: [], akt: null, log: [], anim: [], zug: 1,
      zeit: {limit: (Number(optionen.zeit) || 0) * 60000, gespielt: 0}, ende: null, startwurf: [], ausgabe: AUSGABE.id
    };
    KAUFBAR.forEach(f => { s.besitz[f] = {von: null, h: 0, hy: false}; });
    // Startspieler auswürfeln (A3)
    if (startspieler != null) s.dran = startspieler;
    else {
      let kandidaten = namen.map((n, i) => i);
      while (kandidaten.length > 1) {
        const runde = kandidaten.map(i => ({sp: i, w: [1 + zufall(6), 1 + zufall(6)]}));
        s.startwurf.push(runde);
        const max = Math.max(...runde.map(r => r.w[0] + r.w[1]));
        kandidaten = runde.filter(r => r.w[0] + r.w[1] === max).map(r => r.sp);
      }
      s.dran = kandidaten[0];
    }
    log(s, `${nm(s, s.dran)} beginnt.`);
    s.q.push({t: 'zugStart'});
    laufen(s);
    return s;
  }

  /* ---------- Miete ---------- */
  function miete(s, f, augen = null) {
    const F = FELDER[f], b = s.besitz[f];
    if (!b || b.von == null) return 0;
    if (F.t === 'strasse') {
      if (b.h > 0) return F.m[b.h];
      return F.m[0] * (hatGruppe(s, b.von, F.g) ? 2 : 1);
    }
    if (F.t === 'bahnhof') return BAHN_MIETE[BAHNHOEFE.filter(x => s.besitz[x].von === b.von).length];
    if (F.t === 'werk') { const fk = werkFaktor(s, b.von); return augen == null ? fk : augen * fk; }
    return 0;
  }
  const werkFaktor = (s, sp) => WERKE.filter(x => s.besitz[x].von === sp).length === 2 ? 10 : 4;

  /* ---------- Ablauf: Warteschlange von Schritten ----------
     s.akt = der Schritt, auf den das Spiel gerade wartet (eine Eingabe nötig), s.q = was danach kommt. */
  function laufen(s) {
    let n = 0;
    while (!s.akt && !s.ende && s.q.length) {
      if (++n > 2000) throw new Error('Ablauf hängt');
      schritt(s, s.q.shift());
    }
  }
  function blockiere(s, it) { s.akt = it; }

  function schritt(s, it) {
    const P = it.sp != null ? s.spieler[it.sp] : null;
    switch (it.t) {
      case 'zugStart': {
        const p = s.spieler[s.dran];
        blockiere(s, p.turm ? {t: 'turm'} : {t: 'wurf'}); break;
      }
      case 'wurf': case 'turm': case 'kauf': case 'werk': case 'gutschein':
        if (P && P.raus) break;
        blockiere(s, it); break;
      case 'fertig': {
        const p = s.spieler[s.dran];
        if (p.raus) { s.q.unshift({t: 'naechster'}); break; }
        it.nochmal = s.letzterPasch && !s.keinNochmal && !p.turm;
        blockiere(s, it); break;
      }
      case 'naechster': naechster(s); break;
      case 'turmFrei': P.turm = false; P.versuche = 0; break;
      case 'turmRein': turmRein(s, it.sp); break;
      case 'bewegen': bewegen(s, it.sp, it.n, it.modus); break;
      case 'ziel': {
        const n = (it.nach - P.pos + 40) % 40 || 40;
        bewegen(s, it.sp, n, it.modus); break;
      }
      case 'landen': landen(s, it.sp, it.modus); break;
      case 'karte': {
        if (P.raus) break;
        if (!it.id) {
          it.id = s.stapel[it.deck].shift();
          log(s, `${P.name} zieht eine Karte: ${DECKNAME[it.deck]}.`);
        }
        blockiere(s, it); break;
      }
      case 'zahlen': {
        const v = s.spieler[it.von];
        if (v.raus || (it.an != null && s.spieler[it.an].raus) || it.betrag <= 0) break;
        if (!it.bestaetigen && v.geld >= it.betrag) { ueberweisen(s, it); break; }
        blockiere(s, it); break;
      }
      case 'uebernahme': {
        const b = s.besitz[it.feld];
        if (P.raus || b.von !== it.sp || !b.hy) break;
        blockiere(s, it); break;
      }
      case 'auktion': {
        if (!it.teilnehmer) it.teilnehmer = aktive(s);
        it.teilnehmer = it.teilnehmer.filter(i => !s.spieler[i].raus);
        it.gebot = it.gebot || 0; if (it.hoechster === undefined) it.hoechster = null; it.raus = it.raus || [];
        if (it.art === 'feld' && s.besitz[it.feld].von != null) break;
        if (!it.teilnehmer.length) { if (it.art === 'feld') log(s, `${FELDER[it.feld].n} bleibt bei der Bank.`); break; }
        blockiere(s, it); auktionPruefen(s); break;
      }
      default: throw new Error('Unbekannter Schritt ' + it.t);
    }
  }

  function naechster(s) {
    s.pasch = 0; s.letzterPasch = false; s.keinNochmal = false;
    if (zeitAbgelaufen(s)) { spielEnde(s, 'zeit'); return; }
    const n = s.spieler.length;
    let i = s.dran;
    for (let k = 0; k < n; k++) { i = (i + 1) % n; if (!s.spieler[i].raus) break; }
    s.dran = i; s.zug++;
    s.q.unshift({t: 'zugStart'});
  }

  function ueberweisen(s, it) {
    const v = s.spieler[it.von];
    v.geld -= it.betrag;
    if (it.an != null) s.spieler[it.an].geld += it.betrag;
    s.anim.push({art: 'geld', von: it.von, an: it.an, betrag: it.betrag});
    const was = {miete: `Miete für ${it.feld != null ? FELDER[it.feld].n : ''}`, steuer: FELDER[it.feld] ? FELDER[it.feld].n : 'Steuer',
      turm: B.turm, zinsen: 'Zinsen', karte: 'Karte'}[it.grund] || 'Zahlung';
    log(s, `${v.name} zahlt ${euro(it.betrag)} an ${nm(s, it.an)} (${was.trim()}).`);
  }

  function bewegen(s, sp, n, modus) {
    const P = s.spieler[sp], von = P.pos;
    P.pos = ((von + n) % 40 + 40) % 40;
    s.anim.push({art: 'zug', sp, von, n});
    if (n > 0 && von + n >= 40) { P.geld += LOS_GELD; log(s, `${P.name} kommt über „${B.start}“ und erhält ${euro(LOS_GELD)}.`); s.anim.push({art: 'los', sp}); }
    s.q.unshift({t: 'landen', sp, modus});
  }

  function turmRein(s, sp) {
    const P = s.spieler[sp];
    P.pos = TURM; P.turm = true; P.versuche = 0;
    s.anim.push({art: 'sprung', sp, nach: TURM});
    if (sp === s.dran) s.keinNochmal = true;
    log(s, `${P.name} muss ${B.inDenTurm}.`);
  }

  function landen(s, sp, modus) {
    const P = s.spieler[sp], f = P.pos, F = FELDER[f];
    if (F.p) {
      const b = s.besitz[f];
      if (b.von == null) { s.q.unshift({t: 'kauf', sp, feld: f}); return; }
      if (b.von === sp) return;
      if (b.hy) { log(s, `${F.n} ist belastet – keine Miete.`); return; }
      if (s.spieler[b.von].raus) return;
      if (F.t === 'werk') {
        const faktor = modus === 'werk10' ? 10 : werkFaktor(s, b.von);
        s.q.unshift({t: 'werk', sp, an: b.von, feld: f, faktor}); return;
      }
      const betrag = miete(s, f) * (modus === 'bahnhof2' ? 2 : 1);
      s.q.unshift({t: 'zahlen', von: sp, an: b.von, betrag, grund: 'miete', feld: f, bestaetigen: true, doppelt: modus === 'bahnhof2'});
      return;
    }
    switch (F.t) {
      case 'steuer': s.q.unshift({t: 'zahlen', von: sp, an: null, betrag: F.betrag, grund: 'steuer', feld: f, bestaetigen: true}); break;
      case 'ereignis': s.q.unshift({t: 'karte', deck: 'E', sp}); break;
      case 'gemeinschaft': s.q.unshift({t: 'karte', deck: 'G', sp}); break;
      case 'abInTurm': turmRein(s, sp); break;
    }
  }

  /* ---------- Prüfungen ---------- */
  function erwarte(s, art) {
    if (s.ende) throw fehler('Das Spiel ist vorbei.');
    if (!s.akt || s.akt.t !== art) throw fehler('Das geht gerade nicht.');
    return s.akt;
  }
  const anfang = s => { s.anim = []; };
  const pruefeWurf = w => {
    if (!Array.isArray(w) || w.length !== 2 || !w.every(x => Number.isInteger(x) && x >= 1 && x <= 6)) throw new Error('Ungültiger Wurf');
  };
  function verwaltenErlaubt(s) { return !s.ende && !(s.akt && (s.akt.t === 'auktion' || s.akt.t === 'karte')); }

  /* ---------- Aktionen im Zug ---------- */
  function wuerfeln(s, w) {
    anfang(s); erwarte(s, 'wurf'); pruefeWurf(w);
    const sp = s.dran, P = s.spieler[sp], pasch = w[0] === w[1];
    s.wurf = w.slice(); s.letzterPasch = pasch; s.akt = null;
    if (pasch) s.pasch++;
    log(s, `${P.name} würfelt ${w[0]} und ${w[1]}${pasch ? ' – Pasch' : ''}.`);
    if (pasch && s.pasch >= 3) { log(s, `Dritter Pasch in Folge!`); turmRein(s, sp); s.q.push({t: 'fertig'}); }
    else s.q.push({t: 'bewegen', sp, n: w[0] + w[1]}, {t: 'fertig'});
    laufen(s); return s;
  }
  function turmZahlen(s) {
    anfang(s); erwarte(s, 'turm');
    const sp = s.dran;
    if (s.spieler[sp].geld < TURM_STRAFE) throw fehler(`Dir fehlen ${euro(TURM_STRAFE - s.spieler[sp].geld)}.`);
    s.akt = null;
    s.q.push({t: 'zahlen', von: sp, an: null, betrag: TURM_STRAFE, grund: 'turm'}, {t: 'turmFrei', sp}, {t: 'wurf'});
    log(s, `${nm(s, sp)} kauft sich ${B.ausDemTurm} frei.`);
    laufen(s); return s;
  }
  function turmKarte(s) {
    anfang(s); erwarte(s, 'turm');
    const sp = s.dran, P = s.spieler[sp];
    if (!P.karten.length) throw fehler(`Dir fehlt die Karte „${B.schluessel}“.`);
    const id = P.karten.shift(); s.stapel[id[0]].push(id);
    P.turm = false; P.versuche = 0;
    log(s, `${P.name} nutzt die Karte „${B.schluessel}“.`);
    s.akt = {t: 'wurf'}; return s;
  }
  function turmWuerfeln(s, w) {
    anfang(s); erwarte(s, 'turm'); pruefeWurf(w);
    const sp = s.dran, P = s.spieler[sp], pasch = w[0] === w[1];
    s.wurf = w.slice(); s.letzterPasch = false; s.keinNochmal = true; s.akt = null;
    P.versuche++;
    log(s, `${P.name} würfelt ${B.imTurm} ${w[0]} und ${w[1]}.`);
    if (pasch) {
      P.turm = false; P.versuche = 0; log(s, `Pasch – ${P.name} ist frei.`);
      s.q.push({t: 'bewegen', sp, n: w[0] + w[1]}, {t: 'fertig'});
    } else if (P.versuche >= 3) {
      log(s, `Dritter Versuch ohne Pasch – ${P.name} zahlt ${euro(TURM_STRAFE)} und zieht.`);
      s.q.push({t: 'zahlen', von: sp, an: null, betrag: TURM_STRAFE, grund: 'turm'}, {t: 'turmFrei', sp}, {t: 'bewegen', sp, n: w[0] + w[1]}, {t: 'fertig'});
    } else s.q.push({t: 'fertig'});
    laufen(s); return s;
  }
  function kaufen(s) {
    anfang(s); const it = erwarte(s, 'kauf'), P = s.spieler[it.sp], F = FELDER[it.feld];
    if (P.geld < F.p) throw fehler(`Dir fehlen ${euro(F.p - P.geld)}.`);
    P.geld -= F.p; s.besitz[it.feld].von = it.sp;
    s.anim.push({art: 'geld', von: it.sp, an: null, betrag: F.p});
    log(s, `${P.name} kauft ${F.n} für ${euro(F.p)}.`);
    s.akt = null; laufen(s); return s;
  }
  function versteigern(s) {
    anfang(s); const it = erwarte(s, 'kauf');
    log(s, `${nm(s, it.sp)} kauft ${FELDER[it.feld].n} nicht – Versteigerung.`);
    s.akt = null; s.q.unshift({t: 'auktion', art: 'feld', feld: it.feld}); laufen(s); return s;
  }
  function zahlen(s) {
    anfang(s); const it = erwarte(s, 'zahlen'), v = s.spieler[it.von];
    if (v.geld < it.betrag) throw fehler(`Dir fehlen ${euro(it.betrag - v.geld)}.`);
    ueberweisen(s, it); s.akt = null; laufen(s); return s;
  }
  function werkWuerfeln(s, w) {
    anfang(s); const it = erwarte(s, 'werk'); pruefeWurf(w);
    const betrag = (w[0] + w[1]) * it.faktor;
    s.werkWurf = w.slice();
    log(s, `${nm(s, it.sp)} würfelt ${w[0] + w[1]} für ${FELDER[it.feld].n}: ${w[0] + w[1]} × ${it.faktor} = ${euro(betrag)}.`);
    s.akt = null;
    s.q.unshift({t: 'zahlen', von: it.sp, an: it.an, betrag, grund: 'miete', feld: it.feld, bestaetigen: true, augen: w[0] + w[1], faktor: it.faktor});
    laufen(s); return s;
  }
  function naechstesFeld(pos, liste) { for (let k = 1; k <= 40; k++) { const f = (pos + k) % 40; if (liste.includes(f)) return f; } return liste[0]; }
  function karteOk(s) {
    anfang(s); const it = erwarte(s, 'karte'), sp = it.sp, P = s.spieler[sp], K = KARTEN[it.id], w = K.w;
    s.akt = null;
    const neu = [];
    if (w.art !== 'frei') s.stapel[it.deck].push(it.id);
    switch (w.art) {
      case 'ziel': neu.push({t: 'ziel', sp, nach: w.nach}); break;
      case 'bahnhof': neu.push({t: 'ziel', sp, nach: naechstesFeld(P.pos, BAHNHOEFE), modus: 'bahnhof2'}); break;
      case 'werk': neu.push({t: 'ziel', sp, nach: naechstesFeld(P.pos, WERKE), modus: 'werk10'}); break;
      case 'geld': P.geld += w.betrag; s.anim.push({art: 'geld', von: null, an: sp, betrag: w.betrag}); log(s, `${P.name} erhält ${euro(w.betrag)}.`); break;
      case 'zahlen': neu.push({t: 'zahlen', von: sp, an: null, betrag: w.betrag, grund: 'karte'}); break;
      case 'frei': P.karten.push(it.id); log(s, `${P.name} behält die Karte „${B.schluessel}“.`); break;
      case 'zurueck': neu.push({t: 'bewegen', sp, n: -w.n}); break;
      case 'turm': turmRein(s, sp); break;
      case 'reparatur': {
        let h = 0, ho = 0;
        felderVon(s, sp).forEach(f => { const x = s.besitz[f].h; if (x === 5) ho++; else h += x; });
        const betrag = h * w.haus + ho * w.hotel;
        if (betrag > 0) neu.push({t: 'zahlen', von: sp, an: null, betrag, grund: 'karte'});
        else log(s, `${P.name} hat keine Gebäude – nichts zu zahlen.`);
        break;
      }
      case 'jedemZahlen': aktive(s).filter(i => i !== sp).forEach(i => neu.push({t: 'zahlen', von: sp, an: i, betrag: w.betrag, grund: 'karte'})); break;
      case 'vonJedem': aktive(s).filter(i => i !== sp).forEach(i => neu.push({t: 'zahlen', von: i, an: sp, betrag: w.betrag, grund: 'karte'})); break;
    }
    s.q.unshift(...neu);
    laufen(s); return s;
  }
  function weiter(s) {
    anfang(s); const it = erwarte(s, 'fertig');
    s.akt = null;
    if (it.nochmal) s.akt = {t: 'wurf'};
    else { s.q.unshift({t: 'naechster'}); laufen(s); }
    return s;
  }

  /* ---------- Versteigerung ---------- */
  const mindestGebot = a => a.hoechster == null ? MIN_GEBOT : a.gebot + 1;
  function auktionPruefen(s) {
    const a = s.akt;
    const min = mindestGebot(a);
    a.teilnehmer.forEach(i => { if (i !== a.hoechster && !a.raus.includes(i) && s.spieler[i].geld < min) a.raus.push(i); });
    const drin = a.teilnehmer.filter(i => !a.raus.includes(i));
    if (a.hoechster != null && drin.length === 1) { zuschlag(s); return; }
    if (!drin.length) {
      if (a.art === 'feld') log(s, `Niemand bietet – ${FELDER[a.feld].n} bleibt bei der Bank.`);
      else log(s, `Niemand bietet – das ${a.art === 'hotel' ? 'Hotel' : 'Haus'} bleibt bei der Bank.`);
      s.akt = null; laufen(s);
    }
  }
  function zuschlag(s) {
    const a = s.akt, P = s.spieler[a.hoechster];
    P.geld -= a.gebot;
    s.anim.push({art: 'geld', von: a.hoechster, an: null, betrag: a.gebot});
    s.akt = null;
    if (a.art === 'feld') {
      s.besitz[a.feld].von = a.hoechster;
      log(s, `${P.name} ersteigert ${FELDER[a.feld].n} für ${euro(a.gebot)}.`);
    } else {
      log(s, `${P.name} ersteigert das ${a.art === 'hotel' ? 'Hotel' : 'Haus'} für ${euro(a.gebot)}.`);
      s.q.unshift({t: 'gutschein', sp: a.hoechster, art: a.art});
    }
    s.letzteAuktion = {sp: a.hoechster, gebot: a.gebot, art: a.art, feld: a.feld};
    laufen(s);
  }
  function bieten(s, sp, betrag) {
    anfang(s); const a = erwarte(s, 'auktion');
    if (!a.teilnehmer.includes(sp) || a.raus.includes(sp)) throw fehler('Du bist bei dieser Versteigerung nicht mehr dabei.');
    if (!Number.isInteger(betrag) || betrag < mindestGebot(a)) throw fehler(`Mindestens ${euro(mindestGebot(a))}.`);
    if (betrag > s.spieler[sp].geld) throw fehler('So viel Bargeld hast du nicht.');
    a.gebot = betrag; a.hoechster = sp;
    auktionPruefen(s); return s;
  }
  function aussteigen(s, sp) {
    anfang(s); const a = erwarte(s, 'auktion');
    if (sp === a.hoechster) throw fehler('Du hältst das Höchstgebot.');
    if (!a.teilnehmer.includes(sp) || a.raus.includes(sp)) throw fehler('Du bist schon raus.');
    a.raus.push(sp); auktionPruefen(s); return s;
  }

  /* ---------- Bauen, Verkaufen, Hypothek ---------- */
  function warumNichtBauen(s, sp, f, mitGeld = true, art = null) {
    const F = FELDER[f], b = s.besitz[f];
    if (!F || F.t !== 'strasse') return 'Nur auf Straßen kann man bauen.';
    if (b.von !== sp) return 'Die Straße gehört dir nicht.';
    if (!hatGruppe(s, sp, F.g)) return 'Dir fehlt noch eine Straße der Farbgruppe.';
    if (GRUPPEN[F.g].felder.some(x => s.besitz[x].hy)) return 'Eine Straße der Gruppe ist belastet.';
    if (b.h >= 5) return 'Hier steht schon ein Hotel.';
    if (b.h > Math.min(...stufen(s, F.g))) return 'Baue gleichmäßig: erst auf den anderen Straßen der Gruppe.';
    const hotel = b.h === 4;
    if (art && (art === 'hotel') !== hotel) return art === 'hotel' ? 'Hier fehlen noch Häuser für ein Hotel.' : 'Hier ist das nächste Gebäude ein Hotel.';
    if (hotel && s.bank.hotels < 1 && !art) return 'Die Bank hat kein Hotel mehr.';
    if (!hotel && s.bank.haeuser < 1 && !art) return 'Die Bank hat kein Haus mehr.';
    if (mitGeld && s.spieler[sp].geld < F.h) return `Dir fehlen ${euro(F.h - s.spieler[sp].geld)}.`;
    return '';
  }
  function hausKaufen(s, sp, f) {
    anfang(s);
    if (!verwaltenErlaubt(s)) throw fehler('Erst die Versteigerung bzw. Karte abschließen.');
    const w = warumNichtBauen(s, sp, f); if (w) throw fehler(w);
    const F = FELDER[f], b = s.besitz[f];
    s.spieler[sp].geld -= F.h;
    setzen(s, b);
    log(s, `${nm(s, sp)} baut ${b.h === 5 ? 'ein Hotel' : 'ein Haus'} auf ${F.n} (${euro(F.h)}).`);
    return s;
  }
  function setzen(s, b) {
    if (b.h === 4) { s.bank.hotels--; s.bank.haeuser += 4; b.h = 5; } else { s.bank.haeuser--; b.h++; }
  }
  function warumNichtVerkaufen(s, sp, f) {
    const F = FELDER[f], b = s.besitz[f];
    if (!F || F.t !== 'strasse' || b.von !== sp) return 'Die Straße gehört dir nicht.';
    if (b.h === 0) return 'Hier steht kein Gebäude.';
    if (b.h < Math.max(...stufen(s, F.g))) return 'Verkaufe gleichmäßig: erst auf den anderen Straßen der Gruppe.';
    if (b.h === 5 && s.bank.haeuser < 4) return 'Die Bank hat keine 4 Häuser zum Tausch. Verkaufe alle Gebäude der Gruppe.';
    return '';
  }
  function hausVerkaufen(s, sp, f) {
    anfang(s);
    if (!verwaltenErlaubt(s)) throw fehler('Erst die Versteigerung bzw. Karte abschließen.');
    const w = warumNichtVerkaufen(s, sp, f); if (w) throw fehler(w);
    const F = FELDER[f], b = s.besitz[f];
    if (b.h === 5) { b.h = 4; s.bank.hotels++; s.bank.haeuser -= 4; } else { b.h--; s.bank.haeuser++; }
    s.spieler[sp].geld += F.h / 2;
    log(s, `${nm(s, sp)} verkauft ein Gebäude auf ${F.n} (+${euro(F.h / 2)}).`);
    return s;
  }
  function gruppeErloes(s, g) { return GRUPPEN[g].felder.reduce((a, f) => a + s.besitz[f].h * FELDER[f].h / 2, 0); }
  function gruppeAbbauen(s, g) {
    let erloes = 0;
    GRUPPEN[g].felder.forEach(f => {
      const b = s.besitz[f];
      if (b.h === 5) s.bank.hotels++; else s.bank.haeuser += b.h;
      erloes += b.h * FELDER[f].h / 2; b.h = 0;
    });
    return erloes;
  }
  function gruppeVerkaufen(s, sp, g) {
    anfang(s);
    if (!verwaltenErlaubt(s)) throw fehler('Erst die Versteigerung bzw. Karte abschließen.');
    if (!GRUPPEN[g] || !hatGruppe(s, sp, g)) throw fehler('Die Farbgruppe gehört dir nicht.');
    if (!gruppeBebaut(s, g)) throw fehler('Hier stehen keine Gebäude.');
    const e = gruppeAbbauen(s, g); s.spieler[sp].geld += e;
    log(s, `${nm(s, sp)} verkauft alle Gebäude der Gruppe ${GRUPPEN[g].name} (+${euro(e)}).`);
    return s;
  }
  function warumNichtHypothek(s, sp, f) {
    const F = FELDER[f], b = s.besitz[f];
    if (!F || !F.p || b.von !== sp) return 'Das Grundstück gehört dir nicht.';
    if (b.hy) return 'Schon belastet.';
    if (F.g && gruppeBebaut(s, F.g)) return 'Verkaufe zuerst alle Gebäude der Farbgruppe.';
    return '';
  }
  function hypothek(s, sp, f) {
    anfang(s);
    if (!verwaltenErlaubt(s)) throw fehler('Erst die Versteigerung bzw. Karte abschließen.');
    const w = warumNichtHypothek(s, sp, f); if (w) throw fehler(w);
    s.besitz[f].hy = true; s.spieler[sp].geld += FELDER[f].hy;
    log(s, `${nm(s, sp)} nimmt eine Hypothek auf ${FELDER[f].n} auf (+${euro(FELDER[f].hy)}).`);
    return s;
  }
  function warumNichtAbloesen(s, sp, f) {
    const F = FELDER[f], b = s.besitz[f];
    if (!F || !F.p || b.von !== sp) return 'Das Grundstück gehört dir nicht.';
    if (!b.hy) return 'Nicht belastet.';
    if (s.spieler[sp].geld < abloesePreis(f)) return `Dir fehlen ${euro(abloesePreis(f) - s.spieler[sp].geld)}.`;
    return '';
  }
  function abloesen(s, sp, f) {
    anfang(s);
    if (!verwaltenErlaubt(s)) throw fehler('Erst die Versteigerung bzw. Karte abschließen.');
    const w = warumNichtAbloesen(s, sp, f); if (w) throw fehler(w);
    s.spieler[sp].geld -= abloesePreis(f); s.besitz[f].hy = false;
    log(s, `${nm(s, sp)} löst die Hypothek auf ${FELDER[f].n} ab (${euro(abloesePreis(f))}).`);
    return s;
  }
  /* Liquidität: was ohne Handel noch zu holen wäre (A9). */
  function erloesMoeglich(s, sp) {
    let e = 0;
    felderVon(s, sp).forEach(f => { const b = s.besitz[f]; if (b.h) e += b.h * FELDER[f].h / 2; if (!b.hy) e += FELDER[f].hy; });
    return e;
  }
  const kannBankrott = (s) => !!(s.akt && s.akt.t === 'zahlen') && s.spieler[s.akt.von].geld + erloesMoeglich(s, s.akt.von) < s.akt.betrag;

  /* ---------- Gebäude-Mangel (A8) ---------- */
  function mangelInteressenten(s, sp, art) {
    return aktive(s).filter(i => i !== sp && s.spieler[i].geld >= MIN_GEBOT &&
      KAUFBAR.some(f => s.besitz[f].von === i && !warumNichtBauen(s, i, f, false, art)));
  }
  function mangelAuktion(s, art, teilnehmer) {
    anfang(s);
    if (!verwaltenErlaubt(s)) throw fehler('Gerade nicht möglich.');
    if ((art === 'haus' ? s.bank.haeuser : s.bank.hotels) < 1) throw fehler('Die Bank hat keins mehr.');
    log(s, `Mangel: das letzte ${art === 'hotel' ? 'Hotel' : 'Haus'} wird versteigert.`);
    const zurueck = s.akt; s.akt = null;
    s.q.unshift({t: 'auktion', art, teilnehmer: teilnehmer.slice()}, ...(zurueck ? [zurueck] : []));
    laufen(s); return s;
  }
  function gutscheinFelder(s) {
    const a = s.akt; if (!a || a.t !== 'gutschein') return [];
    return KAUFBAR.filter(f => s.besitz[f].von === a.sp && !warumNichtBauen(s, a.sp, f, false, a.art));
  }
  function gutscheinSetzen(s, f) {
    anfang(s); const a = erwarte(s, 'gutschein');
    if (!gutscheinFelder(s).includes(f)) throw fehler('Dort darf das Gebäude nicht stehen.');
    setzen(s, s.besitz[f]);
    log(s, `${nm(s, a.sp)} setzt das ersteigerte ${a.art === 'hotel' ? 'Hotel' : 'Haus'} auf ${FELDER[f].n}.`);
    s.akt = null; laufen(s); return s;
  }
  function gutscheinVerzichten(s) {
    anfang(s); const a = erwarte(s, 'gutschein');
    if (gutscheinFelder(s).length) throw fehler('Es gibt noch einen erlaubten Platz.');
    s.akt = null; laufen(s); return s;
  }

  /* ---------- Hypothek bei Übernahme ---------- */
  function uebernehmen(s, wahl) {
    anfang(s); const it = erwarte(s, 'uebernahme'), P = s.spieler[it.sp], f = it.feld;
    if (wahl === 'abloesen') {
      if (P.geld < abloesePreis(f)) throw fehler(`Dir fehlen ${euro(abloesePreis(f) - P.geld)}.`);
      P.geld -= abloesePreis(f); s.besitz[f].hy = false;
      log(s, `${P.name} löst die Hypothek auf ${FELDER[f].n} sofort ab (${euro(abloesePreis(f))}).`);
      s.akt = null;
    } else if (wahl === 'zinsen') {
      s.akt = null;
      log(s, `${P.name} behält die Hypothek auf ${FELDER[f].n} und zahlt 10 % Zinsen.`);
      s.q.unshift({t: 'zahlen', von: it.sp, an: null, betrag: zinsen(f), grund: 'zinsen'});
    } else throw new Error('Wahl?');
    laufen(s); return s;
  }

  /* ---------- Bankrott ---------- */
  function bankrott(s) {
    anfang(s); const it = erwarte(s, 'zahlen');
    if (!kannBankrott(s)) throw fehler('Du kannst noch Geld beschaffen: Gebäude verkaufen oder Hypotheken aufnehmen.');
    const sp = it.von, P = s.spieler[sp], an = it.an;
    // Gebäude an die Bank (halber Preis)
    Object.keys(GRUPPEN).forEach(g => { if (GRUPPEN[g].felder.some(f => s.besitz[f].von === sp && s.besitz[f].h > 0)) P.geld += gruppeAbbauen(s, g); });
    const meine = felderVon(s, sp);
    const neu = [];
    if (an != null) {
      const G = s.spieler[an];
      G.geld += P.geld; s.anim.push({art: 'geld', von: sp, an, betrag: P.geld}); P.geld = 0;
      meine.forEach(f => { s.besitz[f].von = an; if (s.besitz[f].hy) neu.push({t: 'uebernahme', sp: an, feld: f}); });
      G.karten.push(...P.karten); P.karten = [];
      log(s, `${P.name} ist pleite. Alles geht an ${G.name}.`);
    } else {
      P.geld = 0;
      meine.forEach(f => { s.besitz[f] = {von: null, h: 0, hy: false}; neu.push({t: 'auktion', art: 'feld', feld: f}); });
      P.karten.forEach(id => s.stapel[id[0]].push(id)); P.karten = [];
      log(s, `${P.name} ist pleite. Die Grundstücke gehen an die Bank und werden versteigert.`);
    }
    P.raus = true; P.turm = false; P.rausZug = s.zug;
    s.akt = null;
    const warDran = sp === s.dran;
    if (warDran) s.q = [];
    else s.q = s.q.filter(x => x.von !== sp && x.an !== sp && x.sp !== sp);
    if (aktive(s).length <= 1) { spielEnde(s, 'bankrott'); return s; }
    s.q.unshift(...neu);
    if (warDran) s.q.push({t: 'naechster'});
    laufen(s); return s;
  }

  /* ---------- Handel ---------- */
  function handelbar(s, sp, f) {
    const F = FELDER[f], b = s.besitz[f];
    return !!(F && F.p && b.von === sp && !(F.g && gruppeBebaut(s, F.g)));
  }
  function warumNichtHandeln(s, h) {
    if (!verwaltenErlaubt(s)) return 'Erst die Versteigerung bzw. Karte abschließen.';
    const {a, b} = h;
    if (a === b || s.spieler[a] == null || s.spieler[b] == null || s.spieler[a].raus || s.spieler[b].raus) return 'Wähle zwei Personen.';
    const seiten = [[a, h.gibA || {}], [b, h.gibB || {}]];
    let etwas = false;
    for (const [sp, g] of seiten) {
      const felder = g.felder || [], karten = g.karten || [], geld = g.geld || 0;
      if (!Number.isInteger(geld) || geld < 0) return 'Ungültiger Betrag.';
      if (geld > s.spieler[sp].geld) return `${s.spieler[sp].name} hat nur ${euro(s.spieler[sp].geld)} Bargeld.`;
      for (const f of felder) if (!handelbar(s, sp, f)) return `${FELDER[f] ? FELDER[f].n : f} lässt sich so nicht handeln (Gebäude in der Gruppe?).`;
      const vorrat = s.spieler[sp].karten.slice();
      for (const k of karten) { const i = vorrat.indexOf(k); if (i < 0) return 'Diesen Schlüssel gibt es nicht.'; vorrat.splice(i, 1); }
      if (felder.length || karten.length || geld) etwas = true;
    }
    if (!etwas) return 'Es wird nichts getauscht.';
    return '';
  }
  function handeln(s, h) {
    anfang(s);
    const w = warumNichtHandeln(s, h); if (w) throw fehler(w);
    const {a, b} = h, gA = h.gibA || {}, gB = h.gibB || {};
    const neu = [];
    const geben = (von, an, g) => {
      (g.felder || []).forEach(f => { s.besitz[f].von = an; if (s.besitz[f].hy) neu.push({t: 'uebernahme', sp: an, feld: f}); });
      (g.karten || []).forEach(k => { const v = s.spieler[von].karten; v.splice(v.indexOf(k), 1); s.spieler[an].karten.push(k); });
      if (g.geld) { s.spieler[von].geld -= g.geld; s.spieler[an].geld += g.geld; }
    };
    geben(a, b, gA); geben(b, a, gB);
    log(s, `Handel zwischen ${nm(s, a)} und ${nm(s, b)} abgeschlossen.`);
    if (neu.length) { const z = s.akt; s.akt = null; s.q.unshift(...neu, ...(z ? [z] : [])); laufen(s); }
    return s;
  }

  /* ---------- Zeit und Wertung ---------- */
  function zeitPlus(s, ms) { if (!s.ende && ms > 0) s.zeit.gespielt += ms; return s; }
  const zeitAbgelaufen = s => s.zeit.limit > 0 && s.zeit.gespielt >= s.zeit.limit;
  function vermoegen(s, sp) {
    const P = s.spieler[sp];
    let grund = 0, gebaeude = 0;
    felderVon(s, sp).forEach(f => {
      const b = s.besitz[f], F = FELDER[f];
      grund += b.hy ? F.hy : F.p;
      if (b.h) gebaeude += b.h * F.h;
    });
    return {geld: P.geld, grund, gebaeude, summe: P.geld + grund + gebaeude};
  }
  function spielEnde(s, art) {
    s.akt = null; s.q = [];
    const wertung = s.spieler.map((p, i) => Object.assign({sp: i, raus: p.raus, rausZug: p.rausZug}, vermoegen(s, i)));
    let sieger;
    if (art === 'zeit') {
      const im = wertung.filter(w => !w.raus), max = Math.max(...im.map(w => w.summe));
      sieger = im.filter(w => w.summe === max).map(w => w.sp);
    } else sieger = aktive(s);
    wertung.sort((x, y) => (x.raus - y.raus) || (x.raus ? (y.rausZug - x.rausZug) : (y.summe - x.summe)));
    s.ende = {art, sieger, wertung};
    log(s, art === 'zeit' ? `Die Zeit ist um.` : `Nur noch ${nm(s, sieger[0])} ist im Spiel.`);
  }

  /* ---------- Prüfhilfe für Tests ---------- */
  function invarianten(s) {
    let h = s.bank.haeuser, ho = s.bank.hotels;
    KAUFBAR.forEach(f => { const b = s.besitz[f]; if (b.h === 5) ho++; else h += b.h;
      if (b.h && FELDER[f].t !== 'strasse') throw new Error('Gebäude auf ' + f);
      if (b.h && b.hy) throw new Error('Gebäude und Hypothek ' + f);
      if (b.von != null && s.spieler[b.von].raus) throw new Error('Besitz eines Ausgeschiedenen ' + f);
      if (b.von == null && (b.h || b.hy)) throw new Error('Bankfeld mit Gebäude/Hypothek ' + f);
    });
    if (h !== HAEUSER) throw new Error('Häuser ' + h);
    if (ho !== HOTELS) throw new Error('Hotels ' + ho);
    if (s.bank.haeuser < 0 || s.bank.hotels < 0) throw new Error('Bank negativ');
    s.spieler.forEach(p => { if (p.geld < 0) throw new Error('Geld negativ ' + p.name); if (!Number.isInteger(p.geld)) throw new Error('Geld krumm'); });
    Object.keys(GRUPPEN).forEach(g => { const st = stufen(s, g); if (Math.max(...st) - Math.min(...st) > 1) throw new Error('Ungleich gebaut ' + g); });
    const karten = s.stapel.E.length + s.stapel.G.length + s.spieler.reduce((a, p) => a + p.karten.length, 0) + (s.akt && s.akt.t === 'karte' && s.akt.id ? 1 : 0);
    if (karten !== 32) throw new Error('Karten ' + karten);
    return true;
  }

  const R = {
    FELDER, GRUPPEN, KARTEN, DECKNAME, BEGRIFFE, ausgabeSetzen, ausgabeId, KAUFBAR, BAHNHOEFE, WERKE, BAHN_MIETE,
    START_GELD, LOS_GELD, TURM_STRAFE, MIN_GEBOT, HAEUSER, HOTELS, TURM,
    euro, neu, miete, werkFaktor, hatGruppe, felderVon, aktive, zinsen, abloesePreis, mindestGebot,
    wuerfeln, turmZahlen, turmKarte, turmWuerfeln, kaufen, versteigern, zahlen, werkWuerfeln, karteOk, weiter,
    bieten, aussteigen, hausKaufen, hausVerkaufen, gruppeVerkaufen, gruppeErloes, hypothek, abloesen,
    warumNichtBauen, warumNichtVerkaufen, warumNichtHypothek, warumNichtAbloesen, verwaltenErlaubt,
    erloesMoeglich, kannBankrott, bankrott, mangelInteressenten, mangelAuktion, gutscheinFelder, gutscheinSetzen,
    gutscheinVerzichten, uebernehmen, handelbar, warumNichtHandeln, handeln, zeitPlus, zeitAbgelaufen, vermoegen,
    gruppeBebaut, invarianten
  };
  if (typeof module !== 'undefined') module.exports = R; else window.Rheinbaron = R;
})();
