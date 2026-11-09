"use strict";
/* Ausgabe „Lahnstein“ für Rheinbaron – die Stadt Lahnstein (Rhein-Lahn-Kreis): Ober- und Niederlahnstein,
   Friedrichssegen, Lahnmündung und Burg Lahneck. Nur Daten, kein DOM, kein Netz. Format: AUSGABEN.md.

   QUELLEN (Recherche 09.11.2026)
   - Wikipedia „Lahnstein“ (Stadtgliederung, Bahn, Sehenswürdigkeiten, Feste, Vereine, Unternehmen):
     https://de.wikipedia.org/wiki/Lahnstein
   - Wikipedia „Burg Lahneck“, „Schloss Martinsburg“, „Johanniskirche (Lahnstein)“, „Wasserkraftwerk Friedrichssegen“,
     „Grube Friedrichssegen“: https://de.wikipedia.org/wiki/Burg_Lahneck · …/Martinsburg_(Lahnstein) ·
     …/Johanniskirche_(Lahnstein) · …/Wasserkraftwerk_Friedrichssegen · …/Grube_Friedrichssegen
   - OpenStreetMap (Overpass, User-Agent „spieltisch-recherche“): Straßen Stinkgäßchen, Hungergasse, Ahl,
     Erzbachstraße, Hintermauergasse, Zollgasse, Hochstraße, Kaiserplatz, Rheinpromenade; Hexenturm, Salturm,
     Bürgerturm, Pulverturm, Kihrstor, Stadthalle, Nassau-Sporkenburger Hof, Bergbau Museum Grube Friedrichssegen,
     Wasserkraftwerk Friedrichssegen, Lahnsteiner Brauerei, KD-Anleger Ober-/Niederlahnstein, Lahnmündung,
     Ruppertsklamm, Allerheiligenbergkapelle, Schleuseninsel, Rhein-Lahn-Stadion: https://www.openstreetmap.org
   - Stadt Lahnstein, BUGA 2029 (Rheinanlagen, Lahnmündung, Hafenmole, Martinsburg; neue Fuß- und Radbrücke):
     https://www.lahnstein.de/buga-2029/ · https://www.lahnstein.de/aktuelles/pressemeldungen/2026/november/
   - Visit Lahnstein (Museen: Hexenturm, Bergbaumuseum, CCO-Fastnachtsmuseum in der Martinsburg; Kur- und Heilwald):
     https://www.visit-lahnstein.de/ · https://www.visit-lahnstein.de/museen/

   ECHT: alle 28 kaufbaren Felder (Straßen, Plätze, Bauwerke, Bahnhöfe, Kraftwerk, Brauerei), Lahnbrücke,
   Zollturm (Turm von 1348 am Wirtshaus an der Lahn), Feste und Vereine in den Karten (Rhein in Flammen,
   Lahneck Live, Burgfestspiele, Bluesfestival, Martinsumzug, Fastnacht, Bergbaupfad, Volleyball in Friedrichssegen,
   Kürbisschnitzen im Jugendkulturzentrum, Baustelle Lahntalbrücke).
   ERFUNDEN bzw. NUR ORTSTYPISCH: „Bank am Leinpfad“ als Frei-Parken-Ecke, der Zollturm als Gefängnis und der
   „Zollfreischein“, die Steuerfelder „Rheinzoll“ (historisch: Zollburg Martinsburg) und „Kurtaxe“ (Lahnstein ist
   Luftkurort), die Stapelnamen „Lahngeflüster“ und „Stadtsäckel“ und alle Begebenheiten auf den Karten.
   Keine Personennamen, keine Wappen- oder Logo-Kopien; alle Bilder selbst gezeichnet.
*/
(function () {
  const W = '#6cc7d8', HELL = '#e8f1ee', GOLD = '#e9b949', ROT = '#c8423a', SCH = '#22313a';

  /* Mittelbild: stilisierter Stadtplan, Norden oben. Der Rhein fließt links nach Norden, die Lahn kommt von
     Osten (Friedrichssegen) und mündet zwischen Nieder- (oben) und Oberlahnstein (unten). Sehr geringe Deckkraft. */
  const MITTE = `<svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
<g fill="none" stroke-linecap="round" stroke-linejoin="round">
 <path d="M235 1010C270 830 225 650 268 470S300 170 255 -10" stroke="${W}" stroke-opacity=".11" stroke-width="170"/>
 <path d="M1010 318C930 296 880 392 790 384S650 300 565 352S420 452 330 438" stroke="${W}" stroke-opacity=".12" stroke-width="44"/>
 <path d="M190 900c14-8 26 8 40 0M210 760c14-8 26 8 40 0M215 600c14-8 26 8 40 0M235 300c14-8 26 8 40 0M215 140c14-8 26 8 40 0M690 352c12-7 22 7 34 0M880 328c12-7 22 7 34 0" stroke="${HELL}" stroke-opacity=".13" stroke-width="5"/>
 <path d="M322 474q22 8 30 30l4 70" stroke="${HELL}" stroke-opacity=".1" stroke-width="7"/>
 <g stroke="${HELL}" stroke-opacity=".08" stroke-width="2.5" stroke-dasharray="7 9">
  <ellipse cx="545" cy="520" rx="150" ry="96"/><ellipse cx="545" cy="522" rx="95" ry="58"/><ellipse cx="545" cy="524" rx="44" ry="26"/>
  <ellipse cx="610" cy="205" rx="160" ry="92"/><ellipse cx="610" cy="208" rx="96" ry="52"/>
  <ellipse cx="780" cy="660" rx="190" ry="120"/><ellipse cx="780" cy="664" rx="118" ry="70"/><ellipse cx="780" cy="668" rx="54" ry="30"/>
  <ellipse cx="880" cy="200" rx="120" ry="80"/>
 </g>
 <g stroke="${HELL}" stroke-opacity=".07" stroke-width="3">
  <path d="M360 560L360 860M395 560L395 840M430 575L430 820M465 600L465 800M350 600L480 600M350 650L480 650M350 700L470 700M350 750L460 750M350 800L450 800"/>
  <path d="M355 120L355 400M390 140L390 405M425 170L425 400M460 210L460 395M345 200L470 200M345 260L475 260M345 320L470 320M345 370L470 370"/>
 </g>
 <path d="M352 1000C372 840 345 700 372 560S400 300 370 160L372 0" stroke="${HELL}" stroke-opacity=".10" stroke-width="4" stroke-dasharray="14 8"/>
 <path d="M420 438l0 -60M440 446l0 -66" stroke="${HELL}" stroke-opacity=".16" stroke-width="5"/>
 <path d="M408 420q22-26 44 0" stroke="${HELL}" stroke-opacity=".16" stroke-width="5"/>
</g>
<g fill="${GOLD}" fill-opacity=".17">
 <path d="M505 520v-92l14-16 14 16v92zM533 520v-48h52v48zM585 520v-30h16v30z"/>
 <path d="M509 432h20M515 448h8" stroke="${SCH}" stroke-opacity=".5" stroke-width="3"/>
 <path d="M488 520h130v12H488z"/>
</g>
<g fill="${HELL}" fill-opacity=".14">
 <path d="M318 742v-52h12v-12h10v12h44v-12h10v12h12v52z"/>
 <path d="M318 742h88v10h-88z" fill-opacity=".1"/>
 <path d="M330 404v-46l9-16 9 16v14h40v-14l9-16 9 16v46z"/>
 <path d="M408 662v-58l7-14 7 14v58zM430 662v-58l7-14 7 14v58zM404 662h44v8h-44z"/>
 <circle cx="392" cy="602" r="11"/><path d="M381 602h22v34h-22z"/><path d="M379 596l13-14 13 14z"/>
 <path d="M596 224v-30l14-14 14 14v30z"/><path d="M606 180v-14M600 172h12" stroke="${HELL}" stroke-opacity=".2" stroke-width="3"/>
 <path d="M862 360l18-58 18 58M868 340h24M872 322h16M880 302v-10" stroke="${HELL}" stroke-opacity=".22" stroke-width="4" fill="none"/>
 <circle cx="880" cy="290" r="9" fill="none" stroke="${HELL}" stroke-opacity=".22" stroke-width="3"/>
 <path d="M228 830h46l-8 10h-30z"/><path d="M240 830v-10h14v10" fill-opacity=".1"/>
 <path d="M226 238h40l-7 9h-26z"/><path d="M238 238v-9h12v9" fill-opacity=".1"/>
</g>
<g fill="${HELL}" fill-opacity=".09">
 <path d="M700 640l14-34 14 34zM738 668l14-34 14 34zM776 630l14-34 14 34zM812 676l14-34 14 34zM850 640l14-34 14 34zM744 712l14-34 14 34zM794 724l14-34 14 34zM690 700l14-34 14 34z"/>
 <path d="M520 190l12-30 12 30zM548 214l12-30 12 30zM672 168l12-30 12 30zM690 246l12-30 12 30z"/>
</g>
<g fill="none" stroke="${GOLD}" stroke-opacity=".12" stroke-width="3">
 <path d="M960 120C930 260 975 420 940 560S960 760 930 900" stroke-dasharray="4 12"/>
 <path d="M950 300h14v14h-14zM944 600h14v14h-14z" fill="${GOLD}" fill-opacity=".1"/>
</g>
<g fill="none" stroke="${ROT}" stroke-opacity=".22" stroke-width="3">
 <circle cx="880" cy="880" r="40"/><path d="M880 828v104M828 880h104" stroke-opacity=".14"/>
 <path d="M880 836l10 34-10 6-10-6z" fill="${ROT}" fill-opacity=".22"/>
</g>
</svg>`;

  const ECKE_START = `<svg viewBox="0 0 60 32" xmlns="http://www.w3.org/2000/svg"><path d="M2 29c5-3 9 3 14 0s9 3 14 0 9 3 14 0 9 3 14 0" fill="none" stroke="#4b9bd4" stroke-width="2.6" stroke-linecap="round"/><path d="M3 13H57" stroke="${SCH}" stroke-width="3.2" stroke-linecap="round"/><path d="M5 25Q14 14 23 25Q30 16 37 25Q46 14 55 25" fill="none" stroke="${SCH}" stroke-width="2.6"/><path d="M5 13v12M23 13v12M37 13v12M55 13v12" stroke="${SCH}" stroke-width="2.4"/><path d="M52 6H14M20 2l-7 4 7 4" fill="none" stroke="${ROT}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

  const ZOLLTURM = `<rect x="11" y="15" width="18" height="29" fill="#c9b99a" stroke="${SCH}" stroke-width="2"/><path d="M8.5 16L20 2 31.5 16z" fill="#3b4a55" stroke="${SCH}" stroke-width="2" stroke-linejoin="round"/><rect x="16" y="20" width="8" height="9" rx="1" fill="${SCH}"/><path d="M18.7 20v9M21.3 20v9" stroke="#c9b99a" stroke-width="1.1"/><path d="M15.5 44v-7a4.5 4.5 0 0 1 9 0v7z" fill="${SCH}"/>`;

  const ECKE_TURM = `<svg viewBox="0 0 40 46" xmlns="http://www.w3.org/2000/svg">${ZOLLTURM}<circle cx="33" cy="33" r="5" fill="${GOLD}" stroke="${SCH}" stroke-width="1.6"/><circle cx="33" cy="33" r="2.3" fill="none" stroke="${SCH}" stroke-width="1.2"/></svg>`;

  const ECKE_PAUSE = `<svg viewBox="0 0 60 36" xmlns="http://www.w3.org/2000/svg"><path d="M2 32c5-3 9 3 14 0s9 3 14 0 9 3 14 0 9 3 14 0" fill="none" stroke="#4b9bd4" stroke-width="2.6" stroke-linecap="round"/><path d="M6 19h30M8 19v8M34 19v8M7 12h28M8 12v7M34 12v7" stroke="${SCH}" stroke-width="3" stroke-linecap="round"/><path d="M40 22h17l-3 4H43z" fill="${SCH}"/><path d="M45 22v-6h7v6" fill="#f6f0e3" stroke="${SCH}" stroke-width="1.6"/><circle cx="50" cy="7" r="4" fill="${GOLD}"/></svg>`;

  const ECKE_AB = `<svg viewBox="0 0 40 46" xmlns="http://www.w3.org/2000/svg">${ZOLLTURM}<path d="M3 40V30" stroke="${SCH}" stroke-width="2.6" stroke-linecap="round"/><path d="M3 32H38" stroke="#fff" stroke-width="4.5"/><path d="M3 32H38" stroke="${ROT}" stroke-width="4.5" stroke-dasharray="5 5"/><path d="M3 29.6H38M3 34.4H38" stroke="${SCH}" stroke-width=".8"/></svg>`;

  const A = {
    id: 'lahnstein', name: 'Lahnstein', reihenfolge: 4,
    spielname: 'Lahnsteiner Stadtbaron',
    unter: 'Kaufen, bauen, kassieren – vom Stinkgäßchen bis hinauf zur Burg Lahneck.',
    beschreibung: 'Die Stadt an der Lahnmündung: Ober- und Niederlahnstein, Friedrichssegen und Burg Lahneck.',
    regelnIntro: '<p>Zwei Flüsse, zwei Stadtteile, eine Stadt: Zieht durch Lahnstein, von den engen Gassen über Friedrichssegen bis hinauf zur Burg Lahneck, kauft Gassen, Plätze und Wahrzeichen, baut Häuser und kassiert Miete. Wer am Ende als Einzige oder Einziger nicht pleite ist, gewinnt.</p>',
    begriffe: {
      start: 'Lahnbrücke',
      turm: 'Zollturm',
      imTurm: 'im Zollturm', inDenTurm: 'in den Zollturm', ausDemTurm: 'aus dem Zollturm',
      abInTurm: 'Ab in den Zollturm',
      pause: 'Bank am Leinpfad',
      pauseText: 'Schiffe gucken, sonst nichts',
      schluessel: 'Zollfreischein', schluesselMz: 'Zollfreischeine',
      bahnhof: 'Station', bahnhoefe: 'Stationen',
      werk: 'Betrieb', werke: 'Betriebe',
      ereignis: 'Lahngeflüster', gemeinschaft: 'Stadtsäckel',
      steuer: 'Abgabe'
    },
    gruppen: {
      braun: 'Enge Gassen',
      hellblau: 'Friedrichssegen',
      pink: 'Niederlahnstein',
      orange: 'Auf den Höhen',
      rot: 'Altstadt Oberlahnstein',
      gelb: 'Stadtmitte',
      gruen: 'Am Rheinufer',
      blau: 'Über der Mündung'
    },
    felder: [
      {n: 'Lahnbrücke'},                                                                                    // 0 start
      {n: 'Stinkgäßchen', trenn: 'Stink­gäßchen', ort: 'Winzige Gasse in der Niederlahnsteiner Altstadt – der Name ist schlimmer als die Luft.'}, // 1 braun
      {trenn: 'Stadt\u00adsäckel'},                                                                                                   // 2 gemeinschaft
      {n: 'Hungergasse', trenn: 'Hunger­gasse', ort: 'Wohnstraße im Norden von Niederlahnstein – verhungert ist hier noch keiner.'},              // 3 braun
      {n: 'Rheinzoll'},                                                                                     // 4 steuer 200
      {n: 'Bahnhof Niederlahnstein', kurz: 'Bf Niederlahnstein', trenn: 'Bf Nieder­lahnstein', ort: 'Wo Lahntalbahn und rechte Rheinstrecke sich treffen.'}, // 5 bahnhof
      {n: 'Ahl', ort: 'Die alte Bergmannssiedlung im Lahntal, aus der Friedrichssegen hervorging.'},               // 6 hellblau
      {trenn: 'Lahn\u00adge\u00adflüs\u00adter'},                                                                                                   // 7 ereignis
      {n: 'Erzbachstraße', trenn: 'Erzbach­straße', ort: 'Straße durch das frühere Bergarbeiterdorf Friedrichssegen.'},                   // 8 hellblau
      {n: 'Bergbaumuseum', trenn: 'Bergbau­museum', ort: 'Grubenbilder und funkelnde Mineralien wie die Emser Tönnchen – seit 2000 in Friedrichssegen.'}, // 9 hellblau
      {n: 'Zollturm'},                                                                                      // 10 turm
      {n: 'Wirtshaus an der Lahn', ort: 'Fachwerkhaus von 1697 mit Zollturm von 1348 – Goethe kehrte hier 1774 ein.'}, // 11 pink
      {n: 'Wasserkraftwerk', trenn: 'Wasser­kraftwerk', ort: 'Seit 1909 macht es in Friedrichssegen Strom aus Lahnwasser – erst für die Grube, dann für die Stadt.'}, // 12 werk strom
      {n: 'Nassau-Sporkenburger Hof', kurz: 'Sporkenburger Hof', trenn: 'Sporken­burger Hof', ort: 'Alter Adelshof in Niederlahnstein, heute Bühne der Stadt.'}, // 13 pink
      {n: 'Johanniskirche', trenn: 'Johannis­kirche', ort: 'Älteste Emporenkirche am Mittelrhein, um 1130 auf römischen Mauern an der Lahnmündung erbaut.'}, // 14 pink
      {n: 'Bahnhof Friedrichssegen', kurz: 'Bf Friedrichssegen', trenn: 'Bf Friedrichs­segen', ort: 'Klinker und Fachwerk von 1884 – bezahlt einst von der Grube.'}, // 15 bahnhof
      {n: 'Ruppertsklamm', trenn: 'Rupperts­klamm', ort: 'Wildromantische Klamm am Rheinsteig – Kraxeln über Stock und Stein.'},                 // 16 orange
      {trenn: 'Stadt\u00adsäckel'},                                                                                                   // 17 gemeinschaft
      {n: 'Allerheiligenberg', trenn: 'Allerheiligen­berg', ort: 'Wallfahrtsort mit Kapelle hoch über Niederlahnstein und weitem Blick ins Rheintal.'}, // 18 orange
      {n: 'Kur- und Heilwald', trenn: 'Kur- und Heil­wald', ort: 'Waldbaden auf der Lahnhöhe – mit Kinderheilwald und Liegen im Grünen.'},     // 19 orange
      {n: 'Bank am Leinpfad'},                                                                              // 20 pause
      {n: 'Hintermauergasse', trenn: 'Hinter­mauer­gasse', ort: 'Gasse an der alten Stadtmauer mit dem Stadtmauerhäuschen von etwa 1700.'},      // 21 rot
      {trenn: 'Lahn\u00adge\u00adflüs\u00adter'},                                                                                                   // 22 ereignis
      {n: 'Altes Rathaus', ort: 'Fachwerkbau aus dem 15. Jahrhundert mitten in Oberlahnstein.'},                  // 23 rot
      {n: 'Hexenturm', trenn: 'Hexen­turm', ort: 'Turm der Stadtmauer von 1324, heute Museum der Stadt Lahnstein.'},                          // 24 rot
      {n: 'Bahnhof Oberlahnstein', kurz: 'Bf Oberlahnstein', trenn: 'Bf Ober­lahnstein', ort: 'Station an der rechten Rheinstrecke, mitten in der Stadt.'},           // 25 bahnhof
      {n: 'Hochstraße', trenn: 'Hoch­straße', ort: 'Die Einkaufsstraße von Oberlahnstein.'},                                              // 26 gelb
      {n: 'Kaiserplatz', trenn: 'Kaiser­platz', ort: 'Platz an der früheren Kaiser-Wilhelm-Schule, in der heute das Stadtarchiv wohnt.'},    // 27 gelb
      {n: 'Lahnsteiner Brauerei', ort: 'Hier wird aus gutem Wasser Lahnsteiner Bier.'},                       // 28 werk wasser
      {n: 'Salhofplatz', trenn: 'Salhof­platz', ort: 'Platz an den Resten des fränkischen Königshofs von 977.'},                            // 29 gelb
      {n: 'Ab in den Zollturm'},                                                                            // 30 abInTurm
      {n: 'Stadthalle', trenn: 'Stadt­halle', ort: 'Denkmalgeschützter Bau der 1970er-Jahre nahe dem Rheinufer.'},                         // 31 gruen
      {n: 'Rheinanlagen', trenn: 'Rhein­anlagen', ort: 'Grüne Uferpromenade am Rhein – flanieren, feiern, Schiffe gucken.'},                // 32 gruen
      {trenn: 'Stadt\u00adsäckel'},                                                                                                   // 33 gemeinschaft
      {n: 'Schloss Martinsburg', trenn: 'Schloss Martins­burg', ort: 'Kurmainzer Zollburg von 1298 am Rhein, heute mit Fastnachtsmuseum.'},   // 34 gruen
      {n: 'Schiffsanleger', trenn: 'Schiffs­anleger', ort: 'Hier legen die Rheinschiffe in Oberlahnstein an.'},                              // 35 bahnhof
      {trenn: 'Lahn\u00adge\u00adflüs\u00adter'},                                                                                                   // 36 ereignis
      {n: 'Lahnmündung', trenn: 'Lahn­mündung', ort: 'Wo die Lahn in den Rhein fließt – Herzstück der Bundesgartenschau 2029.'},             // 37 blau
      {n: 'Kurtaxe'},                                                                                       // 38 steuer 100
      {n: 'Burg Lahneck', ort: 'Um 1226 erbaut, thront sie mit fünfeckigem Bergfried über der Lahnmündung.'}       // 39 blau
    ],
    karten: {
      E1: 'Rückenwind auf dem Rheinradweg. Rücke vor bis zur „Lahnbrücke“ und ziehe 200 € ein.',
      E2: 'Museumstag in der Altstadt! Rücke vor bis zum Hexenturm. Kommst du über die „Lahnbrücke“, ziehe 200 € ein.',
      E3: 'Goethe kehrte 1774 hier ein – du jetzt auch. Rücke vor bis zum Wirtshaus an der Lahn. Kommst du über die „Lahnbrücke“, ziehe 200 € ein.',
      E4: 'Du willst den schönsten Blick auf die Lahnmündung. Rücke vor bis zur Burg Lahneck.',
      E5: 'Die Lahn-Eifel-Bahn wartet nicht. Rücke vor bis zur nächsten Station. Gehört sie jemandem, zahle die doppelte Miete. Ist sie frei, darfst du sie kaufen.',
      E6: 'Das Schiff tutet schon! Rücke vor bis zur nächsten Station. Gehört sie jemandem, zahle die doppelte Miete. Ist sie frei, darfst du sie kaufen.',
      E7: 'Akku leer, Krug leer. Rücke vor bis zum nächsten Betrieb. Gehört er jemandem, würfle und zahle das Zehnfache der Augen. Ist er frei, darfst du ihn kaufen.',
      E8: 'Ausflug mit dem Lahntalexpress. Rücke vor bis zum Bahnhof Niederlahnstein. Kommst du über die „Lahnbrücke“, ziehe 200 € ein.',
      E9: 'Dein Würstchenstand bei Lahneck Live war ausverkauft. Ziehe 50 € ein.',
      E10: 'Der Zöllner drückt ein Auge zu. Du kommst aus dem Zollturm frei. Behalte diesen Zollfreischein, bis du ihn brauchst oder verkaufst.',
      E11: 'Die Lahntalbrücke ist mal wieder Baustelle – Umleitung! Gehe 3 Felder zurück.',
      E12: 'Mit dem Ruderboot am Rheinzoll vorbeigeschummelt – erwischt! Gehe direkt in den Zollturm. Geh nicht über die „Lahnbrücke“, ziehe keine 200 € ein.',
      E13: 'Fachwerk will gepflegt sein: Die Altstadt bekommt frische Farbe. Zahle 25 € je Haus und 100 € je Hotel.',
      E14: 'Falsch geparkt am Salhofplatz. Zahle 15 € Verwarnungsgeld.',
      E15: 'Du wirst Prinz im Lahnsteiner Karneval und gibst eine Runde aus. Zahle allen anderen je 50 €.',
      E16: 'Deine Mineraliensammlung aus Friedrichssegen findet einen Liebhaber. Ziehe 150 € ein.',
      G1: 'Beim Martinsumzug läufst du mit der Laterne ganz vorne. Rücke vor bis zur „Lahnbrücke“ und ziehe 200 € ein.',
      G2: 'Im Stadtsäckel wurde falsch gezählt – zu deinen Gunsten. Ziehe 200 € ein.',
      G3: 'Ausgerutscht auf den nassen Steinen der Ruppertsklamm. Zahle 50 € Arztkosten.',
      G4: 'Flohmarkt in den Rheinanlagen: Deine alten Schallplatten sind weg. Ziehe 50 € ein.',
      G5: 'Der Fährmann kennt einen Schleichweg. Du kommst aus dem Zollturm frei. Behalte diesen Zollfreischein, bis du ihn brauchst oder verkaufst.',
      G6: 'Ohne Karte zu den Burgfestspielen geschlichen. Gehe direkt in den Zollturm. Geh nicht über die „Lahnbrücke“, ziehe keine 200 € ein.',
      G7: 'Dein Urlaubsgeld ist da – reicht für eine Rheinfahrt ab dem Schiffsanleger. Ziehe 100 € ein.',
      G8: 'Post vom Finanzamt – ausnahmsweise eine gute Nachricht. Ziehe 20 € ein.',
      G9: 'Du hast Geburtstag und feierst an der Lahnmündung. Alle anderen schenken dir je 10 €.',
      G10: 'Deine Lebensversicherung wird fällig – genug für ein neues Ruderboot. Ziehe 100 € ein.',
      G11: 'Beim Volleyball in Friedrichssegen den Finger verknackst. Zahle 100 € fürs Krankenhaus.',
      G12: 'Dein Kind will unbedingt zur Jungen Bühne. Zahle 50 € Kursgebühr.',
      G13: 'Du führst Gäste über den Bergbaupfad Friedrichssegen. Ziehe 25 € Honorar ein.',
      G14: 'Nach dem Rheinhochwasser werden die Uferstraßen ausgebessert. Zahle 40 € je Haus und 115 € je Hotel.',
      G15: 'Dritter Platz beim Kürbisschnitzen im Jugendkulturzentrum. Ziehe 10 € ein.',
      G16: 'Eine Tante aus Friedrichssegen vererbt dir ihr Sparbuch. Ziehe 100 € ein.'
    },
    design: {
      papier: '#f3ede0',
      rand: SCH,
      mitte: '#12303c',
      mitteMotiv: MITTE,
      akzent: GOLD,
      ecken: {start: ECKE_START, turm: ECKE_TURM, pause: ECKE_PAUSE, abInTurm: ECKE_AB}
    }
  };
  if (typeof module !== 'undefined') module.exports = A;
  else (window.RheinbaronAusgaben = window.RheinbaronAusgaben || {})[A.id] = A;
})();
