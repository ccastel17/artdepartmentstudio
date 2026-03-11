import { notFound } from 'next/navigation';
import clientPromise from '@/lib/db';
import { ObjectId } from 'mongodb';
import GalleryPostClient from '@/components/GalleryPostClient';

async function getGalleryPost(id: string) {
  try {
    const client = await clientPromise;
    const db = client.db();
    
    const post = await db.collection('gallery').findOne({ _id: new ObjectId(id) });
    
    if (!post) return null;
    
    return {
      id: post._id.toString(),
      title: post.title,
      description: post.description,
      fullText: post.fullText,
      heroImage: post.heroImage,
      images: post.images || [],
      tags: post.tags || [],
      createdAt: post.createdAt,
    };
  } catch (error) {
    console.error('Error fetching gallery post:', error);
    return null;
  }
}

export default async function GalleryPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getGalleryPost(id);

  if (!post) {
    notFound();
  }

  return <GalleryPostClient post={post} />;
}
