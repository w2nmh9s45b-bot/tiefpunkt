/* Dame (Deutsche Dame) – reine Spielregeln (ohne DOM).

   Für die deutsche Dame auf 64 Feldern gibt es kein amtliches Regelwerk eines Weltverbands (die FMJD regelt nur
   die internationale Dame auf 100 Feldern). Die Grundregel folgt deshalb den übereinstimmenden Angaben dieser Quellen:
     [W]  Wikipedia „Dame (Spiel)“, Abschnitt zu den Regeln im deutschsprachigen Raum
          https://de.wikipedia.org/wiki/Dame_(Spiel)
     [RV] Ravensburger Spielanleitung Nr. 20 545 „Mühle & Dame“ (zitiert nach https://spielstrategen.de/spiele/dame/):
          Dame zieht „beliebig weit vorwärts und rückwärts“, einfache Steine schlagen nur vorwärts, kein Mehrheitszwang
     [BN] Brettspielnetz, Spielregeln Dame https://www.brettspielnetz.de/spielregeln/dame.php
          („Wenn du die Auswahl zwischen verschiedenen Schlagmöglichkeiten hast, darfst du dich frei entscheiden.“;
          Remis nach 25 Vollzügen ohne Schlag und ohne Umwandlung, dreifache Wiederholung, Einigung)
     [SA] https://www.spielregeln-spielanleitungen.de/spiel/dame/ („Es beginnt immer der Spieler mit den weißen Steinen.“;
          Dame landet direkt hinter dem geschlagenen Stein; Umwandlung durch Schlag beendet den Zug)
     [EN] Wikipedia „Draughts“, Tabelle der Varianten, Eintrag German draughts: Dame landet direkt hinter dem
          geschlagenen Stein und schlägt von dort weiter; jede Schlagfolge darf gewählt werden, solange sie vollständig
          ausgeführt wird; „in Germany, pieces may further be required to take the longest sequence“.

   Grundregel (Vorgabe):
   - 8×8, nur dunkle Felder, links unten liegt ein dunkles Feld. Je 12 Steine auf den dunklen Feldern der ersten drei
     Reihen. Weiß beginnt [W][SA].
   - Einfache Steine ziehen ein Feld schräg vorwärts und schlagen nur vorwärts [RV][BN][EN].
   - Schlagpflicht [W][RV][BN]. Kann ein Stein nach dem Sprung weiterschlagen, muss er im selben Zug weiterschlagen
     (Mehrfachschlag) [W][SA][EN].
   - Bei mehreren Schlagmöglichkeiten freie Wahl [BN][EN][RV: kein Mehrheitszwang]; die gewählte Folge muss aber
     vollständig ausgeführt werden.
   - Geschlagene Steine werden erst nach dem ganzen Zug entfernt [W]; bis dahin bleiben sie stehen, können nicht ein
     zweites Mal übersprungen werden und versperren den Weg (Auslegung, üblich als „Türkenschlag-Verbot“).
   - Erreicht ein Stein die gegnerische Grundreihe, wird er Dame. Geschieht das in einem Schlagzug, endet der Zug dort;
     die neue Dame zieht und schlägt erst im nächsten Zug [W][SA].
   - Die Dame ist weitziehend: sie zieht beliebig weit schräg vorwärts und rückwärts [W][RV][SA]. Sie schlägt einen
     einzeln stehenden gegnerischen Stein auf ihrer Schräge auch aus der Entfernung und landet direkt auf dem Feld
     dahinter [W][SA][EN]; von dort muss sie weiterschlagen, wenn es geht.
   - Gewonnen hat, wessen Gegenseite keinen Zug mehr hat (keine Steine mehr oder alle blockiert) [W][BN].
     Aufgeben verliert.
   - Remis: durch Einigung [W][BN], bei dreifacher Wiederholung derselben Stellung mit derselben Seite am Zug [BN] und
     nach 25 Zügen je Seite, in denen weder geschlagen noch eine Dame gebildet wurde [BN]. Am iPad gelten die beiden
     letzten Fälle sofort (ohne Antrag).

   Verbreitete Abweichungen – nur als ausdrücklich beschriftete Option:
   - mehrheit:    Mehrheitsschlag – die Folge mit den meisten geschlagenen Steinen ist Pflicht [EN][ludomax.de].
   - rueckwaerts: Einfache Steine dürfen auch rückwärts schlagen (wie in der internationalen Dame).
   - weitLanden:  Die Dame darf nach dem Schlag beliebig weit hinter dem geschlagenen Stein landen
                  (wie in der internationalen Dame) [W nennt beide Landeweisen].

   Felder: Index = Reihe*8 + Linie, Reihe 0 = Grundreihe von Weiß, Linie 0 = a. Dunkel: (Reihe+Linie) gerade.
   Steine: 'w' weißer Stein, 'W' weiße Dame, 'b' schwarzer Stein, 'B' schwarze Dame, '' leer. */
