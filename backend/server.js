/**
 * server.js — Serveur Express pour "Claude m'a tuer"
 * Sert les fichiers statiques du dossier frontend/ et expose
 * deux routes API pour la validation des codes (logique côté serveur).
 */

const express = require('express');
const cors    = require('cors');
const path    = require('path');

const app  = express();
const PORT = process.env.PORT || 3000;

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// Sert tous les fichiers statiques depuis le dossier frontend/
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// ─── Route : Racine ───────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

// ─── Route API : Vérification du code du casier ───────────────────────────────
// Réponse HTTP 200 avec { success: true/false }
// Le code correct est "7294" (tri chronologique du ticket IT)
app.post('/api/verify-locker', (req, res) => {
  const { code } = req.body;

  // Délai artificiel pour simuler un vrai serveur et renforcer la tension
  setTimeout(() => {
    if (code === '7294') {
      console.log(`[${new Date().toLocaleTimeString()}] ✅ Casier ouvert ! Code correct.`);
      return res.json({ success: true, message: 'Casier déverrouillé.' });
    }
    console.log(`[${new Date().toLocaleTimeString()}] ❌ Mauvais code casier : ${code}`);
    return res.json({ success: false, message: 'Code incorrect.' });
  }, 300);
});

// ─── Route API : Vérification du PIN d'annulation ─────────────────────────────
// Le PIN correct est "1895"
// Logique de déduction :
//   Post-it: "tuer" (4 lettres) vs "tué" (3 lettres) → clé César = +7
//   Jeton 3D: T=4, U=1, E=2, R=8 → code intermédiaire "4128"
//   César +7 (mod 10): 4→1, 1→8, 2→9, 8→5 → PIN final = "1895"
app.post('/api/verify-pin', (req, res) => {
  const { pin } = req.body;

  setTimeout(() => {
    if (pin === '1895') {
      console.log(`[${new Date().toLocaleTimeString()}] ✅ PIN CORRECT ! Malware annulé. Victoire.`);
      return res.json({ success: true, message: 'Malware annulé. Système restauré.' });
    }
    console.log(`[${new Date().toLocaleTimeString()}] ❌ Mauvais PIN : ${pin}`);
    return res.json({ success: false, message: 'PIN incorrect. Tentative enregistrée.' });
  }, 400);
});

// ─── Démarrage du serveur ─────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log('');
  console.log('  ╔════════════════════════════════════════╗');
  console.log('  ║   🔴 NOVATECH — SYSTÈME COMPROMIS      ║');
  console.log('  ║   Escape Room "Claude m\'a tuer"        ║');
  console.log(`  ║   Serveur actif → http://localhost:${PORT}  ║`);
  console.log('  ╚════════════════════════════════════════╝');
  console.log('');
});
