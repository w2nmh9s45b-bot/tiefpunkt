/* Zahnweh – Spielregeln ohne DOM.
 *
 * Regelquelle: Anleitung des Vorbilds (Geschicklichkeits-/Glücksspiel mit Zahnarzt-Krokodil, Hasbro): Das Maul steht
 * offen. Reihum drückt jede Person genau einen Zahn hinunter. Einer der Zähne ist der „wunde“ Zahn – wer ihn drückt,
 * bei dem schnappt das Maul zu, und diese Person hat verloren. Vor jeder Runde wird das Maul neu gespannt, damit niemand
 * weiß, welcher Zahn es diesmal ist. Das Spielzeug hat 13 Zähne im Unterkiefer.
 * Auslegungen fürs Gerät:
 *  - Der wunde Zahn wird vor jeder Runde zufällig und geheim ausgelost (gleich wahrscheinlich unter allen Zähnen).
 *    Ein gedrückter Zahn bleibt unten und kann nicht noch einmal gedrückt werden.
 *  - Spielarten (Startseite):
 *     · „Eine Runde“ (Grundregel, Vorgabe): Wer gebissen wird, verliert; alle anderen gewinnen.
 *     · „Ausscheiden“: Wer gebissen wird, scheidet aus. Gespielt wird, bis eine Person übrig ist – sie gewinnt.
 *     · „Fünf Runden“: Wer gebissen wird, bekommt einen Zahnwehpunkt. Nach fünf Runden gewinnt, wer die wenigsten
 *       Punkte hat (Gleichstand = geteilter Sieg).
 *  - Die gebissene Person beginnt die nächste Runde (ist sie ausgeschieden, die nächste im Uhrzeigersinn).
 */
"use strict";
(function () {
  const ZAEHNE = 13, RUNDEN_PUNKTE = 5;
  const kopie = s => JSON.parse(JSON.stringify(s));
  const zufallStd = n => Math.floor(Math.random() * n);

  function neu({anzahl = 2, modus = 'eine', start = 0, zufall = zufallStd} = {}) {
    if (!(anzahl >= 2 && anzahl <= 6)) throw new Error('2 bis 6 Personen');
    if (!['eine', 'raus', 'punkte'].includes(modus)) modus = 'eine';
    return {
      n: anzahl, modus, zaehne: ZAEHNE, rundenZiel: modus === 'punkte' ? RUNDEN_PUNKTE : null,
      runde: 1, am: start % anzahl, starter: start % anzahl,
      gedrueckt: [], schnapp: zufall(ZAEHNE), zu: false, gebissen: null,
      punkte: Array(anzahl).fill(0), raus: Array(anzahl).fill(false),
      phase: 'spiel', sieger: null, verloren: null, nr: 0, verlauf: [],
    };
  }
  const aktiv = (s, p) => !s.raus[p];
  const aktive = s => [...Array(s.n).keys()].filter(p => aktiv(s, p));
  function naechster(s, p) { for (let i = 1; i <= s.n; i++) { const q = (p + i) % s.n; if (aktiv(s, q)) return q; } return p; }
  /** Zähne, die man noch drücken kann */
  const frei = s => (s.phase !== 'spiel' || s.zu) ? [] : [...Array(s.zaehne).keys()].filter(z => !s.gedrueckt.includes(z));

  /** Person am Zug drückt Zahn z. */
  function druecken(s0, z) {
    if (s0.phase !== 'spiel' || s0.zu) throw new Error('Gerade wird nicht gedrückt.');
    if (!(Number.isInteger(z) && z >= 0 && z < s0.zaehne)) throw new Error('Diesen Zahn gibt es nicht.');
    if (s0.gedrueckt.includes(z)) throw new Error('Dieser Zahn ist schon unten.');
    const s = kopie(s0), p = s.am;
    s.gedrueckt.push(z); s.nr++;
    if (z !== s.schnapp) { s.am = naechster(s, p); return s; }
    // Zugeschnappt
    s.zu = true; s.gebissen = p; s.verlauf.push({runde: s.runde, gebissen: p, zahn: z, gedrueckt: s.gedrueckt.length});
    if (s.modus === 'eine') { s.phase = 'ende'; s.verloren = [p]; s.sieger = aktive(s).filter(q => q !== p); return s; }
    if (s.modus === 'raus') {
      s.raus[p] = true;
      const rest = aktive(s);
      if (rest.length <= 1) { s.phase = 'ende'; s.sieger = rest; s.verloren = null; return s; }
      s.phase = 'rundenende'; return s;
    }
    s.punkte[p]++;
    if (s.runde >= s.rundenZiel) {
      const min = Math.min(...s.punkte);
      s.phase = 'ende'; s.sieger = [...Array(s.n).keys()].filter(q => s.punkte[q] === min); return s;
    }
    s.phase = 'rundenende'; return s;
  }
  /** Nach dem Zuschnappen: Maul neu spannen, neuer geheimer Zahn. */
  function naechsteRunde(s0, zufall = zufallStd) {
    if (s0.phase !== 'rundenende') throw new Error('Die Runde läuft noch.');
    const s = kopie(s0);
    s.runde++; s.gedrueckt = []; s.zu = false; s.schnapp = zufall(s.zaehne); s.nr++;
    const b = s.gebissen;
    s.am = aktiv(s, b) ? b : naechster(s, b); s.starter = s.am; s.gebissen = null; s.phase = 'spiel';
    return s;
  }
  /** Gleiche Personen, neues Spiel; die Person nach der letzten Startperson beginnt. */
  function nochmal(s0, zufall = zufallStd) { return neu({anzahl: s0.n, modus: s0.modus, start: (s0.starter + 1) % s0.n, zufall}); }
  /** Was ein Mitspielergerät sehen darf: alles außer dem wunden Zahn, solange das Maul offen ist. */
  function sicht(s) { const c = kopie(s); if (!c.zu) delete c.schnapp; return c; }
  /** Anteil gedrückter Zähne → wie nervös das Tier schaut (0 ruhig … 3 sehr nervös) */
  function nervoes(s) { const f = s.gedrueckt.length / s.zaehne; return s.zu ? 4 : f < .25 ? 0 : f < .5 ? 1 : f < .75 ? 2 : 3; }

  const X = {ZAEHNE, RUNDEN_PUNKTE, neu, druecken, naechsteRunde, nochmal, frei, aktive, sicht, nervoes, naechster};
  if (typeof module !== 'undefined') module.exports = X; else window.Zahnweh = X;
})();
