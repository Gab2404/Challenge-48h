import { initCall }    from './modules/call.js';
import { initModal }   from './modules/modal.js';
import { initVictory } from './modules/victory.js';

document.addEventListener('DOMContentLoaded', () => {
  initCall();
  initModal();
  initVictory();
});
