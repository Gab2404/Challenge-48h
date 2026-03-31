const screenMenu = document.getElementById('screen-menu');
const screenCall = document.getElementById('screen-call');
const btnPlay = document.getElementById('btn-play');
const btnSuivant = document.getElementById('btn-suivant');
const waveformEl = document.getElementById('waveform');
const transcriptEl = document.getElementById('transcript-text');
const durationEl = document.getElementById('call-duration');

const TRANSCRIPT = "Allô\u00a0? C'est Max... Dis, tu peux passer chez Arthur\u00a0? Il a été viré ce matin, NovaTech a tout remplacé par cette IA, Claude. Je l'ai eu au téléphone, il était en boucle, il parlait de tout faire sauter... Son appart est ouvert mais il ne répond plus. Va voir s'il te plaît\u00a0!";

const TYPING_SPEED = 36;
let callTimerInterval = null;
let callSeconds = 0;

/* Transition entre écrans */
function goToScreen(from, to) {
  from.classList.add('fade-out');
  setTimeout(() => {
    from.classList.remove('active', 'fade-out');
    to.classList.add('active');
  }, 600);
}

/* Écran 1 → Écran 2 */
btnPlay.addEventListener('click', () => {
  goToScreen(screenMenu, screenCall);
  setTimeout(() => {
    buildWaveform();
    startCallTimer();
    startTyping();
  }, 750);
});

/* Waveform */
function buildWaveform() {
  waveformEl.innerHTML = '';
  const style = document.createElement('style');
  style.textContent = `@keyframes wa { from { transform: scaleY(1); } to { transform: scaleY(0.08); } }`;
  document.head.appendChild(style);
  for (let i = 0; i < 40; i++) {
    const bar = document.createElement('div');
    bar.className = 'wave-bar';
    bar.style.height = (Math.random() * 24 + 4) + 'px';
    const dur = (Math.random() * 0.45 + 0.2).toFixed(2);
    const del = (Math.random() * 0.5).toFixed(2);
    bar.style.animation = `wa ${dur}s ease-in-out ${del}s infinite alternate`;
    waveformEl.appendChild(bar);
  }
}

/* Chronomètre */
function startCallTimer() {
  callSeconds = 0;
  clearInterval(callTimerInterval);
  callTimerInterval = setInterval(() => {
    callSeconds++;
    const m = String(Math.floor(callSeconds / 60)).padStart(2, '0');
    const s = String(callSeconds % 60).padStart(2, '0');
    durationEl.textContent = m + ':' + s;
  }, 1000);
}

/* Machine à écrire */
function startTyping() {
  let index = 0;
  transcriptEl.innerHTML = '<span class="cursor-blink"></span>';
  const interval = setInterval(() => {
    if (index < TRANSCRIPT.length) {
      transcriptEl.innerHTML =
        TRANSCRIPT.slice(0, index + 1) +
        '<span class="cursor-blink"></span>';
      index++;
    } else {
      clearInterval(interval);
      setTimeout(() => {
        transcriptEl.innerHTML = TRANSCRIPT;
        btnSuivant.classList.add('visible');
      }, 600);
    }
  }, TYPING_SPEED);
}

/* ═══════════════════════════════════════════════════════════
   ÉCRANS 3 & 4 — LOGIQUE COMPLÈTE
═══════════════════════════════════════════════════════════ */

const DEBUG = false;

const STATE = {
  casierOuvert: false,
  jetonRecupere: false,
  timerInterval: null,
  timerSecondes: 10,
  timerActif: false,
  tentativesTerminal: 0
};

const screenRoom = document.getElementById('screen-room');
const screenVictory = document.getElementById('screen-victory');
const hudTimer = document.getElementById('hud-timer');
const modalOverlay = document.getElementById('modal-overlay');
const modalContent = document.getElementById('modal-content');
const modalClose = document.getElementById('modal-close');

