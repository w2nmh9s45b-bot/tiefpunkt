/* Spieltisch – Netz: ein Spiel auf mehreren Geräten.
 *
 * Ein Gerät ist Gastgeber: Es führt das Spiel (Regeln, Zufall, Zustand). Die anderen Geräte zeigen den Stand aus Sicht
 * ihres Sitzes und schicken ihre Züge an den Gastgeber. Zwei Wege, gleiche Nachrichten:
 *   - Internet: Vermittlungsdienst (Cloudflare), Code aus 4 Buchstaben, z. B. KXQM
 *   - In der Nähe: Bluetooth/WLAN direkt über die installierte App (MultipeerConnectivity), Code aus 4 Ziffern
 *
 * Für ein Spiel (vor Kern.setup aufrufen):
 *   Netz.einrichten({
 *     spiel: '<id>', min: 2, max: 6, erlaubt: [2,3,4,6],      // Spielerzahl im Netzspiel
 *     starten(spieler, optionen) {},  // nur Gastgeber: spieler = [{name, farbe, sitz}], Sitz 0 = Gastgeber. Spiel aufbauen,
 *                                     // zeichnen, dann Netz.melden().
 *     aktion(name, daten, sitz) {},   // nur Gastgeber: Zug eines Sitzes prüfen und ausführen, danach Netz.melden().
 *     zustand(sitz) { return {...} }, // nur Gastgeber: was Sitz `sitz` wissen darf (JSON-fähig). Fremde verdeckte
 *                                     // Informationen weglassen/ersetzen.
 *     stand(daten) {},                // nur Mitspieler: neuer Stand → übernehmen und aus Sicht von Netz.meinSitz zeichnen.
 *     beendet() {},                   // optional: Netzspiel ist vorbei (Gastgeber hat beendet) → z. B. startseite()
 *     stilleAktionen: ['strich'],     // optional: häufige Aktionen ohne automatisches Nachschicken des Stands
 *   });
 * Im Spiel:  Netz.tun('ziehe', {feld: 12})  statt die Zugfunktion direkt aufzurufen (Gastgeber führt sofort aus,
 *            Mitspieler schicken). Netz.aktiv, Netz.istHost, Netz.meinSitz, Netz.binDran(sitz), Netz.ereignis(obj).
 */
