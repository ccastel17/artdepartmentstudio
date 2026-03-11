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
    const { title, description, fullText, heroImage, images, tags } = body;

    if (!title || !description || !fullText || !heroImage) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    const galleryPost = {
      title,
      description,
      fullText,
      heroImage,
      images: images || [],
      tags: tags || [],
      createdAt: new Date(),
    };

    const result = await db.collection('gallery').insertOne(galleryPost);

    return NextResponse.json(
      { message: 'Gallery post created', id: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error('❌ Error creating gallery post:', error);
    return NextResponse.json({ error: 'Error creating gallery post' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();

    const items = await db.collection('gallery')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ items }, { status: 200 });
  } catch (error) {
    console.error('❌ Error fetching gallery:', error);
    return NextResponse.json({ error: 'Error fetching gallery' }, { status: 500 });
  }
}
