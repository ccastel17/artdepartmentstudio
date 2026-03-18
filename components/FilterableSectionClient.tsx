'use client';

import { useState, useMemo } from 'react';
import { Project } from '@/types';
import FeaturedProject from '@/components/FeaturedProject';
import ProjectCard from '@/components/ProjectCard';
import SectionFilters from '@/components/SectionFilters';

interface FilterableSectionClientProps {
  projects: Project[];
  sectionTitle: string;
  sectionDescription: string;
  categories: string[];
  searchPlaceholder?: string;
}

export default function FilterableSectionClient({
  projects,
  sectionTitle,
  sectionDescription,
  categories,
  searchPlaceholder = 'Search items...'
}: FilterableSectionClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // Filter projects based on search and categories
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      // Search filter
      const matchesSearch = !searchTerm || 
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase());

      // Category filter
      const matchesCategory = selectedCategories.length === 0 ||
        (project.categories && selectedCategories.some(cat => project.categories?.includes(cat)));

      return matchesSearch && matchesCategory;
    });
  }, [projects, searchTerm, selectedCategories]);

  const featuredProject = filteredProjects.find(p => p.featured);
  const regularProjects = filteredProjects.filter(p => !p.featured);

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategories([]);
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="mb-12">
        <h1 className="text-white mb-6">
          {sectionTitle}
        </h1>
        <p className="text-xl md:text-2xl text-gray-400 max-w-3xl">
          {sectionDescription}
        </p>
      </div>

      {/* Filters */}
      <SectionFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCategories={selectedCategories}
        onCategoryToggle={handleCategoryToggle}
        onClearFilters={handleClearFilters}
        categories={categories}
        searchPlaceholder={searchPlaceholder}
      />

      {/* Featured Project */}
      {featuredProject && (
        <div className="mb-20">
          <FeaturedProject project={featuredProject} />
        </div>
      )}

      {/* Results */}
      {regularProjects.length > 0 ? (
        <>
          <div className="mb-6 text-gray-400">
            Showing {regularProjects.length} {regularProjects.length === 1 ? 'item' : 'items'}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 bg-black">
            {regularProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-32">
          <p className="text-xl text-gray-400">
            {searchTerm || selectedCategories.length > 0
              ? 'No items found matching your filters.'
              : 'Projects coming soon to this section.'}
          </p>
        </div>
      )}
    </div>
  );
}
