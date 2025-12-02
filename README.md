# AdaVerse - Student Project Showcase Platform

AdaVerse is a comprehensive web platform designed to showcase and manage student projects from Ada Tech School. Built with Next.js 15, it provides a modern, interactive interface for browsing, searching, and discovering projects created by Ada students across different promotions.

## 🌟 Features

### Public Features
- **Project Catalog**: Browse all student projects organized by Ada project categories
- **Advanced Search**: Filter projects by promotion, project type, and search by title
- **Project Details**: View comprehensive project information including:
  - GitHub repository statistics (stars, forks, issues, pull requests)
  - Top programming languages used
  - Project README rendered as formatted markdown
  - Team member information
  - Project screenshots and demos
- **Promotion Filtering**: Filter homepage projects by student promotion
- **Responsive Design**: Fully responsive layout with dark mode support

### Admin Features
- **Project Approval System**: Review and approve pending projects
- **Batch Operations**: Approve or reject multiple projects at once
- **CSV Import**: Import projects in bulk from CSV files
- **Duplicate Detection**: Automatic detection of duplicate GitHub URLs

### GitHub API Integration
- Real-time repository statistics
- Language breakdown (top 4 languages)
- Detailed issue and PR counts (total/open/closed)
- Pre-rendered README content with syntax highlighting

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Database**: PostgreSQL (Neon)
- **ORM**: Drizzle ORM
- **APIs**: GitHub REST API
- **Icons**: Lucide React

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL database (or Neon account)
- GitHub account (optional, for higher API rate limits)

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/adatechschool/frida-adaverse-Mamoru-fr.git
cd frida-adaverse-Mamoru-fr/adaverse
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL=your_postgresql_connection_string

# API Security
NEXT_PUBLIC_API_KEY=your_api_key_here

# Optional: GitHub Token (for higher API rate limits)
GITHUB_TOKEN=your_github_token
```

### 4. Set up the database

Run migrations:

```bash
npm run migrate
```

Seed initial data:

```bash
npm run seed
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run migrate` - Push database schema changes
- `npm run seed` - Seed database with initial data
- `npm run approve` - Process approved projects from pending queue
- `npm run import-csv <path>` - Import projects from CSV file

## 🗄️ Database Schema

### Main Tables
- `Projects` - Published student projects
- `PendingProjects` - Projects awaiting approval
- `Students` - Student information
- `adaPromotions` - Ada promotions/cohorts
- `adaProjects` - Ada project types (AdaQuiz, AdaCheck, etc.)
- `StudentToProjects` - Many-to-many relationship between students and projects
- `ApprovedProjects` - Queue for approved projects pending migration

## 🔐 API Routes

All API routes are protected with API key authentication:

- `GET /api/student-project` - Fetch all projects with student data
- `POST /api/pending-project` - Submit new project for approval
- `DELETE /api/pending-project?id=X` - Reject a pending project
- `POST /api/pending-project/approve?id=X` - Approve a pending project

## 📝 Project Submission Workflow

1. User submits project via form → Added to `PendingProjects` table
2. Admin reviews on `/admin/approve-projects` page
3. Admin approves → Moved to `ApprovedProjects` table
4. Run `npm run approve` → Migrated to `Projects` table
5. Project appears on public site

## 🎨 Key Features Implementation

### Promotion Filtering
Uses `PromotionFilterContext` to share filter state between navbar and homepage. Checks all students in a project for matching promotions.

### GitHub Integration
Custom hooks (`useGitHubRepo`, `useGitHubReadme`) fetch repository data and README content. Makes 6 API calls per project:
- Repository metadata
- Languages
- Total issues
- Open issues  
- Total pull requests
- Open pull requests
- README content

### Custom Markdown Styling
Custom CSS class `.markdown-content` in `globals.css` provides GitHub-like styling for README content, avoiding Tailwind v4 plugin compatibility issues.

### Responsive Cards
Flexbox-based layout with dynamic sizing:
- Min width: 280px
- Max width: 400px
- Cards stretch to fill available space
- Prevents awkward gaps in layouts

## 📚 Documentation

Additional documentation is available in the `/documentation` folder:
- `GITHUB_API_DOCUMENTATION.md` - GitHub API integration details
- `API_DOCUMENTATION.md` - API routes and authentication
- `APPROVAL_SYSTEM.md` - Project approval workflow
- `API_SECURITY.md` - Security implementation

## 🤝 Contributing

1. Create a feature branch from `development-production`
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

<table>
  <tr>
    <td align="center">
      <img src="adaverse/public/06CCBA4C-73F2-47AC-8D23-07E176EF2DA2_1_105_c.jpeg" width="100" height="100" style="border-radius: 50%; object-fit: cover;">
      <br>
      <strong>Alexis SANTOS</strong>
      <br>
      <em>Software Engineer</em>
      <br><br>
      <a href="https://github.com/Mamoru-fr">
        <img src="https://img.shields.io/badge/GitHub-181717?style=flat&logo=github&logoColor=white" alt="GitHub">
      </a>
      <a href="https://www.linkedin.com/in/santos--alexis/">
        <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=flat&logo=linkedin&logoColor=white" alt="LinkedIn">
      </a>
    </td>
  </tr>
</table>

## 🔗 Links

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [Drizzle ORM](https://orm.drizzle.team)
- [GitHub API](https://docs.github.com/en/rest)