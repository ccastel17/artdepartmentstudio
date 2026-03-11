const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

// Available categories for art direction projects
const CATEGORIES = [
  'Comerciales para TV',
  'Fotografía de producto'
];

// Function to get random category (1-2 categories per item)
function getRandomCategories() {
  const numCategories = Math.floor(Math.random() * 2) + 1; // 1 to 2 categories
  const shuffled = [...CATEGORIES].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, numCategories);
}

async function addCategoriesToArtDirection() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('✓ Connected to MongoDB');

    const db = client.db();
    const projectsCollection = db.collection('projects');

    // Get all art-direction projects
    const artDirectionProjects = await projectsCollection.find({ section: 'art-direction' }).toArray();
    
    console.log(`Found ${artDirectionProjects.length} art direction projects`);

    let updated = 0;
    
    // Add random categories to each art direction project
    for (const project of artDirectionProjects) {
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

    console.log(`\n✅ Successfully added categories to ${updated} art direction projects`);
    console.log(`📋 Available categories: ${CATEGORIES.join(', ')}`);

  } catch (error) {
    console.error('❌ Error adding categories:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

addCategoriesToArtDirection();