/* ─ HOTSPOTS CONFIG ─ */
const HOTSPOTS = [
  // PC laptop — écran orange, centre-droit du bureau
  { id: 'pc', top: '47%', left: '67%', width: '13%', height: '19%' },
  // Corbeille — sol devant bureau (pas sous la TV)
  { id: 'corbeille', top: '77%', left: '38%', width: '11%', height: '13%' },
  // Cadenas + bouteille — extrême droite
  { id: 'cadenas', top: '50%', left: '83%', width: '15%', height: '23%' },
  // Disques durs — empilés sur le bureau, à gauche du PC
  { id: 'disques', top: '48%', left: '52%', width: '10%', height: '16%' },
  // Livre Mastering JS — bureau droite, bord bas
  { id: 'livre', top: '73%', left: '75%', width: '15%', height: '10%' },
  // TV brisée — gauche centre, sur meuble TV uniquement
  { id: 'tv', top: '40%', left: '37%', width: '9%', height: '18%' },
  // Tableau Jules César — portrait haut-droit, cadre complet
  { id: 'tableau', top: '2%', left: '74%', width: '15%', height: '37%' },
  // Message mural — "Claude m'a tuer", couvre tout le texte
  { id: 'message', top: '21%', left: '42%', width: '25%', height: '17%' },
  // Casier métallique — mur gauche (décalé du bord browser)
  { id: 'casier', top: '25%', left: '8%', width: '9%', height: '28%' },
  // Canapé — bas gauche, après le casier
  { id: 'canape', top: '50%', left: '3%', width: '15%', height: '28%' },
  // Table basse — sol centre-gauche (la ronde avec nourriture)
  { id: 'table', top: '55%', left: '23%', width: '10%', height: '15%' },
  // Lumière — ampoule plafond haut centre
  { id: 'lumiere', top: '0%', left: '27%', width: '6%', height: '18%' }
];

function buildHotspots() {
  HOTSPOTS.forEach(h => {
    const el = document.createElement('div');
    el.id = 'hs-' + h.id;
    el.className = 'hotspot';
    el.style.top = h.top;
    el.style.left = h.left;
    el.style.width = h.width;
    el.style.height = h.height;
    el.style.cursor = h.cursor || 'pointer';
    if (h.cssExtra) el.style.cssText += h.cssExtra;
    if (DEBUG) {
      el.style.background = 'rgba(255,0,0,0.35)';
      el.style.display = 'flex';
      el.style.alignItems = 'center';
      el.style.justifyContent = 'center';
      el.style.color = '#fff';
      el.style.fontSize = '10px';
      el.style.fontFamily = 'Share Tech Mono, monospace';
      el.textContent = h.id;
    }
    el.addEventListener('click', () => {
      if (h.id in SUBTITLE_CONTENT) {
        showSubtitle(h.id);
      } else {
        openModal(h.id);
      }
    });
    screenRoom.appendChild(el);
  });
}

/* ─ TIMER HUD ─ */
function formatTimer(s) {
  const m = String(Math.floor(s / 60)).padStart(2, '0');
  const sec = String(s % 60).padStart(2, '0');
  return m + ':' + sec;
}

function startRoomTimer() {
  if (STATE.timerActif) return;
  STATE.timerActif = true;
  STATE.timerInterval = setInterval(() => {
    STATE.timerSecondes--;
    hudTimer.textContent = formatTimer(STATE.timerSecondes);
    if (STATE.timerSecondes < 60) hudTimer.classList.add('danger');
    if (STATE.timerSecondes <= 0) {
      clearInterval(STATE.timerInterval);
      hudTimer.textContent = '00:00';
      closeModal();
      triggerDefeat();
    }
  }, 1000);
}

/* ─ MODALE ─ */
function openModal(id) {
  modalContent.innerHTML = buildModalContent(id);
  modalOverlay.classList.add('open');
  attachModalListeners(id);

  if (id === 'pc') {
    startRoomTimer();
    updateTerminalTimer();
  }
}

function closeModal() {
  modalOverlay.classList.remove('open');
  modalContent.innerHTML = '';
}

modalClose.addEventListener('click', closeModal);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) closeModal(); });

