'use client';

import { useState, useMemo } from 'react';
import { Project } from '@/content/project';

type SortOption = 'newest' | 'oldest';

export function useProjectFilters(projects: Project[]) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPromotion, setSelectedPromotion] = useState<number | null>(null);
  const [selectedAdaProject, setSelectedAdaProject] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  const filteredProjects = useMemo(() => {
    let filtered = [...projects];

    // Filter by search query (title)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(project => 
        project.title.toLowerCase().includes(query)
      );
    }

    // Filter by promotion (first student's promotion)
    if (selectedPromotion !== null) {
      filtered = filtered.filter(project => {
        if (!project.students || project.students.length === 0) return false;
        return project.students[0].promotionId === selectedPromotion;
      });
    }

    // Filter by ada project
    if (selectedAdaProject !== null) {
      filtered = filtered.filter(project => 
        project.adaProjectID === selectedAdaProject
      );
    }

    // Sort by date
    filtered.sort((a, b) => {
      const dateA = new Date(a.publishedAt || a.createdAt).getTime();
      const dateB = new Date(b.publishedAt || b.createdAt).getTime();
      return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return filtered;
  }, [projects, searchQuery, selectedPromotion, selectedAdaProject, sortBy]);

  return {
    searchQuery,
    setSearchQuery,
    selectedPromotion,
    setSelectedPromotion,
    selectedAdaProject,
    setSelectedAdaProject,
    sortBy,
    setSortBy,
    filteredProjects,
  };
}
