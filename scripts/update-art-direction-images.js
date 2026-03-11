const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

// Available images for art direction
const IMAGES = [
  '/art-direction-1.jpg',
  '/art-direction-2.jpg',
  '/art-direction-3.jpg',
  '/art-direction-4.jpg'
];

async function updateArtDirectionImages() {
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
    
    // Update each art direction project with cycling images
    for (let i = 0; i < artDirectionProjects.length; i++) {
      const project = artDirectionProjects[i];
      
      // Cycle through images for variety
      const imageIndex = i % IMAGES.length;
      const mainImage = IMAGES[imageIndex];
      const otherImages = IMAGES.filter((_, idx) => idx !== imageIndex);
      
      const projectImages = [
        mainImage,
        ...otherImages
      ];
      
      await projectsCollection.updateOne(
        { _id: project._id },
        { 
          $set: { 
            images: projectImages,
            heroMedia: mainImage,
            updatedAt: new Date()
          } 
        }
      );
      
      console.log(`✓ Updated "${project.title}" with backstage images`);
      updated++;
    }

    console.log(`\n✅ Successfully updated ${updated} art direction projects with new images`);
    console.log('✅ All art direction items now use professional backstage photos');

  } catch (error) {
    console.error('❌ Error updating art direction images:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

updateArtDirectionImages();