/* ─ CONTENU DES MODALES ─ */
function buildModalContent(id) {
  // Mise à jour du label du header
  const labelMap = {
    pc: 'TERMINAL — MALWARE ACTIF',
    corbeille: 'DOCUMENTS — CORBEILLE',
    cadenas: 'OBJET — CADENAS',
    disques: 'OBJET — DISQUES DURS',
    livre: 'OBJET — LIVRE DE CODE',
    tv: 'OBJET — TÉLÉVISION',
    tableau: 'INDICE — TABLEAU MURAL',
    message: 'INDICE — MESSAGE MUR',
    casier: 'ACCÈS — CASIER SÉCURISÉ',
    canape: 'ENVIRONNEMENT — CANAPÉ',
    table: 'ENVIRONNEMENT — TABLE',
    lumiere: 'ENVIRONNEMENT — LUMIÈRE',
    jeton: 'OBJET — JETON MÉTALLIQUE',
  };
  const headerLabel = document.getElementById('modal-header-label');
  if (headerLabel) headerLabel.textContent = 'SYS://NOVATECH — ' + (labelMap[id] || 'OBJET INSPECTÉ');

  switch (id) {

    case 'pc': return `
      <div class="terminal-window">
        <div class="terminal-topbar">
          <div class="terminal-dot red"></div>
          <div class="terminal-dot orng"></div>
          <div class="terminal-dot grey"></div>
          <div class="terminal-title-bar">NOVATECH_UPLOADER.exe</div>
        </div>
        <div class="terminal-body">
          <div class="terminal-header">SYS://NOVATECH — MALWARE UPLOAD IN PROGRESS<span class="blink-cursor"></span></div>
          <div class="progress-bar-wrap"><div class="progress-bar-fill"></div></div>
          <div class="progress-label"><span>[████████░░░░] 68%</span><span>12.4 MB/s</span></div>
          <div class="timer-display">TEMPS RESTANT : <span id="modal-timer-val">${formatTimer(STATE.timerSecondes)}</span></div>
          <div class="terminal-prompt"><span>root@novatech</span>:~# entrez le code d'annulation :</div>
          <div class="terminal-input-row">
            <input type="text" id="terminal-input" maxlength="4" autocomplete="off" spellcheck="false" placeholder="_ _ _ _" />
            <button id="btn-valider">VALIDER</button>
          </div>
          <div class="terminal-error" id="terminal-error"></div>
        </div>
      </div>`;

    case 'corbeille': return `
      <div class="modal-title">Corbeille — Documents récupérés</div>
      <div class="doc-paper">
        <div class="doc-label">Lettre de licenciement · NovaTech RH · confidentiel</div>
        <div class="lettre-rh">
          <strong>Objet : Notification de fin de contrat</strong>
          Monsieur,<br>
          Suite à notre entretien de ce matin, nous vous confirmons la fin de votre contrat au sein de NovaTech.
          Notre récente transition vers l'intelligence artificielle "Claude" nous permet d'automatiser l'intégralité
          de notre pipeline de développement.<br><br>
          L'IA est plus rapide et ne commet pas d'erreurs. Nous n'avons plus besoin d'intervention humaine.
          Votre matériel doit être restitué avant ce soir.
        </div>
      </div>
      <div class="log-sep">Log d'exécution automatique</div>
      <div class="log-terminal">
        <span class="log-line"><span class="log-time">[AUTO-SCRIPT]</span> <span class="log-keyword">PROCÉDURE D'OFFBOARDING TERMINÉE</span></span>
        <span class="log-line"><span class="log-time">[11:42]</span> <span class="log-action">—</span> Dépôt Git des <span class="log-keyword">interfaces et feuilles de style</span> verrouillé.</span>
        <span class="log-line"><span class="log-time">[10:04]</span> <span class="log-action">—</span> Accès VPN et configuration du <span class="log-keyword">Pare-feu</span> révoqués.</span>
        <span class="log-line"><span class="log-time">[11:05]</span> <span class="log-action">—</span> Clés API et droits d'écriture sur le <span class="log-keyword">Serveur Node.js</span> invalidés.</span>
        <span class="log-line"><span class="log-time">[10:22]</span> <span class="log-action">—</span> Identifiants d'administration des <span class="log-keyword">Clusters SQL</span> supprimés.</span>
      </div>`;

    case 'cadenas': return `
      <div class="modal-title">Cadenas</div>
      <div class="bottle-modal-desc">Un gros cadenas rouillé. Une bouteille posée contre.<br>Le chiffre est gravé au feutre sur le verre.</div>
      <div class="modal-big-number" data-n="4">4</div>
      <div class="bottle-engraved">· gravé dans le verre ·</div>`;

    case 'disques': return `
      <div class="modal-title">Disques durs</div>
      <div class="bottle-modal-desc">Des disques durs empilés sur le bureau.<br>Une bouteille posée dessus, comme un trophée morbide.</div>
      <div class="modal-big-number" data-n="2">2</div>
      <div class="bottle-engraved">· gravé dans le verre ·</div>`;

    case 'livre': return `
      <div class="modal-title">Mastering JavaScript</div>
      <div class="bottle-modal-desc">Un vieux bouquin de dev. Une bouteille vide<br>coincée entre les pages, chiffre gravé dans le verre.</div>
      <div class="modal-big-number" data-n="9">9</div>
      <div class="bottle-engraved">· gravé dans le verre ·</div>`;

    case 'tv': return `
      <div class="modal-title">TV brisée</div>
      <div class="bottle-modal-desc">L'écran est défoncé. Une bouteille y est encastrée.<br>Chiffre gravé dans le verre :</div>
      <div class="modal-big-number" data-n="1">1</div>
      <div class="bottle-engraved">· gravé dans le verre ·</div>`;

    case 'tableau': return `
      <div class="modal-title">Portrait — Jules César</div>
      <div class="cesar-frame">
        <div class="portrait-placeholder">
          <div class="portrait-icon">👑</div>
          <div class="portrait-sub">Peinture — huile sur toile</div>
        </div>
      </div>
      <div class="cesar-formula">A → <span>A + n</span></div>
      <div class="cesar-hint-text">le décalage est la clé</div>`;

    case 'message': return `
      <div class="modal-title">Message — Mur</div>
      <div class="message-container">
        <div class="message-zoom">Claude m'a tuer</div>
        <div class="message-sub">écrit à la main — mur du salon</div>
      </div>
      <div class="message-meta">— une faute. intentionnelle ?</div>`;

    case 'casier': return buildCasierContent();

    case 'canape': return `
      <div class="modal-title">Canapé</div>
      <div class="modal-mono">Vêtements d'hier froissés sur l'accoudoir.<br>Des restes de nouilles froides dans une boîte.<br>La déprime totale.</div>`;

    case 'table': return `
      <div class="modal-title">Table basse</div>
      <div class="modal-mono">Encore des emballages de fast-food.<br>Des cadavres de bouteilles. Ça ne m'aidera pas.</div>`;

    case 'lumiere': return `
      <div class="modal-title">Lumière</div>
      <div class="modal-mono flicker">Ce faux contact me tape sur le système...<br>L'ampoule clignote depuis des heures.</div>`;

    case 'jeton': return buildJetonContent();

    default: return '<div class="modal-mono">...</div>';
  }
}

