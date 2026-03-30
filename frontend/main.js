/**
 * main.js — "Claude m'a tuer" · Rusty Lake Edition
 * ═══════════════════════════════════════════════════
 *  1. AudioManager    — Sons Web Audio API (atmosphère Rusty Lake)
 *  2. StateManager    — État global du jeu
 *  3. Phase1          — Écran titre
 *  4. Phase2          — Appel typewriter
 *  5. Phase3          — Appartement + hotspots
 *  6. TimerManager    — Compte à rebours 5 min
 *  7. ModalManager    — Gestion des modales
 *  8. EnigmaLocker    — Cadenas (code 7294)
 *  9. EnigmaPC        — Terminal + PIN (1895)
 * 10. ThreeJSToken    — Jeton cel-shaded (MeshToonMaterial)
 */

'use strict';

/* ══════════════════════════════════════════════════
   1. AUDIO MANAGER
   Sons d'ambiance synthétisés via Web Audio API.
   Atmosphère: lourde, oppressante, macabre.
   ══════════════════════════════════════════════════ */
const AudioManager = (() => {
  let ctx = null;
  let droneNode = null;      // Bourdonnement continu d'ambiance
  let alarmTimer = null;

  function getCtx() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    return ctx;
  }

  /**
   * Bourdonnement grave d'ambiance (ventilateur + sub-bass)
   * Typique Rusty Lake : son lent, oppressant, presque organique
   */
  function startDrone() {
    const c = getCtx();

    // Oscillateur sub-bass très grave
    const osc1 = c.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(42, c.currentTime);

    // Oscillateur harmonique légèrement désaccordé (battement)
    const osc2 = c.createOscillator();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(84.3, c.currentTime);

    // Bruit blanc filtré grave (ventilateur de PC)
    const bufSize  = c.sampleRate * 2;
    const buffer   = c.createBuffer(1, bufSize, c.sampleRate);
    const data     = buffer.getChannelData(0);
    for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
    const noise    = c.createBufferSource();
    noise.buffer   = buffer;
    noise.loop     = true;

    const noiseFilter = c.createBiquadFilter();
    noiseFilter.type  = 'bandpass';
    noiseFilter.frequency.setValueAtTime(120, c.currentTime);
    noiseFilter.Q.setValueAtTime(0.5, c.currentTime);

    // LFO lent pour le côté organique / respiratoire
    const lfo = c.createOscillator();
    lfo.type  = 'sine';
    lfo.frequency.setValueAtTime(0.2, c.currentTime);
    const lfoGain = c.createGain();
    lfoGain.gain.setValueAtTime(8, c.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(osc1.frequency);
    lfo.start();

    const masterGain = c.createGain();
    masterGain.gain.setValueAtTime(0, c.currentTime);
    masterGain.gain.linearRampToValueAtTime(0.08, c.currentTime + 4);

    osc1.connect(masterGain);
    osc2.connect(masterGain);
    noise.connect(noiseFilter);
    noiseFilter.connect(masterGain);
    masterGain.connect(c.destination);

    osc1.start(); osc2.start(); noise.start();
    droneNode = { osc1, osc2, noise, lfo, masterGain };
  }

  function stopDrone() {
    if (!droneNode) return;
    const { masterGain } = droneNode;
    const c = getCtx();
    masterGain.gain.linearRampToValueAtTime(0, c.currentTime + 2);
    droneNode = null;
  }

  /**
   * Son de sonnerie téléphonique — vieux téléphone analogique
   * Deux bips graves rapprochés avec silence, en boucle
   */
  let ringInterval = null;
  function startRing() {
    const ring = () => {
      const c = getCtx();
      [0, 0.18].forEach(delay => {
        const o = c.createOscillator();
        const g = c.createGain();
        o.connect(g); g.connect(c.destination);
        o.type = 'square';
        o.frequency.setValueAtTime(480, c.currentTime + delay);
        g.gain.setValueAtTime(0, c.currentTime + delay);
        g.gain.linearRampToValueAtTime(0.12, c.currentTime + delay + 0.02);
        g.gain.linearRampToValueAtTime(0, c.currentTime + delay + 0.15);
        o.start(c.currentTime + delay);
        o.stop(c.currentTime + delay + 0.15);
      });
    };
    ring();
    ringInterval = setInterval(ring, 2200);
  }

  function stopRing() {
    if (ringInterval) { clearInterval(ringInterval); ringInterval = null; }
  }

  /**
   * Décroché — clic mécanique sec
   */
  function playPickup() {
    stopRing();
    const c = getCtx();
    const o = c.createOscillator();
    const g = c.createGain();
    o.connect(g); g.connect(c.destination);
    o.type = 'sawtooth';
    o.frequency.setValueAtTime(800, c.currentTime);
    o.frequency.exponentialRampToValueAtTime(200, c.currentTime + 0.06);
    g.gain.setValueAtTime(0.25, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.06);
    o.start(); o.stop(c.currentTime + 0.06);
  }

  /**
   * Son d'erreur — grincement sourd et dissonant
   */
  function playError() {
    const c = getCtx();
    const o = c.createOscillator();
    const g = c.createGain();
    const dist = c.createWaveShaper();
    // Distorsion légère
    const curve = new Float32Array(256);
    for (let i = 0; i < 256; i++) {
      const x = (i * 2) / 256 - 1;
      curve[i] = (Math.PI + 200) * x / (Math.PI + 200 * Math.abs(x));
    }
    dist.curve = curve;
    o.connect(dist); dist.connect(g); g.connect(c.destination);
    o.type = 'sawtooth';
    o.frequency.setValueAtTime(160, c.currentTime);
    o.frequency.exponentialRampToValueAtTime(60, c.currentTime + 0.45);
    g.gain.setValueAtTime(0.3, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.45);
    o.start(); o.stop(c.currentTime + 0.45);
  }

  /**
   * Son d'ouverture — clac mécanique de cadenas (sec, métallique)
   */
  function playUnlock() {
    const c = getCtx();
    // Bruit transitoire haute fréquence (métal)
    [0, 0.04, 0.08].forEach((t, i) => {
      const buf = c.createBuffer(1, Math.floor(c.sampleRate * 0.05), c.sampleRate);
      const d   = buf.getChannelData(0);
      for (let j = 0; j < d.length; j++) d[j] = (Math.random() * 2 - 1) * (1 - j / d.length);
      const src = c.createBufferSource();
      src.buffer = buf;
      const f = c.createBiquadFilter();
      f.type = 'highpass';
      f.frequency.setValueAtTime(1200 - i * 200, c.currentTime);
      const g = c.createGain();
      g.gain.setValueAtTime(0.35 - i * 0.05, c.currentTime + t);
      src.connect(f); f.connect(g); g.connect(c.destination);
      src.start(c.currentTime + t);
    });
  }

  /**
   * Victoire — accord lent, inquiétant et ambigu (modal churchly)
   */
  function playVictory() {
    stopDrone();
    const c = getCtx();
    [220, 277, 330, 415].forEach((freq, i) => {
      setTimeout(() => {
        const o = c.createOscillator();
        const g = c.createGain();
        o.connect(g); g.connect(c.destination);
        o.type = 'sine';
        o.frequency.setValueAtTime(freq, c.currentTime);
        g.gain.setValueAtTime(0, c.currentTime);
        g.gain.linearRampToValueAtTime(0.12, c.currentTime + 0.5);
        g.gain.linearRampToValueAtTime(0, c.currentTime + 3);
        o.start(); o.stop(c.currentTime + 3);
      }, i * 200);
    });
  }

  /**
   * Game Over — son de fin profond et irrémédiable
   */
  function playGameOver() {
    stopDrone();
    const c = getCtx();
    const freqs = [160, 120, 90, 60];
    freqs.forEach((f, i) => {
      setTimeout(() => {
        const o = c.createOscillator();
        const g = c.createGain();
        o.connect(g); g.connect(c.destination);
        o.type = 'sawtooth';
        o.frequency.setValueAtTime(f, c.currentTime);
        g.gain.setValueAtTime(0.25, c.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 1);
        o.start(); o.stop(c.currentTime + 1);
      }, i * 350);
    });
  }

  /**
   * Alarme timer critique < 30s — tic lent et menaçant
   */
  function startAlarm() {
    if (alarmTimer) return;
    let loud = true;
    alarmTimer = setInterval(() => {
      const c = getCtx();
      const o = c.createOscillator();
      const g = c.createGain();
      o.connect(g); g.connect(c.destination);
      o.type = 'sine';
      o.frequency.setValueAtTime(loud ? 880 : 660, c.currentTime);
      g.gain.setValueAtTime(0.12, c.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.08);
      o.start(); o.stop(c.currentTime + 0.08);
      loud = !loud;
    }, 600);
  }

  function stopAlarm() {
    if (alarmTimer) { clearInterval(alarmTimer); alarmTimer = null; }
  }

  /** Clic du pavé — clic mécanique de dactylographie */
  function playKey() {
    const c = getCtx();
    const buf = c.createBuffer(1, Math.floor(c.sampleRate * 0.03), c.sampleRate);
    const d   = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
    const src = c.createBufferSource();
    src.buffer = buf;
    const g = c.createGain();
    g.gain.setValueAtTime(0.15, c.currentTime);
    src.connect(g); g.connect(c.destination);
    src.start();
  }

  return {
    startDrone, stopDrone,
    startRing, stopRing, playPickup,
    playError, playUnlock,
    playVictory, playGameOver,
    startAlarm, stopAlarm,
    playKey
  };
})();


