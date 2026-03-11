const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

async function updateRentalImages() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('✓ Connected to MongoDB');

    const db = client.db();
    const projectsCollection = db.collection('projects');

    // Update all rental projects to use the new image
    const result = await projectsCollection.updateMany(
      { section: 'rental' },
      { 
        $set: { 
          images: [
            '/rental-placeholder.jpg',
            '/rental-placeholder.jpg',
            '/rental-placeholder.jpg',
            '/rental-placeholder.jpg'
          ],
          heroMedia: '/rental-placeholder.jpg'
        } 
      }
    );

    console.log(`✓ Updated ${result.modifiedCount} rental projects with new images`);
    console.log('✅ All rental items now use the forest image');

  } catch (error) {
    console.error('❌ Error updating rental images:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

updateRentalImages();
