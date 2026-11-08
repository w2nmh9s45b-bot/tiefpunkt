/* Letzte Karte – reine Spielregeln, ohne DOM.
   Regelquelle (recherchiert 08.11.2026): offizielle Spielanleitung des Herstellers zum Vorbild
   (Instruction Sheet 41940, © 2008, service.mattel.com/instruction_sheets/uno basic is.pdf), Abschnitte
   Contents, Setup, Let's Play, Functions of Action Cards, Going Out, Scoring, Winning the Game.
   Regeln, wie umgesetzt:
   1. 108 Karten: je Farbe (rot, gelb, grün, blau) eine 0 und zweimal 1–9 (= 19 Zahlenkarten), je Farbe zwei
      „+2“, zwei „Richtungswechsel“, zwei „Aussetzen“; dazu 4 „Farbwahl“ und 4 „Farbwahl +4“.
   2. Jede Person bekommt 7 Karten. Die oberste Karte des Stapels beginnt die Ablage. Erste Karte:
      +2 → die Person links vom Geber zieht 2 und setzt aus. Richtungswechsel → der Geber beginnt, es geht nach rechts.
      Aussetzen → die Person links vom Geber setzt aus. Farbwahl → die Person links vom Geber wählt die Farbe und spielt.
      Farbwahl +4 → zurück in den Stapel, neu mischen, neue Karte aufdecken.
   3. Wer dran ist, legt eine Karte gleicher Farbe, gleicher Zahl oder gleichen Symbols, oder eine Farbwahl-Karte.
      Wer nicht legen kann oder nicht legen will, zieht eine Karte; passt sie, darf GENAU DIESE sofort gelegt werden,
      eine andere Handkarte nach dem Ziehen nicht. Sonst geht es weiter.
   4. Farbwahl darf immer gelegt werden. Farbwahl +4 darf nur gelegt werden, wenn man keine Karte in der FARBE der
      Ablage hat (passende Zahl/Symbol oder Farbwahl auf der Hand sind erlaubt). Das Spiel verhindert das Legen nicht –
      ein unerlaubtes +4 bleibt ohne Folgen, solange niemand zweifelt (so die Anleitung). Nur die nächste Person darf
      zweifeln: Sie sieht die Hand der legenden Person. Schuldig → die legende Person zieht 4, die zweifelnde Person
      spielt danach ihren Zug ganz normal (Auslegung nach Wortlaut „draws the 4 cards instead of you“). Unschuldig →
      die zweifelnde Person zieht 6 und setzt aus. Ohne Zweifel: 4 ziehen und aussetzen. Die gewählte Farbe bleibt.
   5. Richtungswechsel bei zwei Personen wirkt wie Aussetzen (die legende Person ist sofort wieder dran) – das ergibt
      sich aus der Grundregel, weil die Richtung bei zwei Personen keinen Unterschied macht; Aussetzen und +2 bei zwei
      Personen: die legende Person ist sofort wieder dran.
   6. Ruf „Letzte Karte!“: muss beim Legen der vorletzten Karte gerufen werden (Knopf, solange man genau zwei Karten
      hält). Wer es vergisst und erwischt wird, bevor die nächste Person ihren Zug beginnt, zieht 2 Strafkarten.
      Umsetzung am gemeinsamen Gerät: siehe Regeltext der Seite (Erwischt-Knopf auf dem Übergabebild, neutral für
      jede Person mit einer Karte; ein Fehlalarm bleibt folgenlos, wie in der Anleitung keine Strafe dafür steht).
   7. Ist der Stapel leer, wird die Ablage ohne die oberste Karte gemischt und wird neuer Stapel. Sind beide leer,
      wird nur so viel gezogen, wie da ist (Auslegung; in der Anleitung nicht geregelt).
   8. Wer die letzte Karte ablegt, gewinnt die Runde. War sie +2 oder +4, zieht die nächste Person diese Karten
      noch (sie zählen mit). Wertung: die Gewinnerin bekommt die Werte aller Karten in den anderen Händen –
      Zahlenkarten Augenwert, +2/Richtungswechsel/Aussetzen 20, Farbwahl/Farbwahl +4 je 50. Sieg ab 500 Punkten
      (Vorgabe). Option „Eine Runde“: die Rundengewinnerin gewinnt das Spiel.
   9. Erster Geber wird ausgelost (statt „höchste Karte ziehen“, gleichwertig), danach wandert das Geben nach links.
   Kartenform: {id, f:'rot'|'gelb'|'gruen'|'blau'|null, w:'0'…'9'|'aus'|'rw'|'z2'|'fw'|'z4'}. Sitzfolge = Namensfolge,
   „links“ = nächster Index. */
