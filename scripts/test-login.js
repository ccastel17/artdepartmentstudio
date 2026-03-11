const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

async function testLogin() {
  console.log('🔍 Verificando configuración de login...\n');

  // Verificar variables de entorno
  console.log('1️⃣ Variables de entorno:');
  console.log('   MONGODB_URI:', process.env.MONGODB_URI ? '✅ Configurado' : '❌ No configurado');
  console.log('   JWT_SECRET:', process.env.JWT_SECRET ? '✅ Configurado' : '⚠️  No configurado (usando default)');
  console.log('');

  if (!process.env.MONGODB_URI) {
    console.error('❌ MONGODB_URI no está configurado en .env.local');
    process.exit(1);
  }

  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    // Conectar a MongoDB
    console.log('2️⃣ Conectando a MongoDB...');
    await client.connect();
    console.log('   ✅ Conexión exitosa\n');

    const db = client.db();

    // Verificar usuario admin
    console.log('3️⃣ Verificando usuario admin:');
    const usersCollection = db.collection('users');
    const adminUser = await usersCollection.findOne({ username: 'admin' });

    if (!adminUser) {
      console.log('   ❌ Usuario admin no encontrado');
      console.log('   💡 Ejecuta: npm run init-db');
    } else {
      console.log('   ✅ Usuario admin encontrado');
      console.log('   Username:', adminUser.username);
      console.log('   Role:', adminUser.role);
      console.log('   Created:', adminUser.createdAt);
      
      // Probar password
      console.log('\n4️⃣ Probando contraseña:');
      const testPassword = 'admin123';
      const isValid = await bcrypt.compare(testPassword, adminUser.password);
      console.log('   Password "admin123":', isValid ? '✅ Válido' : '❌ Inválido');
      
      if (isValid) {
        console.log('\n✅ Todo está configurado correctamente!');
        console.log('\n📝 Credenciales de prueba:');
        console.log('   Username: admin');
        console.log('   Password: admin123');
        console.log('\n🌐 URL de login: http://localhost:3000/admin/login');
      }
    }

    // Contar proyectos
    console.log('\n5️⃣ Estadísticas de la base de datos:');
    const projectsCount = await db.collection('projects').countDocuments();
    const teamCount = await db.collection('team').countDocuments();
    const galleryCount = await db.collection('gallery').countDocuments();
    const contactsCount = await db.collection('contacts').countDocuments();
    
    console.log('   Proyectos:', projectsCount);
    console.log('   Equipo:', teamCount);
    console.log('   Galería:', galleryCount);
    console.log('   Mensajes:', contactsCount);

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.code === 'ENOTFOUND') {
      console.log('\n💡 Verifica que MongoDB esté corriendo y la URI sea correcta');
    }
  } finally {
    await client.close();
  }
}

testLogin();
