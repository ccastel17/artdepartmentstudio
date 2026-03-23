import { NextResponse } from 'next/server';
import clientPromise from '@/lib/db';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    // Check authentication
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token');
    
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, description, client, year, section, featured, images, heroMedia, tags, reflection, categories, media, pricePerDay } = body;

    const isRental = section === 'rental';

    console.log('📥 Creating project:', { title, section });

    if (
      !title ||
      !description ||
      !section ||
      (isRental
        ? (pricePerDay === undefined || pricePerDay === null || (typeof pricePerDay === 'string' && pricePerDay.trim() === ''))
        : (!client || !heroMedia))
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const client_db = await clientPromise;
    const db = client_db.db();

    const parsedMedia = Array.isArray(media)
      ? media
      : (typeof media === 'string' && media ? JSON.parse(media) : []);

    const parsedImages = typeof images === 'string' ? JSON.parse(images) : images;
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

    const project = {
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
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('projects').insertOne(project);

    console.log('✅ Project created:', result.insertedId);

    return NextResponse.json(
      { message: 'Project created successfully', id: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error('❌ Error creating project:', error);
    return NextResponse.json(
      { error: 'Error creating project' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const section = searchParams.get('section');

    const client = await clientPromise;
    const db = client.db();

    const query = section ? { section } : {};
    console.log('🔍 Fetching projects with query:', query);
    
    const projects = await db.collection('projects')
      .find(query)
      .sort({ order: 1, createdAt: -1 })
      .toArray();

    console.log(`📊 Found ${projects.length} projects for section: ${section || 'all'}`);
    projects.forEach(p => console.log(`  - ${p.title} (section: ${p.section})`));

    return NextResponse.json({ projects }, { status: 200 });
  } catch (error) {
    console.error('❌ Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Error fetching projects' },
      { status: 500 }
    );
  }
}
