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
        <AboutUsTeamMembersClient members={members} />
      </div>
    </div>
  );
}
