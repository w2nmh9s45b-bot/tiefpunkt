/* Wortverbot – reine Spielregeln (ohne DOM).

   REGELQUELLE
   Offizielle deutsche Anleitung des Vorbilds (Hasbro 2016, Ausgabe mit Buzzer, Sanduhr und Wertungsblock,
   PDF auf hasbro.com) und Wikipedia (Rundendauer der Sanduhr: eine Minute):
   - Zwei Teams. Ein Team erklärt und rät, eine Person des anderen Teams („Aufpasser") schaut dem Erklärer über
     die Schulter, hält Uhr und Buzzer.
   - Der Erklärer bringt sein Team dazu, den Suchbegriff zu sagen, ohne den Begriff selbst und ohne die
     5 Wörter darunter (auch keine Wortteile oder Grammatikformen, keine Abkürzungen, keine Gesten, keine
     Geräusche, kein „hört sich an wie“ / „reimt sich auf“). Singen ist erlaubt.
   - Erraten: nächste Karte. Tabu gesagt: der Aufpasser buzzert, die Karte kommt auf den Fehlerstapel.
     Überspringen ist erlaubt (ohne Begrenzung).
   - Läuft die Zeit ab, verfällt die gerade gespielte Karte und kommt zurück unter den Stapel (keine Punkte).
   - Wertung je Durchgang: das ratende Team bekommt 1 Punkt je erratenem Begriff, das andere Team
     1 Punkt je übersprungener ODER ausgebuzzerter Karte.
   - Spielende: wenn jeder Spieler gleich oft Erklärer war; das Team mit den meisten Punkten gewinnt.
     Bei Gleichstand wird weitergespielt, bis ein Sieger feststeht.
   - Die Erklärer wechseln reihum im Team; die Teams wechseln sich ab.

   AUSLEGUNGEN (in der Oberfläche als Optionen beschriftet, Vorgabe = offiziell)
   - Rundenzeit: Vorgabe 60 s (Sanduhr). Wählbar 60/90/120 s.
   - „Alle gleich oft erklärt“ (Vorgabe, 1× oder 2×): Bei ungleich großen Teams ist „jeder genau gleich oft“
     nicht erreichbar, weil beide Teams gleich viele Durchgänge spielen. Dann spielt jedes Team
     k × (Größe des größeren Teams) Durchgänge: jede Person erklärt mindestens k-mal, im kleineren Team einige öfter.
   - Weitere Spielenden (ausdrücklich als Variante beschriftet): feste Rundenzahl (eine Runde = jedes Team ein
     Durchgang) oder Punktziel. Das Punktziel wird nur nach einer vollständigen Runde geprüft, damit beide Teams
     gleich viele Durchgänge hatten.
   - Gleichstand am Ende: es folgt jeweils eine weitere ganze Runde (offiziell „spielt ihr einfach weiter“).
   - Team 1 beginnt. „Rückgängig“ nimmt während des laufenden Durchgangs die letzte Wertung zurück
     (Tippfehler am iPad); die Karte kommt wieder nach vorn.
   - Punkte werden wie im Original erst am Ende eines Durchgangs gutgeschrieben; die Oberfläche zeigt sie laufend an. */
