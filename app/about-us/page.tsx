import { TeamMember } from '@/types';
import clientPromise from '@/lib/db';
import AboutUsTeamMembersClient from '@/components/AboutUsTeamMembersClient';

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
            Art Department Studio is a creative powerhouse where stories take physical shape. Operating at the heart of the audiovisual industry, we are a multidisciplinary team dedicated to bringing cinematic visions to life through expert Art Direction and high-end production.
          </p>
          <p className="text-xl md:text-2xl text-gray-400 leading-relaxed">
            We offer a comprehensive, end-to-end service that covers every stage of the creative process: from the initial concept and design to the final on-set logistics. Our strength lies in our ability to manage complex projects through a specialized crew of professionals and our own fully-equipped workshop.
          </p>
          <p className="text-xl md:text-2xl text-gray-400 leading-relaxed">
            Located in Hospitalet de Llobregat, our facilities house specialized areas for carpentry, blacksmithing, and prop making. This allows us to maintain total control over quality and deadlines, manufacturing bespoke scenic elements and custom builds for films, commercials, and events.
          </p>
          <p className="text-xl md:text-2xl text-gray-400 leading-relaxed">
            At Art Department Studio, we combine raw craftsmanship with technical precision to build the environments where your stories happen.
          </p>
        </div>
      </div>

      {/* Partners */}
      <div className="mb-32">
        <h2 className="text-white mb-16">
          Founding Partners
        </h2>
        <AboutUsTeamMembersClient members={members} />
      </div>
    </div>
  );
}
