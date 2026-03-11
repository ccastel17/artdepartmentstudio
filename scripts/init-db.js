const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

async function initDatabase() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('✓ Conectado a MongoDB');

    const db = client.db();

    // Crear usuario administrador
    const usersCollection = db.collection('users');
    const existingUser = await usersCollection.findOne({ username: 'admin' });

    if (!existingUser) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await usersCollection.insertOne({
        username: 'admin',
        password: hashedPassword,
        role: 'admin',
        createdAt: new Date(),
      });
      console.log('✓ Usuario administrador creado');
      console.log('  Username: admin');
      console.log('  Password: admin123');
      console.log('  ⚠️  CAMBIA LA CONTRASEÑA EN PRODUCCIÓN');
    } else {
      console.log('✓ Usuario administrador ya existe');
    }

    // Crear índices
    await usersCollection.createIndex({ username: 1 }, { unique: true });
    await db.collection('projects').createIndex({ section: 1 });
    await db.collection('projects').createIndex({ featured: 1 });
    await db.collection('team').createIndex({ isPartner: 1 });
    await db.collection('gallery').createIndex({ date: -1 });
    await db.collection('contacts').createIndex({ createdAt: -1 });
    await db.collection('contacts').createIndex({ read: 1 });

    console.log('✓ Índices creados');

    console.log('\n✅ Base de datos inicializada correctamente');
    console.log('\nPuedes acceder al panel de administración en: http://localhost:3000/admin/login');

  } catch (error) {
    console.error('❌ Error al inicializar la base de datos:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

initDatabase();
