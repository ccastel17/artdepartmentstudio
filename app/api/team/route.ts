import { NextResponse } from 'next/server';
import clientPromise from '@/lib/db';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token');
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, role, bio, imageUrl, isPartner } = body;

    if (!name || !role || !bio || !imageUrl) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    const teamMember = {
      name,
      role,
      bio,
      imageUrl,
      isPartner: isPartner || false,
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
      .sort({ isPartner: -1, createdAt: 1 })
      .toArray();

    return NextResponse.json({ members }, { status: 200 });
  } catch (error) {
    console.error('❌ Error fetching team:', error);
    return NextResponse.json({ error: 'Error fetching team' }, { status: 500 });
  }
}