/* ══════════════════════════════════════════════════
   2. STATE MANAGER
   ══════════════════════════════════════════════════ */
const State = {
  lockerOpen:  false,
  tokenInited: false,
  gameOver:    false,
  won:         false,
};

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}


/* ══════════════════════════════════════════════════
   3. PHASE 1 — TITRE
   ══════════════════════════════════════════════════ */
document.getElementById('btn-play').addEventListener('click', () => {
  AudioManager.playKey();
  showScreen('screen-call');
  Phase2.init();
});


/* ══════════════════════════════════════════════════
   4. PHASE 2 — APPEL
   ══════════════════════════════════════════════════ */
const Phase2 = (() => {
  // Texte complet du message de Max
  const TEXT = `"Allô ? C'est Max...

Dis, tu peux passer chez Arthur ? Il a été viré ce matin, NovaTech a tout remplacé par cette IA, Claude.

Je l'ai eu au téléphone, il était en boucle, il parlait de tout faire sauter...

Son appart est ouvert mais il ne répond plus.

Va voir s'il te plaît !"`;

  let typerTimeout = null;

  function init() {
    // Réinitialise l'affichage
    document.getElementById('call-transcript').textContent = '';
    document.getElementById('btn-next').classList.add('hidden');
    document.getElementById('call-ring').classList.add('active');
    document.getElementById('call-talk').classList.remove('active');

    AudioManager.startRing();

    // Décrocher
    const accept  = document.getElementById('btn-accept');
    const decline = document.getElementById('btn-decline');

    const handlePickup = () => {
      AudioManager.playPickup();
      document.getElementById('call-ring').classList.remove('active');
      document.getElementById('call-talk').classList.add('active');
      typeText();
    };
    accept.onclick  = handlePickup;
    decline.onclick = handlePickup; // On décroche quoi qu'il arrive
  }

  function typeText() {
    const el  = document.getElementById('call-transcript');
    const btn = document.getElementById('btn-next');
    let i = 0;

    function next() {
      if (i >= TEXT.length) {
        // Fini
        btn.classList.remove('hidden');
        btn.onclick = () => {
          AudioManager.playKey();
          showScreen('screen-apartment');
          Phase3.init();
        };
        return;
      }
      el.textContent += TEXT[i];
      i++;
      const ch  = TEXT[i - 1];
      const delay = ch === '.' || ch === '!' || ch === '?'
        ? 420 : ch === '\n' ? 280 : Math.random() * 38 + 20;
      typerTimeout = setTimeout(next, delay);
    }
    next();
  }

  return { init };
})();


