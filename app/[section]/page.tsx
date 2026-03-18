import { notFound } from 'next/navigation';
import FeaturedProject from '@/components/FeaturedProject';
import ProjectCard from '@/components/ProjectCard';
import FilterableSectionClient from '@/components/FilterableSectionClient';
import { SECTIONS, SECTION_DESCRIPTIONS } from '@/lib/constants';
import { Project, Section } from '@/types';
import clientPromise from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Categories for sections with filters
const RENTAL_CATEGORIES = [
  'Pedestals',
  'Modules',
  'Product Surfaces',
  'For Sale',
  'Custom Carved Pieces'
];

const ART_DIRECTION_CATEGORIES = [
  'TV Commercials',
  'Product Photography'
];

const PHOTOGRAPHY_CATEGORIES = [
  'Stills',
  'Events',
  'In Set',
  'At ADS'
];

export function generateStaticParams() {
  return Object.keys(SECTIONS).map((section) => ({
    section,
  }));
}

async function getProjects(section: string) {
  try {
    const client = await clientPromise;
    const db = client.db();

    const projects = await db.collection('projects')
      .find({ section })
      .sort({ order: 1, createdAt: -1 })
      .toArray();

    return projects.map(p => ({
      id: p._id.toString(),
      title: p.title,
      description: p.description,
      client: p.client,
      year: p.year,
      section: p.section,
      featured: p.featured,
      images: p.images || [],
      media: p.media || [],
      heroMedia: p.heroMedia || '',
      tags: p.tags || [],
      reflection: p.reflection || '',
      pricePerDay: p.pricePerDay,
      categories: p.categories || [],
    }));
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}

export default async function SectionPage({ params }: { params: Promise<{ section: string }> }) {
  const { section: sectionParam } = await params;
  const section = sectionParam as Section;

  if (!(section in SECTIONS)) {
    notFound();
  }

  const projects = await getProjects(section);

  // Use filterable component for rental section
  if (section === 'rental') {
    return (
      <FilterableSectionClient
        projects={projects}
        sectionTitle={SECTIONS[section]}
        sectionDescription={SECTION_DESCRIPTIONS[section]}
        categories={RENTAL_CATEGORIES}
        searchPlaceholder="Search rental items..."
      />
    );
  }

  // Use filterable component for art-direction section
  if (section === 'art-direction') {
    return (
      <FilterableSectionClient
        projects={projects}
        sectionTitle={SECTIONS[section]}
        sectionDescription={SECTION_DESCRIPTIONS[section]}
        categories={ART_DIRECTION_CATEGORIES}
        searchPlaceholder="Search art direction projects..."
      />
    );
  }

  // Use filterable component for fotografia section
  if (section === 'fotografia') {
    return (
      <FilterableSectionClient
        projects={projects}
        sectionTitle={SECTIONS[section]}
        sectionDescription={SECTION_DESCRIPTIONS[section]}
        categories={PHOTOGRAPHY_CATEGORIES}
        searchPlaceholder="Search photography projects..."
      />
    );
  }

  // Regular section display for other sections
  const featuredProject = projects.find(p => p.featured);
  const regularProjects = projects.filter(p => !p.featured);

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="mb-20">
        <h1 className="text-white mb-6">
          {SECTIONS[section]}
        </h1>
        <p className="text-xl md:text-2xl text-gray-400 max-w-3xl">
          {SECTION_DESCRIPTIONS[section]}
        </p>
      </div>

      {featuredProject && (
        <div className="mb-20">
          <FeaturedProject project={featuredProject} />
        </div>
      )}

      {regularProjects.length > 0 ? (
        <div className="bg-white p-[3px]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[3px] bg-white">
            {regularProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-32">
          <p className="text-xl text-gray-400">
            Projects coming soon to this section.
          </p>
        </div>
      )}
    </div>
  );
}
