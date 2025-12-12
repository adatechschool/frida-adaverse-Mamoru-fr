'use client';

import { useStudentProjects } from "@/context/StudentProjectsContext";
import { useProjectFilters } from "@/hooks/useProjectFilters";
import { Loading } from "@/components/interactComponents/Loading";
import { ErrorMessage } from "@/components/interactComponents/ErrorMessage";
import ProjectCard from "@/components/ProjectCard";
import { useAdaPromotions } from "@/context/AdaPromotionsContext";
import { useAdaProjects } from "@/context/AdaProjectsContext";
import { CombinedColors } from "@/content/Colors";

export default function SearchPage() {
  const { listStudentProjects, loading, error } = useStudentProjects();
  const { listAdaPromotions } = useAdaPromotions();
  const { listAdaProjects } = useAdaProjects();
  
  const {
    searchQuery,
    setSearchQuery,
    selectedPromotion,
    setSelectedPromotion,
    selectedAdaProject,
    setSelectedAdaProject,
    sortBy,
    setSortBy,
    filteredProjects,
  } = useProjectFilters(listStudentProjects);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className="px-8 py-16 lg:px-16">
      <div className="w-full mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Rechercher des projets</h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Explorez les {listStudentProjects.length} projets des étudiants Ada
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div>
            <input
              type="text"
              placeholder="Rechercher par titre..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full rounded-md border ${CombinedColors.border.default} ${CombinedColors.background.cardAlt} h-12 text-sm px-4 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500`}
            />
          </div>

          {/* Dropdowns and Sort */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Promotion Filter */}
            <select
              value={selectedPromotion === null ? '' : selectedPromotion.toString()}
              onChange={(e) => setSelectedPromotion(e.target.value === '' ? null : parseInt(e.target.value, 10))}
              className={`rounded-md border ${CombinedColors.border.default} ${CombinedColors.background.cardAlt} h-12 text-sm px-4 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500`}
            >
              <option value="">Toutes les promotions</option>
              {listAdaPromotions.map((promotion) => (
                <option key={promotion.id} value={promotion.id}>
                  {promotion.promotionName}
                </option>
              ))}
            </select>

            {/* Ada Project Filter */}
            <select
              value={selectedAdaProject === null ? '' : selectedAdaProject.toString()}
              onChange={(e) => setSelectedAdaProject(e.target.value === '' ? null : parseInt(e.target.value, 10))}
              className={`rounded-md border ${CombinedColors.border.default} ${CombinedColors.background.cardAlt} h-12 text-sm px-4 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500`}
            >
              <option value="">Tous les projets Ada</option>
              {listAdaProjects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.projectName}
                </option>
              ))}
            </select>

            {/* Sort By */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest')}
              className={`rounded-md border ${CombinedColors.border.default} ${CombinedColors.background.cardAlt} h-12 text-sm px-4 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500`}
            >
              <option value="newest">Plus récent</option>
              <option value="oldest">Plus ancien</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            {filteredProjects.length} projet{filteredProjects.length !== 1 ? 's' : ''} trouvé{filteredProjects.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-neutral-600 dark:text-neutral-400">
              Aucun projet trouvé avec ces critères
            </p>
          </div>
        ) : (
          <div className="flex flex-wrap justify-center lg:justify-start gap-6">
            {filteredProjects.map((project) => (
              <div key={project.id} className="flex-1 min-w-[320px] lg:min-w-[360px] max-w-[25vw]">
                <ProjectCard project={project} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
