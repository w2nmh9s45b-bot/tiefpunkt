/* Poker – No-Limit Texas Hold'em für 2–8 Personen an einem Gerät. Reine Spielregeln ohne DOM.

   REGELQUELLEN
   - Robert's Rules of Poker (R. Ciaffone), Abschnitte „Texas Hold'em“, „No-Limit and Pot-Limit“, „Showdown“, „Split Pots“.
   - Poker TDA Rules 2024 (Tournament Directors Association): Regel 43–47 (Wetten/Erhöhen), Regel 16 (All-in: alle Hände
     werden aufgedeckt, sobald keine Setzrunde mehr folgen kann), Regel 15 (Reihenfolge beim Showdown), Regel 20 (Restchips).
   - Deutsche Begriffe: Schieben (Check), Mitgehen (Call), Setzen (Bet), Erhöhen (Raise), Passen (Fold).

   UMSETZUNG / AUSLEGUNGEN
   1. Blinds: Small Blind links vom Dealer-Button, Big Blind links davon. Heads-up (2 Spieler): der Button setzt den Small
      Blind und spricht vor dem Flop zuerst, nach dem Flop zuletzt (Robert's Rules „Heads-up“).
   2. Kann ein Blind nicht voll gesetzt werden, geht der Spieler mit dem Rest All-in. Mitgehen kostet trotzdem den vollen
      Big Blind (Robert's Rules, No-Limit Nr. 6).
   3. Mindesteinsatz = Big Blind der aktuellen Stufe. Mindesterhöhung = Größe der letzten vollen Erhöhung der laufenden
      Setzrunde (vor dem Flop: Big Blind). Keine Obergrenze außer dem eigenen Stapel (No Limit).
   4. Ein All-in unterhalb einer vollen Erhöhung erhöht den zu zahlenden Betrag, öffnet die Setzrunde aber NICHT für Spieler,
      die schon gehandelt haben; sie dürfen nur mitgehen oder passen. Mehrere kurze All-ins zusammen öffnen wieder, sobald
      sie seit der letzten eigenen Handlung des Spielers mindestens eine volle Erhöhung ergeben (TDA Regel 47).
   5. Gibt es keine Gegenspieler mehr, die noch handeln können (alle anderen All-in), darf nicht mehr erhöht werden.
   6. Nebentöpfe: nach Einsatzhöhen gestaffelt; berechtigt ist nur, wer bis zur jeweiligen Stufe beigetragen hat und nicht
      gepasst hat. Ein Topf mit nur einem Berechtigten (nicht gedeckter Einsatz) geht an ihn zurück.
   7. Showdown-Reihenfolge: Hat es in der letzten Setzrunde einen Einsatz gegeben, zeigt der letzte Setzer/Erhöher zuerst,
      sonst der erste noch beteiligte Spieler links vom Button; danach im Uhrzeigersinn. Wer keinen Topf mehr gewinnen oder
      teilen kann, darf seine Karten verdeckt wegwerfen (Option „alle Karten zeigen“ zeigt trotzdem alles).
      Steht niemand mehr zum Handeln (All-in-Situation), werden sofort alle Hände aufgedeckt, dann wird ausgeteilt (TDA 16);
      ist am Ende jemand All-in, werden beim Showdown ebenfalls alle beteiligten Hände gezeigt.
   8. Handbewertung: beste 5 aus 7 Karten; Rangfolge Royal Flush > Straight Flush > Vierling > Full House > Flush > Straße >
      Drilling > Zwei Paare > Paar > Höchste Karte; Kicker entscheiden; Farben haben keinen Rang; A-2-3-4-5 ist die
      niedrigste Straße. Gleich gute Hände teilen den Topf.
   9. Restchips beim Teilen (kleinste Einheit 1 Chip) gehen einzeln an die Gewinner, beginnend beim ersten Gewinner links
      vom Button (Robert's Rules „Split Pots“, TDA 20).
  10. Vor Flop, Turn und River wird je eine Karte verbrannt.
  11. Button-Weitergabe: Der Button wandert zum nächsten Spieler, der noch Chips hat („bewegter Button“ wie im Heimspiel;
      die Turnierregel „Dead Button“ wird bewusst nicht nachgebildet).
  12. Steigende Blinds (Option): alle N Hände eine Stufe höher, Faktoren 1, 2, 3, 4, 6, 8, 10, 15, 20, 30, 40, 50, 60, 80, 100 …
  13. Wer keine Chips mehr hat, scheidet aus. Scheiden mehrere in derselben Hand aus, bekommt den besseren Platz, wer die
      Hand mit mehr Chips begonnen hat. Wer am Ende alle Chips hat, gewinnt.
*/
"use strict";
const Poker = (function () {
  const RAENGE = '23456789TJQKA';
  const FARBEN = ['c', 'd', 'h', 's'];
  const FAKTOREN = [1, 2, 3, 4, 6, 8, 10, 15, 20, 30, 40, 50, 60, 80, 100, 150, 200, 300, 400, 500];
  const HANDNAMEN = ['Höchste Karte', 'Paar', 'Zwei Paare', 'Drilling', 'Straße', 'Flush', 'Full House', 'Vierling', 'Straight Flush', 'Royal Flush'];
  const RTEXT = {2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7', 8: '8', 9: '9', 10: '10', 11: 'B', 12: 'D', 13: 'K', 14: 'A'};
  const RNAME_PL = {2: 'Zweien', 3: 'Dreien', 4: 'Vieren', 5: 'Fünfen', 6: 'Sechsen', 7: 'Siebenen', 8: 'Achten', 9: 'Neunen', 10: 'Zehnen',
    11: 'Buben', 12: 'Damen', 13: 'Könige', 14: 'Asse'};
  const RNAME = {2: 'Zwei', 3: 'Drei', 4: 'Vier', 5: 'Fünf', 6: 'Sechs', 7: 'Sieben', 8: 'Acht', 9: 'Neun', 10: 'Zehn',
    11: 'Bube', 12: 'Dame', 13: 'König', 14: 'Ass'};

  const zufallStd = n => Math.floor(Math.random() * n);
  const wert = k => RAENGE.indexOf(k[0]) + 2;
  function neuesDeck() { const d = []; for (const f of FARBEN) for (const r of RAENGE) d.push(r + f); return d; }
  function mischen(a, rnd) { for (let i = a.length - 1; i > 0; i--) { const j = rnd(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; }

  /* ---------- Handbewertung ---------- */
  function bewerte5(k) {
    const w = k.map(wert).sort((a, b) => b - a);
    const fl = k.every(c => c[1] === k[0][1]);
    const z = {}; w.forEach(x => z[x] = (z[x] || 0) + 1);
    const g = Object.keys(z).map(x => [z[x], +x]).sort((a, b) => b[0] - a[0] || b[1] - a[1]);
    const u = [...new Set(w)];
    let str = 0;
    if (u.length === 5) { if (u[0] - u[4] === 4) str = u[0]; else if (u[0] === 14 && u[1] === 5) str = 5; }
    if (str && fl) return str === 14 ? [9, 14] : [8, str];
    if (g[0][0] === 4) return [7, g[0][1], g[1][1]];
    if (g[0][0] === 3 && g[1][0] === 2) return [6, g[0][1], g[1][1]];
    if (fl) return [5, ...w];
    if (str) return [4, str];
    if (g[0][0] === 3) return [3, g[0][1], g[1][1], g[2][1]];
    if (g[0][0] === 2 && g[1][0] === 2) return [2, g[0][1], g[1][1], g[2][1]];
    if (g[0][0] === 2) return [1, g[0][1], g[1][1], g[2][1], g[3][1]];
    return [0, ...w];
  }
  function vergleich(a, b) { for (let i = 0; i < Math.max(a.length, b.length); i++) { const d = (a[i] || 0) - (b[i] || 0); if (d) return d; } return 0; }
  function teilmengen(arr, k, ab = 0, akt = [], aus = []) {
    if (akt.length === k) { aus.push(akt.slice()); return aus; }
    for (let i = ab; i <= arr.length - (k - akt.length); i++) { akt.push(arr[i]); teilmengen(arr, k, i + 1, akt, aus); akt.pop(); }
    return aus;
  }
  function besteHand(karten) {
    let best = null, bestK = null;
    for (const c of (karten.length <= 5 ? [karten.slice()] : teilmengen(karten, 5))) {
      const r = bewerte5(c); if (!best || vergleich(r, best) > 0) { best = r; bestK = c; }
    }
    return {rang: best, karten: bestK, name: handName(best)};
  }
  function handName(r) {
    if (!r) return '';
    const t = x => RTEXT[x];
    switch (r[0]) {
      case 9: return 'Royal Flush';
      case 8: return `Straight Flush bis ${RNAME[r[1]]}`;
      case 7: return `Vierling ${RNAME_PL[r[1]]} · Kicker ${t(r[2])}`;
      case 6: return `Full House · ${RNAME_PL[r[1]]} und ${RNAME_PL[r[2]]}`;
      case 5: return `Flush · ${r.slice(1).map(t).join(' ')}`;
      case 4: return `Straße bis ${RNAME[r[1]]}`;
      case 3: return `Drilling ${RNAME_PL[r[1]]} · Kicker ${t(r[2])} ${t(r[3])}`;
      case 2: return `Zwei Paare · ${RNAME_PL[r[1]]} und ${RNAME_PL[r[2]]} · Kicker ${t(r[3])}`;
      case 1: return `Paar ${RNAME_PL[r[1]]} · Kicker ${r.slice(2).map(t).join(' ')}`;
      default: return `Höchste Karte ${RNAME[r[1]]} · ${r.slice(2).map(t).join(' ')}`;
    }
  }

  /* ---------- Blinds ---------- */
  function blinds(S) {
    const f = FAKTOREN[Math.min(S.stufe, FAKTOREN.length - 1)];
    return {sb: S.opt.sb * f, bb: S.opt.bb * f};
  }

  /* ---------- Sitzordnung ---------- */
  const n = S => S.spieler.length;
  function naechster(S, i, test) { for (let k = 1; k <= n(S); k++) { const j = (i + k) % n(S); if (test(j)) return j; } return -1; }
  const mitChips = S => i => !S.spieler[i].raus;
  const imSpiel = S => i => S.ph[i] && (S.ph[i].status === 'aktiv' || S.ph[i].status === 'allin');
  const handelnd = S => i => S.ph[i] && S.ph[i].status === 'aktiv';

  /* ---------- Spiel anlegen ---------- */
  function neuesSpiel({namen, farben = [], startChips = 1000, sb = 5, bb = 10, steigen = 0, zeigen = 'regel'}, rnd = zufallStd) {
    const S = {
      v: 1, spieler: namen.map((name, i) => ({name, farbe: farben[i] || '#8fd3d1', chips: startChips, raus: false, platz: 0})),
      opt: {startChips, sb, bb, steigen, zeigen}, handNr: 0, stufe: 0, button: -1, sbIdx: -1, bbIdx: -1,
      deck: [], board: [], verbrannt: [], ph: [], phase: 'start', amZug: -1, hoechst: 0, erh: 0, aggressor: -1,
      laufen: false, aufgedeckt: false, ergebnis: null, log: [], sieger: -1
    };
    // Der erste Button wird ausgelost; neueHand schiebt ihn eins weiter, deshalb einen Platz davor starten.
    S.button = (rnd(namen.length) - 1 + namen.length) % namen.length;
    neueHand(S, rnd);
    return S;
  }

  function setze(S, i, betrag) {
    const p = S.ph[i], sp = S.spieler[i];
    const b = Math.min(betrag, sp.chips);
    sp.chips -= b; p.einsatz += b; p.gesamt += b;
    if (sp.chips === 0) p.status = 'allin';
    return b;
  }

  function neueHand(S, rnd = zufallStd) {
    const aktive = S.spieler.map((_, i) => i).filter(mitChips(S));
    if (aktive.length < 2) { S.phase = 'ende'; S.sieger = aktive[0] ?? -1; return S; }
    S.handNr++;
    if (S.opt.steigen > 0) S.stufe = Math.floor((S.handNr - 1) / S.opt.steigen);
    S.button = naechster(S, S.button, mitChips(S));
    const zwei = aktive.length === 2;
    S.sbIdx = zwei ? S.button : naechster(S, S.button, mitChips(S));
    S.bbIdx = naechster(S, S.sbIdx, mitChips(S));
    S.deck = mischen(neuesDeck(), rnd);
    S.board = []; S.verbrannt = []; S.ergebnis = null; S.laufen = false; S.aufgedeckt = false; S.log = [];
    S.startChips = S.spieler.map(s => s.chips);
    S.ph = S.spieler.map(s => s.raus ? null : {karten: [], einsatz: 0, gesamt: 0, status: 'aktiv', stand: null, letzte: ''});
    for (let r = 0; r < 2; r++) { let i = S.sbIdx; do { if (S.ph[i]) S.ph[i].karten.push(S.deck.pop()); i = (i + 1) % n(S); } while (i !== S.sbIdx); }
    const {sb, bb} = blinds(S);
    S.blinds = {sb, bb};
    const a = setze(S, S.sbIdx, sb); S.ph[S.sbIdx].letzte = `Small Blind ${a}`;
    const b = setze(S, S.bbIdx, bb); S.ph[S.bbIdx].letzte = `Big Blind ${b}`;
    S.log.push(`${S.spieler[S.sbIdx].name} setzt Small Blind ${a}`, `${S.spieler[S.bbIdx].name} setzt Big Blind ${b}`);
    S.hoechst = bb; S.erh = bb; S.aggressor = -1;
    S.phase = 'preflop';
    S.amZug = naechster(S, S.bbIdx, handelnd(S));
    pruefen(S);
    return S;
  }

  /* ---------- Was darf der Spieler am Zug? ---------- */
  function topf(S) { return S.ph.reduce((s, p) => s + (p ? p.gesamt : 0), 0); }
  function moeglich(S) {
    const i = S.amZug; if (i < 0 || !S.ph[i] || S.ph[i].status !== 'aktiv') return null;
    const p = S.ph[i], chips = S.spieler[i].chips;
    const zuZahlen = S.hoechst - p.einsatz;
    const andereHandelnd = S.ph.some((q, j) => j !== i && q && q.status === 'aktiv');
    const offen = p.stand === null || S.hoechst - p.stand >= S.erh;
    const m = {
      spieler: i, zuZahlen: Math.min(zuZahlen, chips), schieben: zuZahlen <= 0, passen: zuZahlen > 0,
      mitgehen: zuZahlen > 0, mitgehenAllin: zuZahlen > 0 && chips <= zuZahlen, setzen: null, istEinsatz: S.hoechst === 0,
      allinBetrag: p.einsatz + chips, topf: topf(S)
    };
    if (chips > zuZahlen && andereHandelnd && offen) {
      const max = p.einsatz + chips;
      const minZiel = S.hoechst === 0 ? S.blinds.bb : S.hoechst + S.erh;
      m.setzen = {min: Math.min(minZiel, max), max};
    }
    return m;
  }
  // Vorschläge für den Regler: Mindest-, Topf-Bruchteile, All-in. Werte als "erhöhen/setzen auf"
  function schnellwerte(S) {
    const m = moeglich(S); if (!m || !m.setzen) return [];
    const p = S.ph[S.amZug];
    const nach = topf(S) + (S.hoechst - p.einsatz);
    const roh = [['Mindest', m.setzen.min], ['½ Topf', S.hoechst + Math.round(nach / 2)], ['¾ Topf', S.hoechst + Math.round(nach * 3 / 4)],
      ['Topf', S.hoechst + nach], ['All-in', m.setzen.max]];
    const aus = [], gesehen = new Set();
    for (const [t, v] of roh) {
      const w = Math.max(m.setzen.min, Math.min(m.setzen.max, v));
      if (gesehen.has(w) && t !== 'All-in') continue;
      if (t === 'All-in') { const idx = aus.findIndex(a => a.wert === w); if (idx >= 0) aus.splice(idx, 1); }
      gesehen.add(w); aus.push({text: t, wert: w});
    }
    return aus;
  }

  /* ---------- Aktion ausführen ---------- */
  function aktion(S, {art, betrag}) {
    const m = moeglich(S); if (!m) return {ok: false, grund: 'Niemand ist am Zug.'};
    const i = m.spieler, p = S.ph[i], sp = S.spieler[i];
    let text = '';
    if (art === 'passen') {
      if (!m.passen) return {ok: false, grund: 'Du kannst schieben – passen ist nicht nötig.'};
      p.status = 'passt'; text = 'passt';
    } else if (art === 'schieben') {
      if (!m.schieben) return {ok: false, grund: 'Es liegt ein Einsatz – schieben geht nicht.'};
      text = 'schiebt';
    } else if (art === 'mitgehen') {
      if (!m.mitgehen) return {ok: false, grund: 'Es gibt nichts zum Mitgehen.'};
      const b = setze(S, i, S.hoechst - p.einsatz);
      text = p.status === 'allin' ? `geht mit ${b} (All-in)` : `geht mit ${b}`;
    } else if (art === 'setzen' || art === 'allin') {
      let ziel = art === 'allin' ? p.einsatz + sp.chips : Math.floor(betrag);
      if (art === 'allin' && !m.setzen) {
        // All-in ohne Erhöhungsrecht = Mitgehen mit allem, was man hat (nur wenn der Stapel nicht reicht)
        if (m.mitgehen && sp.chips <= S.hoechst - p.einsatz) return aktion(S, {art: 'mitgehen'});
        return {ok: false, grund: 'Erhöhen ist hier nicht erlaubt.'};
      }
      if (!m.setzen) return {ok: false, grund: 'Erhöhen ist hier nicht erlaubt.'};
      if (ziel < m.setzen.min || ziel > m.setzen.max) return {ok: false, grund: `Erlaubt sind ${m.setzen.min} bis ${m.setzen.max}.`};
      const war = S.hoechst, warEinsatz = S.hoechst === 0;
      setze(S, i, ziel - p.einsatz);
      const inc = ziel - war;
      if (inc >= S.erh) S.erh = inc;
      S.hoechst = ziel; S.aggressor = i;
      const allin = p.status === 'allin';
      text = (warEinsatz ? `setzt ${ziel}` : `erhöht auf ${ziel}`) + (allin ? ' (All-in)' : '');
    } else return {ok: false, grund: 'Unbekannte Aktion.'};
    p.stand = S.hoechst;
    p.letzte = text.charAt(0).toUpperCase() + text.slice(1);
    S.log.push(`${sp.name} ${text}`);
    weiter(S);
    return {ok: true, text};
  }

  function rundeFertig(S) {
    const akt = S.ph.map((p, j) => j).filter(handelnd(S));
    if (akt.length === 0) return true;
    if (akt.length === 1) return S.ph[akt[0]].einsatz >= S.hoechst;
    return akt.every(j => S.ph[j].stand !== null && S.ph[j].einsatz === S.hoechst);
  }

  function weiter(S) {
    const live = S.ph.map((p, j) => j).filter(imSpiel(S));
    if (live.length === 1) { auszahlen(S, live[0]); return; }
    if (!rundeFertig(S)) {
      S.amZug = naechster(S, S.amZug, j => S.ph[j] && S.ph[j].status === 'aktiv' && (S.ph[j].stand === null || S.ph[j].einsatz < S.hoechst));
      return;
    }
    naechsteStrasseVorbereiten(S);
  }
  // Prüft nach dem Austeilen/Blinds, ob überhaupt jemand handeln muss
  function pruefen(S) {
    const m = S.amZug >= 0 ? S.ph[S.amZug] : null;
    if (m && m.status === 'aktiv' && !rundeFertig(S)) return;
    if (!m && !rundeFertig(S)) { S.amZug = naechster(S, S.bbIdx, handelnd(S)); return; }
    naechsteStrasseVorbereiten(S);
  }

  function naechsteStrasseVorbereiten(S) {
    S.ph.forEach(p => { if (p) { p.einsatz = 0; p.stand = null; } });
    S.hoechst = 0; S.erh = S.blinds.bb; S.amZug = -1;
    const akt = S.ph.map((p, j) => j).filter(handelnd(S));
    if (S.phase === 'river') { showdown(S); return; }
    if (akt.length <= 1) {
      // Niemand kann mehr setzen: alle Hände aufdecken, Board läuft aus (UI ruft naechsteStrasse mit Pause auf)
      S.laufen = true; S.aufgedeckt = true; S.aggressorRiver = -1;
      return;
    }
    S.aggressor = -1;
    austeilen(S);
    S.amZug = naechster(S, S.button, handelnd(S));
  }
  function austeilen(S) {
    S.verbrannt.push(S.deck.pop());
    if (S.phase === 'preflop') { S.board.push(S.deck.pop(), S.deck.pop(), S.deck.pop()); S.phase = 'flop'; S.log.push('Flop'); }
    else if (S.phase === 'flop') { S.board.push(S.deck.pop()); S.phase = 'turn'; S.log.push('Turn'); }
    else if (S.phase === 'turn') { S.board.push(S.deck.pop()); S.phase = 'river'; S.log.push('River'); }
  }
  // Nur im Lauf (All-in): eine Straße weiter; am Ende Showdown
  function naechsteStrasse(S) {
    if (!S.laufen) return S;
    if (S.phase === 'river') { S.laufen = false; showdown(S); return S; }
    austeilen(S);
    return S;
  }

  /* ---------- Töpfe ---------- */
  function toepfe(S) {
    const beitrag = S.ph.map(p => p ? p.gesamt : 0);
    const lebt = j => S.ph[j] && (S.ph[j].status === 'aktiv' || S.ph[j].status === 'allin');
    const liste = [];
    for (;;) {
      const offen = beitrag.map((b, j) => j).filter(j => lebt(j) && beitrag[j] > 0);
      if (!offen.length) break;
      const m = Math.min(...offen.map(j => beitrag[j]));
      let betrag = 0;
      beitrag.forEach((b, j) => { const t = Math.min(b, m); betrag += t; beitrag[j] -= t; });
      liste.push({betrag, berechtigt: offen});
    }
    const rest = beitrag.reduce((a, b) => a + b, 0);
    if (rest && liste.length) liste[liste.length - 1].betrag += rest;
    // gleiche Berechtigtenkreise zusammenlegen
    const aus = [];
    for (const t of liste) { const l = aus[aus.length - 1]; if (l && l.berechtigt.join() === t.berechtigt.join()) l.betrag += t.betrag; else aus.push(t); }
    return aus;
  }

  function verteilen(S, betrag, gewinner) {
    // Reihenfolge ab dem ersten Platz links vom Button
    const ord = gewinner.slice().sort((a, b) => ((a - S.button - 1 + n(S)) % n(S)) - ((b - S.button - 1 + n(S)) % n(S)));
    const teil = Math.floor(betrag / ord.length); let rest = betrag - teil * ord.length;
    const anteile = {};
    ord.forEach(j => { anteile[j] = teil + (rest > 0 ? 1 : 0); if (rest > 0) rest--; });
    return anteile;
  }

  function auszahlen(S, gewinner) {
    const betrag = topf(S);
    S.spieler[gewinner].chips += betrag;
    S.ergebnis = {kampflos: true, gewinner, toepfe: [{betrag, gewinner: [gewinner], anteile: {[gewinner]: betrag}, name: ''}], zeigen: [], gezeigt: {}, haende: {}};
    S.log.push(`${S.spieler[gewinner].name} gewinnt ${betrag}`);
    handEnde(S);
  }

  function showdown(S) {
    S.phase = 'showdown'; S.amZug = -1;
    const live = S.ph.map((p, j) => j).filter(imSpiel(S));
    const haende = {};
    live.forEach(j => haende[j] = besteHand(S.ph[j].karten.concat(S.board)));
    const tp = toepfe(S);
    // Reihenfolge beim Zeigen
    let start = (S.aggressor >= 0 && live.includes(S.aggressor)) ? S.aggressor : naechster(S, S.button, j => live.includes(j));
    const reihe = []; let j = start;
    for (let k = 0; k < n(S); k++) { if (live.includes(j)) reihe.push(j); j = (j + 1) % n(S); }
    const gezeigt = {}; const bestBisher = tp.map(() => null);
    // TDA 16: Ist jemand in der Hand All-in, werden nach Ende aller Setzrunden alle Hände aufgedeckt.
    const alleZeigen = S.opt.zeigen === 'alle' || S.aufgedeckt || live.some(j => S.ph[j].status === 'allin');
    reihe.forEach((p, idx) => {
      let zeigt = alleZeigen || idx === 0;
      tp.forEach((t, ti) => {
        if (!t.berechtigt.includes(p) || t.berechtigt.length < 2) return;
        if (!bestBisher[ti] || vergleich(haende[p].rang, bestBisher[ti]) >= 0) zeigt = true;
      });
      if (zeigt) { gezeigt[p] = true; tp.forEach((t, ti) => { if (t.berechtigt.includes(p) && (!bestBisher[ti] || vergleich(haende[p].rang, bestBisher[ti]) > 0)) bestBisher[ti] = haende[p].rang; }); }
    });
    const ergebnisToepfe = tp.map(t => {
      if (t.berechtigt.length === 1) {
        const g = t.berechtigt[0]; return {betrag: t.betrag, gewinner: [g], anteile: {[g]: t.betrag}, name: '', zurueck: true};
      }
      let best = null; t.berechtigt.forEach(p => { if (!best || vergleich(haende[p].rang, best) > 0) best = haende[p].rang; });
      const gew = t.berechtigt.filter(p => vergleich(haende[p].rang, best) === 0);
      return {betrag: t.betrag, gewinner: gew, anteile: verteilen(S, t.betrag, gew), name: handName(best), berechtigt: t.berechtigt};
    });
    ergebnisToepfe.forEach(t => Object.keys(t.anteile).forEach(p => S.spieler[p].chips += t.anteile[p]));
    S.ergebnis = {kampflos: false, toepfe: ergebnisToepfe, zeigen: reihe, gezeigt,
      haende: Object.fromEntries(Object.entries(haende).map(([p, h]) => [p, {name: h.name, karten: h.karten, rang: h.rang}]))};
    ergebnisToepfe.forEach(t => { if (!t.zurueck) S.log.push(`${t.gewinner.map(g => S.spieler[g].name).join(' und ')} ${t.gewinner.length > 1 ? 'teilen' : 'gewinnt'} ${t.betrag} · ${t.name}`); });
    handEnde(S);
  }

  function handEnde(S) {
    S.phase = 'handende'; S.amZug = -1; S.laufen = false;
    const raus = S.spieler.map((s, i) => i).filter(i => !S.spieler[i].raus && S.spieler[i].chips === 0);
    const verbleibend = S.spieler.filter(s => !s.raus).length - raus.length;
    raus.sort((a, b) => S.startChips[a] - S.startChips[b]); // wer weniger hatte, scheidet "zuerst" aus (schlechterer Platz)
    let platz = verbleibend + raus.length;
    raus.forEach(i => { S.spieler[i].raus = true; S.spieler[i].platz = platz--; });
    if (raus.length) S.ergebnis.raus = raus;
    const uebrig = S.spieler.map((s, i) => i).filter(i => !S.spieler[i].raus);
    if (uebrig.length <= 1) { S.sieger = uebrig[0] ?? -1; if (S.sieger >= 0) S.spieler[S.sieger].platz = 1; S.ergebnis.spielende = true; }
  }

  // Nach dem Anschauen des Ergebnisses: nächste Hand oder Spielende
  function weiterNachHand(S, rnd = zufallStd) {
    if (S.ergebnis && S.ergebnis.spielende) { S.phase = 'ende'; return S; }
    return neueHand(S, rnd);
  }

  const P = {teilmengen, RAENGE, FARBEN, HANDNAMEN, neuesDeck, bewerte5, besteHand, vergleich, handName, blinds, neuesSpiel, neueHand, moeglich,
    schnellwerte, aktion, naechsteStrasse, toepfe, topf, weiterNachHand, wert};
  return P;
})();
if (typeof module !== 'undefined') module.exports = Poker; else window.Poker = Poker;
