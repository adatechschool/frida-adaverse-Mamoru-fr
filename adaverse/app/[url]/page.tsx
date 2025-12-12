'use client';

import { useParams, useRouter } from 'next/navigation';
import { useStudentProjects } from '@/context/StudentProjectsContext';
import { useAdaProjects } from '@/context/AdaProjectsContext';
import { useAdaPromotions } from '@/context/AdaPromotionsContext';
import { useGitHubRepo } from '@/hooks/useGitHubRepo';
import { useGitHubReadme } from '@/hooks/useGitHubReadme';
import { Loading } from '@/components/interactComponents/Loading';
import { ErrorMessage } from '@/components/interactComponents/ErrorMessage';
import { externalURLformat } from '@/utils/externalURLformat';
import { FormatDate } from '@/utils/formatDate';
import { Image, ArrowLeft, Github, ExternalLink, Calendar, Users, Award, GitBranch, Star, GitFork, AlertCircle, Code2, Tag } from 'lucide-react';
import { AllComments } from '@/components/Comments/AllComments';

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const url = params.url as string;

  const { listStudentProjects, loading: projectsLoading, error: projectsError } = useStudentProjects();
  const { listAdaProjects, loading: adaProjectsLoading, error: adaProjectsError } = useAdaProjects();
  const { listAdaPromotions } = useAdaPromotions();

  // Find the project by URLName first (before any returns)
  const project = listStudentProjects.find(p => p.URLName === url);

  // Fetch GitHub repository data (must be called before any conditional returns)
  const { repoData, languages, issueStats, pullRequestStats, loading: githubLoading, error: githubError } = useGitHubRepo(project?.githubRepoURL || '');
  const { readme, loading: readmeLoading, error: readmeError } = useGitHubReadme(project?.githubRepoURL || '');

  // Show loading state
  if (projectsLoading || adaProjectsLoading) {
    return <Loading />;
  }

  // Show error state
  if (projectsError || adaProjectsError) {
    return <ErrorMessage message={projectsError || adaProjectsError} />;
  }

  if (!project) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-8">
        <h1 className="mb-4 text-3xl font-bold">Projet non trouvé</h1>
        <p className="mb-6 text-neutral-600 dark:text-neutral-400">
          Le projet que vous recherchez n'existe pas ou a été supprimé.
        </p>
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-2 rounded-md bg-neutral-900 dark:bg-white px-6 py-3 text-white dark:text-black font-semibold transition-colors hover:bg-neutral-800 dark:hover:bg-neutral-200"
        >
          <ArrowLeft className="h-5 w-5" />
          Retour à l'accueil
        </button>
      </div>
    );
  }

  // Find the Ada Project name
  const adaProject = listAdaProjects.find(ap => ap.id === project.adaProjectID);

  // Get unique promotions from students
  const uniquePromotions = project.students 
    ? [...new Set(project.students.map(student => student.promotionId))]
    : [];
  
  const promotionNames = uniquePromotions
    .map(id => listAdaPromotions.find(p => p.id === id)?.promotionName)
    .filter(Boolean);

  // Get top languages
  const topLanguages = languages 
    ? Object.entries(languages)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 4)
        .map(([lang]) => lang)
    : [];

  return (
    <div className="min-h-screen px-8 py-8 md:px-16 md:py-12">
      {/* Back Button */}
      <button
        onClick={() => router.push('/')}
        className="mb-8 flex items-center gap-2 text-neutral-600 dark:text-neutral-400 transition-colors hover:text-neutral-900 dark:hover:text-white"
      >
        <ArrowLeft className="h-5 w-5" />
        Retour aux projets
      </button>

      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
            {project.title}
          </h1>
          {adaProject && (
            <p className="text-lg text-neutral-600 dark:text-neutral-400">
              Projet {adaProject.projectName}
            </p>
          )}
        </div>

        {/* Image */}
        {project.image ? (
          <div className="relative mb-8 overflow-hidden rounded-lg bg-neutral-200 dark:bg-neutral-800 shadow-xl" style={{ paddingBottom: '56.25%' }}>
            <img
              src={project.image}
              alt={project.title}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        ) : (
          <div className="relative mb-8 overflow-hidden rounded-lg bg-neutral-200 dark:bg-neutral-800" style={{ paddingBottom: '56.25%' }}>
            <div className="absolute inset-0 flex items-center justify-center">
              <Image className="h-24 w-24 text-neutral-400 dark:text-neutral-700" />
            </div>
          </div>
        )}

        {/* Info Grid */}
        <div className="mb-8 grid gap-6 md:grid-cols-2">

          {/* Created Date */}
          <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6">
            <div className="mb-2 flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
              <GitBranch className="h-5 w-5" />
              <h3 className="font-semibold">Date de création</h3>
            </div>
            <p className="text-lg">{FormatDate(project.createdAt)}</p>
          </div>

          {/* Published Date */}
          {project.publishedAt && (
            <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6">
              <div className="mb-2 flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                <Calendar className="h-5 w-5" />
                <h3 className="font-semibold">Date de publication</h3>
              </div>
              <p className="text-lg">{FormatDate(project.publishedAt)}</p>
            </div>
          )}

          {/* Promotion(s) */}
          {promotionNames.length > 0 && (
            <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6">
              <div className="mb-2 flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                <Award className="h-5 w-5" />
                <h3 className="font-semibold">
                  {promotionNames.length > 1 ? 'Promotions' : 'Promotion'}
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {promotionNames.map((name, idx) => (
                  <span
                    key={idx}
                    className="inline-block rounded-full bg-purple-100 dark:bg-purple-900/30 px-4 py-2 text-sm font-medium text-purple-700 dark:text-purple-300"
                  >
                    {name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Students */}
          {project.students && project.students.length > 0 && (
            <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6">
              <div className="mb-3 flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                <Users className="h-5 w-5" />
                <h3 className="font-semibold">Équipe ({project.students.length} {project.students.length > 1 ? 'membres' : 'membre'})</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {project.students.map((student) => (
                  <span
                    key={student.id}
                    className="inline-block rounded-full border border-neutral-300 dark:border-white/10 bg-neutral-100 dark:bg-neutral-800 px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300"
                  >
                    {student.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* GitHub Repository Stats */}
        {repoData && (
          <div className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">Statistiques du dépôt</h2>
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[calc(50%-0.5rem)] md:min-w-[calc(25%-0.75rem)] rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4">
                <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 mb-2">
                  <Star className="h-4 w-4" />
                  <span className="text-sm font-medium">Stars</span>
                </div>
                <p className="text-2xl font-bold">{repoData.stargazers_count}</p>
              </div>
              <div className="flex-1 min-w-[calc(50%-0.5rem)] md:min-w-[calc(25%-0.75rem)] rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4">
                <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 mb-2">
                  <GitFork className="h-4 w-4" />
                  <span className="text-sm font-medium">Forks</span>
                </div>
                <p className="text-2xl font-bold">{repoData.forks_count}</p>
              </div>
              
              {/* Issues Stats */}
              {issueStats && (
                <div className="flex-1 min-w-[calc(50%-0.5rem)] md:min-w-[calc(25%-0.75rem)] rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4">
                  <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 mb-2">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">Issues</span>
                  </div>
                  <p className="text-2xl font-bold">{issueStats.total_count}</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    {issueStats.open_count} ouvertes · {issueStats.closed_count} fermées
                  </p>
                </div>
              )}

              {/* Pull Requests */}
              {pullRequestStats && (
                <div className="flex-1 min-w-[calc(50%-0.5rem)] md:min-w-[calc(25%-0.75rem)] rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4">
                  <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 mb-2">
                    <GitBranch className="h-4 w-4" />
                    <span className="text-sm font-medium">Pull Requests</span>
                  </div>
                  <p className="text-2xl font-bold">{pullRequestStats.total_count}</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    {pullRequestStats.open_count} ouvertes · {pullRequestStats.closed_count} fermées
                  </p>
                </div>
              )}
            </div>

            {/* Languages */}
            {topLanguages.length > 0 && (
              <div className="mt-4 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4">
                <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 mb-3">
                  <Code2 className="h-4 w-4" />
                  <span className="text-sm font-medium">Langages principaux</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {topLanguages.map((lang) => (
                    <span
                      key={lang}
                      className="inline-block rounded-md bg-blue-100 dark:bg-blue-900/30 px-3 py-1 text-sm font-medium text-blue-700 dark:text-blue-300"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Repository Description */}
        {repoData?.description && (
          <div className="mb-8 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6">
            <h2 className="mb-3 text-xl font-semibold">Description</h2>
            <p className="text-neutral-700 dark:text-neutral-300">{repoData.description}</p>
          </div>
        )}

        {/* README Content */}
        {readme && (
          <div className="mb-8 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6">
            <h2 className="mb-4 text-2xl font-semibold">Documentation du projet</h2>
            <div 
              className="markdown-content"
              dangerouslySetInnerHTML={{ __html: readme }}
            />
          </div>
        )}

        {/* Topics */}
        {repoData?.topics && repoData.topics.length > 0 && (
          <div className="mb-8 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6">
            <div className="mb-3 flex items-center gap-2">
              <Tag className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
              <h2 className="text-xl font-semibold">Topics</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {repoData.topics.map((topic) => (
                <span
                  key={topic}
                  className="inline-block rounded-md bg-blue-100 dark:bg-blue-900/30 px-3 py-1 text-sm font-medium text-blue-700 dark:text-blue-300"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col gap-4 sm:flex-row">
          <a
            href={externalURLformat(project.githubRepoURL)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-3 rounded-lg bg-neutral-900 dark:bg-white px-6 py-4 text-base font-semibold text-white dark:text-black no-underline transition-colors hover:bg-neutral-800 dark:hover:bg-neutral-200"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            Voir le code source
          </a>
          {project.demoURL && (
            <a
              href={externalURLformat(project.demoURL)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-1 items-center justify-center gap-3 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-6 py-4 text-base font-semibold transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800 no-underline"
            >
              <ExternalLink className="h-5 w-5" />
              Voir la démo
            </a>
          )}
        </div>

        {/* Comments Section */}
        <AllComments projectId={project.id} />
      </div>
    </div>
  );
}
