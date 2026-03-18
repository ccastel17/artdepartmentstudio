import { NextResponse } from 'next/server';
import clientPromise from '@/lib/db';
import { cookies } from 'next/headers';

const SETTINGS_ID = 'global';

type SiteSettingsDoc = {
  _id: string;
  homeHeroVideoUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();

    const collection = db.collection<SiteSettingsDoc>('site_settings');

    const doc = await collection.findOne({ _id: SETTINGS_ID });

    return NextResponse.json(
      { homeHeroVideoUrl: doc?.homeHeroVideoUrl || '' },
      { status: 200 }
    );
  } catch (error) {
    console.error('❌ Error fetching home video setting:', error);
    return NextResponse.json(
      { error: 'Error fetching setting' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token');

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const homeHeroVideoUrl = typeof body?.homeHeroVideoUrl === 'string' ? body.homeHeroVideoUrl : '';

    const client = await clientPromise;
    const db = client.db();

    const collection = db.collection<SiteSettingsDoc>('site_settings');

    await collection.updateOne(
      { _id: SETTINGS_ID },
      {
        $set: {
          homeHeroVideoUrl,
          updatedAt: new Date(),
        },
        $setOnInsert: {
          createdAt: new Date(),
        },
      },
      { upsert: true }
    );

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error('❌ Error updating home video setting:', error);
    return NextResponse.json(
      { error: 'Error updating setting' },
      { status: 500 }
    );
  }
}
