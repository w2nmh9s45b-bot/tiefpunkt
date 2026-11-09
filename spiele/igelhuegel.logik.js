/* Igelhügel – reine Spielregeln (ohne DOM).
 *
 * REGELQUELLE: offizielle Spielanleitung des Vorbilds („Das total verdrehte Hasenrennen für 2–4 Spieler“,
 * Ravensburger Nr. 22 225 4, © 2001/2013; PDF über spielezar.ch). Daraus übernommen, 1:1:
 *   - 2–4 Personen, jede mit VIER Figuren einer Farbe. Alle stehen anfangs vor dem Aufgang (Startwiese, hier Feld 0).
 *   - Verdeckter Kartenstapel. Wer dran ist, deckt die oberste Karte auf. Danach geht es reihum (im Uhrzeigersinn).
 *   - Laufkarte (1, 2 oder 3 Felder): mit EINER beliebigen eigenen Figur so viele Felder bergauf. Man darf immer wählen,
 *     ob man eine neue Figur einsetzt oder eine schon laufende weiterzieht.
 *   - Auf einem Feld steht immer nur eine Figur. Besetzte Felder werden übersprungen und NICHT mitgezählt.
 *     Löcher werden mitgezählt; eine Figur fällt nur hinein, wenn ihr Zug genau dort endet.
 *   - Drehkarte: die Spitze (hier: die Windmühle oben am Apfelbaum) eine Raste weiterdrehen. Öffnet sich dabei ein Feld,
 *     entsteht ein Loch; steht dort eine Figur, fällt sie hinein und ist aus dem Spiel.
 *   - Wer alle vier Figuren verloren hat, setzt bis zum Ende der Partie aus.
 *   - Aufgedeckte Karten kommen beiseite; ist der Stapel leer, werden sie gemischt und bilden den neuen Stapel.
 *   - Gewonnen hat, wer als Erste/r eine Figur oben ankommen lässt (hier: am Apfelbaum). Überzählige Schritte verfallen.
 *
 * AUSLEGUNGEN (wo die Anleitung schweigt oder das Material physisch ist):
 *   A1 Kartenverteilung (in der Anleitung nicht genannt): 48 Karten = 24× „1 Feld“, 9× „2 Felder“, 3× „3 Felder“,
 *      12× „Drehen“ (Angabe aus dem Brettspiel-Forum spielen.de, Inhalt des Originalstapels).
 *   A2 Der Pfad hat 27 Felder bis zum Ziel (Feld 28 = Apfelbaum). Neun Felder sind „hohl“ (können sich öffnen),
 *      die übrigen sind sicher – wie die sicheren und unsicheren Felder des Vorbilds. Auf dem Brett sieht man,
 *      welche Felder hohl sind.
 *   A3 Die Mechanik unter dem Hügel ist eine Scheibe mit Rasten: Zu jeder Raste gehört ein festes Muster offener Löcher
 *      (ein oder zwei der hohlen Felder). Die Scheibe (Reihenfolge der Muster) wird zu Beginn jeder Partie zufällig
 *      gebaut und bleibt geheim – wie beim Vorbild weiß niemand, welches Loch als Nächstes aufgeht. Zu Beginn ist
 *      kein Loch offen. Beim Drehen schließen sich die bisher offenen Löcher, die neuen öffnen sich.
 *   A4 Ein Zug, der auf einem offenen Loch endet, ist erlaubt (die Figur fällt hinein); die Bedienung warnt davor.
 *   A5 Hat niemand mehr eine Figur im Spiel, endet die Partie ohne Sieger.
 *   A6 Wer beginnt: laut Anleitung die jüngste Person – auf der Startseite wählbar (Spieler 1 oder Zufall).
 *   A7 Die neuere Ausgabe des Vorbilds kennt zusätzlich drei Hindernisse (Maulwurf, Zugbrücke, Gatter), die an den
 *      Bau des Spielplans gebunden sind. Igelhügel spielt das Grundspiel mit Löchern (siehe Abschlussbericht).
 */
