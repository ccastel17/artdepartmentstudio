import Link from 'next/link';
import Image from 'next/image';
import clientPromise from '@/lib/db';

async function getGalleryPosts() {
  try {
    const client = await clientPromise;
    const db = client.db();
    
    const posts = await db.collection('gallery')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    
    return posts.map(p => ({
      id: p._id.toString(),
      title: p.title,
      description: p.description,
      heroImage: p.heroImage,
      tags: p.tags || [],
      createdAt: p.createdAt,
    }));
  } catch (error) {
    console.error('Error fetching gallery posts:', error);
    return [];
  }
}

export default async function GalleryPage() {
  const posts = await getGalleryPosts();

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <div className="mb-20">
          <h1 className="text-white mb-6">
            Gallery
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 max-w-3xl">
            A space to showcase and give place to artists from everywhere. Informal events where we bring together artists and creatives to share experiences.
          </p>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-6">
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-black">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/gallery/${post.id}`}
                  className="group block overflow-hidden bg-black border border-white hover:border-white transition-colors"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-white/5">
                    <Image
                      src={post.heroImage}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6 border-t border-white space-y-2">
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {post.tags.map((tag: string, index: number) => (
                          <span
                            key={index}
                            className="inline-block px-3 py-1 text-xs font-medium text-white bg-white/10 uppercase tracking-wider"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <h3 className="text-xl font-bold text-white group-hover:text-gray-400 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-gray-400 text-sm line-clamp-3">
                      {post.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg">
                No gallery posts yet.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
