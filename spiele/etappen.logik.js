/* Zehn Etappen – reine Spielregeln, ohne DOM.
   Regelquelle (recherchiert 08.11.2026): offizielle englische Spielanleitung des Vorbilds (Text des Herstellers,
   veröffentlicht vom Lizenzverlag Tactic: tactic.net/site/rules/FIN/03140.pdf), Abschnitte Contents, Before Play,
   Play, Definitions (Sets, Runs, All one color, Wild cards, Skip cards), Making a Phase, Hitting, Going out,
   Scoring, The Winner. Abgeglichen mit dem Hersteller-Blatt W4729 (© 2010) und de.wikipedia.
   Regeln, wie umgesetzt:
   1. 108 Karten: je Farbe (rot, blau, gelb, grün) zweimal 1–12 (= 96), 8 Joker, 4 Aussetzen-Karten.
      (Joker und Aussetzen tragen im Original eine Druckfarbe ohne Spielbedeutung – hier farblos.)
   2. Geber teilt jeder Person 10 Karten aus, Rest = Stapel, oberste Karte offen = Ablage. Die Person links vom Geber
      beginnt, danach im Uhrzeigersinn. Nach jeder Runde gibt die Person links vom bisherigen Geber.
      Erster Geber wird ausgelost.
   3. Zug: eine Karte ziehen (Stapel oder oberste Ablagekarte), am Ende eine Karte abwerfen.
      Eine Aussetzen-Karte darf nie von der Ablage genommen werden. Ein Joker als erste Ablagekarte darf genommen werden.
   4. Die zehn Etappen (in fester Reihenfolge, je Runde höchstens eine):
      1: 2 Drillinge · 2: 1 Drilling + 1 Viererfolge · 3: 1 Vierling + 1 Viererfolge · 4: Siebenerfolge ·
      5: Achterfolge · 6: Neunerfolge · 7: 2 Vierlinge · 8: 7 Karten einer Farbe · 9: 1 Fünfling + 1 Zwilling ·
      10: 1 Fünfling + 1 Drilling.
      Satz (Drilling …) = gleiche Zahl, Farben beliebig; Folge = lückenlos aufsteigende Zahlen, Farben beliebig,
      nur 1–12 (kein Übergang 12→1); Farbe = gleiche Farbe, Zahlen beliebig.
   5. Joker ersetzen jede Zahl und jede Farbe. Beliebig viele Joker, solange mindestens eine echte Karte dabei ist.
      Auslegung: Die echte Karte wird JE GRUPPE verlangt (sonst wäre Zahl bzw. Farbe der Gruppe unbestimmt).
      Ein ausgelegter Joker bleibt bis Rundenende, was er ist. Liegen Joker am Rand einer Folge, wählt man beim
      Auslegen, welche Zahlen sie darstellen.
   6. Die Etappe muss ganz auf der Hand sein. Man darf mehr Karten als verlangt auslegen, wenn sie direkt in die
      Gruppen passen (z. B. vier statt drei Fünfen), aber keine zusätzliche Gruppe.
   7. Anlegen: erst wenn die eigene Etappe liegt, nur im eigenen Zug, an eigene und fremde Gruppen. Auslegung: schon
      im selben Zug wie das Auslegen erlaubt (die Anleitung verlangt nur, dass die eigene Etappe „bereits“ liegt).
      Folgen werden nur an den Enden verlängert.
   8. Aussetzen: abwerfen und eine andere Person wählen, die ihren nächsten Zug verliert. Gegen jede Person nur ein
      Aussetzen je Umlauf – umgesetzt: wer schon ein offenes Aussetzen hat, kann kein zweites bekommen.
      Liegt als erste Ablagekarte ein Aussetzen, verliert die erste Person ihren ersten Zug.
      Aussetzen zählt nie zu einer Etappe.
   9. Rundenende: wer alle Handkarten los ist (durch Abwerfen oder Anlegen), beendet die Runde. Alle, die ihre
      Etappe ausgelegt haben, gehen zur nächsten über. Strafpunkte für die Handkarten der anderen: 1–9 je 5,
      10–12 je 10, Aussetzen 15, Joker 25. Ist der Stapel leer, wird die Ablage ohne oberste Karte gemischt
      (Auslegung, in der Anleitung nicht geregelt).
   10. Spielende: Wer am Ende einer Runde Etappe 10 geschafft hat, gewinnt. Schaffen es mehrere in derselben Runde,
      gewinnt, wer insgesamt die wenigsten Punkte hat. Bei Gleichstand spielen nur die Gleichstehenden Etappe 10
      noch einmal; wer zuerst alle Karten los ist, gewinnt.
   Kartenform: {id, f:'rot'|'blau'|'gelb'|'gruen'|null, w: 1…12 | 'J' (Joker) | 'A' (Aussetzen)}. */
