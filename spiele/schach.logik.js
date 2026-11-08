/* Schach – reine Spielregeln (ohne DOM).

   Regelquelle: FIDE-Handbuch, „Laws of Chess“ (gültig seit 1. Januar 2023),
   https://handbook.fide.com/chapter/E012023 – Teil „Basic Rules of Play“.
     Art. 3.1–3.9   Gangarten der Figuren, Schach, regelwidrige Züge (König darf nie im Schach stehen bleiben)
     Art. 3.7.3.1–2 en passant: nur unmittelbar im nächsten Zug nach dem Doppelschritt
     Art. 3.7.3.3   Umwandlung in Dame, Turm, Läufer oder Springer der eigenen Farbe (unabhängig vom Geschlagenen)
     Art. 3.8.2     Rochade: König und Turm unbewegt; kein Schach; König überquert/erreicht kein angegriffenes Feld;
                    alle Felder zwischen König und Turm frei
     Art. 5.1.1     Matt beendet die Partie sofort
     Art. 5.1.2     Aufgabe – verliert, außer der Gegner könnte mit keiner Zugfolge mattsetzen (dann Remis)
     Art. 5.2.1     Patt = Remis
     Art. 5.2.2     Tote Stellung = Remis (hier: ungenügendes Material, siehe unten)
     Art. 5.2.3/9.1 Remis durch Einigung
     Art. 6.9       Zeitüberschreitung verliert, außer der Gegner kann mit keiner Zugfolge mattsetzen (dann Remis)
     Art. 9.2       Dreifache Stellungswiederholung: Remis auf Antrag der Person am Zug – entweder nach dem Entstehen
                    oder vor dem eigenen Zug, der sie herbeiführt
     Art. 9.3       50-Züge-Regel (50 Züge je Seite ohne Bauernzug und ohne Schlag): Remis auf Antrag, ebenso vorab
     Art. 9.6.1/2   Fünffache Wiederholung bzw. 75 Züge je Seite ohne Bauernzug/Schlag: Remis ohne Antrag
                    (setzt der 75. Zug matt, gilt das Matt)

   Auslegungen für das Spiel am iPad:
   - „Gleiche Stellung“ (Art. 9.2.2): gleiche Seite am Zug, gleiche Figuren auf gleichen Feldern, gleiche
     Rochaderechte, und ein en-passant-Recht zählt nur, wenn der Schlag tatsächlich regelgerecht möglich ist.
   - Tote Stellung wird automatisch erkannt bei: König gegen König, König+Läufer gegen König, König+Springer gegen
     König sowie Stellungen, in denen außer den Königen nur Läufer auf Feldern einer Farbe stehen. Weitere, seltene
     tote Stellungen (z. B. vollständig verriegelte Bauernketten) erkennt das Spiel nicht; dafür bleibt das Remisangebot.
   - „Kann der Gegner überhaupt mattsetzen?“ (Art. 5.1.2, 6.9): nein, wenn er nur den König hat, oder König und eine
     Leichtfigur gegen den nackten König, oder wenn nur gleichfarbige Läufer auf dem Brett stehen. Sonst ja
     (mit Hilfsmatt ist fast immer ein Matt denkbar, z. B. König+Springer gegen König+Bauer).
   - Bedenkzeit ohne Zuschlag, die Uhr führt die Seite. Zug zurücknehmen ist keine FIDE-Regel; das Spiel erlaubt es
     nur mit Zustimmung der anderen Person (Freundschaftspartie).
   - Notation: deutsche algebraische Kurznotation (K D T L S, Bauer ohne Buchstabe, x = schlägt, 0-0 / 0-0-0,
     Umwandlung „e8D“, + Schach, # Matt, „e.p.“ beim en-passant-Schlag).

   Felder: Index 0..63, Index = Reihe*8 + Linie, Reihe 0 = 1. Reihe (Weiß unten), Linie 0 = a.
   Figuren: 'P N B R Q K' für Weiß, 'p n b r q k' für Schwarz, '' = leer. */
