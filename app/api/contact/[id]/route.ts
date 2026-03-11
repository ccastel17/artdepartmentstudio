import { NextResponse } from 'next/server';
import clientPromise from '@/lib/db';
import { cookies } from 'next/headers';
import { ObjectId } from 'mongodb';

export async function PATCH(
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
    const { read } = body;

    const client = await clientPromise;
    const db = client.db();

    await db.collection('contacts').updateOne(
      { _id: new ObjectId(id) },
      { $set: { read, updatedAt: new Date() } }
    );

    return NextResponse.json({ message: 'Contact updated' }, { status: 200 });
  } catch (error) {
    console.error('Error updating contact:', error);
    return NextResponse.json({ error: 'Error updating contact' }, { status: 500 });
  }
}
