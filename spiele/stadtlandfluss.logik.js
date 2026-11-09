/* Stadt, Land, Fluss – reine Spielregeln (ohne DOM).

   REGELQUELLE
   Das klassische Papier-und-Bleistift-Spiel (gemeinfrei, keine Marke). Grundregeln wie in den gängigen Spielblöcken
   und Spielesammlungen beschrieben (u. a. Wikipedia „Stadt, Land, Fluss“, Anleitungen der üblichen Spielblöcke):
   - Jede Person hat eine Liste mit Kategorien (Grundform: Stadt, Land, Fluss, Name, Beruf, Tier, Pflanze).
   - Ein Anfangsbuchstabe wird ausgelost. Alle schreiben gleichzeitig zu jeder Kategorie ein Wort mit diesem Buchstaben.
   - Wer zuerst alle Kategorien gefüllt hat, ruft „Stopp“ – alle hören sofort auf.
   - Wertung je Kategorie:
       20 Punkte – man hat als Einzige(r) in dieser Kategorie überhaupt etwas (Gültiges) stehen,
       10 Punkte – die Antwort hat sonst niemand,
        5 Punkte – jemand anderes hat dasselbe Wort,
        0 Punkte – nichts eingetragen oder ungültig (falscher Anfangsbuchstabe, gibt es nicht, passt nicht).
   - Über strittige Antworten entscheidet die Runde.
   - Gewonnen hat, wer nach der letzten Runde die meisten Punkte hat.

   AUSLEGUNGEN
   - Buchstaben: A–Z ohne Umlaute. Option (Vorgabe an): Q, X und Y weglassen. Ein Buchstabe kommt in einem Spiel erst
     wieder, wenn alle anderen dran waren.
   - Spiellänge ist im Original frei. Vorgabe hier 5 Runden, wählbar 3/5/8/10 oder „ohne Ende“ (dann beendet der
     Gastgeber nach einer Runde).
   - Zeitlimit als Option (Vorgabe aus = klassisch mit „Stopp“). Läuft die Zeit ab, ist die Runde zu Ende wie bei „Stopp“.
   - Am selben Gerät schreibt jede Person auf Papier; das Gerät lost, führt die Uhr und die Wertung. Je Person und
     Kategorie wird nur angekreuzt: leer/ungültig – eigene Antwort – doppelt. Die Punkte (inkl. 20er-Regel) rechnet das Gerät.
   - Im Netzspiel tippt jede Person auf dem eigenen Gerät. „Stopp“ geht erst, wenn alle eigenen Felder gefüllt sind.
     Gleiche Antworten erkennt das Spiel selbst: Groß-/Kleinschreibung, Leerzeichen, Bindestriche, Satzzeichen,
     Akzente und ein vorangestellter Artikel (der/die/das/ein/eine) zählen nicht, ä=ae, ö=oe, ü=ue, ß=ss.
     Eine Antwort, die nicht mit dem Buchstaben beginnt, ist automatisch ungültig.
   - Einspruch im Netzspiel: Jede Person kann fremde Antworten antippen (Einspruch). Gestrichen ist eine Antwort, wenn
     mehr als die Hälfte der anderen Personen Einspruch erhebt. Der Gastgeber entscheidet zusätzlich mit einem Tipp
     endgültig (gilt / gilt nicht) – auch gegen die automatische Buchstabenprüfung.
   - Ungültige Antworten zählen wie leere: Sie machen keine andere Antwort „doppelt“ und verhindern keine 20 Punkte.
   - Gleichstand am Ende: mehrere Sieger. */
