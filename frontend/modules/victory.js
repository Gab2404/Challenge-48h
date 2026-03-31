import { goToScreen } from './screens.js';
import { STATE } from './state.js';

export function triggerVictory() {
  clearInterval(STATE.timerInterval);
  STATE.timerActif = false;
  const screenRoom = document.getElementById('screen-room');
  const screenVictory = document.getElementById('screen-victory');
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

export function initVictory() {
  document.getElementById('btn-rejouer').addEventListener('click', () => window.location.reload());
}
