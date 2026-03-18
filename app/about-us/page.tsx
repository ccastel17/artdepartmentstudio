import Image from 'next/image';
import { Linkedin, ExternalLink } from 'lucide-react';
import { TeamMember } from '@/types';
import clientPromise from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getTeamMembers(): Promise<TeamMember[]> {
  try {
    const client = await clientPromise;
    const db = client.db();

    const members = await db
      .collection('team')
      .find({})
      .sort({ order: 1, isPartner: -1, createdAt: 1 })
      .limit(4)
      .toArray();

    return members.map((m: any) => ({
      id: m._id?.toString(),
      name: m.name,
      role: m.role,
      bio: m.bio,
      imageUrl: m.imageUrl,
      portfolio: m.portfolio || '',
      linkedin: m.linkedin || '',
      isPartner: !!m.isPartner,
      order: typeof m.order === 'number' ? m.order : 0,
    }));
  } catch (error) {
    console.error('Error fetching team:', error);
    return [];
  }
}

export default async function AboutUsPage() {
  const members = await getTeamMembers();

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-32">
        <h1 className="text-white mb-12">
          About Us
        </h1>
        <div className="max-w-4xl space-y-8">
          <p className="text-xl md:text-2xl text-gray-400 leading-relaxed">
            Art Department Studio is a scenographic materials production and product photography 
            studio with over 10 years of experience in the audiovisual industry.
          </p>
          <p className="text-xl md:text-2xl text-gray-400 leading-relaxed">
            Located in our workshop in Hospitalet de Llobregat, we manufacture materials 
            for filming and produce projects that include on-site or workshop scenographic production, 
            photo shoots, art direction for filming, and crew assembly for events, festivals, and sets.
          </p>
        </div>
      </div>

      {/* Partners */}
      <div className="mb-32">
        <h2 className="text-white mb-16">
          Founding Partners
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {members.map((member) => (
            <div key={member.id} className="group">
              <div className="relative aspect-square mb-6 overflow-hidden bg-white/5">
                {member.imageUrl || member.image ? (
                  <Image
                    src={member.imageUrl || member.image || ''}
                    alt={member.name}
                    fill
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                ) : (
                  <div className="absolute inset-0" />
                )}
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                {member.name}
              </h3>
              <p className="text-lg text-gray-400 mb-4">
                {member.role}
              </p>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                {member.bio}
              </p>
              <div className="flex gap-4">
                {member.portfolio && (
                  <a
                    href={member.portfolio}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                    aria-label={`Portfolio de ${member.name}`}
                  >
                    <ExternalLink size={24} />
                  </a>
                )}
                {member.linkedin && (
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                    aria-label={`LinkedIn de ${member.name}`}
                  >
                    <Linkedin size={24} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