(function () {
  'use strict';
  const FARBEN = ['rot', 'gelb', 'gruen', 'blau'];
  const FARBNAME = {rot: 'Rot', gelb: 'Gelb', gruen: 'Grün', blau: 'Blau'};
  const WNAME = {aus: 'Aussetzen', rw: 'Richtungswechsel', z2: '+2', fw: 'Farbwahl', z4: 'Farbwahl +4'};

  function stdZufall(n) { return Math.floor(Math.random() * n); }
  function mischen(a, rnd) { for (let i = a.length - 1; i > 0; i--) { const j = rnd(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; }

  function deck() {
    const d = []; let id = 0;
    for (const f of FARBEN) {
      d.push({id: id++, f, w: '0'});
      for (let n = 1; n <= 9; n++) for (let k = 0; k < 2; k++) d.push({id: id++, f, w: String(n)});
      for (const w of ['aus', 'rw', 'z2']) for (let k = 0; k < 2; k++) d.push({id: id++, f, w});
    }
    for (let k = 0; k < 4; k++) d.push({id: id++, f: null, w: 'fw'});
    for (let k = 0; k < 4; k++) d.push({id: id++, f: null, w: 'z4'});
    return d;
  }
  const wert = k => /^\d$/.test(k.w) ? +k.w : (k.w === 'fw' || k.w === 'z4') ? 50 : 20;
  const istWild = k => k.w === 'fw' || k.w === 'z4';
  const name = k => k.f ? `${FARBNAME[k.f]} ${WNAME[k.w] || k.w}` : WNAME[k.w];

  function neu({namen, ziel = 500}, rnd = stdZufall, test = {}) {
    const z = {v: 1, namen: namen.slice(), ziel, punkte: namen.map(() => 0), runde: 0, geber: rnd(namen.length),
      log: [], verlauf: []};
    neueRunde(z, rnd, test, true);
    return z;
  }

  const n = z => z.namen.length;
  const weiter = (z, i, k = 1) => ((i + z.richtung * k) % n(z) + n(z) * 4) % n(z);
  const oben = z => z.ablage[z.ablage.length - 1];
  function melde(z, t) { z.log.push(t); if (z.log.length > 6) z.log.shift(); }

  /* Karten ziehen; mischt die Ablage (ohne oberste Karte) neu ein, wenn der Stapel leer ist. */
  function nimm(z, sp, anzahl, rnd = stdZufall) {
    const neu = [];
    for (let i = 0; i < anzahl; i++) {
      if (!z.stapel.length) {
        if (z.ablage.length <= 1) break;
        const top = z.ablage.pop();
        z.stapel = mischen(z.ablage, rnd); z.ablage = [top];
        melde(z, 'Die Ablage wird gemischt und ist der neue Stapel.');
      }
      const k = z.stapel.pop(); z.haende[sp].push(k); neu.push(k);
    }
    return neu;
  }

  function neueRunde(z, rnd = stdZufall, test = {}, erste = false) {
    if (!erste) z.geber = (z.geber + 1) % n(z);
    z.runde++;
    z.stapel = test.stapel ? test.stapel.slice() : mischen(deck(), rnd); // oben = letztes Element
    z.haende = z.namen.map(() => []);
    for (let r = 0; r < 7; r++) for (let i = 1; i <= n(z); i++) z.haende[(z.geber + i) % n(z)].push(z.stapel.pop());
    z.richtung = 1; z.ablage = []; z.log = []; z.ruf = false; z.gezogen = null; z.einKarte = null; z.z4 = null;
    z.ergebnis = null; z.phase = 'zug';
    let k = z.stapel.pop();
    while (k.w === 'z4') { z.stapel.push(k); mischen(z.stapel, rnd); k = z.stapel.pop(); melde(z, 'Farbwahl +4 als erste Karte: zurück in den Stapel.'); }
    z.ablage.push(k); z.farbe = k.f;
    const links = weiter(z, z.geber);
    if (k.w === 'fw') { z.dran = links; z.phase = 'farbeStart'; melde(z, `Farbwahl liegt oben: ${z.namen[links]} wählt die Farbe.`); }
    else if (k.w === 'z2') { nimm(z, links, 2, rnd); z.dran = weiter(z, links); melde(z, `${z.namen[links]} zieht 2 und setzt aus.`); }
    else if (k.w === 'aus') { z.dran = weiter(z, links); melde(z, `${z.namen[links]} setzt aus.`); }
    else if (k.w === 'rw') { z.richtung = -1; z.dran = z.geber; melde(z, `Richtungswechsel: ${z.namen[z.geber]} beginnt, es geht andersherum.`); }
    else z.dran = links;
    return z;
  }

  /* Passt die Karte auf die Ablage? (Farbwahl +4 gilt als legbar – die Farbpflicht prüft nur der Zweifel.) */
  function passt(z, k) {
    if (istWild(k)) return true;
    const t = oben(z);
    return k.f === z.farbe || (!istWild(t) && k.w === t.w);
  }
  /* Hätte die Person ein +4 jetzt ehrlich legen dürfen? */
  function z4Ehrlich(z, sp, ohneId) { return !z.haende[sp].some(k => k.id !== ohneId && k.f && k.f === z.farbe); }

  function kannLegen(z, id) {
    if (z.phase !== 'zug' && z.phase !== 'gezogen') return false;
    if (z.phase === 'gezogen' && id !== z.gezogen) return false;
    const k = z.haende[z.dran].find(c => c.id === id);
    return !!k && passt(z, k);
  }
  function legbare(z) { return z.haende[z.dran].filter(k => kannLegen(z, k.id)).map(k => k.id); }

  function rufen(z) {
    if (z.phase !== 'zug' && z.phase !== 'gezogen') return {ok: false, grund: 'Gerade nicht.'};
    if (z.haende[z.dran].length !== 2) return {ok: false, grund: 'Rufen musst du, wenn du deine vorletzte Karte legst – also mit zwei Karten auf der Hand.'};
    z.ruf = true; melde(z, `${z.namen[z.dran]} ruft: Letzte Karte!`);
    return {ok: true};
  }

  function farbeStart(z, f) {
    if (z.phase !== 'farbeStart' || !FARBEN.includes(f)) return {ok: false};
    z.farbe = f; z.phase = 'zug'; melde(z, `${z.namen[z.dran]} wählt ${FARBNAME[f]}.`);
    return {ok: true};
  }

  function legen(z, id, farbe, rnd = stdZufall) {
    if (!kannLegen(z, id)) return {ok: false, grund: 'Diese Karte passt nicht.'};
    const sp = z.dran, hand = z.haende[sp], k = hand.find(c => c.id === id);
    if (istWild(k) && !FARBEN.includes(farbe)) return {ok: false, grund: 'Wähle eine Farbe.'};
    const ehrlich = k.w === 'z4' ? z4Ehrlich(z, sp, id) : true;
    hand.splice(hand.indexOf(k), 1);
    z.ablage.push(k); z.farbe = k.f || farbe; z.gezogen = null;
    const gerufen = z.ruf; z.ruf = false;
    const r = {ok: true, karte: k, sp, opfer: null, gleich: false, rundeVorbei: false};
    melde(z, `${z.namen[sp]} legt ${name(k)}${istWild(k) ? ' und wählt ' + FARBNAME[z.farbe] : ''}.`);
    if (hand.length === 1) z.einKarte = {sp, gerufen};
    if (hand.length === 0) {
      // Letzte Karte: +2/+4 muss die nächste Person noch ziehen.
      if (k.w === 'z2' || k.w === 'z4') {
        const op = weiter(z, sp);
        nimm(z, op, k.w === 'z2' ? 2 : 4, rnd); r.opfer = op;
        melde(z, `${z.namen[op]} zieht noch ${k.w === 'z2' ? 2 : 4} Karten.`);
      }
      rundeWerten(z, sp); r.rundeVorbei = true; return r;
    }
    if (k.w === 'aus') { r.opfer = weiter(z, sp); z.dran = weiter(z, sp, 2); melde(z, `${z.namen[r.opfer]} setzt aus.`); }
    else if (k.w === 'rw') {
      if (n(z) === 2) { r.opfer = weiter(z, sp); z.dran = sp; melde(z, `${z.namen[r.opfer]} setzt aus.`); }
      else { z.richtung *= -1; z.dran = weiter(z, sp); }
    }
    else if (k.w === 'z2') { r.opfer = weiter(z, sp); nimm(z, r.opfer, 2, rnd); z.dran = weiter(z, sp, 2); melde(z, `${z.namen[r.opfer]} zieht 2 und setzt aus.`); }
    else if (k.w === 'z4') { r.opfer = weiter(z, sp); z.z4 = {von: sp, ehrlich, hand: hand.map(c => ({...c}))}; z.dran = r.opfer; z.phase = 'zweifel'; }
    else z.dran = weiter(z, sp);
    if (z.phase !== 'zweifel') z.phase = 'zug';
    r.gleich = z.dran === sp;
    return r;
  }

  function ziehen(z, rnd = stdZufall) {
    if (z.phase !== 'zug') return {ok: false};
    const sp = z.dran, [k] = nimm(z, sp, 1, rnd);
    if (!k) { melde(z, `${z.namen[sp]} kann nicht ziehen und passt.`); z.dran = weiter(z, sp); z.ruf = false; return {ok: true, karte: null, gleich: false}; }
    melde(z, `${z.namen[sp]} zieht eine Karte.`);
    z.phase = 'gezogen'; z.gezogen = k.id;
    return {ok: true, karte: k, passt: passt(z, k)};
  }
  /* Gezogene Karte behalten: Zug endet. */
  function behalten(z) {
    if (z.phase !== 'gezogen') return {ok: false};
    const sp = z.dran; z.phase = 'zug'; z.gezogen = null; z.ruf = false; z.dran = weiter(z, sp);
    melde(z, `${z.namen[sp]} behält die Karte.`);
    return {ok: true, gleich: z.dran === sp};
  }

  /* Antwort der nächsten Person auf ein +4: zweifeln = true/false. */
  function zweifel(z, ja, rnd = stdZufall) {
    if (z.phase !== 'zweifel') return {ok: false};
    const op = z.dran, info = z.z4; z.z4 = null; z.phase = 'zug';
    if (!ja) { nimm(z, op, 4, rnd); z.dran = weiter(z, op); melde(z, `${z.namen[op]} zieht 4 und setzt aus.`); return {ok: true, gezweifelt: false}; }
    if (!info.ehrlich) { nimm(z, info.von, 4, rnd); melde(z, `${z.namen[op]} zweifelt zu Recht: ${z.namen[info.von]} zieht 4.`);
      return {ok: true, gezweifelt: true, schuldig: true, hand: info.hand, von: info.von}; }
    nimm(z, op, 6, rnd); z.dran = weiter(z, op);
    melde(z, `${z.namen[op]} zweifelt zu Unrecht, zieht 6 und setzt aus.`);
    return {ok: true, gezweifelt: true, schuldig: false, hand: info.hand, von: info.von};
  }

  /* Die nächste Person beginnt ihren Zug: Ab jetzt kann niemand mehr erwischt werden. */
  function zugBeginnt(z) { z.einKarte = null; }
  function erwischen(z, rnd = stdZufall) {
    const e = z.einKarte; if (!e) return {ok: false};
    z.einKarte = null;
    if (e.gerufen || z.haende[e.sp].length !== 1) return {ok: true, strafe: false, sp: e.sp};
    nimm(z, e.sp, 2, rnd); melde(z, `${z.namen[e.sp]} wurde erwischt und zieht 2 Strafkarten.`);
    return {ok: true, strafe: true, sp: e.sp};
  }

  function rundeWerten(z, sieger) {
    const einzel = z.haende.map((h, i) => ({sp: i, karten: h.length, wert: i === sieger ? 0 : h.reduce((s, k) => s + wert(k), 0)}));
    const summe = einzel.reduce((s, e) => s + e.wert, 0);
    z.punkte[sieger] += summe;
    z.ergebnis = {sieger, summe, einzel};
    z.verlauf.push({runde: z.runde, sieger, summe});
    const fertig = z.ziel === 0 || z.punkte[sieger] >= z.ziel;
    z.phase = fertig ? 'spielende' : 'rundenende';
    z.ergebnis.spielSieger = fertig ? sieger : null;
    melde(z, `${z.namen[sieger]} legt die letzte Karte und bekommt ${summe} Punkte.`);
  }
  function naechsteRunde(z, rnd = stdZufall, test) { if (z.phase !== 'rundenende') return {ok: false}; neueRunde(z, rnd, test); return {ok: true}; }

  const api = {FARBEN, FARBNAME, WNAME, deck, wert, istWild, name, neu, neueRunde, naechsteRunde, passt, kannLegen, legbare,
    rufen, farbeStart, legen, ziehen, behalten, zweifel, zugBeginnt, erwischen, oben, weiter, z4Ehrlich, mischen};
  if (typeof module !== 'undefined') module.exports = api; else window.LetzteKarte = api;
})();
