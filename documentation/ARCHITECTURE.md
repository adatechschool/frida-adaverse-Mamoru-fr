# Architecture Overview / Vue d'ensemble de l'architecture

<details>

<summary>Table of contents</summary>

- [Architecture Overview / Vue d'ensemble de l'architecture](#architecture-overview--vue-densemble-de-larchitecture)
  - [🌍 English Version](#-english-version)
    - [System Architecture](#system-architecture)
    - [Technology Stack](#technology-stack)
    - [Project Structure](#project-structure)
    - [Database Schema](#database-schema)
    - [Data Flow Patterns](#data-flow-patterns)
      - [1. Homepage Loading](#1-homepage-loading)
      - [2. Project Detail Loading](#2-project-detail-loading)
      - [3. Project Submission Workflow](#3-project-submission-workflow)
    - [API Authentication Flow](#api-authentication-flow)
    - [GitHub API Integration](#github-api-integration)
  - [🇫🇷 Version Française](#-version-française)
    - [Architecture du Système](#architecture-du-système)
    - [Stack Technologique](#stack-technologique)
    - [Structure du Projet](#structure-du-projet)
    - [Schéma de Base de Données](#schéma-de-base-de-données)
    - [Flux de Données](#flux-de-données)
      - [1. Chargement de la Page d'Accueil](#1-chargement-de-la-page-daccueil)
      - [2. Chargement d'un Détail de Projet](#2-chargement-dun-détail-de-projet)
      - [3. Workflow de Soumission de Projet](#3-workflow-de-soumission-de-projet)
    - [Flux d'Authentification API](#flux-dauthentification-api)
    - [Intégration GitHub API](#intégration-github-api)
  - [Key Principles / Principes Clés](#key-principles--principes-clés)
    - [EN: Separation of Concerns](#en-separation-of-concerns)
    - [FR: Séparation des Responsabilités](#fr-séparation-des-responsabilités)

</details>

## 🌍 English Version

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      ADAVERSE PLATFORM                      │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   Frontend   │    │   Backend    │    │   External   │
│  (Next.js)   │◄───┤   (API)      │◄───┤   (GitHub)   │
└──────────────┘    └──────────────┘    └──────────────┘
        │                     │
        │                     │
        ▼                     ▼
┌──────────────┐    ┌──────────────┐
│  React State │    │  PostgreSQL  │
│  (Context)   │    │  (Database)  │
└──────────────┘    └──────────────┘
```

### Technology Stack

**Frontend**
- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- Lucide React Icons

**Backend**
- Next.js API Routes
- Drizzle ORM
- PostgreSQL (Neon)
- API Key Authentication

**External APIs**
- GitHub REST API
- GitHub Search API

### Project Structure

```
adaverse/
│
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Homepage
│   ├── search/                   # Search page
│   ├── [url]/                    # Dynamic project detail pages
│   ├── admin/                    # Admin pages
│   │   └── approve-projects/     # Project approval interface
│   ├── globals.css               # Global styles + markdown styling
│   └── api/                      # API Routes
│       ├── ada-project/          # Ada project categories
│       ├── ada-promotion/        # Student promotions/cohorts
│       ├── student/              # Students CRUD
│       ├── student-project/      # Complete projects with students
│       ├── student-to-project/   # Many-to-many relations
│       └── pending-project/      # Project submission workflow
│           └── approve/          # Project approval endpoint
│
├── components/                   # React Components
│   ├── ProjectCard.tsx           # Project display card
│   ├── AddProjectModal.tsx       # Project submission form
│   ├── admin/                    # Admin-only components
│   └── interactComponents/       # Reusable UI components
│
├── context/                      # React Context (Global State)
│   ├── AdaProjectsContext.tsx    # Ada project categories state
│   ├── AdaPromotionsContext.tsx  # Promotions state
│   ├── StudentsContext.tsx       # Students state
│   ├── StudentProjectsContext.tsx# Projects state
│   └── AddProjectContext.tsx     # Pending projects state
│
├── hooks/                        # Custom React Hooks
│   ├── useGitHubRepo.ts          # Fetch GitHub repository data
│   └── useGitHubReadme.ts        # Fetch GitHub README content
│   └── useProjectFilters.ts      # Project filtering logic
│
├── lib/                          # Server-side Libraries
│   └── db/                       # Database Layer
│       ├── index.ts              # Drizzle client
│       ├── schema.ts             # Database schema definitions
│       ├── approve-projects.ts   # Approval script (npm run approve)
│       ├── import-csv.ts         # CSV import script
│       └── migrations/           # SQL migrations
│           ├── 001_*.sql
│           ├── 004_create_pending_projects.sql
│           └── 005_approved_projects.sql (auto-generated)
│
├── utils/                        # Utility Functions
│   ├── generateURLName.ts        # Create URL slugs
│   ├── normalizeText.ts          # Text normalization
│   ├── formatDate.ts             # Date formatting
│   └── externalURLformat.ts      # URL validation
│
└── documentation/                # Project Documentation
    ├── ARCHITECTURE.md           # This file
    ├── API_DOCUMENTATION.md      # API reference
    ├── API_SECURITY.md           # Security guide
    ├── APPROVAL_SYSTEM.md        # Approval workflow
    ├── GITHUB_API_DOCUMENTATION.md
    └── WORKFLOWS.md              # Complete workflows
```

### Database Schema

```sql
-- Core Tables
ada_projects          # Project categories (AdaVerse, AdaCheckEvent, etc.)
ada_promotions        # Student cohorts (Frida, Grace, etc.)
students              # Student information
projects_students     # Approved student projects
student_to_projects   # Many-to-many: students ↔ projects

-- Workflow Tables
pending_projects      # Projects awaiting approval
```

**Relationships**:
```
ada_promotions (1) ───< (N) students
ada_projects (1) ───< (N) projects_students
students (N) ───>< (N) projects_students (via student_to_projects)
```

### Data Flow Patterns

#### 1. Homepage Loading
```
User visits homepage
    │
    ├──> Fetch ada_projects (Context)
    ├──> Fetch ada_promotions (Context)
    ├──> Fetch students (Context)
    └──> Fetch student_projects (Context)
              │
              └──> Join with students data
                      │
                      └──> Render ProjectCards
```

#### 2. Project Detail Loading
```
User visits /project-name
    │
    ├──> Find project by URLName (Context)
    ├──> Fetch GitHub repo data (Hook)
    │     ├── Repository metadata
    │     ├── Languages (top 4)
    │     ├── Issue statistics
    │     └── PR statistics
    ├──> Fetch GitHub README (Hook)
    └──> Render complete project page
```

#### 3. Project Submission Workflow
```
Student fills form → POST /api/pending-project
    │                        │
    │                        └──> Validate data
    │                             └──> Insert into pending_projects
    │
Admin reviews → GET /api/pending-project
    │                │
    │                └──> List all pending projects
    │
Admin approves → POST /api/pending-project/approve
    │                 │
    │                 └──> Generate SQL in 005_approved_projects.sql
    │
Admin runs → npm run approve
    │            │
    │            ├──> Execute SQL file
    │            ├──> Insert into projects_students
    │            ├──> Create student_to_projects links
    │            └──> Delete from pending_projects
    │
Project appears on site ✅
```

### API Authentication Flow

```
Client Request
    │
    ├──> Header: x-api-key
    │
    ▼
API Middleware
    │
    ├──> Compare with API_SECRET_KEY (.env)
    │
    ├──> ✅ Valid → Process request
    └──> ❌ Invalid → Return 401/403
```

### GitHub API Integration

```
Project Detail Page
    │
    ├──> useGitHubRepo Hook
    │     │
    │     └──> Parallel API Calls:
    │          ├── GET /repos/{owner}/{repo}          (metadata)
    │          ├── GET /repos/{owner}/{repo}/languages
    │          ├── GET /search/issues?type=issue      (total)
    │          ├── GET /search/issues?type=issue&state=open
    │          ├── GET /search/issues?type=pr         (total)
    │          └── GET /search/issues?type=pr&state=open
    │
    └──> useGitHubReadme Hook
          │
          └──> GET /repos/{owner}/{repo}/readme
               (Accept: application/vnd.github.html+json)
```

---

## 🇫🇷 Version Française

### Architecture du Système

```
┌─────────────────────────────────────────────────────────────┐
│                    PLATEFORME ADAVERSE                      │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  Interface   │    │   Backend    │    │   Externe    │
│  (Next.js)   │◄───┤   (API)      │◄───┤   (GitHub)   │
└──────────────┘    └──────────────┘    └──────────────┘
        │                     │
        │                     │
        ▼                     ▼
┌──────────────┐    ┌──────────────┐
│  État React  │    │  PostgreSQL  │
│  (Context)   │    │ (Base de     │
└──────────────┘    │  données)    │
                    └──────────────┘
```

### Stack Technologique

**Frontend**
- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- Icônes Lucide React

**Backend**
- Routes API Next.js
- Drizzle ORM
- PostgreSQL (Neon)
- Authentification par clé API

**APIs Externes**
- GitHub REST API
- GitHub Search API

### Structure du Projet

Voir la version anglaise ci-dessus pour l'arborescence complète des fichiers.

### Schéma de Base de Données

```sql
-- Tables Principales
ada_projects          # Catégories de projets (Pico-8, AdaCheck, etc.)
ada_promotions        # Cohortes d'étudiants (Ada 2023, Ada 2024, etc.)
students              # Informations des étudiants
projects_students     # Projets étudiants approuvés
student_to_projects   # Relation N-N : étudiants ↔ projets

-- Tables de Workflow
pending_projects      # Projets en attente d'approbation
```

**Relations**:
```
ada_promotions (1) ───< (N) students
ada_projects (1) ───< (N) projects_students
students (N) ───>< (N) projects_students (via student_to_projects)
```

### Flux de Données

#### 1. Chargement de la Page d'Accueil
```
Utilisateur visite la page d'accueil
    │
    ├──> Récupère ada_projects (Context)
    ├──> Récupère ada_promotions (Context)
    ├──> Récupère students (Context)
    └──> Récupère student_projects (Context)
              │
              └──> Jointure avec données étudiants
                      │
                      └──> Affiche les ProjectCards
```

#### 2. Chargement d'un Détail de Projet
```
Utilisateur visite /nom-projet
    │
    ├──> Trouve le projet par URLName (Context)
    ├──> Récupère données GitHub (Hook)
    │     ├── Métadonnées du dépôt
    │     ├── Langages (top 4)
    │     ├── Statistiques des issues
    │     └── Statistiques des PRs
    ├──> Récupère le README GitHub (Hook)
    └──> Affiche la page complète du projet
```

#### 3. Workflow de Soumission de Projet
```
Étudiant remplit formulaire → POST /api/pending-project
    │                              │
    │                              └──> Validation des données
    │                                   └──> Insertion dans pending_projects
    │
Admin révise → GET /api/pending-project
    │               │
    │               └──> Liste tous les projets en attente
    │
Admin approuve → POST /api/pending-project/approve
    │                 │
    │                 └──> Génère SQL dans 005_approved_projects.sql
    │
Admin exécute → npm run approve
    │                │
    │                ├──> Exécute le fichier SQL
    │                ├──> Insert dans projects_students
    │                ├──> Crée les liens student_to_projects
    │                └──> Supprime de pending_projects
    │
Le projet apparaît sur le site ✅
```

### Flux d'Authentification API

```
Requête Client
    │
    ├──> En-tête: x-api-key
    │
    ▼
Middleware API
    │
    ├──> Compare avec API_SECRET_KEY (.env)
    │
    ├──> ✅ Valide → Traite la requête
    └──> ❌ Invalide → Retourne 401/403
```

### Intégration GitHub API

```
Page Détail Projet
    │
    ├──> Hook useGitHubRepo
    │     │
    │     └──> Appels API Parallèles:
    │          ├── GET /repos/{owner}/{repo}          (métadonnées)
    │          ├── GET /repos/{owner}/{repo}/languages
    │          ├── GET /search/issues?type=issue      (total)
    │          ├── GET /search/issues?type=issue&state=open
    │          ├── GET /search/issues?type=pr         (total)
    │          └── GET /search/issues?type=pr&state=open
    │
    └──> Hook useGitHubReadme
          │
          └──> GET /repos/{owner}/{repo}/readme
               (Accept: application/vnd.github.html+json)
```

## Key Principles / Principes Clés

### EN: Separation of Concerns
- **Frontend**: React components for UI
- **Context**: Global state management
- **Hooks**: Reusable data fetching logic
- **API Routes**: Server-side business logic
- **Database**: Data persistence layer

### FR: Séparation des Responsabilités
- **Frontend**: Composants React pour l'interface
- **Context**: Gestion d'état global
- **Hooks**: Logique de récupération de données réutilisable
- **Routes API**: Logique métier côté serveur
- **Base de données**: Couche de persistance des données

---

**Last Updated / Dernière mise à jour**: December 3, 2025
