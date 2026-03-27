import Link from 'next/link';
import Image from 'next/image';
import clientPromise from '@/lib/db';
import { SECTIONS } from '@/lib/constants';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getLatestProjects() {
  try {
    const client = await clientPromise;
    const db = client.db();
    
    const projects = await db.collection('projects')
      .find({})
      .sort({ createdAt: -1 })
      .limit(6)
      .toArray();
    
    return projects.map(p => ({
      id: p._id.toString(),
      title: p.title,
      section: p.section === 'set-buildings' ? 'prop-making' : p.section,
      heroMedia: p.heroMedia || p.images?.[0] || '',
    }));
  } catch (error) {
    console.error('Error fetching latest projects:', error);
    return [];
  }
}

async function getHomeHeroVideoUrl() {
  try {
    const client = await clientPromise;
    const db = client.db();

    const collection = db.collection<{ _id: string; homeHeroVideoUrl?: string }>('site_settings');
    const doc = await collection.findOne({ _id: 'global' });
    return doc?.homeHeroVideoUrl || '';
  } catch (error) {
    console.error('Error fetching home hero video url:', error);
    return '';
  }
}

const sections = [
  {
    href: '/prop-making',
    title: 'Prop Making',
    description: 'From concept to reality, we design and manufacture high-end props for film, TV, and theater. Our workshop combines traditional craftsmanship with technical precision to create hero objects and custom pieces that bring every story to life.',
    hoverColor: 'group-hover:text-purple-500',
  },
  {
    href: '/fotografia',
    title: 'Photography',
    description: 'Capturing the essence of your products and projects through our lens. We create visual narratives that connect, inspire, and elevate your brand to new dimensions.',
    hoverColor: 'group-hover:text-pink-500',
  },
  {
    href: '/art-direction',
    title: 'Art Direction',
    description: 'From concept to set. We build worlds blending technique, storytelling, and crafting knowledge. The place where art meets technique. Where ideas take shape.',
    hoverColor: 'group-hover:text-orange-500',
  },
  {
    href: '/rental',
    title: 'Rental',
    description: 'We offer a curated selection of contemporary sculptural elements, pedestals (peanas), and traditional panots for rent. Available in stone, wood, and metal, our collection provides high-quality aesthetic solutions for set design, exhibitions, and events.',
    hoverColor: 'group-hover:text-green-500',
  },
];

export default async function Home() {
  const latestProjects = await getLatestProjects();
  const homeHeroVideoUrl = await getHomeHeroVideoUrl();
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center overflow-hidden border-b-4 border-white">
        {/* Video Background */}
        {homeHeroVideoUrl && (
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover grayscale opacity-50"
          >
            <source src={homeHeroVideoUrl} type="video/mp4" />
          </video>
        )}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50" />
        
        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto w-full px-6 mt-16">
          <div className="space-y-8">
            <h1 className="text-white leading-none">
              Art Department<br />Studio
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 max-w-3xl leading-relaxed">
              Creative studio and workshop specializing in set design and prop making for the audiovisual and theater industries. 
              Based in our own production space, we design and build custom backdrops and elements for any project.
            </p>
            <div className="pt-4">
              <Link
                href="/about-us"
                className="inline-block px-6 py-3 bg-cyan-500 text-black font-semibold hover:bg-cyan-600 transition-colors"
              >
                Learn more about us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-white mb-20 mt-0">
            Our Services
          </h2>
          
          <div>
            {sections.map((section, index) => (
              <Link
                key={section.href}
                href={section.href}
                className="group block border-t border-white/10 py-8 hover:bg-white/5 transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-8 pr-0 md:pr-20">
                  <div className="flex flex-col items-center md:flex-row md:items-center gap-4 md:gap-8 flex-1">
                    <span className={`text-4xl md:text-6xl lg:text-8xl font-bold text-white/10 transition-colors w-16 md:w-24 lg:w-32 flex-shrink-0 text-center ${section.hoverColor}`}>
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div className="flex-1 text-center md:text-left md:ml-0">
                      <h3 className="text-white mb-2">
                        {section.title}
                      </h3>
                      <p className="text-base md:text-lg lg:text-xl text-gray-400">
                        {section.description}
                      </p>
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <svg 
                      className="w-8 h-8 text-gray-400 group-hover:text-white group-hover:translate-x-2 transition-all" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Highlighted Projects Section */}
      {latestProjects.length > 0 && (
        <section className="py-20 border-t-4 border-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 mb-12">
            <h2 className="text-white">
              Highlighted Projects
            </h2>
          </div>
          
          <div className="relative">
            <div className="flex gap-2 animate-scroll hover:pause-animation">
              {/* Duplicamos los proyectos para el efecto infinito */}
              {[...latestProjects, ...latestProjects].map((project, index) => {
                const isVideo = project.heroMedia?.match(/\.(mp4|mov|avi|webm)$/i);
                
                return (
                  <Link
                    key={`${project.id}-${index}`}
                    href={`/${project.section}/${project.id}`}
                    className="group block flex-shrink-0 w-[400px]"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-white/5 rounded">
                      {project.heroMedia && (
                        isVideo ? (
                          <video
                            src={project.heroMedia}
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            muted
                            playsInline
                          />
                        ) : (
                          <Image
                            src={project.heroMedia}
                            alt={project.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        )
                      )}
                      {/* Tag sobre la imagen */}
                      <div className="absolute bottom-4 left-4">
                        <span className="inline-block px-3 py-1 text-xs font-medium text-white bg-black/70 backdrop-blur-sm rounded-full uppercase tracking-wider">
                          {SECTIONS[project.section as keyof typeof SECTIONS]}
                        </span>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-white mt-4 group-hover:text-gray-400 transition-colors">
                      {project.title}
                    </h3>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-32 border-t-4 border-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <h2 className="text-white text-left">
              Let's work toghether
            </h2>
            <Link
              href="/contact"
              className="flex-shrink-0 px-8 py-4 bg-yellow-500 text-black text-lg font-semibold rounded-full hover:bg-yellow-600 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
