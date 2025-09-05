# 🚀 Quick Deploy - Smart Student Hub

## ⚡ One-Click Deployment Options

### Option 1: Railway (Full-Stack) - Easiest
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/your-template-id)

**Steps:**
1. Click the Railway button above
2. Connect your GitHub account
3. Add PostgreSQL database
4. Set environment variables
5. Deploy!

### Option 2: Vercel + Railway (Recommended)
**Frontend (Vercel):**
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/smart-student-hub&env=REACT_APP_API_URL)

**Backend (Railway):**
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template)

### Option 3: Render (Full-Stack)
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

## 🔧 Manual Deployment

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Deploy Smart Student Hub"
git remote add origin https://github.com/yourusername/smart-student-hub.git
git push -u origin main
```

### 2. Deploy Backend (Railway)
1. Go to [railway.app](https://railway.app)
2. Sign in with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Add PostgreSQL database
6. Set environment variables:
   ```
   NODE_ENV=production
   JWT_SECRET=your_super_secret_jwt_key_here
   CORS_ORIGIN=https://your-frontend-url.vercel.app
   ```

### 3. Deploy Frontend (Vercel)
1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "New Project" → "Import Git Repository"
4. Select your repository
5. Set build settings:
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
6. Add environment variable:
   ```
   REACT_APP_API_URL=https://your-backend-url.railway.app/api
   ```

### 4. Initialize Database
Connect to your Railway PostgreSQL and run:
```sql
-- Copy and paste the contents of server/database/schema.sql
```

## 🌐 Expected URLs
- **Frontend**: `https://your-app-name.vercel.app`
- **Backend**: `https://your-app-name.railway.app`
- **API Health**: `https://your-app-name.railway.app/api/health`

## ✅ Test Your Deployment
1. Visit your frontend URL
2. Register as a student
3. Submit an activity
4. Register as faculty/admin
5. Review the activity
6. Download reports

## 🆘 Need Help?
- Check [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions
- Check Railway/Vercel logs for errors
- Ensure all environment variables are set correctly

---

**🎉 Your Smart Student Hub will be live in minutes!**