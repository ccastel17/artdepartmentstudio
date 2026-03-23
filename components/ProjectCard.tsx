import Link from 'next/link';
import Image from 'next/image';
import { Project } from '@/types';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  // Use heroMedia if available, otherwise use first item from gallery
  const thumbnail = project.heroMedia || project.media?.[0]?.url || project.images[0];
  const isVideo = project.media?.[0]?.type === 'video' || thumbnail?.match(/\.(mp4|mov|avi|webm)$/i);

  if (!thumbnail) {
    return null; // Don't render if no image available
  }

  return (
    <Link
      href={`/${project.section}/${project.id}`}
      className="group block overflow-hidden bg-black transition-colors border-[3px] border-white"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-white/5">
        {isVideo ? (
          <video
            src={thumbnail}
            className="absolute inset-0 w-full h-full object-cover transition-all duration-500"
            autoPlay
            loop
            muted
            playsInline
          />
        ) : (
          <Image
            src={thumbnail}
            alt={project.title}
            fill
            className="object-cover transition-all duration-500"
          />
        )}
        {project.pricePerDay && (
          <div className="absolute bottom-4 left-4 z-10 bg-black/95 backdrop-blur-sm px-4 py-2 rounded-full border border-white shadow-xl">
            <p className="text-white font-semibold text-sm">
              €{project.pricePerDay}/day
            </p>
          </div>
        )}
      </div>
      <div className="p-6 border-t-[3px] border-white">
        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-gray-400 transition-colors">
          {project.title}
        </h3>
        <p className="text-sm text-gray-400 mb-3 uppercase tracking-wider">{project.client} • {project.year}</p>
        <p className="text-gray-400 text-sm line-clamp-2">{project.description}</p>
      </div>
    </Link>
  );
}