/* ══════════════════════════════════════════════════
   5. PHASE 3 — APPARTEMENT
   ══════════════════════════════════════════════════ */
const Phase3 = (() => {
  function init() {
    AudioManager.startDrone();
    TimerManager.start();

    // Bind des hotspots
    document.querySelectorAll('.rl-hotspot').forEach(hs => {
      hs.addEventListener('click', () => {
        const id = hs.dataset.modal;
        if (id) {
          AudioManager.playKey();
          ModalManager.open(id);
        }
      });
    });
  }
  return { init };
})();


/* ══════════════════════════════════════════════════
   6. TIMER MANAGER
   Timer affiché à deux endroits : vue appart + modale PC
   ══════════════════════════════════════════════════ */
const TimerManager = (() => {
  let secs = 300;
  let iv   = null;
  let alarmOn = false;

  function start() {
    secs = 300; alarmOn = false;
    render();
    iv = setInterval(() => {
      secs--;
      render();
      if (secs <= 30 && !alarmOn) { alarmOn = true; AudioManager.startAlarm(); flashTimer(); }
      if (secs <= 0)  gameOver();
    }, 1000);
  }

  function stop() {
    clearInterval(iv); iv = null;
    AudioManager.stopAlarm();
  }

  function render() {
    const m = String(Math.floor(secs / 60)).padStart(2,'0');
    const s = String(secs % 60).padStart(2,'0');
    const str = `${m}:${s}`;
    const el1 = document.getElementById('apt-timer');
    const el2 = document.getElementById('pc-timer');
    if (el1) el1.textContent = str;
    if (el2) el2.textContent = str;
  }

  function flashTimer() {
    const el = document.getElementById('apt-timer');
    if (el) el.classList.add('danger');
  }

  function gameOver() {
    stop();
    AudioManager.stopDrone();
    AudioManager.playGameOver();
    State.gameOver = true;
    ModalManager.closeAll();
    setTimeout(() => showScreen('screen-gameover'), 600);
  }

  function getSeconds() { return secs; }
  return { start, stop, getSeconds };
})();


