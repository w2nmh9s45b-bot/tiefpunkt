/* Mau-Mau – reine Spielregeln, ohne DOM.
   Regelquelle (recherchiert 09.11.2026): Wikipedia „Mau-Mau (Kartenspiel)“, Abschnitte Spielregeln, Sonderregeln,
   Varianten. Das Spiel hat keine Herstelleranleitung; die Grundregeln sind dort als „regional unterschiedlich“
   beschrieben. Umgesetzt wird die dort genannte Grundform, die „erweiterten Varianten“ sind Optionen.
   Regeln, wie umgesetzt:
   1. 32 Karten (7, 8, 9, 10, Bube, Dame, König, Ass in Kreuz, Pik, Herz, Karo). Jede Person bekommt 5 Karten
      (Option 6 – „oft fünf oder sechs“; reichen die Karten nicht, gibt es 5). Die oberste Karte des Rests liegt offen.
   2. Wer dran ist, legt eine Karte gleicher Farbe oder gleichen Rangs. Wer nicht legen kann oder will, zieht eine
      Karte. Passt sie, darf GENAU DIESE sofort gelegt werden („darf anschließend diese Karte ablegen“) – oder man
      behält sie. Passt sie nicht, ist die nächste Person dran.
   3. 7: Die nächste Person zieht zwei Karten; danach ist ihr Zug vorbei (Auslegung: Ziehen ersetzt den Zug, wie beim
      Aussetzen). Option „Sieben weitergeben“ (in der Quelle eine erweiterte Variante): Wer eine 7 hat, darf sie
      darauflegen, dann zieht die übernächste Person 4 usw. Ohne die Option gilt: zwei ziehen, keine 7 darauf.
   4. 8: Die nächste Person setzt aus. Zu zweit ist die legende Person sofort wieder dran.
   5. Bube: passt auf jede Karte außer auf einen Buben („Bube auf Bube“ ist verboten). Wer ihn legt, wünscht sich
      eine Farbe; die nächste Person muss diese Farbe legen (oder ziehen). Der Wunsch gilt, bis eine Karte darauf liegt.
   6. Ass: ohne Wirkung. Option „Ass: noch einmal“ (erweiterte Variante der Quelle): wer ein Ass legt, legt gleich noch
      eine Karte (oder zieht).
   7. „Mau“: Wer die vorletzte Karte legt, muss vorher „Mau“ sagen, wer die letzte legt, „Mau-Mau“ (Knopf vor dem
      Legen). Vergessen = eine Strafkarte (Quelle: „ein oder zwei Strafkarten“). Am gemeinsamen Gerät bemerkt das
      Spiel den vergessenen Ruf selbst (Auslegung statt „vom Tisch bemerkt“). Wer beim Ausmachen „Mau-Mau“ vergisst,
      zieht die Strafkarte und ist damit nicht draußen. Option „ohne Mau-Ruf“ schaltet das ab.
   8. Ist der Stapel leer, wird die Ablage ohne die oberste Karte gemischt und wird neuer Stapel. Sind beide leer,
      wird nur so viel gezogen, wie da ist (Auslegung).
   9. Erste Karte: 7 → die Person nach dem Geber zieht 2 (bzw. darf weitergeben), 8 → sie setzt aus,
      Bube → sie wünscht die Farbe und spielt dann ganz normal (Auslegung; die Quelle nennt Geber oder unterste Karte).
   10. Wer die letzte Karte ablegt, gewinnt die Runde. War sie eine 7, zieht die nächste Person die Karten noch.
       Wertung (Option, Vorgabe): Die anderen schreiben die Punkte ihrer Restkarten auf – 7 bis 10 nach Augen, Bube 20
       (der Wünscher ist teuer), Dame 3, König 4, Ass 11 (Auslegung; die Quelle sagt nur, dass sich die Werte an
       anderen Spielen orientieren). Erreicht jemand 100 Punkte, endet das Spiel; es gewinnt, wer die wenigsten hat.
       Option „Bis zum ersten Sieger“: wer die erste Runde gewinnt, gewinnt das Spiel.
   11. Erster Geber wird ausgelost, danach wandert das Geben eine Person weiter. Gespielt wird in Namensfolge.
   Kartenform: {id, f:'kreuz'|'pik'|'herz'|'karo', r:'7'|'8'|'9'|'10'|'B'|'D'|'K'|'A'}. */