function buildCasierContent() {
  if (!STATE.casierOuvert) {
    return `
      <div class="modal-title">Casier — Accès sécurisé</div>
      <div class="modal-mono">Entrez le code à 4 chiffres pour déverrouiller :</div>
      <div class="casier-inputs" id="casier-inputs-wrap">
        <input class="casier-digit" id="cd0" type="text" maxlength="1" inputmode="numeric" />
        <input class="casier-digit" id="cd1" type="text" maxlength="1" inputmode="numeric" />
        <input class="casier-digit" id="cd2" type="text" maxlength="1" inputmode="numeric" />
        <input class="casier-digit" id="cd3" type="text" maxlength="1" inputmode="numeric" />
      </div>
      <div class="casier-error" id="casier-error"></div>
      <div class="casier-hint">▸ code à 4 chiffres</div>`;
  } else {
    if (!STATE.jetonRecupere) {
      return `
        <div class="modal-title">Casier — Déverrouillé</div>
        <div class="modal-mono" style="margin-bottom:8px;">Quelque chose brille à l'intérieur...</div>
        <div class="jeton-pickup-wrap">
          <div class="jeton-pickup" id="jeton-pickup-btn">JETON<br>MÉTALLIQUE</div>
          <div class="jeton-pickup-label">cliquer pour ramasser</div>
        </div>`;
    } else {
      return `
        <div class="modal-title">Casier — Déverrouillé</div>
        <div class="modal-mono" style="color:rgba(232,230,223,0.25);margin-bottom:24px;">Le casier est vide.</div>
        <button id="btn-revoir-jeton" style="font-family:'Share Tech Mono',monospace;font-size:10px;letter-spacing:4px;background:transparent;border:1px solid rgba(217,119,87,0.3);color:rgba(217,119,87,0.7);padding:12px 24px;cursor:pointer;transition:all 0.2s;display:block;margin:0 auto;" onmouseover="this.style.background='rgba(217,119,87,0.1)';this.style.borderColor='rgba(217,119,87,0.6)'" onmouseout="this.style.background='transparent';this.style.borderColor='rgba(217,119,87,0.3)'">▸ REVOIR LE JETON</button>`;
    }
  }
}

