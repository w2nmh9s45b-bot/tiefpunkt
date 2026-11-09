"use strict";
/* Ausgabe „Eschbach“ für Rheinbaron – die Ortsgemeinde Eschbach (VG Nastätten, Rhein-Lahn-Kreis, Blaues Ländchen).
   Recherche Stand 09.11.2026:
   - OpenStreetMap (Overpass, User-Agent spieltisch-recherche, Umkreis um 50.214 N / 7.727 O): Straßen Hauptstraße,
     Kirchgasse, Bergstraße, Talstraße, Neugasse, Im Oberdorf, An der Lück, Langhöh, Amselweg; Evangelische Kirche
     Eschbach (Kirchgasse), Freiwillige Feuerwehr Eschbach, Hotel/Restaurant „Zur Suhle“ (Talstraße), Sonjas Hairdesign,
     Schreinerei Zils, Spielplatz, Friedhof; Flurnamen Läuskaut, Kappesstücker, Königskopf (mit Hochsitzen), Hahner Feld,
     Langhöh; Naturschutzgebiet Reichelsteiner Bachtal; Stromleitung Weyer–Eschbach. https://www.openstreetmap.org
   - Wikipedia: https://de.wikipedia.org/wiki/Eschbach_(bei_Nast%C3%A4tten) (Lage, Wappen mit Göpel für Reichelsteiner
     Bach und Schafbach, Ähren, Hammer und Schlägel, Portikus; L 333/L 334; ein Hotel, drei Handwerksbetriebe)
   - regionalgeschichte.net: https://www.regionalgeschichte.net/rhein-lahn/eschbach.html (Gemeindehaus 1968/1970,
     Backhaus renoviert 1986, Dorfplatz 1994/95, Pochwerk um 1771 am Zusammenfluss der Bäche, Nassauische Kleinbahn
     ab 1903 mit Halt „Eschbacher Weg“, Strom seit 1914)
   - Ortsgemeinde: https://eschbach-rlp.de/ (Gemeindehaus An der Lück 4, Dorffest Ende August, Herbst-Arbeitseinsatz,
     Grünschnittplatz, Gemeindewald, Jagdrevier), https://eschbach-rlp.de/vereine (TV Eschbach 1973 mit Kinderturnen
     und Tischtennis im Gemeindehaus, Förderverein der Feuerwehr, Förderverein „Wir für Eschbach“),
     http://eschbach-rlp.de/sanierung-backhaus-wie-geht-es-weiter (Backes am Brunnen, denkmalgeschützt, Dorfarchiv
     darin, Brand 2018 – die Feuerwehr rettete das Archiv –, Backesfest), Bunter Abend im Gemeindehaus (Fastnacht)
   - Buslinien 541 (Nastätten–Eschbach) und 532 (Schulbus zur Loreleyschule St. Goarshausen):
     https://www.haltestellen-buslinien.de/rheinland-pfalz/eschbach/haltestelle/eschbach_nastatten_b_nastatten-4531755
   - Hotel Zur Suhle, Talstraße 2 (Balkone mit Blick ins Rheintal): https://www.booking.com/hotel/de/zur-suhle.html
   ERFUNDEN bzw. nur ortstypisch: das Dorfarchiv als „Gefängnis“ (das Archiv liegt wirklich im Backes), die
   „Mitfahrbank“ (Feld 35, in Eschbach nicht belegt), das „Trafohäuschen“ (Strom seit 1914 ist belegt, das Häuschen
   als Feld ist eine Annahme), die „Bank am Brunnen“ als Ruhefeld, „Gemeindeumlage“ und „Dorffest-Spende“ als
   Steuerfelder sowie alle Anlässe auf den Karten (freundlich ausgedacht, keine echten Personen). */
