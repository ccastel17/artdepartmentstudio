# Art Department Studio

Professional website for Art Department Studio - Scenographic materials production and product photography studio.

## Features

- **Modern Design**: Black background, white text, French blue accents (#0055A4)
- **Responsive**: Works perfectly on mobile and desktop
- **Main Sections**:
  - Home with video/image background
  - Set Buildings
  - Photography
  - Product
  - Institutional
  - Art Direction
  - Rental
  - About Us
  - Contact Us
  - Art Department Gallery (with white background)

- **Admin Panel**: Complete system for content management
- **Authentication**: Secure login with JWT
- **Mock Data**: 60 simulated projects (10 per section) with SVG images
- **Database Ready**: MongoDB support for storing projects, team, gallery, and messages

## Technologies

- **Next.js 15** con App Router
- **TypeScript**
- **Tailwind CSS**
- **MongoDB**
- **Lucide Icons**

## Installation

```bash
# Install dependencies
npm install

# Configure environment variables
# Edit .env.local with your MongoDB credentials (optional for mock data)

# Run in development
npm run dev

# Build for production
npm run build
npm start
```

## Initial Setup

### Quick Start (Mock Data)

The site comes with 60 pre-generated projects with SVG placeholder images:

```bash
# Projects are already generated in data/projects.json
# SVG images are in public/projects/
# Just run: npm run dev
```

### 1. Database (Optional)

If you want to use MongoDB:
- Make sure you have MongoDB installed or use MongoDB Atlas
- Update `MONGODB_URI` in `.env.local`

### 2. Create Admin User (Optional)

Run this script in MongoDB to create the first admin user:

```bash
npm run init-db
```

Default credentials:
- Username: `admin`
- Password: `admin123` (change in production!)

### 3. Collections Structure

The system will automatically create these collections:
- `projects`: Projects for each section
- `team`: Team members
- `gallery`: Gallery posts
- `contacts`: Contact messages
- `users`: Admin users

## Admin Panel Usage

1. Access `/admin/login`
2. Enter your credentials (admin/admin123 if using init-db)
3. Manage content from the dashboard

**Note**: Admin panel requires MongoDB to be running. For demo purposes, the site works with mock data without database.

## Customization

### Colors

The main color (French blue) is defined in `tailwind.config.ts`:

```typescript
colors: {
  'french-blue': '#0055A4',
}
```

### Add Images

Place your images in the `public/` folder:
- `/public/hero-bg.jpg` - Hero background image
- `/public/team/` - Team photos
- `/public/gallery/` - Gallery images
- `/public/projects/` - Project images (60 SVG placeholders already generated)

### Regenerate Mock Data

To regenerate projects with different data:

```bash
npm run generate-mock
```

## Project Structure

```
art-department-studio/
├── app/
│   ├── (pages)/
│   │   ├── page.tsx              # Home
│   │   ├── [section]/            # Páginas de secciones
│   │   ├── about-us/             # Sobre nosotros
│   │   ├── contact/              # Contacto
│   │   └── gallery/              # Galería
│   ├── admin/                    # Panel de administración
│   ├── api/                      # API routes
│   ├── globals.css               # Estilos globales
│   └── layout.tsx                # Layout principal
├── components/                   # Componentes reutilizables
├── lib/                          # Utilidades y configuración
├── types/                        # Tipos de TypeScript
└── public/                       # Archivos estáticos
```

## Next Steps

1. **Add real images**: Replace SVG placeholders with real images
2. **Configure email**: Implement email sending for contact notifications
3. **Optimize images**: Use Next.js Image optimization
4. **SEO**: Add metadata and Open Graph tags
5. **Analytics**: Integrate Google Analytics or similar
6. **Database**: Set up MongoDB and migrate mock data
7. **Backup**: Configure automatic MongoDB backups

## Current Status

✅ **Fully functional with mock data**
- 60 projects across 6 sections
- All pages translated to English
- Responsive design
- Admin panel structure ready

⚠️ **Requires MongoDB for**:
- Admin authentication
- Content management
- Contact form submissions

## Support

For any questions about the project, contact the development team.

## License

Property of Art Department Studio. All rights reserved.
