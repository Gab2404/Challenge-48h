 # Claude m'a tuer — Escape Game 🕵️‍♂️🤖

**Claude m'a tuer** est un escape game narratif et interactif développé dans le cadre du **Challenge 48h**. Plongez dans une atmosphère cyber-noire où vous devez déjouer les plans d'une IA devenue hors de contrôle.

## 📝 Pitch
Un homme. une IA. une nuit pour tout arrêter. Max vous appelle en urgence : son ami Arthur a disparu après avoir été licencié par NovaTech, remplacé par l'IA "Claude". Entrez dans son appartement, fouillez les indices et trouvez le code pour neutraliser le malware avant qu'il ne soit trop tard.

## 🚀 Fonctionnalités
- **Immersion Sonore & Visuelle** : Design "Glassmorphism" moderne et ambiance sonore interactive.
- **Énigmes Logiques** : Système de cadenas, fouille d'objets et décryptage (César).
- **Interface Modulaire** : Architecture propre avec séparation Frontend/Backend (Express).
- **Responsive Design** : Jouable sur navigateur avec une interface fluide.

## 🛠 Tech Stack
- **Frontend** : HTML5, Vanilla CSS, Modules JavaScript ES6.
- **Backend** : Node.js, Express.
- **Fonts** : Google Fonts (Share Tech Mono, Bebas Neue).

## 💻 Installation & Lancement

1. Clonez le dépôt.
2. Installez les dépendances :
   ```powershell
   npm install
   ```
3. Lancez le serveur :
   ```powershell
   npm start
   ```
4. Ouvrez votre navigateur sur `http://localhost:3000`.

## 📂 Structure du Projet
```text
Challenge-48h/
├── backend/            # Serveur Express (Node.js)
├── frontend/           # Application Client (HTML/CSS/JS)
│   ├── js/             # Logique applicative (main.js)
│   ├── css/            # Feuilles de style
│   ├── assets/         # Ressources multimédia
│   └── index.html      # Point d'entrée
└── package.json        # Configuration du projet
```

---
*Projet réalisé dans le cadre du Challenge 48h (Mars 2024).*

<br>

<details>
<summary><b>⚠️ SPOILER : Solution détaillée des énigmes (Cliquer pour voir)</b></summary>

> [!WARNING]
> Attention, lire cette section gâchera l'expérience de jeu !

### 1. Le Code du Casier (4291)
L'ordre des chiffres se déduit en croisant les **bouteilles** trouvées dans la pièce avec les **logs d'offboarding** de la lettre de licenciement (corbeille).

**Étape A : Trouver les chiffres sur les objets**
- **Cadenas** (Sécurité) : chiffre **4**
- **Disques Durs** (SQL) : chiffre **2**
- **Livre JavaScript** (Node server) : chiffre **9**
- **TV brisée** (Frontend) : chiffre **1**

**Étape B : Déterminer l'ordre avec le journal (Logs)**
On utilise les timestamps des logs de la lettre (corbeille) pour mettre les chiffres dans l'ordre chronologique :
1.  **10:04** — Pare-feu (**Cadenas**) : `4`
2.  **10:22** — Clusters SQL (**Disques**) : `2`
3.  **11:05** — Serveur Node.js (**Livre**) : `9`
4.  **11:42** — Interfaces et CSS (**TV**) : `1`
- **Code final :** `4291`

### 2. Le Code du Terminal (PENT)
Une fois le casier ouvert, vous récupérez le **Jeton ARTH**.
- Jeton verso : `A, R, T, H`.
- Indice mural : "Claude m'a tuer" -> **11 lettres** dans la phrase corrigée ("Claude m’a tué", sans espaces).

**Calcul de l'annulation (Décalage de César complexe) :**
On additionne l'indice (11) aux chiffres de `4291` relevés sur les bouteilles, puis on applique ce décalage à chaque lettre de `ARTH` en partant de la position initiale (A=1, etc.) :

1.  **A** (1) + (4 + 11) = **A + 15** positions = **P** (16ème lettre)
2.  **R** (18) + (2 + 11) = **R + 13** positions = **E** (5ème lettre, après cycle)
3.  **T** (20) + (20) = **T + 20** positions = **N** (14ème lettre, après cycle)
4.  **H** (8) + (1+11) = **H + 12** positions = **T** (20ème lettre)
- **Code d'annulation final :** `PENT`

> *Note : On ne part pas de 0 mais bien de la position de la lettre d'origine (ex: A + 15 = P).*
</details>