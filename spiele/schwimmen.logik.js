/* Schwimmen – reine Spielregeln, ohne DOM.
   Regelquelle (recherchiert 09.11.2026): Wikipedia „Schwimmen (Kartenspiel)“ (auch Einunddreißig), Abschnitte
   Spielregeln, Wertung, Varianten. Ein Klassiker ohne Herstelleranleitung; umgesetzt ist die dort beschriebene Grundform.
   Regeln, wie umgesetzt:
   1. 32 Karten. Ass 11, König/Dame/Bube/10 je 10, 9/8/7 nach Augen.
   2. Der Geber gibt allen, die noch im Spiel sind, drei Karten und sich selbst zwei Dreiersätze. Er sieht nur den
      ersten Satz an und entscheidet: behalten (der zweite Satz kommt offen in die Mitte) oder tauschen (er nimmt den
      zweiten Satz blind auf, der erste kommt offen in die Mitte). Der Rest bleibt als verdeckter Stapel liegen.
      Danach beginnt die Person nach dem Geber, gespielt wird in Namensfolge.
   3. Ein Zug ist genau eines von: eine Karte mit der Mitte tauschen, alle drei Karten tauschen (zwei geht nicht),
      schieben (nichts tun) oder klopfen.
   4. Schieben alle, die noch im Spiel sind, nacheinander, werden die drei Mittelkarten beiseitegelegt und drei neue vom
      Stapel aufgedeckt. Reicht der Stapel nicht, werden die beiseitegelegten Karten gemischt darunter gelegt (Auslegung;
      die Quelle regelt den leeren Stapel nicht).
   5. Klopfen beendet die Runde: Alle anderen haben noch genau einen Zug (tauschen oder schieben), dann wird aufgedeckt.
      Es kann nur einmal je Runde geklopft werden. Option „Klopfen erst ab der zweiten Runde“ (verbreitete Hausregel):
      solange noch nicht alle einmal dran waren, darf nicht geklopft werden. Vorgabe: jederzeit.
   6. 31 Punkte („Einunddreißig“) beenden die Runde sofort, auch schon nach dem Austeilen. Ebenso „Feuer“ (drei Asse,
      Variante der Quelle, hier Vorgabe): Dann verlieren alle anderen ein Leben. Option ohne Feuer: drei Asse zählen
      wie drei gleiche Karten 30½.
   7. Wert einer Hand: die Summe der Karten einer Farbe (die beste Farbe zählt), oder 30½ für drei gleiche Ränge.
   8. Wer am Rundenende die wenigsten Punkte hat, verliert ein Leben (Hölzchen). Bei Gleichstand verlieren alle
      Gleichstehenden („alle gleichstehenden Spieler gelten als gleich“, erste Variante der Quelle, auch bei 30½).
   9. Jede Person hat drei Leben. Wer das dritte verliert, „schwimmt“ und spielt weiter; wer schwimmend noch einmal
      verliert, scheidet aus. Wer zuletzt übrig ist, gewinnt. Würden in einer Runde alle Übrigen gleichzeitig
      ausscheiden, scheidet niemand aus und es wird weitergespielt (Auslegung).
   10. Erster Geber wird ausgelost, danach gibt die nächste Person, die noch im Spiel ist.
   Kartenform: {id, f:'kreuz'|'pik'|'herz'|'karo', r:'7'|'8'|'9'|'10'|'B'|'D'|'K'|'A'}.
   leben[i]: 3 … 1 = Leben übrig, 0 = schwimmt, −1 = ausgeschieden. */
