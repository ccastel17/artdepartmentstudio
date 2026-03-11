const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

// Translation mapping
const TRANSLATION_MAP = {
  'Comerciales para TV': 'TV Commercials',
  'Fotografía de producto': 'Product Photography'
};

async function translateArtDirectionCategories() {
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
    
    // Translate categories for each art direction project
    for (const project of artDirectionProjects) {
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

    console.log(`\n✅ Successfully translated categories for ${updated} art direction projects`);

  } catch (error) {
    console.error('❌ Error translating categories:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

translateArtDirectionCategories();
