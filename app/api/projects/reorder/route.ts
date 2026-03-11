import { NextResponse } from 'next/server';
import clientPromise from '@/lib/db';
import { cookies } from 'next/headers';
import { ObjectId } from 'mongodb';

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token');
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { updates } = body;

    if (!Array.isArray(updates)) {
      return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    // Update order for each project
    const bulkOps = updates.map(({ id, order }) => ({
      updateOne: {
        filter: { _id: new ObjectId(id) },
        update: { $set: { order, updatedAt: new Date() } },
      },
    }));

    await db.collection('projects').bulkWrite(bulkOps);

    console.log('✅ Projects reordered');

    return NextResponse.json({ message: 'Order updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('❌ Error reordering projects:', error);
    return NextResponse.json({ error: 'Error reordering projects' }, { status: 500 });
  }
}
