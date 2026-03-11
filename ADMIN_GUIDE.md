# Guía de Administración - Art Department Studio

## 🔐 Acceso al Panel de Administración

### URL de Login
http://localhost:3000/admin/login

### Credenciales
- **Usuario**: `admin`
- **Contraseña**: `admin123`

⚠️ **IMPORTANTE**: Cambia estas credenciales en producción ejecutando:
```bash
npm run init-db
```
Y luego actualiza manualmente la contraseña en la base de datos.

## 📋 Secciones del Admin

### 1. **Set Buildings** (`/admin/set-buildings`)
Gestión de proyectos de construcción de sets.

**Campos:**
- Título del proyecto *
- Descripción *
- Cliente *
- Año *
- URLs de imágenes (múltiples)
- Proyecto destacado (checkbox)

### 2. **Photography** (`/admin/fotografia`)
Gestión de proyectos de fotografía.

**Campos:** Igual que Set Buildings

### 3. **Product** (`/admin/producto`)
Gestión de proyectos de producto.

**Campos:** Igual que Set Buildings

### 4. **Institutional** (`/admin/institucional`)
Gestión de proyectos institucionales.

**Campos:** Igual que Set Buildings

### 5. **Art Direction** (`/admin/art-direction`)
Gestión de proyectos de dirección de arte.

**Campos:** Igual que Set Buildings

### 6. **Rental** (`/admin/rental`)
Gestión de items de alquiler.

**Campos:** Igual que Set Buildings

### 7. **Gallery** (`/admin/gallery`)
Gestión de la galería de imágenes.

**Campos:**
- Título de la imagen *
- URL de la imagen *
- Fecha *

### 8. **Team** (`/admin/team`)
Gestión de miembros del equipo.

**Campos:**
- Nombre *
- Rol *
- Biografía *
- URL de imagen *
- Es socio/fundador (checkbox)

### 9. **Messages** (`/admin/contacts`)
Visualización de mensajes de contacto.

**Funciones:**
- Ver todos los mensajes
- Marcar como leído
- Ver fecha de envío
- Contactar por email (click en email)

## 🎨 Cómo Usar las Imágenes

### Opción 1: Usar URLs de Imágenes Externas
Sube tus imágenes a un servicio de hosting como:
- **Cloudinary** (recomendado)
- **AWS S3**
- **Google Cloud Storage**
- **Imgur**

Luego copia la URL pública y pégala en el formulario.

### Opción 2: Configurar Upload Local (Futuro)
Para subir imágenes directamente desde el admin, necesitarás configurar:
1. Un servicio de almacenamiento
2. Un endpoint de upload
3. Actualizar los formularios

## 📝 Flujo de Trabajo Recomendado

### Para Agregar un Proyecto:

1. **Prepara las imágenes**
   - Sube las imágenes a tu servicio de hosting
   - Copia las URLs públicas

2. **Accede al admin**
   - Ve a http://localhost:3000/admin/login
   - Ingresa con tus credenciales

3. **Selecciona la sección**
   - Click en la sección correspondiente (ej: "Set Buildings")

4. **Completa el formulario**
   - Título: Nombre descriptivo del proyecto
   - Descripción: Detalles del proyecto
   - Cliente: Nombre del cliente
   - Año: Año de realización
   - Imágenes: Pega las URLs (puedes agregar múltiples)
   - Featured: Marca si quieres que aparezca en la homepage

5. **Guarda**
   - Click en "Save Project"
   - Verás un mensaje de confirmación

### Para Agregar un Miembro del Equipo:

1. Sube la foto del miembro a tu hosting
2. Ve a `/admin/team`
3. Completa el formulario con los datos
4. Marca "Partner" si es socio fundador
5. Guarda

### Para Ver Mensajes de Contacto:

1. Ve a `/admin/contacts`
2. Los mensajes nuevos aparecen con borde azul
3. Click en "Mark as Read" para marcarlos como leídos
4. Click en el email para responder

## 🔒 Seguridad

### En Desarrollo:
- Las cookies funcionan con HTTP
- Los logs están activados para debugging

### En Producción:
1. **Cambia las credenciales**
2. **Configura HTTPS**
3. **Actualiza JWT_SECRET** en `.env.local`
4. **Reduce los logs** en los archivos de API

## 🐛 Solución de Problemas

### "No puedo entrar al admin"
1. Verifica que el servidor esté corriendo: `npm run dev`
2. Verifica las credenciales: `admin` / `admin123`
3. Verifica la base de datos: `npm run test-login`
4. Limpia las cookies del navegador

### "Error al guardar proyecto"
1. Verifica que todos los campos requeridos (*) estén completos
2. Verifica que las URLs de imágenes sean válidas
3. Revisa los logs en la terminal del servidor

### "No veo los proyectos en el sitio"
1. Verifica que el proyecto se guardó correctamente
2. Recarga la página del sitio
3. Verifica que la sección sea correcta

## 📊 Base de Datos

### Colecciones:
- `users` - Usuarios administradores
- `projects` - Proyectos de todas las secciones
- `gallery` - Imágenes de la galería
- `team` - Miembros del equipo
- `contacts` - Mensajes de contacto

### Ver datos en MongoDB:
```bash
# Conectar a MongoDB
mongosh mongodb://localhost:27017/art-department

# Ver proyectos
db.projects.find()

# Ver por sección
db.projects.find({ section: "set-buildings" })

# Ver proyectos destacados
db.projects.find({ featured: true })
```

## 🚀 Comandos Útiles

```bash
# Iniciar servidor de desarrollo
npm run dev

# Inicializar base de datos
npm run init-db

# Verificar configuración de login
npm run test-login

# Generar datos de prueba (si existe el script)
npm run generate-mock
```

## 📱 Responsive

El panel de administración es responsive y funciona en:
- Desktop (recomendado)
- Tablet
- Mobile (funcional pero mejor en desktop)

## 💡 Tips

1. **Proyectos Destacados**: Solo marca como "featured" los mejores proyectos (máximo 3-4 por sección)
2. **Imágenes**: Usa imágenes optimizadas (no más de 2MB cada una)
3. **Descripciones**: Sé conciso pero descriptivo
4. **Orden**: Los proyectos se muestran del más reciente al más antiguo
5. **Backup**: Haz backup regular de tu base de datos MongoDB

## 🎯 Próximas Mejoras

- [ ] Upload directo de imágenes
- [ ] Editar proyectos existentes
- [ ] Eliminar proyectos
- [ ] Reordenar proyectos (drag & drop)
- [ ] Vista previa antes de publicar
- [ ] Múltiples usuarios admin con roles
- [ ] Estadísticas y analytics
