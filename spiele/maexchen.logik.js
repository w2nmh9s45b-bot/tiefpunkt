/* Mäxchen – reine Spielregeln (ohne DOM).

   QUELLEN (abgerufen 08.11.2026)
   - de.wikipedia.org/wiki/Mäxchen und /wiki/Meiern: Rangfolge, verdeckter Wurf, Ansage (Lügen erlaubt), Glauben oder
     Anzweifeln, Wertung beim Aufdecken („höher angesagt als gewürfelt → Ansager verliert, sonst der Zweifler“).
   - diekleineludothek.at/meiern-maxchen: drei Leben je Person, bei einem Meier (21) verliert der Ungläubige zwei.
   - spielregeln-spielanleitungen.de/wuerfelspiel/maexchen: „in vielen Runden zählt ein verlorenes Mäxchen doppelt“,
     auf 21 kann nicht höher angesagt werden (nur glauben und selbst 21 ansagen oder aufdecken), meist beginnt der
     Verlierer die neue Runde, ungewürfelt weitergeben und gleich hoch ansagen sind nur Hausregeln.
   - spielwiki.de/Mäxchen, partyspiele.org/maexchen: doppelte Strafe in beide Richtungen.

   GRUNDREGEL, wie hier umgesetzt
   - Zwei Würfel, höherer Würfel = Zehner. Rang aufsteigend: 31 32 41 42 43 51 52 53 54 61 62 63 64 65,
     dann Pasch 11 22 33 44 55 66, höchster Wurf 21 (Mäxchen).
   - Wer die Runde eröffnet, würfelt, schaut allein nach und sagt einen beliebigen Wert an. Jede weitere Ansage muss
     höher sein als die vorige. Lügen (zu hoch) und Untertreiben (zu niedrig) sind erlaubt.
   - Die nächste Person glaubt (dann würfelt sie neu, ohne in den Becher zu sehen, und muss höher ansagen) oder deckt auf.
   - Aufdecken: echter Wurf niedriger als die Ansage → Ansager verliert; gleich hoch oder höher → Aufdeckende verliert.
   - Auf 21 gibt es nichts Höheres: Wer 21 glaubt, muss selbst wieder 21 ansagen (Auslegung: die einzig mögliche Ansage).
   - Leben: Vorgabe 3. Wer kein Leben mehr hat, scheidet aus. Gewonnen hat, wer zuletzt noch Leben hat.
   - Neue Runde beginnt die Person, die verloren hat (ist sie ausgeschieden: die nächste im Uhrzeigersinn).
   - Weitergeben geht nur mit eigenem Wurf (ungewürfelt weitergeben ist laut Wikipedia nur eine Variante).

   AUSLEGUNGEN / OPTIONEN (beschriftet auf der Startseite)
   - doppelt (Vorgabe an): Lag beim Aufdecken ein Mäxchen in der Ansage oder unter dem Becher, kostet die Runde zwei Leben.
   - gleich (Vorgabe aus): „Gleich hoch ansagen erlaubt“ – die Ansage darf auch gleich hoch sein wie die vorige.
   - blind (Vorgabe aus): „Ohne Würfeln weitergeben“ – wer glaubt, darf den Becher ungesehen und ungewürfelt
     weiterreichen und trotzdem höher ansagen. Unter dem Becher bleibt dann der Wurf des Vorgängers.
*/
"use strict";
(function () {
  const RANG = ['31', '32', '41', '42', '43', '51', '52', '53', '54', '61', '62', '63', '64', '65',
    '11', '22', '33', '44', '55', '66', '21'];
  const NAMEN = {'21': 'Mäxchen', '11': 'Einerpasch', '22': 'Zweierpasch', '33': 'Dreierpasch', '44': 'Viererpasch',
    '55': 'Fünferpasch', '66': 'Sechserpasch'};

  function wert(a, b) {
    const hi = Math.max(a, b), lo = Math.min(a, b);
    if (hi === 2 && lo === 1) return '21';
    return `${hi}${lo}`;
  }
  const rang = code => RANG.indexOf(code);
  const name = code => NAMEN[code] || code;
  /** Würfelbild zu einem Code (höherer Würfel zuerst, beim Mäxchen 2 und 1). */
  const augen = code => [Number(code[0]), Number(code[1])];

  const STANDARD = {leben: 3, doppelt: true, gleich: false, blind: false};

  function neu({namen, farben = [], optionen = {}}) {
    const o = Object.assign({}, STANDARD, optionen);
    if (!Array.isArray(namen) || namen.length < 2 || namen.length > 8) throw new Error('2 bis 8 Personen');
    return {
      v: 1, optionen: o,
      spieler: namen.map((n, i) => ({name: n, farbe: farben[i] || '#f2c14e', leben: o.leben})),
      dran: 0, runde: 1,
      phase: 'wuerfeln',   // wuerfeln | ansagen | entscheiden | aufgedeckt | ende
      ansage: null,        // {code, von}
      becher: null,        // [a, b] – was wirklich unter dem Becher liegt
      gesehen: false,      // hat die Person am Zug in den Becher geschaut (selbst gewürfelt)?
      selbst: false,       // hat die Person am Zug in diesem Zug selbst gewürfelt?
      aufdeckung: null,    // Ergebnis der letzten Aufdeckung
      sieger: null, verlauf: []
    };
  }

  const lebt = (s, i) => s.spieler[i].leben > 0;
  const lebende = s => s.spieler.map((p, i) => i).filter(i => lebt(s, i));
  function naechster(s, i) {
    const n = s.spieler.length;
    for (let k = 1; k <= n; k++) { const j = (i + k) % n; if (lebt(s, j)) return j; }
    return i;
  }

  /** Erlaubte Ansagen für die Person am Zug (aufsteigend). */
  function erlaubteAnsagen(s) {
    if (!s.ansage) return RANG.slice();
    const r = rang(s.ansage.code);
    if (s.ansage.code === '21') return ['21'];
    return RANG.filter(c => rang(c) > r || (s.optionen.gleich && rang(c) === r));
  }

  function pruefe(s, phase) { if (s.phase !== phase) throw new Error(`Falsche Phase: ${s.phase} statt ${phase}`); }

  /** Person am Zug würfelt (beide Würfel neu). */
  function wuerfeln(s, a, b) {
    pruefe(s, 'wuerfeln');
    if (![a, b].every(x => Number.isInteger(x) && x >= 1 && x <= 6)) throw new Error('Würfelwert ungültig');
    s.becher = [a, b]; s.gesehen = true; s.selbst = true; s.phase = 'ansagen';
    return s;
  }
  /** Variante: glauben und ungewürfelt weitergeben (nur mit Option blind und wenn schon etwas unter dem Becher liegt). */
  function blindWeiter(s) {
    pruefe(s, 'wuerfeln');
    if (!s.optionen.blind) throw new Error('Ungewürfelt weitergeben ist ausgeschaltet');
    if (!s.becher || !s.ansage) throw new Error('Am Rundenbeginn muss gewürfelt werden');
    s.gesehen = false; s.selbst = false; s.phase = 'ansagen';
    return s;
  }
  function ansagen(s, code) {
    pruefe(s, 'ansagen');
    if (!erlaubteAnsagen(s).includes(code)) throw new Error(`Ansage ${code} nicht erlaubt`);
    s.ansage = {code, von: s.dran};
    s.verlauf.push({runde: s.runde, von: s.dran, code, selbst: s.selbst});
    s.dran = naechster(s, s.dran);
    s.phase = 'entscheiden'; s.gesehen = false; s.selbst = false;
    return s;
  }
  function glauben(s) {
    pruefe(s, 'entscheiden');
    s.phase = 'wuerfeln';
    return s;
  }
  /** Becher heben. Gibt das Ergebnis zurück und schreibt es in s.aufdeckung. */
  function aufdecken(s) {
    pruefe(s, 'entscheiden');
    const echt = wert(s.becher[0], s.becher[1]);
    const angesagt = s.ansage.code;
    const gelogen = rang(echt) < rang(angesagt);
    const verlierer = gelogen ? s.ansage.von : s.dran;
    const maex = echt === '21' || angesagt === '21';
    const verlust = s.optionen.doppelt && maex ? 2 : 1;
    const vorher = s.spieler[verlierer].leben;
    s.spieler[verlierer].leben = Math.max(0, vorher - verlust);
    const raus = s.spieler[verlierer].leben === 0;
    s.aufdeckung = {echt, angesagt, becher: s.becher.slice(), ansager: s.ansage.von, aufdecker: s.dran,
      gelogen, verlierer, verlust: vorher - s.spieler[verlierer].leben, maex, raus};
    s.verlauf.push({runde: s.runde, aufgedeckt: true, echt, verlierer});
    const rest = lebende(s);
    if (rest.length <= 1) { s.phase = 'ende'; s.sieger = rest[0]; }
    else s.phase = 'aufgedeckt';
    return s.aufdeckung;
  }
  function naechsteRunde(s) {
    pruefe(s, 'aufgedeckt');
    const v = s.aufdeckung.verlierer;
    s.dran = lebt(s, v) ? v : naechster(s, v);
    s.runde += 1; s.ansage = null; s.becher = null; s.gesehen = false; s.selbst = false; s.phase = 'wuerfeln';
    return s;
  }

  const Maexchen = {RANG, STANDARD, wert, rang, name, augen, neu, erlaubteAnsagen, wuerfeln, blindWeiter, ansagen,
    glauben, aufdecken, naechsteRunde, naechster, lebende};
  if (typeof module !== 'undefined') module.exports = Maexchen; else window.Maexchen = Maexchen;
})();
