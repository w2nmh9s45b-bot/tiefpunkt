/* Funkstille – reine Spielregeln (ohne DOM).

   REGELQUELLE
   Offizielle Anleitung des Vorbilds (Czech Games Edition, Vlaada Chvátil, Juli 2015, englische Regel):
   - Zwei Teams, je ein Hinweisgeber. 25 Wortkarten im 5×5-Raster. Eine geheime Schlüsselkarte legt fest:
     Startteam 9 Wörter (inkl. Doppelagent), anderes Team 8, 7 Unbeteiligte, 1 Attentäter. Das Startteam gibt
     den ersten Hinweis.
   - Hinweis = genau ein Wort und eine Zahl. Der Hinweis darf keines der offenen (nicht abgedeckten) Wörter sein,
     keine Form davon und kein Teil eines zusammengesetzten Wortes vom Tisch. Was der gegnerische Hinweisgeber
     durchgehen lässt, gilt.
   - Das ratende Team muss mindestens einmal tippen. Eigenes Wort: weiter raten erlaubt. Unbeteiligter oder
     gegnerisches Wort: Zug endet (gegnerisches Wort zählt für den Gegner). Attentäter: Spiel sofort verloren.
   - Höchstens Zahl + 1 Tipps. Zahl 0 und „unbegrenzt“: keine Obergrenze, aber mindestens ein Tipp.
   - Man darf jederzeit (nach dem ersten Tipp) aufhören.
   - Gewonnen hat das Team, dessen Wörter alle aufgedeckt sind – auch wenn das gegnerische Team das letzte
     Wort aufgedeckt hat.
   - Ungültiger Hinweis: der Zug endet sofort; zusätzlich darf der gegnerische Hinweisgeber eines seiner
     eigenen Wörter abdecken, bevor er den nächsten Hinweis gibt.
   - Die Sanduhr ist in der Regel nur ein Hilfsmittel gegen langes Grübeln (hier nicht nachgebildet).

   AUSLEGUNGEN
   - Das Startteam wird zufällig bestimmt (die Schlüsselkarte wird zufällig gezogen; ihre Lichter zeigen das
     Startteam).
   - Prüfung des Hinweises am iPad: genau ein Wort (keine Leerzeichen), Zahl 0–9 oder „unbegrenzt“.
     Gleicht der Hinweis einem offenen Wort, wird er abgelehnt. Enthält er ein offenes Wort oder ist er darin
     enthalten (ab 3 Buchstaben, Umlaute gleichgesetzt), fragt die Oberfläche nach („Form oder Wortteil?“) –
     die Regel überlässt Grenzfälle der Einigung am Tisch.
   - Den ungültigen Hinweis meldet das gegnerische Team über „Hinweis ungültig“; die Strafe (eigenes Wort
     abdecken) ist freiwillig („may“) und kann auch dazu führen, dass dieses Team gewinnt.
   - „Nochmal“: neue 25 Wörter, neue Schlüsselkarte; die Hinweisgeber wechseln reihum im Team, damit andere
     dran kommen (die Regel schlägt das vor). */
