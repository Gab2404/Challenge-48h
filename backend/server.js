const express = require('express');
const path    = require('path');
const app     = express();
const PORT    = process.env.PORT || 3000;

// Servir le dossier frontend en statique
app.use(express.static(path.join(__dirname, '../frontend')));

// Fallback SPA — renvoie index.html pour toute route inconnue
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`[NovaTech] Serveur actif → http://localhost:${PORT}`);
});
