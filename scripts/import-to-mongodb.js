const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

async function importProjects() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('✓ Connected to MongoDB');

    const db = client.db();
    const projectsCollection = db.collection('projects');

    // Clear existing projects
    const deleteResult = await projectsCollection.deleteMany({});
    console.log(`✓ Cleared ${deleteResult.deletedCount} existing projects`);

    // Load projects from JSON
    const dataPath = path.join(__dirname, '..', 'data', 'projects.json');
    const projectsData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

    let totalImported = 0;

    // Import projects for each section
    for (const [section, projects] of Object.entries(projectsData)) {
      for (const project of projects) {
        // Remove the string id and let MongoDB generate _id
        const { id, date, ...projectData } = project;
        
        await projectsCollection.insertOne({
          ...projectData,
          client: 'Art Department Studio',
          year: new Date(date).getFullYear(),
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        
        totalImported++;
      }
      console.log(`✓ Imported ${projects.length} projects for ${section}`);
    }

    console.log(`\n✅ Successfully imported ${totalImported} projects to MongoDB`);
    console.log('✅ You can now view them at http://localhost:3000');

  } catch (error) {
    console.error('❌ Error importing projects:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

importProjects();
