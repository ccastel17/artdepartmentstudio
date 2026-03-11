# Sistema de Autenticación - Art Department Studio

## 🔐 Credenciales de Acceso

**Usuario por defecto:**
- Username: `admin`
- Password: `admin123`

⚠️ **IMPORTANTE**: Cambia estas credenciales en producción.

## 🚀 Inicio Rápido

### 1. Inicializar la Base de Datos
```bash
npm run init-db
```

Este comando:
- Crea el usuario administrador
- Configura los índices de la base de datos
- Verifica la conexión a MongoDB

### 2. Verificar Configuración
```bash
npm run test-login
```

Este comando verifica:
- Variables de entorno (MONGODB_URI, JWT_SECRET)
- Conexión a MongoDB
- Usuario admin existe y la contraseña es correcta
- Estadísticas de la base de datos

### 3. Iniciar el Servidor
```bash
npm run dev
```

### 4. Acceder al Panel de Administración
Abre tu navegador en: http://localhost:3000/admin/login

## 📁 Estructura de Archivos

```
app/
├── admin/
│   ├── login/
│   │   └── page.tsx          # Página de login
│   └── page.tsx               # Dashboard admin (protegido)
├── api/
│   └── auth/
│       ├── login/
│       │   └── route.ts       # Endpoint de login
│       └── logout/
│           └── route.ts       # Endpoint de logout
lib/
├── auth.ts                    # Funciones de autenticación (JWT, bcrypt)
├── db.ts                      # Conexión a MongoDB
middleware.ts                  # Protección de rutas admin
scripts/
├── init-db.js                 # Inicializar base de datos
└── test-login.js              # Verificar configuración
```

## 🔧 Variables de Entorno

Asegúrate de tener estas variables en `.env.local`:

```env
MONGODB_URI=mongodb://localhost:27017/art-department
JWT_SECRET=tu-secreto-jwt-muy-seguro
```

## 🛠️ Funcionalidades

### Login
- Validación de credenciales
- Generación de JWT token
- Cookie httpOnly con duración de 7 días
- Logging detallado para debugging

### Middleware
- Protección automática de rutas `/admin/*`
- Verificación de token JWT
- Redirección automática a login si no hay token válido
- Excepción para la página de login

### Logout
- Eliminación de cookie de autenticación
- Redirección automática a login

## 🐛 Debugging

### Ver logs en tiempo real
Los logs aparecen en la terminal donde ejecutas `npm run dev`:

**Login exitoso:**
```
🔐 Login attempt started
📝 Username received: admin
🔌 Connecting to database...
🔍 Looking for user: admin
✅ User found, verifying password...
✅ Password valid, generating token...
🎫 Token generated: eyJhbGciOiJIUzI1NiIs...
🍪 Cookie set successfully
✅ Login completed successfully for user: admin
```

**Middleware:**
```
🔒 Middleware checking path: /admin
🍪 Token found: YES
✅ Valid token, allowing access to: /admin
👤 User ID: 677738b6b8e7c8f9a0b1c2d3
```

### Problemas Comunes

**1. "Credenciales inválidas"**
- Verifica que el usuario existe: `npm run test-login`
- Asegúrate de usar: username: `admin`, password: `admin123`

**2. "Error de conexión"**
- Verifica que MongoDB esté corriendo
- Verifica la variable `MONGODB_URI` en `.env.local`

**3. Redirección infinita al login**
- Verifica que la cookie se esté configurando correctamente
- Revisa los logs del navegador (F12 > Console)
- Verifica que `JWT_SECRET` esté configurado

**4. Token inválido**
- El token expira después de 7 días
- Si cambias `JWT_SECRET`, los tokens anteriores se invalidan
- Haz logout y vuelve a hacer login

## 🔒 Seguridad

### Desarrollo
- `secure: false` en cookies (permite HTTP en localhost)
- Logs detallados para debugging

### Producción
- Cambia las credenciales por defecto
- `secure: true` en cookies (solo HTTPS)
- Configura `JWT_SECRET` con un valor seguro y aleatorio
- Considera reducir los logs en producción

## 📝 Notas Técnicas

- **JWT**: Tokens con expiración de 7 días
- **Bcrypt**: Hash de contraseñas con salt rounds = 10
- **Cookies**: httpOnly, sameSite: 'lax', path: '/'
- **Middleware**: Ejecuta en Edge Runtime para mejor performance
