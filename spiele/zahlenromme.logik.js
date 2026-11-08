/* Zahlenrommé – Legespiel mit 106 Zahlensteinen für 2–4 Personen an einem Gerät. Reine Spielregeln ohne DOM.

   REGELQUELLE
   - Offizielle deutsche Spielregel des Verlags (Jumbo Spiele, Ausgabe 03973/17570, Autor E. Hertzano), abgerufen als PDF
     unter media.jumboplay.com/03973_manual.pdf. Ergänzend pagat.com („Rummikub“) für die Lesart der Grundregeln.

   GRUNDREGEL (wie in der Anleitung)
   1. 104 Zahlensteine 1–13 in vier Farben, jede Farbe doppelt, dazu 2 Joker. Jeder nimmt 14 Steine, der Rest bildet den Pool.
      Wer beginnt, wird ausgelost; gespielt wird im Uhrzeigersinn.
   2. Wer unter seinen ersten 14 Steinen drei oder mehr gleiche Paare (gleiche Zahl UND Farbe) hat, darf verlangen, dass neu
      gemischt wird (Beweis: Paare offen zeigen). Am iPad: nur vor dem ersten eigenen Zug, solange noch nichts liegt.
   3. Serien: Gruppe = 3 oder 4 Steine gleicher Zahl in verschiedenen Farben; Reihe = 3 bis 13 Steine einer Farbe mit
      aufeinanderfolgenden Zahlen. Die 1 darf nicht an die 13 angelegt werden (12-13-1 ist verboten).
   4. Erste Auslage: mindestens 30 Punkte (Summe der Zahlen) aus einer oder mehreren Serien NUR vom eigenen Brett. In diesem
      Zug darf am Tisch nichts manipuliert, nichts angelegt und kein Joker ersetzt werden. Wer nicht kann oder will, zieht
      einen Stein aus dem Pool.
   5. Danach besteht jeder Zug aus: mindestens einen eigenen Stein auslegen (dabei beliebig umbauen) ODER einen Stein ziehen.
      Am Ende des Zuges liegen nur vollständige Serien auf dem Tisch; Steine vom Tisch dürfen nicht auf das Brett zurück.
   6. Joker ersetzt jeden Stein und zählt so viel wie der ersetzte Stein. Vor und während der ersten Auslage darf kein Joker
      ersetzt werden. Ein ersetzter Joker muss im selben Zug wieder eingesetzt werden (folgt daraus, dass nichts vom Tisch
      zurück aufs Brett darf und am Ende alles gültig sein muss).
   7. Zeitlimit (Option, Original: 1 Minute je Zug). Wer seinen Zug nicht rechtzeitig abschließt – oder einen Zug mit
      ungültigem Tisch abschließen will –, bekommt den Tisch und das Brett wie zu Zugbeginn zurück und nimmt 3 Strafsteine.
   8. Rundenende: Wer zuerst alle Steine abgelegt hat, gewinnt. Die anderen schreiben die Summe ihrer Steine als Minuspunkte
      auf (Joker = 30), der Gewinner bekommt die Summe aller Minuspunkte als Pluspunkte.
   9. Pool leer: Wer den letzten Stein zieht, sagt es an; dann darf jeder – beginnend mit dieser Person – noch einmal
      versuchen, auszulegen. Schafft es niemand, gewinnt die kleinste Steinsumme (bei Gleichstand: weniger Steine); ALLE
      schreiben sich dann ihre Summe als Minuspunkte auf (auch der Gewinner).
  10. Mehrere Runden: Wer die höchste Gesamtpunktzahl hat, gewinnt. Am iPad wählbar: 1, 3 oder 5 Runden oder offen.

   AUSLEGUNGEN
   - Der Tisch wird als Menge von Serien geprüft: Eine Serie mit Joker gilt, wenn es eine gültige Belegung gibt. Für den
     Wert der ersten Auslage zählt die günstigste Belegung (z. B. Blau 9-10-Joker = 9+10+11 = 30).
   - „Mindestens ein Stein“: Ein Zug zählt nur, wenn mindestens ein Stein vom eigenen Brett auf dem Tisch liegt.
*/
"use strict";
const Zahlenromme = (function () {
  const FARBEN = ['rot', 'blau', 'gelb', 'schwarz'];
  const JOKER = [104, 105];
  const zufallStd = n => Math.floor(Math.random() * n);
  const kopie = o => JSON.parse(JSON.stringify(o));

  /* ---------- Steine ---------- */
  function stein(id) {
    if (id >= 104) return {id, joker: true};
    return {id, joker: false, farbe: FARBEN[Math.floor(id / 26)], fi: Math.floor(id / 26), zahl: Math.floor((id % 26) / 2) + 1};
  }
  const istJoker = id => id >= 104;
  const wertAufBrett = id => istJoker(id) ? 30 : stein(id).zahl;
  const FARBNAME = {rot: 'Rot', blau: 'Blau', gelb: 'Gelb', schwarz: 'Schwarz'};
  const name = id => istJoker(id) ? 'Joker' : `${FARBNAME[stein(id).farbe]} ${stein(id).zahl}`;

  /* ---------- Serien ---------- */
  function analyse(ids) {
    const n = ids.length;
    if (n < 3) return {ok: false, grund: n ? 'Eine Serie braucht mindestens drei Steine.' : ''};
    const nat = ids.filter(id => !istJoker(id)).map(stein), j = n - nat.length;
    if (!nat.length) return {ok: false, grund: 'Nur Joker sind keine Serie.'};
    let wert = -1, art = null;
    // Gruppe
    if (n <= 4 && nat.every(s => s.zahl === nat[0].zahl) && new Set(nat.map(s => s.farbe)).size === nat.length) { wert = nat[0].zahl * n; art = 'gruppe'; }
    // Reihe
    if (n <= 13 && nat.every(s => s.farbe === nat[0].farbe) && new Set(nat.map(s => s.zahl)).size === nat.length) {
      const min = Math.min(...nat.map(s => s.zahl)), max = Math.max(...nat.map(s => s.zahl));
      if (max - min + 1 <= n) {
        const start = Math.min(min, 14 - n);
        if (start >= Math.max(1, max - n + 1)) {
          const w = n * start + n * (n - 1) / 2;
          if (w > wert) { wert = w; art = 'reihe'; }
        }
      }
    }
    if (art) return {ok: true, art, wert};
    return {ok: false, grund: grund(ids, nat, j)};
  }
  function grund(ids, nat, j) {
    const gleicheZahl = nat.every(s => s.zahl === nat[0].zahl), gleicheFarbe = nat.every(s => s.farbe === nat[0].farbe);
    if (gleicheZahl && !gleicheFarbe) return ids.length > 4 ? 'Eine Gruppe hat höchstens vier Steine.' : 'In einer Gruppe darf jede Farbe nur einmal vorkommen.';
    if (gleicheFarbe && !gleicheZahl) {
      if (new Set(nat.map(s => s.zahl)).size !== nat.length) return 'In einer Reihe darf keine Zahl doppelt sein.';
      return 'Die Reihe hat eine Lücke (die 1 folgt nicht auf die 13).';
    }
    if (gleicheZahl && gleicheFarbe && nat.length > 1) return 'Zwei gleiche Steine passen in keine Serie.';
    return 'Weder gleiche Zahl (Gruppe) noch gleiche Farbe in Folge (Reihe).';
  }
  // Anzeige-Reihenfolge einer Serie: Reihe aufsteigend mit Joker an seinem Platz, Gruppe nach Farbe
  function ordnen(ids) {
    const a = analyse(ids);
    const nat = ids.filter(id => !istJoker(id)), jok = ids.filter(istJoker);
    if (a.ok && a.art === 'reihe') {
      const n = ids.length, z = nat.map(id => stein(id).zahl), min = Math.min(...z);
      const start = Math.min(min, 14 - n);
      const aus = []; const frei = jok.slice();
      for (let p = start; p < start + n; p++) { const id = nat.find(x => stein(x).zahl === p); aus.push(id != null ? id : frei.shift()); }
      return aus;
    }
    const sortiert = nat.slice().sort((x, y) => stein(x).zahl - stein(y).zahl || stein(x).fi - stein(y).fi);
    return sortiert.concat(jok);
  }

  /* ---------- Spiel anlegen ---------- */
  function neuesSpiel({namen, farben = [], zeit = 0, runden = 3}, rnd = zufallStd) {
    const S = {v: 1, spieler: namen.map((n, i) => ({name: n, farbe: farben[i] || '#e5a83b', bank: [], raus: false, summe: 0})),
      opt: {zeit, runden}, runde: 0, startSpieler: rnd(namen.length) - 1, runden: [], naechsteReihe: 1};
    neueRunde(S, rnd);
    return S;
  }
  function austeilen(S, rnd) {
    const pool = []; for (let i = 0; i < 106; i++) pool.push(i);
    for (let i = pool.length - 1; i > 0; i--) { const j = rnd(i + 1); [pool[i], pool[j]] = [pool[j], pool[i]]; }
    S.spieler.forEach(s => { s.bank = pool.splice(pool.length - 14, 14); s.raus = false; });
    S.pool = pool; S.tisch = []; S.gespielt = S.spieler.map(() => false);
    S.spieler.forEach((_, i) => sortieren(S, i, 'farbe'));
  }
  function neueRunde(S, rnd = zufallStd) {
    S.runde++;
    S.startSpieler = (S.startSpieler + 1) % S.spieler.length;
    austeilen(S, rnd);
    S.amZug = S.startSpieler; S.phase = 'zug'; S.schluss = null; S.ergebnis = null; S.letzte = null;
    zugBeginnen(S);
    return S;
  }
  function zugBeginnen(S) { S.zug = {start: kopie({tisch: S.tisch, bank: S.spieler[S.amZug].bank})}; }

  // Neu mischen verlangen: drei gleiche Paare, vor dem ersten eigenen Zug, solange nichts liegt
  function paare(bank) { const c = {}; bank.filter(id => !istJoker(id)).forEach(id => { const s = stein(id); const k = s.fi * 100 + s.zahl; c[k] = (c[k] || 0) + 1; }); return Object.values(c).filter(v => v >= 2).length; }
  function darfNeuMischen(S) {
    const i = S.amZug;
    return S.phase === 'zug' && !S.gespielt[i] && S.tisch.length === 0 && S.zug.start.tisch.length === 0 && S.gespielt.every(g => !g) && paare(S.spieler[i].bank) >= 3;
  }
  function neuMischen(S, rnd = zufallStd) {
    if (!darfNeuMischen(S)) return {ok: false, grund: 'Neu mischen geht nur mit drei gleichen Paaren vor dem ersten Zug.'};
    austeilen(S, rnd); S.amZug = S.startSpieler; zugBeginnen(S);
    return {ok: true};
  }

  /* ---------- Brett ordnen ---------- */
  function sortieren(S, i, art) {
    const b = S.spieler[i].bank;
    const k = id => { const s = stein(id); return s.joker ? [9, 99] : art === 'zahl' ? [s.zahl, s.fi] : [s.fi, s.zahl]; };
    b.sort((x, y) => { const a = k(x), c = k(y); return a[0] - c[0] || a[1] - c[1] || x - y; });
    return b;
  }

  /* ---------- Steine bewegen ---------- */
  function lage(S) {
    const i = S.amZug, start = S.zug.start;
    const startBank = new Set(start.bank);
    const startReihen = new Map(start.tisch.map(r => [r.id, r.steine.slice().sort((a, b) => a - b).join()]));
    const gelegt = S.tisch.flatMap(r => r.steine).filter(id => startBank.has(id));
    const reihen = S.tisch.map(r => ({id: r.id, a: analyse(r.steine), neu: !startReihen.has(r.id)}));
    const ungueltig = reihen.filter(r => !r.a.ok).map(r => r.id);
    const tischGeaendert = S.tisch.length !== start.tisch.length || S.tisch.some(r => startReihen.get(r.id) !== r.steine.slice().sort((a, b) => a - b).join());
    const raus = S.spieler[i].raus;
    const erstwert = reihen.filter(r => r.neu && r.a.ok).reduce((a, r) => a + r.a.wert, 0);
    return {gelegt, ungueltig, tischGeaendert, raus, erstwert, startBank};
  }
  function wo(S, id) {
    const b = S.spieler[S.amZug].bank.indexOf(id); if (b >= 0) return {art: 'bank'};
    for (const r of S.tisch) if (r.steine.includes(id)) return {art: 'reihe', reihe: r};
    return null;
  }
  // Darf dieser Stein in diesem Zug angefasst werden?
  function beweglich(S, id) {
    if (S.phase !== 'zug') return false;
    const w = wo(S, id); if (!w) return false;
    if (w.art === 'bank') return true;
    if (S.spieler[S.amZug].raus) return true;
    return S.zug.start.bank.includes(id); // vor der ersten Auslage nur eigene Steine
  }
  // Ziel: {art:'bank'} | {art:'neu'} | {art:'reihe', id}
  function zielErlaubt(S, ids, ziel) {
    if (!ids.length || !ids.every(id => beweglich(S, id))) return {ok: false, grund: 'Diese Steine kannst du jetzt nicht bewegen.'};
    if (ziel.art === 'bank') {
      if (!ids.every(id => S.zug.start.bank.includes(id))) return {ok: false, grund: 'Steine vom Tisch dürfen nicht auf dein Brett.'};
      return {ok: true};
    }
    if (ziel.art === 'reihe') {
      const r = S.tisch.find(x => x.id === ziel.id); if (!r) return {ok: false, grund: 'Diese Serie gibt es nicht mehr.'};
      if (!S.spieler[S.amZug].raus && S.zug.start.tisch.some(x => x.id === r.id)) return {ok: false, grund: 'Vor deiner ersten Auslage darfst du nicht an Serien auf dem Tisch anlegen.'};
    }
    return {ok: true};
  }
  function verschieben(S, ids, ziel) {
    const e = zielErlaubt(S, ids, ziel); if (!e.ok) return e;
    const b = S.spieler[S.amZug].bank;
    ids.forEach(id => {
      const w = wo(S, id);
      if (w.art === 'bank') b.splice(b.indexOf(id), 1);
      else { w.reihe.steine.splice(w.reihe.steine.indexOf(id), 1); }
    });
    let zielReihe = null;
    if (ziel.art === 'bank') b.push(...ids);
    else if (ziel.art === 'neu') { zielReihe = {id: S.naechsteReihe++, steine: ids.slice()}; S.tisch.push(zielReihe); }
    else { zielReihe = S.tisch.find(x => x.id === ziel.id); zielReihe.steine.push(...ids); }
    S.tisch = S.tisch.filter(r => r.steine.length);
    S.tisch.forEach(r => r.steine = ordnen(r.steine));
    return {ok: true, reihe: zielReihe ? zielReihe.id : null};
  }
  function zuruecksetzen(S) {
    const s = kopie(S.zug.start); S.tisch = s.tisch; S.spieler[S.amZug].bank = s.bank; return {ok: true};
  }

  /* ---------- Zug abschließen ---------- */
  function pruefeZug(S) {
    const L = lage(S);
    if (!L.gelegt.length) {
      if (L.tischGeaendert) return {ok: false, strafbar: true, grund: 'Du musst mindestens einen eigenen Stein auslegen – oder alles zurücksetzen und ziehen.'};
      return {ok: false, ziehen: true, grund: 'Du hast nichts gelegt. Zieh einen Stein.'};
    }
    if (L.ungueltig.length) return {ok: false, strafbar: true, grund: L.ungueltig.length === 1 ? 'Eine Serie auf dem Tisch ist ungültig.' : `${L.ungueltig.length} Serien auf dem Tisch sind ungültig.`};
    if (!L.raus && L.erstwert < 30) return {ok: false, strafbar: true, grund: `Für die erste Auslage fehlen ${30 - L.erstwert} Punkte (${L.erstwert} von 30).`};
    return {ok: true, L};
  }
  function zugBeenden(S) {
    const p = pruefeZug(S); if (!p.ok) return p;
    const i = S.amZug;
    const warRaus = S.spieler[i].raus;
    S.spieler[i].raus = true; S.gespielt[i] = true;
    S.letzte = {spieler: i, art: warRaus ? 'gelegt' : 'erste', steine: p.L.gelegt};
    if (!S.spieler[i].bank.length) { rundeEnde(S, i); return {ok: true, ende: true}; }
    weiter(S);
    return {ok: true};
  }
  function nimm(S, i, n) {
    const gezogen = [];
    for (let k = 0; k < n && S.pool.length; k++) { const id = S.pool.pop(); S.spieler[i].bank.push(id); gezogen.push(id); }
    if (gezogen.length && !S.pool.length && !S.schluss) S.schluss = {letzter: i, rest: S.spieler.length, wieder: true};
    return gezogen;
  }
  function ziehen(S) {
    if (S.phase !== 'zug') return {ok: false, grund: 'Gerade nicht.'};
    const L = lage(S);
    if (L.tischGeaendert || L.gelegt.length) return {ok: false, grund: 'Setz erst den Zug zurück, dann kannst du ziehen.'};
    const i = S.amZug; S.gespielt[i] = true;
    const g = nimm(S, i, 1);
    S.letzte = {spieler: i, art: g.length ? 'gezogen' : 'passt', steine: g};
    weiter(S);
    return {ok: true, gezogen: g, passt: !g.length};
  }
  function strafe(S, grundText = 'Zeit abgelaufen') {
    if (S.phase !== 'zug') return {ok: false};
    zuruecksetzen(S);
    const i = S.amZug; S.gespielt[i] = true;
    const g = nimm(S, i, 3);
    S.letzte = {spieler: i, art: 'strafe', steine: g, grund: grundText};
    weiter(S);
    return {ok: true, gezogen: g};
  }
  function weiter(S) {
    if (S.phase !== 'zug') return;
    const n = S.spieler.length;
    if (S.schluss) {
      if (S.schluss.wieder) { S.schluss.wieder = false; zugBeginnen(S); return; } // wer den letzten Stein zog, versucht es als Erster noch einmal
      S.schluss.rest--;
      if (S.schluss.rest <= 0) { rundeEndePoolLeer(S); return; }
    }
    S.amZug = (S.amZug + 1) % n;
    zugBeginnen(S);
  }

  /* ---------- Wertung ---------- */
  const bankSumme = b => b.reduce((a, id) => a + wertAufBrett(id), 0);
  function rundeEnde(S, gewinner) {
    const zeilen = S.spieler.map((s, i) => ({steine: s.bank.slice(), summe: bankSumme(s.bank), punkte: 0}));
    let plus = 0;
    zeilen.forEach((z, i) => { if (i !== gewinner) { z.punkte = -z.summe; plus += z.summe; } });
    zeilen[gewinner].punkte = plus;
    abschliessen(S, {art: 'aus', gewinner: [gewinner], zeilen});
  }
  function rundeEndePoolLeer(S) {
    const zeilen = S.spieler.map(s => ({steine: s.bank.slice(), summe: bankSumme(s.bank), punkte: -bankSumme(s.bank)}));
    const min = Math.min(...zeilen.map(z => z.summe));
    let kand = zeilen.map((z, i) => i).filter(i => zeilen[i].summe === min);
    const minAnz = Math.min(...kand.map(i => zeilen[i].steine.length));
    kand = kand.filter(i => zeilen[i].steine.length === minAnz);
    abschliessen(S, {art: 'poolLeer', gewinner: kand, zeilen});
  }
  function abschliessen(S, r) {
    r.runde = S.runde;
    r.zeilen.forEach((z, i) => S.spieler[i].summe += z.punkte);
    S.runden.push(r); S.ergebnis = r; S.phase = 'rundenende'; S.zug = null;
    if (S.opt.runden > 0 && S.runde >= S.opt.runden) { S.phase = 'spielende'; S.sieger = siegerListe(S); }
  }
  function siegerListe(S) { const max = Math.max(...S.spieler.map(s => s.summe)); return S.spieler.map((s, i) => i).filter(i => S.spieler[i].summe === max); }
  function spielBeenden(S) { if (S.phase === 'rundenende') { S.phase = 'spielende'; S.sieger = siegerListe(S); } return S; }
  function naechsteRunde(S, rnd = zufallStd) { if (S.phase !== 'rundenende') return S; return neueRunde(S, rnd); }

  return {FARBEN, JOKER, stein, istJoker, name, wertAufBrett, analyse, ordnen, neuesSpiel, neueRunde, paare, darfNeuMischen, neuMischen,
    sortieren, lage, beweglich, zielErlaubt, verschieben, zuruecksetzen, pruefeZug, zugBeenden, ziehen, strafe, bankSumme,
    spielBeenden, naechsteRunde};
})();
if (typeof module !== 'undefined') module.exports = Zahlenromme; else window.Zahlenromme = Zahlenromme;
