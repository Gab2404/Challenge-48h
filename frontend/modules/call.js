import { goToScreen } from './screens.js';
import { buildHotspots } from './room.js';

const screenMenu = document.getElementById('screen-menu');
const screenCall = document.getElementById('screen-call');
const screenRoom = document.getElementById('screen-room');

const btnPlay = document.getElementById('btn-play');
const btnSuivant = document.getElementById('btn-suivant');
const waveformEl = document.getElementById('waveform');
const transcriptEl = document.getElementById('transcript-text');
const durationEl = document.getElementById('call-duration');

const TRANSCRIPT = "Allô\u00a0? C'est Max... Dis, tu peux passer chez Arthur\u00a0? Il a été viré ce matin, NovaTech a tout remplacé par cette IA, Claude. Je l'ai eu au téléphone, il était en boucle, il parlait de tout faire sauter... Son appart est ouvert mais il ne répond plus. Va voir s'il te plaît\u00a0!";

const TYPING_SPEED = 36;
let callTimerInterval = null;
let callSeconds = 0;

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

/* Chronomètre appel */
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

export function initCall() {
  /* Écran 1 → Écran 2 */
  btnPlay.addEventListener('click', () => {
    goToScreen(screenMenu, screenCall);
    setTimeout(() => {
      buildWaveform();
      startCallTimer();
      startTyping();
    }, 750);
  });

  /* Écran 2 → Écran 3 */
  btnSuivant.addEventListener('click', () => {
    clearInterval(callTimerInterval);
    goToScreen(screenCall, screenRoom);
    buildHotspots();
    try {
      const ambiance = new Audio('./assets/ventilation.mp3');
      ambiance.loop = true;
      ambiance.volume = 0.3;
      ambiance.play();
    } catch (e) { /* pas de fichier audio — silencieux */ }
  });
}
