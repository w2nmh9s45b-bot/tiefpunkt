/* Ruhige Hand – Brett und Teile. Alles selbst gezeichnet: „Kuno“, ein aufgeschraubter Uhrwerk-Roboter.
   Koordinaten des Bretts: 800 × 1000. Jedes Teil hat
   - umriss: Umriss in eigenen Koordinaten um (0,0) – danach wird die Berührung gerechnet (echte Form, nicht das Rechteck)
   - ruhe:   Lage in seiner Mulde
   - weg:    Knickpunkte des Gangs, relativ zur Ruhelage. Der letzte Punkt (draußen neben dem Körper) wird von der
             Logik ergänzt. Die Mulde samt Gang ist die Bahn der konvexen Hülle des Teils entlang dieses Wegs,
             erweitert um den Randabstand (Schwierigkeit).
   - deko:   Zierzeichnung (SVG) über der Grundform, gleiche Koordinaten. */
"use strict";
(function () {
  const r1 = v => Math.round(v * 10) / 10;
  // Bogenpunkte (Winkel in Grad, y nach unten wie im SVG), von a0 bis a1 in Schritten von höchstens `st` Grad
  const bogen = (cx, cy, r, a0, a1, st = 12) => {
    const n = Math.max(2, Math.ceil(Math.abs(a1 - a0) / st)), p = [];
    for (let i = 0; i <= n; i++) { const a = (a0 + (a1 - a0) * i / n) * Math.PI / 180; p.push([r1(cx + r * Math.cos(a)), r1(cy + r * Math.sin(a))]); }
    return p;
  };
  const zahnkranz = (z, ra, ri) => {
    const p = [];
    for (let i = 0; i < z; i++) {
      const a = 360 / z, b = i * a - 90;
      [[b - a * .30, ri], [b - a * .17, ra], [b + a * .17, ra], [b + a * .30, ri]].forEach(([w, r]) => { const t = w * Math.PI / 180; p.push([r1(r * Math.cos(t)), r1(r * Math.sin(t))]); });
    }
    return p;
  };
  const pfad = pkt => 'M' + pkt.map(p => p.join(' ')).join('L') + 'Z';
  const D = '#3b2a14'; // dunkle Linie der Teile

  // Schraube: Kopf links, Gewinde nach rechts
  const schraube = (() => {
    const o = [[-40, -16], [-23, -16], [-23, -7]];
    for (let x = -18; x <= 30; x += 6) o.push([x, -7], [x + 3, -10]);
    o.push([36, -6], [42, 0], [36, 6]);
    for (let x = 30; x >= -18; x -= 6) o.push([x + 3, 10], [x, 7]);
    o.push([-23, 7], [-23, 16], [-40, 16]);
    return o;
  })();
  const zeiger = [[-52, -4], [-39.1, -4], ...bogen(-30, 0, 9, 206.4, 333.6, 15), [36, -3], [36, -8], [57, 0], [36, 8], [36, 3], ...bogen(-30, 0, 9, 26.4, 153.6, 15), [-39.1, 4], [-52, 4]];
  const pendel = [[-46, -4], [12.4, -4], ...bogen(30, 0, 18, 192.8, 527.2, 12).slice(1, -1), [12.4, 4], [-46, 4], ...bogen(-46, 0, 4, 90, 270, 45).slice(1, -1)];
  const birne = [...bogen(-10, 0, 22, 30, 330, 12), [30, -11], [34, -6], [34, 6], [30, 11]];
  // Hufeisen: außen links herum (unten→links→oben), innen zurück
  const magnetU = [[26, 28], ...bogen(0, 0, 28, 90, 270, 12), [26, -28], [26, -14], ...bogen(0, 0, 14, 270, 90, 15), [26, 14]];
  const feder = [...bogen(30, 0, 14, -90, 90, 15), ...bogen(-30, 0, 14, 90, 270, 15)];
  const schluessel = [[-14, -5], [30, -5], [30, -10], [42, -10], [42, 10], [30, 10], [30, 5], [-14, 5], [-20, 22], [-34, 27], [-44, 18], [-46, 0], [-44, -18], [-34, -27], [-20, -22]];

  const TEILE = [
    // linke Reihe (Ausgang links)
    {id: 'zahnrad', name: 'Zahnrad', belohnung: 150, ruhe: [250, 370], weg: [[-60, 0], [-105, 26], [-150, 26]],
      umriss: zahnkranz(10, 30, 23), farbe: '#dcae48',
      deko: `<circle r="14" fill="#c4932f" stroke="${D}" stroke-width="1.6"/><circle r="5.5" fill="#5a3d12"/>${[0, 90, 180, 270].map(w => `<circle cx="${r1(9.5 * Math.cos(w * Math.PI / 180 + .8))}" cy="${r1(9.5 * Math.sin(w * Math.PI / 180 + .8))}" r="2.6" fill="#6b4816"/>`).join('')}`},
    {id: 'batterie', name: 'Batterie', belohnung: 100, ruhe: [255, 500], weg: [[-70, 0], [-110, 20]],
      umriss: [[-35, -15], [35, -15], [35, -7], [41, -7], [41, 7], [35, 7], [35, 15], [-35, 15]], farbe: '#3a78d6',
      deko: `<path d="M-35 -15H-12V15H-35Z" fill="#e0913f" stroke="${D}" stroke-width="1.6"/><path d="M35 -7h6v14h-6Z" fill="#c9d1d6" stroke="${D}" stroke-width="1.6"/><path d="M8 0h14M15 -7v14" stroke="#fff" stroke-width="3.4" stroke-linecap="round"/><path d="M-30 -9h12" stroke="#fff" stroke-opacity=".5" stroke-width="3" stroke-linecap="round"/>`},
    {id: 'schluessel', name: 'Aufziehschlüssel', belohnung: 250, ruhe: [262, 630], weg: [[-48, 0], [-80, 26], [-118, 26], [-150, 0]],
      umriss: schluessel, farbe: '#e5bb55',
      deko: `<circle cx="-32" cy="-13" r="5" fill="#8a6420"/><circle cx="-32" cy="13" r="5" fill="#8a6420"/><path d="M-10 -1.5H28" stroke="#fff" stroke-opacity=".55" stroke-width="2.4" stroke-linecap="round"/><path d="M33 -6h6v12h-6Z" fill="#b48a32"/>`},
    {id: 'gluehbirne', name: 'Glühbirne', belohnung: 150, ruhe: [258, 760], weg: [[-58, 0], [-96, 24]],
      umriss: birne, farbe: '#fff1b8',
      deko: `<path d="M9 -11h21l4 5v12l-4 5H9Z" fill="#a8b2b9" stroke="${D}" stroke-width="1.6"/><path d="M14 -11v22M20 -11v22M26 -11v22" stroke="${D}" stroke-opacity=".5" stroke-width="1.6"/><path d="M8 -5c-10 0-16-10-22-4s4 9-6 9" fill="none" stroke="#e08a2e" stroke-width="2.2" stroke-linecap="round"/><path d="M-24 -10a14 14 0 0 1 10-8" stroke="#fff" stroke-width="3.4" fill="none" stroke-linecap="round"/>`},
    {id: 'magnet', name: 'Hufeisenmagnet', belohnung: 250, ruhe: [255, 890], weg: [[-38, 0], [-70, 24], [-108, 24], [-140, -4]],
      umriss: magnetU, farbe: '#d8483c',
      deko: `<path d="M14 -28h12v14H14Z M14 14h12v14H14Z" fill="#dfe4e8" stroke="${D}" stroke-width="1.6"/><path d="M-6 -22a21 21 0 0 0 -14 12" stroke="#fff" stroke-opacity=".5" stroke-width="3" fill="none" stroke-linecap="round"/>`},
    // rechte Reihe (Ausgang rechts)
    {id: 'mutter', name: 'Mutter', belohnung: 100, ruhe: [548, 370], weg: [[70, 0], [102, 22]],
      umriss: [0, 60, 120, 180, 240, 300].map(w => [r1(28 * Math.cos(w * Math.PI / 180)), r1(28 * Math.sin(w * Math.PI / 180))]), farbe: '#b9c3ca',
      deko: `<circle r="17" fill="none" stroke="${D}" stroke-opacity=".35" stroke-width="1.6"/><circle r="11" fill="#2b2015" stroke="${D}" stroke-width="1.6"/><path d="M-6 -20h12" stroke="#fff" stroke-opacity=".6" stroke-width="3" stroke-linecap="round"/>`},
    {id: 'feder', name: 'Spiralfeder', belohnung: 200, ruhe: [552, 500], weg: [[48, 0], [80, 24], [118, 24], [150, 0]],
      umriss: feder, farbe: '#cfd8de',
      deko: `<path d="M-40 -12${[...Array(9)].map((_, i) => `L${-34 + i * 9} 12L${-30 + i * 9} -12`).join('')}" fill="none" stroke="#6d7c86" stroke-width="3" stroke-linejoin="round"/><path d="M-40 -12L-40 12M40 -12L40 12" stroke="#6d7c86" stroke-width="3"/>`},
    {id: 'zeiger', name: 'Uhrzeiger', belohnung: 400, ruhe: [546, 630], weg: [[38, 0], [68, 22], [100, 22], [128, 0], [158, 0], [184, -18]],
      umriss: zeiger, farbe: '#3d6fb5',
      deko: `<circle cx="-30" cy="0" r="9" fill="#e5bb55" stroke="${D}" stroke-width="1.6"/><circle cx="-30" cy="0" r="3" fill="#5a3d12"/><path d="M-18 -1H40" stroke="#fff" stroke-opacity=".45" stroke-width="2" stroke-linecap="round"/>`},
    {id: 'schraube', name: 'Schraube', belohnung: 200, ruhe: [548, 760], weg: [[58, 0], [90, -24], [130, -24]],
      umriss: schraube, farbe: '#aeb8bf',
      deko: `<path d="M-40 -16h17v32h-17Z" fill="#c4cdd3" stroke="${D}" stroke-width="1.6"/><path d="M-36 0h9" stroke="${D}" stroke-width="3.4" stroke-linecap="round"/><path d="M-18 -2H34" stroke="#fff" stroke-opacity=".5" stroke-width="2" stroke-linecap="round"/>`},
    {id: 'pendel', name: 'Pendel', belohnung: 300, ruhe: [550, 890], weg: [[44, 0], [74, -24], [114, -24], [144, 2]],
      umriss: pendel, farbe: '#c99a3a',
      deko: `<circle cx="30" cy="0" r="18" fill="#e6b94c" stroke="${D}" stroke-width="1.6"/><circle cx="30" cy="0" r="10" fill="none" stroke="#9c7220" stroke-width="2"/><circle cx="-46" cy="0" r="2" fill="#5a3d12"/><path d="M22 -10a12 12 0 0 1 10 -3" stroke="#fff" stroke-opacity=".6" stroke-width="3" fill="none" stroke-linecap="round"/>`},
  ];
  TEILE.forEach(t => { t.pfad = pfad(t.umriss); });

  const BRETT = {w: 800, h: 1000, torso: {x0: 60, x1: 740, y0: 290, y1: 985, r: 44}};
  const DATEN = {BRETT, TEILE};
  if (typeof module !== 'undefined') module.exports = DATEN; else window.RuhigeHandDaten = DATEN;
})();
