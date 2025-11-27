# 📚 Système d'Approbation de Projets - Guide Pédagogique

## 🎯 Vue d'ensemble

Ce système permet aux étudiants de soumettre leurs projets via un formulaire web, puis à un administrateur de les approuver avant qu'ils n'apparaissent sur le site. C'est un **système de validation en deux étapes** qui garantit le contrôle qualité.

---

## 🏗️ Architecture du Système

### Tables de Base de Données

```
┌─────────────────────┐
│  pending_projects   │  ← Projets en attente
│  (temporaire)       │
└─────────────────────┘
          ↓ (après approbation)
┌─────────────────────┐
│ projects_students   │  ← Projets validés
│  (permanent)        │
└─────────────────────┘
          ↓ (lien avec les étudiants)
┌─────────────────────┐
│ student_to_projects │  ← Relations étudiants-projets
└─────────────────────┘
```

---

## 📝 Étape 1 : Soumission d'un Projet (Utilisateur)

### Où ?
Sur n'importe quelle page du site, cliquez sur le bouton **"Ajouter un projet"** dans la barre de navigation.

### Que se passe-t-il ?

1. **Ouverture du modal** (`AddProjectModal.tsx`)
   - Formulaire avec tous les champs nécessaires
   
2. **Remplissage du formulaire**
   ```
   Titre: "AdaCheck Event - Alexis & Samir"
   URL Name: "adacheck-event-alexis-samir"
   GitHub URL: "https://github.com/adatechschool/AdaCheckEvent-Alexis-Samir"
   Demo URL: "ada-check-event-alexis-samir.vercel.app"
   Image: (URL de l'image)
   Ada Project ID: 4 (AdaCheck)
   Student IDs: "1,2" (Alexis = 1, Samir = 2)
   Date de publication: 2025-11-26
   ```

3. **Clic sur "Ajouter le projet"**

4. **Envoi API** (`POST /api/pending-project`)
   ```typescript
   fetch('/api/pending-project', {
     method: 'POST',
     body: JSON.stringify(formData)
   })
   ```

5. **Sauvegarde en base**
   - Le projet est ajouté dans la table `pending_projects`
   - ⚠️ **PAS** dans `projects_students` (pas encore validé!)

6. **Confirmation utilisateur**
   - Message: "✅ Projet ajouté à la liste d'attente pour approbation !"

### Code technique

```typescript
// Dans AddProjectModal.tsx
const handleSubmit = async (e: React.FormEvent) => {
  const res = await fetch('/api/pending-project', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.NEXT_PUBLIC_API_KEY || '',
    },
    body: JSON.stringify(formData),
  });
  
  if (res.ok) {
    alert('✅ Projet ajouté à la liste d\'attente !');
  }
};
```

---

## 🔍 Étape 2 : Révision des Projets (Admin)

### Que voit l'admin ?

```
┌─────────────────────────────────────────┐
│ Projets en attente d'approbation        │
├─────────────────────────────────────────┤
│ AdaCheck Event - Alexis & Samir         │
│ URL: adacheck-event-alexis-samir        │
│ GitHub: github.com/...                  │
│ Students: 1,2                           │
│ Soumis le: 26/11/2025 14:30           │
│                                         │
│ [Approuver] [Rejeter]                  │
└─────────────────────────────────────────┘
```

### Comment ça fonctionne ?

1. **Chargement de la page**
   ```typescript
   // Dans AddProjectContext.tsx
   const fetchPendingProjects = async () => {
     const res = await fetch('/api/pending-project');
     const data = await res.json();
     setPendingProjects(data); // Affiche tous les projets en attente
   };
   ```

2. **L'admin a 2 choix**

---

## ✅ Étape 3A : Approuver un Projet

### Que se passe-t-il quand on clique "Approuver" ?

1. **Appel API** (`POST /api/pending-project/approve?id=1`)

2. **Génération de SQL**
   Le serveur crée des instructions SQL et les **ajoute** au fichier:
   ```
   lib/db/migrations/005_approved_projects.sql
   ```

3. **Contenu du fichier SQL généré**
   ```sql
   -- Project ID 1: AdaCheck Event - Alexis & Samir
   DO $$
   DECLARE
     project_id INT;
   BEGIN
     -- Insérer le projet
     INSERT INTO projects_students (
       title, image, url_name, ada_project_id, 
       github_repo_url, demo_url, published_at
     )
     VALUES (
       'AdaCheck Event - Alexis & Samir',
       '',
       'adacheck-event-alexis-samir',
       4,
       'https://github.com/adatechschool/AdaCheckEvent-Alexis-Samir',
       'ada-check-event-alexis-samir.vercel.app',
       '2025-11-26'
     )
     RETURNING id INTO project_id;
     
     -- Lier Alexis (ID 1) au projet
     INSERT INTO student_to_projects (student_id, project_student_id)
     VALUES (1, project_id);
     
     -- Lier Samir (ID 2) au projet
     INSERT INTO student_to_projects (student_id, project_student_id)
     VALUES (2, project_id);
     
     -- Nettoyer la table temporaire
     DELETE FROM pending_projects WHERE id = 1;
   END $$;
   ```