'use strict';
(function () {
  const ALLE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const SCHWER = 'QXY';
  const STANDARD = ['Stadt', 'Land', 'Fluss', 'Name', 'Beruf', 'Tier', 'Pflanze'];
  const VORSCHLAEGE = ['Stadt', 'Land', 'Fluss', 'Name', 'Beruf', 'Tier', 'Pflanze', 'Essen', 'Getränk', 'Obst oder Gemüse',
    'Sportart', 'Körperteil', 'Kleidung', 'Farbe', 'Gegenstand', 'Hobby', 'Musikinstrument', 'Film oder Serie', 'Promi',
    'Märchenfigur', 'Verkehrsmittel', 'Krankheit', 'Spiel', 'Gefühl', 'Werkzeug', 'Möbelstück', 'Süßigkeit', 'Gewürz'];
  const MAX_TEXT = 40;

  function zufallStd(n) { return Math.floor(Math.random() * n); }

  /** Vergleichsform einer Antwort: gleiche Wörter werden gleich, egal wie geschrieben. */
  function norm(t) {
    let s = String(t == null ? '' : t).toLowerCase().trim().replace(/\s+/g, ' ');
    s = s.replace(/^(der|die|das|den|dem|des|ein|eine|einen|einem|einer)\s+/, '');
    s = s.replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss');
    s = s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return s.replace(/[^a-z0-9]/g, '');
  }
  const gleich = (a, b) => norm(a) !== '' && norm(a) === norm(b);
  /** Beginnt die Antwort mit dem Buchstaben? (Artikel vorne zählt nicht; Ä zählt als A usw.) */
  function beginntMit(text, b) { const n = norm(text); return n !== '' && n[0] === String(b || '').toLowerCase(); }

  function neu({ spieler, kategorien, optionen = {}, modus = 'lokal' }) {
    if (!Array.isArray(spieler) || spieler.length < 2 || spieler.length > 8) throw new Error('2 bis 8 Personen');
    const kat = (kategorien && kategorien.length ? kategorien : STANDARD).map(k => String(k).trim().slice(0, 24)).filter(Boolean);
    if (kat.length < 1 || kat.length > 14) throw new Error('1 bis 14 Kategorien');
    return {
      spieler: spieler.map(p => (typeof p === 'string' ? { name: p } : { name: p.name, farbe: p.farbe })),
      kategorien: kat,
      optionen: { runden: optionen.runden == null ? 5 : optionen.runden, zeit: optionen.zeit || 0, ohneSchwer: optionen.ohneSchwer !== false },
      modus, phase: 'bereit', runde: 0, benutzt: [], buchstabe: null, rundeId: 0, ende: null, stopper: null, grund: null,
      status: null, antworten: null, einspruch: null, entscheid: null, abgegeben: null,
      verlauf: [], gesamt: spieler.map(() => 0)
    };
  }
  const leer2 = (S, f) => S.spieler.map(() => S.kategorien.map(f));

  function vorrat(S) {
    const pool = ALLE.split('').filter(b => !(S.optionen.ohneSchwer && SCHWER.includes(b)));
    const frei = pool.filter(b => !S.benutzt.includes(b));
    return { pool, frei };
  }
  /** Neue Runde: Buchstaben auslosen, Einträge leeren. jetzt = Zeitstempel (ms) für die Uhr. */
  function rundeStarten(S, zufall = zufallStd, jetzt = Date.now()) {
    if (S.phase !== 'bereit') throw new Error('keine neue Runde jetzt');
    let { pool, frei } = vorrat(S);
    if (!frei.length) { S.benutzt = []; frei = pool; }
    const b = frei[zufall(frei.length)];
    S.benutzt.push(b); S.buchstabe = b; S.runde++; S.rundeId++;
    S.phase = 'laeuft'; S.stopper = null; S.grund = null;
    S.ende = S.optionen.zeit ? jetzt + S.optionen.zeit * 1000 : null;
    if (S.modus === 'lokal') S.status = leer2(S, () => 'eigen');
    else {
      S.antworten = leer2(S, () => '');
      S.einspruch = leer2(S, () => []);
      S.entscheid = leer2(S, () => null);
      S.abgegeben = S.spieler.map(() => false);
    }
    return b;
  }
  const alleGefuellt = (S, sp) => S.antworten && S.antworten[sp].every(a => String(a).trim() !== '');
  /** Antworten einer Person übernehmen (nur solange geschrieben oder eingesammelt wird). */
  function abgabe(S, sp, liste, endgueltig) {
    if (S.modus !== 'netz' || !['laeuft', 'sammeln'].includes(S.phase) || !Array.isArray(liste)) return false;
    S.antworten[sp] = S.kategorien.map((_, k) => String(liste[k] == null ? '' : liste[k]).replace(/\s+/g, ' ').trim().slice(0, MAX_TEXT));
    if (endgueltig) S.abgegeben[sp] = true;
    return true;
  }
  /** „Stopp“ (grund 'stopp', sp = wer) oder Zeit um (grund 'zeit'). Netz: erst einsammeln, dann werten. */
  function stopp(S, sp, grund = 'stopp') {
    if (S.phase !== 'laeuft') return false;
    if (grund === 'stopp' && S.modus === 'netz' && !alleGefuellt(S, sp)) return false;
    S.stopper = grund === 'stopp' ? sp : null; S.grund = grund; S.ende = null;
    S.phase = S.modus === 'netz' ? 'sammeln' : 'wertung';
    return true;
  }
  function zurWertung(S) { if (S.phase !== 'sammeln') return false; S.phase = 'wertung'; return true; }
  const alleAbgegeben = S => !!S.abgegeben && S.abgegeben.every(Boolean);

  /* ---------- Wertung am selben Gerät: angekreuzt ---------- */
  const STATUS = ['leer', 'eigen', 'doppelt'];
  function statusSetzen(S, sp, k, st) {
    if (S.modus !== 'lokal' || S.phase !== 'wertung' || !STATUS.includes(st)) return false;
    S.status[sp][k] = st; return true;
  }
  /** Punkte einer Kategorie aus den Kreuzen: leer 0, eigen 10, doppelt 5; wer als Einzige(r) etwas hat: 20. */
  function punkteKreuze(liste) {
    const da = liste.filter(s => s !== 'leer').length;
    return liste.map(s => s === 'leer' ? 0 : da === 1 ? 20 : s === 'doppelt' ? 5 : 10);
  }

  /* ---------- Wertung im Netzspiel: eingetippt ---------- */
  function einspruchUmschalten(S, wer, sp, k) {
    if (S.modus !== 'netz' || S.phase !== 'wertung' || wer === sp || !S.antworten[sp] || S.antworten[sp][k] == null) return false;
    if (String(S.antworten[sp][k]).trim() === '') return false;
    const l = S.einspruch[sp][k], i = l.indexOf(wer);
    if (i >= 0) l.splice(i, 1); else l.push(wer);
    return true;
  }
  /** Gastgeber: schaltet die Antwort gültig ↔ ungültig (endgültig); ein zweiter Tipp nimmt den Entscheid zurück. */
  function entscheiden(S, sp, k) {
    if (S.modus !== 'netz' || S.phase !== 'wertung' || String(S.antworten[sp][k]).trim() === '') return false;
    if (S.entscheid[sp][k]) S.entscheid[sp][k] = null;
    else S.entscheid[sp][k] = zelle(S, sp, k).ungueltig ? 'gilt' : 'raus';
    return true;
  }
  /** Zustand einer Antwort ohne Punkte: {text, leer, ungueltig, grund}. */
  function zelle(S, sp, k) {
    const text = S.antworten[sp][k] || '', n = S.spieler.length;
    if (String(text).trim() === '') return { text: '', leer: true, ungueltig: false, grund: 'leer' };
    const e = S.entscheid[sp][k], stimmen = S.einspruch[sp][k].length;
    const buchstabe = !beginntMit(text, S.buchstabe), mehrheit = stimmen * 2 > n - 1;
    let ungueltig = false, grund = null;
    if (e === 'raus') { ungueltig = true; grund = 'gastgeber'; }
    else if (e === 'gilt') { ungueltig = false; grund = 'gilt'; }
    else if (buchstabe) { ungueltig = true; grund = 'buchstabe'; }
    else if (mehrheit) { ungueltig = true; grund = 'einspruch'; }
    return { text, leer: false, ungueltig, grund, stimmen };
  }
  /** Punkte und Anzeige einer Kategorie im Netzspiel. */
  function kategorieWerten(S, k) {
    const z = S.spieler.map((_, sp) => zelle(S, sp, k));
    const gueltig = z.filter(c => !c.leer && !c.ungueltig);
    const zahl = {};
    gueltig.forEach(c => { const n = norm(c.text); zahl[n] = (zahl[n] || 0) + 1; });
    return z.map(c => {
      if (c.leer || c.ungueltig) return Object.assign(c, { punkte: 0, doppelt: false });
      const doppelt = zahl[norm(c.text)] > 1;
      return Object.assign(c, { doppelt, punkte: gueltig.length === 1 ? 20 : doppelt ? 5 : 10 });
    });
  }
  /** Punkte der laufenden Wertung: [spieler][kategorie]. */
  function punkteRunde(S) {
    if (S.modus === 'lokal') {
      const t = S.spieler.map(() => S.kategorien.map(() => 0));
      S.kategorien.forEach((_, k) => punkteKreuze(S.spieler.map((__, sp) => S.status[sp][k])).forEach((p, sp) => { t[sp][k] = p; }));
      return t;
    }
    const t = S.spieler.map(() => S.kategorien.map(() => 0));
    S.kategorien.forEach((_, k) => kategorieWerten(S, k).forEach((c, sp) => { t[sp][k] = c.punkte; }));
    return t;
  }
  /** Wertung übernehmen → Rundenergebnis. */
  function rundeAbschliessen(S) {
    if (S.phase !== 'wertung') return false;
    const p = punkteRunde(S), summe = p.map(r => r.reduce((a, b) => a + b, 0));
    const eintrag = { runde: S.runde, buchstabe: S.buchstabe, punkte: p, summe };
    if (S.modus === 'netz') eintrag.antworten = S.antworten.map(r => r.slice());
    S.verlauf.push(eintrag);
    summe.forEach((s, i) => { S.gesamt[i] += s; });
    S.phase = 'ergebnis';
    return true;
  }
  const letzteRunde = S => S.optionen.runden > 0 && S.runde >= S.optionen.runden;
  /** Nach dem Rundenergebnis: nächste Runde oder Spielende (beenden = sofort aufhören). */
  function weiter(S, beenden) {
    if (S.phase !== 'ergebnis') return false;
    if (beenden || letzteRunde(S)) { S.phase = 'ende'; return true; }
    S.phase = 'bereit'; S.buchstabe = null; S.status = S.antworten = S.einspruch = S.entscheid = S.abgegeben = null;
    return true;
  }
  function sieger(S) { const m = Math.max(...S.gesamt); return S.gesamt.map((g, i) => (g === m ? i : -1)).filter(i => i >= 0); }

  const SLF = { ALLE, SCHWER, STANDARD, VORSCHLAEGE, MAX_TEXT, norm, gleich, beginntMit, neu, vorrat, rundeStarten, abgabe, alleGefuellt,
    stopp, zurWertung, alleAbgegeben, statusSetzen, punkteKreuze, einspruchUmschalten, entscheiden, zelle, kategorieWerten,
    punkteRunde, rundeAbschliessen, letzteRunde, weiter, sieger };
  if (typeof module !== 'undefined') module.exports = SLF; else window.StadtLandFlussLogik = SLF;
})();
