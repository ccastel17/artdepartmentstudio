'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { MediaItem, Project } from '@/types';
import { SECTIONS } from '@/lib/constants';
import ProjectCard from '@/components/ProjectCard';
import ImageLightbox from '@/components/ImageLightbox';

interface ProjectDetailClientProps {
  project: Project;
  relatedProjects: Project[];
  section: string;
}

export default function ProjectDetailClient({ project, relatedProjects, section }: ProjectDetailClientProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const isVideoUrl = (url: string) => !!url.match(/\.(mp4|mov|avi|webm)$/i);

  const resolvedMedia: MediaItem[] = (project.media && project.media.length > 0)
    ? project.media
    : (project.images || []).map((url: string) => ({ url, type: isVideoUrl(url) ? 'video' : 'image' }));

  const imageOnlyUrls = resolvedMedia
    .filter((m) => m.type === 'image')
    .map((m) => m.url);

  const openLightbox = (imageUrl: string) => {
    const index = imageOnlyUrls.indexOf(imageUrl);
    if (index !== -1) {
      setLightboxIndex(index);
      setLightboxOpen(true);
    }
  };

  return (
    <div className="min-h-screen py-12 px-6 max-w-7xl mx-auto">
      {/* Back Button */}
      <Link
        href={`/${section}`}
        className="inline-flex items-center gap-2 text-accent-blue hover:text-blue-400 mb-8 transition-colors"
      >
        <ArrowLeft size={20} />
        Back to {SECTIONS[section as keyof typeof SECTIONS]}
      </Link>

      {/* Hero Media */}
      {project.heroMedia && (
        <div className="relative w-full h-[600px] overflow-hidden mb-12 border-[3px] border-white">
          {project.heroMedia.match(/\.(mp4|mov|avi|webm)$/i) ? (
            <video
              src={project.heroMedia}
              autoPlay
              loop
              muted
              playsInline
              controls
              className="w-full h-full object-cover"
            />
          ) : (
            <Image
              src={project.heroMedia}
              alt={project.title}
              fill
              className="object-cover"
            />
          )}
        </div>
      )}

      {/* Project Header */}
      <div className="mb-12">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-10">
          <div className="max-w-4xl">
            <h1 className="text-5xl font-bold mb-4 text-white">
              {project.title}
            </h1>
            <p className="text-xl text-gray-400 mb-6">
              {project.description}
            </p>
            <div className="flex items-center gap-4">
              <p className="text-gray-500">
                {project.client} • {project.year}
              </p>
              {project.pricePerDay && (
                <>
                  <span className="text-gray-600">•</span>
                  <p className="text-accent-blue font-bold text-2xl">
                    €{project.pricePerDay}/day
                  </p>
                </>
              )}
            </div>
          </div>

          {project.tags && project.tags.length > 0 && (
            <div className="lg:min-w-[320px] lg:max-w-[420px] text-left lg:text-right">
              <h3 className="text-white font-bold text-[20px] mb-4">Tasks Performed</h3>
              <div className="flex flex-wrap gap-3 justify-start lg:justify-end">
                {project.tags.map((tag: string, index: number) => (
                  <span
                    key={index}
                    className="px-4 py-2 border border-pink-300/70 text-pink-200 text-sm font-medium bg-transparent"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {project.reflection && (
        <div className="mb-12 max-w-4xl">
          <h2 className="text-white font-bold text-[20px] mb-4">
            More about this project
          </h2>
          <p className="text-gray-300 text-[16px] font-normal leading-relaxed whitespace-pre-line">
            {project.reflection}
          </p>
        </div>
      )}

      {/* Image Gallery */}
      {resolvedMedia.length > 0 && (
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-white">
            Project Gallery
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {resolvedMedia.map((item: MediaItem, index: number) => {
              const isVideo = item.type === 'video';
              return (
                <div
                  key={index}
                  className={`relative aspect-video overflow-hidden bg-gray-900 border-[3px] border-white ${!isVideo ? 'cursor-pointer hover:opacity-90 transition-opacity' : ''}`}
                  onClick={() => !isVideo && openLightbox(item.url)}
                >
                  {isVideo ? (
                    <video
                      src={item.url}
                      controls
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Image
                      src={item.url}
                      alt={`${project.title} - Image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {resolvedMedia.length > 0 && relatedProjects.length > 0 && (
        <div className="mb-16 border-t-[3px] border-white" />
      )}

      {/* Related Projects */}
      {relatedProjects.length > 0 && (
        <div>
          <h2 className="text-3xl font-bold mb-8 text-white">
            Related Projects
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {relatedProjects.map((relatedProject: Project) => (
              <ProjectCard key={relatedProject.id} project={relatedProject} />
            ))}
          </div>
        </div>
      )}

      {/* Lightbox */}
      <ImageLightbox
        images={imageOnlyUrls}
        initialIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </div>
  );
}
