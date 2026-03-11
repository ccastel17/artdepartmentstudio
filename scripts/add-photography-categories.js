const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

// Available categories for photography projects
const CATEGORIES = [
  'Stills',
  'Events',
  'In Set',
  'At ADS'
];

// Function to get random categories (1-2 categories per item)
function getRandomCategories() {
  const numCategories = Math.floor(Math.random() * 2) + 1; // 1 to 2 categories
  const shuffled = [...CATEGORIES].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, numCategories);
}

async function addCategoriesToPhotography() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('✓ Connected to MongoDB');

    const db = client.db();
    const projectsCollection = db.collection('projects');

    // Get all fotografia projects
    const photographyProjects = await projectsCollection.find({ section: 'fotografia' }).toArray();
    
    console.log(`Found ${photographyProjects.length} photography projects`);

    let updated = 0;
    
    // Add random categories to each photography project
    for (const project of photographyProjects) {
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

    console.log(`\n✅ Successfully added categories to ${updated} photography projects`);
    console.log(`📋 Available categories: ${CATEGORIES.join(', ')}`);

  } catch (error) {
    console.error('❌ Error adding categories:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

addCategoriesToPhotography();
