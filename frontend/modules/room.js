import { openModal } from './modal.js';

const DEBUG = false;

const screenRoom = document.getElementById('screen-room');

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

export function buildHotspots() {
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
    el.addEventListener('click', () => openModal(h.id));
    screenRoom.appendChild(el);
  });
}
