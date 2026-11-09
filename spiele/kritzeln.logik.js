/* Kritzelraten – reine Spielregeln (ohne DOM).

   REGELQUELLE
   Zeichnen-und-Raten nach dem Prinzip der bekannten Fernseh- und Partyspiele (eine Person zeichnet einen Begriff, die
   anderen raten; reine Spielidee, keine Marke). Grundregeln:
   - Reihum zeichnet eine Person einen Begriff, den nur sie kennt. Sprechen, Buchstaben und Zahlen sind beim Zeichnen
     nicht erlaubt; Pfeile und Symbole schon.
   - Die anderen rufen ihre Vermutungen. Die Zeit ist begrenzt.
   - Wer richtig rät, bekommt Punkte, die zeichnende Person ebenfalls.
   - Variante mit zwei Teams: Die Teams zeichnen abwechselnd, nur das eigene Team rät.

   AUSLEGUNGEN (Optionen auf der Startseite, Vorgabe in Klammern)
   - Zeit je Bild 60/80/120 s (80). Begriffe leicht/mittel/schwer/gemischt (gemischt). Jede Person zeichnet 1/2/3 Mal (2).
   - Jeder für sich (Vorgabe): Die erste richtige Lösung bringt 10 Punkte, die zweite 8, die dritte 6, jede weitere 5.
     Die zeichnende Person bekommt 5 Punkte für die erste richtige Lösung und 2 für jede weitere.
     Am selben Gerät wird laut geraten – wer den Begriff zuerst ruft, hat ihn, damit endet das Bild (10 + 5 Punkte).
     Im Netzspiel tippt jede Person ihre Vermutung ein; das Bild läuft weiter, bis alle es haben oder die Zeit um ist.
   - Zwei Teams (ab 4 Personen): Nur das Team der zeichnenden Person rät. Die erste richtige Lösung beendet das Bild;
     das Team bekommt 3 Punkte im ersten Drittel der Zeit, 2 im zweiten, 1 im letzten. Teams am selben Gerät:
     abwechselnd nach der Reihenfolge der Namen (1., 3., 5. … gegen 2., 4., 6. …), im Netz nach Sitz. Beide Teams
     zeichnen gleich oft; im größeren Team zeichnet jede Person die gewählte Zahl, im kleineren manche öfter.
   - Einmal je Bild darf die zeichnende Person vor dem Start einen anderen Begriff nehmen.
   - Prüfung getippter Vermutungen: Groß-/Kleinschreibung, Leer- und Satzzeichen, ein Artikel vorne zählen nicht,
     ä = ae, ß = ss. Kleine Tippfehler gelten: bis 4 Buchstaben keiner, bis 7 Buchstaben einer, darüber zwei
     (vertauschte Nachbarbuchstaben zählen als ein Fehler). Wer genau einen anderen Begriff der Liste rät, liegt daneben. Liegt eine Vermutung nur knapp daneben, sieht nur die
     ratende Person „knapp“ – die anderen sehen den Text nicht, damit er nichts verrät.
   - Spielende, wenn alle (bzw. beide Teams) ihre Bilder gezeichnet haben; die meisten Punkte gewinnen, Gleichstand =
     mehrere Sieger. */
