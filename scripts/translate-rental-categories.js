const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

// Translation mapping
const TRANSLATION_MAP = {
  'Peanas': 'Pedestals',
  'Módulos': 'Modules',
  'Superficies para productos': 'Product Surfaces',
  'A la venta': 'For Sale',
  'Piezas esculpidas a pedido': 'Custom Carved Pieces'
};

async function translateRentalCategories() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('✓ Connected to MongoDB');

    const db = client.db();
    const projectsCollection = db.collection('projects');

    // Get all rental projects
    const rentalProjects = await projectsCollection.find({ section: 'rental' }).toArray();
    
    console.log(`Found ${rentalProjects.length} rental projects`);

    let updated = 0;
    
    // Translate categories for each rental project
    for (const project of rentalProjects) {
      if (project.categories && project.categories.length > 0) {
        const translatedCategories = project.categories.map(cat => TRANSLATION_MAP[cat] || cat);
        
        await projectsCollection.updateOne(
          { _id: project._id },
          { 
            $set: { 
              categories: translatedCategories,
              updatedAt: new Date()
            } 
          }
        );
        
        console.log(`✓ Updated "${project.title}": ${project.categories.join(', ')} → ${translatedCategories.join(', ')}`);
        updated++;
      }
    }

    console.log(`\n✅ Successfully translated categories for ${updated} rental projects`);

  } catch (error) {
    console.error('❌ Error translating categories:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

translateRentalCategories();
