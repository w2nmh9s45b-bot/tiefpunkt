/* Rommé – deutsche Regeln mit zwei Paketen und sechs Jokern (110 Karten), 2–6 Personen. Reine Spielregeln ohne DOM.

   REGELQUELLEN
   - Regelwerk rommee.de (Turnierregeln für 110 Karten: Erstmeldung 40 Augen, Joker nicht nebeneinander und nicht in der
     Überzahl, Joker nur als letzte Karte ablegen, Ausmachen mit Abwurf, Hand-Rommé ohne 40-Augen-Hürde und doppelte
     Minuspunkte, Jokertausch erst nach der Erstmeldung und nur bei sofortiger Verwendung).
   - Deutscher Rommé-Verband (DRoV) und Rommé-Ordnung des DSkV, zusammengefasst bei spielstrategen.de: 13 Karten, die oberste
     Karte des Talons liegt offen; die offene Karte darf nur genommen werden, wenn sie im selben Zug ausgelegt wird.
   - Schachtelregeln Schmidt Spiele / ASS Altenburger (über spielregeln-spielanleitungen.de, spielstrategen.de): Ass 11 Augen,
     in A-2-3 nur 1 Auge; Bilder 10; Joker auf der Hand 20 Minuspunkte; König-Ass-Zwei nicht erlaubt; Abwurf auch am Ende.

   GRUNDREGEL (Vorgabe) UND AUSLEGUNGEN
   1. 110 Karten. Jeder bekommt 13 Karten, die oberste Talonkarte wird aufgedeckt und beginnt den Ablagestapel.
      Es beginnt die Person links vom Geber; der Geber wechselt jede Runde im Uhrzeigersinn.
   2. Zug: (a) eine Karte vom Talon ziehen ODER die oberste Karte der Ablage nehmen, (b) auslegen/anlegen/Joker tauschen,
      (c) eine Karte offen abwerfen. Der Zug ist erst mit dem Abwurf abgeschlossen; bis dahin lässt sich am iPad alles
      zurücknehmen (wie „Karte noch auf der Hand“).
   3. Ablagekarte: nur, wenn sie im selben Zug ausgelegt oder angelegt wird. Wer noch nicht herausgekommen ist, muss sie in
      seiner Erstmeldung verwenden. Wer nur noch eine Karte hält, darf die Ablagekarte nicht nehmen.
   4. Figuren: Satz = 3 oder 4 Karten gleichen Werts in verschiedenen Farben; Folge = mind. 3 Karten einer Farbe in lückenloser
      Reihe. Ass vor der 2 (A-2-3) oder nach dem König (D-K-A), nie K-A-2.
   5. Joker ersetzen jede Karte. Grundregel: in einer Figur nie mehr Joker als echte Karten, in einer Folge nie zwei Joker
      nebeneinander; ein Joker darf nur als allerletzte Karte abgeworfen werden. Option „Joker frei“ hebt das auf.
   6. Erstmeldung: alle neuen Figuren dieses Zuges zusammen mindestens 40 Augen (Option 30 / 31). Joker zählen wie die
      ersetzte Karte, Ass in A-2-3 als 1. Erst wenn die Erstmeldung im Zug erreicht ist, darf angelegt und getauscht werden;
      angelegte Karten zählen nicht zur Erstmeldung.
   7. Anlegen an alle Figuren auf dem Tisch. In einer Folge nur an die Enden; Joker liegen fest (der Tisch fordert sein Recht).
   8. Jokertausch: Ein Joker auf dem Tisch darf gegen die Karte getauscht werden, die er vertritt (in einem Satz gegen eine
      fehlende Farbe). Der Joker muss im selben Zug wieder ausgelegt werden.
   9. Ausmachen: Wer seine letzte Karte abwirft, gewinnt die Runde. Hand-Rommé: alle Karten in einem Zug ohne vorherige
      Erstmeldung – dann gilt keine Mindestpunktzahl, solange nur eigene neue Figuren gelegt werden (mit Anlegen/Tausch gilt
      die Hürde), und die Minuspunkte der anderen zählen doppelt.
  10. Wertung: Handkarten der anderen als Minuspunkte – 2 bis 10 nach Augen, Bube/Dame/König 10, Ass 11, Joker 20.
      Der Gewinner der Runde bekommt 0. Spielende nach einer festen Rundenzahl (Vorgabe 5) oder sobald jemand die
      Punktgrenze erreicht. Es gewinnt, wer die wenigsten Minuspunkte hat.
  11. Ist der Talon leer, wird die Ablage bis auf die oberste Karte gemischt und wird neuer Talon.
*/
"use strict";
const Romme = (function () {
  const FARBEN = ['kreuz', 'pik', 'herz', 'karo'];
  const SYMBOL = {kreuz: '♣', pik: '♠', herz: '♥', karo: '♦'};
  const RTEXT = {1: 'A', 11: 'B', 12: 'D', 13: 'K', 14: 'A'};
  const zufallStd = n => Math.floor(Math.random() * n);
  const kopie = o => JSON.parse(JSON.stringify(o));

  /* ---------- Karten ---------- */
  // id 0..109: je Paket 55 Karten (52 + 3 Joker)
  function karte(id) {
    const d = Math.floor(id / 55), k = id % 55;
    if (k >= 52) return {id, joker: true, farbe: (k + d) % 2 ? 'schwarz' : 'rot'};
    return {id, joker: false, farbe: FARBEN[Math.floor(k / 13)], rang: (k % 13) + 1};
  }
  const istJoker = id => id % 55 >= 52;
  const rangText = r => RTEXT[r] || String(r);
  function name(id) { const c = karte(id); return c.joker ? 'Joker' : rangText(c.rang) + SYMBOL[c.farbe]; }
  // Augen auf der Hand (Minuspunkte)
  function handWert(id) { const c = karte(id); if (c.joker) return 20; if (c.rang === 1) return 11; return Math.min(10, c.rang); }
  // Augen einer Position beim Auslegen: Rang 1 = Ass vor der 2 → 1, Rang 14 = Ass nach dem König → 11
  const posWert = r => r === 1 ? 1 : r === 14 ? 11 : Math.min(10, r);
  const satzWert = r => r === 1 ? 11 : Math.min(10, r);

  /* ---------- Figuren prüfen ---------- */
  function jokerOk(seq, art, opt) {
    if (opt.joker === 'frei') return true;
    const j = seq.filter(x => x === 'J').length, n = seq.length - j;
    if (j > n) return false;
    if (art === 'folge') for (let i = 1; i < seq.length; i++) if (seq[i] === 'J' && seq[i - 1] === 'J') return false;
    return true;
  }
  // Alle gültigen Deutungen einer ungeordneten Kartenmenge als neue Figur
  function deutungen(ids, opt) {
    const aus = [];
    if (ids.length < 3) return aus;
    const nat = ids.filter(id => !istJoker(id)).map(karte), jok = ids.filter(istJoker);
    if (!nat.length) return aus;
    // Satz
    if (ids.length <= 4 && nat.every(c => c.rang === nat[0].rang) && new Set(nat.map(c => c.farbe)).size === nat.length) {
      const seq = nat.map(() => 'N').concat(jok.map(() => 'J'));
      if (jokerOk(seq, 'satz', opt)) {
        const karten = nat.map(c => c.id).sort((a, b) => FARBEN.indexOf(karte(a).farbe) - FARBEN.indexOf(karte(b).farbe)).concat(jok);
        aus.push({art: 'satz', rang: nat[0].rang, karten, punkte: satzWert(nat[0].rang) * ids.length});
      }
    }
    // Folge
    if (nat.every(c => c.farbe === nat[0].farbe)) {
      const hatAss = nat.some(c => c.rang === 1);
      for (const assHoch of hatAss ? [false, true] : [false]) {
        const r = nat.map(c => c.rang === 1 && assHoch ? 14 : c.rang);
        if (new Set(r).size !== r.length) continue;
        const min = Math.min(...r), max = Math.max(...r);
        const luecken = (max - min + 1) - r.length;
        const extra = jok.length - luecken; if (extra < 0) continue;
        for (let unten = 0; unten <= extra; unten++) {
          const s = min - unten, e = max + (extra - unten);
          if (s < 1 || e > 14 || e - s > 12) continue;
          const karten = [], seq = []; const frei = jok.slice(); let ok = true;
          for (let p = s; p <= e; p++) {
            const i = r.indexOf(p);
            if (i >= 0) { karten.push(nat[i].id); seq.push('N'); } else { if (!frei.length) { ok = false; break; } karten.push(frei.shift()); seq.push('J'); }
          }
          if (!ok || !jokerOk(seq, 'folge', opt)) continue;
          let punkte = 0; for (let p = s; p <= e; p++) punkte += posWert(p);
          const sig = karten.join(',') + '|' + s;
          if (!aus.some(d => d.art === 'folge' && d.karten.join(',') + '|' + d.start === sig)) aus.push({art: 'folge', farbe: nat[0].farbe, start: s, karten, punkte});
        }
      }
    }
    // beste zuerst: mehr Augen, bei Gleichstand Joker eher oben
    aus.sort((a, b) => b.punkte - a.punkte);
    return aus;
  }
  // Prüft eine fertig liegende Figur (Reihenfolge zählt bei Folgen)
  function figurGueltig(f, opt) {
    if (f.karten.length < 3) return false;
    if (f.art === 'satz') return deutungen(f.karten, opt).some(d => d.art === 'satz');
    const seq = [];
    for (let p = 0; p < f.karten.length; p++) {
      const id = f.karten[p], r = f.start + p;
      if (r < 1 || r > 14) return false;
      if (istJoker(id)) { seq.push('J'); continue; }
      const c = karte(id); seq.push('N');
      if (c.farbe !== f.farbe) return false;
      if (!(c.rang === r || (c.rang === 1 && r === 14))) return false;
    }
    if (f.start + f.karten.length - 1 - f.start > 12) return false;
    return jokerOk(seq, 'folge', opt);
  }
  function figurPunkte(f) {
    if (f.art === 'satz') return satzWert(f.rang) * f.karten.length;
    let s = 0; for (let p = 0; p < f.karten.length; p++) s += posWert(f.start + p); return s;
  }
  // Welche Karte vertritt ein Joker? (Folge: genau eine; Satz: eine der fehlenden Farben)
  function jokerVertritt(f, jid) {
    if (f.art === 'folge') { const p = f.karten.indexOf(jid); const r = f.start + p; return [{rang: r === 14 ? 1 : r, farbe: f.farbe}]; }
    const da = f.karten.filter(id => !istJoker(id)).map(id => karte(id).farbe);
    return FARBEN.filter(x => !da.includes(x)).map(farbe => ({rang: f.rang, farbe}));
  }
  // Anlegen: neue Karten an eine liegende Figur (Folge nur an die Enden)
  function anlegenErgebnis(f, ids, opt) {
    if (!ids.length) return null;
    if (f.art === 'satz') {
      const alle = f.karten.concat(ids);
      if (alle.length > 4) return null;
      const d = deutungen(alle, opt).find(x => x.art === 'satz' && x.rang === f.rang);
      return d ? Object.assign({}, f, {karten: d.karten}) : null;
    }
    const nat = ids.filter(id => !istJoker(id)).map(karte), jok = ids.filter(istJoker);
    if (nat.some(c => c.farbe !== f.farbe)) return null;
    const ende = f.start + f.karten.length - 1;
    // Ränge der neuen Karten außerhalb des liegenden Bereichs
    const moegl = [];
    const varianten = nat.map(c => c.rang === 1 ? [1, 14] : [c.rang]);
    const kombis = varianten.reduce((acc, v) => acc.flatMap(a => v.map(x => a.concat(x))), [[]]);
    for (const r of kombis) {
      if (new Set(r).size !== r.length) continue;
      if (r.some(x => x >= f.start && x <= ende)) continue;
      const total = r.length + jok.length;
      for (let unten = 0; unten <= total; unten++) {
        const s = f.start - unten, e = ende + (total - unten);
        if (s < 1 || e > 14 || e - s > 12) continue;
        if (r.some(x => x < s || x > e)) continue;
        const frei = jok.slice(); const karten = []; let ok = true;
        for (let p = s; p <= e; p++) {
          if (p >= f.start && p <= ende) { karten.push(f.karten[p - f.start]); continue; }
          const i = r.indexOf(p);
          if (i >= 0) karten.push(nat[i].id); else if (frei.length) karten.push(frei.shift()); else { ok = false; break; }
        }
        if (!ok || frei.length) continue;
        const neu = Object.assign({}, f, {start: s, karten});
        if (figurGueltig(neu, opt)) moegl.push({neu, unten});
      }
    }
    if (!moegl.length) return null;
    // Joker bevorzugt oben anlegen (Ende), Ass dort, wo es passt
    moegl.sort((a, b) => a.unten - b.unten);
    return moegl[0].neu;
  }

  /* ---------- Spiel anlegen ---------- */
  function neuesSpiel({namen, farben = [], erst = 40, joker = 'verband', ende = 'runden5'}, rnd = zufallStd) {
    const S = {v: 1, spieler: namen.map((n, i) => ({name: n, farbe: farben[i] || '#8fd3d1', hand: [], summe: 0})),
      opt: {erst, joker, ende}, runde: 0, geber: rnd(namen.length) - 1, runden: [], phase: 'start', naechsteId: 1};
    neueRunde(S, rnd);
    return S;
  }
  function neueRunde(S, rnd = zufallStd) {
    const n = S.spieler.length;
    S.runde++; S.geber = (S.geber + 1 + n) % n;
    const talon = []; for (let i = 0; i < 110; i++) talon.push(i);
    for (let i = talon.length - 1; i > 0; i--) { const j = rnd(i + 1); [talon[i], talon[j]] = [talon[j], talon[i]]; }
    S.spieler.forEach(s => s.hand = []);
    for (let k = 0; k < 13; k++) for (let i = 1; i <= n; i++) S.spieler[(S.geber + i) % n].hand.push(talon.pop());
    S.talon = talon; S.ablage = [talon.pop()];
    S.tisch = []; S.raus = S.spieler.map(() => false);
    S.amZug = (S.geber + 1) % n;
    S.phase = 'ziehen'; S.zug = null; S.ergebnis = null; S.letzte = null;
    S.spieler.forEach((_, i) => sortieren(S, i, 'farbe'));
    return S;
  }

  /* ---------- Hand ordnen ---------- */
  const sortRang = id => { const c = karte(id); return c.joker ? 99 : c.rang === 1 ? 14 : c.rang; };
  function sortieren(S, i, art) {
    const h = S.spieler[i].hand;
    const f = id => istJoker(id) ? 9 : FARBEN.indexOf(karte(id).farbe);
    if (art === 'wert') h.sort((a, b) => sortRang(a) - sortRang(b) || f(a) - f(b) || a - b);
    else h.sort((a, b) => f(a) - f(b) || sortRang(a) - sortRang(b) || a - b);
    return h;
  }

  /* ---------- Zug ---------- */
  function darfAblageNehmen(S) {
    if (S.phase !== 'ziehen') return {ok: false, grund: 'Du hast schon gezogen.'};
    if (!S.ablage.length) return {ok: false, grund: 'Die Ablage ist leer.'};
    if (S.spieler[S.amZug].hand.length <= 1) return {ok: false, grund: 'Mit nur einer Karte darfst du nicht von der Ablage nehmen.'};
    return {ok: true};
  }
  function zugBeginnen(S, ablageKarte) {
    const i = S.amZug;
    S.zug = {ablageKarte: ablageKarte ?? null, start: kopie({hand: S.spieler[i].hand, tisch: S.tisch}), schritte: []};
    S.phase = 'spielen';
  }
  function ziehen(S, rnd = zufallStd) {
    if (S.phase !== 'ziehen') return {ok: false, grund: 'Du hast schon gezogen.'};
    if (!S.talon.length) {
      if (S.ablage.length <= 1) return {ok: false, grund: 'Keine Karten mehr im Talon.'};
      const oben = S.ablage.pop(); S.talon = S.ablage;
      for (let i = S.talon.length - 1; i > 0; i--) { const j = rnd(i + 1); [S.talon[i], S.talon[j]] = [S.talon[j], S.talon[i]]; }
      S.ablage = [oben];
    }
    const id = S.talon.pop(); S.spieler[S.amZug].hand.push(id);
    zugBeginnen(S, null);
    return {ok: true, karte: id};
  }
  function ablageNehmen(S) {
    const d = darfAblageNehmen(S); if (!d.ok) return d;
    const id = S.ablage.pop(); S.spieler[S.amZug].hand.push(id);
    zugBeginnen(S, id);
    return {ok: true, karte: id};
  }
  // Ablagekarte zurücklegen, solange am Tisch nichts geändert wurde
  function ablageZurueck(S) {
    const z = S.zug; if (!z || z.ablageKarte == null) return {ok: false, grund: 'Du hast nicht von der Ablage genommen.'};
    const i = S.amZug;
    if (JSON.stringify(S.tisch) !== JSON.stringify(z.start.tisch)) return {ok: false, grund: 'Nimm erst deine ausgelegten Karten zurück.'};
    const h = S.spieler[i].hand; const k = h.indexOf(z.ablageKarte); if (k < 0) return {ok: false, grund: 'Die Karte liegt nicht mehr auf deiner Hand.'};
    h.splice(k, 1); S.ablage.push(z.ablageKarte); S.zug = null; S.phase = 'ziehen';
    return {ok: true};
  }
  function merken(S) { S.zug.schritte.push(kopie({hand: S.spieler[S.amZug].hand, tisch: S.tisch})); if (S.zug.schritte.length > 60) S.zug.schritte.shift(); }
  function schrittZurueck(S) {
    const z = S.zug; if (!z || !z.schritte.length) return {ok: false, grund: 'Nichts zurückzunehmen.'};
    const s = z.schritte.pop(); S.spieler[S.amZug].hand = s.hand; S.tisch = s.tisch; return {ok: true};
  }
  function zugZuruecksetzen(S) {
    const z = S.zug; if (!z) return {ok: false, grund: 'Noch nichts passiert.'};
    const s = kopie(z.start); S.spieler[S.amZug].hand = s.hand; S.tisch = s.tisch; z.schritte = []; return {ok: true};
  }

  // Lage des laufenden Zuges
  function zugLage(S) {
    const z = S.zug, i = S.amZug;
    const alt = new Map(z.start.tisch.map(f => [f.id, f]));
    const neu = S.tisch.filter(f => !alt.has(f.id));
    const geaendert = S.tisch.filter(f => alt.has(f.id) && alt.get(f.id).karten.join() !== f.karten.join());
    const punkteNeu = neu.reduce((a, f) => a + figurPunkte(f), 0);
    const tischJoker = new Set(z.start.tisch.flatMap(f => f.karten).filter(istJoker));
    const freieJoker = S.spieler[i].hand.filter(id => tischJoker.has(id));
    const erreicht = S.raus[i] || punkteNeu >= S.opt.erst;
    return {neu, geaendert, punkteNeu, freieJoker, erreicht, warRaus: S.raus[i]};
  }
  function auswahlOk(S, ids) {
    const h = S.spieler[S.amZug].hand;
    return ids.length && ids.every(id => h.includes(id)) && new Set(ids).size === ids.length;
  }

  // Kombination prüfen (für den Knopf „Prüfen“)
  function pruefen(S, ids) {
    if (ids.length < 3) return {ok: false, grund: 'Eine Figur braucht mindestens drei Karten.'};
    const d = deutungen(ids, S.opt);
    if (!d.length) return {ok: false, grund: grundUngueltig(ids, S.opt)};
    return {ok: true, deutungen: d, text: `${d[0].art === 'satz' ? 'Satz' : 'Folge'} · ${d[0].punkte} Augen`};
  }
  function grundUngueltig(ids, opt) {
    const nat = ids.filter(id => !istJoker(id)).map(karte), j = ids.length - nat.length;
    if (!nat.length) return 'Nur Joker sind keine Figur.';
    if (opt.joker !== 'frei' && j > nat.length) return 'Mehr Joker als echte Karten sind nicht erlaubt.';
    const gleicherWert = nat.every(c => c.rang === nat[0].rang), gleicheFarbe = nat.every(c => c.farbe === nat[0].farbe);
    if (gleicherWert && !gleicheFarbe) {
      if (new Set(nat.map(c => c.farbe)).size !== nat.length) return 'Im Satz darf jede Farbe nur einmal vorkommen.';
      if (ids.length > 4) return 'Ein Satz hat höchstens vier Karten.';
    }
    if (gleicheFarbe && !gleicherWert) {
      if (opt.joker !== 'frei') return 'Die Folge hat Lücken, oder zwei Joker lägen nebeneinander.';
      return 'Die Folge hat Lücken.';
    }
    if (gleicherWert && gleicheFarbe && nat.length > 1) return 'Zweimal dieselbe Karte passt in keine Figur.';
    return 'Weder gleicher Wert (Satz) noch gleiche Farbe in Reihe (Folge).';
  }

  function auslegen(S, ids, deutung = 0) {
    if (S.phase !== 'spielen') return {ok: false, grund: 'Erst ziehen.'};
    if (!auswahlOk(S, ids)) return {ok: false, grund: 'Wähle Karten aus deiner Hand.'};
    const p = pruefen(S, ids); if (!p.ok) return p;
    const d = p.deutungen[Math.min(deutung, p.deutungen.length - 1)];
    merken(S);
    const h = S.spieler[S.amZug].hand; ids.forEach(id => h.splice(h.indexOf(id), 1));
    const f = Object.assign({id: S.naechsteId++}, d); delete f.punkte;
    S.tisch.push(f);
    return {ok: true, figur: f, deutungen: p.deutungen.length};
  }
  // Neue Figur (dieses Zuges) anders deuten, z. B. Joker an das andere Ende
  function umdeuten(S, figurId) {
    const lage = zugLage(S); const f = lage.neu.find(x => x.id === figurId);
    if (!f) return {ok: false, grund: 'Nur Figuren aus diesem Zug lassen sich umlegen.'};
    const d = deutungen(f.karten, S.opt); if (d.length < 2) return {ok: false, grund: 'Diese Figur lässt sich nur so legen.'};
    const sig = x => x.art + '|' + x.karten.join() + '|' + (x.start || x.rang);
    const k = d.findIndex(x => sig(x) === sig(f));
    const n = d[(k + 1) % d.length];
    merken(S);
    const idx = S.tisch.indexOf(f); const neu = Object.assign({id: f.id}, n); delete neu.punkte; S.tisch[idx] = neu;
    return {ok: true};
  }
  function anlegenMoeglich(S, figurId, ids) {
    if (S.phase !== 'spielen' || !auswahlOk(S, ids)) return null;
    const f = S.tisch.find(x => x.id === figurId); if (!f) return null;
    const lage = zugLage(S); const istNeu = lage.neu.includes(f);
    if (!istNeu && !lage.erreicht) return null;
    return anlegenErgebnis(f, ids, S.opt);
  }
  function anlegen(S, figurId, ids) {
    const lage = zugLage(S); const f = S.tisch.find(x => x.id === figurId);
    if (f && !lage.neu.includes(f) && !lage.erreicht) return {ok: false, grund: `Anlegen geht erst nach der Erstmeldung (${S.opt.erst} Augen aus neuen Figuren).`};
    const neu = anlegenMoeglich(S, figurId, ids);
    if (!neu) return {ok: false, grund: 'Das passt dort nicht.'};
    merken(S);
    const h = S.spieler[S.amZug].hand; ids.forEach(id => h.splice(h.indexOf(id), 1));
    S.tisch[S.tisch.indexOf(f)] = neu;
    return {ok: true};
  }
  function tauschMoeglich(S, figurId, jokerId, kartenId) {
    if (S.phase !== 'spielen' || !auswahlOk(S, [kartenId]) || istJoker(kartenId)) return false;
    const f = S.tisch.find(x => x.id === figurId); if (!f || !f.karten.includes(jokerId) || !istJoker(jokerId)) return false;
    const lage = zugLage(S); if (!lage.neu.includes(f) && !lage.erreicht) return false;
    const c = karte(kartenId);
    return jokerVertritt(f, jokerId).some(v => v.rang === c.rang && v.farbe === c.farbe);
  }
  function tauschen(S, figurId, jokerId, kartenId) {
    const lage = zugLage(S); const f = S.tisch.find(x => x.id === figurId);
    if (f && !lage.neu.includes(f) && !lage.erreicht) return {ok: false, grund: 'Joker tauschen geht erst nach der Erstmeldung.'};
    if (!tauschMoeglich(S, figurId, jokerId, kartenId)) return {ok: false, grund: 'Diese Karte vertritt der Joker nicht.'};
    merken(S);
    const h = S.spieler[S.amZug].hand; h.splice(h.indexOf(kartenId), 1); h.push(jokerId);
    const neu = Object.assign({}, f, {karten: f.karten.slice()});
    neu.karten[neu.karten.indexOf(jokerId)] = kartenId;
    if (neu.art === 'satz') neu.karten = neu.karten.filter(id => !istJoker(id)).sort((a, b) => FARBEN.indexOf(karte(a).farbe) - FARBEN.indexOf(karte(b).farbe)).concat(neu.karten.filter(istJoker));
    S.tisch[S.tisch.indexOf(f)] = neu;
    return {ok: true};
  }
  // Neue Figur dieses Zuges ganz zurück auf die Hand
  function zuruecknehmen(S, figurId) {
    const lage = zugLage(S); const f = lage.neu.find(x => x.id === figurId);
    if (!f) return {ok: false, grund: 'Nur Figuren aus diesem Zug lassen sich zurücknehmen. Für Angelegtes: „Zug zurücksetzen“.'};
    merken(S);
    S.tisch.splice(S.tisch.indexOf(f), 1); S.spieler[S.amZug].hand.push(...f.karten);
    return {ok: true};
  }

  // Abwerfen = Zug abschließen. Prüft alle Regeln des Zuges.
  function abwerfenPruefen(S, id) {
    if (S.phase !== 'spielen') return {ok: false, grund: 'Erst ziehen.'};
    const i = S.amZug, h = S.spieler[i].hand;
    if (!h.includes(id)) return {ok: false, grund: 'Wähle eine Karte aus deiner Hand.'};
    const lage = zugLage(S), z = S.zug;
    const ungueltig = S.tisch.find(f => !figurGueltig(f, S.opt));
    if (ungueltig) return {ok: false, grund: 'Eine Figur auf dem Tisch ist ungültig.'};
    if (lage.freieJoker.length) return {ok: false, grund: 'Den getauschten Joker musst du in diesem Zug wieder auslegen.'};
    if (z.ablageKarte != null) {
      const liegt = S.tisch.some(f => f.karten.includes(z.ablageKarte));
      if (!liegt) return {ok: false, grund: `Die Ablagekarte (${name(z.ablageKarte)}) musst du in diesem Zug auslegen.`};
      if (!lage.warRaus && !lage.neu.some(f => f.karten.includes(z.ablageKarte))) return {ok: false, grund: 'Vor der Erstmeldung muss die Ablagekarte in einer neuen Figur liegen.'};
    }
    const letzte = h.length === 1;
    if (istJoker(id) && !letzte && S.opt.joker !== 'frei') return {ok: false, grund: 'Einen Joker darfst du nur als allerletzte Karte abwerfen.'};
    let handRomme = false;
    if (!lage.warRaus && (lage.neu.length || lage.geaendert.length)) {
      handRomme = letzte;
      if (lage.geaendert.length && lage.punkteNeu < S.opt.erst) return {ok: false, grund: `Für die Erstmeldung fehlen noch ${S.opt.erst - lage.punkteNeu} Augen (${lage.punkteNeu} von ${S.opt.erst}).`};
      if (!handRomme && lage.punkteNeu < S.opt.erst) return {ok: false, grund: `Für die Erstmeldung fehlen noch ${S.opt.erst - lage.punkteNeu} Augen (${lage.punkteNeu} von ${S.opt.erst}).`};
    }
    return {ok: true, letzte, handRomme: handRomme && letzte, lage};
  }
  function abwerfen(S, id) {
    const p = abwerfenPruefen(S, id); if (!p.ok) return p;
    const i = S.amZug, h = S.spieler[i].hand;
    h.splice(h.indexOf(id), 1); S.ablage.push(id);
    if (p.lage.neu.length) S.raus[i] = true;
    S.letzte = {spieler: i, abwurf: id, neu: p.lage.neu.map(f => f.id), geaendert: p.lage.geaendert.map(f => f.id), ablage: S.zug.ablageKarte};
    S.zug = null;
    if (!h.length) { rundeEnde(S, i, p.handRomme); return {ok: true, ende: true, handRomme: p.handRomme}; }
    S.amZug = (i + 1) % S.spieler.length; S.phase = 'ziehen';
    return {ok: true};
  }

  /* ---------- Wertung ---------- */
  function rundeEnde(S, gewinner, handRomme) {
    const faktor = handRomme ? 2 : 1;
    const zeilen = S.spieler.map((s, i) => {
      const karten = s.hand.slice(); const augen = karten.reduce((a, id) => a + handWert(id), 0);
      return {karten, augen, punkte: i === gewinner ? 0 : augen * faktor};
    });
    zeilen.forEach((z, i) => S.spieler[i].summe += z.punkte);
    const r = {runde: S.runde, gewinner, handRomme, zeilen};
    S.runden.push(r); S.ergebnis = r; S.phase = 'rundenende';
    if (spielVorbei(S)) { S.phase = 'spielende'; S.sieger = siegerListe(S); }
  }
  function spielVorbei(S) {
    const m = /^(runden|grenze)(\d+)$/.exec(S.opt.ende) || ['', 'runden', '5'];
    if (m[1] === 'runden') return S.runde >= +m[2];
    return S.spieler.some(s => s.summe >= +m[2]);
  }
  function siegerListe(S) { const min = Math.min(...S.spieler.map(s => s.summe)); return S.spieler.map((s, i) => i).filter(i => S.spieler[i].summe === min); }
  function naechsteRunde(S, rnd = zufallStd) { if (S.phase !== 'rundenende') return S; return neueRunde(S, rnd); }

  return {FARBEN, SYMBOL, karte, istJoker, name, rangText, handWert, deutungen, figurGueltig, figurPunkte, jokerVertritt, anlegenErgebnis,
    neuesSpiel, neueRunde, sortieren, darfAblageNehmen, ziehen, ablageNehmen, ablageZurueck, schrittZurueck, zugZuruecksetzen,
    zugLage, pruefen, auslegen, umdeuten, anlegenMoeglich, anlegen, tauschMoeglich, tauschen, zuruecknehmen, abwerfenPruefen, abwerfen,
    naechsteRunde, spielVorbei};
})();
if (typeof module !== 'undefined') module.exports = Romme; else window.Romme = Romme;
