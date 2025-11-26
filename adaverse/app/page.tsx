'use client';
import {adaProject} from "@/content/adaProject";
import {Project} from "@/content/project";
import ProjectCard from "@/components/ProjectCard";
import {useAdaProjects} from "@/context/AdaProjectsContext";
import {useState, useEffect} from "react";

export default function Home() {
  const {listAdaProjects, loading: projectsLoading, error: projectsError} = useAdaProjects();
  const [projects, setProjects] = useState<Project[]>([]);
  const [studentsLoading, setStudentsLoading] = useState(true);
  const [studentsError, setStudentsError] = useState<string | null>(null);

  useEffect(() => {
    console.log('[Client] Fetching student projects');

    const apiKey = process.env.NEXT_PUBLIC_API_KEY;

    fetch('/api/student-project', {
      method: 'GET',
      cache: 'no-store',
      headers: {
        'x-api-key': apiKey || '',
      },
    })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        console.log('[Client] Student Projects fetched:', data.length);
        setProjects(data);
        setStudentsLoading(false);
      })
      .catch(err => {
        console.error('[Client] Error fetching student projects:', err);
        setStudentsError(err.message);
        setStudentsLoading(false);
      });
  }, []);

  // Show loading state
  if (projectsLoading || studentsLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-xl">Loading projects...</div>
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-500 border-t-transparent mx-auto"></div>
        </div>
      </div>
    );
  }

  // Show error state
  if (projectsError || studentsError) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="rounded-lg bg-red-900/20 border border-red-500 p-6 text-center">
          <h2 className="mb-2 text-xl font-bold text-red-500">Error Loading Data</h2>
          <p className="text-red-300">{projectsError || studentsError}</p>
        </div>
      </div>
    );
  }

  return (
    <div>

      {/* Categories */}
      <div className="space-y-10 px-8 py-16 md:px-16">
        {listAdaProjects.map((project: adaProject) => {
          const studentProjects = projects.filter((p: Project) => p.adaProjectID === project.id);
          
          if (studentProjects.length === 0) return null;

          return (
            <div key={project.id}>
              {/* Category Header */}
              <div className="mb-6">
                <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
                  {project.projectName}
                </h2>
              </div>

              {/* Scrollable Row */}
              <div className="scrollbar-hide -mx-8 flex gap-4 overflow-x-auto px-8 md:-mx-16 md:px-16">
                {studentProjects.map((sp: Project) => (
                  <ProjectCard key={sp.id} project={sp} />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}
