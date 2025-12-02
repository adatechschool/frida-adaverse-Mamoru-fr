# GitHub API Integration - Documentation

## Overview
This document explains how the GitHub API was integrated into the AdaVerse project to fetch and display repository data and README content on project detail pages.

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