(function () {
  'use strict';
  const FARBEN = ['kreuz', 'pik', 'herz', 'karo'];
  const FARBNAME = {kreuz: 'Kreuz', pik: 'Pik', herz: 'Herz', karo: 'Karo'};
  const SYM = {kreuz: '♣', pik: '♠', herz: '♥', karo: '♦'};
  const RAENGE = ['7', '8', '9', '10', 'B', 'D', 'K', 'A'];
  const RNAME = {B: 'Bube', D: 'Dame', K: 'König', A: 'Ass'};
  const OPT = {feuer: 'an', klopfen: 'immer', leben: 3};

  function stdZufall(n) { return Math.floor(Math.random() * n); }
  function mischen(a, rnd) { for (let i = a.length - 1; i > 0; i--) { const j = rnd(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  function deck() { const d = []; let id = 0; for (const f of FARBEN) for (const r of RAENGE) d.push({id: id++, f, r}); return d; }
  const wert = k => k.r === 'A' ? 11 : ['K', 'D', 'B', '10'].includes(k.r) ? 10 : +k.r;
  const name = k => `${FARBNAME[k.f]} ${RNAME[k.r] || k.r}`;
  const kurz = k => `${k.r}${SYM[k.f]}`;

  /** Wert einer Hand: {wert, art:'feuer'|'drei'|'farbe', farbe, text} */
  function handWert(h, feuer = true) {
    if (!h || h.length !== 3) return {wert: 0, art: 'farbe', farbe: null, text: ''};
    if (h.every(k => k.r === h[0].r)) {
      if (feuer && h[0].r === 'A') return {wert: 33, art: 'feuer', farbe: null, text: 'Feuer – drei Asse'};
      return {wert: 30.5, art: 'drei', farbe: null, text: `drei gleiche (${RNAME[h[0].r] || h[0].r}) = 30½`};
    }
    let best = null;
    for (const f of FARBEN) {
      const ks = h.filter(k => k.f === f); if (!ks.length) continue;
      const s = ks.reduce((a, k) => a + wert(k), 0);
      if (!best || s > best.wert || (s === best.wert && ks.length > best.ks.length)) best = {wert: s, farbe: f, ks};
    }
    const text = `${SYM[best.farbe]} ${best.ks.map(k => wert(k)).join(' + ')}${best.ks.length > 1 ? ' = ' + best.wert : ''}`;
    return {wert: best.wert, art: 'farbe', farbe: best.farbe, text};
  }
  const zahlText = w => w === 30.5 ? '30½' : w === 33 ? 'Feuer' : String(w);

  function neu({namen, opt = {}}, rnd = stdZufall) {
    const o = Object.assign({}, OPT, opt);
    const z = {v: 1, namen: namen.slice(), opt: o, leben: namen.map(() => Number(o.leben) || 3), runde: 0,
      geber: rnd(namen.length), log: [], sieger: null};
    neueRunde(z, rnd, true);
    return z;
  }
  const n = z => z.namen.length;
  const imSpiel = (z, i) => z.leben[i] >= 0;
  const aktive = z => z.namen.map((_, i) => i).filter(i => imSpiel(z, i));
  function weiter(z, i) { for (let k = 1; k <= n(z); k++) { const j = (i + k) % n(z); if (imSpiel(z, j)) return j; } return i; }
  function melde(z, t) { z.log.push(t); if (z.log.length > 6) z.log.shift(); }
  const feuerAn = z => z.opt.feuer !== 'aus';

  function neueRunde(z, rnd = stdZufall, erste = false) {
    if (!erste) z.geber = weiter(z, z.geber);
    else if (!imSpiel(z, z.geber)) z.geber = weiter(z, z.geber);
    z.runde++;
    const d = mischen(deck(), rnd);
    z.haende = z.namen.map(() => null);
    const reihe = []; let i = z.geber; do { i = weiter(z, i); reihe.push(i); } while (i !== z.geber);
    reihe.forEach(sp => { z.haende[sp] = []; });
    for (let r = 0; r < 3; r++) reihe.forEach(sp => z.haende[sp].push(d.pop()));
    z.extra = [d.pop(), d.pop(), d.pop()];
    z.mitte = null; z.stapel = d; z.beiseite = [];
    z.dran = z.geber; z.phase = 'geberWahl'; z.geklopft = null; z.schieben = 0; z.zuege = 0; z.ergebnis = null;
    z.log = []; z.letzter = null;
    melde(z, `${z.namen[z.geber]} gibt und entscheidet über die eigenen Karten.`);
    return z;
  }
  /** Geber: true = ersten Satz behalten, false = blind den zweiten nehmen. */
  function geberWahl(z, behalten) {
    if (z.phase !== 'geberWahl') return {ok: false};
    const g = z.geber;
    if (behalten) { z.mitte = z.extra; } else { z.mitte = z.haende[g]; z.haende[g] = z.extra; }
    z.extra = null; z.phase = 'zug'; z.dran = weiter(z, g);
    melde(z, `${z.namen[g]} ${behalten ? 'behält die eigenen Karten' : 'nimmt die anderen drei Karten'}.`);
    z.letzter = {sp: g, art: behalten ? 'behalten' : 'genommen'};
    const sofort = sofortPruefen(z, aktive(z));
    return {ok: true, ende: !!sofort};
  }
  /** Prüft auf 31 / Feuer bei den genannten Personen; beendet die Runde sofort. */
  function sofortPruefen(z, wer) {
    const feuer = wer.find(i => handWert(z.haende[i], feuerAn(z)).art === 'feuer');
    if (feuer !== undefined) { rundeEnde(z, 'feuer', feuer); return 'feuer'; }
    const e = wer.find(i => handWert(z.haende[i], feuerAn(z)).wert === 31);
    if (e !== undefined) { rundeEnde(z, '31', e); return '31'; }
    return null;
  }
  const darfKlopfen = z => z.phase === 'zug' && z.geklopft === null && (z.opt.klopfen !== 'zweite' || z.zuege >= aktive(z).length);

  function zugEnde(z, sp, getauscht, rnd = stdZufall) {
    z.zuege++;
    if (getauscht) { z.schieben = 0; if (sofortPruefen(z, [sp])) return; }
    else if (z.geklopft === null) {
      z.schieben++;
      if (z.schieben >= aktive(z).length) {
        z.beiseite.push(...z.mitte);
        if (z.stapel.length < 3) { z.stapel = mischen(z.beiseite.splice(0), rnd).concat(z.stapel); }
        z.mitte = [z.stapel.pop(), z.stapel.pop(), z.stapel.pop()];
        z.schieben = 0;
        melde(z, 'Alle haben geschoben – drei neue Karten liegen in der Mitte.');
        z.neueMitte = (z.neueMitte || 0) + 1;
      }
    }
    z.dran = weiter(z, sp);
    if (z.geklopft !== null && z.dran === z.geklopft) rundeEnde(z, 'klopfen', z.geklopft);
  }
  function tauschen(z, hi, mi) {
    if (z.phase !== 'zug' || !(hi >= 0 && hi < 3) || !(mi >= 0 && mi < 3)) return {ok: false, grund: 'Tippe eine eigene Karte und eine Karte der Mitte an.'};
    const sp = z.dran, h = z.haende[sp];
    const a = h[hi], b = z.mitte[mi]; h[hi] = b; z.mitte[mi] = a;
    melde(z, `${z.namen[sp]} tauscht ${name(a)} gegen ${name(b)}.`);
    z.letzter = {sp, art: 'eine', gab: a.id, nahm: b.id};
    zugEnde(z, sp, true);
    return {ok: true, sp};
  }
  function tauschenAlle(z) {
    if (z.phase !== 'zug') return {ok: false};
    const sp = z.dran, h = z.haende[sp];
    z.haende[sp] = z.mitte; z.mitte = h;
    melde(z, `${z.namen[sp]} tauscht alle drei Karten.`);
    z.letzter = {sp, art: 'alle'};
    zugEnde(z, sp, true);
    return {ok: true, sp};
  }
  function schieben(z, rnd = stdZufall) {
    if (z.phase !== 'zug') return {ok: false};
    const sp = z.dran; melde(z, `${z.namen[sp]} schiebt.`);
    z.letzter = {sp, art: 'schieben'};
    zugEnde(z, sp, false, rnd);
    return {ok: true, sp};
  }
  function klopfen(z) {
    if (!darfKlopfen(z)) return {ok: false, grund: z.geklopft !== null ? 'Es wurde schon geklopft.' : 'Klopfen geht erst, wenn alle einmal dran waren.'};
    const sp = z.dran; z.geklopft = sp; melde(z, `${z.namen[sp]} klopft – alle anderen haben noch einen Zug.`);
    z.letzter = {sp, art: 'klopfen'};
    z.zuege++; z.dran = weiter(z, sp);
    if (z.dran === sp) rundeEnde(z, 'klopfen', sp);
    return {ok: true, sp};
  }

  function rundeEnde(z, grund, wer) {
    const dabei = aktive(z), werte = z.namen.map((_, i) => imSpiel(z, i) ? handWert(z.haende[i], feuerAn(z)) : null);
    let verlierer;
    if (grund === 'feuer') verlierer = dabei.filter(i => i !== wer);
    else { const min = Math.min(...dabei.map(i => werte[i].wert)); verlierer = dabei.filter(i => werte[i].wert === min); }
    const vorher = z.leben.slice();
    verlierer.forEach(i => { z.leben[i]--; });
    let gerettet = false;
    if (!aktive(z).length) { verlierer.forEach(i => { if (z.leben[i] < 0) z.leben[i] = 0; }); gerettet = true; }
    const raus = verlierer.filter(i => z.leben[i] < 0), schwimmt = verlierer.filter(i => z.leben[i] === 0 && vorher[i] > 0);
    const rest = aktive(z);
    z.ergebnis = {grund, wer, werte, verlierer, raus, schwimmt, vorher, gerettet};
    z.phase = rest.length <= 1 ? 'spielende' : 'rundenende';
    if (z.phase === 'spielende') z.sieger = rest[0];
    z.extra = null;
    melde(z, grund === 'feuer' ? `Feuer! ${z.namen[wer]} hat drei Asse.` : grund === '31' ? `${z.namen[wer]} hat 31!` : 'Aufdecken!');
  }
  function naechsteRunde(z, rnd = stdZufall) { if (z.phase !== 'rundenende') return false; neueRunde(z, rnd); return true; }

  const X = {FARBEN, FARBNAME, SYM, RAENGE, RNAME, OPT, deck, wert, name, kurz, handWert, zahlText, neu, neueRunde, weiter,
    aktive, imSpiel, geberWahl, tauschen, tauschenAlle, schieben, klopfen, darfKlopfen, naechsteRunde, mischen};
  if (typeof module !== 'undefined') module.exports = X; else window.Schwimmen = X;
})();