/* ══════════════════════════════════════════════════
   7. MODAL MANAGER
   ══════════════════════════════════════════════════ */
const ModalManager = (() => {
  const overlay = document.getElementById('modal-overlay');

  function open(id) {
    closeAll();
    overlay.classList.remove('hidden');
    document.getElementById(id).classList.remove('hidden');
    // Modale PC → mettre à jour le jeton si casier est ouvert
    if (id === 'modal-pc') EnigmaPC.onOpen();
  }

  function closeAll() {
    overlay.classList.add('hidden');
    document.querySelectorAll('.rl-modal').forEach(m => m.classList.add('hidden'));
  }

  // Fermeture des modales
  document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', () => {
      AudioManager.playKey();
      const target = btn.dataset.close;
      if (target) document.getElementById(target).classList.add('hidden');
      overlay.classList.add('hidden');
    });
  });
  overlay.addEventListener('click', closeAll);

  return { open, closeAll };
})();


/* ══════════════════════════════════════════════════
   8. ENIGMA LOCKER — Cadenas (code 7294)
   ══════════════════════════════════════════════════ */
const EnigmaLocker = (() => {
  let code = '';
  const digitsEl   = document.getElementById('padlock-digits');
  const feedback   = document.getElementById('padlock-feedback');
  const successEl  = document.getElementById('padlock-success');
  const submitBtn  = document.getElementById('padlock-submit');

  function renderDigits() {
    const chars = [0,1,2,3].map(i => code[i] || '_');
    digitsEl.textContent = chars.join('  ');
  }

  function press(v) {
    if (code.length >= 4) return;
    AudioManager.playKey();
    code += v; renderDigits();
  }

  function del() {
    AudioManager.playKey();
    code = code.slice(0,-1); renderDigits();
  }

  function clear() {
    AudioManager.playKey();
    code = ''; renderDigits(); feedback.textContent = '';
  }

  async function submit() {
    if (code.length < 4) { feedback.textContent = 'Code incomplet.'; return; }
    submitBtn.disabled = true;

    try {
      const res  = await fetch('/api/verify-locker', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ code })
      });
      const data = await res.json();

      if (data.success) {
        AudioManager.playUnlock();
        State.lockerOpen = true;
        digitsEl.style.color = '#6a9060';
        digitsEl.style.textShadow = '0 0 6px rgba(100,144,90,0.5)';
        feedback.style.color = '#6a9060';
        feedback.textContent = '— Le cadenas s\'ouvre. —';
        successEl.classList.remove('hidden');
        submitBtn.style.display = 'none';
      } else {
        AudioManager.playError();
        digitsEl.classList.add('shake');
        setTimeout(() => {
          digitsEl.classList.remove('shake');
          code = ''; renderDigits();
          digitsEl.style.color = '';
          digitsEl.style.textShadow = '';
        }, 380);
        feedback.textContent = 'Mauvais code. Le cadenas résiste.';
        submitBtn.disabled = false;
      }
    } catch {
      feedback.textContent = 'Erreur serveur.';
      submitBtn.disabled = false;
    }
  }

  // Pavé numérique
  document.querySelectorAll('.pk-btn[data-v]').forEach(b => {
    b.addEventListener('click', () => press(b.dataset.v));
  });
  document.getElementById('pk-clr').addEventListener('click', clear);
  document.getElementById('pk-del').addEventListener('click', del);
  submitBtn.addEventListener('click', submit);

  renderDigits();
  return {};
})();


