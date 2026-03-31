import { STATE } from './state.js';
import { formatTimer, startRoomTimer, updateTerminalTimer } from './timer.js';
import { triggerVictory } from './victory.js';

const modalOverlay = document.getElementById('modal-overlay');
const modalContent = document.getElementById('modal-content');
const modalClose = document.getElementById('modal-close');

export function closeModal() {
  modalOverlay.classList.remove('open');
  modalContent.innerHTML = '';
}

export function openModal(id) {
  modalContent.innerHTML = buildModalContent(id);
  modalOverlay.classList.add('open');
  attachModalListeners(id);

  if (id === 'pc') {
    startRoomTimer();
    updateTerminalTimer();
  }
}

export function initModal() {
  modalClose.addEventListener('click', closeModal);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
  modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) closeModal(); });
}

/* ─ CONTENU DES MODALES ─ */
function buildModalContent(id) {
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
      if (val === 'LAJP') {
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
