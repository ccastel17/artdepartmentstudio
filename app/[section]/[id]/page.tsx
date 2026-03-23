import { notFound } from 'next/navigation';
import { Section } from '@/types';
import { SECTIONS } from '@/lib/constants';
import clientPromise from '@/lib/db';
import { ObjectId } from 'mongodb';
import ProjectDetailClient from '@/components/ProjectDetailClient';

async function getProject(section: string, id: string) {
  try {
    const client = await clientPromise;
    const db = client.db();
    
    const project = await db.collection('projects').findOne({
      _id: new ObjectId(id),
      section,
    });
    
    if (!project) return null;
    
    return {
      id: project._id.toString(),
      title: project.title,
      description: project.description,
      client: project.client,
      year: project.year,
      section: project.section,
      featured: project.featured,
      images: project.images || [],
      media: project.media || [],
      heroMedia: project.heroMedia || '',
      tags: project.tags || [],
      reflection: project.reflection || '',
      pricePerDay: project.pricePerDay,
    };
  } catch (error) {
    console.error('Error fetching project:', error);
    return null;
  }
}

async function getRelatedProjects(section: string, currentId: string) {
  try {
    const client = await clientPromise;
    const db = client.db();
    
    const projects = await db.collection('projects')
      .find({ 
        section,
        _id: { $ne: new ObjectId(currentId) }
      })
      .limit(3)
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
    }));
  } catch (error) {
    console.error('Error fetching related projects:', error);
    return [];
  }
}

export default async function ProjectDetailPage({ 
  params 
}: { 
  params: Promise<{ section: string; id: string }> 
}) {
  const { section: sectionParam, id } = await params;
  const section = sectionParam as Section;

  const dbSection = section === 'prop-making' ? 'set-buildings' : section;
  
  if (!(section in SECTIONS)) {
    notFound();
  }

  const project = await getProject(dbSection, id);

  if (!project) {
    notFound();
  }

  // Get related projects (other projects from same section, excluding current)
  const relatedProjects = await getRelatedProjects(dbSection, id);
  const normalizedProject = section === 'prop-making'
    ? { ...project, section: 'prop-making' as const }
    : project;
  const normalizedRelated = section === 'prop-making'
    ? relatedProjects.map((p) => ({ ...p, section: 'prop-making' as const }))
    : relatedProjects;

  return (
    <ProjectDetailClient 
      project={normalizedProject} 
      relatedProjects={normalizedRelated}
      section={section}
    />
  );
}
