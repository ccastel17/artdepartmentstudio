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
    const { title, description, client, year, section, featured, images, heroMedia, tags, reflection, categories, media, pricePerDay } = body;

    const isRental = section === 'rental';

    console.log('📝 Updating project:', { id, title, section });

    if (
      !title ||
      !description ||
      !section ||
      (isRental
        ? (pricePerDay === undefined || pricePerDay === null || (typeof pricePerDay === 'string' && pricePerDay.trim() === ''))
        : (!client || !heroMedia))
    ) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const client_db = await clientPromise;
    const db = client_db.db();

    const parsedMedia = Array.isArray(media)
      ? media
      : (typeof media === 'string' && media ? JSON.parse(media) : []);

    const parsedImages = Array.isArray(images) ? images : JSON.parse(images || '[]');
    const resolvedImages = Array.isArray(parsedMedia) && parsedMedia.length > 0
      ? parsedMedia.map((m: any) => m?.url).filter(Boolean)
      : (Array.isArray(parsedImages) ? parsedImages : []);

    const parsedPricePerDay =
      typeof pricePerDay === 'number'
        ? pricePerDay
        : (typeof pricePerDay === 'string' && pricePerDay.trim() !== '' ? Number(pricePerDay) : undefined);

    if (isRental && typeof parsedPricePerDay !== 'number') {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (typeof parsedPricePerDay === 'number' && (Number.isNaN(parsedPricePerDay) || parsedPricePerDay < 0)) {
      return NextResponse.json(
        { error: 'Invalid pricePerDay' },
        { status: 400 }
      );
    }

    const updateData = {
      title,
      description,
      client: client || '',
      year: (typeof year === 'number' || typeof year === 'string') && String(year).trim() !== '' ? parseInt(String(year)) : undefined,
      section,
      featured: featured === 'true' || featured === true,
      images: resolvedImages,
      media: parsedMedia,
      heroMedia: heroMedia || '',
      tags: Array.isArray(tags) ? tags : (tags ? JSON.parse(tags) : []),
      categories: Array.isArray(categories) ? categories : (categories ? JSON.parse(categories) : []),
      reflection: reflection || '',
      pricePerDay: typeof parsedPricePerDay === 'number' ? parsedPricePerDay : undefined,
      updatedAt: new Date(),
    };

    await db.collection('projects').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    console.log('✅ Project updated:', id);

    return NextResponse.json({ message: 'Project updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('❌ Error updating project:', error);
    return NextResponse.json({ error: 'Error updating project' }, { status: 500 });
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

    await db.collection('projects').deleteOne({ _id: new ObjectId(id) });

    console.log('✅ Project deleted:', id);

    return NextResponse.json({ message: 'Project deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('❌ Error deleting project:', error);
    return NextResponse.json({ error: 'Error deleting project' }, { status: 500 });
  }
}
