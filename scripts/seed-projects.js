const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/art-department-studio';

// Generate SVG placeholder images
function generateSVGImage(width, height, text, bgColor) {
  return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="${bgColor}"/>
    <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="24" fill="white" text-anchor="middle" dominant-baseline="middle">${text}</text>
  </svg>`;
}

const sections = ['set-buildings', 'fotografia', 'producto', 'institucional', 'art-direction', 'rental'];

const projectTemplates = {
  'set-buildings': [
    { title: 'Urban Dystopia Set', description: 'Complete set construction for a dystopian sci-fi series featuring industrial aesthetics and weathered textures', tags: ['Construction', 'Scenography', 'Filming', 'Industrial Design'] },
    { title: 'Victorian Manor Interior', description: 'Detailed period-accurate interior set for historical drama production', tags: ['Period Design', 'Interior', 'Historical', 'Craftsmanship'] },
    { title: 'Futuristic Laboratory', description: 'High-tech laboratory set with interactive LED panels and modular design', tags: ['Sci-Fi', 'Technology', 'Modular Design', 'LED Integration'] },
    { title: 'Medieval Castle Hall', description: 'Grand medieval hall with stone walls, wooden beams, and authentic period details', tags: ['Medieval', 'Stone Work', 'Period Accuracy', 'Large Scale'] },
    { title: 'Modern Office Complex', description: 'Contemporary office environment with glass partitions and minimalist design', tags: ['Modern', 'Corporate', 'Glass Work', 'Minimalist'] },
    { title: 'Abandoned Factory', description: 'Industrial decay set with rusted machinery and atmospheric lighting', tags: ['Industrial', 'Decay', 'Atmosphere', 'Texture'] },
    { title: 'Luxury Penthouse', description: 'High-end residential set with panoramic city views and designer furniture', tags: ['Luxury', 'Residential', 'Modern', 'High-End'] },
    { title: 'Underground Bunker', description: 'Post-apocalyptic bunker with concrete walls and survival equipment', tags: ['Bunker', 'Post-Apocalyptic', 'Concrete', 'Survival'] },
    { title: 'Art Gallery Space', description: 'Contemporary art gallery with adjustable lighting and white cube aesthetic', tags: ['Gallery', 'Contemporary', 'Lighting', 'Exhibition'] },
    { title: 'Retro Diner', description: '1950s American diner with authentic fixtures and neon signage', tags: ['Retro', '1950s', 'Americana', 'Neon'] }
  ],
  'fotografia': [
    { title: 'Fashion Editorial Shoot', description: 'High-fashion editorial photography for international magazine featuring avant-garde styling', tags: ['Fashion', 'Editorial', 'Studio', 'Lighting'] },
    { title: 'Architectural Photography', description: 'Professional architectural photography showcasing modern building design', tags: ['Architecture', 'Real Estate', 'Exterior', 'Composition'] },
    { title: 'Portrait Series', description: 'Intimate portrait series capturing authentic human expressions', tags: ['Portrait', 'Studio', 'Natural Light', 'Emotion'] },
    { title: 'Food Photography Campaign', description: 'Appetizing food photography for restaurant marketing materials', tags: ['Food', 'Commercial', 'Styling', 'Macro'] },
    { title: 'Corporate Headshots', description: 'Professional corporate photography for company website and materials', tags: ['Corporate', 'Professional', 'Headshots', 'Business'] },
    { title: 'Event Coverage', description: 'Complete event photography coverage including candid and staged shots', tags: ['Events', 'Coverage', 'Candid', 'Documentation'] },
    { title: 'Product Lifestyle Shoot', description: 'Lifestyle product photography showing items in real-world contexts', tags: ['Lifestyle', 'Product', 'Context', 'Natural'] },
    { title: 'Industrial Photography', description: 'Documentary-style industrial photography capturing manufacturing processes', tags: ['Industrial', 'Documentary', 'Process', 'Technical'] },
    { title: 'Nature & Landscape', description: 'Stunning landscape photography showcasing natural beauty', tags: ['Nature', 'Landscape', 'Outdoor', 'Natural Light'] },
    { title: 'Artistic Conceptual Shoot', description: 'Conceptual photography exploring abstract themes and ideas', tags: ['Conceptual', 'Art', 'Abstract', 'Creative'] }
  ],
  'producto': [
    { title: 'Tech Product Line', description: 'Clean product photography for electronics and gadgets with technical precision', tags: ['Technology', 'Clean', 'White Background', 'Detail'] },
    { title: 'Jewelry Collection', description: 'Luxury jewelry photography with macro detail and elegant presentation', tags: ['Jewelry', 'Luxury', 'Macro', 'Elegance'] },
    { title: 'Cosmetics Campaign', description: 'Beauty product photography with soft lighting and elegant composition', tags: ['Cosmetics', 'Beauty', 'Soft Light', 'Commercial'] },
    { title: 'Fashion Accessories', description: 'Stylish product photography for fashion accessories and leather goods', tags: ['Fashion', 'Accessories', 'Leather', 'Style'] },
    { title: 'Home Decor Items', description: 'Lifestyle product photography for home decoration and furniture', tags: ['Home Decor', 'Furniture', 'Lifestyle', 'Interior'] },
    { title: 'Sports Equipment', description: 'Dynamic product photography showcasing athletic gear and equipment', tags: ['Sports', 'Athletic', 'Dynamic', 'Action'] },
    { title: 'Gourmet Food Products', description: 'Appetizing product photography for premium food and beverage brands', tags: ['Food', 'Gourmet', 'Premium', 'Appetizing'] },
    { title: 'Watch Collection', description: 'Precision photography highlighting craftsmanship of luxury timepieces', tags: ['Watches', 'Luxury', 'Precision', 'Craftsmanship'] },
    { title: 'Automotive Parts', description: 'Technical product photography for automotive components and accessories', tags: ['Automotive', 'Technical', 'Parts', 'Industrial'] },
    { title: 'Artisan Crafts', description: 'Handmade product photography celebrating artisan craftsmanship', tags: ['Artisan', 'Handmade', 'Crafts', 'Authentic'] }
  ],
  'institucional': [
    { title: 'Corporate Brand Video', description: 'Professional corporate video showcasing company values and culture', tags: ['Corporate', 'Video', 'Branding', 'Culture'] },
    { title: 'Annual Report Photography', description: 'Executive photography and facility documentation for annual reports', tags: ['Annual Report', 'Executive', 'Documentation', 'Professional'] },
    { title: 'University Campus Tour', description: 'Comprehensive visual documentation of educational facilities', tags: ['Education', 'Campus', 'Facilities', 'Documentation'] },
    { title: 'Healthcare Facility', description: 'Professional photography of medical facilities and healthcare services', tags: ['Healthcare', 'Medical', 'Facilities', 'Professional'] },
    { title: 'Government Institution', description: 'Official photography for government buildings and public services', tags: ['Government', 'Official', 'Public', 'Institutional'] },
    { title: 'Non-Profit Campaign', description: 'Impactful visual storytelling for non-profit organization mission', tags: ['Non-Profit', 'Mission', 'Storytelling', 'Impact'] },
    { title: 'Financial Services', description: 'Professional imagery for banking and financial institutions', tags: ['Finance', 'Banking', 'Professional', 'Trust'] },
    { title: 'Technology Company', description: 'Modern corporate photography for tech startup and innovation', tags: ['Technology', 'Startup', 'Innovation', 'Modern'] },
    { title: 'Manufacturing Facility', description: 'Industrial photography documenting production and quality processes', tags: ['Manufacturing', 'Industrial', 'Process', 'Quality'] },
    { title: 'Hospitality Brand', description: 'Luxury hotel and restaurant photography for marketing materials', tags: ['Hospitality', 'Luxury', 'Hotel', 'Restaurant'] }
  ],
  'art-direction': [
    { title: 'Music Video Direction', description: 'Complete art direction for international music video production', tags: ['Music Video', 'Direction', 'Concept', 'Production'] },
    { title: 'Commercial Campaign', description: 'Art direction for multi-platform advertising campaign', tags: ['Commercial', 'Advertising', 'Campaign', 'Multi-Platform'] },
    { title: 'Film Production Design', description: 'Overall art direction and visual style for feature film', tags: ['Film', 'Production Design', 'Visual Style', 'Concept'] },
    { title: 'Fashion Show Direction', description: 'Complete art direction for runway show and presentation', tags: ['Fashion Show', 'Runway', 'Direction', 'Presentation'] },
    { title: 'Editorial Art Direction', description: 'Creative direction for magazine editorial and photo shoots', tags: ['Editorial', 'Magazine', 'Creative', 'Photography'] },
    { title: 'Brand Launch Event', description: 'Art direction for product launch event and installation', tags: ['Event', 'Launch', 'Installation', 'Brand'] },
    { title: 'Theater Production', description: 'Set and costume design direction for theatrical performance', tags: ['Theater', 'Stage', 'Costume', 'Performance'] },
    { title: 'Exhibition Design', description: 'Curatorial and spatial design for art exhibition', tags: ['Exhibition', 'Curatorial', 'Spatial Design', 'Art'] },
    { title: 'Festival Art Direction', description: 'Overall visual identity and art direction for cultural festival', tags: ['Festival', 'Cultural', 'Identity', 'Direction'] },
    { title: 'Digital Content Series', description: 'Art direction for web series and digital content production', tags: ['Digital', 'Web Series', 'Content', 'Online'] }
  ],
  'rental': [
    { title: 'Vintage Furniture Collection', description: 'Curated collection of vintage furniture pieces available for rental', tags: ['Vintage', 'Furniture', 'Props', 'Period'] },
    { title: 'Industrial Equipment', description: 'Industrial props and equipment for authentic factory scenes', tags: ['Industrial', 'Equipment', 'Props', 'Authentic'] },
    { title: 'Lighting Equipment', description: 'Professional lighting gear and fixtures for film and photography', tags: ['Lighting', 'Equipment', 'Professional', 'Technical'] },
    { title: 'Period Props 1920s-1950s', description: 'Authentic period props and decorative items from early 20th century', tags: ['Period Props', 'Vintage', '20th Century', 'Authentic'] },
    { title: 'Modern Office Furniture', description: 'Contemporary office furniture and equipment for corporate scenes', tags: ['Modern', 'Office', 'Corporate', 'Contemporary'] },
    { title: 'Restaurant Equipment', description: 'Professional kitchen and dining equipment for food scenes', tags: ['Restaurant', 'Kitchen', 'Dining', 'Professional'] },
    { title: 'Decorative Art Pieces', description: 'Curated selection of artwork and decorative pieces', tags: ['Art', 'Decorative', 'Curated', 'Design'] },
    { title: 'Outdoor Furniture', description: 'Garden and patio furniture for exterior scenes', tags: ['Outdoor', 'Garden', 'Patio', 'Exterior'] },
    { title: 'Specialty Props', description: 'Unique and specialty props for specific production needs', tags: ['Specialty', 'Unique', 'Custom', 'Props'] },
    { title: 'Modular Set Pieces', description: 'Versatile modular set pieces for flexible scene construction', tags: ['Modular', 'Versatile', 'Set Pieces', 'Flexible'] }
  ]
};

const colors = ['#1a365d', '#2d3748', '#1e40af', '#1e3a8a', '#312e81', '#4c1d95'];

async function seedProjects() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('✓ Connected to MongoDB');

    const db = client.db();
    const projectsCollection = db.collection('projects');

    // Clear existing projects
    await projectsCollection.deleteMany({});
    console.log('✓ Cleared existing projects');

    // Create public directory structure
    const publicDir = path.join(__dirname, '..', 'public', 'projects');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    let totalProjects = 0;

    for (const section of sections) {
      const templates = projectTemplates[section];
      
      for (let i = 0; i < templates.length; i++) {
        const template = templates[i];
        const projectId = `${section}-${i + 1}`;
        
        // Generate SVG images
        const images = [];
        for (let j = 0; j < 4; j++) {
          const color = colors[j % colors.length];
          const svg = generateSVGImage(1200, 800, `${template.title} - Image ${j + 1}`, color);
          const filename = `${projectId}-${j + 1}.svg`;
          const filepath = path.join(publicDir, filename);
          fs.writeFileSync(filepath, svg);
          images.push(`/projects/${filename}`);
        }

        const project = {
          id: projectId,
          title: template.title,
          description: template.description,
          date: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
          section: section,
          featuredImage: images[0],
          images: images,
          tags: template.tags,
          reflection: `This project presented unique challenges that pushed our creative boundaries. Working closely with the production team, we developed innovative solutions that enhanced the overall visual narrative. The attention to detail and commitment to authenticity resulted in a compelling final product that exceeded expectations. This experience reinforced our dedication to excellence in every aspect of production design and execution.`,
          featured: i === 0 // First project in each section is featured
        };

        await projectsCollection.insertOne(project);
        totalProjects++;
      }
      
      console.log(`✓ Created 10 projects for ${section}`);
    }

    console.log(`\n✅ Successfully seeded ${totalProjects} projects across ${sections.length} sections`);
    console.log('✅ Generated SVG placeholder images');

  } catch (error) {
    console.error('❌ Error seeding projects:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

seedProjects();