'use strict';
(function () {
  const ENDEN = ['alle', 'runden', 'punkte'];

  function zufallStd(n) { return Math.floor(Math.random() * n); }
  function mischen(arr, zufall) { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = zufall(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; }

  /* Stapel bauen: zuerst alle noch nicht gesehenen Karten (gemischt), dahinter die schon gesehenen (gemischt).
     karten = Liste der Begriffe (Kennungen), gesehen = Menge/Liste schon gespielter Begriffe. */
  function stapelBauen(karten, gesehen, zufall = zufallStd) {
    const g = new Set(gesehen || []);
    const neu = karten.filter(k => !g.has(k)), alt = karten.filter(k => g.has(k));
    return { stapel: [...mischen(neu, zufall), ...mischen(alt, zufall)], zuruecksetzen: neu.length === 0 };
  }

  function neu({ teams, optionen = {}, stapel }) {
    if (!Array.isArray(teams) || teams.length !== 2) throw new Error('Genau zwei Teams');
    teams.forEach(t => { if (!t.mitglieder || t.mitglieder.length < 2) throw new Error('Jedes Team braucht mindestens zwei Personen'); });
    const o = {
      zeit: [60, 90, 120].includes(+optionen.zeit) ? +optionen.zeit : 60,
      ende: ENDEN.includes(optionen.ende) ? optionen.ende : 'alle',
      mal: [1, 2].includes(+optionen.mal) ? +optionen.mal : 1,
      runden: +optionen.runden > 0 ? +optionen.runden : 6,
      punkte: +optionen.punkte > 0 ? +optionen.punkte : 30
    };
    return {
      v: 1,
      optionen: o,
      teams: teams.map(t => ({ name: t.name, farbe: t.farbe || null, mitglieder: t.mitglieder.slice(), punkte: 0, naechster: 0, durchgaenge: 0 })),
      amZug: 0,
      phase: 'bereit',          // bereit → laeuft → wertung → (bereit | ende)
      stapel: stapel.slice(),
      zug: null,                // laufender Durchgang
      verlauf: [],              // abgeschlossene Durchgänge
      sollDurchgaenge: sollDurchgaenge(o, teams),
      sieger: null
    };
  }

  function sollDurchgaenge(o, teams) {
    if (o.ende === 'alle') return o.mal * Math.max(teams[0].mitglieder.length, teams[1].mitglieder.length);
    if (o.ende === 'runden') return o.runden;
    return null;
  }

  const gegner = t => 1 - t;
  function erklaerer(s, t = s.amZug) { const tm = s.teams[t]; return tm.mitglieder[tm.naechster % tm.mitglieder.length]; }

  function karteZiehen(s) {
    if (!s.stapel.length) return null;
    return s.stapel.shift();
  }

  function starteZug(s) {
    if (s.phase !== 'bereit') throw new Error('Kein Durchgang bereit');
    s.zug = { team: s.amZug, erklaerer: erklaerer(s), karten: [], aktuell: karteZiehen(s), restMs: s.optionen.zeit * 1000 };
    s.phase = 'laeuft';
    return s;
  }

  /* art: 'erraten' | 'verboten' | 'weiter' */
  function werten(s, art) {
    if (s.phase !== 'laeuft') throw new Error('Kein laufender Durchgang');
    if (!['erraten', 'verboten', 'weiter'].includes(art)) throw new Error('Unbekannte Wertung');
    const z = s.zug;
    if (z.aktuell == null) return s;           // Stapel leer
    z.karten.push({ karte: z.aktuell, ergebnis: art });
    z.aktuell = karteZiehen(s);
    return s;
  }

  function rueckgaengig(s) {
    if (s.phase !== 'laeuft' || !s.zug.karten.length) return false;
    const z = s.zug, letzte = z.karten.pop();
    if (z.aktuell != null) s.stapel.unshift(z.aktuell);
    z.aktuell = letzte.karte;
    return true;
  }

  function zugStand(z) {
    const n = a => z.karten.filter(k => k.ergebnis === a).length;
    return { erraten: n('erraten'), verboten: n('verboten'), weiter: n('weiter') };
  }

  /* Zeit abgelaufen (oder Stapel leer): Karte im Spiel zurück unter den Stapel, Punkte gutschreiben. */
  function zeitAbgelaufen(s) {
    if (s.phase !== 'laeuft') throw new Error('Kein laufender Durchgang');
    const z = s.zug, st = zugStand(z);
    if (z.aktuell != null) { s.stapel.push(z.aktuell); z.zurueck = z.aktuell; z.aktuell = null; }
    z.restMs = 0;
    const t = z.team;
    z.punkte = [0, 0]; z.punkte[t] = st.erraten; z.punkte[gegner(t)] = st.verboten + st.weiter;
    s.teams[0].punkte += z.punkte[0]; s.teams[1].punkte += z.punkte[1];
    s.teams[t].durchgaenge += 1;
    s.teams[t].naechster = (s.teams[t].naechster + 1) % s.teams[t].mitglieder.length;
    s.verlauf.push({ team: t, erklaerer: z.erklaerer, karten: z.karten.slice(), punkte: z.punkte.slice(), stand: st, zurueck: z.zurueck || null });
    s.phase = 'wertung';
    return s;
  }

  function rundeVoll(s) { return s.teams[0].durchgaenge === s.teams[1].durchgaenge; }

  function endePruefen(s) {
    if (!rundeVoll(s)) return null;
    const [a, b] = [s.teams[0].punkte, s.teams[1].punkte], n = s.teams[0].durchgaenge;
    let fertig = false;
    if (s.optionen.ende === 'punkte') fertig = Math.max(a, b) >= s.optionen.punkte;
    else fertig = n >= s.sollDurchgaenge;
    if (!fertig || a === b) return null;   // Gleichstand: weiterspielen
    return a > b ? 0 : 1;
  }

  /* Nach der Wertung: Spielende prüfen, sonst ist das andere Team dran. */
  function weiter(s) {
    if (s.phase !== 'wertung') throw new Error('Keine Wertung offen');
    s.zug = null;
    const sieger = endePruefen(s);
    if (sieger != null) { s.sieger = sieger; s.phase = 'ende'; return s; }
    s.amZug = gegner(s.amZug);
    s.phase = 'bereit';
    return s;
  }

  /* Ist die aktuelle Runde eine Verlängerung wegen Gleichstands? */
  function verlaengerung(s) {
    const n = Math.min(s.teams[0].durchgaenge, s.teams[1].durchgaenge);
    if (s.optionen.ende === 'punkte') return Math.max(s.teams[0].punkte, s.teams[1].punkte) >= s.optionen.punkte && n > 0;
    return n >= s.sollDurchgaenge;
  }

  function rundeNr(s) { return Math.min(s.teams[0].durchgaenge, s.teams[1].durchgaenge) + 1; }

  const WortverbotLogik = { neu, stapelBauen, starteZug, werten, rueckgaengig, zeitAbgelaufen, weiter, erklaerer, zugStand, endePruefen, verlaengerung, rundeNr, mischen };
  if (typeof module !== 'undefined') module.exports = WortverbotLogik; else window.WortverbotLogik = WortverbotLogik;
})();
