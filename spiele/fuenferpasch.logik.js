/* Fünferpasch – reine Spielregeln (ohne DOM). Würfelspiel mit fünf Würfeln und 13 Feldern.

   QUELLE (abgerufen 08.11.2026): offizielle Spielanleitung des Originalverlags, aktuelle Ausgabe (PDF 49030 auf
   schmidtspiele.de), samt der dort abgedruckten „Meisterschaftsregel“. Vergleich: ältere Ausgaben derselben Reihe
   (Reise-Ausgabe 49091, Sammlung 49147) und spielstrategen.de/spiele/kniffel/regeln (drei Regelgenerationen).

   GRUNDREGEL (Vorgabe), wie hier umgesetzt
   - Wer beginnt: reihum wird einmal mit einem Würfel gewürfelt, die höchste Zahl beginnt (Gleichstand: die
     Gleichauf-Liegenden würfeln erneut). Danach geht es in der Sitzreihenfolge weiter.
   - Je Zug bis zu drei Würfe. Der erste Wurf mit allen fünf Würfeln, danach mit beliebig vielen. Behaltene Würfel
     dürfen vor dem nächsten Wurf wieder freigegeben werden („jedes Mal neu entscheiden“). Man darf früher aufhören.
   - Spätestens nach dem dritten Wurf in genau ein freies Feld eintragen. 13 Runden, dann Ende.
   - Oben: Einser … Sechser = Summe der Würfel dieser Zahl. Bonus 35, wenn oben zusammen mindestens 63.
   - Unten: Dreierpasch (mind. 3 gleiche, Summe aller Augen), Viererpasch (mind. 4 gleiche, Summe aller Augen),
     Full House 25 (drei gleiche und zwei gleiche ANDERE – fünf gleiche sind kein Full House), kleine Straße 30
     (vier aufeinanderfolgende), große Straße 40 (fünf aufeinanderfolgende), Fünferpasch 50 (fünf gleiche), Chance
     (Summe aller Augen).
   - Streichen (0 eintragen): „Erfüllt der Wurf keine der Bedingungen für die Kästchen, musst du … streichen.“
     Auslegung: Gibt mindestens ein freies Feld Punkte, muss in ein solches Feld eingetragen werden; nur wenn kein
     freies Feld Punkte bringt, wird ein beliebiges freies Feld gestrichen.
   - Weitere Fünferpasche: Steht im Fünferpasch-Feld bereits 50, bringt jeder weitere Fünferpasch 50 Zusatzpunkte.
     Zusätzlich darf er in ein beliebiges freies Feld mit dessen Höchstpunktzahl eingetragen werden, egal mit welcher
     Zahl er gewürfelt wurde (Einser 5, Zweier 10, … Sechser 30, Dreier- und Viererpasch 30, Full House 25,
     kleine Straße 30, große Straße 40, Chance 30). Auslegung: Ist das Fünferpasch-Feld leer, ist es der erste
     (normal eintragen); ist es gestrichen (0), gibt es weder Zusatzpunkte noch die freie Höchstwertung.
   - Gewonnen hat, wer die meisten Punkte hat; bei Gleichstand teilen sich die Gleichauf-Liegenden den Sieg.

   VARIANTE „Meisterschaft“ (Option regel = 'meister', laut derselben Anleitung)
   - Streichen ist jederzeit erlaubt (beliebiges freies Feld, 0).
   - Weitere Fünferpasche (Fünferpasch-Feld = 50): 50 Zusatzpunkte, und der Wurf wird in ein weiteres PASSENDES
     Feld eingetragen: oben nur bei seiner Zahl, unten nur Dreierpasch, Viererpasch oder Chance (je Summe). Full House
     und Straßen gehen nicht. Ist kein passendes Feld frei, wird ein Feld nach Wahl gestrichen.
*/
"use strict";
(function () {
  const OBEN = ['einser', 'zweier', 'dreier', 'vierer', 'fuenfer', 'sechser'];
  const UNTEN = ['dreierpasch', 'viererpasch', 'fullhouse', 'kleine', 'grosse', 'fuenferpasch', 'chance'];
  const FELDER = [...OBEN, ...UNTEN];
  const TITEL = {einser: 'Einser', zweier: 'Zweier', dreier: 'Dreier', vierer: 'Vierer', fuenfer: 'Fünfer', sechser: 'Sechser',
    dreierpasch: 'Dreierpasch', viererpasch: 'Viererpasch', fullhouse: 'Full House', kleine: 'Kleine Straße',
    grosse: 'Große Straße', fuenferpasch: 'Fünferpasch', chance: 'Chance'};
  const HOECHST = {einser: 5, zweier: 10, dreier: 15, vierer: 20, fuenfer: 25, sechser: 30, dreierpasch: 30, viererpasch: 30,
    fullhouse: 25, kleine: 30, grosse: 40, fuenferpasch: 50, chance: 30};
  const BONUS_AB = 63, BONUS = 35, ZUSATZ = 50, RUNDEN = 13;

  const summe = w => w.reduce((a, b) => a + b, 0);
  const zaehlen = w => { const z = [0, 0, 0, 0, 0, 0, 0]; w.forEach(x => z[x]++); return z; };
  function hatFolge(w, laenge) {
    const da = new Set(w);
    for (let s = 1; s + laenge - 1 <= 6; s++) { let ok = true; for (let k = 0; k < laenge; k++) if (!da.has(s + k)) ok = false; if (ok) return true; }
    return false;
  }
  const istFuenferpasch = w => w.length === 5 && w.every(x => x === w[0]);

  /** Punkte eines Wurfs in einem Feld nach den normalen Bedingungen (0 = Bedingung nicht erfüllt). */
  function punkte(feld, w) {
    const z = zaehlen(w), max = Math.max(...z);
    const oi = OBEN.indexOf(feld);
    if (oi >= 0) return z[oi + 1] * (oi + 1);
    switch (feld) {
      case 'dreierpasch': return max >= 3 ? summe(w) : 0;
      case 'viererpasch': return max >= 4 ? summe(w) : 0;
      case 'fullhouse': return z.includes(3) && z.includes(2) ? 25 : 0;
      case 'kleine': return hatFolge(w, 4) ? 30 : 0;
      case 'grosse': return hatFolge(w, 5) ? 40 : 0;
      case 'fuenferpasch': return max === 5 ? 50 : 0;
      case 'chance': return summe(w);
    }
    throw new Error('Unbekanntes Feld ' + feld);
  }

  /** Ist dieser Wurf ein weiterer Fünferpasch (Feld steht schon auf 50)? */
  const weitererFuenferpasch = (block, w) => istFuenferpasch(w) && block.fuenferpasch === 50;

  /**
   * Alle Eintragsmöglichkeiten für einen Block und Wurf.
   * Ergebnis: {feld: {punkte, art:'normal'|'hoechst'|'streichen'}} nur für erlaubte freie Felder; dazu .zusatz (bool).
   */
  function moeglichkeiten(block, w, regel = 'grund') {
    const frei = FELDER.filter(f => block[f] == null);
    const erg = {};
    const weiterer = weitererFuenferpasch(block, w);
    if (weiterer && regel === 'grund') {
      frei.forEach(f => erg[f] = {punkte: HOECHST[f], art: 'hoechst'});
    } else if (weiterer && regel === 'meister') {
      const zahl = OBEN[w[0] - 1];
      const passend = frei.filter(f => f === zahl || f === 'dreierpasch' || f === 'viererpasch' || f === 'chance');
      frei.forEach(f => erg[f] = passend.includes(f) ? {punkte: punkte(f, w), art: 'normal'} : {punkte: 0, art: 'streichen'});
    } else {
      const mitPunkten = frei.filter(f => punkte(f, w) > 0);
      if (regel === 'meister' || !mitPunkten.length) frei.forEach(f => { const p = punkte(f, w); erg[f] = {punkte: p, art: p > 0 ? 'normal' : 'streichen'}; });
      else mitPunkten.forEach(f => erg[f] = {punkte: punkte(f, w), art: 'normal'});
    }
    Object.defineProperty(erg, 'zusatz', {value: weiterer, enumerable: false});
    return erg;
  }

  function wertung(p) {
    const b = p.block;
    const oben = OBEN.reduce((a, f) => a + (b[f] || 0), 0);
    const bonus = oben >= BONUS_AB ? BONUS : 0;
    const unten = UNTEN.reduce((a, f) => a + (b[f] || 0), 0);
    const zusatz = (p.zusatz || 0) * ZUSATZ;
    return {oben, bonus, obenGesamt: oben + bonus, unten, zusatz, gesamt: oben + bonus + unten + zusatz, fehltBonus: Math.max(0, BONUS_AB - oben)};
  }

  /**
   * Wer beginnt: würfelt reihum einen Würfel, Höchste beginnen, bei Gleichstand würfeln nur die Gleichauf-Liegenden neu.
   * w6() liefert 1..6. Ergebnis: {beginner, runden:[[{i, wert}]]}.
   */
  function werBeginnt(anzahl, w6) {
    let im = [...Array(anzahl).keys()]; const runden = [];
    if (anzahl === 1) return {beginner: 0, runden};
    for (let k = 0; k < 50 && im.length > 1; k++) {
      const r = im.map(i => ({i, wert: w6()})); runden.push(r);
      const hoch = Math.max(...r.map(x => x.wert)); im = r.filter(x => x.wert === hoch).map(x => x.i);
    }
    return {beginner: im[0], runden};
  }

  function neu({namen, farben = [], optionen = {}, beginner = 0}) {
    if (!Array.isArray(namen) || namen.length < 1 || namen.length > 6) throw new Error('1 bis 6 Personen');
    const regel = optionen.regel === 'meister' ? 'meister' : 'grund';
    return {
      v: 1, regel,
      spieler: namen.map((n, i) => ({name: n, farbe: farben[i] || '#f2c14e', block: Object.fromEntries(FELDER.map(f => [f, null])), zusatz: 0})),
      beginner, dran: beginner, runde: 1, wurf: 0, wuerfel: [1, 2, 3, 4, 5], halten: [false, false, false, false, false],
      phase: 'zug', letzter: null, sieger: null
    };
  }

  function halten(s, i, an) {
    if (s.phase !== 'zug') throw new Error('Spiel vorbei');
    if (s.wurf === 0) throw new Error('Erst würfeln');
    if (s.wurf >= 3) throw new Error('Kein Wurf mehr übrig');
    s.halten[i] = an == null ? !s.halten[i] : !!an; return s;
  }
  /** neue: Werte für die nicht gehaltenen Würfel, in Reihenfolge. */
  function wuerfeln(s, neue) {
    if (s.phase !== 'zug') throw new Error('Spiel vorbei');
    if (s.wurf >= 3) throw new Error('Höchstens drei Würfe');
    if (s.wurf === 0) s.halten = [false, false, false, false, false];
    const frei = s.halten.map((h, i) => h ? -1 : i).filter(i => i >= 0);
    if (!frei.length) throw new Error('Alle Würfel gehalten');
    if (neue.length !== frei.length || !neue.every(x => Number.isInteger(x) && x >= 1 && x <= 6)) throw new Error('Würfelwerte ungültig');
    frei.forEach((i, k) => s.wuerfel[i] = neue[k]);
    s.wurf += 1; return s;
  }
  const amZug = s => s.spieler[s.dran];
  function moeglich(s) { return s.wurf ? moeglichkeiten(amZug(s).block, s.wuerfel, s.regel) : {}; }

  function eintragen(s, feld) {
    if (s.phase !== 'zug') throw new Error('Spiel vorbei');
    if (!s.wurf) throw new Error('Erst würfeln');
    const m = moeglich(s);
    if (!m[feld]) throw new Error(`${TITEL[feld] || feld} ist hier nicht erlaubt`);
    const p = amZug(s);
    p.block[feld] = m[feld].punkte;
    if (m.zusatz) p.zusatz += 1;
    s.letzter = {spieler: s.dran, feld, punkte: m[feld].punkte, art: m[feld].art, zusatz: m.zusatz, wuerfel: s.wuerfel.slice()};
    // weiter
    const n = s.spieler.length;
    s.dran = (s.dran + 1) % n; s.wurf = 0; s.halten = [false, false, false, false, false];
    if (s.dran === s.beginner) s.runde += 1;
    if (s.spieler.every(x => FELDER.every(f => x.block[f] != null))) {
      s.phase = 'ende';
      const g = s.spieler.map(x => wertung(x).gesamt), hoch = Math.max(...g);
      s.sieger = g.map((x, i) => x === hoch ? i : -1).filter(i => i >= 0);
    }
    return s.letzter;
  }
  function rangliste(s) {
    return s.spieler.map((p, i) => ({i, name: p.name, farbe: p.farbe, ...wertung(p)}))
      .sort((a, b) => b.gesamt - a.gesamt || a.i - b.i);
  }

  const Fuenferpasch = {OBEN, UNTEN, FELDER, TITEL, HOECHST, BONUS_AB, BONUS, ZUSATZ, RUNDEN, punkte, istFuenferpasch,
    moeglichkeiten, wertung, werBeginnt, neu, halten, wuerfeln, moeglich, eintragen, rangliste};
  if (typeof module !== 'undefined') module.exports = Fuenferpasch; else window.Fuenferpasch = Fuenferpasch;
})();