4. **Confirmation**
   - Message: "✅ Projet approuvé ! Exécutez 'npm run approve' pour appliquer les changements."
   - Le projet reste dans `pending_projects` (pas encore dans la base finale)

### Code technique

```typescript
// Dans app/api/pending-project/approve/route.ts
export async function POST(request: NextRequest) {
  // 1. Récupérer le projet en attente
  const pendingProject = await db.select()
    .from(PendingProjects)
    .where(eq(PendingProjects.id, parseInt(id)));
  
  // 2. Générer le SQL
  const sqlStatements = [
    `DO $$`,
    `DECLARE project_id INT;`,
    `BEGIN`,
    `  INSERT INTO projects_students (...) VALUES (...)`,
    `  RETURNING id INTO project_id;`,
    `  INSERT INTO student_to_projects VALUES (1, project_id);`,
    `  DELETE FROM pending_projects WHERE id = ${id};`,
    `END $$;`
  ];
  
  // 3. Ajouter au fichier SQL
  const sqlFilePath = join(process.cwd(), 'lib', 'db', 'migrations', '005_approved_projects.sql');
  fs.appendFileSync(sqlFilePath, sqlStatements.join('\n'));
  
  return NextResponse.json({ success: true });
}
```

---

## ❌ Étape 3B : Rejeter un Projet

### Que se passe-t-il quand on clique "Rejeter" ?

1. **Confirmation**
   - Popup: "Êtes-vous sûr de vouloir rejeter ce projet ?"

2. **Appel API** (`DELETE /api/pending-project?id=1`)

3. **Suppression**
   ```typescript
   await db.delete(PendingProjects)
     .where(eq(PendingProjects.id, parseInt(id)));
   ```

4. **Résultat**
   - Le projet est **supprimé définitivement** de `pending_projects`
   - ❌ Aucun SQL généré
   - ❌ Le projet n'apparaîtra jamais sur le site

---

## 🚀 Étape 4 : Exécution des Projets Approuvés

### Commande

```bash
npm run approve
```

### Que fait cette commande ?

1. **Lecture du fichier SQL**
   ```typescript
   // Dans lib/db/approve-projects.ts
   const sqlContent = readFileSync(
     'lib/db/migrations/005_approved_projects.sql', 
     'utf-8'
   );
   ```

2. **Exécution en base de données**
   ```typescript
   await db.execute(sql.raw(sqlContent));
   ```
   
   Cela exécute **TOUS** les blocs SQL d'un coup:
   - Insère dans `projects_students`
   - Crée les liens dans `student_to_projects`
   - Supprime de `pending_projects`

3. **Nettoyage du fichier**
   ```typescript
   // Vider le fichier pour la prochaine fois
   writeFileSync(
     sqlFilePath, 
     '-- Approved projects will be added here\n\n'
   );
   ```

4. **Résultat**
   - ✅ Projets visibles sur le site
   - ✅ Fichier SQL prêt pour les prochaines approbations

### Console output

```bash
$ npm run approve

📂 Reading approved projects SQL file...
🚀 Executing approved projects...
✅ All approved projects have been added to the database!
🧹 Cleared the approved projects file
```

---

## 🔄 Flux Complet (Diagramme)

```
┌─────────────────┐
│   UTILISATEUR   │
└────────┬────────┘
         │ Remplit le formulaire
         ↓
┌─────────────────┐
│ pending_projects│ ← Stockage temporaire
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│      ADMIN      │ Va sur /admin/approve-projects
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ↓         ↓
[Approuver] [Rejeter]
    │         │
    │         └──→ DELETE ❌ Supprimé
    │
    ↓
005_approved_projects.sql
    │ (Instructions SQL ajoutées)
    │
    ↓
ADMIN exécute: npm run approve
    │
    ↓
┌─────────────────────┐
│ projects_students   │ ✅ Projet ajouté
│ student_to_projects │ ✅ Liens créés
│ pending_projects    │ ✅ Nettoyé
└─────────────────────┘
    │
    ↓
🎉 PROJET VISIBLE SUR LE SITE !
```

---

## 🛡️ Pourquoi Ce Système ?

### Sécurité
- ❌ **Pas d'API directe** pour ajouter des projets au site
- ✅ Tous les projets passent par une **validation manuelle**
- ✅ L'admin contrôle **quand** les projets sont ajoutés (via `npm run approve`)

### Contrôle Qualité
- ✅ Vérifier que le GitHub repo existe
- ✅ Vérifier que le demo URL fonctionne
- ✅ Vérifier les student IDs
- ✅ Corriger les fautes de frappe dans les titres