'use strict';
(function () {
  const BREITE = 1000, HOEHE = 800;          // Koordinaten der Zeichenfläche (Ganzzahlen)
  const MAX_STRICHE = 800, MAX_PUNKTE = 3000;
  const FARBEN = 12, MAX_DICKE = 80;
  const PUNKTE_RATEN = [10, 8, 6], PUNKTE_RATEN_REST = 5, PUNKTE_ZEICHNER_ERST = 5, PUNKTE_ZEICHNER_WEITER = 2;

  function norm(t) {
    let s = String(t == null ? '' : t).toLowerCase().trim().replace(/\s+/g, ' ');
    s = s.replace(/^(der|die|das|den|dem|des|ein|eine|einen|einem|einer)\s+/, '');
    s = s.replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss');
    s = s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return s.replace(/[^a-z0-9]/g, '');
  }
  /** Abstand zweier Wörter: Einfügen, Löschen, Ersetzen und Vertauschen zweier Nachbarn kosten je 1. */
  function abstand(a, b) {
    const m = a.length, n = b.length, d = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)]);
    for (let j = 0; j <= n; j++) d[0][j] = j;
    for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) {
      const k = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + k);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
    }
    return d[m][n];
  }
  const toleranz = n => (n <= 4 ? 0 : n <= 7 ? 1 : 2);
  /** Vermutung gegen Begriff ({b, auch}) oder Text prüfen: 'treffer' | 'knapp' | 'nein'.
      bekannt = Menge aller Begriffe in Vergleichsform: Wer genau einen ANDEREN Begriff rät („Maus“ statt „Haus“),
      liegt daneben, auch wenn nur ein Buchstabe abweicht. */
  function pruefe(rate, begriff, bekannt) {
    const r = norm(rate); if (!r) return 'nein';
    const ziele = (typeof begriff === 'string' ? [begriff] : [begriff.b, ...(begriff.auch || [])]).map(norm);
    if (ziele.includes(r)) return 'treffer';
    if (bekannt && bekannt.has(r)) return 'nein';
    let knapp = false;
    for (const z of ziele) {
      const d = abstand(r, z), t = toleranz(z.length);
      if (d <= t) return 'treffer';
      if (z.length >= 4 && (d <= t + 1 || (r.length >= 4 && (r.includes(z) || z.includes(r))))) knapp = true;
    }
    return knapp ? 'knapp' : 'nein';
  }

  function reiheBauen(n, mal, teams) {
    const r = [];
    if (!teams) { for (let m = 0; m < mal; m++) for (let i = 0; i < n; i++) r.push(i); return r; }
    const [A, B] = teams.map(t => t.mitglieder), runden = mal * Math.max(A.length, B.length);
    for (let i = 0; i < runden; i++) r.push(A[i % A.length], B[i % B.length]);
    return r;
  }
  /** Neues Spiel. stapel = gemischte Begriffe [{b, s, auch}]; teamSitze = [[…],[…]] (sonst abwechselnd nach Reihenfolge). */
  function neu({ spieler, optionen = {}, stapel, teamSitze, modus = 'lokal' }) {
    if (!Array.isArray(spieler) || spieler.length < 3 || spieler.length > 12) throw new Error('3 bis 12 Personen');
    if (!stapel || !stapel.length) throw new Error('keine Begriffe');
    const o = { zeit: optionen.zeit || 80, mal: optionen.mal || 2, stufe: optionen.stufe || 'gemischt', teams: !!optionen.teams };
    let teams = null;
    if (o.teams) {
      if (spieler.length < 4) throw new Error('Teams ab 4 Personen');
      const sitze = teamSitze || [spieler.map((_, i) => i).filter(i => i % 2 === 0), spieler.map((_, i) => i).filter(i => i % 2 === 1)];
      if (sitze[0].length < 2 || sitze[1].length < 2) throw new Error('je Team mindestens 2');
      teams = sitze.map((m, t) => ({ name: optionen.teamNamen ? optionen.teamNamen[t] : ['Team Kreide', 'Team Pinsel'][t], mitglieder: m.slice(), punkte: 0 }));
    }
    const S = {
      spieler: spieler.map(p => (typeof p === 'string' ? { name: p } : { name: p.name, farbe: p.farbe })),
      optionen: o, teams, modus, punkte: spieler.map(() => 0),
      reihe: reiheBauen(spieler.length, o.mal, teams), zug: 0, phase: 'bereit',
      stapel: stapel.slice(), gezogen: [], begriff: null, getauscht: false,
      bild: { striche: [], v: 0 }, start: null, ende: null, schluss: null,
      treffer: [], raten: [], grund: null, verlauf: []
    };
    begriffZiehen(S);
    return S;
  }
  function begriffZiehen(S) {
    if (!S.stapel.length) { S.stapel = S.gezogen; S.gezogen = []; }
    S.begriff = S.stapel.shift(); S.gezogen.push(S.begriff);
    return S.begriff;
  }
  const zeichner = S => S.reihe[S.zug];
  const teamVon = (S, sp) => (!S.teams ? null : S.teams[0].mitglieder.includes(sp) ? 0 : S.teams[1].mitglieder.includes(sp) ? 1 : null);
  /** Wer darf in diesem Bild raten? */
  function rater(S) {
    const z = zeichner(S);
    return S.spieler.map((_, i) => i).filter(i => i !== z && (!S.teams || teamVon(S, i) === teamVon(S, z)));
  }
  const hatErraten = (S, sp) => S.treffer.some(t => t.sp === sp);
  const darfRaten = (S, sp) => S.phase === 'zeichnen' && rater(S).includes(sp) && !hatErraten(S, sp);

  /** Einmal je Bild vor dem Start: anderer Begriff. */
  function anderer(S) {
    if (S.phase !== 'bereit' || S.getauscht) return false;
    S.getauscht = true; begriffZiehen(S); return true;
  }
  function starten(S, jetzt = Date.now()) {
    if (S.phase !== 'bereit') return false;
    S.phase = 'zeichnen'; S.start = jetzt; S.ende = jetzt + S.optionen.zeit * 1000;
    S.bild = { striche: [], v: 0 }; S.treffer = []; S.raten = []; S.grund = null;
    return true;
  }
  function teamPunkteFuer(S, jetzt) {
    const anteil = Math.max(0, (S.ende - jetzt)) / (S.optionen.zeit * 1000);
    return anteil > 2 / 3 ? 3 : anteil > 1 / 3 ? 2 : 1;
  }
  function trefferBuchen(S, sp, jetzt) {
    const k = S.treffer.length, z = zeichner(S);
    let p;
    if (S.teams) { p = teamPunkteFuer(S, jetzt); S.teams[teamVon(S, z)].punkte += p; }
    else {
      p = k < PUNKTE_RATEN.length ? PUNKTE_RATEN[k] : PUNKTE_RATEN_REST;
      S.punkte[sp] += p;
      S.punkte[z] += k === 0 ? PUNKTE_ZEICHNER_ERST : PUNKTE_ZEICHNER_WEITER;
    }
    S.treffer.push({ sp, punkte: p, ms: Math.max(0, jetzt - S.start) });
  }
  /** Getippte Vermutung (Netzspiel). Ergebnis {art} oder null, wenn nicht erlaubt. */
  function raten(S, sp, text, jetzt = Date.now(), bekannt) {
    if (!darfRaten(S, sp)) return null;
    const t = String(text || '').replace(/\s+/g, ' ').trim().slice(0, 30);
    if (!t) return null;
    const art = pruefe(t, S.begriff, bekannt);
    S.raten.push({ sp, t, art });
    if (S.raten.length > 80) S.raten.shift();
    if (art === 'treffer') {
      trefferBuchen(S, sp, jetzt);
      if (S.teams || S.modus === 'lokal' || rater(S).every(i => hatErraten(S, i))) aufloesen(S, 'alle');
    }
    return { art };
  }
  /** Am selben Gerät: die zeichnende Person tippt an, wer es zuerst gerufen hat (Teams: sp darf fehlen). */
  function erratenDurch(S, sp, jetzt = Date.now()) {
    if (S.phase !== 'zeichnen') return false;
    if (S.teams) { if (sp == null) sp = rater(S)[0]; }
    if (!rater(S).includes(sp) || hatErraten(S, sp)) return false;
    trefferBuchen(S, sp, jetzt);
    aufloesen(S, 'alle');
    return true;
  }
  /** Bild endet: 'zeit', 'aufgeben' oder 'alle' (alle haben es). */
  function aufloesen(S, grund) {
    if (S.phase !== 'zeichnen') return false;
    S.phase = 'aufloesung'; S.grund = grund; S.schluss = S.ende; S.ende = null;
    const punkte = {};
    S.treffer.forEach(t => { punkte[t.sp] = t.punkte; });
    S.verlauf.push({ zeichner: zeichner(S), begriff: S.begriff.b, treffer: S.treffer.map(t => t.sp), punkte,
      team: S.teams ? teamVon(S, zeichner(S)) : null, teamPunkte: S.teams && S.treffer.length ? S.treffer[0].punkte : 0 });
    return true;
  }
  /** Nach der Auflösung: nächstes Bild oder Spielende. */
  function weiter(S) {
    if (S.phase !== 'aufloesung') return false;
    S.zug++;
    if (S.zug >= S.reihe.length) { S.phase = 'ende'; return true; }
    S.phase = 'bereit'; S.getauscht = false; S.bild = { striche: [], v: 0 }; S.treffer = []; S.raten = []; S.grund = null; S.start = null;
    begriffZiehen(S);
    return true;
  }
  function sieger(S) {
    const werte = S.teams ? S.teams.map(t => t.punkte) : S.punkte;
    const m = Math.max(...werte);
    return werte.map((w, i) => (w === m ? i : -1)).filter(i => i >= 0);
  }

  /* ---------- Zeichnung: Striche als Punktlisten ---------- */
  const ganz = (v, max) => Number.isInteger(v) && v >= 0 && v <= max;
  /** Teilstück eines Strichs anhängen: d = {id, f, w, ab, p:[x,y,…]}; ab = Zahl der Punkte, die schon da sind. */
  function strichDazu(S, d) {
    if (S.phase !== 'zeichnen' || !d || typeof d.id !== 'string' || d.id.length > 16 || !Array.isArray(d.p) || d.p.length % 2) return false;
    if (!ganz(d.f, FARBEN - 1) || !ganz(d.w, MAX_DICKE) || d.w < 1 || !ganz(d.ab, MAX_PUNKTE)) return false;
    for (let i = 0; i < d.p.length; i += 2) if (!ganz(d.p[i], BREITE) || !ganz(d.p[i + 1], HOEHE)) return false;
    const L = S.bild.striche;
    let s = L.find(x => x.id === d.id);
    if (!s) {
      if (d.ab !== 0 || L.length >= MAX_STRICHE) return false;
      s = { id: d.id, f: d.f, w: d.w, p: [] }; L.push(s);
    }
    const da = s.p.length / 2;
    if (d.ab > da) return false;                       // Lücke: Teilstück fehlt
    if (da + d.p.length / 2 - (da - d.ab) > MAX_PUNKTE) return false;
    s.p.length = d.ab * 2;                             // doppelt gesendetes Stück überschreibt sich selbst
    for (const v of d.p) s.p.push(v);
    S.bild.v++;
    return true;
  }
  function strichZurueck(S) { if (S.phase !== 'zeichnen' || !S.bild.striche.length) return false; S.bild.striche.pop(); S.bild.v++; return true; }
  function bildLeeren(S) { if (S.phase !== 'zeichnen' || !S.bild.striche.length) return false; S.bild.striche = []; S.bild.v++; return true; }

  const K = { BREITE, HOEHE, FARBEN, MAX_DICKE, PUNKTE_RATEN, norm, abstand, pruefe, reiheBauen, neu, begriffZiehen, zeichner, teamVon, rater,
    hatErraten, darfRaten, anderer, starten, raten, erratenDurch, aufloesen, weiter, sieger, strichDazu, strichZurueck, bildLeeren };
  if (typeof module !== 'undefined') module.exports = K; else window.KritzelnLogik = K;
})();