"use strict";
(function () {
  const FELDER = 27;                 // Pfadfelder 1..27
  const ZIEL = 28;                   // am Apfelbaum
  const START = 0, RAUS = -1;        // Startwiese, ins Loch gefallen
  const IGEL = 4;                    // Figuren je Person
  const HOHL = [3, 6, 8, 11, 14, 17, 20, 23, 25];
  const RASTEN = 12;
  const KARTEN = {1: 24, 2: 9, 3: 3, D: 12};

  // Zufall: Standard Math.random, für Tests ersetzbar (rng() ∈ [0,1)).
  const ganz = (rng, n) => Math.min(n - 1, Math.floor(rng() * n));
  function mischen(arr, rng) { for (let i = arr.length - 1; i > 0; i--) { const j = ganz(rng, i + 1); [arr[i], arr[j]] = [arr[j], arr[i]]; } return arr; }
  function stapelBauen(rng) {
    const s = [];
    for (const [k, n] of Object.entries(KARTEN)) for (let i = 0; i < n; i++) s.push(k === 'D' ? 'D' : Number(k));
    return mischen(s, rng);
  }
  // Scheibe mit RASTEN Mustern; aufeinanderfolgende Muster sind verschieden, jedes Loch kommt mindestens einmal vor.
  function scheibeBauen(rng) {
    const folge = [];
    const reihe = mischen(HOHL.slice(), rng);
    for (let i = 0; i < RASTEN; i++) {
      let m;
      for (let v = 0; v < 30; v++) {
        const a = i < reihe.length ? reihe[i] : HOHL[ganz(rng, HOHL.length)];
        m = [a];
        if (rng() < 0.35) { const b = HOHL[ganz(rng, HOHL.length)]; if (b !== a) m.push(b); }
        m.sort((x, y) => x - y);
        const vor = folge[i - 1];
        if (!vor || m.join() !== vor.join()) break;
      }
      folge.push(m);
    }
    return folge;
  }

  function neu({anzahl = 2, start = 0, rng = Math.random} = {}) {
    if (!(anzahl >= 2 && anzahl <= 4)) throw new Error('2 bis 4 Personen');
    return {
      n: anzahl, am: start % anzahl, start: start % anzahl,
      igel: Array.from({length: anzahl}, () => Array(IGEL).fill(START)),
      stapel: stapelBauen(rng), ablage: [], karte: null,
      phase: 'ziehen',              // ziehen | zug | drehen | ende
      kurbel: {pos: -1, folge: scheibeBauen(rng), dreh: 0},
      offen: [], sieger: null, nr: 0, zuege: 0, letzt: null
    };
  }
  const kopie = S => JSON.parse(JSON.stringify(S));

  /** Wer steht auf Feld f (1..27)? → [spieler, igel] oder null */
  function besetzt(S, f) {
    for (let p = 0; p < S.n; p++) for (let i = 0; i < IGEL; i++) if (S.igel[p][i] === f) return [p, i];
    return null;
  }
  const imSpiel = (S, p) => S.igel[p].some(x => x !== RAUS);

  /** Wohin führt ein Zug von Feld `von` mit `k` Schritten? Besetzte Felder zählen nicht, Löcher zählen. */
  function weg(S, von, k) {
    let f = von; const pfad = [];
    for (let s = 0; s < k; s++) {
      f++;
      while (f <= FELDER && besetzt(S, f)) f++;
      if (f > FELDER) { f = ZIEL; pfad.push(f); break; }
      pfad.push(f);
    }
    return {nach: f, pfad, fiel: f !== ZIEL && S.offen.includes(f)};
  }

  /** Mögliche Züge der Person am Zug (nur in Phase „zug“): je Figur Ziel und Pfad. Wartende Figuren sind gleichwertig –
   *  `neu` markiert die erste wartende, die übrigen wartenden haben `gleich: true`. */
  function zuege(S) {
    if (S.phase !== 'zug' || typeof S.karte !== 'number') return [];
    const p = S.am, out = []; let ersteWartende = true;
    S.igel[p].forEach((pos, i) => {
      if (pos === RAUS || pos === ZIEL) return;
      const w = weg(S, pos, S.karte);
      const neuer = pos === START;
      out.push({igel: i, von: pos, nach: w.nach, pfad: w.pfad, fiel: w.fiel, neu: neuer, gleich: neuer && !ersteWartende});
      if (neuer) ersteWartende = false;
    });
    return out;
  }

  function naechster(S) {
    for (let d = 1; d <= S.n; d++) { const q = (S.am + d) % S.n; if (imSpiel(S, q)) return q; }
    return null;
  }
  function weiter(S) {
    if (S.karte != null) { S.ablage.push(S.karte); S.karte = null; }
    const q = naechster(S);
    if (q == null) { S.phase = 'ende'; S.sieger = 'niemand'; return S; }
    S.am = q; S.phase = 'ziehen';
    return S;
  }

  /** Karte aufdecken (Phase „ziehen“). */
  function ziehen(S0, rng = Math.random) {
    if (S0.phase !== 'ziehen') throw new Error('Jetzt wird keine Karte gezogen');
    const S = kopie(S0);
    let gemischt = false;
    if (!S.stapel.length) { S.stapel = mischen(S.ablage, rng); S.ablage = []; gemischt = true; }
    S.karte = S.stapel.pop();
    S.phase = S.karte === 'D' ? 'drehen' : 'zug';
    S.nr++; S.letzt = {art: 'karte', spieler: S.am, karte: S.karte, gemischt};
    return S;
  }

  /** Figur `igel` der Person am Zug laufen lassen (Phase „zug“). */
  function ziehe(S0, igel) {
    if (S0.phase !== 'zug') throw new Error('Jetzt wird nicht gezogen');
    const z = zuege(S0).find(m => m.igel === igel);
    if (!z) throw new Error('Diese Figur kann nicht ziehen');
    const S = kopie(S0), p = S.am;
    S.igel[p][igel] = z.fiel ? RAUS : z.nach;
    S.nr++; S.zuege++;
    S.letzt = {art: 'zug', spieler: p, igel, von: z.von, pfad: z.pfad, fiel: z.fiel, ziel: z.nach === ZIEL};
    if (z.nach === ZIEL) { S.ablage.push(S.karte); S.karte = null; S.phase = 'ende'; S.sieger = p; return S; }
    return weiter(S);
  }

  /** Windmühle eine Raste weiterdrehen (Phase „drehen“). */
  function drehen(S0) {
    if (S0.phase !== 'drehen') throw new Error('Jetzt wird nicht gedreht');
    const S = kopie(S0), alt = S.offen.slice();
    S.kurbel.pos = (S.kurbel.pos + 1) % S.kurbel.folge.length;
    S.kurbel.dreh++;
    S.offen = S.kurbel.folge[S.kurbel.pos].slice();
    const gefallen = [];
    for (const f of S.offen) { const b = besetzt(S, f); if (b) { S.igel[b[0]][b[1]] = RAUS; gefallen.push({spieler: b[0], igel: b[1], feld: f}); } }
    S.nr++; S.zuege++;
    S.letzt = {art: 'drehen', spieler: S.am, offen: S.offen.filter(f => !alt.includes(f)), zu: alt.filter(f => !S.offen.includes(f)), gefallen};
    return weiter(S);
  }

  /** Stand für ein Gerät im Netzspiel: Stapelreihenfolge und Scheibe bleiben geheim. */
  function oeffentlich(S) {
    const o = kopie(S);
    o.stapel = S.stapel.length;
    o.kurbel = {pos: S.kurbel.pos, dreh: S.kurbel.dreh};
    return o;
  }
  const zaehlen = (S, p) => {
    const a = S.igel[p]; return {start: a.filter(x => x === START).length, pfad: a.filter(x => x > 0 && x <= FELDER).length,
      raus: a.filter(x => x === RAUS).length, ziel: a.filter(x => x === ZIEL).length};
  };

  const X = {FELDER, ZIEL, START, RAUS, IGEL, HOHL, RASTEN, KARTEN, neu, ziehen, ziehe, drehen, zuege, weg, besetzt, imSpiel,
    naechster, oeffentlich, zaehlen, stapelBauen, scheibeBauen, kopie};
  if (typeof module !== 'undefined') module.exports = X; else window.Igelhuegel = X;
})();
