import { NextResponse } from 'next/server';
import clientPromise from '@/lib/db';
import { cookies } from 'next/headers';
import { ObjectId } from 'mongodb';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    const updatedPost = {
      title,
      description,
      fullText,
      heroImage,
      images: images || [],
      tags: tags || [],
      updatedAt: new Date(),
    };

    const result = await db.collection('gallery').updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedPost }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json(
      { message: 'Gallery post updated', id },
      { status: 200 }
    );
  } catch (error) {
    console.error('❌ Error updating gallery post:', error);
    return NextResponse.json({ error: 'Error updating gallery post' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token');
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db();

    const result = await db.collection('gallery').deleteOne({
      _id: new ObjectId(id)
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json(
      { message: 'Gallery post deleted' },
      { status: 200 }
    );
  } catch (error) {
    console.error('❌ Error deleting gallery post:', error);
    return NextResponse.json({ error: 'Error deleting gallery post' }, { status: 500 });
  }
}