"use strict";
(function () {
  const LINIEN = 'abcdefgh';
  const L = i => i % 8, R = i => Math.floor(i / 8);
  const auf = (l, r) => (l >= 0 && l < 8 && r >= 0 && r < 8) ? r * 8 + l : -1;
  const feldName = i => LINIEN[L(i)] + (R(i) + 1);
  const feldIndex = n => (n.charCodeAt(0) - 97) + (parseInt(n.slice(1), 10) - 1) * 8;
  const dunkel = i => (L(i) + R(i)) % 2 === 0;
  const farbeVon = p => !p ? null : p.toLowerCase();
  const istDame = p => !!p && p === p.toUpperCase();
  const gegner = f => f === 'w' ? 'b' : 'w';
  const DIAG = [[1, 1], [-1, 1], [1, -1], [-1, -1]];
  const VORGABE = {mehrheit: false, rueckwaerts: false, weitLanden: false};

  function neu(regeln) {
    const b = Array(64).fill('');
    for (let i = 0; i < 64; i++) if (dunkel(i)) { if (R(i) <= 2) b[i] = 'w'; else if (R(i) >= 5) b[i] = 'b'; }
    return mitStart({b, am: 'w'}, regeln);
  }
  /* Teststellung: {w:['c3','d4'], W:['h8'], b:[...], B:[...]} */
  function aus(stellung, am = 'w', regeln) {
    const b = Array(64).fill('');
    for (const p of ['w', 'W', 'b', 'B']) for (const n of (stellung[p] || [])) b[feldIndex(n)] = p;
    return mitStart({b, am}, regeln);
  }
  function mitStart(s, regeln) {
    s.regeln = Object.assign({}, VORGABE, regeln || {});
    s.ohne = 0; s.zl = []; s.liste = []; s.wdh = {}; s.letzter = null; s.erg = null;
    s.geschlagen = {w: 0, b: 0};
    s.wdh[schluessel(s)] = 1;
    return s;
  }
  const schluessel = s => s.b.map(p => p || '.').join('') + s.am;

  /* ---------- Züge ----------
     Ein Zug: {von, pfad:[Feld nach jedem Schritt], geschlagen:[Felder], dame:true wenn Umwandlung} */
  function schlagFolgen(s, von) {
    const b = s.b.slice(), p = b[von], f = farbeVon(p), reg = s.regeln;
    const vor = f === 'w' ? 1 : -1, letzte = f === 'w' ? 7 : 0;
    b[von] = ''; // das Startfeld ist während des Zuges frei
    const folgen = [];
    const gegnerisch = q => b[q] && farbeVon(b[q]) !== f;
    function weiter(pos, dame, pfad, geschl) {
      let ging = false;
      for (const [dl, dr] of DIAG) {
        if (!dame && !reg.rueckwaerts && dr !== vor) continue;
        let x = L(pos) + dl, y = R(pos) + dr, q = auf(x, y);
        if (dame) while (q >= 0 && !b[q]) { x += dl; y += dr; q = auf(x, y); }
        if (q < 0 || !gegnerisch(q) || geschl.includes(q)) continue;
        // Landefelder hinter dem Stein
        let lx = x + dl, ly = y + dr, ziel = auf(lx, ly);
        const landungen = [];
        while (ziel >= 0 && !b[ziel]) {
          landungen.push(ziel);
          if (!dame || !reg.weitLanden) break;
          lx += dl; ly += dr; ziel = auf(lx, ly);
        }
        for (const z of landungen) {
          ging = true;
          const np = pfad.concat([z]), ng = geschl.concat([q]);
          if (!dame && R(z) === letzte) folgen.push({von, pfad: np, geschlagen: ng, dame: true});
          else weiter(z, dame, np, ng);
        }
      }
      if (!ging && pfad.length) folgen.push({von, pfad, geschlagen: geschl, dame: false});
    }
    weiter(von, istDame(p), [], []);
    return folgen;
  }
  function einfacheZuege(s, von) {
    const b = s.b, p = b[von], f = farbeVon(p), vor = f === 'w' ? 1 : -1, letzte = f === 'w' ? 7 : 0, out = [];
    for (const [dl, dr] of DIAG) {
      if (!istDame(p) && dr !== vor) continue;
      let x = L(von) + dl, y = R(von) + dr, q = auf(x, y);
      while (q >= 0 && !b[q]) {
        out.push({von, pfad: [q], geschlagen: [], dame: !istDame(p) && R(q) === letzte});
        if (!istDame(p)) break;
        x += dl; y += dr; q = auf(x, y);
      }
    }
    return out;
  }
  function zuege(s) {
    if (s.erg) return [];
    const eigene = [];
    for (let i = 0; i < 64; i++) if (s.b[i] && farbeVon(s.b[i]) === s.am) eigene.push(i);
    let schlaege = [];
    for (const i of eigene) schlaege = schlaege.concat(schlagFolgen(s, i));
    if (schlaege.length) {
      if (s.regeln.mehrheit) { const m = Math.max(...schlaege.map(z => z.geschlagen.length)); schlaege = schlaege.filter(z => z.geschlagen.length === m); }
      return schlaege;
    }
    let out = [];
    for (const i of eigene) out = out.concat(einfacheZuege(s, i));
    return out;
  }
  const gleich = (a, b) => a.von === b.von && a.pfad.length === b.pfad.length && a.pfad.every((q, k) => q === b.pfad[k]);
  /* Für die Bedienung Feld für Feld: welche nächsten Felder sind von diesem Teilweg aus erlaubt? */
  function naechsteFelder(alle, von, teil) {
    const set = new Set();
    for (const z of alle) if (z.von === von && z.pfad.length > teil.length && teil.every((q, k) => z.pfad[k] === q)) set.add(z.pfad[teil.length]);
    return [...set];
  }
  function vollstaendig(alle, von, teil) { return alle.find(z => z.von === von && z.pfad.length === teil.length && teil.every((q, k) => z.pfad[k] === q)) || null; }
  /* Welche Steine wurden auf einem Teilweg schon übersprungen? (für die Anzeige) */
  function teilGeschlagen(alle, von, teil) {
    const z = alle.find(y => y.von === von && teil.every((q, k) => y.pfad[k] === q) && y.pfad.length >= teil.length);
    return z && z.geschlagen.length ? z.geschlagen.slice(0, teil.length) : [];
  }

  function notation(z) {
    const t = z.geschlagen.length ? 'x' : '-';
    return feldName(z.von) + t + z.pfad.map(feldName).join(t) + (z.dame ? ' D' : '');
  }

  function ziehen(s, zEin) {
    const alle = zuege(s);
    const z = alle.find(y => gleich(y, zEin));
    if (!z) throw new Error('Regelwidriger Zug ' + feldName(zEin.von) + ' ' + zEin.pfad.map(feldName).join(' '));
    const b = s.b.slice(), p = b[z.von];
    b[z.von] = '';
    for (const q of z.geschlagen) b[q] = '';
    const ziel = z.pfad[z.pfad.length - 1];
    b[ziel] = z.dame ? p.toUpperCase() : p;
    const n = {
      b, am: gegner(s.am), regeln: s.regeln, ohne: (z.geschlagen.length || z.dame) ? 0 : s.ohne + 1,
      zl: s.zl.concat([notation(z)]), liste: s.liste.concat([[z.von].concat(z.pfad)]), wdh: Object.assign({}, s.wdh),
      letzter: {von: z.von, pfad: z.pfad.slice(), geschlagen: z.geschlagen.slice()}, erg: null,
      geschlagen: Object.assign({}, s.geschlagen)
    };
    n.geschlagen[s.am] += z.geschlagen.length;
    const k = schluessel(n); n.wdh[k] = (n.wdh[k] || 0) + 1;
    if (!zuege(n).length) n.erg = {art: 'keinzug', sieger: s.am};
    else if (n.wdh[k] >= 3) n.erg = {art: 'wiederholung', sieger: null};
    else if (n.ohne >= 50) n.erg = {art: 'ohneschlag', sieger: null};
    return n;
  }
  function beenden(s, art, verlierer) {
    const n = Object.assign({}, s);
    n.erg = art === 'aufgabe' ? {art, sieger: gegner(verlierer)} : {art: 'einigung', sieger: null};
    return n;
  }
  function nachspielen(liste, regeln) {
    let s = neu(regeln);
    for (const [von, ...pfad] of liste) s = ziehen(s, {von, pfad});
    return s;
  }
  const zaehlen = (s, f) => s.b.filter(p => p && farbeVon(p) === f).length;
  const ERGTEXT = {keinzug: 'Kein Zug mehr möglich', wiederholung: 'Dreifache Stellungswiederholung',
    ohneschlag: '25 Züge ohne Schlag und ohne neue Dame', einigung: 'Remis vereinbart', aufgabe: 'Aufgabe'};

  const X = {neu, aus, zuege, ziehen, beenden, nachspielen, naechsteFelder, vollstaendig, teilGeschlagen, schlagFolgen,
    feldName, feldIndex, dunkel, farbeVon, istDame, gegner, schluessel, zaehlen, notation, ERGTEXT, VORGABE};
  if (typeof module !== 'undefined') module.exports = X; else window.Dame = X;
})();
