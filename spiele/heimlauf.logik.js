/* Heimlauf – Spielregeln ohne DOM.
 *
 * Regelquelle: offizielle Spielanleitung des Vorbilds (Schmidt Spiele, Ausgabe 51204, „Spielanleitung – Das beliebte
 * Würfelspiel für 2–4 Personen“), abgerufen am 09.11.2026. Grundregeln:
 *  - 4 Figuren je Person. Zu Beginn steht EINE Figur auf dem eigenen Startfeld (A), die drei übrigen im Haus (B).
 *  - Reihum (im Uhrzeigersinn) wird gewürfelt und eine eigene Figur um die volle Augenzahl vorgezogen. Eigene und fremde
 *    Figuren dürfen übersprungen werden, besetzte Felder zählen mit. Auf jedem Feld steht höchstens eine Figur.
 *  - Trifft der letzte Schritt eine fremde Figur, wird sie geschlagen (zurück ins Haus). Eigene Figuren können nicht
 *    geschlagen werden – dann muss eine andere Figur ziehen. Grundregel: KEIN Schlagzwang.
 *  - Solange Figuren im Haus warten, darf keine eigene Figur auf dem Startfeld stehen bleiben: Sie muss es freimachen,
 *    sobald sie kann.
 *  - Aus dem Haus kommt man nur mit einer 6. Bei einer 6 MUSS eine Figur herausgesetzt werden, solange welche im Haus
 *    stehen. Steht auf dem Startfeld eine eigene Figur, muss erst diese mit der 6 weiterziehen. Eine fremde Figur auf dem
 *    Startfeld wird geschlagen.
 *  - Nach einer 6 darf noch einmal gewürfelt werden (auch mehrmals). Kann die 6 nicht gezogen werden, entfällt der
 *    weitere Wurf. Wer mit der 6 die letzte Figur ins Ziel bringt, würfelt nicht noch einmal.
 *  - Zielfelder werden einzeln gezählt, nur mit passendem Wurf (kein Überschießen). Im Ziel darf übersprungen werden.
 *  - Wer zuerst alle vier Figuren im Ziel hat, gewinnt; die anderen dürfen um die weiteren Plätze weiterspielen.
 *  - Kann gar keine Figur ziehen, ist die nächste Person dran.
 * Varianten aus derselben Anleitung, hier als beschriftete Optionen (Vorgabe aus = Grundregel):
 *  - „Dreimal würfeln“: Wer keine Figur auf der Laufbahn hat (alle im Haus) und deren Figuren im Ziel nicht mehr
 *    vorrücken können, darf bis zu dreimal würfeln, um eine 6 zu bekommen.
 *  - „Schlagzwang“: Fremde Figuren müssen geschlagen werden, wenn es geht. Auslegung fürs Gerät: Statt die säumige Figur
 *    nachträglich zurückzusetzen, bietet das Spiel dann nur Schlagzüge an (bei mehreren darf man wählen).
 *    Die Pflichten der Grundregel (Herauskommen mit der 6, Startfeld freimachen) gehen dem Schlagzwang vor.
 *  - „Überspringen im Ziel verboten“.
 * Auslegungen:
 *  - Kann die Figur auf dem Startfeld nicht ziehen (eigene Figur steht im Weg), darf eine andere Figur ziehen.
 *  - Zu zweit sitzen die Farben einander gegenüber (Ecke 1 und 3), zu dritt Ecke 1–3. Die Varianten „zwei Farben je
 *    Person“, „neutrale Farbe“, „Rückwärtsschlagen“ und „Barrieren“ sind nicht eingebaut.
 *
 * Darstellung der Figurenstände: -1 = Haus, 0..39 = Schritte ab dem eigenen Startfeld auf der Laufbahn, 40..43 = Ziel a–d.
 * Laufbahnfeld absolut = (10 · Ecke + Schritt) mod 40.
 */
