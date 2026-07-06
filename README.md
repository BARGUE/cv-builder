# CVBuilder

Application web de création de CV professionnels : inscription, éditeur guidé en 7 étapes, import de CV existant assisté par IA, multiples templates, aperçu en temps réel, export PDF et interface bilingue (FR / EN).

> Frontend **Next.js 16** (App Router, React 19, TypeScript). L’application ne persiste pas les données elle‑même : elle s’appuie sur une **API backend** externe (configurée via `AUTH_API_URL`) pour l’authentification et le stockage des CV.

---

## Table des matières

- [Aperçu](#aperçu)
- [Fonctionnalités](#fonctionnalités)
- [Stack technique](#stack-technique)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Configuration](#configuration)
- [Commandes](#commandes)
- [Structure du projet](#structure-du-projet)
- [Routes et pages](#routes-et-pages)
- [Routes API internes](#routes-api-internes)
- [API backend attendue](#api-backend-attendue)
- [Internationalisation](#internationalisation)
- [Authentification & sécurité](#authentification--sécurité)
- [Contribution](#contribution)

---

## Aperçu

**CVBuilder** permet à un utilisateur de :

- **S’inscrire / se connecter** via une API d’authentification externe (token stocké en cookie `httpOnly`).
- **Créer un CV pas à pas** grâce à un assistant en 7 étapes (coordonnées, expériences, formation, compétences, résumé, langues, finalisation).
- **Importer un CV existant** (PDF ou Word) : le document est analysé par un modèle **Claude (Anthropic)** qui en extrait automatiquement les informations structurées.
- **Choisir un template** et une couleur d’accent, ajouter une photo de profil.
- **Prévisualiser en temps réel** et **exporter en PDF** côté client.
- **Gérer son compte** : profil, avatar, mot de passe, statistiques.

---

## Fonctionnalités

| Domaine | Détail |
| --- | --- |
| **Authentification** | Connexion / inscription via Server Actions, token en cookie `access_token` (`httpOnly`, 24 h). |
| **Éditeur de CV** | Assistant en 7 étapes avec validation (`react-hook-form` + `zod`). |
| **Import par IA** | Extraction automatique des données depuis un PDF/DOCX via l’API Anthropic. |
| **Templates** | `classic`, `modern`, `creative`, `compact`, `executive`, `sidebar`, `minimaliste`, `playfair`, `tech`. |
| **Personnalisation** | Couleur d’accent, photo de profil (upload avec limite 2 Mo). |
| **Aperçu temps réel** | Prévisualisation instantanée pendant l’édition. |
| **Export PDF** | Génération côté client via `html-to-image` + `jsPDF`. |
| **Dashboard** | Liste des CV, création, édition, suppression, téléchargement. |
| **Compte** | Profil, avatar, changement de mot de passe, statistiques (`recharts`). |
| **Contact** | Formulaire relayé vers le backend. |
| **i18n** | Interface bilingue **français / anglais** (`next-intl`). |
| **Responsive & animations** | Détection du device via middleware, animations `framer-motion`. |

---

## Stack technique

- **Framework** : Next.js 16 (App Router, Server Actions, middleware)
- **UI** : React 19, Tailwind CSS 4, Radix UI (Accordion, Avatar, Dialog, Label, Popover)
- **Formulaires & validation** : react-hook-form, zod, @hookform/resolvers
- **Internationalisation** : next-intl (locales `fr` / `en`)
- **IA** : @anthropic-ai/sdk (analyse de CV importés)
- **Parsing de documents** : mammoth (DOCX), pdf-parse (PDF)
- **Export PDF** : jsPDF, html-to-image
- **Graphiques** : Recharts
- **Animations** : Framer Motion
- **Notifications** : Sonner
- **Langage** : TypeScript

---

## Prérequis

- **Node.js** 18.18+ (recommandé : 20+)
- **npm** (ou pnpm / yarn)
- Un **backend d’API** exposant l’authentification et le CRUD des CV (voir [API backend attendue](#api-backend-attendue))
- Une **clé API Anthropic** pour la fonctionnalité d’import de CV

---

## Installation

```bash
# 1. Récupérer le code
git clone <url-du-repo>
cd cv-builder

# 2. Installer les dépendances
npm install

# 3. Créer le fichier d'environnement (voir Configuration)
cp .env.example .env.local   # puis renseigner les valeurs

# 4. Lancer en développement
npm run dev
```

L’application démarre par défaut sur [http://localhost:3000](http://localhost:3000).

> ⚠️ Le backend et le frontend ne doivent pas partager le même port. Si votre backend tourne sur `:3000`, lancez le frontend sur un autre port : `next dev -p 3001`.

---

## Configuration

Les variables d’environnement se placent dans **`.env.local`** (ignoré par Git).

| Variable            | Obligatoire | Description                                                                                          |
| ------------------- | ----------- | ---------------------------------------------------------------------------------------------------- |
| `AUTH_API_URL`      | **Oui**     | URL de base de l’API backend (ex. `http://localhost:3000`). Utilisée pour l’auth, les CV et le contact. |
| `ANTHROPIC_API_KEY` | **Oui**\*   | Clé API Anthropic pour l’import de CV assisté par IA. \*Requise uniquement pour la fonctionnalité d’import. |

**Exemple `.env.local` :**

```env
AUTH_API_URL=http://localhost:3000
ANTHROPIC_API_KEY=sk-ant-...
```

> 🔐 Ne committez jamais vos clés. Traitez toute clé exposée comme compromise et régénérez‑la.

---

## Commandes

| Commande        | Description                                                        |
| --------------- | ------------------------------------------------------------------ |
| `npm run dev`   | Serveur de développement Next.js (rechargement à chaud).           |
| `npm run build` | Build de production (sortie dans `.next`).                         |
| `npm run start` | Démarre le serveur de production (après `npm run build`).          |
| `npm run lint`  | Analyse statique du code avec ESLint.                              |

---

## Structure du projet

```
cv-builder/
├── src/
│   ├── app/
│   │   ├── [locale]/                 # Pages localisées (fr | en) — App Router
│   │   │   ├── page.tsx              # Landing page
│   │   │   ├── layout.tsx            # Layout racine (NextIntlClientProvider, Toaster)
│   │   │   ├── globals.css
│   │   │   ├── auth/                 # Connexion / inscription (+ /auth/[name], /auth/logout)
│   │   │   ├── dashboard/            # Liste des CV
│   │   │   ├── account/              # Compte utilisateur
│   │   │   ├── contact/              # Formulaire de contact
│   │   │   ├── legal/[name]/         # Pages légales (confidentialité, CGU)
│   │   │   ├── cv/[id]/              # Éditeur d’un CV
│   │   │   └── actions/              # Server Actions (auth.ts, cv.ts, profile.ts)
│   │   └── api/                      # Routes API internes (non localisées)
│   │       ├── cv/[id]/              # GET détail d’un CV
│   │       ├── cv/import/            # POST import de CV via IA (Anthropic)
│   │       ├── upload/avatar/        # POST upload d’avatar
│   │       └── contact/              # POST formulaire de contact
│   ├── components/
│   │   ├── cv/                       # Éditeur (New, Start, Preview, steps, import, modal)
│   │   ├── dashboard/                # Dashboard client
│   │   ├── account/                  # Compte (stats, mot de passe)
│   │   ├── auth/                     # Modale d’authentification
│   │   ├── home/                     # Sections de la landing (hero, CTA, etc.)
│   │   ├── legals/                   # Contenus légaux
│   │   ├── layout/                   # Sidebar, etc.
│   │   └── ui/                       # Composants UI réutilisables (Radix + Tailwind)
│   ├── context/                      # Contexte global (CV + utilisateur)
│   ├── i18n/                         # Config next-intl (routing, request, navigation)
│   ├── lib/                          # auth, utils, pdf, animations, validations
│   ├── messages/                     # Traductions (fr.json, en.json)
│   ├── services/                     # Appels vers l’API backend (auth/, cv/)
│   ├── types/                        # Types du domaine (cv, api, dashboard, ...)
│   └── middleware.ts                 # i18n + protection des routes + détection device
├── public/uploads/avatars/           # Avatars uploadés
├── package.json
├── tsconfig.json
└── README.md
```

---

## Routes et pages

Toutes les pages sont préfixées par la locale (`/fr/...` ou `/en/...`).

| Route              | Accès    | Description                                   |
| ------------------ | -------- | --------------------------------------------- |
| `/{locale}`        | Public   | Landing page (redirige vers le dashboard si connecté). |
| `/{locale}/auth`   | Public   | Authentification.                             |
| `/{locale}/auth/[name]` | Public | Connexion / inscription selon le segment.  |
| `/{locale}/contact`| Public   | Formulaire de contact.                        |
| `/{locale}/legal/[name]` | Public | Pages légales (confidentialité, CGU).     |
| `/{locale}/dashboard` | Protégé | Liste et gestion des CV.                    |
| `/{locale}/account`| Protégé  | Compte utilisateur.                           |
| `/{locale}/cv/[id]`| Protégé  | Éditeur d’un CV.                              |

Les routes protégées (`/dashboard`, `/account`, `/cv/*`) exigent le cookie `access_token` ; sinon l’utilisateur est redirigé vers l’accueil (voir [`src/middleware.ts`](src/middleware.ts)).

---

## Routes API internes

Ces routes sont servies par Next.js (dossier `src/app/api`) :

| Route                 | Méthode | Rôle                                                                 |
| --------------------- | ------- | -------------------------------------------------------------------- |
| `/api/cv/[id]`        | GET     | Récupère le détail d’un CV (authentifié, proxy vers le backend).     |
| `/api/cv/import`      | POST    | Analyse un document (base64 + mimeType) via Anthropic et retourne un CV structuré. |
| `/api/upload/avatar`  | POST    | Upload d’un avatar (JPEG/PNG/WebP/GIF, ≤ 2 Mo) dans `public/uploads/avatars`. |
| `/api/contact`        | POST    | Relaie le formulaire de contact vers le backend.                     |

---

## API backend attendue

Le frontend consomme un backend exposé à `AUTH_API_URL`. Endpoints utilisés :

**Authentification & compte**

- `POST /auth/login` — connexion (renvoie `access_token` / `accessToken`)
- `POST /auth/register` — inscription
- `GET  /me` — profil de l’utilisateur courant
- `PATCH /me/profile` — mise à jour du profil
- `PATCH /me/password` — changement de mot de passe

**CV**

- `GET    /cvs` — liste des CV
- `POST   /cvs` — création
- `GET    /cvs/:id` — détail
- `PATCH  /cvs/:id` — mise à jour
- `DELETE /cvs/:id` — suppression

**Autres**

- `POST /contact` — envoi d’un message de contact

Les appels sont centralisés dans [`src/services/auth/api.ts`](src/services/auth/api.ts) et [`src/services/cv/api.ts`](src/services/cv/api.ts), avec le token Bearer récupéré côté serveur depuis le cookie.

---

## Internationalisation

- Gérée par **next-intl** ([`src/i18n/routing.ts`](src/i18n/routing.ts)).
- Locales disponibles : **`fr`** (par défaut) et **`en`**.
- Préfixe de locale **toujours** présent dans l’URL (`localePrefix: "always"`).
- Traductions dans [`src/messages/fr.json`](src/messages/fr.json) et [`src/messages/en.json`](src/messages/en.json).

---

## Authentification & sécurité

- Le token d’accès est stocké dans un cookie **`access_token`** : `httpOnly`, `sameSite=lax`, `secure` en production, durée **24 h**.
- Le [`middleware.ts`](src/middleware.ts) :
  - applique le routing i18n,
  - protège `/dashboard`, `/account` et `/cv/*`,
  - redirige les utilisateurs connectés depuis l’accueil vers le dashboard,
  - redirige le sous‑domaine `auth.*` vers le domaine principal,
  - ajoute les en‑têtes `x-viewport` (type d’appareil) et `x-locale`.
- Les mutations (création, mise à jour, suppression de CV, auth, profil) passent par des **Server Actions** (`src/app/[locale]/actions/`).

---

## Contribution

1. Créer une branche à partir de `develop` (ou de la branche cible).
2. Développer, puis vérifier avec `npm run lint` et `npm run build`.
3. Ouvrir une Pull Request décrivant clairement les changements.