function buildJetonContent() {
  return `
    <div class="modal-title">Jeton métallique</div>
    <div class="jeton-scene">
      <div class="jeton-glow-ring"></div>
      <div class="jeton-wrap">
        <div class="jeton-inner">
          <div class="jeton-face jeton-recto">
            <div class="jeton-recto-inner">
              <div class="jeton-arc-top">NOVATECH · 2024</div>
              <div class="jeton-numbers">4 · 2 · 9 · 1</div>
              <div class="jeton-arc-bot">· · · · · · · ·</div>
            </div>
          </div>
          <div class="jeton-face jeton-verso">
            <div class="jeton-verso-inner">
              <div class="jeton-arc-top">— ARTHUR —</div>
              <div class="jeton-letters">A·R·T·H</div>
              <div class="jeton-arc-bot">∞</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="jeton-legend">
      4 = A &nbsp;&nbsp;&nbsp; 2 = R &nbsp;&nbsp;&nbsp; 9 = T &nbsp;&nbsp;&nbsp; 1 = H
    </div>`;
}

/* ─ LISTENERS MODALES ─ */
function attachModalListeners(id) {
  if (id === 'pc') {
    const inp = document.getElementById('terminal-input');
    const btn = document.getElementById('btn-valider');
    const errEl = document.getElementById('terminal-error');
    function validateTerminal() {
      const val = inp.value.trim().toUpperCase();
      if (val === 'PENT') {
        closeModal();
        triggerVictory();
      } else {
        STATE.tentativesTerminal++;
        errEl.textContent = `[ ACCÈS REFUSÉ — TENTATIVE ${STATE.tentativesTerminal}/∞ ]`;
        errEl.classList.add('show');
        inp.value = '';
        inp.focus();
        // petit flash sur l'input
        inp.style.borderColor = 'rgba(192,57,43,0.8)';
        setTimeout(() => { inp.style.borderColor = ''; }, 600);
      }
    }
    btn.addEventListener('click', validateTerminal);
    inp.addEventListener('keydown', e => { if (e.key === 'Enter') validateTerminal(); });
    inp.focus();
  }

  if (id === 'casier' && !STATE.casierOuvert) {
    const digits = [0, 1, 2, 3].map(i => document.getElementById('cd' + i));
    const errEl = document.getElementById('casier-error');
    const wrap = document.getElementById('casier-inputs-wrap');
    digits[0].focus();
    digits.forEach((inp, i) => {
      inp.addEventListener('input', () => {
        inp.value = inp.value.replace(/[^0-9]/g, '').slice(0, 1);
        if (inp.value && i < 3) digits[i + 1].focus();
        if (i === 3 && inp.value) {
          const code = digits.map(d => d.value).join('');
          if (code === '4291') {
            STATE.casierOuvert = true;
            closeModal();
            setTimeout(() => openModal('casier'), 200);
          } else {
            errEl.textContent = '[ CODE INCORRECT ]';
            errEl.classList.add('show');
            if (wrap) {
              wrap.classList.add('shake');
              setTimeout(() => wrap.classList.remove('shake'), 500);
            }
            digits.forEach(d => d.value = '');
            digits[0].focus();
          }
        }
      });
      inp.addEventListener('keydown', e => {
        if (e.key === 'Backspace' && !inp.value && i > 0) digits[i - 1].focus();
      });
    });
  }

  if (id === 'casier' && STATE.casierOuvert && !STATE.jetonRecupere) {
    const jetonBtn = document.getElementById('jeton-pickup-btn');
    if (jetonBtn) {
      jetonBtn.addEventListener('click', () => {
        STATE.jetonRecupere = true;
        closeModal();
        setTimeout(() => openModal('jeton'), 200);
      });
    }
  }

  if (id === 'casier' && STATE.casierOuvert && STATE.jetonRecupere) {
    const revoir = document.getElementById('btn-revoir-jeton');
    if (revoir) {
      revoir.addEventListener('click', () => {
        closeModal();
        setTimeout(() => openModal('jeton'), 150);
      });
    }
  }
}

