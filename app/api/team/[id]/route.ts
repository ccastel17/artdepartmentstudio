import { NextResponse } from 'next/server';
import clientPromise from '@/lib/db';
import { cookies } from 'next/headers';
import { ObjectId } from 'mongodb';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token');

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const name = typeof body?.name === 'string' ? body.name : '';
    const role = typeof body?.role === 'string' ? body.role : '';
    const bio = typeof body?.bio === 'string' ? body.bio : '';
    const imageUrl = typeof body?.imageUrl === 'string' ? body.imageUrl : '';
    const isPartner = !!body?.isPartner;
    const portfolio = typeof body?.portfolio === 'string' ? body.portfolio : '';
    const linkedin = typeof body?.linkedin === 'string' ? body.linkedin : '';
    const order = typeof body?.order === 'number' ? body.order : undefined;

    if (!name || !role || !bio || !imageUrl) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    const updateData: Record<string, any> = {
      name,
      role,
      bio,
      imageUrl,
      isPartner,
      portfolio,
      linkedin,
      updatedAt: new Date(),
    };

    if (typeof order === 'number') {
      updateData.order = order;
    }

    const result = await db.collection('team').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Team member not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Team member updated' }, { status: 200 });
  } catch (error) {
    console.error('❌ Error updating team member:', error);
    return NextResponse.json({ error: 'Error updating team member' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token');

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const client = await clientPromise;
    const db = client.db();

    const result = await db.collection('team').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Team member not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Team member deleted' }, { status: 200 });
  } catch (error) {
    console.error('❌ Error deleting team member:', error);
    return NextResponse.json({ error: 'Error deleting team member' }, { status: 500 });
  }
}