/* ══════════════════════════════════════════════════
   9. ENIGMA PC — Terminal + PIN 1895
   ══════════════════════════════════════════════════ */
const EnigmaPC = (() => {
  let tokenReady = false;

  function onOpen() {
    // Si le casier est ouvert, afficher le jeton 3D
    if (State.lockerOpen) {
      document.getElementById('token-locked').classList.add('hidden');
      const wrap = document.getElementById('token-wrap');
      wrap.classList.remove('hidden');
      if (!tokenReady) {
        ThreeJSToken.init();
        tokenReady = true;
      }
    }
  }

  async function submit() {
    const pin = document.getElementById('pc-pin').value.trim();
    if (pin.length < 4) {
      document.getElementById('pc-feedback').textContent = '// code incomplet';
      return;
    }
    const btn = document.getElementById('pc-submit');
    btn.disabled = true;
    btn.textContent = '...';

    try {
      const res  = await fetch('/api/verify-pin', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ pin })
      });
      const data = await res.json();

      if (data.success) {
        triggerVictory();
      } else {
        AudioManager.playError();
        const input = document.getElementById('pc-pin');
        input.classList.add('shake');
        setTimeout(() => { input.classList.remove('shake'); input.value = ''; }, 380);
        document.getElementById('pc-feedback').textContent = '// ACCÈS REFUSÉ — code erroné';
        btn.disabled = false; btn.textContent = 'ANNULER';
      }
    } catch {
      document.getElementById('pc-feedback').textContent = '// erreur serveur';
      btn.disabled = false; btn.textContent = 'ANNULER';
    }
  }

  function triggerVictory() {
    TimerManager.stop();
    AudioManager.stopDrone();
    AudioManager.playVictory();
    State.won = true;
    ModalManager.closeAll();
    setTimeout(() => showScreen('screen-victory'), 900);
  }

  document.getElementById('pc-submit').addEventListener('click', submit);
  document.getElementById('pc-pin').addEventListener('keydown', e => {
    if (e.key === 'Enter') submit();
  });

  return { onOpen };
})();


