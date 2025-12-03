# Complete Workflows / Workflows Complets

<details>

<summary>Table of contents</summary>

- [Complete Workflows / Workflows Complets](#complete-workflows--workflows-complets)
  - [🌍 English Version](#-english-version)
    - [1. Student Project Submission Workflow](#1-student-project-submission-workflow)
    - [2. Admin Project Review Workflow](#2-admin-project-review-workflow)
    - [3. Project Approval Execution Workflow](#3-project-approval-execution-workflow)
    - [4. Project Display Workflow](#4-project-display-workflow)
    - [5. Project Detail Workflow](#5-project-detail-workflow)
    - [6. CSV Import Workflow](#6-csv-import-workflow)
  - [🇫🇷 Version Française](#-version-française)
    - [1. Workflow de Soumission de Projet Étudiant](#1-workflow-de-soumission-de-projet-étudiant)
    - [2. Workflow de Révision Admin](#2-workflow-de-révision-admin)
    - [3. Workflow d'Exécution d'Approbation](#3-workflow-dexécution-dapprobation)
    - [4. Workflow d'Affichage de Projet](#4-workflow-daffichage-de-projet)
    - [5. Workflow de Page Détail Projet](#5-workflow-de-page-détail-projet)
    - [6. Workflow d'Import CSV](#6-workflow-dimport-csv)

</details>

## 🌍 English Version

### 1. Student Project Submission Workflow

```
┌─────────────────────────────────────────────────────────────┐
│                    PROJECT SUBMISSION                       │
└─────────────────────────────────────────────────────────────┘

Step 1: Student Opens Form
    │
    ├──> Clicks "Ajouter un projet" button (Navigation)
    └──> AddProjectModal component opens
              │
              └──> Form fields displayed:
                   ├── Title
                   ├── GitHub URL
                   ├── Demo URL
                   ├── Ada Project (dropdown)
                   └── Students (multi-select)

Step 2: Form Validation
    │
    ├──> Client-side validation:
    │    ├── Required fields check 
    │    ├── URL format validation
    │    └── Student selection validation
    │
    └──> Generate URLName from title
         (e.g., "My Project" → "my-project")

Step 3: Submit to API
    │
    POST /api/pending-project
    {
      title: "AdaCheck Event",
      URLName: "adacheck-event",
      githubRepoURL: "https://github.com/...",
      demoURL: "https://...",
      image: "https://...",
      adaProjectID: 4,
      studentIds: "1,2",
      publishedAt: "2025-11-26"
    }
              │
              └──> Server-side validation:
                   ├── Check duplicate GitHub URL
                   │   ├── Search in projects_students
                   │   └── Search in pending_projects
                   ├── Validate Ada Project ID exists
                   └── Validate student IDs exist

Step 4: Database Insert
    │
    └──> INSERT INTO pending_projects (...)
         VALUES (...)
              │
              └──> Return success response

Step 5: User Feedback
    │
    └──> Display confirmation:
         "✅ Projet ajouté à la liste d'attente pour approbation!"
              │
              └──> Modal closes
                   └──> Project now in pending state
```

**Error Cases**:
- Duplicate GitHub URL → 409 Conflict
- Invalid Ada Project ID → 400 Bad Request
- Network error → Display error message

---

### 2. Admin Project Review Workflow

```
┌─────────────────────────────────────────────────────────────┐
│                     PROJECT REVIEW                          │
└─────────────────────────────────────────────────────────────┘

Step 1: Admin Navigates to Review Page
    │
    └──> Visit /admin/approve-projects
              │
              └──> GET /api/pending-project
                   │
                   └──> Return all pending projects

Step 2: Review Interface Loads
    │
    └──> Display pending projects:
         ┌─────────────────────────────────┐
         │ AdaCheck Event - Alice & Bob    │
         │ GitHub: github.com/...          │
         │ Students: 1,2                   │
         │ Submitted: 26/11/2025           │
         │ [Approve] [Reject]              │
         └─────────────────────────────────┘

Step 3A: Admin Approves Project
    │
    ├──> Click "Approuver" button
    │
    POST /api/pending-project/approve?id=1
              │
              ├──> Fetch pending project data
              ├──> Parse student IDs ("1,2" → [1, 2])
              │
              └──> Generate SQL statements:
                   ┌────────────────────────────────┐
                   │ DO $$                          │
                   │ DECLARE project_id INT;        │
                   │ BEGIN                          │
                   │   INSERT INTO projects_students│
                   │   VALUES (...);                │
                   │   RETURNING id INTO project_id;│
                   │                                │
                   │   INSERT INTO student_to_proj..│
                   │   VALUES (1, project_id);      │
                   │                                │
                   │   INSERT INTO student_to_proj..│
                   │   VALUES (2, project_id);      │
                   │                                │
                   │   DELETE FROM pending_projects │
                   │   WHERE id = 1;                │
                   │ END $$;                        │
                   └────────────────────────────────┘
                             │
                             └──> Append to:
                                  lib/db/migrations/
                                  005_approved_projects.sql

Step 3B: Admin Rejects Project
    │
    ├──> Click "Rejeter" button
    ├──> Confirmation: "Are you sure?"
    │
    DELETE /api/pending-project?id=1
              │
              └──> DELETE FROM pending_projects
                   WHERE id = 1
                        │
                        └──> Project permanently removed

Step 4: Feedback
    │
    ├──> Approval: "✅ Projet approuvé ! Exécutez 'npm run approve'"
    └──> Rejection: "Project rejected and removed"
```

---

### 3. Project Approval Execution Workflow

```
┌─────────────────────────────────────────────────────────────┐
│                   APPROVAL EXECUTION                        │
└─────────────────────────────────────────────────────────────┘

Step 1: Admin Runs Command
    │
    $ npm run approve
              │
              └──> Executes: tsx lib/db/approve-projects.ts

Step 2: Read SQL File
    │
    └──> Read: lib/db/migrations/005_approved_projects.sql
              │
              └──> Contains all approved project SQL blocks

Step 3: Execute SQL
    │
    └──> db.execute(sql.raw(sqlContent))
              │
              ├──> Transaction begins
              │
              ├──> For each project:
              │    ├── INSERT INTO projects_students
              │    │        └──> Returns new project_id
              │    ├── INSERT INTO student_to_projects (student 1)
              │    ├── INSERT INTO student_to_projects (student 2)
              │    └── DELETE FROM pending_projects
              │
              └──> Transaction commits

Step 4: Clean Up
    │
    └──> Clear 005_approved_projects.sql
         └──> Write header comment only:
              "-- Approved projects will be added here"

Step 5: Success
    │
    └──> Console output:
         ✅ All approved projects added to database!
         🧹 Cleared the approved projects file
              │
              └──> Projects now visible on site!
```

---

### 4. Project Display Workflow

```
┌─────────────────────────────────────────────────────────────┐
│                    PROJECT DISPLAY                          │
└─────────────────────────────────────────────────────────────┘

Step 1: User Visits Homepage
    │
    └──> app/page.tsx loads
              │
              ├──> useAdaProjects() → Fetch categories
              ├──> useAdaPromotions() → Fetch promotions
              ├──> useStudents() → Fetch students
              └──> useStudentProjects() → Fetch projects
                        │
                        └──> GET /api/student-project
                             │
                             └──> SELECT * FROM projects_students
                                  JOIN student_to_projects
                                  JOIN students
                                       │
                                       └──> Return complete project data

Step 2: Data Processing
    │
    ├──> Sort by publishedAt (ascending)
    ├──> Group by Ada Project category
    └──> Filter by promotion (if selected)

Step 3: Render Projects
    │
    └──> For each project:
         └──> <ProjectCard
              title={project.title}
              image={project.image}
              students={project.students}
              githubUrl={project.githubRepoURL}
              demoUrl={project.demoURL}
              />

Step 4: User Clicks Project
    │
    └──> Navigate to /project-url-name
              │
              └──> See "Project Detail Workflow" below
```

---

### 5. Project Detail Workflow

```
┌─────────────────────────────────────────────────────────────┐
│                   PROJECT DETAIL PAGE                       │
└─────────────────────────────────────────────────────────────┘

Step 1: Load Project Data
    │
    └──> app/[url]/page.tsx
              │
              └──> Find project by URLName from context

Step 2: Fetch GitHub Data (Parallel)
    │
    ├──> useGitHubRepo(githubRepoURL)
    │     │
    │     └──> 6 Parallel API Calls:
    │          │
    │          ├── GET /repos/{owner}/{repo}
    │          │   └──> stars, forks, description, topics
    │          │
    │          ├── GET /repos/{owner}/{repo}/languages
    │          │   └──> { TypeScript: 245678, ... }
    │          │
    │          ├── GET /search/issues?type=issue
    │          │   └──> total_count
    │          │
    │          ├── GET /search/issues?type=issue&state=open
    │          │   └──> open_count
    │          │        └──> closed_count = total - open
    │          │
    │          ├── GET /search/issues?type=pr
    │          │   └──> total_count
    │          │
    │          └── GET /search/issues?type=pr&state=open
    │              └──> open_count
    │                   └──> closed_count = total - open
    │
    └──> useGitHubReadme(githubRepoURL)
          │
          └──> GET /repos/{owner}/{repo}/readme
               (Accept: application/vnd.github.html+json)
                    │
                    └──> Returns pre-rendered HTML

Step 3: Process Data
    │
    ├──> Top 4 languages:
    │    └──> Sort languages by bytes descending
    │         └──> Take first 4
    │
    ├──> Issue stats:
    │    └──> Calculate closed count
    │
    └──> PR stats:
         └──> Calculate closed count

Step 4: Render Sections
    │
    ├──> Project Header (title, image)
    ├──> Project Info (dates, promotion, students)
    ├──> GitHub Stats (responsive flexbox)
    │    ├── Stars card
    │    ├── Forks card
    │    ├── Issues card (with breakdown)
    │    └── PRs card (with breakdown)
    ├──> Languages (top 4 as badges)
    ├──> Description (from GitHub)
    ├──> README (rendered markdown)
    ├──> Topics (as badges)
    └──> Action Buttons (GitHub link, Demo link)

Step 5: User Interaction
    │
    ├──> Click "View Source" → Opens GitHub repo
    └──> Click "View Demo" → Opens demo URL
```

**Performance Optimization**:
- GitHub API calls are parallel (not sequential)
- React Context caches project data
- No re-fetch on navigation back to homepage

---

### 6. CSV Import Workflow

```
┌─────────────────────────────────────────────────────────────┐
│                      CSV IMPORT                             │
└─────────────────────────────────────────────────────────────┘

Step 1: Prepare CSV File
    │
    └──> Format:
         Promotion,Participants,Category,Title,GitHub URL,Demo URL,Has Thumbnail
         Ada 2024,Alice Dupont,Pico-8,My Game,https://...,https://...,oui

Step 2: Run Import Command
    │
    $ npm run import-csv path/to/file.csv
              │
              └──> Executes: tsx lib/db/import-csv.ts

Step 3: Parse CSV
    │
    ├──> Find header row
    ├──> Parse each data row
    └──> Handle quoted fields and commas

Step 4: For Each Row
    │
    ├──> Check for duplicate GitHub URL
    │    ├── In projects_students
    │    └── In pending_projects
    │         └──> If found: Skip row
    │
    ├──> Match Ada Project category
    │    ├──> Normalize category name
    │    ├──> Check category map:
    │    │     "adaopte/adaence" → "adaopte - adaence"
    │    ├──> Exact match search
    │    ├──> Fuzzy match search
    │    └──> Default to "Projet Libre" if not found
    │
    ├──> Match Students by name
    │    ├──> Parse participant names
    │    ├──> Normalize each name
    │    ├──> Search in students table
    │    └──> Collect student IDs
    │
    ├──> Generate unique URLName
    │    └──> Check against existing projects
    │
    ├──> Check for thumbnail image
    │    └──> HEAD request to GitHub URL/blob/main/thumbnail.png
    │
    └──> Insert into pending_projects

Step 5: Summary
    │
    └──> Console output:
         ✅ Successfully imported: 15 projects
         ⚠️  Skipped: 3 projects (duplicates)
              │
              └──> Projects ready for admin review!
```

**Category Mapping Examples**:
- "Adaopte/Adaence" → "Adaopte - Adaence"
- "checkevents" → "adacheck"
- "quizz" → "adaquiz"
- "projets libres" → "projet libre"

---

## 🇫🇷 Version Française

### 1. Workflow de Soumission de Projet Étudiant

```
┌─────────────────────────────────────────────────────────────┐
│                  SOUMISSION DE PROJET                       │
└─────────────────────────────────────────────────────────────┘

Étape 1: Étudiant Ouvre le Formulaire
    │
    ├──> Clic sur "Ajouter un projet" (Navigation)
    └──> Le composant AddProjectModal s'ouvre
              │
              └──> Champs du formulaire affichés:
                   ├── Titre
                   ├── URL GitHub
                   ├── URL Démo
                   ├── Projet Ada (liste déroulante)
                   └── Étudiants (sélection multiple)

Étape 2: Validation du Formulaire
    │
    ├──> Validation côté client:
    │    ├── Vérification des champs requis
    │    ├── Validation du format URL
    │    └── Validation de la sélection d'étudiants
    │
    └──> Génération URLName depuis le titre
         (ex: "Mon Projet" → "mon-projet")

Étape 3: Envoi à l'API
    │
    POST /api/pending-project
    {
      title: "AdaCheck Event",
      URLName: "adacheck-event",
      githubRepoURL: "https://github.com/...",
      demoURL: "https://...",
      image: "https://...",
      adaProjectID: 4,
      studentIds: "1,2",
      publishedAt: "2025-11-26"
    }
              │
              └──> Validation côté serveur:
                   ├── Vérifier URL GitHub dupliquée
                   │   ├── Recherche dans projects_students
                   │   └── Recherche dans pending_projects
                   ├── Valider que l'ID Projet Ada existe
                   └── Valider que les IDs étudiants existent

Étape 4: Insertion en Base de Données
    │
    └──> INSERT INTO pending_projects (...)
         VALUES (...)
              │
              └──> Retourne une réponse de succès

Étape 5: Retour Utilisateur
    │
    └──> Affiche la confirmation:
         "✅ Projet ajouté à la liste d'attente pour approbation!"
              │
              └──> Le modal se ferme
                   └──> Projet maintenant en attente
```

**Cas d'Erreur**:
- URL GitHub dupliquée → 409 Conflict
- ID Projet Ada invalide → 400 Bad Request
- Erreur réseau → Afficher message d'erreur

---

### 2. Workflow de Révision Admin

Voir la version anglaise pour le diagramme complet.

**Points Clés**:
- L'admin visite `/admin/approve-projects`
- Révise chaque projet en attente
- Peut **Approuver** (génère SQL) ou **Rejeter** (supprime)
- Les projets approuvés ne sont pas encore en base de données
- Nécessite l'exécution de `npm run approve`

---

### 3. Workflow d'Exécution d'Approbation

Voir la version anglaise pour le diagramme complet.

**Étapes**:
1. Admin exécute `npm run approve`
2. Lecture du fichier SQL `005_approved_projects.sql`
3. Exécution de toutes les instructions SQL
4. Nettoyage du fichier pour la prochaine fois
5. Les projets apparaissent sur le site!

---

### 4. Workflow d'Affichage de Projet

Voir la version anglaise pour le flux complet.

**Résumé**:
- Utilisateur visite la page d'accueil
- Tous les contexts chargent les données
- Projets triés par date de publication
- Projets groupés par catégorie Ada
- Affichage via composant ProjectCard

---

### 5. Workflow de Page Détail Projet

Voir la version anglaise pour le flux complet.

**Fonctionnalités**:
- Chargement des données du projet depuis le context
- 6 appels API GitHub en parallèle
- Traitement des langages (top 4)
- Calcul des statistiques issues/PRs
- Affichage du README avec formatage GitHub
- Interface responsive avec flexbox

---

### 6. Workflow d'Import CSV

Voir la version anglaise pour le flux complet.

**Mappages de Catégories**:
- "Adaopte/Adaence" → "Adaopte - Adaence"
- "checkevents" → "adacheck"
- "quizz" → "adaquiz"
- "projets libres" → "projet libre"

**Validation**:
- Vérifie les URLs GitHub dupliquées
- Fait correspondre les catégories avec fuzzy matching
- Recherche les étudiants par nom normalisé
- Génère des URLNames uniques
- Vérifie l'existence des images thumbnail

---

**Last Updated / Dernière mise à jour**: December 3, 2025