"use strict";
(function () {
  const LINIEN = 'abcdefgh';
  const DE = {K: 'K', Q: 'D', R: 'T', B: 'L', N: 'S', P: ''};
  const WERT = {P: 1, N: 3, B: 3, R: 5, Q: 9, K: 0};
  const feldName = i => LINIEN[i % 8] + (Math.floor(i / 8) + 1);
  const feldIndex = n => (n.charCodeAt(0) - 97) + (parseInt(n.slice(1), 10) - 1) * 8;
  const farbeVon = p => !p ? null : (p === p.toUpperCase() ? 'w' : 'b');
  const typ = p => p ? p.toUpperCase() : '';
  const gegner = f => f === 'w' ? 'b' : 'w';
  const L = i => i % 8, R = i => Math.floor(i / 8);
  const feldHell = i => (L(i) + R(i)) % 2 === 1; // a1 ist dunkel

  const START = ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'];

  function neu() {
    const b = Array(64).fill('');
    for (let f = 0; f < 8; f++) { b[f] = START[f]; b[8 + f] = 'P'; b[48 + f] = 'p'; b[56 + f] = START[f].toLowerCase(); }
    return mitStart({b, am: 'w', r: 'KQkq', ep: -1, hz: 0, nr: 1});
  }
  function mitStart(s) {
    s.zl = []; s.liste = []; s.wdh = {}; s.letzter = null; s.erg = null;
    s.geschlagen = {w: [], b: []};
    s.wdh[schluessel(s)] = 1;
    s.lage = lageBerechnen(s);
    return s;
  }
  /* FEN nur für Tests und Fehlersuche */
  function vonFen(fen) {
    const [brett, am, r, ep, hz, nr] = fen.trim().split(/\s+/);
    const b = Array(64).fill('');
    brett.split('/').forEach((zeile, k) => {
      let f = 0; const reihe = 7 - k;
      for (const ch of zeile) { if (/\d/.test(ch)) f += +ch; else { b[reihe * 8 + f] = ch; f++; } }
    });
    return mitStart({b, am: am || 'w', r: r && r !== '-' ? r : '', ep: ep && ep !== '-' ? feldIndex(ep) : -1, hz: +(hz || 0), nr: +(nr || 1)});
  }
  function fen(s) {
    let out = [];
    for (let reihe = 7; reihe >= 0; reihe--) {
      let z = '', leer = 0;
      for (let f = 0; f < 8; f++) { const p = s.b[reihe * 8 + f]; if (!p) leer++; else { if (leer) z += leer; leer = 0; z += p; } }
      if (leer) z += leer; out.push(z);
    }
    return `${out.join('/')} ${s.am} ${s.r || '-'} ${s.ep >= 0 ? feldName(s.ep) : '-'} ${s.hz} ${s.nr}`;
  }

  /* ---------- Angriff ---------- */
  const SPR = [[1, 2], [2, 1], [2, -1], [1, -2], [-1, -2], [-2, -1], [-2, 1], [-1, 2]];
  const KOE = [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]];
  const DIAG = [[1, 1], [1, -1], [-1, 1], [-1, -1]], GERADE = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  const auf = (l, r) => (l >= 0 && l < 8 && r >= 0 && r < 8) ? r * 8 + l : -1;

  function angegriffen(b, sq, von) {
    const l = L(sq), r = R(sq);
    // Bauern
    const pr = von === 'w' ? r - 1 : r + 1, bauer = von === 'w' ? 'P' : 'p';
    for (const dl of [-1, 1]) { const q = auf(l + dl, pr); if (q >= 0 && b[q] === bauer) return true; }
    const eig = p => p && farbeVon(p) === von;
    for (const [dl, dr] of SPR) { const q = auf(l + dl, r + dr); if (q >= 0 && eig(b[q]) && typ(b[q]) === 'N') return true; }
    for (const [dl, dr] of KOE) { const q = auf(l + dl, r + dr); if (q >= 0 && eig(b[q]) && typ(b[q]) === 'K') return true; }
    for (const [dirs, typen] of [[DIAG, 'BQ'], [GERADE, 'RQ']]) {
      for (const [dl, dr] of dirs) {
        let x = l + dl, y = r + dr;
        while (true) {
          const q = auf(x, y); if (q < 0) break;
          const p = b[q];
          if (p) { if (eig(p) && typen.includes(typ(p))) return true; break; }
          x += dl; y += dr;
        }
      }
    }
    return false;
  }
  const koenig = (b, f) => b.indexOf(f === 'w' ? 'K' : 'k');
  const imSchach = (b, f) => { const k = koenig(b, f); return k >= 0 && angegriffen(b, k, gegner(f)); };

  /* ---------- Züge ---------- */
  function pseudo(s) {
    const {b, am} = s, out = [];
    const add = (von, nach, extra) => out.push(Object.assign({von, nach, stueck: typ(b[von]), schlag: !!b[nach]}, extra));
    for (let i = 0; i < 64; i++) {
      const p = b[i]; if (!p || farbeVon(p) !== am) continue;
      const t = typ(p), l = L(i), r = R(i);
      if (t === 'P') {
        const dir = am === 'w' ? 1 : -1, startR = am === 'w' ? 1 : 6, letzte = am === 'w' ? 7 : 0;
        const pushU = (von, nach, extra) => {
          if (R(nach) === letzte) for (const u of ['Q', 'R', 'B', 'N']) add(von, nach, Object.assign({umw: u}, extra));
          else add(von, nach, extra);
        };
        const v = auf(l, r + dir);
        if (v >= 0 && !b[v]) {
          pushU(i, v);
          const v2 = auf(l, r + 2 * dir);
          if (r === startR && !b[v2]) add(i, v2, {doppel: true});
        }
        for (const dl of [-1, 1]) {
          const q = auf(l + dl, r + dir); if (q < 0) continue;
          if (b[q] && farbeVon(b[q]) !== am) pushU(i, q);
          else if (q === s.ep && !b[q]) add(i, q, {ep: true, schlag: true});
        }
      } else if (t === 'N' || t === 'K') {
        for (const [dl, dr] of (t === 'N' ? SPR : KOE)) {
          const q = auf(l + dl, r + dr);
          if (q >= 0 && (!b[q] || farbeVon(b[q]) !== am)) add(i, q);
        }
        if (t === 'K') {
          const grund = am === 'w' ? 0 : 56, gg = gegner(am);
          const T = am === 'w' ? 'R' : 'r';
          if (i === grund + 4 && !angegriffen(b, i, gg)) {
            if (s.r.includes(am === 'w' ? 'K' : 'k') && b[grund + 7] === T && !b[grund + 5] && !b[grund + 6]
              && !angegriffen(b, grund + 5, gg) && !angegriffen(b, grund + 6, gg)) add(i, grund + 6, {rochade: 'k'});
            if (s.r.includes(am === 'w' ? 'Q' : 'q') && b[grund] === T && !b[grund + 1] && !b[grund + 2] && !b[grund + 3]
              && !angegriffen(b, grund + 3, gg) && !angegriffen(b, grund + 2, gg)) add(i, grund + 2, {rochade: 'q'});
          }
        }
      } else {
        const dirs = t === 'B' ? DIAG : t === 'R' ? GERADE : DIAG.concat(GERADE);
        for (const [dl, dr] of dirs) {
          let x = l + dl, y = r + dr;
          while (true) {
            const q = auf(x, y); if (q < 0) break;
            if (!b[q]) add(i, q);
            else { if (farbeVon(b[q]) !== am) add(i, q); break; }
            x += dl; y += dr;
          }
        }
      }
    }
    return out;
  }
  function brettNach(s, z) {
    const b = s.b.slice(), p = b[z.von];
    b[z.nach] = z.umw ? (s.am === 'w' ? z.umw : z.umw.toLowerCase()) : p;
    b[z.von] = '';
    if (z.ep) b[z.nach + (s.am === 'w' ? -8 : 8)] = '';
    if (z.rochade) {
      const grund = s.am === 'w' ? 0 : 56;
      if (z.rochade === 'k') { b[grund + 5] = b[grund + 7]; b[grund + 7] = ''; }
      else { b[grund + 3] = b[grund]; b[grund] = ''; }
    }
    return b;
  }
  function zuege(s) {
    if (s.erg) return [];
    return pseudo(s).filter(z => !imSchach(brettNach(s, z), s.am));
  }
  /* Ein en-passant-Recht zählt für die Wiederholung nur, wenn der Schlag wirklich regelgerecht möglich ist. */
  function epWirksam(s) {
    if (s.ep < 0) return -1;
    return pseudo(s).some(z => z.ep && !imSchach(brettNach(s, z), s.am)) ? s.ep : -1;
  }
  function schluessel(s) { return s.b.map(p => p || '.').join('') + s.am + (s.r || '-') + epWirksam(s); }

  /* ---------- Material ---------- */
  function figuren(b) {
    const o = {w: [], b: []};
    b.forEach((p, i) => { if (p && typ(p) !== 'K') o[farbeVon(p)].push({t: typ(p), i}); });
    return o;
  }
  function nurGleichfarbigeLaeufer(f) {
    const alle = f.w.concat(f.b);
    if (!alle.length || alle.some(x => x.t !== 'B')) return false;
    const h = feldHell(alle[0].i); return alle.every(x => feldHell(x.i) === h);
  }
  /* Kann `farbe` mit irgendeiner Zugfolge noch mattsetzen? (Auslegung siehe Kopf) */
  function kannMattSetzen(s, farbe) {
    const f = figuren(s.b), eig = f[farbe], and = f[gegner(farbe)];
    if (!eig.length) return false;
    if (nurGleichfarbigeLaeufer(f)) return false;
    if (eig.length === 1 && (eig[0].t === 'B' || eig[0].t === 'N') && !and.length) return false;
    return true;
  }
  function toteStellung(s) {
    const f = figuren(s.b);
    if (!f.w.length && !f.b.length) return true;
    if (nurGleichfarbigeLaeufer(f)) return true;
    const eine = (x, y) => x.length === 1 && (x[0].t === 'B' || x[0].t === 'N') && !y.length;
    return eine(f.w, f.b) || eine(f.b, f.w);
  }

  /* ---------- Notation ---------- */
  function san(s, z, alle) {
    let t;
    if (z.rochade) t = z.rochade === 'k' ? '0-0' : '0-0-0';
    else {
      const st = z.stueck;
      if (st === 'P') {
        t = (z.schlag ? LINIEN[L(z.von)] + 'x' : '') + feldName(z.nach) + (z.umw ? DE[z.umw] : '') + (z.ep ? ' e.p.' : '');
      } else {
        const andere = alle.filter(y => y.stueck === st && y.nach === z.nach && y.von !== z.von && !y.umw);
        let dis = '';
        if (andere.length) {
          if (!andere.some(y => L(y.von) === L(z.von))) dis = LINIEN[L(z.von)];
          else if (!andere.some(y => R(y.von) === R(z.von))) dis = String(R(z.von) + 1);
          else dis = feldName(z.von);
        }
        t = DE[st] + dis + (z.schlag ? 'x' : '') + feldName(z.nach);
      }
    }
    return t;
  }

  /* ---------- Lage nach jedem Zug ---------- */
  function lageBerechnen(s) {
    const moeglich = s.erg ? [] : zuege(s);
    const schach = imSchach(s.b, s.am);
    const anzahl = s.wdh[schluessel(s)] || 0;
    return {schach, zuege: moeglich.length, wiederholung: anzahl, fuenfzig: s.hz >= 100};
  }

  /* Zug ausführen → neuer Zustand. `z` muss aus zuege(s) stammen (oder {von,nach,umw} passend dazu). */
  function ziehen(s, zEin) {
    const alle = zuege(s);
    const z = alle.find(y => y.von === zEin.von && y.nach === zEin.nach && (y.umw || '') === (zEin.umw || ''));
    if (!z) throw new Error('Regelwidriger Zug ' + feldName(zEin.von) + '-' + feldName(zEin.nach));
    const n = {
      b: brettNach(s, z), am: gegner(s.am), r: s.r, ep: -1,
      hz: (z.stueck === 'P' || z.schlag) ? 0 : s.hz + 1, nr: s.am === 'b' ? s.nr + 1 : s.nr,
      zl: s.zl.slice(), liste: s.liste.concat([[z.von, z.nach, z.umw || '']]), wdh: Object.assign({}, s.wdh),
      geschlagen: {w: s.geschlagen.w.slice(), b: s.geschlagen.b.slice()}, erg: null
    };
    // geschlagene Figur merken (Typ in Großbuchstaben)
    if (z.schlag) n.geschlagen[s.am].push(z.ep ? 'P' : typ(s.b[z.nach]));
    if (z.doppel) n.ep = z.nach + (s.am === 'w' ? -8 : 8);
    // Rochaderechte
    let r = n.r;
    const weg = c => { r = r.replace(c, ''); };
    if (z.stueck === 'K') { if (s.am === 'w') { weg('K'); weg('Q'); } else { weg('k'); weg('q'); } }
    for (const q of [z.von, z.nach]) { if (q === 0) weg('Q'); if (q === 7) weg('K'); if (q === 56) weg('q'); if (q === 63) weg('k'); }
    n.r = r;
    const k = schluessel(n); n.wdh[k] = (n.wdh[k] || 0) + 1;
    // Ergebnis
    const folge = zuege(n), schach = imSchach(n.b, n.am);
    let zeichen = '';
    if (!folge.length) {
      if (schach) { n.erg = {art: 'matt', sieger: s.am}; zeichen = '#'; }
      else n.erg = {art: 'patt', sieger: null};
    } else {
      if (schach) zeichen = '+';
      if (toteStellung(n)) n.erg = {art: 'material', sieger: null};
      else if (n.wdh[k] >= 5) n.erg = {art: 'wiederholung5', sieger: null};
      else if (n.hz >= 150) n.erg = {art: 'zug75', sieger: null};
    }
    n.zl.push(san(s, z, alle) + zeichen);
    n.letzter = {von: z.von, nach: z.nach, rochade: z.rochade || null, ep: !!z.ep};
    n.lage = lageBerechnen(n);
    return n;
  }

  /* Darf die Person am Zug Remis beanspruchen – jetzt (ohne Zug) oder mit dem angesagten Zug z? (Art. 9.2, 9.3) */
  function remisAnspruch(s, z) {
    if (s.erg) return null;
    if (!z) {
      if (s.lage.wiederholung >= 3) return 'wiederholung';
      if (s.hz >= 100) return 'fuenfzig';
      return null;
    }
    const n = ziehen(s, z);
    if (n.erg && n.erg.art === 'matt') return null;
    if ((n.wdh[schluessel(n)] || 0) >= 3) return 'wiederholung';
    if (n.hz >= 100) return 'fuenfzig';
    return null;
  }

  /* Partie beenden ohne Zug */
  function beenden(s, art, verlierer) {
    const n = Object.assign({}, s);
    if (art === 'einigung') n.erg = {art, sieger: null};
    else if (art === 'wiederholung' || art === 'fuenfzig') n.erg = {art, sieger: null};
    else if (art === 'aufgabe' || art === 'zeit') {
      const sieger = gegner(verlierer);
      n.erg = kannMattSetzen(s, sieger) ? {art, sieger} : {art: art + 'Remis', sieger: null};
    }
    n.lage = lageBerechnen(n);
    return n;
  }

  /* Aus der Zugliste neu aufbauen (Laden, Zurücknehmen) */
  function nachspielen(liste, start) {
    let s = start ? vonFen(start) : neu();
    for (const [von, nach, umw] of liste) s = ziehen(s, {von, nach, umw});
    return s;
  }

  const ERGTEXT = {
    matt: 'Schachmatt', patt: 'Patt', material: 'Ungenügendes Material', wiederholung5: 'Fünffache Stellungswiederholung',
    zug75: '75-Züge-Regel', wiederholung: 'Dreifache Stellungswiederholung', fuenfzig: '50-Züge-Regel', einigung: 'Remis vereinbart',
    aufgabe: 'Aufgabe', zeit: 'Zeit abgelaufen', aufgabeRemis: 'Aufgabe – aber kein Matt mehr möglich',
    zeitRemis: 'Zeit abgelaufen – aber kein Matt mehr möglich'
  };
  function materialPunkte(s, f) { return s.geschlagen[f].reduce((a, t) => a + WERT[t], 0); }

  const X = {neu, vonFen, fen, zuege, ziehen, remisAnspruch, beenden, nachspielen, imSchach, angegriffen, kannMattSetzen,
    toteStellung, schluessel, feldName, feldIndex, farbeVon, typ, gegner, feldHell, ERGTEXT, WERT, DE, materialPunkte};
  if (typeof module !== 'undefined') module.exports = X; else window.Schach = X;
})();
