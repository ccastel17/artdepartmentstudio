import { NextResponse } from 'next/server';
import clientPromise from '@/lib/db';
import { cookies } from 'next/headers';

const MAX_TEAM_MEMBERS = 4;

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token');
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, role, bio, imageUrl, isPartner, portfolio, linkedin } = body;

    if (!name || !role || !bio || !imageUrl) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    const existingCount = await db.collection('team').countDocuments({});
    if (existingCount >= MAX_TEAM_MEMBERS) {
      return NextResponse.json(
        { error: `Max ${MAX_TEAM_MEMBERS} team members allowed` },
        { status: 400 }
      );
    }

    const last = await db
      .collection('team')
      .find({})
      .sort({ order: -1, createdAt: -1 })
      .limit(1)
      .toArray();

    const nextOrder = typeof last?.[0]?.order === 'number' ? last[0].order + 1 : existingCount;

    const teamMember = {
      name,
      role,
      bio,
      imageUrl,
      isPartner: isPartner || false,
      portfolio: portfolio || '',
      linkedin: linkedin || '',
      order: nextOrder,
      createdAt: new Date(),
    };

    const result = await db.collection('team').insertOne(teamMember);

    return NextResponse.json(
      { message: 'Team member added', id: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error('❌ Error adding team member:', error);
    return NextResponse.json({ error: 'Error adding team member' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();

    const members = await db.collection('team')
      .find({})
      .sort({ order: 1, isPartner: -1, createdAt: 1 })
      .toArray();

    const normalized = members.map((m: any) => ({
      id: m._id?.toString(),
      name: m.name,
      role: m.role,
      bio: m.bio,
      imageUrl: m.imageUrl,
      portfolio: m.portfolio || '',
      linkedin: m.linkedin || '',
      isPartner: !!m.isPartner,
      order: typeof m.order === 'number' ? m.order : 0,
      createdAt: m.createdAt,
      updatedAt: m.updatedAt,
    }));

    return NextResponse.json({ members: normalized }, { status: 200 });
  } catch (error) {
    console.error('❌ Error fetching team:', error);
    return NextResponse.json({ error: 'Error fetching team' }, { status: 500 });
  }
}
