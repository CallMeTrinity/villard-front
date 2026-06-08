# Marmotte — Front

SPA Vue 3 pour gérer la vie d'une maison partagée : planning des séjours, inventaire, liste de courses, notes et plan d'architecture.

Le backend (API Platform 4) est dans un autre dépôt et expose les routes documentées dans [`API.md`](./API.md).

## Stack

- **Vue 3** (`<script setup>`) + **TypeScript**
- **Vite** pour le dev/build
- **Vue Router** avec garde d'authentification
- **Pinia** pour le state (auth, tweaks UI)
- **Axios** comme client HTTP, avec interceptors JWT + refresh token
- Alias `@` → `src/`

## Prérequis

- Node.js 20+
- Une instance du back accessible (par défaut `http://localhost:8000`)

## Démarrage

```bash
npm install
cp .env.example .env   # adapter VITE_API_URL si besoin
npm run dev
```

Scripts disponibles :

| Commande          | Description                                |
| ----------------- | ------------------------------------------ |
| `npm run dev`     | Serveur de dev Vite (HMR)                  |
| `npm run build`   | Type-check (`vue-tsc`) + build de prod     |
| `npm run preview` | Sert le build de prod pour relecture       |

## Configuration

Variables d'environnement (fichier `.env`) :

| Variable       | Défaut                  | Rôle                         |
| -------------- | ----------------------- | ---------------------------- |
| `VITE_API_URL` | `http://localhost:8000` | URL de base de l'API back    |

Les variables sont centralisées dans `src/config/env.ts`.

## Arborescence

```
src/
├── api/          # Clients axios par ressource (auth, inventory, notes, shopping, …)
│   └── client.ts # Instance axios + interceptors JWT/refresh + unwrap Hydra
├── assets/css/   # Tokens et styles globaux
├── components/   # Composants par module (shell, inventory, notes, planning, shopping, icons)
├── composable/   # Composables `useX` qui orchestrent l'état + appels API
├── config/       # Lecture des variables d'environnement
├── icons/        # Icônes SVG
├── layouts/      # AppShell (sidebar + topbar)
├── router/       # Routes + garde d'auth
├── stores/       # Stores Pinia (auth, tweaks)
├── utils/        # Helpers (dates, état d'inventaire)
├── views/        # Pages : Planning, Inventory, Courses, Notes, Architecture, Login
├── App.vue
└── main.ts
```

## Routes

| Chemin           | Vue                  | Auth |
| ---------------- | -------------------- | ---- |
| `/login`         | `LoginView`          | ❌   |
| `/planning`      | `PlanningView`       | ✅   |
| `/inventaire`    | `InventoryView`      | ✅   |
| `/courses`       | `CoursesView`        | ✅   |
| `/notes`         | `NotesView`          | ✅   |
| `/architecture`  | `ArchitectureView`   | ✅   |

La racine `/` redirige vers la dernière route visitée (`localStorage.marmotte.route`), ou `/planning` par défaut.

## Authentification

- Login via `POST /api/login` → stocke `auth_token` et `auth_refresh_token` dans `localStorage`.
- Toutes les requêtes API ajoutent automatiquement `Authorization: Bearer <token>`.
- Sur `401`, l'intercepteur tente un refresh via `POST /api/token/refresh` puis rejoue la requête.
- Si le refresh échoue (ou est absent), l'utilisateur est redirigé vers `/login`.
- Au boot (`main.ts`), si un token est présent, on hydrate l'utilisateur courant avant de monter l'app.

## Conventions API

Le back est une API Platform 4 (Hydra/JSON-LD). Les collections renvoyées sous la forme
`{ "@type": "Collection", "member": [...] }` sont automatiquement *unwrappées* en tableau plat
côté client (`src/api/client.ts`). La pagination Hydra n'est pas encore gérée — à introduire
dans un wrapper dédié quand le besoin se présentera.

Les en-têtes par défaut sont :

```
Content-Type: application/json
Accept:       application/ld+json
```

## Build

```bash
npm run build
```

Produit un bundle statique dans `dist/`, à servir derrière n'importe quel serveur HTTP
en mode SPA (fallback `index.html` pour le routing côté client).