(function () {
  'use strict';
  const FARBEN = ['kreuz', 'pik', 'herz', 'karo'];
  const FARBNAME = {kreuz: 'Kreuz', pik: 'Pik', herz: 'Herz', karo: 'Karo'};
  const SYM = {kreuz: '♣', pik: '♠', herz: '♥', karo: '♦'};
  const RAENGE = ['7', '8', '9', '10', 'B', 'D', 'K', 'A'];
  const RNAME = {B: 'Bube', D: 'Dame', K: 'König', A: 'Ass'};
  const WERT = {'7': 7, '8': 8, '9': 9, '10': 10, B: 20, D: 3, K: 4, A: 11};
  const ZIEL = 100;
  const OPT = {sieben: 'nein', ass: 'nein', mau: 'strafe', wertung: 'punkte', hand: 5};

  function stdZufall(n) { return Math.floor(Math.random() * n); }
  function mischen(a, rnd) { for (let i = a.length - 1; i > 0; i--) { const j = rnd(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  function deck() { const d = []; let id = 0; for (const f of FARBEN) for (const r of RAENGE) d.push({id: id++, f, r}); return d; }
  const wert = k => WERT[k.r];
  const name = k => `${FARBNAME[k.f]} ${RNAME[k.r] || k.r}`;
  const kurz = k => `${RNAME[k.r] ? k.r : k.r}${SYM[k.f]}`;

  function neu({namen, opt = {}}, rnd = stdZufall) {
    const o = Object.assign({}, OPT, opt);
    o.hand = Number(o.hand) === 6 && namen.length * 6 + 1 <= 32 ? 6 : 5;
    const z = {v: 1, namen: namen.slice(), opt: o, ziel: ZIEL, punkte: namen.map(() => 0), runde: 0, geber: rnd(namen.length), log: []};
    neueRunde(z, rnd, true);
    return z;
  }
  const n = z => z.namen.length;
  const weiter = (z, i, k = 1) => (i + k) % n(z);
  const oben = z => z.ablage[z.ablage.length - 1];
  function melde(z, t) { z.log.push(t); if (z.log.length > 6) z.log.shift(); }

  function neueRunde(z, rnd = stdZufall, erste = false) {
    if (!erste) z.geber = weiter(z, z.geber);
    z.runde++;
    const d = mischen(deck(), rnd);
    z.haende = z.namen.map(() => []);
    for (let r = 0; r < z.opt.hand; r++) for (let i = 1; i <= n(z); i++) z.haende[weiter(z, z.geber, i)].push(d.pop());
    z.ablage = [d.pop()]; z.stapel = d;
    z.wunsch = null; z.zieh = 0; z.gezogen = null; z.ruf = false; z.ergebnis = null; z.log = [];
    z.dran = weiter(z, z.geber); z.phase = 'zug';
    const t = oben(z);
    if (t.r === 'B') { z.phase = 'wunschStart'; melde(z, `Oben liegt ein Bube: ${z.namen[z.dran]} wünscht die Farbe.`); }
    else if (t.r === '7') { z.zieh = 2; melde(z, `Oben liegt eine 7: ${z.namen[z.dran]} muss 2 Karten ziehen.`); }
    else if (t.r === '8') { melde(z, `Oben liegt eine 8: ${z.namen[z.dran]} setzt aus.`); z.dran = weiter(z, z.dran); }
    return z;
  }

  /* Karten ziehen; mischt die Ablage (ohne oberste Karte) neu ein, wenn der Stapel leer ist. */
  function nimm(z, sp, anzahl, rnd = stdZufall) {
    const neu = [];
    for (let i = 0; i < anzahl; i++) {
      if (!z.stapel.length) {
        if (z.ablage.length <= 1) break;
        const top = z.ablage.pop();
        z.stapel = mischen(z.ablage, rnd); z.ablage = [top];
        melde(z, 'Der Stapel war leer – die Ablage wurde gemischt.');
      }
      const k = z.stapel.pop(); z.haende[sp].push(k); neu.push(k);
    }
    return neu;
  }

  /** Passt Karte k jetzt (ohne Rücksicht auf die Phase)? */
  function passt(z, k) {
    const t = oben(z);
    if (z.zieh > 0) return z.opt.sieben === 'stapeln' && k.r === '7';
    if (k.r === 'B') return t.r !== 'B';
    if (z.wunsch) return k.f === z.wunsch;
    return k.f === t.f || k.r === t.r;
  }
  function kannLegen(z, id) {
    if (z.phase !== 'zug' && z.phase !== 'gezogen') return false;
    if (z.phase === 'gezogen' && id !== z.gezogen) return false;
    const k = z.haende[z.dran].find(c => c.id === id);
    return !!k && passt(z, k);
  }
  const legbare = z => z.haende[z.dran].filter(k => kannLegen(z, k.id));

  /* Gegenseitig: legen, ziehen, behalten, rufen, Startwunsch. Ergebnis {ok, grund?, …}. */
  function legen(z, id, wunsch = null, rnd = stdZufall) {
    if (!kannLegen(z, id)) return {ok: false, grund: 'Diese Karte passt nicht.'};
    const sp = z.dran, h = z.haende[sp], k = h.find(c => c.id === id);
    if (k.r === 'B' && !FARBEN.includes(wunsch)) return {ok: false, grund: 'Wünsch dir eine Farbe.'};
    h.splice(h.indexOf(k), 1); z.ablage.push(k);
    z.wunsch = k.r === 'B' ? wunsch : null; z.gezogen = null; z.phase = 'zug';
    const rest = h.length, gerufen = z.ruf; z.ruf = false;
    let strafe = 0;
    melde(z, `${z.namen[sp]} legt ${name(k)}${k.r === 'B' ? ` und wünscht ${FARBNAME[wunsch]}` : ''}.`);
    if (z.opt.mau === 'strafe' && rest <= 1 && !gerufen) {
      nimm(z, sp, 1, rnd); strafe = 1;
      melde(z, `${z.namen[sp]} hat „${rest === 1 ? 'Mau' : 'Mau-Mau'}“ vergessen und zieht eine Strafkarte.`);
    }
    const r = {ok: true, karte: k, sp, strafe, fertig: false};
    if (z.haende[sp].length === 0) {
      r.fertig = true;
      if (k.r === '7') { const nx = weiter(z, sp); const zahl = z.zieh + 2; nimm(z, nx, zahl, rnd); z.zieh = 0; melde(z, `${z.namen[nx]} zieht noch ${zahl} Karten.`); }
      rundeEnde(z, sp);
      return r;
    }
    if (k.r === '7') { z.zieh += 2; z.dran = weiter(z, sp); melde(z, `${z.namen[z.dran]} muss ${z.zieh} Karten ziehen.`); }
    else if (k.r === '8') { const aus = weiter(z, sp); z.dran = weiter(z, sp, 2); melde(z, `${z.namen[aus]} setzt aus.`); r.aussetzen = aus; }
    else if (k.r === 'A' && z.opt.ass === 'nochmal') { melde(z, `${z.namen[sp]} ist gleich noch einmal dran.`); r.nochmal = true; }
    else z.dran = weiter(z, sp);
    return r;
  }
  function ziehen(z, rnd = stdZufall) {
    if (z.phase !== 'zug') return {ok: false, grund: 'Gerade kann nicht gezogen werden.'};
    const sp = z.dran;
    if (z.zieh > 0) {
      const zahl = z.zieh, neu = nimm(z, sp, zahl, rnd);
      z.zieh = 0; z.ruf = false; z.dran = weiter(z, sp);
      melde(z, `${z.namen[sp]} zieht ${neu.length} Karte${neu.length === 1 ? '' : 'n'}.`);
      return {ok: true, sp, karten: neu, strafzug: true, passt: false};
    }
    const neu = nimm(z, sp, 1, rnd);
    z.ruf = false;
    if (!neu.length) { z.dran = weiter(z, sp); melde(z, `${z.namen[sp]} kann nicht ziehen und passt.`); return {ok: true, sp, karten: [], passt: false}; }
    const k = neu[0];
    if (passt(z, k)) { z.phase = 'gezogen'; z.gezogen = k.id; melde(z, `${z.namen[sp]} zieht eine Karte.`); return {ok: true, sp, karten: neu, passt: true}; }
    z.dran = weiter(z, sp); melde(z, `${z.namen[sp]} zieht eine Karte.`);
    return {ok: true, sp, karten: neu, passt: false};
  }
  function behalten(z) {
    if (z.phase !== 'gezogen') return {ok: false};
    const sp = z.dran; z.phase = 'zug'; z.gezogen = null; z.ruf = false; z.dran = weiter(z, sp);
    melde(z, `${z.namen[sp]} behält die Karte.`);
    return {ok: true, sp};
  }
  /** Ruf erlaubt, solange man 2 Karten („Mau“) oder 1 Karte („Mau-Mau“) hält und am Zug ist. */
  function rufText(z) { const l = z.haende[z.dran].length; return l === 2 ? 'Mau' : l === 1 ? 'Mau-Mau' : null; }
  function rufen(z) {
    if (z.opt.mau !== 'strafe' || (z.phase !== 'zug' && z.phase !== 'gezogen') || (z.zieh > 0 && z.opt.sieben !== 'stapeln')) return {ok: false, grund: 'Jetzt gibt es nichts zu rufen.'};
    const t = rufText(z); if (!t) return {ok: false, grund: '„Mau“ rufst du, wenn du nur noch zwei Karten hast.'};
    z.ruf = true; return {ok: true, text: t};
  }
  function wunschStart(z, f) {
    if (z.phase !== 'wunschStart' || !FARBEN.includes(f)) return {ok: false};
    z.wunsch = f; z.phase = 'zug'; melde(z, `${z.namen[z.dran]} wünscht ${FARBNAME[f]}.`);
    return {ok: true};
  }

  const handWert = h => h.reduce((s, k) => s + wert(k), 0);
  function rundeEnde(z, sieger) {
    z.phase = 'rundenende';
    const einzel = z.haende.map((h, i) => ({sp: i, wert: i === sieger ? 0 : handWert(h)}));
    const e = {sieger, einzel, spielSieger: null};
    if (z.opt.wertung === 'eine') { e.spielSieger = [sieger]; z.phase = 'spielende'; }
    else {
      einzel.forEach(x => { z.punkte[x.sp] += x.wert; });
      if (z.punkte.some(p => p >= z.ziel)) {
        const min = Math.min(...z.punkte);
        e.spielSieger = z.punkte.map((p, i) => p === min ? i : -1).filter(i => i >= 0);
        z.phase = 'spielende';
      }
    }
    z.ergebnis = e;
    melde(z, `${z.namen[sieger]} ist alle Karten los.`);
  }
  function naechsteRunde(z, rnd = stdZufall) { if (z.phase !== 'rundenende') return false; neueRunde(z, rnd); return true; }

  const X = {FARBEN, FARBNAME, SYM, RAENGE, RNAME, WERT, OPT, deck, wert, name, kurz, neu, neueRunde, weiter, oben, nimm, passt,
    kannLegen, legbare, legen, ziehen, behalten, rufen, rufText, wunschStart, handWert, naechsteRunde, mischen};
  if (typeof module !== 'undefined') module.exports = X; else window.MauMau = X;
})();
