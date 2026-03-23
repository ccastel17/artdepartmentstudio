import Link from 'next/link';
import Image from 'next/image';
import { Project } from '@/types';

interface FeaturedProjectProps {
  project: Project;
}

export default function FeaturedProject({ project }: FeaturedProjectProps) {
  // Use heroMedia if available, otherwise use first image from gallery
  const featuredImage = project.heroMedia || project.media?.[0]?.url || project.images?.[0];
  const isVideo = project.media?.[0]?.type === 'video' || featuredImage?.match(/\.(mp4|mov|avi|webm)$/i);

  if (!featuredImage) {
    return null; // Don't render if no image available
  }

  return (
    <Link
      href={`/${project.section}/${project.id}`}
      className="group relative block h-[70vh] overflow-hidden bg-white/5 border-[3px] border-white rounded-none hover:border-white transition-colors"
    >
      {isVideo ? (
        <video
          src={featuredImage}
          className="absolute inset-0 w-full h-full object-cover transition-all duration-700"
          autoPlay
          loop
          muted
          playsInline
        />
      ) : (
        <Image
          src={featuredImage}
          alt={project.title}
          fill
          className="object-cover transition-all duration-700"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
        <p className="text-sm text-gray-400 mb-4 uppercase tracking-wider">{project.client} • {project.year}</p>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 group-hover:text-gray-300 transition-colors">
          {project.title}
        </h2>
        <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-3xl">
          {project.description}
        </p>
        <div className="inline-block px-6 py-3 bg-cyan-500 text-black font-semibold group-hover:bg-cyan-600 transition-colors">
          View project
        </div>
      </div>
    </Link>
  );
}
