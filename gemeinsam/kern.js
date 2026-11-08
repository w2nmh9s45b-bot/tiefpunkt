/* Spieltisch – gemeinsamer Kern aller Spiele (window.Kern).
   Bietet: Kopfknöpfe (Zum Spieltisch, Menü), Startseite mit Spielerwahl, Sichtschutz beim Weitergeben,
   Fenster/Rückfragen, Hinweise, Klang, Speicher, französische Spielkarten, Würfel, Konfetti.
   Vertrag: VERTRAG.md im Projektordner. Nichts hier darf von einem Spiel überschrieben werden. */
"use strict";
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const FARBEN = ['#f2c14e', '#ef7d6d', '#6cc7d8', '#b9a0f4', '#8ad69c', '#f49fc6', '#f39a52', '#a3b8ff'];
  const ICON = {
    tisch: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="7.5" height="7.5" rx="2"/><rect x="13.5" y="3" width="7.5" height="7.5" rx="2"/><rect x="3" y="13.5" width="7.5" height="7.5" rx="2"/><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2"/></svg>',
    menue: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
    zu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>'
  };

  let ID = 'spiel', NAME = 'Spiel', REGELN = '', ON_NEU = null, EXTRA_MENUE = [];
  const LS = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); return true; } catch (e) { return false; } },
    del(k) { try { localStorage.removeItem(k); } catch (e) {} }
  };
  const jsonGet = (k, d) => { try { const v = JSON.parse(LS.get(k)); return v == null ? d : v; } catch (e) { return d; } };

  /* ---------- Tippen: robust bei mehreren Fingern gleichzeitig ---------- */
  function tap(e, fn) {
    const st = new Map();
    e.addEventListener('pointerdown', ev => { st.set(ev.pointerId, {x: ev.clientX, y: ev.clientY, t: performance.now()}); });
    e.addEventListener('pointerup', ev => {
      const s = st.get(ev.pointerId); st.delete(ev.pointerId);
      if (s && Math.hypot(ev.clientX - s.x, ev.clientY - s.y) < 28 && performance.now() - s.t < 900) fn(ev);
    });
    e.addEventListener('pointercancel', ev => st.delete(ev.pointerId));
    e.addEventListener('keydown', ev => { if ((ev.key === 'Enter' || ev.key === ' ') && ev.target === e) { ev.preventDefault(); fn(ev); } });
    return e;
  }

  /* ---------- Klang ---------- */
  let AC = null;
  const tonAn = () => LS.get('spieltisch.ton') !== 'aus';
  function ac() {
    if (!AC) { try { AC = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { AC = null; } }
    if (AC && AC.state === 'suspended') AC.resume();
    return AC;
  }
  function tone(f, dur, o = {}) {
    const a = ac(); if (!a) return;
    const t = a.currentTime + (o.at || 0), osc = a.createOscillator(), g = a.createGain();
    osc.type = o.type || 'sine'; osc.frequency.setValueAtTime(f, t);
    if (o.slide) osc.frequency.exponentialRampToValueAtTime(f * o.slide, t + dur);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(o.gain || .06, t + .012);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(g).connect(a.destination); osc.start(t); osc.stop(t + dur + .03);
  }
  function noise(dur = .035, gain = .12, freq = 2400) {
    const a = ac(); if (!a) return;
    const len = Math.floor(a.sampleRate * dur), buf = a.createBuffer(1, len, a.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3);
    const src = a.createBufferSource(), flt = a.createBiquadFilter(), g = a.createGain();
    flt.type = 'bandpass'; flt.frequency.value = freq; flt.Q.value = .8; g.gain.value = gain;
    src.buffer = buf; src.connect(flt).connect(g).connect(a.destination); src.start();
  }
  function ton(art) {
    if (!tonAn()) return;
    try {
      switch (art) {
        case 'tipp': tone(520, .06, {type: 'triangle', gain: .04}); break;
        case 'karte': noise(.035, .15); break;
        case 'ziehen': noise(.03, .1); tone(660, .08, {type: 'triangle', gain: .035}); break;
        case 'legen': tone(196, .15, {type: 'triangle', gain: .09, slide: .8}); break;
        case 'stein': tone(330, .07, {type: 'square', gain: .025}); noise(.02, .08, 1200); break;
        case 'wuerfel': for (let i = 0; i < 5; i++) noise(.025, .12, 1600 + i * 300); break;
        case 'punkt': [660, 880].forEach((f, i) => tone(f, .14, {type: 'triangle', gain: .06, at: i * .07})); break;
        case 'fehler': tone(220, .22, {type: 'sawtooth', gain: .035, slide: .7}); break;
        case 'warn': tone(880, .12, {gain: .05}); tone(660, .18, {gain: .05, at: .13}); break;
        case 'runde': [392, 494, 587].forEach((f, i) => tone(f, .5, {gain: .05, at: i * .05})); break;
        case 'sieg': [523, 659, 784, 1047].forEach((f, i) => tone(f, .55, {type: 'triangle', gain: .06, at: i * .12})); break;
        case 'zeit': tone(1200, .05, {type: 'square', gain: .02}); break;
        case 'gong': [196, 247, 294].forEach((f, i) => tone(f, 1.2, {gain: .06, at: i * .02})); break;
      }
    } catch (e) {}
  }
  document.addEventListener('pointerdown', () => { if (tonAn()) ac(); }, {passive: true});
  document.addEventListener('gesturestart', e => e.preventDefault());

  /* ---------- Speicher ---------- */
  const speicher = {
    laden() { return jsonGet(`spieltisch.${ID}.spiel`, null); },
    speichern(s) { return LS.set(`spieltisch.${ID}.spiel`, JSON.stringify(s)); },
    loeschen() { LS.del(`spieltisch.${ID}.spiel`); },
    hat() { return LS.get(`spieltisch.${ID}.spiel`) != null; }
  };
  const einst = {
    laden(d = {}) { return Object.assign({}, d, jsonGet(`spieltisch.${ID}.einst`, {})); },
    speichern(o) { LS.set(`spieltisch.${ID}.einst`, JSON.stringify(Object.assign(jsonGet(`spieltisch.${ID}.einst`, {}), o))); }
  };
  const namen = {
    liste() { return jsonGet('spieltisch.namen', []); },
    merken(arr) {
      const alt = namen.liste(), neu = [...arr.filter(Boolean), ...alt.filter(n => !arr.includes(n))].slice(0, 12);
      LS.set('spieltisch.namen', JSON.stringify(neu));
    }
  };

  /* ---------- Fenster ---------- */
  function fenster(inhalt, opt = {}) {
    const eb = el('div', 'k-ebene'), f = el('div', 'k-fenster');
    if (opt.breit) f.style.width = 'min(860px,100%)';
    if (opt.gedreht) f.style.transform = 'rotate(180deg)';
    eb.appendChild(f);
    if (opt.schliessbar !== false) {
      const x = el('button', 'k-rund k-x', ICON.zu); x.setAttribute('aria-label', 'Schließen');
      f.appendChild(x); x.onclick = () => schliessen();
      eb.addEventListener('click', ev => { if (ev.target === eb) schliessen(); });
    }
    const body = el('div', 'k-fenster-inhalt');
    if (typeof inhalt === 'string') body.innerHTML = inhalt; else if (inhalt) body.appendChild(inhalt);
    f.appendChild(body);
    document.body.appendChild(eb);
    let zu = false;
    function schliessen() { if (zu) return; zu = true; eb.remove(); opt.beimSchliessen && opt.beimSchliessen(); }
    return {ebene: eb, fenster: f, inhalt: body, schliessen};
  }
  function frage({titel = '', text = '', knoepfe = [{text: 'OK', wert: true}], schliessbar = false, gedreht = false} = {}) {
    return new Promise(res => {
      const box = el('div');
      box.innerHTML = `${titel ? `<h2>${esc(titel)}</h2>` : ''}${text ? `<p>${text}</p>` : ''}`;
      const k = el('div', 'k-knoepfe'); box.appendChild(k);
      let gewaehlt = false;
      const fe = fenster(box, {schliessbar, gedreht, beimSchliessen: () => { if (!gewaehlt) res(null); }});
      knoepfe.forEach(b => {
        const btn = el('button', 'k-btn' + (b.art ? ' ' + b.art : ''), esc(b.text));
        btn.onclick = () => { gewaehlt = true; fe.schliessen(); res(b.wert); };
        k.appendChild(btn);
      });
    });
  }
  function hinweis(text, ms = 2200, opt = {}) {
    document.querySelectorAll('.k-toast').forEach(t => t.remove());
    const t = el('div', 'k-toast', esc(text)); document.body.appendChild(t);
    if (opt.gedreht) { t.style.bottom = 'auto'; t.style.top = 'max(24px,calc(var(--sicher-o) + 16px))'; t.style.transform = 'translateX(-50%) rotate(180deg)'; t.style.animation = 'none'; }
    setTimeout(() => t.remove(), ms);
  }
  function sichtschutz({name = '', farbe = FARBEN[0], text = 'Nur du schaust jetzt hin.', knopf = null, titel = null} = {}) {
    return new Promise(res => {
      const s = el('div', 'k-sichtschutz');
      s.innerHTML = `<div class="k-sich-in"><span class="k-dot" style="--pc:${esc(farbe)}">${esc((name || '?').trim().charAt(0).toUpperCase())}</span>
        <h2>${esc(titel || `Gib das iPad an ${name}`)}</h2><p>${text}</p></div>`;
      const b = el('button', 'k-btn gross', esc(knopf || `Ich bin ${name}`));
      s.firstChild.appendChild(b);
      document.body.appendChild(s);
      b.onclick = () => { s.remove(); ton('tipp'); res(); };
    });
  }

  /* ---------- Kopfknöpfe und Menü ---------- */
  let KOPF = null;
  function zumTisch() { location.href = '../index.html'; }
  function regeln() { fenster(`<h2>Spielregeln</h2>${REGELN || '<p>Keine Regeln hinterlegt.</p>'}`); }
  function menue() {
    const box = el('div');
    box.innerHTML = `<h2>${esc(NAME)}</h2>`;
    const l = el('div', 'k-liste'); box.appendChild(l);
    const fe = fenster(box);
    const knopf = (text, art, fn) => { const b = el('button', 'k-btn ' + (art || 'leise'), text); b.onclick = fn; l.appendChild(b); return b; };
    knopf('Weiterspielen', '', () => fe.schliessen());
    knopf('Spielregeln', 'leise', () => { fe.schliessen(); regeln(); });
    EXTRA_MENUE.forEach(m => knopf(esc(m.text), 'leise', () => { fe.schliessen(); m.aktion(); }));
    const t = knopf('Ton: ' + (tonAn() ? 'an' : 'aus'), 'leise', () => {
      LS.set('spieltisch.ton', tonAn() ? 'aus' : 'an'); t.textContent = 'Ton: ' + (tonAn() ? 'an' : 'aus'); if (tonAn()) ton('punkt');
    });
    if (ON_NEU) {
      let scharf = 0;
      const n = knopf('Spiel beenden', 'leise', () => {
        if (Date.now() - scharf < 4000) { fe.schliessen(); ON_NEU(); return; }
        scharf = Date.now(); n.className = 'k-btn gefahr'; n.textContent = 'Wirklich beenden? Nochmal tippen';
      });
    }
    knopf('Zum Spieltisch', 'leise', zumTisch);
  }
  function kopf(sichtbar = true, seite = 'links') {
    if (!KOPF) {
      KOPF = el('div', 'k-kopf');
      const t = el('button', 'k-rund', ICON.tisch); t.setAttribute('aria-label', 'Zum Spieltisch'); t.onclick = zumTisch;
      const m = el('button', 'k-rund', ICON.menue); m.setAttribute('aria-label', 'Menü'); m.onclick = menue;
      KOPF.append(t, m); document.body.appendChild(KOPF);
    }
    KOPF.hidden = !sichtbar;
    KOPF.classList.toggle('rechts', seite === 'rechts');
  }
  function init({id, name, akzent, regeln: r, onNeu, menue: extra} = {}) {
    ID = id || ID; NAME = name || NAME; REGELN = r || ''; ON_NEU = onNeu || null; EXTRA_MENUE = extra || [];
    if (akzent) document.documentElement.style.setProperty('--akzent', akzent);
    document.title = NAME + ' · Spieltisch';
    LS.set('spieltisch.zuletzt', ID);
    kopf(true);
  }

  /* ---------- Startseite eines Spiels ---------- */
  function setup(o) {
    const cfg = einst.laden({anzahl: o.spieler ? o.spieler.standard : 0, namen: [], optionen: {}});
    const ziel = o.ziel || (() => { const s = el('div', 'k-scroll chart'); document.body.appendChild(s); return s; })();
    ziel.innerHTML = '';
    const wrap = el('div', 'k-setup'); ziel.appendChild(wrap);
    const titel = el('header', 'k-titel');
    titel.innerHTML = `${o.bild ? `<div class="k-bild">${o.bild}</div>` : ''}<h1>${esc(o.titel || NAME)}</h1>
      ${o.unter ? `<p class="k-unter">${esc(o.unter)}</p>` : ''}
      ${o.fakten ? `<div class="k-fakten">${o.fakten.map(f => `<span class="k-chip leise">${esc(f)}</span>`).join('')}</div>` : ''}`;
    const panel = el('div', 'k-panel');
    wrap.append(titel, panel);
    const gespeicherte = jsonGet('spieltisch.namen', []);
    if (o.fortsetzen) {
      const b = el('button', 'k-weiter', `<span><b>Weiterspielen</b><small>${esc(o.fortsetzen)}</small></span><span class="pfeil">→</span>`);
      b.onclick = () => { ac(); o.onFortsetzen && o.onFortsetzen(); };
      panel.appendChild(b);
    }
    let anzahl = o.spieler ? Math.min(o.spieler.max, Math.max(o.spieler.min, cfg.anzahl || o.spieler.standard)) : 0;
    const namenFeld = [];
    if (o.spieler) {
      const g = el('div'); g.innerHTML = `<span class="k-lab">${esc(o.spieler.frage || 'Wie viele spielen mit?')}</span>`;
      const seg = el('div', 'k-seg'); g.appendChild(seg);
      if (o.spieler.min === o.spieler.max) g.hidden = true;
      for (let n = o.spieler.min; n <= o.spieler.max; n++) {
        if (o.spieler.erlaubt && !o.spieler.erlaubt.includes(n)) continue;
        const b = el('button', '', String(n)); b.id = 'k-anzahl-' + n; b.onclick = () => { anzahl = n; zeichnen(); ton('tipp'); };
        seg.appendChild(b);
      }
      panel.appendChild(g);
      if (o.spieler.namen !== false) {
        const ng = el('div'); ng.innerHTML = `<span class="k-lab">${esc(o.spieler.namenLabel || 'Namen')}</span>`;
        const nl = el('div', 'k-namen'); ng.appendChild(nl);
        for (let i = 0; i < o.spieler.max; i++) {
          const f = el('label', 'k-feld'); f.style.setProperty('--pc', (o.spieler.farben || FARBEN)[i]);
          const def = o.spieler.platzhalter ? o.spieler.platzhalter(i) : `Spieler ${i + 1}`;
          f.innerHTML = `<span class="k-dot">${i + 1}</span><input id="k-name-${i}" type="text" maxlength="14" autocomplete="off" autocorrect="off" spellcheck="false" placeholder="${esc(def)}">`;
          const inp = f.querySelector('input'); inp.value = (cfg.namen && cfg.namen[i]) || '';
          if (gespeicherte.length) { inp.setAttribute('list', 'k-namensliste'); }
          nl.appendChild(f); namenFeld.push({f, inp, def});
        }
        if (gespeicherte.length) {
          const dl = el('datalist'); dl.id = 'k-namensliste'; dl.innerHTML = gespeicherte.map(n => `<option value="${esc(n)}">`).join(''); ng.appendChild(dl);
        }
        panel.appendChild(ng);
      }
    }
    const optWahl = Object.assign({}, cfg.optionen);
    (o.optionen || []).forEach(op => {
      if (!op.werte.some(w => w.wert === optWahl[op.id])) optWahl[op.id] = op.standard;
      const g = el('div'); g.innerHTML = `<span class="k-lab">${esc(op.label)}</span>`;
      const seg = el('div', 'k-seg' + (op.klein ? ' klein' : '')); g.appendChild(seg);
      op.werte.forEach((w, i) => {
        const b = el('button', '', esc(w.text)); b.id = `k-opt-${op.id}-${i}`;
        b.onclick = () => { optWahl[op.id] = w.wert; zeichnen(); ton('tipp'); };
        b._wert = w.wert; seg.appendChild(b);
      });
      op._seg = seg; panel.appendChild(g);
    });
    if (o.extra) { const x = el('div'); if (typeof o.extra === 'string') x.innerHTML = o.extra; else x.appendChild(o.extra); panel.appendChild(x); }
    const akt = el('div', 'k-aktionen');
    const r = el('button', 'k-btn leise gross', 'Regeln'); r.style.flex = '0 0 auto'; r.onclick = regeln;
    const s = el('button', 'k-btn gross', esc(o.startText || 'Spiel starten')); s.id = 'k-start';
    akt.append(r, s); panel.appendChild(akt);
    function zeichnen() {
      if (o.spieler) {
        for (let n = o.spieler.min; n <= o.spieler.max; n++) $('#k-anzahl-' + n, panel).setAttribute('aria-pressed', n === anzahl);
        namenFeld.forEach((nf, i) => nf.f.hidden = i >= anzahl);
      }
      (o.optionen || []).forEach(op => [...op._seg.children].forEach(b => b.setAttribute('aria-pressed', b._wert === optWahl[op.id])));
      o.beimZeichnen && o.beimZeichnen({anzahl, optionen: optWahl});
    }
    zeichnen();
    s.onclick = () => {
      ac();
      const nm = namenFeld.slice(0, anzahl).map((nf, i) => nf.inp.value.trim() || nf.def);
      const roh = namenFeld.map(nf => nf.inp.value.trim());
      einst.speichern({anzahl, namen: roh, optionen: optWahl});
      namen.merken(roh.slice(0, anzahl).filter(Boolean));
      o.onStart({anzahl, namen: nm, farben: (o.spieler && o.spieler.farben || FARBEN).slice(0, anzahl), optionen: Object.assign({}, optWahl)});
    };
    return {ziel, panel, zeichnen};
  }

  /* ---------- Französische Spielkarte ---------- */
  const SYM = {kreuz: '♣', pik: '♠', herz: '♥', karo: '♦'};
  const RANGTEXT = {B: 'B', D: 'D', K: 'K', A: 'A'};
  function karte({rang, farbe, zu = false, kw} = {}) {
    const k = el('div', 'k-karte');
    if (kw) k.style.setProperty('--kw', kw + 'px');
    karteSetzen(k, {rang, farbe, zu});
    return k;
  }
  function karteSetzen(k, {rang, farbe, zu = false}) {
    k.classList.toggle('zu', !!zu);
    k.classList.toggle('rot', farbe === 'herz' || farbe === 'karo' || (rang === 'JOKER' && farbe === 'rot'));
    k.classList.toggle('joker', rang === 'JOKER');
    if (rang === 'JOKER') { k.innerHTML = '<div class="mitte">JOKER</div>'; k.setAttribute('aria-label', 'Joker'); return; }
    const s = SYM[farbe] || '', r = RANGTEXT[rang] || String(rang);
    const bild = ['B', 'D', 'K'].includes(rang);
    k.innerHTML = `<div class="ix">${r}<i>${s}</i></div><div class="mitte${bild ? ' bild' : ''}">${bild ? r + s : s}</div><div class="ix u">${r}<i>${s}</i></div>`;
    k.setAttribute('aria-label', `${rang} ${farbe}`);
  }

  /* ---------- Würfel ---------- */
  const AUGEN = {1: [4], 2: [0, 8], 3: [0, 4, 8], 4: [0, 2, 6, 8], 5: [0, 2, 4, 6, 8], 6: [0, 2, 3, 5, 6, 8]};
  function wuerfel(n = 1, ww) {
    const w = el('div', 'k-wuerfel'); if (ww) w.style.setProperty('--ww', ww + 'px');
    for (let i = 0; i < 9; i++) w.appendChild(el('i'));
    wuerfelSetzen(w, n); return w;
  }
  function wuerfelSetzen(w, n) {
    const a = AUGEN[n] || [];
    [...w.children].forEach((p, i) => p.style.visibility = a.includes(i) ? 'visible' : 'hidden');
    w.dataset.wert = n; w.setAttribute('aria-label', 'Würfel ' + n);
  }
  function wuerfelRollen(w, n) {
    return new Promise(res => {
      if (REDUCED) { wuerfelSetzen(w, n); res(); return; }
      w.classList.remove('rollt'); void w.offsetWidth; w.classList.add('rollt');
      let i = 0; const iv = setInterval(() => { wuerfelSetzen(w, 1 + Math.floor(Math.random() * 6)); if (++i > 5) { clearInterval(iv); wuerfelSetzen(w, n); } }, 75);
      setTimeout(() => { w.classList.remove('rollt'); res(); }, 560);
    });
  }

  /* ---------- Zufall ---------- */
  function zufall(n) { const a = new Uint32Array(1); crypto.getRandomValues(a); return a[0] % n; }
  function mischen(arr) { for (let i = arr.length - 1; i > 0; i--) { const j = zufall(i + 1); [arr[i], arr[j]] = [arr[j], arr[i]]; } return arr; }

  /* ---------- Konfetti ---------- */
  function feier(ms = 2600) {
    if (REDUCED) return;
    const c = el('canvas', 'k-konfetti'); document.body.appendChild(c);
    const dpr = devicePixelRatio || 1; c.width = innerWidth * dpr; c.height = innerHeight * dpr;
    const x = c.getContext('2d'); x.scale(dpr, dpr);
    const teile = Array.from({length: 140}, () => ({
      x: innerWidth / 2 + (Math.random() - .5) * 200, y: innerHeight * .45, vx: (Math.random() - .5) * 14, vy: -6 - Math.random() * 12,
      r: Math.random() * 6.28, vr: (Math.random() - .5) * .3, w: 6 + Math.random() * 6, h: 10 + Math.random() * 8, f: FARBEN[zufall(FARBEN.length)]
    }));
    const t0 = performance.now();
    (function bild(t) {
      x.clearRect(0, 0, innerWidth, innerHeight);
      teile.forEach(p => { p.vy += .32; p.x += p.vx; p.y += p.vy; p.vx *= .99; p.r += p.vr;
        x.save(); x.translate(p.x, p.y); x.rotate(p.r); x.fillStyle = p.f; x.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); x.restore(); });
      if (t - t0 < ms) requestAnimationFrame(bild); else c.remove();
    })(t0);
  }

  window.Kern = {
    farben: FARBEN, icon: ICON, esc, el, tap, ton, speicher, einst, namen, fenster, frage, hinweis, sichtschutz,
    init, kopf, menue, regeln, zumTisch, setup, karte, karteSetzen, wuerfel, wuerfelSetzen, wuerfelRollen,
    zufall, mischen, feier, warte: ms => new Promise(r => setTimeout(r, REDUCED ? Math.min(ms, 60) : ms))
  };
})();
