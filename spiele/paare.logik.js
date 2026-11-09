/* Paare finden – reine Spielregeln (ohne DOM). Gedächtnisspiel mit verdeckten Kärtchenpaaren.

   QUELLE: Spielanleitung des klassischen Bildpaar-Gedächtnisspiels des Originalverlags (Ausgabe mit 72 Karten /
   36 Paaren) nach bekanntem Wortlaut – beim Bau am 09.11.2026 nicht erneut online nachgelesen.

   GRUNDREGEL, wie hier umgesetzt
   - Alle Kärtchen werden gemischt und verdeckt ausgelegt. Je Motiv gibt es genau zwei gleiche Kärtchen.
   - Wer dran ist, deckt nacheinander zwei Kärtchen auf, sodass alle sie sehen.
   - Zeigen beide dasselbe Bild, ist es ein Paar: Die Person behält es und darf gleich noch einmal zwei aufdecken.
   - Sind die Bilder verschieden, werden beide wieder umgedreht – an genau derselben Stelle – und die nächste Person
     (im Uhrzeigersinn = nächster Sitz) ist dran.
   - Das Spiel endet, wenn alle Paare gefunden sind. Wer die meisten Paare hat, gewinnt. Gleichstand: geteilter Sieg.
   - Wer beginnt: laut Anleitung die jüngste Person. Auslegung: Am selben Gerät beginnt Spieler 1 (die jüngste Person
     als Spieler 1 eintragen) oder – als Option – ein zufälliger Sitz.

   AUSLEGUNGEN / ZUSÄTZE
   - Größe: 16, 24, 36 oder 48 Kärtchen (8–24 Paare) als Option; das Original hat 72 Karten, die Kinderausgaben
     weniger. Vorgabe 24.
   - Allein spielen (1 Person): wie oben, nur ohne Wechsel. Gezählt werden Züge (je zwei aufgedeckte Kärtchen = ein Zug)
     und die Zeit; der beste Wert je Größe wird auf dem Gerät gemerkt.
   - Ein Zug zählt in `zuege` erst, wenn das zweite Kärtchen aufgedeckt ist.
   - Während zwei verschiedene Kärtchen offen liegen (Phase „zeigen“), kann niemand ein weiteres aufdecken; erst nach
     dem Umdrehen (`weiter`) geht es weiter.
*/
"use strict";
(function () {
  const GROESSEN = [16, 24, 36, 48];

  function standardMischen(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

  /** Neues Spiel. pool = Liste möglicher Motiv-Kennungen (z. B. 'tiere:3'), daraus werden groesse/2 gezogen. */
  function neu({namen, farben = [], groesse = 24, pool, beginner = 0, mischen = standardMischen}) {
    if (!GROESSEN.includes(groesse)) throw new Error('Ungültige Größe: ' + groesse);
    if (!namen || namen.length < 1 || namen.length > 6) throw new Error('1 bis 6 Personen');
    const paare = groesse / 2;
    if (!pool || new Set(pool).size < paare) throw new Error('Zu wenige Motive');
    const motive = mischen([...new Set(pool)]).slice(0, paare);
    const karten = mischen([...motive, ...motive]);
    return {
      v: 1, groesse, karten, wer: karten.map(() => -1), offen: [],
      spieler: namen.map((name, i) => ({name, farbe: farben[i] || '#f2c14e', paare: 0, zuege: 0})),
      dran: beginner % namen.length, beginner: beginner % namen.length, phase: 'zug', zuege: 0, folge: 0, nr: 0,
      letzter: null, sieger: null
    };
  }

  const verdeckt = (S, i) => S.wer[i] === -1 && !S.offen.includes(i);
  function kannAufdecken(S, i) {
    return S.phase === 'zug' && Number.isInteger(i) && i >= 0 && i < S.karten.length && verdeckt(S, i) && S.offen.length < 2;
  }

  /** Kärtchen i aufdecken. Ergebnis: {art:'erste'} | {art:'paar', motiv, ende} | {art:'fehl'}. Wirft bei unerlaubtem Zug. */
  function aufdecken(S, i) {
    if (!kannAufdecken(S, i)) throw new Error('Dieses Kärtchen kann jetzt nicht aufgedeckt werden.');
    S.offen.push(i); S.nr++;
    if (S.offen.length === 1) { S.letzter = {art: 'erste', i: [i], spieler: S.dran}; return {art: 'erste'}; }
    const [a, b] = S.offen, p = S.spieler[S.dran];
    p.zuege++; S.zuege++;
    if (S.karten[a] === S.karten[b]) {
      S.wer[a] = S.wer[b] = S.dran; p.paare++; S.offen = []; S.folge++;
      S.letzter = {art: 'paar', i: [a, b], spieler: S.dran, motiv: S.karten[a]};
      if (S.wer.every(w => w !== -1)) { S.phase = 'ende'; S.sieger = sieger(S); }
      return {art: 'paar', motiv: S.karten[a], ende: S.phase === 'ende'};
    }
    S.phase = 'zeigen';
    S.letzter = {art: 'fehl', i: [a, b], spieler: S.dran};
    return {art: 'fehl'};
  }

  /** Nach einem Fehlgriff: beide Kärtchen umdrehen, die nächste Person ist dran. */
  function weiter(S) {
    if (S.phase !== 'zeigen') return false;
    S.offen = []; S.phase = 'zug'; S.folge = 0; S.nr++;
    S.dran = (S.dran + 1) % S.spieler.length;
    return true;
  }

  function sieger(S) {
    const best = Math.max(...S.spieler.map(p => p.paare));
    return S.spieler.map((p, i) => p.paare === best ? i : -1).filter(i => i >= 0);
  }
  function rangliste(S) {
    return S.spieler.map((p, i) => ({i, name: p.name, farbe: p.farbe, paare: p.paare, zuege: p.zuege}))
      .sort((x, y) => y.paare - x.paare || x.zuege - y.zuege || x.i - y.i);
  }
  const offenePaare = S => S.wer.filter(w => w === -1).length / 2;

  /** Was alle sehen dürfen: verdeckte Motive sind null. */
  function sicht(S) {
    const k = JSON.parse(JSON.stringify(S));
    k.karten = S.karten.map((m, i) => (S.wer[i] !== -1 || S.offen.includes(i)) ? m : null);
    return k;
  }

  const Paare = {GROESSEN, neu, kannAufdecken, aufdecken, weiter, sieger, rangliste, offenePaare, sicht};
  if (typeof module !== 'undefined') module.exports = Paare; else window.Paare = Paare;
})();
