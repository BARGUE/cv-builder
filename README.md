# CVBuilder

Application web pour créer des CV professionnels : inscription gratuite, éditeur guidé, 6 templates, aperçu en temps réel et export PDF.

---

## Table des matières

- [Présentation](#présentation)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Configuration](#configuration)
- [Commandes](#commandes)
- [Structure du projet](#structure-du-projet)
- [Fonctionnalités](#fonctionnalités)
- [Routes et pages](#routes-et-pages)
- [API (backend externe)](#api-backend-externe)
- [Stack technique](#stack-technique)
- [Contribution](#contribution)

---

## Présentation

**CVBuilder** est un frontend Next.js qui permet aux utilisateurs de :

- **S’inscrire / se connecter** via une API d’authentification externe
- **Créer et modifier des CV** avec un éditeur pas à pas
- **Choisir parmi 6 templates** : Classic, Modern, Creative, Compact, Executive, Sidebar
- **Personnaliser** la couleur d’accent et la photo de profil
- **Prévisualiser** en temps réel et **télécharger en PDF**

L’application ne stocke pas les données elle-même : elle s’appuie sur une **API backend** (URL configurée via `AUTH_API_URL`).

---

## Prérequis

- **Node.js** 18+ (recommandé : 20+)
- **npm** ou **pnpm** ou **yarn**
- Un **backend d’API** qui expose l’auth et les CRUD CV (voir [API (backend externe)](#api-backend-externe))

---

## Installation

1. **Cloner le dépôt** (ou récupérer le code)

   ```bash
   git clone <url-du-repo>
   cd cv-builder
   ```

2. **Installer les dépendances**

   ```bash
   npm install
   ```

   Ou avec pnpm :

   ```bash
   pnpm install
   ```

   Ou avec yarn :

   ```bash
   yarn
   ```

3. **Configurer les variables d’environnement**

   Créer un fichier `.env.local` à la racine (voir [Configuration](#configuration)).

4. **Lancer l’application en développement**

   ```bash
   npm run dev
   ```

   Puis ouvrir [http://localhost:3001](http://localhost:3001).

---

## Configuration

Les variables d’environnement se mettent dans **`.env.local`** (ce fichier est ignoré par Git).

| Variable       | Obligatoire | Description                                                                                                                     |
| -------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `AUTH_API_URL` | **Oui**     | URL de base de l’API backend (ex. `http://localhost:3000` ou `https://api.example.com`). Utilisée pour l’auth et les appels CV. |
| `PRINT_SECRET` | Non         | Secret partagé pour sécuriser l’endpoint d’impression `/api/cv-print`. Si absent, l’endpoint renverra 401.                      |

**Exemple `.env.local` :**

```env
AUTH_API_URL=http://localhost:3000
PRINT_SECRET=mon-secret-impression
```

Pour un **démarrage rapide** sans backend, vous pouvez pointer `AUTH_API_URL` vers une URL mock ou un service de test, mais l’auth et la persistance des CV ne fonctionneront pas sans un vrai backend compatible.

---

## Commandes

| Commande        | Description                                                                  |
| --------------- | ---------------------------------------------------------------------------- |
| `npm run dev`   | Lance le serveur de développement Next.js (Turbopack). Rechargement à chaud. |
| `npm run build` | Compile l’application pour la production (sortie dans `.next`).              |
| `npm run start` | Démarre le serveur de production (à utiliser après `npm run build`).         |
| `npm run lint`  | Exécute ESLint sur le code.                                                  |

**Exemples :**

```bash
# Développement
npm run dev

# Build puis démarrage en production
npm run build
npm run start

# Vérifier le code
npm run lint
```

---

## Structure du projet

```
cv-builder/
├── src/
│   ├── app/                    # App Router Next.js
│   │   ├── page.tsx            # Page d’accueil (landing)
│   │   ├── layout.tsx          # Layout racine (CVProvider, myToaster)
│   │   ├── globals.css         # Styles globaux
│   │   ├── auth/               # Connexion / Inscription
│   │   │   ├── page.tsx
│   │   │   └── [name]/         # login | register
│   │   ├── dashboard/         # Tableau de bord (liste des CV)
│   │   ├── account/            # Compte utilisateur
│   │   ├── cv/
│   │   │   ├── [id]/           # Éditeur d’un CV
│   │   │   │   ├── page.tsx
│   │   │   │   └── print/      # Page d’impression
│   │   │   └── ...
│   │   └── api/                # Routes API Next.js (proxy / auth / print / download)
│   │       ├── auth/
│   │       ├── me/
│   │       ├── profile/
│   │       ├── cvs/            # Liste, création, mise à jour, suppression
│   │       ├── cvs/[id]/       # Détail, download
│   │       ├── cv-print/       # Génération HTML pour impression (protégé par PRINT_SECRET)
│   │       ├── upload/avatar/
│   │       ├── password/
│   │       ├── logout/
│   │       └── account/
│   ├── components/
│   │   ├── cv/                 # Éditeur et prévisualisation CV
│   │   │   ├── New.tsx         # Formulaire / étapes de création
│   │   │   ├── Preview.tsx     # Aperçu du CV
│   │   │   └── Start.tsx       # Point d’entrée création
│   │   ├── dashboard/          # Dashboard client
│   │   ├── account/            # Compte (stats, mot de passe, etc.)
│   │   └── ui/                 # Composants UI (boutons, inputs, dialogs, etc.)
│   ├── context/
│   │   └── CVContext.tsx       # État global CV + utilisateur
│   ├── lib/
│   │   ├── auth.ts             # Récupération du token (cookies)
│   │   ├── utils.ts            # Utilitaires (cn, etc.)
│   │   └── cv-print-html.ts    # Génération HTML pour impression/PDF
│   ├── services/
│   │   ├── auth/               # Appels API auth (login, register, me, etc.)
│   │   └── cv/                 # Appels API CV (CRUD, liste)
│   └── types/
│       └── cv.ts               # Types CV (CVData, Experience, Education, etc.)
├── middleware.ts               # Protection des routes /dashboard, /account, /cv
├── package.json
├── .env.local                  # Variables d’environnement (à créer)
└── README.md
```

- **`src/app`** : pages et routes API (App Router).
- **`src/components`** : composants React (CV, dashboard, account, UI).
- **`src/context`** : contexte global (utilisateur + CV).
- **`src/lib`** : auth, utils, génération HTML d’impression.
- **`src/services`** : appels vers l’API backend.
- **`src/types`** : types TypeScript du domaine CV.
- **`middleware.ts`** : redirection vers `/` si non connecté sur les routes protégées.

---

## Fonctionnalités

- **Authentification** : login / register via l’API ; token en cookie `access_token`.
- **Dashboard** : liste des CV de l’utilisateur, création, accès à l’édition.
- **Éditeur de CV** : formulaire par étapes (infos perso, expériences, formation, compétences, langues), choix du template et de la couleur d’accent.
- **Aperçu en temps réel** : mise à jour immédiate de la prévisualisation.
- **Export PDF** : téléchargement du CV en PDF (via l’API ou la route de téléchargement).
- **Compte** : profil, avatar, changement de mot de passe, statistiques.
- **6 templates** : Classic, Modern, Creative, Compact, Executive, Sidebar.

---

## Routes et pages

| Route            | Accès   | Description                                        |
| ---------------- | ------- | -------------------------------------------------- |
| `/`              | Public  | Page d’accueil (landing).                          |
| `/auth`          | Public  | Redirection vers login/register.                   |
| `/auth/login`    | Public  | Connexion.                                         |
| `/auth/register` | Public  | Inscription.                                       |
| `/dashboard`     | Protégé | Liste des CV, création d’un nouveau CV.            |
| `/account`       | Protégé | Compte utilisateur (profil, avatar, mot de passe). |
| `/cv/[id]`       | Protégé | Éditeur du CV `[id]`.                              |
| `/cv/[id]/print` | Protégé | Page d’impression du CV.                           |

Les routes **protégées** sont définies dans `middleware.ts` : en l’absence du cookie `access_token`, l’utilisateur est redirigé vers `/`.

---

## API (backend externe)

L’application s’attend à un **backend** exposé à `AUTH_API_URL` avec au moins :

- **Auth** : login, register, refresh, etc. (le front utilise aussi des routes Next.js sous `/api/auth` qui font proxy ou cookie).
- **Utilisateur** : `GET /me` (ou équivalent) pour les infos du compte.
- **CV** :
  - `GET /cvs` — liste des CV
  - `POST /cvs` — création
  - `GET /cvs/:id` — détail
  - `PATCH /cvs/:id` — mise à jour
  - `DELETE /cvs/:id` — suppression

Les appels sont faits depuis `src/services/auth` et `src/services/cv/api.ts`, avec le token Bearer récupéré côté serveur (cookie).

L’endpoint **`/api/cv-print`** (Next.js) génère du HTML pour l’impression ; il est protégé par le header `x-print-secret` qui doit correspondre à `PRINT_SECRET`. Utile pour un service d’impression ou un worker qui appelle ce endpoint avec le secret.

---

## Stack technique

- **Framework** : Next.js 16 (App Router)
- **UI** : React 19, Tailwind CSS 4, Radix UI (Dialog, Label, Avatar, Popover), composants dans `src/components/ui`
- **Animations** : Framer Motion
- **Export** : jsPDF, html-to-image
- **Graphiques** : Recharts (ex. dashboard)
- **Notifications** : react-hot-myToast
- **Langage** : TypeScript

---

## Contribution

1. Créer une branche à partir de `main` (ou de la branche cible).
2. Faire vos modifications et vérifier avec `npm run lint` et les tests éventuels.
3. Ouvrir une Pull Request avec une description claire des changements.

---

_README généré pour faciliter l’onboarding sur le projet CVBuilder._
