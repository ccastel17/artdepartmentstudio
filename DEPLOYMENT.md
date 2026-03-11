# Deployment Guide - Art Department Studio

## Deployment to Vercel

This guide will help you deploy the Art Department Studio website to Vercel.

### Prerequisites

1. A [Vercel account](https://vercel.com/signup)
2. MongoDB Atlas database (already configured)
3. Git repository (recommended)

### Step 1: Prepare Environment Variables

You'll need to configure these environment variables in Vercel:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-host>/<db>?retryWrites=true&w=majority
JWT_SECRET=your-secret-key-change-this-in-production
NEXT_PUBLIC_API_URL=https://your-domain.vercel.app
```

**Important:** Generate a new secure JWT_SECRET for production. You can use:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 2: Deploy via Vercel CLI

#### Option A: Using Vercel CLI (Recommended)

1. Install Vercel CLI globally:
```bash
npm install -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy from the project directory:
```bash
cd /Users/carloscastel/art-department-studio
vercel
```

4. Follow the prompts:
   - Set up and deploy? **Yes**
   - Which scope? Select your account
   - Link to existing project? **No** (first time)
   - What's your project's name? **art-department-studio**
   - In which directory is your code located? **./** (press Enter)
   - Want to override the settings? **No**

5. Add environment variables:
```bash
vercel env add MONGODB_URI
vercel env add JWT_SECRET
vercel env add NEXT_PUBLIC_API_URL
```

6. Deploy to production:
```bash
vercel --prod
```

#### Option B: Using Vercel Dashboard

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your Git repository or upload the project
3. Configure the project:
   - **Framework Preset:** Next.js
   - **Root Directory:** ./
   - **Build Command:** `npm run build`
   - **Output Directory:** .next
4. Add environment variables in the dashboard
5. Click **Deploy**

### Step 3: Configure Custom Domain (Optional)

1. Go to your project settings in Vercel
2. Navigate to **Domains**
3. Add your custom domain
4. Update DNS records as instructed by Vercel
5. Update `NEXT_PUBLIC_API_URL` environment variable with your custom domain

### Step 4: Verify Deployment

After deployment, verify:

1. ✅ Homepage loads correctly
2. ✅ All sections are accessible (Set Buildings, Photography, etc.)
3. ✅ Admin login works at `/admin/login`
4. ✅ MongoDB connection is working
5. ✅ Images are loading properly

### MongoDB Atlas Configuration

Ensure your MongoDB Atlas cluster allows connections from Vercel:

1. Go to MongoDB Atlas Dashboard
2. Navigate to **Network Access**
3. Add IP Address: `0.0.0.0/0` (allow from anywhere)
   - Or add Vercel's IP ranges for better security

### Admin Access

Default admin credentials (change after first login):
- Username: `admin`
- Password: `admin123`

To create the admin user in production:
1. Connect to your MongoDB Atlas cluster
2. Run the init-db script or manually create the user

### Troubleshooting

#### Build Errors
- Ensure all environment variables are set correctly
- Check MongoDB connection string is valid
- Verify Node.js version compatibility (18.x or higher)

#### MongoDB Connection Issues
- Verify MongoDB Atlas IP whitelist includes `0.0.0.0/0`
- Check connection string format
- Ensure database user has correct permissions

#### Images Not Loading
- Check that images exist in the `public/` directory
- Verify image paths in the database
- Check Vercel's file size limits

### Continuous Deployment

If using Git integration:
1. Push changes to your repository
2. Vercel will automatically deploy
3. Preview deployments for branches
4. Production deployment for main/master branch

### Performance Optimization

The project is configured with:
- ✅ Image optimization via Next.js
- ✅ Static page generation where possible
- ✅ API routes for dynamic content
- ✅ Standalone output for faster cold starts

### Security Notes

1. **Change JWT_SECRET** in production
2. **Update admin password** after first login
3. **Configure MongoDB IP whitelist** appropriately
4. **Enable HTTPS** (automatic with Vercel)
5. **Review CORS settings** if needed

### Support

For deployment issues:
- Check Vercel deployment logs
- Review MongoDB Atlas logs
- Verify environment variables are set correctly

### Next Steps After Deployment

1. Update admin password
2. Upload real project images
3. Configure custom domain
4. Set up analytics (optional)
5. Configure email notifications for contact form
6. Set up automatic backups for MongoDB

---

**Deployment Status:** Ready for production ✅
**Last Updated:** January 2026