/* ─ SOUS-TITRES CINÉMATOGRAPHIQUES ─ */
const subtitleBar  = document.getElementById('subtitle-bar');
const subtitleText = document.getElementById('subtitle-text');
const subtitleSpkr = document.getElementById('subtitle-speaker');

let subtitleTypingInterval = null;
let subtitleHideTimeout    = null;

// Textes des sous-titres (voix intérieure du joueur)
const SUBTITLE_CONTENT = {
  lumiere: {
    speaker: '— narrateur —',
    text: "Ce faux contact me tape sur le système… L'ampoule clignote depuis des heures. Arthur devait détester ça.",
    flicker: true
  },
  canape: {
    speaker: '— narrateur —',
    text: "Vêtements d'hier froissés sur l'accoudoir. Des restes de nouilles froides dans une boîte. La déprime totale."
  },
  table: {
    speaker: '— narrateur —',
    text: "Encore des emballages de fast-food. Des cadavres de bouteilles. Ça ne m'aidera pas."
  },
  tv: {
    speaker: '— narrateur —',
    text: "L'écran est défoncé. Une bouteille y est encastrée — chiffre gravé dans le verre : 1."
  },
  livre: {
    speaker: '— narrateur —',
    text: "Mastering JavaScript. Un vieux bouquin de dev. Entre les pages, une bouteille vide. Chiffre gravé : 9."
  },
  tableau: {
    speaker: '— narrateur —',
    text: "Portrait de Jules César."
  },
  message: {
    speaker: '— narrateur —',
    text: "« Claude m'a tuer » — écrit à la main sur le mur. Une faute. Intentionnelle ?"
  },
  cadenas: {
    speaker: '— narrateur —',
    text: "Un gros cadenas rouillé. Une bouteille posée contre le mur — chiffre gravé dans le verre : 4."
  },
  disques: {
    speaker: '— narrateur —',
    text: "Des disques durs empilés. Une bouteille trône dessus, comme un trophée morbide. Chiffre gravé : 2."
  }
};

function showSubtitle(id) {
  const data = SUBTITLE_CONTENT[id];
  if (!data) return;

  // Annuler tout en cours
  clearInterval(subtitleTypingInterval);
  clearTimeout(subtitleHideTimeout);

  // Réinitialiser les classes
  subtitleBar.className = '';
  subtitleBar.classList.add('visible');
  if (data.flicker) subtitleBar.classList.add('flicker-mode');

  subtitleSpkr.textContent = data.speaker || '';

  // Machine à écrire
  let i = 0;
  subtitleText.innerHTML = '<span class="sub-cursor"></span>';
  subtitleTypingInterval = setInterval(() => {
    if (i < data.text.length) {
      subtitleText.innerHTML =
        data.text.slice(0, i + 1) + '<span class="sub-cursor"></span>';
      i++;
    } else {
      clearInterval(subtitleTypingInterval);
      // Masquer après lecture estimée (40 ms/char + 2 s de buffer)
      const readTime = Math.max(2800, data.text.length * 42 + 2000);
      subtitleHideTimeout = setTimeout(hideSubtitle, readTime);
    }
  }, 30);
}

