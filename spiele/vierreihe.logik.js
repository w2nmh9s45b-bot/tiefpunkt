/* Vier in einer Reihe – reine Spielregeln, ohne DOM.
   Regelquellen (recherchiert 08.11.2026): de.wikipedia „Vier gewinnt“ und die gängigen Spielanleitungen
   (7 Spalten × 6 Reihen, Scheiben fallen bis auf die unterste freie Stelle, abwechselnd, wer zuerst vier eigene
   Scheiben waagerecht, senkrecht oder diagonal in einer Reihe hat, gewinnt; volles Brett ohne Gewinner = unentschieden).
   Auslegungen: Fünf oder mehr in einer Linie zählen ebenfalls als Gewinn (gewonnen ist, wer vier hat; die ganze
   zusammenhängende Linie wird als Gewinnreihe markiert). Wer beginnt, wechselt von Partie zu Partie (Sache der Seite).
   Spieler sind 1 und 2. Spalten 0..6 von links, Reihen 0..5 von unten. */
(function () {
  'use strict';
  const SP = 7, RE = 6;
  const klon = s => JSON.parse(JSON.stringify(s));
  const gegner = p => 3 - p;
  function neu(opts = {}) {
    const start = opts.start === 2 ? 2 : 1;
    return {sp: Array.from({length: SP}, () => []), am: start, start, sieger: 0, linie: [], zuege: []};
  }
  const feld = (s, c, r) => (c >= 0 && c < SP && r >= 0 && r < RE) ? (s.sp[c][r] || 0) : -1;
  const zuege = s => s.sieger ? [] : s.sp.map((l, c) => l.length < RE ? c : -1).filter(c => c >= 0);
  // Gewinnlinie durch (c,r): zusammenhängende Linie ≥ 4 in einer der vier Richtungen, sonst leer
  function linieDurch(s, c, r) {
    const p = feld(s, c, r);
    for (const [dc, dr] of [[1, 0], [0, 1], [1, 1], [1, -1]]) {
      const l = [[c, r]];
      for (let k = 1; feld(s, c + dc * k, r + dr * k) === p; k++) l.push([c + dc * k, r + dr * k]);
      for (let k = 1; feld(s, c - dc * k, r - dr * k) === p; k++) l.unshift([c - dc * k, r - dr * k]);
      if (l.length >= 4) return l;
    }
    return [];
  }
  function setzen(s, c) {
    if (s.sieger) throw new Error('Partie ist beendet');
    if (!(c >= 0 && c < SP) || s.sp[c].length >= RE) throw new Error('Spalte nicht möglich');
    const n = klon(s), r = n.sp[c].length;
    n.sp[c].push(n.am); n.zuege.push(c); n.letzter = [c, r];
    const l = linieDurch(n, c, r);
    if (l.length) { n.sieger = n.am; n.linie = l; return n; }
    if (n.zuege.length === SP * RE) { n.sieger = 'remis'; return n; }
    n.am = gegner(n.am); return n;
  }
  // Letzten Zug zurücknehmen (nur solange die Partie läuft)
  function zurueck(s) {
    if (s.sieger || !s.zuege.length) return s;
    let n = neu({start: s.start});
    s.zuege.slice(0, -1).forEach(c => { n = setzen(n, c); });
    return n;
  }
  const api = {SP, RE, neu, zuege, setzen, zurueck, feld, gegner, linieDurch};
  if (typeof module !== 'undefined') module.exports = api; else window.Vierreihe = api;
})();
