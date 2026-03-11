const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

// Available categories for rental items
const CATEGORIES = [
  'Peanas',
  'Módulos',
  'Superficies para productos',
  'A la venta',
  'Piezas esculpidas a pedido'
];

// Function to get random categories (1-3 categories per item)
function getRandomCategories() {
  const numCategories = Math.floor(Math.random() * 3) + 1; // 1 to 3 categories
  const shuffled = [...CATEGORIES].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, numCategories);
}

async function addCategoriesToRental() {
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
    
    // Add random categories to each rental project
    for (const project of rentalProjects) {
      const categories = getRandomCategories();
      
      await projectsCollection.updateOne(
        { _id: project._id },
        { 
          $set: { 
            categories: categories,
            updatedAt: new Date()
          } 
        }
      );
      
      console.log(`✓ Updated "${project.title}" with categories: ${categories.join(', ')}`);
      updated++;
    }

    console.log(`\n✅ Successfully added categories to ${updated} rental projects`);
    console.log(`📋 Available categories: ${CATEGORIES.join(', ')}`);

  } catch (error) {
    console.error('❌ Error adding categories:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

addCategoriesToRental();
