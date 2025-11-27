'use client';
import {adaProject} from "@/content/adaProject";
import {Project} from "@/content/project";
import ProjectCard from "@/components/ProjectCard";
import {useAdaProjects} from "@/context/AdaProjectsContext";
import {useStudentProjects} from "@/context/StudentProjectsContext";
import {Loading} from "@/components/Loading";
import {ErrorMessage} from "@/components/ErrorMessage";

export default function Home() {
  const {listAdaProjects, loading: projectsLoading, error: projectsError} = useAdaProjects();
  const {listStudentProjects, loading: studentProjectsLoading, error: studentProjectsError} = useStudentProjects();

  // Show loading state
  if (projectsLoading || studentProjectsLoading) {
    return <Loading />
  }

  // Show error state
  if (projectsError || studentProjectsError) {
    return <ErrorMessage message={projectsError || studentProjectsError} />
  }

  return (
    <div>
      {/* Categories */}
      <div className="space-y-10 px-8 py-16 md:px-16">
        {listAdaProjects.map((project: adaProject) => {
          const studentProjects = listStudentProjects.filter((p: Project) => p.adaProjectID === project.id);
          
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
