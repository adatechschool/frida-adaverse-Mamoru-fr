'use client';

import { useParams, useRouter } from 'next/navigation';
import { useStudentProjects } from '@/context/StudentProjectsContext';
import { useAdaProjects } from '@/context/AdaProjectsContext';
import { Loading } from '@/components/Loading';
import { ErrorMessage } from '@/components/ErrorMessage';
import { externalURLformat } from '@/utils/externalURLformat';
import { FormatDate } from '@/utils/formatDate';
import { Image, ArrowLeft, Github, ExternalLink, Calendar, Users } from 'lucide-react';

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const url = params.url as string;

  const { listStudentProjects, loading: projectsLoading, error: projectsError } = useStudentProjects();
  const { listAdaProjects, loading: adaProjectsLoading, error: adaProjectsError } = useAdaProjects();

  // Show loading state
  if (projectsLoading || adaProjectsLoading) {
    return <Loading />;
  }

  // Show error state
  if (projectsError || adaProjectsError) {
    return <ErrorMessage message={projectsError || adaProjectsError} />;
  }

  // Find the project by URLName
  const project = listStudentProjects.find(p => p.URLName === url);

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
      </div>
    </div>
  );
}
