import clientPromise from '@/lib/db';
import FilterableSectionClient from '@/components/FilterableSectionClient';

async function getProjects() {
  try {
    const client = await clientPromise;
    const db = client.db();
    
    const projects = await db.collection('projects')
      .find({ section: 'fotografia' })
      .sort({ createdAt: -1 })
      .toArray();
    
    return projects.map(p => ({
      id: p._id.toString(),
      title: p.title,
      description: p.description,
      client: p.client,
      year: p.year,
      section: p.section,
      featured: p.featured || false,
      images: p.images || [],
      heroMedia: p.heroMedia || p.images?.[0] || '',
      tags: p.tags || [],
      reflection: p.reflection || '',
      categories: p.categories || [],
      pricePerDay: p.pricePerDay,
    }));
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}

const PHOTOGRAPHY_CATEGORIES = [
  'Stills',
  'Events',
  'In Set',
  'At ADS'
];

export default async function TestPhotography() {
  const projects = await getProjects();

  return (
    <div className="min-h-screen lg:ml-80">
      <FilterableSectionClient
        projects={projects}
        sectionTitle="Photography"
        sectionDescription="Capturing the essence of your products and projects through our lens. We create visual narratives that connect, inspire, and elevate your brand to new dimensions."
        categories={PHOTOGRAPHY_CATEGORIES}
        searchPlaceholder="Search photography projects..."
      />
    </div>
  );
}
