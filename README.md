# 🎉 Qestra — Event Planner Platform

<div align="center">

**Plateforme SaaS de mise en relation entre organisateurs d'événements et prestataires de services**

[![NestJS](https://img.shields.io/badge/Backend-NestJS-E0234E?logo=nestjs)](https://nestjs.com)
[![Next.js](https://img.shields.io/badge/Web-Next.js_14-000?logo=next.js)](https://nextjs.org)
[![React Native](https://img.shields.io/badge/Mobile-React_Native-61DAFB?logo=react)](https://reactnative.dev)
[![PostgreSQL](https://img.shields.io/badge/DB-PostgreSQL-4169E1?logo=postgresql)](https://postgresql.org)
[![Prisma](https://img.shields.io/badge/ORM-Prisma-2D3748?logo=prisma)](https://prisma.io)

</div>

---

## 📖 Description

Qestra connecte les personnes souhaitant organiser des événements (mariages, anniversaires, fêtes, dîners, etc.) avec des prestataires de services : photographes, fleuristes, pâtissiers, animateurs, décorateurs, salles, traiteurs, et plus encore.

La plateforme agit comme un écosystème événementiel complet où les utilisateurs peuvent découvrir, comparer, réserver et gérer les services en un seul endroit.

---

## ⚡ Fonctionnalités

### 👤 Client
- Inscription / Connexion (JWT)
- Recherche de prestataires (catégorie, ville)
- Consultation des profils et avis
- Réservation de services
- Suivi des réservations (statut en temps réel)
- Assistant IA pour la planification

### 🏢 Prestataire
- Espace dédié avec dashboard
- Gestion des services (ajout, modification)
- Réception et gestion des réservations (confirmer/refuser)
- Notifications automatiques
- Profil public avec avis clients

### 🤖 Intelligence Artificielle
- Assistant IA conversationnel
- Recommandation de prestataires
- Estimation budgétaire
- Conseils de planification événementielle
- Checklist personnalisée

---

## 🛠 Stack Technique

| Couche | Technologie |
|--------|------------|
| **Backend** | NestJS 11, Prisma 7, PostgreSQL |
| **Web Frontend** | Next.js 14 (App Router), Tailwind CSS |
| **Mobile** | React Native (Expo SDK 52), Expo Router |
| **Auth** | JWT (Passport.js) |
| **Real-time** | Socket.io (WebSockets) |
| **IA** | Module NLP contextuel (recommandations, budget) |

---

## 📁 Architecture du Projet

```
qestra/
├── backend/             # API NestJS
│   ├── src/
│   │   ├── auth/        # Authentification JWT
│   │   ├── users/       # Gestion utilisateurs
│   │   ├── providers/   # Profils prestataires
│   │   ├── services/    # Services proposés
│   │   ├── bookings/    # Système de réservation
│   │   ├── reviews/     # Avis et notes
│   │   ├── notifications/ # Notifications
│   │   ├── chat/        # Chat WebSocket
│   │   ├── ai/          # Assistant IA
│   │   └── prisma/      # Service Prisma
│   └── prisma/
│       └── schema.prisma # Schéma BDD
├── web/                 # Dashboard Next.js
│   └── src/
│       ├── app/         # Pages (App Router)
│       ├── components/  # Composants (AiChat)
│       ├── lib/         # API client, utils
│       └── store/       # State management (Zustand)
└── mobile/              # App React Native
    ├── app/             # Écrans (Expo Router)
    └── lib/             # API, auth helpers
```

---

## 🚀 Installation & Lancement

### Prérequis
- Node.js >= 18
- PostgreSQL
- npm ou yarn

### Backend

```bash
cd backend
npm install
# Configurer .env (DATABASE_URL, JWT_SECRET)
npx prisma migrate dev
npx prisma generate
npm run start:dev
```

### Web Frontend

```bash
cd web
npm install
npm run dev
# → http://localhost:3001
```

### Mobile

```bash
cd mobile
npm install
npx expo start
# Scanner le QR code avec Expo Go
```

---

## 🔑 Variables d'environnement

```env
# backend/.env
DATABASE_URL="postgresql://user:password@localhost:5432/qestra_db"
JWT_SECRET="your_secret_key"
JWT_EXPIRES_IN="7d"
PORT=3000
```

---

## 📊 Base de Données

7 tables principales :
- **Users** — Clients et prestataires
- **ProviderProfiles** — Profils business
- **Services** — Offres des prestataires
- **Bookings** — Réservations
- **Reviews** — Avis et notes
- **Messages** — Chat
- **Notifications** — Alertes

---

## 🧪 Comptes de test

| Rôle | Email | Mot de passe |
|------|-------|-------------|
| Client | client@test.com | password123 |
| Prestataire | photo@test.com | password123 |

---

## 📸 Screenshots

### Landing Page
Interface moderne avec gradient purple/indigo, catégories, statistiques.

### Recherche Prestataires
Filtres par catégorie et ville, cards avec ratings et prix.

### Réservation
Formulaire de réservation avec sélection service, date, type événement.

### Dashboard Prestataire
Gestion des réservations, confirmation/refus, ajout de services.

### Assistant IA
Chatbot intelligent avec recommandations et estimation budget.

---

## 👥 Équipe

- **Développeur** : [Votre nom]
- **Encadrant** : M. Houssem Eddine Mohamed

---

## 📄 Licence

Projet réalisé dans le cadre d'un stage d'été 2026.
