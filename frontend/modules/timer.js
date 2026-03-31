import { STATE } from './state.js';

export function formatTimer(s) {
  const m = String(Math.floor(s / 60)).padStart(2, '0');
  const sec = String(s % 60).padStart(2, '0');
  return m + ':' + sec;
}

export function startRoomTimer() {
  if (STATE.timerActif) return;
  STATE.timerActif = true;
  const hudTimer = document.getElementById('hud-timer');
  STATE.timerInterval = setInterval(() => {
    STATE.timerSecondes--;
    hudTimer.textContent = formatTimer(STATE.timerSecondes);
    if (STATE.timerSecondes < 60) hudTimer.classList.add('danger');
    if (STATE.timerSecondes <= 0) {
      clearInterval(STATE.timerInterval);
      hudTimer.textContent = '00:00';
    }
  }, 1000);
}

export function updateTerminalTimer() {
  const tick = setInterval(() => {
    const el = document.getElementById('modal-timer-val');
    if (!el) { clearInterval(tick); return; }
    el.textContent = formatTimer(STATE.timerSecondes);
  }, 1000);
}