function hideSubtitle() {
  subtitleBar.classList.remove('visible');
  setTimeout(() => {
    subtitleText.innerHTML  = '';
    subtitleSpkr.textContent = '';
    subtitleBar.classList.remove('flicker-mode');
  }, 380);
}

// Clic sur la salle = ferme les sous-titres
screenRoom.addEventListener('click', e => {
  if (e.target === screenRoom) hideSubtitle();
});


function updateTerminalTimer() {
  const tick = setInterval(() => {
    const el = document.getElementById('modal-timer-val');
    if (!el) { clearInterval(tick); return; }
    el.textContent = formatTimer(STATE.timerSecondes);
  }, 1000);
}

/* ─ VICTOIRE ─ */
function triggerVictory() {
  clearInterval(STATE.timerInterval);
  STATE.timerActif = false;
  goToScreen(screenRoom, screenVictory);
  const lines = ['vl1', 'vl2', 'vl3', 'vl4'];
  lines.forEach((id, i) => {
    setTimeout(() => {
      document.getElementById(id).classList.add('show');
    }, 400 + i * 600);
  });
  const barWrap = document.getElementById('victory-bar-wrap');
  const barFill = document.getElementById('victory-bar-fill');
  const btnRej = document.getElementById('btn-rejouer');
  setTimeout(() => {
    barWrap.classList.add('show');
    setTimeout(() => barFill.classList.add('go'), 100);
  }, 400 + lines.length * 600);
  setTimeout(() => btnRej.classList.add('show'), 400 + lines.length * 600 + 2400);
}

document.getElementById('btn-rejouer').addEventListener('click', () => window.location.reload());

/* ─ DÉFAITE ─ */
function triggerDefeat() {
  clearInterval(STATE.timerInterval);
  STATE.timerActif = false;
  const screenDefeat = document.getElementById('screen-defeat');
  goToScreen(screenRoom, screenDefeat);
  const lines = ['dl1', 'dl2', 'dl3', 'dl4'];
  lines.forEach((id, i) => {
    setTimeout(() => {
      document.getElementById(id).classList.add('show');
    }, 400 + i * 600);
  });
  const barWrap = document.getElementById('defeat-bar-wrap');
  const barFill = document.getElementById('defeat-bar-fill');
  const btnRej = document.getElementById('btn-rejouer-defaite');
  setTimeout(() => {
    barWrap.classList.add('show');
    setTimeout(() => barFill.classList.add('go'), 100);
  }, 400 + lines.length * 600);
  setTimeout(() => btnRej.classList.add('show'), 400 + lines.length * 600 + 2400);
}

document.getElementById('btn-rejouer-defaite').addEventListener('click', () => window.location.reload());

/* Écran 2 → Écran 3 */
btnSuivant.addEventListener('click', () => {
  clearInterval(callTimerInterval);
  goToScreen(screenCall, screenRoom);
  buildHotspots();
  window.startRoomFlicker();
  try {
    const ambiance = new Audio('assets/audio/ventilation.mp3');
    ambiance.loop = true;
    ambiance.volume = 0.3;
    ambiance.play();
  } catch (e) { /* pas de fichier audio — silencieux */ }
});

/* ══════════════════════════════════════════
   FLICKER ENGINE — ampoule défaillante
══════════════════════════════════════════ */
(function initFlicker() {
  const overlay = document.getElementById('flicker-overlay');
  if (!overlay) return;

  let spikeTimeout = null;

  function startIdleFlicker() {
    overlay.classList.remove('spiking');
    overlay.classList.add('idle');
  }

  function triggerSpike() {
    overlay.classList.remove('idle');
    overlay.classList.add('spiking');
    overlay.addEventListener('animationend', () => {
      overlay.classList.remove('spiking');
      overlay.classList.add('idle');
      scheduleNextSpike();
    }, { once: true });
  }

  function scheduleNextSpike() {
    const delay = 10000 + Math.random() * 12000;
    spikeTimeout = setTimeout(triggerSpike, delay);
  }

  window.startRoomFlicker = function () {
    startIdleFlicker();
    scheduleNextSpike();
  };

  window.stopRoomFlicker = function () {
    clearTimeout(spikeTimeout);
    overlay.classList.remove('idle', 'spiking');
  };
})();