(function () {
  'use strict';
  const FARBEN = ['rot', 'blau', 'gelb', 'gruen'];
  const FARBNAME = {rot: 'Rot', blau: 'Blau', gelb: 'Gelb', gruen: 'Grün'};
  const PHASEN = [
    [{t: 'satz', n: 3}, {t: 'satz', n: 3}],
    [{t: 'satz', n: 3}, {t: 'folge', n: 4}],
    [{t: 'satz', n: 4}, {t: 'folge', n: 4}],
    [{t: 'folge', n: 7}],
    [{t: 'folge', n: 8}],
    [{t: 'folge', n: 9}],
    [{t: 'satz', n: 4}, {t: 'satz', n: 4}],
    [{t: 'farbe', n: 7}],
    [{t: 'satz', n: 5}, {t: 'satz', n: 2}],
    [{t: 'satz', n: 5}, {t: 'satz', n: 3}]
  ];
  const SATZNAME = {2: 'Zwilling', 3: 'Drilling', 4: 'Vierling', 5: 'Fünfling'};
  const ZAHLWORT = {4: 'Vierer', 7: 'Siebener', 8: 'Achter', 9: 'Neuner'};
  const teilText = g => g.t === 'satz' ? SATZNAME[g.n] : g.t === 'folge' ? `${ZAHLWORT[g.n]}folge` : `${g.n} Karten einer Farbe`;
  function phaseText(i) {
    const p = PHASEN[i];
    if (p.length === 2 && p[0].t === p[1].t && p[0].n === p[1].n) return `2 ${p[0].t === 'satz' ? SATZNAME[p[0].n].replace('ling', 'linge') : ''}`.trim();
    return p.map(g => (p.length === 2 ? '1 ' : '') + teilText(g)).join(' + ');
  }

  function stdZufall(n) { return Math.floor(Math.random() * n); }
  function mischen(a, rnd) { for (let i = a.length - 1; i > 0; i--) { const j = rnd(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  function deck() {
    const d = []; let id = 0;
    for (const f of FARBEN) for (let w = 1; w <= 12; w++) for (let k = 0; k < 2; k++) d.push({id: id++, f, w});
    for (let k = 0; k < 8; k++) d.push({id: id++, f: null, w: 'J'});
    for (let k = 0; k < 4; k++) d.push({id: id++, f: null, w: 'A'});
    return d;
  }
  const wert = k => k.w === 'J' ? 25 : k.w === 'A' ? 15 : k.w >= 10 ? 10 : 5;
  const echt = k => typeof k.w === 'number';

  /* ---------- Gruppen und Etappen prüfen ---------- */
  // Liefert alle möglichen Lagen einer Gruppe: {t, wert | von,bis | farbe, karten:[{...k, als}]}
  function gruppeLagen(spec, karten) {
    if (karten.some(k => k.w === 'A') || karten.length < spec.n) return [];
    const nat = karten.filter(echt), jok = karten.filter(k => k.w === 'J');
    if (!nat.length) return [];
    if (spec.t === 'satz') {
      if (nat.some(k => k.w !== nat[0].w)) return [];
      return [{t: 'satz', wert: nat[0].w, karten: karten.map(k => ({...k, als: nat[0].w}))}];
    }
    if (spec.t === 'farbe') {
      if (nat.some(k => k.f !== nat[0].f)) return [];
      return [{t: 'farbe', farbe: nat[0].f, karten: karten.map(k => ({...k, als: k.w === 'J' ? null : k.w}))}];
    }
    const zahlen = nat.map(k => k.w); if (new Set(zahlen).size !== zahlen.length) return [];
    const n = karten.length; if (n > 12) return [];
    const lo = Math.min(...zahlen), hi = Math.max(...zahlen); if (hi - lo + 1 > n) return [];
    const lagen = [];
    for (let a = Math.max(1, hi - n + 1); a <= Math.min(lo, 13 - n); a++) {
      const frei = []; for (let v = a; v < a + n; v++) if (!zahlen.includes(v)) frei.push(v);
      const belegt = [...nat.map(k => ({...k, als: k.w})), ...jok.map((k, i) => ({...k, als: frei[i]}))].sort((x, y) => x.als - y.als);
      lagen.push({t: 'folge', von: a, bis: a + n - 1, karten: belegt});
    }
    return lagen;
  }
  const lageSchluessel = l => l.map(g => g.t === 'satz' ? `S${g.wert}x${g.karten.length}` : g.t === 'farbe' ? `F${g.farbe}x${g.karten.length}` : `L${g.von}-${g.bis}`).sort().join('|');
  /* Alle verschiedenen Möglichkeiten, die Karten als Etappe `pi` auszulegen (leer = erfüllt die Etappe nicht). */
  function etappeLagen(pi, karten) {
    const spec = PHASEN[pi], aus = new Map();
    if (spec.length === 1) { gruppeLagen(spec[0], karten).forEach(g => aus.set(lageSchluessel([g]), [g])); return [...aus.values()]; }
    const n = karten.length, gleich = spec[0].t === spec[1].t && spec[0].n === spec[1].n;
    if (n < spec[0].n + spec[1].n) return [];
    for (let m = 0; m < (1 << n); m++) {
      if (gleich && (m & 1)) continue; // symmetrische Teilung nur einmal
      const a = [], b = []; karten.forEach((k, i) => ((m >> i) & 1 ? b : a).push(k));
      if (a.length < spec[0].n || b.length < spec[1].n) continue;
      const la = gruppeLagen(spec[0], a); if (!la.length) continue;
      const lb = gruppeLagen(spec[1], b);
      for (const x of la) for (const y of lb) { const l = [x, y], s = lageSchluessel(l); if (!aus.has(s)) aus.set(s, l); }
    }
    return [...aus.values()];
  }
  /* Kurze Begründung, warum eine Auswahl die Etappe (noch) nicht erfüllt. */
  function etappeGrund(pi, karten) {
    if (!karten.length) return 'Tippe die Karten deiner Etappe an.';
    if (karten.some(k => k.w === 'A')) return 'Aussetzen-Karten gehören in keine Etappe.';
    const min = PHASEN[pi].reduce((s, g) => s + g.n, 0);
    if (karten.length < min) return `Noch ${min - karten.length} Karte${min - karten.length === 1 ? '' : 'n'} – die Etappe braucht mindestens ${min}.`;
    return etappeLagen(pi, karten).length ? '' : `Diese Karten ergeben keine Etappe ${pi + 1}.`;
  }

  /* ---------- Spielzustand ---------- */
  function neu({namen}, rnd = stdZufall, test = {}) {
    const z = {v: 1, namen: namen.slice(), punkte: namen.map(() => 0), etappe: namen.map(() => 0), geber: rnd(namen.length),
      runde: 0, aktive: namen.map((_, i) => i), stechen: false, verlauf: [], log: [], gid: 1};
    neueRunde(z, rnd, test, true);
    return z;
  }
  function melde(z, t) { z.log.push(t); if (z.log.length > 6) z.log.shift(); }
  function nachAktiv(z, i) { const n = z.namen.length; for (let s = 1; s <= n; s++) { const j = (i + s) % n; if (z.aktive.includes(j)) return j; } return i; }
  /* Nächste Person, die wirklich dran ist (offenes Aussetzen wird verbraucht). */
  function naechster(z, i) {
    let j = nachAktiv(z, i);
    for (let s = 0; s < 3 * z.namen.length && z.aussetzen[j]; s++) { z.aussetzen[j] = false; melde(z, `${z.namen[j]} setzt aus.`); j = nachAktiv(z, j); }
    return j;
  }
  function neueRunde(z, rnd = stdZufall, test = {}, erste = false) {
    if (!erste) z.geber = (z.geber + 1) % z.namen.length;
    z.runde++;
    z.stapel = test.stapel ? test.stapel.slice() : mischen(deck(), rnd);
    z.haende = z.namen.map(() => []);
    for (let r = 0; r < 10; r++) { let j = z.geber; for (let s = 0; s < z.aktive.length; s++) { j = nachAktiv(z, j); z.haende[j].push(z.stapel.pop()); } }
    z.ablage = [z.stapel.pop()]; z.auslagen = []; z.ausgelegt = z.namen.map(() => false); z.aussetzen = z.namen.map(() => false);
    z.log = []; z.ergebnis = null; z.phase = 'ziehen';
    const erster = nachAktiv(z, z.geber);
    if (z.ablage[0].w === 'A') { z.aussetzen[erster] = true; z.dran = naechster(z, z.geber); }
    else z.dran = erster;
    return z;
  }
  const oben = z => z.ablage[z.ablage.length - 1];
  function ablageNehmbar(z) { const t = oben(z); return !!t && t.w !== 'A'; }

  function ziehen(z, quelle, rnd = stdZufall) {
    if (z.phase !== 'ziehen') return {ok: false, grund: 'Du hast schon gezogen.'};
    const sp = z.dran; let k;
    if (quelle === 'ablage') {
      if (!ablageNehmbar(z)) return {ok: false, grund: 'Eine Aussetzen-Karte darf nicht von der Ablage genommen werden.'};
      k = z.ablage.pop(); melde(z, `${z.namen[sp]} nimmt die offene Karte.`);
    } else {
      if (!z.stapel.length && z.ablage.length > 1) { const t = z.ablage.pop(); z.stapel = mischen(z.ablage, rnd); z.ablage = [t]; melde(z, 'Die Ablage wird gemischt und ist der neue Stapel.'); }
      k = z.stapel.pop();
      if (k) melde(z, `${z.namen[sp]} zieht vom Stapel.`); else melde(z, `${z.namen[sp]} kann nicht ziehen.`);
    }
    if (k) z.haende[sp].push(k);
    z.phase = 'spielen';
    return {ok: true, karte: k || null};
  }
  function karten(z, ids) { const h = z.haende[z.dran]; const r = ids.map(id => h.find(k => k.id === id)); return r.every(Boolean) && new Set(ids).size === ids.length ? r : null; }

  function auslegen(z, ids, wahl = 0) {
    const sp = z.dran;
    if (z.phase !== 'spielen') return {ok: false, grund: 'Zuerst eine Karte ziehen.'};
    if (z.ausgelegt[sp]) return {ok: false, grund: 'Deine Etappe liegt schon.'};
    const ks = karten(z, ids); if (!ks) return {ok: false, grund: 'Karten nicht auf der Hand.'};
    const lagen = etappeLagen(z.etappe[sp], ks);
    if (!lagen.length) return {ok: false, grund: etappeGrund(z.etappe[sp], ks)};
    const lage = lagen[Math.min(wahl, lagen.length - 1)];
    lage.forEach(g => z.auslagen.push({gid: z.gid++, besitzer: sp, ...g}));
    z.haende[sp] = z.haende[sp].filter(k => !ids.includes(k.id));
    z.ausgelegt[sp] = true;
    melde(z, `${z.namen[sp]} legt Etappe ${z.etappe[sp] + 1} aus.`);
    if (!z.haende[sp].length) rundeWerten(z, sp);
    return {ok: true, rundeVorbei: z.phase !== 'spielen'};
  }
  /* Wo passt Karte `id` an? → [{gid, ende}] */
  function anlegeZiele(z, id) {
    const sp = z.dran, k = z.haende[sp].find(c => c.id === id);
    if (!k || z.phase !== 'spielen' || !z.ausgelegt[sp] || k.w === 'A') return [];
    const r = [];
    for (const g of z.auslagen) {
      if (g.t === 'satz') { if (k.w === 'J' || k.w === g.wert) r.push({gid: g.gid, ende: null}); }
      else if (g.t === 'farbe') { if (k.w === 'J' || k.f === g.farbe) r.push({gid: g.gid, ende: null}); }
      else {
        if (g.von > 1 && (k.w === 'J' || k.w === g.von - 1)) r.push({gid: g.gid, ende: 'unten'});
        if (g.bis < 12 && (k.w === 'J' || k.w === g.bis + 1)) r.push({gid: g.gid, ende: 'oben'});
      }
    }
    return r;
  }
  function anlegen(z, id, gid, ende = null) {
    const sp = z.dran, ziele = anlegeZiele(z, id).filter(x => x.gid === gid);
    if (!ziele.length) return {ok: false, grund: z.ausgelegt[sp] ? 'Die Karte passt hier nicht.' : 'Anlegen geht erst, wenn deine Etappe liegt.'};
    const ziel = ziele.find(x => x.ende === ende) || ziele[0];
    const g = z.auslagen.find(x => x.gid === gid), h = z.haende[sp], k = h.find(c => c.id === id);
    h.splice(h.indexOf(k), 1);
    if (g.t === 'folge') {
      if (ziel.ende === 'unten') { g.von--; g.karten.unshift({...k, als: g.von}); } else { g.bis++; g.karten.push({...k, als: g.bis}); }
    } else g.karten.push({...k, als: g.t === 'satz' ? g.wert : (k.w === 'J' ? null : k.w)});
    melde(z, `${z.namen[sp]} legt eine Karte bei ${g.besitzer === sp ? 'sich' : z.namen[g.besitzer]} an.`);
    if (!h.length) rundeWerten(z, sp);
    return {ok: true, rundeVorbei: z.phase !== 'spielen'};
  }
  /* Wen darf ein Aussetzen treffen? */
  function aussetzZiele(z) { return z.aktive.filter(i => i !== z.dran && !z.aussetzen[i]); }
  function abwerfen(z, id, ziel = null) {
    const sp = z.dran;
    if (z.phase !== 'spielen') return {ok: false, grund: 'Zuerst eine Karte ziehen.'};
    const h = z.haende[sp], k = h.find(c => c.id === id); if (!k) return {ok: false};
    const zl = aussetzZiele(z);
    if (k.w === 'A' && h.length > 1 && zl.length && !zl.includes(ziel)) return {ok: false, grund: 'Wähle, wer aussetzen muss.'};
    h.splice(h.indexOf(k), 1); z.ablage.push(k);
    if (k.w === 'A' && h.length && zl.includes(ziel)) { z.aussetzen[ziel] = true; melde(z, `${z.namen[sp]} wirft Aussetzen ab: ${z.namen[ziel]} verliert den nächsten Zug.`); }
    else melde(z, `${z.namen[sp]} wirft ab.`);
    if (!h.length) { rundeWerten(z, sp); return {ok: true, rundeVorbei: true}; }
    z.phase = 'ziehen'; z.dran = naechster(z, sp);
    return {ok: true, rundeVorbei: false};
  }

  function rundeWerten(z, sieger) {
    const einzel = z.aktive.map(i => ({sp: i, wert: z.haende[i].reduce((s, k) => s + wert(k), 0), karten: z.haende[i].length,
      geschafft: z.ausgelegt[i], etappe: z.etappe[i]}));
    einzel.forEach(e => { z.punkte[e.sp] += e.wert; });
    const zehn = einzel.filter(e => e.geschafft && e.etappe === 9).map(e => e.sp);
    einzel.forEach(e => { if (e.geschafft && e.etappe < 9) z.etappe[e.sp]++; });
    z.ergebnis = {sieger, einzel, zehn, stechen: null, spielSieger: null, warStechen: z.stechen};
    z.verlauf.push({runde: z.runde, sieger, punkte: einzel.map(e => [e.sp, e.wert])});
    melde(z, `${z.namen[sieger]} ist alle Karten los.`);
    if (z.stechen) { z.ergebnis.spielSieger = sieger; z.phase = 'spielende'; return; }
    if (zehn.length) {
      const min = Math.min(...zehn.map(i => z.punkte[i])), best = zehn.filter(i => z.punkte[i] === min);
      if (best.length === 1) { z.ergebnis.spielSieger = best[0]; z.phase = 'spielende'; return; }
      z.ergebnis.stechen = best;
    }
    z.phase = 'rundenende';
  }
  function naechsteRunde(z, rnd = stdZufall, test) {
    if (z.phase !== 'rundenende') return {ok: false};
    if (z.ergebnis.stechen) { z.aktive = z.ergebnis.stechen.slice(); z.stechen = true; z.aktive.forEach(i => { z.etappe[i] = 9; }); }
    neueRunde(z, rnd, test);
    return {ok: true};
  }

  const api = {FARBEN, FARBNAME, PHASEN, phaseText, teilText, deck, wert, echt, gruppeLagen, etappeLagen, etappeGrund, neu, neueRunde,
    naechsteRunde, ziehen, ablageNehmbar, auslegen, anlegeZiele, anlegen, aussetzZiele, abwerfen, oben, mischen, lageSchluessel};
  if (typeof module !== 'undefined') module.exports = api; else window.Etappen = api;
})();