"use strict";
(function () {
  const HAUS = -1, ZIEL = 40, LETZT = 43;

  // Brett: 11 × 11 Raster, Ecke 0 unten links. Laufbahn im Uhrzeigersinn ab dem Startfeld von Ecke 0.
  const BAHN0 = [[4, 10], [4, 9], [4, 8], [4, 7], [4, 6], [3, 6], [2, 6], [1, 6], [0, 6], [0, 5],
    [0, 4], [1, 4], [2, 4], [3, 4], [4, 4], [4, 3], [4, 2], [4, 1], [4, 0], [5, 0],
    [6, 0], [6, 1], [6, 2], [6, 3], [6, 4], [7, 4], [8, 4], [9, 4], [10, 4], [10, 5],
    [10, 6], [9, 6], [8, 6], [7, 6], [6, 6], [6, 7], [6, 8], [6, 9], [6, 10], [5, 10]];
  const dreh = ([x, y], k) => { for (let i = 0; i < k; i++) [x, y] = [10 - y, x]; return [x, y]; };
  const HAUS0 = [[0, 9], [1, 9], [0, 10], [1, 10]], ZIEL0 = [[5, 9], [5, 8], [5, 7], [5, 6]];
  const BRETT = {
    bahn: BAHN0,
    haus: [0, 1, 2, 3].map(e => HAUS0.map(p => dreh(p, e))),
    ziel: [0, 1, 2, 3].map(e => ZIEL0.map(p => dreh(p, e))),
  };
  const ECKEN = {2: [0, 2], 3: [0, 1, 2], 4: [0, 1, 2, 3]};

  const kopie = s => JSON.parse(JSON.stringify(s));
  function neu({anzahl = 4, optionen = {}, start = 0} = {}) {
    if (!ECKEN[anzahl]) throw new Error('2 bis 4 Personen');
    return {
      n: anzahl, ecke: ECKEN[anzahl].slice(),
      fig: Array.from({length: anzahl}, () => [0, HAUS, HAUS, HAUS]),
      am: start % anzahl, wurf: null, versuche: 0, phase: 'wuerfeln',
      fertig: [],             // Reihenfolge, in der Personen alle Figuren im Ziel hatten
      sieger: null, weiter: false,
      opt: {dreimal: optionen.dreimal === 'an', schlagzwang: optionen.schlagzwang === 'an', zielsprung: optionen.zielsprung === 'verboten' ? 'verboten' : 'erlaubt'},
      wurfNr: 0, zugNr: 0, letzterWurf: null, letzter: null,
    };
  }
  const absolut = (s, p, rel) => (s.ecke[p] * 10 + rel) % 40;
  /** Welche Figur steht auf dem Laufbahnfeld (absolut)? → {p, f} oder null */
  function aufFeld(s, abs) {
    for (let p = 0; p < s.n; p++) for (let f = 0; f < 4; f++) { const r = s.fig[p][f]; if (r >= 0 && r < ZIEL && absolut(s, p, r) === abs) return {p, f}; }
    return null;
  }
  const imHaus = (s, p) => s.fig[p].filter(r => r === HAUS).length;
  const imZiel = (s, p) => s.fig[p].filter(r => r >= ZIEL).length;
  const istFertig = (s, p) => imZiel(s, p) === 4;
  /** Rückt eine Figur im Ziel mit irgendeinem Wurf noch vor? */
  function kannImZielVor(s, p, f) {
    const r = s.fig[p][f]; if (r < ZIEL) return false;
    for (let w = 1; w <= LETZT - r; w++) if (zielZug(s, p, f, w)) return true;
    return false;
  }
  /** Bedingung der Variante „Dreimal würfeln“ */
  function dreimalErlaubt(s, p = s.am) {
    if (!s.opt.dreimal) return false;
    return s.fig[p].every((r, f) => r === HAUS || (r >= ZIEL && !kannImZielVor(s, p, f)));
  }
  /** Ziel einer Figur bei Wurf w ohne Pflichtregeln (oder null) */
  function zielZug(s, p, f, w) {
    const r = s.fig[p][f];
    if (r === HAUS) {
      if (w !== 6) return null;
      if (s.fig[p].some(x => x === 0)) return null;
      return {p, f, von: HAUS, nach: 0, raus: true, schlag: fremd(s, p, absolut(s, p, 0))};
    }
    const nach = r + w;
    if (nach > LETZT) return null;
    if (nach >= ZIEL) {
      if (s.fig[p].some((x, g) => g !== f && x === nach)) return null;
      if (s.opt.zielsprung === 'verboten' && s.fig[p].some((x, g) => g !== f && x >= Math.max(ZIEL, r + 1) && x < nach)) return null;
      return {p, f, von: r, nach, raus: false, schlag: null};
    }
    if (s.fig[p].some((x, g) => g !== f && x === nach)) return null;
    return {p, f, von: r, nach, raus: false, schlag: fremd(s, p, absolut(s, p, nach))};
  }
  function fremd(s, p, abs) { const a = aufFeld(s, abs); return a && a.p !== p ? a : null; }

  /** Erlaubte Züge der Person am Zug für den aktuellen Wurf, Pflichtregeln eingerechnet. */
  function zuege(s) {
    if (s.phase !== 'ziehen' || s.wurf == null) return [];
    const p = s.am, w = s.wurf, alle = [];
    for (let f = 0; f < 4; f++) { const z = zielZug(s, p, f, w); if (z) alle.push(z); }
    const wartend = imHaus(s, p) > 0, aufStart = s.fig[p].indexOf(0);
    let m = alle;
    if (w === 6 && wartend && aufStart < 0) m = alle.filter(z => z.raus);
    else if (wartend && aufStart >= 0) { const st = alle.filter(z => z.f === aufStart); if (st.length) m = st; }
    if (s.opt.schlagzwang && m.some(z => z.schlag)) m = m.filter(z => z.schlag);
    return m;
  }
  function naechster(s) {
    if (s.fertig.length >= s.n - 1 && s.weiter) return s.am;
    let q = s.am;
    for (let i = 0; i < s.n; i++) { q = (q + 1) % s.n; if (!istFertig(s, q)) return q; }
    return s.am;
  }
  function weiterreichen(s) { s.am = naechster(s); s.wurf = null; s.versuche = 0; s.phase = 'wuerfeln'; }

  /** Würfeln mit Augenzahl w (1–6). Ergebnis in s.letzterWurf.folge: 'ziehen' | 'nochmal' | 'weiter'. */
  function wuerfeln(s0, w) {
    const s = kopie(s0);
    if (s.phase !== 'wuerfeln') throw new Error('Jetzt wird nicht gewürfelt.');
    if (!(w >= 1 && w <= 6)) throw new Error('Augenzahl');
    const p = s.am, darfDreimal = dreimalErlaubt(s);
    s.wurf = w; s.versuche++; s.wurfNr++; s.phase = 'ziehen';
    const m = zuege(s);
    let folge = 'ziehen';
    if (!m.length) {
      if (darfDreimal && w !== 6 && s.versuche < 3) { folge = 'nochmal'; s.phase = 'wuerfeln'; s.wurf = null; }
      else { folge = 'weiter'; weiterreichen(s); }
    }
    s.letzterWurf = {p, w, folge, versuch: s0.versuche + 1, dreimal: darfDreimal};
    return s;
  }
  /** Figur f der Person am Zug ziehen. */
  function ziehen(s0, f) {
    const z = zuege(s0).find(x => x.f === f);
    if (!z) throw new Error('Diese Figur kann so nicht ziehen.');
    const s = kopie(s0), p = s.am;
    if (z.schlag) s.fig[z.schlag.p][z.schlag.f] = HAUS;
    s.fig[p][f] = z.nach;
    s.zugNr++;
    s.letzter = {p, f, von: z.von, nach: z.nach, raus: z.raus, schlag: z.schlag ? {p: z.schlag.p, f: z.schlag.f, abs: absolut(s0, z.schlag.p, s0.fig[z.schlag.p][z.schlag.f])} : null, nr: s.zugNr};
    const sechs = s.wurf === 6;
    if (istFertig(s, p) && !s.fertig.includes(p)) {
      s.fertig.push(p);
      if (s.sieger == null) s.sieger = p;
      const rest = s.n - s.fertig.length;
      if (!s.weiter || rest <= 1) {
        if (rest <= 1 && s.weiter) { for (let q = 0; q < s.n; q++) if (!s.fertig.includes(q)) s.fertig.push(q); }
        s.phase = 'ende'; s.wurf = null; return s;
      }
      weiterreichen(s); return s;
    }
    if (sechs) { s.wurf = null; s.versuche = 0; s.phase = 'wuerfeln'; }
    else weiterreichen(s);
    return s;
  }
  /** Nach dem ersten Sieg um die weiteren Plätze weiterspielen. */
  function weiterspielen(s0) {
    const s = kopie(s0);
    if (s.phase !== 'ende' || s.n - s.fertig.length < 2) throw new Error('Nichts mehr zu spielen.');
    s.weiter = true; weiterreichen(s); return s;
  }
  /** Fortschritt in Schritten (für Platzierung der Übrigen): Haus 0, Laufbahn 1..40, Ziel 41..44 */
  const fortschritt = (s, p) => s.fig[p].reduce((a, r) => a + (r + 1), 0);
  /** Endstand: fertige in Reihenfolge, dann nach Fortschritt */
  function rangliste(s) {
    const rest = [...Array(s.n).keys()].filter(p => !s.fertig.includes(p)).sort((a, b) => fortschritt(s, b) - fortschritt(s, a));
    return [...s.fertig, ...rest];
  }
  /** Felder, über die eine Figur bei einem Zug läuft (Rasterkoordinaten, ohne Start) */
  function weg(s, p, von, nach) {
    const e = s.ecke[p], out = [];
    if (von === HAUS) return [feldVon(s, p, 0)];
    for (let r = von + 1; r <= nach; r++) out.push(feldVon(s, p, r));
    return out;
  }
  /** Rasterkoordinate eines Figurenstands (Haus: Platz f) */
  function feldVon(s, p, rel, f = 0) {
    const e = s.ecke[p];
    if (rel === HAUS) return BRETT.haus[e][f];
    if (rel >= ZIEL) return BRETT.ziel[e][rel - ZIEL];
    return BRETT.bahn[(e * 10 + rel) % 40];
  }

  const X = {HAUS, ZIEL, LETZT, BRETT, ECKEN, neu, zuege, wuerfeln, ziehen, weiterspielen, rangliste, fortschritt, weg, feldVon,
    absolut, aufFeld, imHaus, imZiel, istFertig, dreimalErlaubt, zielZug};
  if (typeof module !== 'undefined') module.exports = X; else window.Heimlauf = X;
})();
