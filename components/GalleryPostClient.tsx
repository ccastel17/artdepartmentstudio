'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ImageLightbox from '@/components/ImageLightbox';

interface GalleryPostClientProps {
  post: {
    id: string;
    title: string;
    description: string;
    fullText: string;
    heroImage: string;
    images: string[];
    tags: string[];
    createdAt: Date;
  };
}

export default function GalleryPostClient({ post }: GalleryPostClientProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // All images including hero for lightbox
  const allImages = [post.heroImage, ...post.images];

  const openLightbox = (imageUrl: string) => {
    const index = allImages.indexOf(imageUrl);
    if (index !== -1) {
      setLightboxIndex(index);
      setLightboxOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section con imagen principal */}
      <section className="relative h-[70vh] bg-black">
        <div 
          className="absolute inset-0 cursor-pointer"
          onClick={() => openLightbox(post.heroImage)}
        >
          <Image
            src={post.heroImage}
            alt={post.title}
            fill
            className="object-cover opacity-60 hover:opacity-70 transition-opacity"
          />
        </div>
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-4xl mx-auto w-full px-6 pb-12">
            <Link
              href="/gallery"
              className="inline-flex items-center gap-2 text-white hover:text-gray-300 mb-6 transition-colors"
            >
              <ArrowLeft size={20} />
              Back to gallery
            </Link>
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map((tag: string, index: number) => (
                  <span
                    key={index}
                    className="inline-block px-3 py-1 text-xs font-medium text-white bg-white/20 backdrop-blur-sm uppercase tracking-wider"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight">
              {post.title}
            </h1>
          </div>
        </div>
      </section>

      {/* Content */}
      <article className="py-20 px-6 max-w-4xl mx-auto">
        <div className="mb-12">
          <p className="text-2xl text-gray-700 leading-relaxed">
            {post.description}
          </p>
        </div>

        <div className="prose prose-lg max-w-none text-gray-800 mb-16">
          {post.fullText.split('\n').map((paragraph: string, index: number) => (
            paragraph.trim() && <p key={index} className="mb-4">{paragraph}</p>
          ))}
        </div>

        {/* Gallery Images */}
        {post.images && post.images.length > 0 && (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-black mb-8">Gallery</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {post.images.map((image: string, index: number) => (
                <div
                  key={index}
                  className="relative aspect-[4/3] overflow-hidden bg-gray-100 cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => openLightbox(image)}
                >
                  <Image
                    src={image}
                    alt={`${post.title} - Image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </article>

      {/* Lightbox */}
      <ImageLightbox
        images={allImages}
        initialIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </div>
  );
}