(function () {
  const A = {
    id: 'eschbach', name: 'Eschbach', reihenfolge: 1,
    spielname: 'Eschbacher Dorfbaron',
    unter: 'Kaufen, bauen, kassieren – vom Grünschnittplatz bis zur Kirche.',
    beschreibung: 'Das Heimatbrett: Backes, Gemeindehaus, Suhle und Kirche – ganz Eschbach auf einem Tisch.',
    regelnIntro: '<p>Zieht durch Eschbach – vom Grünschnittplatz über Backes und Gemeindehaus bis zur Kirche –, kauft Straßen und Plätze, baut Häuser und kassiert Miete. Wer am Ende als Einzige oder Einziger nicht pleite ist, wird Eschbacher Dorfbaron.</p>',
    begriffe: {
      start: 'Dorfplatz',
      turm: 'Dorfarchiv', imTurm: 'im Dorfarchiv', inDenTurm: 'ins Dorfarchiv', ausDemTurm: 'aus dem Dorfarchiv',
      abInTurm: 'Ab ins Dorfarchiv',
      pause: 'Bank am Brunnen', pauseText: 'Hier wird nur geschwätzt',
      schluessel: 'Archivschlüssel', schluesselMz: 'Archivschlüssel',
      bahnhof: 'Haltestelle', bahnhoefe: 'Haltestellen',
      werk: 'Häuschen', werke: 'Häuschen',
      ereignis: 'Dorfgeflüster', gemeinschaft: 'Vereinskasse',
      steuer: 'Abgabe'
    },
    gruppen: {
      braun: 'Am Ortsrand', hellblau: 'Feld & Wald', pink: 'Am Berg', orange: 'Hammer & Schere',
      rot: 'Im Tal', gelb: 'Oberdorf', gruen: 'Dorfleben', blau: 'Unterm Kirchturm'
    },
    felder: [
      {n: 'Dorfplatz'},  // 0 start
      {n: 'Grünschnittplatz', ort: 'Sammelplatz der Gemeinde für Hecken- und Rasenschnitt – hier landet, was im Dorf gestutzt wird.', trenn: 'Grün\u00adschnitt\u00adplatz'},  // 1 braun 60 €
      {trenn: 'Vereins\u00adkasse'},  // 2 gemeinschaft
      {n: 'Läuskaut', ort: 'Flurstück westlich vom Dorf mit dem wohl schönsten Namen der ganzen Gemarkung.', trenn: 'Läus\u00adkaut'},  // 3 braun 60 €
      {n: 'Gemeindeumlage', trenn: 'Gemeinde\u00adumlage'},  // 4 steuer 200 €
      {n: 'Haltestelle Eschbach', ort: 'Hier hält die Linie 541 nach Nastätten – meistens jedenfalls.', trenn: 'Halte\u00adstelle Esch\u00adbach'},  // 5 bahnhof
      {n: 'Kappesstücker', ort: 'Alte Krautäcker am südlichen Ortsrand unterhalb von An der Lück.', trenn: 'Kappes\u00adstücker'},  // 6 hellblau 100 €
      {trenn: 'Dorf\u00adgeflüster'},  // 7 ereignis
      {n: 'Hochsitz am Königskopf', ort: 'Ausguck im Jagdrevier Eschbach am bewaldeten Königskopf nordwestlich vom Dorf.', trenn: 'Hoch\u00adsitz am Königs\u00adkopf'},  // 8 hellblau 100 €
      {n: 'Reichelsteiner Bachtal', ort: 'Naturschutzgebiet im Tal des Reichelsteiner Bachs westlich vom Dorf.', trenn: 'Reichel\u00adsteiner Bach\u00adtal'},  // 9 hellblau 120 €
      {},  // 10 turm
      {n: 'Amselweg', ort: 'Ruhige Wohnstraße am Hang, gleich beim Spielplatz.', trenn: 'Amsel\u00adweg'},  // 11 pink 140 €
      {n: 'Trafohäuschen', ort: 'Seit 1914 hat Eschbach Strom – hier kommt er über die Leitung aus Weyer an.', trenn: 'Trafo\u00adhäus\u00adchen'},  // 12 werk (Strom)
      {n: 'Langhöh', ort: 'Straße am südwestlichen Ortsrand, benannt nach der Flur Langhöh.', trenn: 'Lang\u00adhöh'},  // 13 pink 140 €
      {n: 'Bergstraße', ort: 'Steil hinauf zwischen Langhöh und Ortskern – Wadentraining inklusive.', trenn: 'Berg\u00adstraße'},  // 14 pink 160 €
      {n: 'Schulbus 532', ort: 'Bringt die Eschbacher Kinder morgens zur Loreleyschule nach St. Goarshausen.', trenn: 'Schul\u00adbus 532'},  // 15 bahnhof
      {n: 'Altes Pochwerk', ort: 'Ab 1771 wurde hier am Zusammenfluss von Reichelsteiner Bach und Schafbach Erz zerkleinert.', trenn: 'Altes Poch\u00adwerk'},  // 16 orange 180 €
      {trenn: 'Vereins\u00adkasse'},  // 17 gemeinschaft
      {n: 'Schreinerei Zils', ort: 'Schreinerbetrieb im Ort – hier ist Holz in guten Händen.', trenn: 'Schrei\u00adnerei Zils'},  // 18 orange 180 €
      {n: 'Sonjas Hairdesign', ort: 'Friseursalon in der Dorfmitte, nur ein paar Schritte von der Kirche.', trenn: 'Sonjas Hair\u00addesign'},  // 19 orange 200 €
      {},  // 20 pause
      {n: 'Talstraße', ort: 'Führt aus dem Dorf hinunter zur Suhle und ins Tal.', trenn: 'Tal\u00adstraße'},  // 21 rot 220 €
      {trenn: 'Dorf\u00adgeflüster'},  // 22 ereignis
      {n: 'An der Lück', ort: 'Straße am Gemeindehaus, benannt nach der alten Flur An der Lück.'},  // 23 rot 220 €
      {n: 'Hotel Zur Suhle', ort: 'Hotel und Restaurant in der Talstraße, viele Balkone mit Blick ins Rheintal.', trenn: 'Hotel Zur Suhle'},  // 24 rot 240 €
      {n: 'Halt Eschbacher Weg', ort: 'Ab 1903 hielt hier die Nassauische Kleinbahn – heute fährt nur noch die Erinnerung.', trenn: 'Halt Esch\u00adbacher Weg'},  // 25 bahnhof
      {n: 'Neugasse', ort: 'Gasse im westlichen Ortsteil zwischen Oberdorf und Bergstraße.', trenn: 'Neu\u00adgasse'},  // 26 gelb 260 €
      {n: 'Im Oberdorf', ort: 'Der obere, nördliche Teil des Dorfes – hier sieht man am weitesten.', trenn: 'Im Ober\u00addorf'},  // 27 gelb 260 €
      {n: 'Wasserhäuschen', ort: 'Klein, aber unverzichtbar: Hier kommt das Eschbacher Wasser her.', trenn: 'Wasser\u00adhäus\u00adchen'},  // 28 werk (Wasser)
      {n: 'Feuerwehrhaus', ort: 'Heimat der Freiwilligen Feuerwehr Eschbach, die 2018 Backes und Dorfarchiv gerettet hat.', trenn: 'Feuer\u00adwehr\u00adhaus'},  // 29 gelb 280 €
      {},  // 30 abInTurm
      {n: 'Kirchgasse', ort: 'Von der Hauptstraße hinunter zu Kirche und Backes.', trenn: 'Kirch\u00adgasse'},  // 31 gruen 300 €
      {n: 'Backes am Brunnen', ort: 'Denkmalgeschütztes Backhaus am Brunnen, Heimat des Dorfarchivs und des Backesfests.', trenn: 'Backes am Brun\u00adnen'},  // 32 gruen 300 €
      {trenn: 'Vereins\u00adkasse'},  // 33 gemeinschaft
      {n: 'Gemeindehaus', ort: 'An der Lück 4: 1968 von den Eschbachern selbst gebaut, Treffpunkt für Rat, Turnen und Feste.', trenn: 'Gemeinde\u00adhaus'},  // 34 gruen 320 €
      {n: 'Mitfahrbank', ort: 'Hinsetzen, Daumen raus – nach Nastätten nimmt dich bestimmt jemand mit.', trenn: 'Mitfahr\u00adbank'},  // 35 bahnhof
      {trenn: 'Dorf\u00adgeflüster'},  // 36 ereignis
      {n: 'Hauptstraße', ort: 'Die Hauptachse durchs Dorf, vom Oberdorf bis hinunter zur Talstraße.', trenn: 'Haupt\u00adstraße'},  // 37 blau 350 €
      {n: 'Dorffest-Spende'},  // 38 steuer 100 €
      {n: 'Eschbacher Kirche', ort: 'Evangelische Kirche in der Kirchgasse, Kulturdenkmal und Mittelpunkt des Dorfes.', trenn: 'Esch\u00adbacher Kirche'}  // 39 blau 400 €
    ],
    karten: {
      E1: 'Der Duft vom Backesfest zieht dich ins Dorf. Rücke vor bis zum Dorfplatz und ziehe 200 € ein.',
      E2: 'Du hast einen Tisch in der Suhle reserviert. Rücke vor bis zum Hotel Zur Suhle. Kommst du über den Dorfplatz, ziehe 200 € ein.',
      E3: 'Die Amseln singen dich wach. Rücke vor bis zum Amselweg. Kommst du über den Dorfplatz, ziehe 200 € ein.',
      E4: 'Die Glocke ruft zum Gottesdienst. Rücke vor bis zur Eschbacher Kirche.',
      E5: 'Der 541er ist ausnahmsweise pünktlich! Rücke vor bis zur nächsten Haltestelle. Gehört sie jemandem, zahle die doppelte Miete. Ist sie frei, darfst du sie kaufen.',
      E6: 'Der Bus war schon weg – du läufst weiter. Rücke vor bis zur nächsten Haltestelle. Gehört sie jemandem, zahle die doppelte Miete. Ist sie frei, darfst du sie kaufen.',
      E7: 'Im Backes flackert das Licht. Rücke vor bis zum nächsten Häuschen. Gehört es jemandem, würfle und zahle das Zehnfache der Augen. Ist es frei, darfst du es kaufen.',
      E8: 'Termin in Nastätten. Rücke vor bis zur Haltestelle Eschbach. Kommst du über den Dorfplatz, ziehe 200 € ein.',
      E9: 'Dein Bauernbrot gewinnt beim Backesfest den ersten Preis. Ziehe 50 € ein.',
      E10: 'Du kennst jemanden mit Archivschlüssel. Du kommst aus dem Dorfarchiv frei. Behalte diese Karte, bis du sie brauchst oder verkaufst.',
      E11: 'Deine Mütze liegt noch am Brunnen. Gehe 3 Felder zurück.',
      E12: 'Beim Dorffest die Musik zu spät ausgemacht. Gehe direkt ins Dorfarchiv. Geh nicht über den Dorfplatz, ziehe keine 200 € ein.',
      E13: 'Frühjahrsputz im ganzen Dorf – alle Fassaden kriegen frische Farbe. Zahle 25 € je Haus und 100 € je Hotel.',
      E14: 'Mit dem Traktor zu flott durch die Hauptstraße. Zahle 15 € Strafe.',
      E15: 'Du richtest das Dorffest aus und gibst eine Runde aus. Zahle allen anderen je 50 €.',
      E16: 'Dein Brennholz aus dem Gemeindewald ist gut gelagert und verkauft sich prima. Ziehe 150 € ein.',
      G1: 'Der Arbeitseinsatz am Gemeindehaus ist geschafft – ab zum Feierabend! Rücke vor bis zum Dorfplatz und ziehe 200 € ein.',
      G2: 'Die Vereinskasse hat sich verzählt – zu deinen Gunsten. Ziehe 200 € ein.',
      G3: 'Beim Tischtennis im Gemeindehaus den Schläger zerlegt. Zahle 50 € für einen neuen.',
      G4: 'Deine Hühner legen wie verrückt – du verkaufst die Eier im Dorf. Ziehe 50 € ein.',
      G5: 'Die Feuerwehr hat das Dorfarchiv schon einmal gerettet – heute rettet sie dich. Du kommst aus dem Dorfarchiv frei. Behalte diese Karte, bis du sie brauchst oder verkaufst.',
      G6: 'Grünschnitt neben den Grünschnittplatz gekippt. Gehe direkt ins Dorfarchiv. Geh nicht über den Dorfplatz, ziehe keine 200 € ein.',
      G7: 'Der Erlös vom Dorffest wird verteilt. Ziehe 100 € ein.',
      G8: 'Fundsache am Brunnen: ein Zwanziger im Gras. Ziehe 20 € ein.',
      G9: 'Du hast Geburtstag – das halbe Dorf steht vor der Tür. Alle anderen schenken dir je 10 €.',
      G10: 'Dein Kürbis ist der dickste im ganzen Blauen Ländchen. Ziehe 100 € Preisgeld ein.',
      G11: 'Beim Holzmachen im Gemeindewald den Fuß verknackst. Zahle 100 € Arztkosten.',
      G12: 'Neue Turnschuhe fürs Kinderturnen beim TV Eschbach. Zahle 50 €.',
      G13: 'Du hilfst beim Brotbacken im Backes. Ziehe 25 € ein.',
      G14: 'Nach dem Winter werden die Dorfstraßen geflickt. Zahle 40 € je Haus und 115 € je Hotel.',
      G15: 'Zweiter Platz mit deiner Büttenrede beim Bunten Abend im Gemeindehaus. Ziehe 10 € ein.',
      G16: 'Eine Tante aus Weyer vererbt dir 100 €.'
    },
    design: {
      papier: '#f5efe0',     // helles Kalkweiß wie frisch geweißelte Gefache
      rand: '#24303a',       // dunkles Fachwerk-Grau
      mitte: '#14304a',      // das Blau des Blauen Ländchens (Wappenblau, nachtdunkel)
      akzent: '#e0b33c',     // Gold der Wappen-Ähren
      // Ortsplan-Motiv, ganz zart: Göpel aus Reichelsteiner Bach und Schafbach (wie im Wappen), Hauptstraße mit
      // Kirchgasse, Häuserreihen, Kirche mit Turm, Backes am Brunnen, Ackerstreifen und drei Ähren.
      mitteMotiv: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" preserveAspectRatio="none">' +
        // Ackerstreifen in den Ecken
        '<g fill="rgba(150,205,120,.05)"><path d="M0 0h230L0 210z"/><path d="M0 250L270 0h50L0 300z"/><path d="M0 345L365 0h45L0 390z"/>' +
        '<path d="M1000 1000H760l240-220z"/><path d="M1000 735L715 1000h-50l335-310z"/><path d="M1000 640L620 1000h-45l425-405z"/></g>' +
        '<g fill="rgba(224,179,60,.045)"><path d="M1000 0H800l200 190z"/><path d="M1000 240L745 0h-50l305 290z"/><path d="M0 1000h210L0 800z"/><path d="M0 750l265 250h-50L0 800z"/></g>' +
        // Bäche als Göpel
        '<g fill="none" stroke="rgba(120,180,235,.10)" stroke-linecap="round"><path d="M40 -10C140 160 300 300 455 420" stroke-width="22"/>' +
        '<path d="M1010 40C850 220 640 340 490 425" stroke-width="16"/><path d="M470 425C500 600 420 780 480 1010" stroke-width="28"/></g>' +
        // Straßen
        '<g fill="none" stroke="rgba(255,240,210,.075)" stroke-linecap="round"><path d="M120 1010C260 830 390 720 560 640S860 480 1010 390" stroke-width="20"/>' +
        '<path d="M560 640C610 720 690 790 760 1010" stroke-width="13"/><path d="M380 735C330 640 300 560 180 520" stroke-width="10"/>' +
        '<path d="M820 520C840 430 900 350 1010 300" stroke-width="10"/></g>' +
        // Häuserreihen entlang der Hauptstraße
        '<g fill="rgba(255,240,210,.06)"><rect x="250" y="800" width="46" height="34" transform="rotate(-38 273 817)"/><rect x="318" y="745" width="40" height="30" transform="rotate(-35 338 760)"/>' +
        '<rect x="420" y="700" width="44" height="32" transform="rotate(-28 442 716)"/><rect x="600" y="580" width="46" height="30" transform="rotate(-22 623 595)"/>' +
        '<rect x="700" y="540" width="40" height="30" transform="rotate(-22 720 555)"/><rect x="880" y="430" width="44" height="30" transform="rotate(-30 902 445)"/>' +
        '<rect x="640" y="760" width="38" height="30" transform="rotate(60 659 775)"/><rect x="690" y="860" width="40" height="28" transform="rotate(68 710 874)"/></g>' +
        // Kirche mit Turm und Kreuz
        '<g fill="rgba(255,240,210,.09)"><path d="M610 745h120v-60l-60-38-60 38z"/><path d="M730 745h44V640l-22-58-22 58z"/></g>' +
        '<path d="M752 582v-30M742 562h20" stroke="rgba(255,240,210,.12)" stroke-width="5" fill="none"/>' +
        // Backes mit Schornstein, Ofenbogen und Brunnen
        '<g fill="rgba(255,240,210,.08)"><path d="M215 690h105v-55l-52-34-53 34z"/><rect x="296" y="596" width="12" height="28"/></g>' +
        '<path d="M250 690v-26a18 18 0 0 1 36 0v26" fill="rgba(20,48,74,.5)"/>' +
        '<g fill="none" stroke="rgba(120,180,235,.12)" stroke-width="6"><path d="M340 690h50v-20h-50z"/><path d="M365 670v-22h12"/></g>' +
        // drei Ähren
        '<g fill="none" stroke="rgba(224,179,60,.10)" stroke-width="5" stroke-linecap="round"><path d="M820 230v-110M860 240v-125M900 230v-110"/>' +
        '<path d="M820 150l-14-14M820 150l14-14M820 175l-14-14M820 175l14-14M860 145l-14-14M860 145l14-14M860 170l-14-14M860 170l14-14M900 150l-14-14M900 150l14-14M900 175l-14-14M900 175l14-14"/></g>' +
        '</svg>',
      ecken: {
        // Dorfplatz: Pfeil auf Pflaster, daneben eine Dorflinde
        start: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 28"><path d="M4 26h52" stroke="#c9b99a" stroke-width="2" stroke-dasharray="4 2"/><path d="M44 13H10M19 4L7 13l12 9" fill="none" stroke="#c0392b" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><path d="M52 24v-8" stroke="#6b4a2f" stroke-width="2.4"/><circle cx="52" cy="11" r="7" fill="#5f9c4a" stroke="#24303a" stroke-width="1.6"/></svg>',
        // Dorfarchiv im Backes: Fachwerkhäuschen mit Schornstein und verschlossener Archivtür
        turm: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 46"><rect x="27" y="6" width="5" height="12" fill="#a8452f" stroke="#24303a" stroke-width="1.6"/><path d="M4 22L20 8l16 14z" fill="#8a3b2c" stroke="#24303a" stroke-width="2" stroke-linejoin="round"/><rect x="7" y="22" width="26" height="22" fill="#f5efe0" stroke="#24303a" stroke-width="2"/><path d="M7 30h26M14 22v22M26 22v22M7 22l7 8M33 22l-7 8" stroke="#5b3b26" stroke-width="1.6"/><rect x="15" y="31" width="10" height="13" fill="#24303a"/><circle cx="20" cy="37" r="2" fill="#e0b33c"/><path d="M20 39v2.5" stroke="#e0b33c" stroke-width="1.4"/></svg>',
        // Bank am Brunnen
        pause: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 36"><path d="M4 22h28M6 22v10M30 22v10M6 14h24" stroke="#4d7a3a" stroke-width="4" stroke-linecap="round"/><path d="M38 24h18v8H38z" fill="#c9b99a" stroke="#24303a" stroke-width="2"/><path d="M47 24V10h6" fill="none" stroke="#24303a" stroke-width="2.4" stroke-linecap="round"/><path d="M53 12c1 4 1 7 0 11" stroke="#4b9bd4" stroke-width="2.4" fill="none" stroke-linecap="round"/><path d="M40 27c4-2 8 2 14 0" stroke="#4b9bd4" stroke-width="2" fill="none"/></svg>',
        // Ab ins Dorfarchiv: Aktenordner mit Vorhängeschloss
        abInTurm: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 46"><rect x="6" y="6" width="9" height="34" rx="1.5" fill="#2f5d8a" stroke="#24303a" stroke-width="2"/><rect x="15" y="6" width="9" height="34" rx="1.5" fill="#8a3b2c" stroke="#24303a" stroke-width="2"/><rect x="24" y="6" width="9" height="34" rx="1.5" fill="#4d7a3a" stroke="#24303a" stroke-width="2"/><circle cx="10.5" cy="31" r="2" fill="#f5efe0"/><circle cx="19.5" cy="31" r="2" fill="#f5efe0"/><circle cx="28.5" cy="31" r="2" fill="#f5efe0"/><path d="M16 26v-5a5 5 0 0 1 10 0v5" fill="none" stroke="#24303a" stroke-width="2.4"/><rect x="13" y="25" width="16" height="13" rx="2" fill="#e0b33c" stroke="#24303a" stroke-width="2"/><circle cx="21" cy="31" r="1.8" fill="#24303a"/></svg>'
      }
    }
  };
  if (typeof module !== 'undefined') module.exports = A;
  else (window.RheinbaronAusgaben = window.RheinbaronAusgaben || {})[A.id] = A;
})();
