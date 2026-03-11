# Vercel Deployment - Quick Start

## 🚀 Deploy en 5 minutos

### 1. Instalar Vercel CLI
```bash
npm install -g vercel
```

### 2. Login
```bash
vercel login
```

### 3. Deploy
```bash
cd /Users/carloscastel/art-department-studio
vercel
```

### 4. Configurar Variables de Entorno

Cuando Vercel te lo pida, o después del deploy, agrega estas variables:

```bash
vercel env add MONGODB_URI production
# Pegar tu string de conexión (NO lo hardcodees en el repo)
# Ejemplo: mongodb+srv://<username>:<password>@<cluster-host>/<db>?retryWrites=true&w=majority

vercel env add JWT_SECRET production
# Generar uno nuevo con: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

vercel env add NEXT_PUBLIC_API_URL production
# Pegar tu URL de Vercel (ej: https://art-department-studio.vercel.app)
```

### 5. Deploy a Producción
```bash
vercel --prod
```

## ✅ Checklist Post-Deploy

- [ ] Verificar que el sitio carga en la URL de Vercel
- [ ] Probar login admin en `/admin/login` (admin/admin123)
- [ ] Cambiar contraseña del admin
- [ ] Verificar que las secciones cargan correctamente
- [ ] Configurar dominio personalizado (opcional)

## 🔧 MongoDB Atlas - Permitir Conexiones de Vercel

1. Ir a MongoDB Atlas → Network Access
2. Agregar IP: `0.0.0.0/0` (permite todas las IPs)
3. Guardar

## 📝 Notas Importantes

- **JWT_SECRET**: Genera uno nuevo para producción, no uses el del .env.local
- **Admin Password**: Cámbialo inmediatamente después del primer login
- **NEXT_PUBLIC_API_URL**: Debe ser tu URL de Vercel (con https://)

## 🆘 Problemas Comunes

### Error de MongoDB durante el build
Es normal ver errores de MongoDB durante el build. El sitio funcionará correctamente en runtime.

### 404 en las páginas
Verifica que `NEXT_PUBLIC_API_URL` esté configurado correctamente.

### Admin login no funciona
Verifica que `JWT_SECRET` y `MONGODB_URI` estén configurados en Vercel.

---

Para más detalles, consulta `DEPLOYMENT.md`
