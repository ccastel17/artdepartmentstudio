const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

// Available images for photography
const IMAGES = [
  '/photography-1.jpg',
  '/photography-2.jpg',
  '/photography-3.jpg',
  '/photography-4.jpg'
];

async function updatePhotographyImages() {
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
    
    // Update each photography project with cycling images
    for (let i = 0; i < photographyProjects.length; i++) {
      const project = photographyProjects[i];
      
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
      
      console.log(`✓ Updated "${project.title}" with professional photography images`);
      updated++;
    }

    console.log(`\n✅ Successfully updated ${updated} photography projects with new images`);
    console.log('✅ All photography items now use professional photos');

  } catch (error) {
    console.error('❌ Error updating photography images:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

updatePhotographyImages();