'use strict';
(function () {
  const ARTEN = ['t0', 't1', 'neutral', 'attentaeter'];

  function zufallStd(n) { return Math.floor(Math.random() * n); }
  function mischen(arr, zufall = zufallStd) { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = zufall(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; }

  /* Schlüsselkarte: 25 Felder. startTeam 0/1 bekommt 9 Felder, das andere 8. */
  function schluessel(startTeam, zufall = zufallStd) {
    const s = 't' + startTeam, a = 't' + (1 - startTeam);
    const felder = [...Array(9).fill(s), ...Array(8).fill(a), ...Array(7).fill('neutral'), 'attentaeter'];
    return mischen(felder, zufall);
  }

  function woerterZiehen(liste, gesehen, zufall = zufallStd) {
    const g = new Set(gesehen || []);
    let frei = liste.filter(w => !g.has(w)), zurueck = false;
    if (frei.length < 25) { frei = liste.slice(); zurueck = true; }
    return { woerter: mischen(frei, zufall).slice(0, 25), zuruecksetzen: zurueck };
  }

  function neu({ teams, woerter, zufall = zufallStd, startTeam }) {
    if (!Array.isArray(teams) || teams.length !== 2) throw new Error('Genau zwei Teams');
    teams.forEach(t => { if (!t.mitglieder || t.mitglieder.length < 2) throw new Error('Jedes Team braucht mindestens zwei Personen'); });
    if (!woerter || woerter.length !== 25 || new Set(woerter).size !== 25) throw new Error('Genau 25 verschiedene Wörter');
    const st = startTeam === 0 || startTeam === 1 ? startTeam : zufall(2);
    const key = schluessel(st, zufall);
    return {
      v: 1,
      teams: teams.map(t => ({ name: t.name, farbe: t.farbe || null, mitglieder: t.mitglieder.slice(), geber: Math.min(t.geber || 0, t.mitglieder.length - 1) })),
      karten: woerter.map((w, i) => ({ wort: w, art: key[i], offen: false, durch: null })),
      startTeam: st,
      amZug: st,
      phase: 'hinweis',          // hinweis → raten → (hinweis | strafe | ende)
      hinweis: null,             // {wort, zahl ('0'…'9' | 'unbegrenzt'), tipps, max}
      verlauf: [],
      sieger: null, grund: null, strafeFuer: null
    };
  }

  const gegner = t => 1 - t;
  const geberName = (s, t) => s.teams[t].mitglieder[s.teams[t].geber];
  function uebrig(s, t) { return s.karten.filter(k => k.art === 't' + t && !k.offen).length; }

  function norm(w) {
    return String(w || '').trim().toLowerCase()
      .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss').replace(/[-‐–]/g, '');
  }

  /* Hinweis prüfen. Ergebnis: {ok:true} | {ok:false, fehler} | {ok:true, warnung, wort} */
  function hinweisPruefen(s, wort, zahl) {
    const w = String(wort || '').trim();
    if (!w) return { ok: false, fehler: 'Gib ein Hinweiswort ein.' };
    if (/\s/.test(w)) return { ok: false, fehler: 'Der Hinweis ist genau ein Wort – ohne Leerzeichen.' };
    if (!/^[\p{L}\p{N}][\p{L}\p{N}'’.-]*$/u.test(w)) return { ok: false, fehler: 'Nur Buchstaben und Ziffern, bitte.' };
    if (!(zahl === 'unbegrenzt' || /^[0-9]$/.test(String(zahl)))) return { ok: false, fehler: 'Wähle eine Zahl.' };
    const n = norm(w);
    for (const k of s.karten) {
      if (k.offen) continue;
      const kw = norm(k.wort);
      if (kw === n) return { ok: false, fehler: `„${k.wort}“ liegt offen auf dem Tisch und ist als Hinweis verboten.` };
    }
    for (const k of s.karten) {
      if (k.offen) continue;
      const kw = norm(k.wort);
      if ((kw.length >= 3 && n.includes(kw)) || (n.length >= 3 && kw.includes(n)))
        return { ok: true, warnung: `„${w}“ ähnelt „${k.wort}“ vom Tisch. Formen und Wortteile offener Wörter sind nicht erlaubt.`, wort: k.wort };
    }
    return { ok: true };
  }

  const UNBEGRENZT = 99;   // statt Infinity, weil der Zustand als JSON gespeichert wird
  function maxTipps(zahl) { return zahl === 'unbegrenzt' || String(zahl) === '0' ? UNBEGRENZT : +zahl + 1; }

  function hinweisGeben(s, wort, zahl) {
    if (s.phase !== 'hinweis') throw new Error('Gerade ist kein Hinweis dran');
    const p = hinweisPruefen(s, wort, zahl);
    if (!p.ok) throw new Error(p.fehler);
    s.hinweis = { wort: String(wort).trim(), zahl: String(zahl), tipps: 0, max: maxTipps(zahl), team: s.amZug };
    s.verlauf.push({ team: s.amZug, wort: s.hinweis.wort, zahl: s.hinweis.zahl, tipps: [] });
    s.phase = 'raten';
    return s;
  }

  function beenden(s, sieger, grund) { s.sieger = sieger; s.grund = grund; s.phase = 'ende'; s.hinweis = null; }
  function zugWechsel(s) { s.amZug = gegner(s.amZug); s.hinweis = null; s.phase = 'hinweis'; }

  /* Karte i aufdecken. Ergebnis: {art, ende:boolean, zugEnde:boolean} */
  function tippen(s, i) {
    if (s.phase !== 'raten') throw new Error('Gerade wird nicht geraten');
    const k = s.karten[i];
    if (!k || k.offen) throw new Error('Diese Karte ist schon aufgedeckt');
    const t = s.amZug, h = s.hinweis;
    if (h.tipps >= h.max) throw new Error('Keine Tipps mehr übrig');
    k.offen = true; k.durch = t; h.tipps += 1;
    s.verlauf[s.verlauf.length - 1].tipps.push(i);
    const r = { art: k.art, eigen: k.art === 't' + t, ende: false, zugEnde: false };
    if (k.art === 'attentaeter') { beenden(s, gegner(t), 'attentaeter'); r.ende = true; return r; }
    // Wer zuerst alle Wörter aufgedeckt hat, gewinnt – auch wenn das andere Team das letzte aufgedeckt hat.
    if (uebrig(s, 0) === 0) { beenden(s, 0, 'alle'); r.ende = true; return r; }
    if (uebrig(s, 1) === 0) { beenden(s, 1, 'alle'); r.ende = true; return r; }
    if (!r.eigen || h.tipps >= h.max) { zugWechsel(s); r.zugEnde = true; }
    return r;
  }

  function darfBeenden(s) { return s.phase === 'raten' && s.hinweis.tipps >= 1; }
  function zugBeenden(s) {
    if (!darfBeenden(s)) throw new Error('Ihr müsst mindestens ein Wort antippen.');
    zugWechsel(s); return s;
  }

  /* Gegnerteam meldet einen ungültigen Hinweis: Zug endet, gegnerischer Hinweisgeber darf ein eigenes Wort abdecken. */
  function ungueltig(s) {
    if (s.phase !== 'raten') throw new Error('Kein Hinweis aktiv');
    const t = s.amZug;
    s.verlauf[s.verlauf.length - 1].ungueltig = true;
    s.amZug = gegner(t); s.hinweis = null; s.phase = 'strafe'; s.strafeFuer = s.amZug;
    return s;
  }
  function strafeAbdecken(s, i) {
    if (s.phase !== 'strafe') throw new Error('Keine Strafe offen');
    const k = s.karten[i], t = s.strafeFuer;
    if (!k || k.offen || k.art !== 't' + t) throw new Error('Nur ein eigenes, noch verdecktes Wort');
    k.offen = true; k.durch = t; k.strafe = true;
    s.strafeFuer = null;
    if (uebrig(s, t) === 0) { beenden(s, t, 'alle'); return s; }
    s.phase = 'hinweis';
    return s;
  }
  function strafeVerzichten(s) {
    if (s.phase !== 'strafe') throw new Error('Keine Strafe offen');
    s.strafeFuer = null; s.phase = 'hinweis'; return s;
  }

  function restTipps(s) { if (s.phase !== 'raten') return 0; return s.hinweis.max - s.hinweis.tipps; }

  /* Nächstes Spiel: Hinweisgeber reihum weiter. */
  function naechsteTeams(s) {
    return s.teams.map(t => ({ name: t.name, farbe: t.farbe, mitglieder: t.mitglieder.slice(), geber: (t.geber + 1) % t.mitglieder.length }));
  }

  const FunkstilleLogik = { ARTEN, UNBEGRENZT, neu, schluessel, woerterZiehen, hinweisPruefen, hinweisGeben, maxTipps, tippen, darfBeenden, zugBeenden,
    ungueltig, strafeAbdecken, strafeVerzichten, uebrig, restTipps, geberName, naechsteTeams, norm, mischen };
  if (typeof module !== 'undefined') module.exports = FunkstilleLogik; else window.FunkstilleLogik = FunkstilleLogik;
})();
