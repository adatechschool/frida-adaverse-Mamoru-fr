# GitHub API Integration - Documentation
# Intégration de l'API GitHub - Documentation

<details>

<summary>Table of contents</summary>

- [GitHub API Integration - Documentation](#github-api-integration---documentation)
- [Intégration de l'API GitHub - Documentation](#intégration-de-lapi-github---documentation)
  - [🌍 English Version](#-english-version)
  - [Overview](#overview)
  - [🇫🇷 Version Française](#-version-française)
  - [Vue d'ensemble](#vue-densemble)
  - [🌍 English Documentation](#-english-documentation)
  - [Features Implemented](#features-implemented)
    - [1. Repository Statistics](#1-repository-statistics)
    - [2. Repository Information](#2-repository-information)
    - [3. README Content](#3-readme-content)
  - [Technical Implementation](#technical-implementation)
    - [Hooks Created](#hooks-created)
      - [`useGitHubRepo` Hook](#usegithubrepo-hook)
      - [`useGitHubReadme` Hook](#usegithubreadme-hook)
    - [Display Implementation](#display-implementation)
      - [Project Detail Page](#project-detail-page)
      - [Markdown Styling](#markdown-styling)
  - [GitHub API Endpoints Used](#github-api-endpoints-used)
    - [1. Get Repository](#1-get-repository)
    - [2. Get Languages](#2-get-languages)
    - [3. Search Issues (Total)](#3-search-issues-total)
    - [4. Search Issues (Open)](#4-search-issues-open)
    - [5. Search Pull Requests (Total)](#5-search-pull-requests-total)
    - [6. Search Pull Requests (Open)](#6-search-pull-requests-open)
    - [7. Get README](#7-get-readme)
  - [Rate Limiting Considerations](#rate-limiting-considerations)
    - [Core API Endpoints (repos, languages, readme)](#core-api-endpoints-repos-languages-readme)
    - [Search API Endpoints (issues, pull requests)](#search-api-endpoints-issues-pull-requests)
  - [Error Handling](#error-handling)
  - [Benefits](#benefits)
  - [Example Usage](#example-usage)
  - [UI Implementation Details](#ui-implementation-details)
    - [Responsive Statistics Grid](#responsive-statistics-grid)
    - [Language Display](#language-display)
    - [Issue/PR Statistics Display](#issuepr-statistics-display)
  - [🇫🇷 Documentation Française](#-documentation-française)
  - [Fonctionnalités Implémentées](#fonctionnalités-implémentées)
    - [1. Statistiques du Dépôt](#1-statistiques-du-dépôt)
    - [2. Informations du Dépôt](#2-informations-du-dépôt)
    - [3. Contenu README](#3-contenu-readme)
  - [Implémentation Technique](#implémentation-technique)
    - [Hooks Créés](#hooks-créés)
      - [Hook `useGitHubRepo`](#hook-usegithubrepo)
      - [Hook `useGitHubReadme`](#hook-usegithubreadme)
    - [Implémentation de l'Affichage](#implémentation-de-laffichage)
      - [Page Détail Projet](#page-détail-projet)
      - [Stylisation Markdown](#stylisation-markdown)
  - [Endpoints API GitHub Utilisés](#endpoints-api-github-utilisés)
    - [1. Récupérer le Dépôt](#1-récupérer-le-dépôt)
    - [2. Récupérer les Langages](#2-récupérer-les-langages)
    - [3-6. Rechercher Issues/PRs](#3-6-rechercher-issuesprs)
    - [7. Récupérer le README](#7-récupérer-le-readme)
  - [Considérations sur les Limites de Taux](#considérations-sur-les-limites-de-taux)
    - [Endpoints API Core (repos, languages, readme)](#endpoints-api-core-repos-languages-readme)
    - [Endpoints API Search (issues, pull requests)](#endpoints-api-search-issues-pull-requests)
  - [Gestion des Erreurs](#gestion-des-erreurs)
  - [Avantages](#avantages)
  - [Détails d'Implémentation UI](#détails-dimplémentation-ui)
    - [Grille Statistiques Responsive](#grille-statistiques-responsive)


</details>

## 🌍 English Version

## Overview
This document explains how the GitHub API was integrated into the AdaVerse project to fetch and display repository data and README content on project detail pages.

---

## 🇫🇷 Version Française

## Vue d'ensemble
Ce document explique comment l'API GitHub a été intégrée dans le projet AdaVerse pour récupérer et afficher les données des dépôts et le contenu README sur les pages de détail des projets.

---

## 🌍 English Documentation

## Features Implemented

### 1. Repository Statistics
Fetches and displays key metrics from GitHub repositories:
- ⭐ **Stars**: Number of GitHub stars
- 🔱 **Forks**: Number of repository forks
- ⚠️ **Issues**: Total issues count with breakdown (open/closed)
- 🔀 **Pull Requests**: Total PRs count with breakdown (open/closed)
- 💻 **Languages**: Top 3-4 programming languages by byte count

### 2. Repository Information
- **Description**: GitHub repository description
- **Topics**: Repository tags/topics (displayed as badges)

### 3. README Content
- Fetches the repository's README file
- Displays it as formatted markdown with proper styling
- Includes syntax highlighting for code blocks

## Technical Implementation

### Hooks Created

#### `useGitHubRepo` Hook
**Location**: `/hooks/useGitHubRepo.ts`

**Purpose**: Fetches repository metadata, language statistics, issue counts, and pull request counts from GitHub API

**How it works**:
1. Extracts owner and repository name from GitHub URL using regex:
   ```typescript
   const match = githubUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
   ```

2. Makes multiple parallel GitHub API calls:
   
   **a) Repository Data**:
   ```
   GET https://api.github.com/repos/{owner}/{repo}
   ```
   Returns: stars, forks, description, topics, etc.

   **b) Languages**:
   ```
   GET https://api.github.com/repos/{owner}/{repo}/languages
   ```
   Returns object with languages as keys and byte counts as values:
   ```json
   {
     "TypeScript": 245678,
     "JavaScript": 98234,
     "CSS": 12456,
     "HTML": 3421
   }
   ```

   **c) Issues Statistics** (using GitHub Search API):
   ```
   GET https://api.github.com/search/issues?q=repo:{owner}/{repo}+type:issue
   GET https://api.github.com/search/issues?q=repo:{owner}/{repo}+type:issue+state:open
   ```
   - First call: total issues count
   - Second call: open issues count
   - Closed count calculated: `total - open`

   **d) Pull Request Statistics** (using GitHub Search API):
   ```
   GET https://api.github.com/search/issues?q=repo:{owner}/{repo}+type:pr
   GET https://api.github.com/search/issues?q=repo:{owner}/{repo}+type:pr+state:open
   ```
   - First call: total PRs count
   - Second call: open PRs count
   - Closed count calculated: `total - open`

3. Returns comprehensive data:
   - `repoData`: Full repository information
   - `languages`: Object with language names and byte counts
   - `issueStats`: `{ total_count, open_count, closed_count }`
   - `pullRequestStats`: `{ total_count, open_count, closed_count }`

**Why GitHub Search API for Issues/PRs?**
- The standard `/repos/{owner}/{repo}` endpoint only provides `open_issues_count`
- This count includes both issues AND pull requests (not separate)
- The Search API allows filtering by:
  - Type: `type:issue` or `type:pr`
  - State: `state:open` or `state:closed`
- This gives accurate, separate counts for issues and PRs

**Example Response**:
```typescript
{
  repoData: {
    name: "my-project",
    description: "A cool project",
    stargazers_count: 42,
    forks_count: 10,
    topics: ["react", "nextjs", "typescript"]
  },
  languages: {
    TypeScript: 245678,
    JavaScript: 98234,
    CSS: 12456,
    HTML: 3421
  },
  issueStats: {
    total_count: 15,
    open_count: 3,
    closed_count: 12
  },
  pullRequestStats: {
    total_count: 8,
    open_count: 1,
    closed_count: 7
  }
}
```

#### `useGitHubReadme` Hook
**Location**: `/hooks/useGitHubReadme.ts`

**Purpose**: Fetches and renders repository README file

**How it works**:
1. Extracts owner and repository name from GitHub URL

2. Calls GitHub API endpoint with special header:
   ```typescript
   fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, {
     headers: {
       'Accept': 'application/vnd.github.html+json'
     }
   })
   ```

3. The `Accept` header tells GitHub to return **pre-rendered HTML** instead of raw markdown
   - This means GitHub handles the markdown-to-HTML conversion
   - Includes syntax highlighting for code blocks
   - Renders tables, images, links, etc.

4. Returns the HTML content as a string

**Why HTML instead of Markdown?**
- GitHub's API can return the README in different formats:
  - Raw markdown: `application/vnd.github.raw+json`
  - Rendered HTML: `application/vnd.github.html+json` ✅ (we use this)
- Pre-rendered HTML is easier to display and already styled by GitHub

### Display Implementation

#### Project Detail Page
**Location**: `/app/[url]/page.tsx`

**Data Flow**:
```
1. User visits /project-name
2. Component finds project by URLName
3. useGitHubRepo hook makes 5 parallel API calls:
   - Fetch repository data
   - Fetch languages
   - Fetch total issues
   - Fetch open issues
   - Fetch total pull requests
   - Fetch open pull requests
4. useGitHubReadme hook fetches README
5. Data is calculated and processed:
   - Top 4 languages sorted by byte count
   - Closed issues = total - open
   - Closed PRs = total - open
6. Data is displayed in responsive flexbox sections
```

**Important**: Hooks are called **before** any conditional returns to follow React's Rules of Hooks:
```typescript
// ✅ Correct - hooks called at top level
const project = listStudentProjects.find(p => p.URLName === url);
const { repoData } = useGitHubRepo(project?.githubRepoURL || '');
const { readme } = useGitHubReadme(project?.githubRepoURL || '');

// ❌ Wrong - would cause "order of hooks" error
if (!project) return <NotFound />;
const { repoData } = useGitHubRepo(project.githubRepoURL);
```

#### Markdown Styling
**Location**: `/app/globals.css`

Custom CSS class `.markdown-content` provides styling for:
- Headings (h1-h6) with proper sizes
- Paragraphs with good spacing
- Links in purple with hover effects
- Code blocks with syntax highlighting
- Tables, lists, blockquotes
- Dark mode support

**Why Custom CSS?**
- Tailwind Typography plugin had compatibility issues with Tailwind v4
- Custom CSS gives full control over styling
- Matches the existing purple theme of the site

## GitHub API Endpoints Used

### 1. Get Repository
```
GET https://api.github.com/repos/{owner}/{repo}
```
**Rate Limit**: 60 requests/hour (unauthenticated)

**Returns**: Full repository metadata (stars, forks, description, topics)

### 2. Get Languages
```
GET https://api.github.com/repos/{owner}/{repo}/languages
```
**Rate Limit**: 60 requests/hour (unauthenticated)

**Returns**: Object mapping programming languages to byte counts
```json
{
  "TypeScript": 245678,
  "JavaScript": 98234,
  "CSS": 12456
}
```

### 3. Search Issues (Total)
```
GET https://api.github.com/search/issues?q=repo:{owner}/{repo}+type:issue
```
**Rate Limit**: 10 requests/minute (unauthenticated)

**Returns**: Total count of all issues (open + closed)

### 4. Search Issues (Open)
```
GET https://api.github.com/search/issues?q=repo:{owner}/{repo}+type:issue+state:open
```
**Rate Limit**: 10 requests/minute (unauthenticated)

**Returns**: Count of open issues

### 5. Search Pull Requests (Total)
```
GET https://api.github.com/search/issues?q=repo:{owner}/{repo}+type:pr
```
**Rate Limit**: 10 requests/minute (unauthenticated)

**Returns**: Total count of all pull requests (open + closed)

### 6. Search Pull Requests (Open)
```
GET https://api.github.com/search/issues?q=repo:{owner}/{repo}+type:pr+state:open
```
**Rate Limit**: 10 requests/minute (unauthenticated)

**Returns**: Count of open pull requests

### 7. Get README
```
GET https://api.github.com/repos/{owner}/{repo}/readme
Headers: Accept: application/vnd.github.html+json
```
**Rate Limit**: 60 requests/hour (unauthenticated)

**Returns**: Pre-rendered README HTML

## Rate Limiting Considerations

GitHub API has different rate limits for different endpoints:

### Core API Endpoints (repos, languages, readme)
- **Unauthenticated**: 60 requests per hour per IP
- **Authenticated**: 5,000 requests per hour

### Search API Endpoints (issues, pull requests)
- **Unauthenticated**: 10 requests per minute (600/hour)
- **Authenticated**: 30 requests per minute (1,800/hour)

**Current Implementation**: Unauthenticated (no token required)

**Impact**: 
- Each project detail page makes 6 API calls (1 repo + 1 languages + 4 search queries + 1 readme)
- Without caching, viewing ~10 different projects would hit the search API limit
- Core endpoints are less restrictive (60/hour limit)

**Recommendations**:
1. **Client-side caching**: Store results in React state/context to avoid re-fetching on navigation
2. **Add authentication** for higher limits (see below)
3. **Server-side caching**: Cache API responses in database or Redis for frequently viewed projects

**To Add Authentication** (optional, for higher limits):
```typescript
fetch(url, {
  headers: {
    'Authorization': `token ${process.env.GITHUB_TOKEN}`,
    'Accept': 'application/vnd.github.html+json'
  }
})
```

## Error Handling

Both hooks handle errors gracefully:
- If repository not found (404): Shows nothing, page continues to work
- If API fails: Logs error, doesn't break the page
- If URL is invalid: Returns null, doesn't crash

## Benefits

1. **Automatic Updates**: Data is always fresh from GitHub
2. **No Database Storage**: Reduces database size and maintenance
3. **Rich Content**: README displays with full formatting
4. **Real-time Stats**: Stars, forks, issues are always current
5. **No Manual Entry**: Project details pulled automatically

## Example Usage

When a project has GitHub URL: `https://github.com/user/awesome-project`

The page will display:

**Statistics Section** (responsive flexbox):
- Stars count
- Forks count
- Issues (total with open/closed breakdown)
- Pull Requests (total with open/closed breakdown)

**Languages Section**:
- Top 3-4 programming languages as blue badges
- Sorted by usage (byte count)

**Repository Info**:
- Description from GitHub
- Topics/tags as badges

**README Section**:
- Full README content with:
  - Formatted text
  - Code blocks with syntax highlighting
  - Images
  - Tables
  - Links

All fetched automatically from GitHub's API!

## UI Implementation Details

### Responsive Statistics Grid
The statistics section uses flexbox with wrap for responsive layout:

```tsx
<div className="flex flex-wrap gap-4">
  {/* Each card has flex-1 with minimum widths */}
  <div className="flex-1 min-w-[calc(50%-0.5rem)] md:min-w-[calc(25%-0.75rem)]">
    {/* Card content */}
  </div>
</div>
```

**Benefits**:
- Cards automatically fill available width
- 2 columns on mobile, 4 columns on desktop
- When issues or PRs are missing, remaining cards expand proportionally
- No awkward gaps or fixed widths

### Language Display
Languages are sorted and limited to top 4:
```typescript
const topLanguages = languages 
  ? Object.entries(languages)
      .sort((a, b) => b[1] - a[1])  // Sort by byte count descending
      .slice(0, 4)                   // Take top 4
      .map(([lang]) => lang)         // Extract language names
  : [];
```

### Issue/PR Statistics Display
Each stat card shows:
- Total count (large, bold)
- Breakdown text (small, muted): "X ouvertes · Y fermées"
```tsx
<p className="text-2xl font-bold">{issueStats.total_count}</p>
<p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
  {issueStats.open_count} ouvertes · {issueStats.closed_count} fermées
</p>
```

---

## 🇫🇷 Documentation Française

## Fonctionnalités Implémentées

### 1. Statistiques du Dépôt
Récupère et affiche les métriques clés des dépôts GitHub:
- ⭐ **Stars**: Nombre d'étoiles GitHub
- 🔱 **Forks**: Nombre de forks du dépôt
- ⚠️ **Issues**: Nombre total d'issues avec détail (ouvertes/fermées)
- 🔀 **Pull Requests**: Nombre total de PRs avec détail (ouvertes/fermées)
- 💻 **Langages**: Top 3-4 langages de programmation par nombre d'octets

### 2. Informations du Dépôt
- **Description**: Description du dépôt GitHub
- **Topics**: Tags/topics du dépôt (affichés comme badges)

### 3. Contenu README
- Récupère le fichier README du dépôt
- L'affiche comme markdown formaté avec style approprié
- Inclut la coloration syntaxique pour les blocs de code

## Implémentation Technique

### Hooks Créés

#### Hook `useGitHubRepo`
**Emplacement**: `/hooks/useGitHubRepo.ts`

**Objectif**: Récupère les métadonnées du dépôt, les statistiques de langages, le nombre d'issues et de pull requests depuis l'API GitHub

**Comment ça fonctionne**:
1. Extrait le propriétaire et le nom du dépôt depuis l'URL GitHub avec regex:
   ```typescript
   const match = githubUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
   ```

2. Fait plusieurs appels API GitHub en parallèle:
   
   **a) Données du Dépôt**:
   ```
   GET https://api.github.com/repos/{owner}/{repo}
   ```
   Retourne: stars, forks, description, topics, etc.

   **b) Langages**:
   ```
   GET https://api.github.com/repos/{owner}/{repo}/languages
   ```
   Retourne un objet avec les langages comme clés et les nombres d'octets comme valeurs:
   ```json
   {
     "TypeScript": 245678,
     "JavaScript": 98234,
     "CSS": 12456,
     "HTML": 3421
   }
   ```

   **c) Statistiques Issues** (utilisant l'API GitHub Search):
   ```
   GET https://api.github.com/search/issues?q=repo:{owner}/{repo}+type:issue
   GET https://api.github.com/search/issues?q=repo:{owner}/{repo}+type:issue+state:open
   ```
   - Premier appel: nombre total d'issues
   - Deuxième appel: nombre d'issues ouvertes
   - Nombre fermé calculé: `total - ouvert`

   **d) Statistiques Pull Requests** (utilisant l'API GitHub Search):
   ```
   GET https://api.github.com/search/issues?q=repo:{owner}/{repo}+type:pr
   GET https://api.github.com/search/issues?q=repo:{owner}/{repo}+type:pr+state:open
   ```
   - Premier appel: nombre total de PRs
   - Deuxième appel: nombre de PRs ouvertes
   - Nombre fermé calculé: `total - ouvert`

3. Retourne des données complètes:
   - `repoData`: Informations complètes du dépôt
   - `languages`: Objet avec noms de langages et nombres d'octets
   - `issueStats`: `{ total_count, open_count, closed_count }`
   - `pullRequestStats`: `{ total_count, open_count, closed_count }`

**Pourquoi l'API Search GitHub pour Issues/PRs?**
- L'endpoint standard `/repos/{owner}/{repo}` ne fournit que `open_issues_count`
- Ce compte inclut à la fois les issues ET les pull requests (pas séparément)
- L'API Search permet de filtrer par:
  - Type: `type:issue` ou `type:pr`
  - État: `state:open` ou `state:closed`
- Cela donne des comptes précis et séparés pour les issues et PRs

**Exemple de Réponse**:
```typescript
{
  repoData: {
    name: "mon-projet",
    description: "Un super projet",
    stargazers_count: 42,
    forks_count: 10,
    topics: ["react", "nextjs", "typescript"]
  },
  languages: {
    TypeScript: 245678,
    JavaScript: 98234,
    CSS: 12456,
    HTML: 3421
  },
  issueStats: {
    total_count: 15,
    open_count: 3,
    closed_count: 12
  },
  pullRequestStats: {
    total_count: 8,
    open_count: 1,
    closed_count: 7
  }
}
```

#### Hook `useGitHubReadme`
**Emplacement**: `/hooks/useGitHubReadme.ts`

**Objectif**: Récupère et rend le fichier README du dépôt

**Comment ça fonctionne**:
1. Extrait le propriétaire et le nom du dépôt depuis l'URL GitHub

2. Appelle l'endpoint API GitHub avec un en-tête spécial:
   ```typescript
   fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, {
     headers: {
       'Accept': 'application/vnd.github.html+json'
     }
   })
   ```

3. L'en-tête `Accept` indique à GitHub de retourner du **HTML pré-rendu** au lieu du markdown brut
   - Cela signifie que GitHub gère la conversion markdown-vers-HTML
   - Inclut la coloration syntaxique pour les blocs de code
   - Rend les tableaux, images, liens, etc.

4. Convertit les URLs d'images relatives en URLs absolues GitHub
   - Les images comme `./images/screenshot.png` deviennent
   - `https://raw.githubusercontent.com/{owner}/{repo}/main/images/screenshot.png`
   - Avec fallback automatique vers la branche `master` si `main` échoue

5. Retourne le contenu HTML comme chaîne

**Pourquoi HTML au lieu de Markdown?**
- L'API GitHub peut retourner le README dans différents formats:
  - Markdown brut: `application/vnd.github.raw+json`
  - HTML rendu: `application/vnd.github.html+json` ✅ (nous utilisons celui-ci)
- Le HTML pré-rendu est plus facile à afficher et déjà stylisé par GitHub

### Implémentation de l'Affichage

#### Page Détail Projet
**Emplacement**: `/app/[url]/page.tsx`

**Flux de Données**:
```
1. L'utilisateur visite /nom-projet
2. Le composant trouve le projet par URLName
3. Le hook useGitHubRepo fait 6 appels API parallèles:
   - Récupère les données du dépôt
   - Récupère les langages
   - Récupère le total des issues
   - Récupère les issues ouvertes
   - Récupère le total des pull requests
   - Récupère les pull requests ouvertes
4. Le hook useGitHubReadme récupère le README
5. Les données sont calculées et traitées:
   - Top 4 langages triés par nombre d'octets
   - Issues fermées = total - ouvertes
   - PRs fermées = total - ouvertes
6. Les données sont affichées en sections flexbox responsives
```

**Important**: Les hooks sont appelés **avant** tout retour conditionnel pour suivre les Règles des Hooks de React:
```typescript
// ✅ Correct - hooks appelés au niveau supérieur
const project = listStudentProjects.find(p => p.URLName === url);
const { repoData } = useGitHubRepo(project?.githubRepoURL || '');
const { readme } = useGitHubReadme(project?.githubRepoURL || '');

// ❌ Incorrect - causerait une erreur "order of hooks"
if (!project) return <NotFound />;
const { repoData } = useGitHubRepo(project.githubRepoURL);
```

#### Stylisation Markdown
**Emplacement**: `/app/globals.css`

La classe CSS personnalisée `.markdown-content` fournit le style pour:
- Titres (h1-h6) avec tailles appropriées
- Paragraphes avec bon espacement
- Liens avec couleurs GitHub et effets hover
- Blocs de code avec coloration syntaxique
- Tableaux, listes, blockquotes
- Support du mode sombre
- Images avec support des attributs HTML (`align`, `width`, `height`)

**Pourquoi CSS Personnalisé?**
- Le plugin Tailwind Typography avait des problèmes de compatibilité avec Tailwind v4
- Le CSS personnalisé donne un contrôle total sur le style
- Correspond exactement au style de prévisualisation GitHub

## Endpoints API GitHub Utilisés

### 1. Récupérer le Dépôt
```
GET https://api.github.com/repos/{owner}/{repo}
```
**Limite de Taux**: 60 requêtes/heure (non authentifié)

**Retourne**: Métadonnées complètes du dépôt (stars, forks, description, topics)

### 2. Récupérer les Langages
```
GET https://api.github.com/repos/{owner}/{repo}/languages
```
**Limite de Taux**: 60 requêtes/heure (non authentifié)

**Retourne**: Objet mappant les langages de programmation aux nombres d'octets

### 3-6. Rechercher Issues/PRs
Voir la version anglaise pour les détails des endpoints de recherche.

### 7. Récupérer le README
```
GET https://api.github.com/repos/{owner}/{repo}/readme
Headers: Accept: application/vnd.github.html+json
```
**Limite de Taux**: 60 requêtes/heure (non authentifié)

**Retourne**: HTML README pré-rendu

## Considérations sur les Limites de Taux

L'API GitHub a différentes limites de taux pour différents endpoints:

### Endpoints API Core (repos, languages, readme)
- **Non authentifié**: 60 requêtes par heure par IP
- **Authentifié**: 5,000 requêtes par heure

### Endpoints API Search (issues, pull requests)
- **Non authentifié**: 10 requêtes par minute (600/heure)
- **Authentifié**: 30 requêtes par minute (1,800/heure)

**Implémentation Actuelle**: Non authentifiée (pas de token requis)

**Impact**: 
- Chaque page de détail de projet fait 6 appels API
- Sans mise en cache, visiter ~10 projets différents atteindrait la limite de l'API Search
- Les endpoints Core sont moins restrictifs (limite de 60/heure)

**Recommandations**:
1. **Mise en cache côté client**: Stocker les résultats dans l'état/context React
2. **Ajouter l'authentification** pour des limites plus élevées
3. **Mise en cache côté serveur**: Mettre en cache les réponses API en base de données ou Redis

## Gestion des Erreurs

Les deux hooks gèrent les erreurs gracieusement:
- Si le dépôt n'est pas trouvé (404): N'affiche rien, la page continue de fonctionner
- Si l'API échoue: Log l'erreur, ne casse pas la page
- Si l'URL est invalide: Retourne null, ne plante pas

## Avantages

1. **Mises à jour Automatiques**: Les données sont toujours fraîches depuis GitHub
2. **Pas de Stockage en Base**: Réduit la taille et la maintenance de la base de données
3. **Contenu Riche**: Le README s'affiche avec formatage complet
4. **Stats en Temps Réel**: Stars, forks, issues toujours à jour
5. **Pas de Saisie Manuelle**: Détails du projet récupérés automatiquement

## Détails d'Implémentation UI

### Grille Statistiques Responsive
La section statistiques utilise flexbox avec wrap pour un layout responsive:

```tsx
<div className="flex flex-wrap gap-4">
  {/* Chaque carte a flex-1 avec largeurs minimales */}
  <div className="flex-1 min-w-[calc(50%-0.5rem)] md:min-w-[calc(25%-0.75rem)]">
    {/* Contenu de la carte */}
  </div>
</div>
```

**Avantages**:
- Les cartes remplissent automatiquement la largeur disponible
- 2 colonnes sur mobile, 4 colonnes sur desktop
- Quand issues ou PRs manquent, les cartes restantes s'étendent proportionnellement
- Pas d'espaces gênants ou de largeurs fixes

---

**Last Updated / Dernière mise à jour**: December 3, 2025