### Flexibilité
- ✅ **Batch approval**: Approuver 10 projets, puis exécuter une seule fois
- ✅ **Révision facile**: Le SQL généré est lisible et modifiable
- ✅ **Rollback possible**: Si erreur, le fichier SQL n'a pas été exécuté

---

## 📂 Structure des Fichiers

```
adaverse/
├── app/
│   ├── admin/
│   │   └── approve-projects/
│   │       └── page.tsx           ← Page d'approbation
│   └── api/
│       └── pending-project/
│           ├── route.ts            ← GET (liste) / POST (ajouter) / DELETE (rejeter)
│           └── approve/
│               └── route.ts        ← POST (approuver)
│
├── components/
│   ├── AddProjectModal.tsx         ← Formulaire de soumission
│   └── AddProjectButton.tsx        ← Bouton "Ajouter un projet"
│
├── context/
│   └── AddProjectContext.tsx       ← État global (pending projects)
│
├── lib/
│   └── db/
│       ├── approve-projects.ts     ← Script: npm run approve
│       ├── schema.ts               ← Définition table pending_projects
│       └── migrations/
│           ├── 004_create_pending_projects.sql
│           └── 005_approved_projects.sql  ← Généré automatiquement
│
└── package.json                    ← Script "approve" défini ici
```

---

## 🔧 Configuration Requise

### Variables d'environnement (.env)

```bash
DATABASE_URL=postgresql://...
NEXT_PUBLIC_API_KEY=your-secret-key
```

### Installer les dépendances

```bash
npm install
```

### Créer la table pending_projects

```bash
npx tsx lib/db/migrations/run-pending-projects.ts
```

---

## 📖 Scénario d'Utilisation Complet

### Lundi matin

**Alice (étudiante)**:
1. Va sur le site AdaVerse
2. Clique sur "Ajouter un projet"
3. Remplit le formulaire pour son projet AdaQuiz
4. Soumet → Projet dans `pending_projects`

**Benjamin (étudiant)**:
1. Fait la même chose pour son projet AdaAction
2. Projet aussi dans `pending_projects`

### Mardi après-midi

**Admin**:
1. Va sur `localhost:3000/admin/approve-projects`
2. Voit 2 projets en attente (Alice et Benjamin)
3. Vérifie le GitHub d'Alice → ✅ OK
4. Clique "Approuver" sur le projet d'Alice
5. Vérifie le GitHub de Benjamin → ❌ Repo privé
6. Clique "Rejeter" sur le projet de Benjamin

Résultat:
- `005_approved_projects.sql` contient le SQL pour le projet d'Alice
- Le projet de Benjamin est supprimé

### Mercredi matin

**Admin**:
1. Exécute `npm run approve`
2. Le projet d'Alice est ajouté au site
3. `005_approved_projects.sql` est vidé

**Alice**:
- Voit son projet sur le site! 🎉

**Benjamin**:
- Corrige son repo, le rend public
- Soumet à nouveau
- Cette fois sera approuvé! ✅

---

## 🐛 Débogage

### Le projet n'apparaît pas après approbation

**Solution**: Vous avez oublié d'exécuter `npm run approve`

### Erreur lors de `npm run approve`

**Vérifier**: Le fichier `005_approved_projects.sql` contient du SQL valide

### Les Student IDs sont incorrects

**Solution**: Rejetez le projet et demandez à l'étudiant de resoumettre avec les bons IDs

---

## 🎓 Concepts Clés à Retenir

1. **Deux tables distinctes**
   - `pending_projects` = temporaire
   - `projects_students` = permanent

2. **Séparation des rôles**
   - Étudiants → Soumettent
   - Admin → Valide

3. **Pas d'exécution automatique**
   - L'approbation génère du SQL
   - Vous décidez quand l'exécuter

4. **Traçabilité**
   - Tout est dans le fichier SQL
   - Vous pouvez voir ce qui sera fait avant de le faire

5. **Batch processing**
   - Approuvez 100 projets
   - Exécutez une seule fois
   - Plus efficace!

---

## 🚀 Pour Aller Plus Loin

### Améliorations possibles

1. **Notifications email** quand un projet est approuvé/rejeté
2. **Preview du projet** avant approbation
3. **Historique des approbations** (qui a approuvé quoi et quand)
4. **Validation automatique** des URLs GitHub
5. **Interface pour éditer** les projets avant approbation

### Questions fréquentes

**Q: Peut-on annuler une approbation?**
R: Oui! Avant d'exécuter `npm run approve`, éditez simplement `005_approved_projects.sql`

**Q: Que se passe-t-il si 2 admins approuvent en même temps?**
R: Les deux SQL sont ajoutés au même fichier. Tout sera exécuté ensemble.

**Q: Peut-on approuver sans passer par l'interface?**
R: Oui! Éditez directement `005_approved_projects.sql` puis `npm run approve`

---

**Auteur**: Système d'approbation AdaVerse  
**Dernière mise à jour**: 27 novembre 2025