/* ══════════════════════════════════════════════════
   10. THREE.JS TOKEN — Cel-shading (MeshToonMaterial)
   Style : plat, graphique, 2D illustré — s'intègre à
   l'esthétique Rusty Lake sans rupture visuelle.
   ══════════════════════════════════════════════════ */
const ThreeJSToken = (() => {
  let initialized = false;

  function init() {
    if (initialized) return;
    initialized = true;

    const canvas = document.getElementById('token-canvas');
    const W = 240, H = 240;
    canvas.width = W; canvas.height = H;

    const scene    = new THREE.Scene();
    scene.background = new THREE.Color(0x080604); // Fond quasi-noir brun

    const camera   = new THREE.PerspectiveCamera(42, W / H, 0.1, 100);
    camera.position.z = 5.5;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    /* ── Cel-shading : gradient map ──
       MeshToonMaterial utilise une texture 1D
       pour les steps de shading (effet dessin 2D) */
    const gradCanvas = document.createElement('canvas');
    gradCanvas.width = 4; gradCanvas.height = 1;
    const gc = gradCanvas.getContext('2d');
    // 4 niveaux de luminosité (Rusty Lake flavor)
    gc.fillStyle = '#1a1410'; gc.fillRect(0,0,1,1); // ombre profonde
    gc.fillStyle = '#4a3828'; gc.fillRect(1,0,1,1); // mi-ombre
    gc.fillStyle = '#7a6050'; gc.fillRect(2,0,1,1); // lumière
    gc.fillStyle = '#a89070'; gc.fillRect(3,0,1,1); // reflet
    const gradMap = new THREE.CanvasTexture(gradCanvas);
    gradMap.magFilter = THREE.NearestFilter;
    gradMap.minFilter = THREE.NearestFilter;

    /* ── Texture du jeton (canvas 2D) ── */
    const tc = document.createElement('canvas');
    tc.width = 512; tc.height = 512;
    const ctx = tc.getContext('2d');

    // Fond cerclé style medaille
    ctx.fillStyle = '#3a2c1e';
    ctx.beginPath(); ctx.arc(256,256,254,0,Math.PI*2); ctx.fill();

    // Cercle intérieur gravé
    ctx.strokeStyle = '#1a100a'; ctx.lineWidth = 12;
    ctx.beginPath(); ctx.arc(256,256,250,0,Math.PI*2); ctx.stroke();

    // Cercle secondaire
    ctx.strokeStyle = '#5a4030'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(256,256,230,0,Math.PI*2); ctx.stroke();
    ctx.beginPath(); ctx.arc(256,256,200,0,Math.PI*2); ctx.stroke();

    // Décoration radiale (gravures)
    ctx.strokeStyle = '#2a1e12'; ctx.lineWidth = 1.5;
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(256 + Math.cos(a)*70, 256 + Math.sin(a)*70);
      ctx.lineTo(256 + Math.cos(a)*194, 256 + Math.sin(a)*194);
      ctx.stroke();
    }

    // Entête
    ctx.fillStyle = '#7a552a';
    ctx.font      = 'bold 20px "Share Tech Mono", monospace';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('NOVATECH  ·  SECURE', 256, 95);

    // Séparateur
    ctx.strokeStyle = '#5a3a18'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(106,114); ctx.lineTo(406,114); ctx.stroke();

    // Table de correspondance — gravée dans le métal
    // Couleur sang mat (rouge sombre Rusty Lake)
    ctx.fillStyle = '#8a2020';
    ctx.font = 'bold 50px "Special Elite", cursive';
    ctx.fillText('T = 4', 256, 175);
    ctx.fillText('U = 1', 256, 235);
    ctx.fillText('E = 2', 256, 295);
    ctx.fillText('R = 8', 256, 355);

    // Séparateur
    ctx.strokeStyle = '#5a3a18'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(106,382); ctx.lineTo(406,382); ctx.stroke();

    // Ligne bas — indice César
    ctx.fillStyle = '#5a3a18';
    ctx.font      = 'italic 17px "Special Elite", cursive';
    ctx.fillText('δ + 7  (mod 10)', 256, 415);

    // Bordure extérieur rouge sang mat
    ctx.strokeStyle = '#7a1c1c'; ctx.lineWidth = 6;
    ctx.beginPath(); ctx.arc(256,256,246,0,Math.PI*2); ctx.stroke();

    const texture = new THREE.CanvasTexture(tc);

    /* ── Matériaux Cel-shadés ── */
    const matEdge = new THREE.MeshToonMaterial({
      color: 0x2a1c10, gradientMap: gradMap,
      side: THREE.FrontSide,
    });
    const matFace = new THREE.MeshToonMaterial({
      map: texture, gradientMap: gradMap,
    });
    const matBack = new THREE.MeshToonMaterial({
      color: 0x1a1008, gradientMap: gradMap,
    });

    /* ── Géométrie cylindre (jeton épais) ── */
    const geo  = new THREE.CylinderGeometry(1.85, 1.85, 0.28, 64);
    const coin = new THREE.Mesh(geo, [matEdge, matFace, matBack]);
    coin.rotation.x = Math.PI / 2;
    coin.rotation.z = 0.5;
    scene.add(coin);

    /* ── Éclairage minimaliste (renforce le cel-shading) ── */
    // Lumière directionnelle principale
    const dirLight = new THREE.DirectionalLight(0xc8a870, 1.8);
    dirLight.position.set(3, 5, 4);
    scene.add(dirLight);

    // Lumière ambiante très faible (ombres profondes Rusty Lake)
    scene.add(new THREE.AmbientLight(0x1a100a, 0.6));

    // Contre-jour rouge sang (contour dramatique)
    const rimLight = new THREE.DirectionalLight(0x5a1010, 1.2);
    rimLight.position.set(-3, -2, -3);
    scene.add(rimLight);

    /* ── Interaction souris ── */
    let drag = false;
    let prev = { x:0, y:0 };

    canvas.addEventListener('mousedown', e => {
      drag = true; prev = { x:e.offsetX, y:e.offsetY };
    });
    canvas.addEventListener('mousemove', e => {
      if (!drag) return;
      coin.rotation.y += (e.offsetX - prev.x) * 0.014;
      coin.rotation.x += (e.offsetY - prev.y) * 0.014;
      prev = { x:e.offsetX, y:e.offsetY };
    });
    document.addEventListener('mouseup', () => { drag = false; });

    // Touch support
    canvas.addEventListener('touchstart', e => {
      drag = true;
      const r = canvas.getBoundingClientRect();
      prev = { x:e.touches[0].clientX-r.left, y:e.touches[0].clientY-r.top };
      e.preventDefault();
    }, { passive:false });
    canvas.addEventListener('touchmove', e => {
      if (!drag) return;
      const r = canvas.getBoundingClientRect();
      const cx = e.touches[0].clientX - r.left;
      const cy = e.touches[0].clientY - r.top;
      coin.rotation.y += (cx - prev.x) * 0.014;
      coin.rotation.x += (cy - prev.y) * 0.014;
      prev = { x:cx, y:cy };
      e.preventDefault();
    }, { passive:false });
    canvas.addEventListener('touchend', () => { drag = false; });

    /* ── Boucle de rendu ── */
    (function loop() {
      requestAnimationFrame(loop);
      if (!drag) coin.rotation.y += 0.005;
      renderer.render(scene, camera);
    })();
  }

  return { init };
})();


/* ══════════════════════════════════════════════════
   INIT — Blocage clic droit et démarrage
   ══════════════════════════════════════════════════ */
document.addEventListener('contextmenu', e => e.preventDefault());

// Démarrage sur l'écran titre
showScreen('screen-title');