"use strict";
(function () {
  const VORGABE_ADRESSE = 'wss://spieltisch.spieltisch-w2nm.workers.dev';
  const NATIV = !!(window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.netz);
  const LS = { get: k => { try { return localStorage.getItem(k); } catch (_) { return null; } },
    set: (k, v) => { try { localStorage.setItem(k, v); } catch (_) {} } };
  const SS = { get: k => { try { return JSON.parse(sessionStorage.getItem(k)); } catch (_) { return null; } },
    set: (k, v) => { try { v == null ? sessionStorage.removeItem(k) : sessionStorage.setItem(k, JSON.stringify(v)); } catch (_) {} } };
  const params = new URLSearchParams(location.search);
  if (params.get('netz')) LS.set('spieltisch.netz.adresse', params.get('netz'));
  const adresse = () => (LS.get('spieltisch.netz.adresse') || VORGABE_ADRESSE).replace(/\/+$/, '');
  const httpAdresse = () => adresse().replace(/^ws/, 'http');
  const K = () => window.Kern;
  const FARBEN_OHNE_KERN = ['#f2c14e', '#ef7d6d', '#6cc7d8', '#9ad36a', '#b48ef0', '#f59e5b', '#5bb3f0', '#f07fb4'];
  const esc = t => String(t == null ? '' : t).replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));

  /* ---------- Zustand ---------- */
  const N = {
    aktiv: false, rolle: null, art: null, code: '', id: null, key: '', spiel: '', spieler: [], sitze: null,
    meinSitz: null, laeuft: false, hostDa: true, verbunden: false, adapter: null, optionen: {}, ui: null, stand: null,
  };
  const SITZUNG = 'spieltisch.netz.sitzung';

  /* ---------- Übertragung ---------- */
  let ws = null, wsZiel = '', wsVersuche = 0, wsTimer = null, pingTimer = null, absichtlich = false;
  const warteschlange = [];

  function wsVerbinden(pfad) {
    wsZiel = pfad; absichtlich = false;
    try { ws = new WebSocket(adresse() + pfad); } catch (e) { return empfang({t: 'fehler', grund: 'netz'}); }
    const meins = ws;
    ws.onopen = () => {
      if (meins !== ws) return;
      wsVersuche = 0; N.verbunden = true; zeigeVerbindung();
      clearInterval(pingTimer); pingTimer = setInterval(() => roh({t: 'ping'}), 25000);
    };
    ws.onmessage = e => { if (meins !== ws) return; let m; try { m = JSON.parse(e.data); } catch (_) { return; } if (m.t !== 'pong') empfang(m); };
    ws.onclose = ev => {
      if (meins !== ws) return;
      N.verbunden = false; clearInterval(pingTimer);
      if (absichtlich || ev.code === 4000 || ev.code === 4002) return;
      zeigeVerbindung();
      if (N.id !== null && N.key) { // Wiederkehr mit Schlüssel
        const warte = Math.min(8000, 600 * Math.pow(1.6, wsVersuche++));
        clearTimeout(wsTimer);
        wsTimer = setTimeout(() => { if (N.aktiv) wsVerbinden(`/raum/${N.code}?n=${encodeURIComponent(meinName())}&id=${N.id}&key=${N.key}`); }, warte);
      } else empfang({t: 'fehler', grund: 'netz'});
    };
  }
  function roh(obj) {
    if (N.art === 'nah') { nativ({tun: 'senden', an: obj.an == null ? null : obj.an, daten: obj}); return; }
    if (ws && ws.readyState === 1) ws.send(JSON.stringify(obj));
    else if (obj.t !== 'ping') warteschlange.push(obj);
  }
  function schicke(an, obj) { obj.an = an; roh(obj); }
  function nativ(obj) { try { window.webkit.messageHandlers.netz.postMessage(obj); } catch (_) {} }
  window.__netzNativ = m => { if (typeof m === 'string') { try { m = JSON.parse(m); } catch (_) { return; } } empfang(m); };
  // Antwort der App auf „suchen“ (Beitreten über die Startseite).
  const nativSuche = {};
  window.__netzNativSuche = (code, spiel) => { const f = nativSuche[code]; if (f) { delete nativSuche[code]; f(spiel); } };

  /* ---------- Eingang ---------- */
  function empfang(m) {
    switch (m.t) {
      case 'willkommen': {
        N.code = m.code; N.id = m.id; N.key = m.key; N.spiel = m.spiel || N.spiel; N.verbunden = true;
        if (m.spieler) N.spieler = m.spieler;
        N.hostDa = m.hostDa !== false;
        SS.set(SITZUNG, {code: N.code, id: N.id, key: N.key, art: N.art, rolle: N.rolle, spiel: N.spiel, sitze: N.sitze});
        while (warteschlange.length) roh(warteschlange.shift());
        if (N.rolle === 'gast') schicke('host', {t: 'hallo', name: meinName()});
        if (N.rolle === 'host' && N.laeuft) { N.hostDa = true; senden(); } // Gastgeber nach Verbindungsabbruch zurück
        zeigeLobby(); zeigeVerbindung();
        break;
      }
      case 'dazu':
        if (m.spieler) N.spieler = m.spieler;
        else if (!N.spieler.some(s => s.id === m.id)) N.spieler.push({id: m.id, name: m.name, verbunden: true});
        N.spieler.forEach(s => { if (s.id === m.id) { s.verbunden = true; if (m.name) s.name = m.name; } });
        if (N.rolle === 'host') {
          if (N.laeuft) { senden(m.id); if (m.wieder) hinweis(`${namenVon(m.id)} ist wieder da.`); }
          else K() && K().ton('tipp');
        }
        zeigeLobby(); zeigeVerbindung();
        break;
      case 'weg':
        N.spieler.forEach(s => { if (s.id === m.id) s.verbunden = false; });
        if (N.rolle === 'host') {
          if (!N.laeuft) N.spieler = N.spieler.filter(s => s.id !== m.id); // aus der Lobby gegangen
          else hinweis(`${namenVon(m.id)} ist nicht mehr verbunden.`);
        }
        zeigeLobby(); zeigeVerbindung();
        break;
      case 'host-weg': N.hostDa = false; zeigeVerbindung(); break;
      case 'host-da': N.hostDa = true; zeigeVerbindung(); schicke('host', {t: 'hallo', name: meinName()}); break;
      case 'fehler': fehler(m.grund); break;
      case 'hallo': // Mitspieler (wieder) da → aktuellen Stand schicken
        if (N.rolle === 'host') {
          N.spieler.forEach(s => { if (s.id === m.von) { s.verbunden = true; if (m.name) s.name = String(m.name).slice(0, 14); } });
          if (N.laeuft) senden(m.von); else zeigeLobby();
        }
        break;
      case 'start': // nur Mitspieler
        if (N.rolle !== 'gast') break;
        N.sitze = m.sitze; N.laeuft = true;
        N.meinSitz = m.sitze.findIndex(s => s.id === N.id);
        SS.set(SITZUNG, Object.assign(SS.get(SITZUNG) || {}, {sitze: N.sitze}));
        schliesseLobby(); zeigeVerbindung();
        break;
      case 'stand': // nur Mitspieler
        if (N.rolle !== 'gast') break;
        if (m.sitze) { N.sitze = m.sitze; N.meinSitz = m.sitze.findIndex(s => s.id === N.id); N.laeuft = true; schliesseLobby(); }
        N.stand = m.s;
        try { N.adapter && N.adapter.stand(m.s); } catch (e) { console.error(e); }
        zeigeVerbindung();
        break;
      case 'ereignis': // kurze Meldung vom Gastgeber (Ton, Hinweis)
        if (N.rolle !== 'gast') break;
        if (m.hinweis) hinweis(m.hinweis);
        if (m.ton && K()) K().ton(m.ton);
        if (m.feier && K()) K().feier();
        if (N.adapter && N.adapter.ereignis) { try { N.adapter.ereignis(m.daten || {}); } catch (e) { console.error(e); } }
        break;
      case 'aktion': // nur Gastgeber
        if (N.rolle !== 'host' || !N.laeuft || !N.adapter) break;
        {
          const sitz = N.sitze.findIndex(s => s.id === m.von);
          if (sitz < 0) break;
          ausfuehren(String(m.name), m.daten || {}, sitz, m.von);
        }
        break;
      case 'ende':
        if (N.rolle === 'gast') {
          const wer = namenVon(0);
          aufraeumen();
          meldung('Spiel beendet', `${wer} hat das Netzspiel beendet.`);
          N.adapter && N.adapter.beendet ? N.adapter.beendet() : location.reload();
        }
        break;
      case 'raus':
        aufraeumen(); K() && K().fenster('<h2>Nicht mehr dabei</h2><p>Der Gastgeber hat dich aus dem Spiel genommen.</p>');
        N.adapter && N.adapter.beendet && N.adapter.beendet();
        break;
    }
  }

  function fehler(grund) {
    const texte = {
      unbekannt: 'Zu diesem Code gibt es kein Spiel. Stimmt der Code?',
      laeuft: 'Dieses Spiel hat schon begonnen. Neue Mitspieler können nicht mehr dazukommen.',
      voll: 'Das Spiel ist schon voll.',
      netz: N.art === 'nah' ? 'Keine Verbindung möglich. Sind beide Geräte nah beieinander und Bluetooth/WLAN an?'
        : 'Keine Verbindung zum Internet-Dienst. Bist du online?',
      raus: 'Der Gastgeber hat dich aus dem Spiel genommen.',
      gross: 'Eine Nachricht war zu groß für die Übertragung.',
      nahfehlt: 'In der Nähe spielen geht nur in der installierten Spieltisch-App.',
    };
    if (grund === 'gross') { console.warn('Netz: Nachricht zu groß'); return; }
    if (N.laeuft && grund === 'netz') { zeigeVerbindung(); return; }
    aufraeumen(); schliesseLobby();
    meldung('Das hat nicht geklappt', texte[grund] || 'Unbekannter Fehler: ' + grund);
  }
  /** Meldung mit OK – über Kern.fenster, auf der Startseite (ohne Kern) im eigenen Fenster. */
  function meldung(titel, text) {
    if (K()) { K().fenster(`<h2>${esc(titel)}</h2><p>${esc(text)}</p>`); return; }
    const box = schleier(`<h2>${esc(titel)}</h2><p>${esc(text)}</p><div class="nz-knoepfe"><button class="k-btn" id="nz-ok">OK</button></div>`);
    box.querySelector('#nz-ok').onclick = schliesseLobby;
  }

  /* ---------- Gastgeber ---------- */
  // Züge nacheinander ausführen: Gibt adapter.aktion ein Promise zurück (z. B. während einer Animation), wartet der
  // nächste Zug darauf – höchstens 2,5 Sekunden, damit eine lange Animation oder ein offener Dialog nichts aufhält.
  // Was ein Zug sofort ändert, geht gleich hinaus (auch wenn das Spiel selbst erst nach der Animation meldet);
  // wer den Zug geschickt hat, bekommt immer eine Antwort – auch wenn das Spiel ihn verworfen hat.
  let kette = Promise.resolve();
  function ausfuehren(name, daten, sitz, vonId) {
    kette = kette.then(() => {
      let erg;
      try { erg = N.adapter.aktion(name, daten, sitz); } catch (e) { console.error(e); if (vonId != null) senden(vonId); return; }
      // Dauer-Aktionen (z. B. Zeichenstriche, Ziehbewegungen) melden sich selbst – sonst ginge alle paar
      // Millisekunden der ganze Stand hinaus.
      if (N.adapter.stilleAktionen && N.adapter.stilleAktionen.includes(name)) return;
      sendenWennNeu(vonId);
      if (erg && typeof erg.then === 'function') {
        return Promise.race([erg.catch(e => console.error(e)).then(() => sendenWennNeu(null)), new Promise(ok => setTimeout(ok, 2500))]);
      }
    });
    return kette;
  }
  // Zuletzt verschickter Stand je Gerät: automatische Meldungen nur, wenn sich für dieses Gerät etwas geändert hat.
  const zuletzt = new Map();
  function sendenWennNeu(immerAn) {
    if (N.rolle !== 'host' || !N.laeuft || !N.adapter) return;
    for (const s of N.sitze) {
      if (s.id === N.id) continue;
      const sitz = N.sitze.indexOf(s);
      let st; try { st = N.adapter.zustand(sitz); } catch (e) { console.error(e); continue; }
      const text = JSON.stringify(st);
      if (s.id !== immerAn && zuletzt.get(s.id) === text) continue;
      zuletzt.set(s.id, text);
      schicke(s.id, {t: 'stand', s: st, sitze: sitzeFuer()});
    }
  }
  function sitzeFuer() { return N.sitze; }
  function senden(nurId) {
    if (N.rolle !== 'host' || !N.laeuft || !N.adapter) return;
    const ziele = nurId != null ? [nurId] : N.sitze.map(s => s.id).filter(id => id !== N.id);
    for (const id of ziele) {
      const sitz = N.sitze.findIndex(s => s.id === id); if (sitz < 0) continue;
      let s; try { s = N.adapter.zustand(sitz); } catch (e) { console.error(e); continue; }
      zuletzt.set(id, JSON.stringify(s));
      schicke(id, {t: 'stand', s, sitze: sitzeFuer()});
    }
  }
  function starten() {
    if (N.rolle !== 'host' || !N.adapter) return;
    const a = N.adapter;
    const dabei = N.spieler.filter(s => s.verbunden !== false);
    const anz = dabei.length;
    if (anz < (a.min || 2) || anz > (a.max || 12) || (a.erlaubt && !a.erlaubt.includes(anz))) return;
    zuletzt.clear();
    N.sitze = dabei.map(s => ({id: s.id, name: s.name}));
    N.meinSitz = 0; N.laeuft = true;
    roh({t: 'sperren'});
    schicke('alle', {t: 'start', sitze: N.sitze});
    schliesseLobby(); zeigeVerbindung();
    const farben = (K() && K().farben) || FARBEN_OHNE_KERN;
    try { a.starten(N.sitze.map((s, i) => ({name: s.name, farbe: farben[i % farben.length], sitz: i})), Object.assign({}, N.optionen)); }
    catch (e) { console.error(e); }
    senden();
  }

  /* ---------- Öffentliche Schnittstelle ---------- */
  function meinName() { return (LS.get('spieltisch.netz.name') || '').trim() || 'Gast'; }
  function namenVon(id) { const s = (N.sitze || N.spieler).find(x => x.id === id) || N.spieler.find(x => x.id === id); return s ? s.name : 'Jemand'; }
  function hinweis(t) {
    if (K()) return K().hinweis(t, 2600);
    stil();
    document.querySelectorAll('.nz-toast').forEach(e => e.remove());
    const d = document.createElement('div'); d.className = 'nz-toast'; d.textContent = t; document.body.appendChild(d);
    setTimeout(() => d.remove(), 2600);
  }

  function erstellen({art, name, optionen}) {
    if (!N.adapter) return;
    if (art === 'nah' && !NATIV) return fehler('nahfehlt');
    LS.set('spieltisch.netz.name', name);
    Object.assign(N, {aktiv: true, rolle: 'host', art, spiel: N.adapter.spiel, optionen: optionen || {}, laeuft: false,
      spieler: [{id: 0, name, verbunden: true}], sitze: null, meinSitz: 0, id: null, key: ''});
    zeigeLobby();
    if (art === 'nah') {
      const code = String(1000 + Math.floor(Math.random() * 9000));
      nativ({tun: 'erstellen', code, spiel: N.spiel, name});
    } else wsVerbinden(`/raum/neu?spiel=${encodeURIComponent(N.spiel)}&n=${encodeURIComponent(name)}`);
  }
  function beitreten({code, name}) {
    code = String(code || '').trim().toUpperCase();
    const art = /^\d{4}$/.test(code) ? 'nah' : 'internet';
    if (art === 'nah' && !NATIV) return fehler('nahfehlt');
    LS.set('spieltisch.netz.name', name);
    Object.assign(N, {aktiv: true, rolle: 'gast', art, code, spiel: N.adapter ? N.adapter.spiel : '', laeuft: false,
      spieler: [], sitze: null, meinSitz: null, id: null, key: ''});
    zeigeLobby();
    if (art === 'nah') nativ({tun: 'beitreten', code, name});
    else wsVerbinden(`/raum/${code}?n=${encodeURIComponent(name)}`);
  }
  function wiederkehren(s) { // nach Neuladen der Seite (z. B. App kurz im Hintergrund)
    Object.assign(N, {aktiv: true, rolle: s.rolle, art: s.art, code: s.code, id: s.id, key: s.key, spiel: s.spiel,
      sitze: s.sitze || null, laeuft: !!s.sitze, meinSitz: s.sitze ? s.sitze.findIndex(x => x.id === s.id) : null});
    if (s.rolle === 'host') { SS.set(SITZUNG, null); aufraeumen(); return false; } // Gastgeber-Zustand ist verloren
    zeigeLobby();
    if (s.art === 'nah') nativ({tun: 'beitreten', code: s.code, name: meinName(), id: s.id, key: s.key});
    else wsVerbinden(`/raum/${s.code}?n=${encodeURIComponent(meinName())}&id=${s.id}&key=${s.key}`);
    return true;
  }
  function verlassen() {
    if (!N.aktiv) return;
    if (N.rolle === 'host') schicke('alle', {t: 'ende'});
    setTimeout(aufraeumen, 150);
  }
  function aufraeumen() {
    absichtlich = true;
    if (N.art === 'nah') nativ({tun: 'verlassen'});
    if (ws) { try { ws.close(1000); } catch (_) {} ws = null; }
    clearInterval(pingTimer); clearTimeout(wsTimer); warteschlange.length = 0;
    Object.assign(N, {aktiv: false, rolle: null, art: null, code: '', id: null, key: '', spieler: [], sitze: null,
      meinSitz: null, laeuft: false, hostDa: true, verbunden: false, stand: null});
    SS.set(SITZUNG, null);
    schliesseLobby(); zeigeVerbindung();
  }

  /* ---------- Oberfläche ---------- */
  const CSS = `
  .nz-schleier{position:fixed;inset:0;z-index:300;background:rgba(5,16,22,.82);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);
    display:flex;align-items:center;justify-content:center;padding:max(20px,var(--sicher-o,0px)) 18px 20px}
  .nz-box{width:min(440px,100%);max-height:100%;overflow:auto;background:var(--panel,#123341);border:1px solid var(--line,rgba(255,255,255,.12));
    border-radius:22px;padding:24px 22px;color:var(--ink,#eef4f6);box-shadow:0 24px 60px rgba(0,0,0,.45)}
  .nz-box h2{margin:0 0 6px;font:600 22px/1.2 var(--f-disp,system-ui)}
  .nz-box p{margin:0 0 14px;color:var(--ink2,#a9c0c8);font-size:15px;line-height:1.45}
  .nz-code{font:700 46px/1 var(--f-disp,system-ui);letter-spacing:.18em;text-align:center;padding:16px 0 14px;margin:6px 0 12px;
    background:rgba(255,255,255,.05);border-radius:16px;color:var(--akzent,#f2c14e);user-select:all;-webkit-user-select:all}
  .nz-art{display:inline-flex;gap:6px;align-items:center;font-size:13px;color:var(--ink2,#a9c0c8);margin-bottom:10px}
  .nz-liste{list-style:none;margin:0 0 16px;padding:0;display:grid;gap:8px}
  .nz-liste li{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:12px;background:rgba(255,255,255,.05);font-size:16px}
  .nz-liste li .k-dot{flex:none}
  .nz-liste li small{margin-left:auto;color:var(--ink2,#a9c0c8);font-size:12px}
  .nz-liste li.weg{opacity:.5}
  .nz-knoepfe{display:grid;gap:10px}
  .nz-feld{display:block;margin:0 0 12px}
  .nz-feld span{display:block;font-size:13px;color:var(--ink2,#a9c0c8);margin:0 0 6px}
  .nz-feld input{width:100%;box-sizing:border-box;font:500 18px var(--f-ui,system-ui);padding:12px 14px;border-radius:12px;
    border:1px solid var(--line,rgba(255,255,255,.18));background:rgba(0,0,0,.25);color:inherit}
  .nz-feld input.nz-codefeld{font:700 30px var(--f-disp,system-ui);letter-spacing:.3em;text-align:center;text-transform:uppercase}
  .nz-wahl{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:0 0 14px}
  .nz-wahl button{padding:14px 10px;border-radius:14px;border:1px solid var(--line,rgba(255,255,255,.16));background:rgba(255,255,255,.04);
    color:inherit;font:600 15px var(--f-ui,system-ui);text-align:left;cursor:pointer}
  .nz-wahl button small{display:block;font-weight:400;font-size:12px;color:var(--ink2,#a9c0c8);margin-top:4px}
  .nz-wahl button.an{border-color:var(--akzent,#f2c14e);background:rgba(242,193,78,.12)}
  .nz-wahl button:disabled{opacity:.4}
  .nz-warte{display:flex;align-items:center;gap:10px;color:var(--ink2,#a9c0c8);font-size:15px;margin:4px 0 16px}
  .nz-warte i{width:10px;height:10px;border-radius:50%;background:var(--akzent,#f2c14e);animation:nzPuls 1.2s ease-in-out infinite}
  @keyframes nzPuls{50%{opacity:.25;transform:scale(.7)}}
  .nz-plakette{position:fixed;z-index:120;top:max(12px,var(--sicher-o,0px));right:max(12px,env(safe-area-inset-right,0px));display:flex;align-items:center;gap:7px;
    padding:7px 12px 7px 10px;border-radius:999px;background:rgba(5,16,22,.72);border:1px solid var(--line,rgba(255,255,255,.14));
    color:var(--ink,#eef4f6);font:600 13px var(--f-ui,system-ui);letter-spacing:.06em;cursor:pointer}
  .nz-plakette i{width:8px;height:8px;border-radius:50%;background:#5bd68a}
  .nz-plakette.stoer i{background:#f2a34e;animation:nzPuls 1s infinite}
  .nz-plakette.oben-links{right:auto;left:max(132px,env(safe-area-inset-left,0px))}
  .nz-toast{position:fixed;z-index:400;left:50%;bottom:max(28px,env(safe-area-inset-bottom,0px));transform:translateX(-50%);max-width:min(90vw,460px);
    padding:12px 18px;border-radius:14px;background:rgba(5,16,22,.92);border:1px solid var(--line,rgba(255,255,255,.14));color:var(--ink,#eef4f6);
    font:600 15px var(--f-ui,system-ui);text-align:center}
  .nz-netzblock{margin-top:6px;padding-top:16px;border-top:1px solid var(--line,rgba(255,255,255,.1))}
  .nz-netzblock .nz-zwei{display:grid;grid-template-columns:1fr 1fr;gap:10px}
  @media (prefers-reduced-motion:reduce){.nz-warte i,.nz-plakette.stoer i{animation:none}}`;
  // Ohne Kern (Startseite des Spieltischs) fehlen die Knopf-Stile: schlichte Fassung nur für die Netz-Fenster.
  const CSS_OHNE_KERN = `
  .nz-box .k-btn{display:flex;align-items:center;justify-content:center;width:100%;min-height:52px;padding:0 22px;border-radius:14px;border:0;
    background:var(--akzent,#f2c14e);color:#0c2430;font:700 17px var(--f-ui,system-ui);cursor:pointer}
  .nz-box .k-btn.leise{background:rgba(255,255,255,.08);color:var(--ink,#eef4f6)}
  .nz-box .k-btn:disabled{opacity:.4}
  .nz-box .k-dot{display:inline-grid;place-items:center;width:28px;height:28px;border-radius:50%;background:var(--pc);color:#0c2430;font-weight:700;font-size:14px}
  .nz-hub{display:flex;align-items:center;gap:12px;padding:14px 20px;border-radius:20px;border:1px solid var(--line);background:rgba(7,24,32,.6);
    color:inherit;font:700 17px var(--f-ui,system-ui);cursor:pointer}
  .nz-hub small{display:block;color:var(--ink2);font-size:13px;letter-spacing:.08em;text-transform:uppercase;font-weight:700}`;
  function stil() {
    if (document.getElementById('nz-stil')) return;
    const s = document.createElement('style'); s.id = 'nz-stil'; s.textContent = CSS + (window.Kern ? '' : CSS_OHNE_KERN); document.head.appendChild(s);
  }
  function schleier(html) {
    stil();
    let s = document.querySelector('.nz-schleier');
    if (!s) { s = document.createElement('div'); s.className = 'nz-schleier'; document.body.appendChild(s); }
    s.innerHTML = `<div class="nz-box">${html}</div>`;
    return s.firstChild;
  }
  function schliesseLobby() { const s = document.querySelector('.nz-schleier'); if (s) s.remove(); }
  const artText = art => art === 'nah' ? 'In der Nähe · Bluetooth/WLAN' : 'Über das Internet';
  function spielerListe() {
    const farben = (K() && K().farben) || FARBEN_OHNE_KERN;
    return `<ul class="nz-liste">${N.spieler.map((s, i) => `<li class="${s.verbunden === false ? 'weg' : ''}">
      <span class="k-dot" style="--pc:${farben[i % farben.length] || '#888'}">${esc((s.name || '?').charAt(0).toUpperCase())}</span>
      ${esc(s.name)}${s.id === 0 ? '<small>Gastgeber</small>' : s.id === N.id ? '<small>du</small>' : ''}</li>`).join('')}</ul>`;
  }
  function zeigeLobby() {
    if (!N.aktiv || N.laeuft) return;
    const a = N.adapter || {};
    if (N.rolle === 'host') {
      const anz = N.spieler.filter(s => s.verbunden !== false).length;
      const okAnz = anz >= (a.min || 2) && anz <= (a.max || 12) && (!a.erlaubt || a.erlaubt.includes(anz));
      const bedarf = a.erlaubt ? a.erlaubt.join(', ') : (a.min === a.max ? String(a.min) : `${a.min || 2}–${a.max || 12}`);
      const box = schleier(`<h2>Spiel erstellt</h2>
        <div class="nz-art">${artText(N.art)}</div>
        <p>${N.code ? 'Die anderen tippen auf „Spiel beitreten“ und geben diesen Code ein:' : 'Code wird erstellt …'}</p>
        <div class="nz-code" id="nz-code">${esc(N.code || '····')}</div>
        ${spielerListe()}
        <p style="margin-top:-6px">${okAnz ? 'Alle da? Dann kann es losgehen.' : `Für dieses Spiel braucht ihr ${esc(bedarf)} Geräte.`}</p>
        <div class="nz-knoepfe">
          <button class="k-btn gross" id="nz-start" ${okAnz && N.code ? '' : 'disabled'}>Spiel starten</button>
          <button class="k-btn leise" id="nz-abbrechen">Abbrechen</button>
        </div>`);
      box.querySelector('#nz-start').onclick = starten;
      box.querySelector('#nz-abbrechen').onclick = () => verlassen();
    } else {
      const host = N.spieler.find(s => s.id === 0);
      const box = schleier(`<h2>${N.id === null ? 'Verbinde …' : 'Du bist dabei'}</h2>
        <div class="nz-art">${artText(N.art)} · Code ${esc(N.code)}</div>
        ${N.id === null ? '<div class="nz-warte"><i></i>Suche das Spiel …</div>'
          : `<div class="nz-warte"><i></i>Warte, bis ${esc(host ? host.name : 'der Gastgeber')} das Spiel startet.</div>${spielerListe()}`}
        <div class="nz-knoepfe"><button class="k-btn leise" id="nz-abbrechen">Verlassen</button></div>`);
      box.querySelector('#nz-abbrechen').onclick = () => { verlassen(); };
    }
  }
  let plakette = null;
  function zeigeVerbindung() {
    stil();
    document.body.classList.toggle('nz-laeuft', !!(N.aktiv && N.laeuft));
    if (!N.aktiv || !N.laeuft) { if (plakette) { plakette.remove(); plakette = null; } return; }
    if (!plakette) {
      plakette = document.createElement('button'); plakette.className = 'nz-plakette';
      plakette.onclick = infoFenster; document.body.appendChild(plakette);
    }
    const stoer = !N.verbunden || (N.rolle === 'gast' && !N.hostDa);
    plakette.classList.toggle('stoer', stoer);
    plakette.innerHTML = `<i></i>${stoer ? (N.rolle === 'gast' && N.verbunden && !N.hostDa ? 'Gastgeber weg' : 'Verbinde …') : esc(N.code)}`;
  }
  function infoFenster() {
    const K_ = K();
    const farben = (K_ && K_.farben) || FARBEN_OHNE_KERN;
    const zeilen = (N.sitze || []).map((s, i) => {
      const sp = N.spieler.find(x => x.id === s.id); const da = s.id === N.id || (sp ? sp.verbunden !== false : true);
      return `<li class="${da ? '' : 'weg'}"><span class="k-dot" style="--pc:${farben[i % farben.length]}">${esc(s.name.charAt(0).toUpperCase())}</span>${esc(s.name)}
        <small>${s.id === N.id ? 'du' : s.id === 0 ? 'Gastgeber' : da ? 'verbunden' : 'getrennt'}</small></li>`;
    }).join('');
    const box = document.createElement('div');
    box.innerHTML = `<h2>Spiel auf mehreren Geräten</h2><p>${artText(N.art)} · Code <b>${esc(N.code)}</b></p>
      <ul class="nz-liste">${zeilen}</ul>`;
    const b = document.createElement('button'); b.className = 'k-btn gefahr';
    b.textContent = N.rolle === 'host' ? 'Spiel für alle beenden' : 'Spiel verlassen';
    box.appendChild(b);
    if (!K_) { // ohne Kern: im Netz-Fenster zeigen
      const z = document.createElement('button'); z.className = 'k-btn leise'; z.textContent = 'Zurück zum Spiel';
      box.appendChild(z);
      const huelle = schleier(''); huelle.appendChild(box);
      huelle.querySelectorAll('.k-btn').forEach(k => { k.style.marginTop = '10px'; });
      z.onclick = schliesseLobby;
      b.onclick = () => { schliesseLobby(); verlassen(); N.adapter && N.adapter.beendet ? N.adapter.beendet() : location.reload(); };
      return;
    }
    const fe = K_.fenster(box);
    b.onclick = () => { fe.schliessen(); verlassen(); N.adapter && N.adapter.beendet ? N.adapter.beendet() : location.reload(); };
  }

  /* Dialoge „Spiel erstellen“ / „Spiel beitreten“ */
  function erstellenDialog({optionen, name} = {}) {
    let art = 'internet';
    const nameVor = name || LS.get('spieltisch.netz.name') || '';
    const box = schleier(`<h2>Spiel erstellen</h2>
      <p>Jeder spielt auf seinem eigenen Gerät. Du bist Gastgeber.</p>
      <div class="nz-wahl">
        <button id="nz-art-internet" class="an">Über das Internet<small>auch weit weg</small></button>
        <button id="nz-art-nah" ${NATIV ? '' : 'disabled'}>In der Nähe<small>${NATIV ? 'Bluetooth/WLAN, ohne Internet' : 'nur in der Spieltisch-App'}</small></button>
      </div>
      <label class="nz-feld"><span>Dein Name</span><input id="nz-name" maxlength="14" autocomplete="off" autocorrect="off" spellcheck="false" value="${esc(nameVor)}" placeholder="Name"></label>
      <div class="nz-knoepfe"><button class="k-btn gross" id="nz-los">Lobby öffnen</button><button class="k-btn leise" id="nz-zu">Abbrechen</button></div>`);
    const setzArt = a => { art = a; box.querySelector('#nz-art-internet').classList.toggle('an', a === 'internet'); box.querySelector('#nz-art-nah').classList.toggle('an', a === 'nah'); };
    box.querySelector('#nz-art-internet').onclick = () => setzArt('internet');
    box.querySelector('#nz-art-nah').onclick = () => NATIV && setzArt('nah');
    box.querySelector('#nz-zu').onclick = schliesseLobby;
    const los = () => {
      const n = box.querySelector('#nz-name').value.trim();
      if (!n) { box.querySelector('#nz-name').focus(); return; }
      erstellen({art, name: n, optionen});
    };
    box.querySelector('#nz-los').onclick = los;
    box.querySelector('#nz-name').onkeydown = e => { if (e.key === 'Enter') los(); };
  }
  function beitretenDialog({codeVor = ''} = {}) {
    const nameVor = LS.get('spieltisch.netz.name') || '';
    const box = schleier(`<h2>Spiel beitreten</h2>
      <p>Gib den Code vom Gerät des Gastgebers ein. Buchstaben = übers Internet, Ziffern = in der Nähe.</p>
      <label class="nz-feld"><span>Code</span><input id="nz-code-ein" class="nz-codefeld" maxlength="4" autocomplete="off" autocorrect="off" autocapitalize="characters" spellcheck="false" value="${esc(codeVor)}" placeholder="KXQM"></label>
      <label class="nz-feld"><span>Dein Name</span><input id="nz-name" maxlength="14" autocomplete="off" autocorrect="off" spellcheck="false" value="${esc(nameVor)}" placeholder="Name"></label>
      <div class="nz-knoepfe"><button class="k-btn gross" id="nz-los">Beitreten</button><button class="k-btn leise" id="nz-zu">Abbrechen</button></div>`);
    const codeEl = box.querySelector('#nz-code-ein'), nameEl = box.querySelector('#nz-name');
    codeEl.oninput = () => { codeEl.value = codeEl.value.toUpperCase().replace(/[^A-Z0-9]/g, ''); };
    box.querySelector('#nz-zu').onclick = schliesseLobby;
    const los = async () => {
      const code = codeEl.value.trim().toUpperCase(), name = nameEl.value.trim();
      if (!/^([A-Z]{4}|\d{4})$/.test(code)) { codeEl.focus(); hinweis('Der Code hat 4 Buchstaben oder 4 Ziffern.'); return; }
      if (!name) { nameEl.focus(); return; }
      LS.set('spieltisch.netz.name', name);
      await zumSpiel(code, name);
    };
    box.querySelector('#nz-los').onclick = los;
    nameEl.onkeydown = codeEl.onkeydown = e => { if (e.key === 'Enter') los(); };
    setTimeout(() => (codeVor ? nameEl : codeEl).focus(), 60);
  }
  /** Welches Spiel gehört zum Code? Auf der richtigen Seite direkt beitreten, sonst dorthin wechseln. */
  async function zumSpiel(code, name) {
    const nah = /^\d{4}$/.test(code);
    if (nah && !NATIV) return fehler('nahfehlt');
    let spiel;
    schleier(`<h2>Suche das Spiel …</h2><div class="nz-warte"><i></i>Code ${esc(code)}</div>`);
    try {
      if (nah) {
        spiel = await new Promise((ok, nein) => { nativSuche[code] = ok; nativ({tun: 'suchen', code}); setTimeout(() => nein(new Error('zeit')), 15000); });
      } else {
        const r = await fetch(`${httpAdresse()}/raum/${code}/info`, {cache: 'no-store'});
        if (r.status === 404) return fehler('unbekannt');
        const j = await r.json(); if (!j.offen) return fehler('laeuft');
        spiel = j.spiel;
      }
    } catch (e) { N.art = nah ? 'nah' : 'internet'; return fehler(nah ? 'unbekannt' : 'netz'); }
    if (!spiel) return fehler('unbekannt');
    if (N.adapter && N.adapter.spiel === spiel) return beitreten({code, name});
    const basis = location.pathname.includes('/spiele/') ? '' : 'spiele/';
    location.href = `${basis}${spiel}.html?beitreten=${encodeURIComponent(code)}`;
  }

  /** Abschnitt „Mit mehreren Geräten“ für die Startseite eines Spiels (von Kern.setup eingesetzt). */
  function setupBlock(holeOptionen, holeName) {
    stil();
    const d = document.createElement('div'); d.className = 'nz-netzblock';
    d.innerHTML = `<span class="k-lab">Jeder mit eigenem Gerät</span><div class="nz-zwei">
      <button class="k-btn leise" id="nz-erstellen">Spiel erstellen</button><button class="k-btn leise" id="nz-beitreten">Spiel beitreten</button></div>`;
    d.querySelector('#nz-erstellen').onclick = () => erstellenDialog({optionen: holeOptionen(), name: holeName()});
    d.querySelector('#nz-beitreten').onclick = () => beitretenDialog();
    return d;
  }

  function einrichten(adapter) {
    N.adapter = adapter;
    setTimeout(() => { // nach dem Aufbau der Startseite
      const s = SS.get(SITZUNG);
      const code = params.get('beitreten');
      if (code) {
        history.replaceState(null, '', location.pathname);
        const name = LS.get('spieltisch.netz.name');
        if (name) beitreten({code, name}); else beitretenDialog({codeVor: code.toUpperCase()});
      } else if (s && s.spiel === adapter.spiel && s.rolle === 'gast') wiederkehren(s);
      else if (s) SS.set(SITZUNG, null);
    }, 0);
  }

  window.Netz = {
    get aktiv() { return N.aktiv; },
    get laeuft() { return N.aktiv && N.laeuft; },
    get istHost() { return N.aktiv && N.rolle === 'host'; },
    get istGast() { return N.aktiv && N.rolle === 'gast'; },
    get meinSitz() { return N.aktiv ? N.meinSitz : null; },
    get code() { return N.code; },
    get art() { return N.art; },
    get sitze() { return N.sitze ? N.sitze.map(s => ({...s})) : null; },
    get adapter() { return N.adapter; },
    nativ: NATIV,
    einrichten,
    /** Zug aus der Bedienung: Gastgeber (oder ohne Netz) führt aus, Mitspieler schicken an den Gastgeber. */
    tun(name, daten = {}) {
      if (!N.aktiv || !N.laeuft) return N.adapter && N.adapter.aktion(name, daten, null); // ohne Netz: sitz = null
      if (N.rolle === 'host') return ausfuehren(name, daten, 0, null);
      schicke('host', {t: 'aktion', name, daten});
    },
    /** Gastgeber: aktuellen Stand an alle (oder an einen Sitz) schicken. */
    melden(sitz) { if (sitz != null && N.sitze && N.sitze[sitz]) senden(N.sitze[sitz].id); else senden(); },
    /** Gastgeber: kurze Meldung an alle Mitspieler ({hinweis, ton, feier, daten}). */
    ereignis(obj) { if (N.rolle === 'host' && N.laeuft) schicke('alle', Object.assign({t: 'ereignis'}, obj)); },
    /** Darf das Gerät für diesen Sitz jetzt bedienen? Ohne Netz immer. */
    binDran(sitz) { return !N.aktiv || !N.laeuft || sitz === N.meinSitz; },
    verlassen, erstellenDialog, beitretenDialog, setupBlock, zumSpiel, stil,
    // nur für Proben
    __n: N,
  };

  // Kern-Anbindung: Speichern ruht im Netzspiel, Sichtschutz entfällt (jedes Gerät gehört einer Person),
  // „Zum Spieltisch“ beendet bzw. verlässt das Netzspiel sauber.
  function kernAnbinden() {
    const k = window.Kern; if (!k || k.__netz) return;
    k.__netz = true;
    const sp = k.speicher;
    ['speichern', 'loeschen'].forEach(f => { const alt = sp[f]; sp[f] = (...a) => (N.aktiv ? undefined : alt.apply(sp, a)); });
    const sicht = k.sichtschutz;
    k.sichtschutz = (o = {}) => (N.aktiv && N.laeuft ? Promise.resolve() : sicht(o));
  }
  if (window.Kern) kernAnbinden(); else document.addEventListener('DOMContentLoaded', kernAnbinden);
  window.addEventListener('pagehide', () => { if (N.aktiv && N.rolle === 'host' && !N.laeuft) verlassen(); });
})();
