'use client';
import {adaProject} from "@/content/adaProject";
import {Project} from "@/content/project";
import ProjectCard from "@/components/ProjectCard";
import {useAdaProjects} from "@/context/AdaProjectsContext";
import {useStudentProjects} from "@/context/StudentProjectsContext";
import {Loading} from "@/components/interactComponents/Loading";
import {ErrorMessage} from "@/components/interactComponents/ErrorMessage";
import {usePromotionFilter} from "@/context/PromotionFilterContext";

export default function Home() {
  const {listAdaProjects, loading: projectsLoading, error: projectsError} = useAdaProjects();
  const {listStudentProjects, loading: studentProjectsLoading, error: studentProjectsError} = useStudentProjects();
  const {selectedPromotion} = usePromotionFilter();

  // Show loading state
  if (projectsLoading || studentProjectsLoading) {
    return <Loading />
  }

  // Show error state
  if (projectsError || studentProjectsError) {
    return <ErrorMessage message={projectsError || studentProjectsError} />
  }

  // Filter projects by promotion if selected
  const filteredProjects = selectedPromotion 
    ? listStudentProjects.filter((p: Project) => {
        if (!p.students || p.students.length === 0) return false;
        return p.students[0].promotionId === selectedPromotion;
      })
    : listStudentProjects;

  return (
    <div>
      {/* Categories */}
      <div className="space-y-10 px-8 py-16 md:px-16">
        {listAdaProjects.map((project: adaProject) => {
          const studentProjects = filteredProjects
            .filter((p: Project) => p.adaProjectID === project.id)
            .sort((a, b) => {
              // Sort by publishedAt in ascending order (earliest first)
              if (!a.publishedAt) return 1; // Projects without publishedAt go to the end
              if (!b.publishedAt) return -1;
              return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
            });
          
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
                  <div key={sp.id} className="shrink-0 w-[280px] sm:w-[350px] md:w-[400px]">
                    <ProjectCard project={sp} />
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}
