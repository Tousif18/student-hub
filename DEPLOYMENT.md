# 🚀 Deployment Guide - Smart Student Hub

This guide will help you deploy the Smart Student Hub to production using Railway (Backend) + Vercel (Frontend).

## 🌐 Live Demo URLs

- **Frontend**: https://smart-student-hub.vercel.app
- **Backend API**: https://smart-student-hub-backend.railway.app
- **API Health Check**: https://smart-student-hub-backend.railway.app/api/health

## 📋 Prerequisites

1. **GitHub Account** - For hosting the code
2. **Railway Account** - For backend deployment (https://railway.app)
3. **Vercel Account** - For frontend deployment (https://vercel.com)
4. **Git** - For version control

## 🚀 Deployment Steps

### Step 1: Prepare the Repository

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Smart Student Hub MVP"
   git branch -M main
   git remote add origin https://github.com/yourusername/smart-student-hub.git
   git push -u origin main
   ```

### Step 2: Deploy Backend to Railway

1. **Go to Railway.app** and sign in with GitHub
2. **Create New Project** → **Deploy from GitHub repo**
3. **Select your repository**
4. **Add PostgreSQL Database:**
   - Go to your project dashboard
   - Click **"+ New"** → **Database** → **PostgreSQL**
   - Railway will automatically provide `DATABASE_URL`

5. **Configure Environment Variables:**
   ```
   NODE_ENV=production
   JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_secure
   CORS_ORIGIN=https://smart-student-hub.vercel.app
   ```

6. **Deploy:**
   - Railway will automatically detect the Node.js app
   - It will run `npm install` and `npm start`
   - Your backend will be available at `https://your-app-name.railway.app`

### Step 3: Deploy Frontend to Vercel

1. **Go to Vercel.com** and sign in with GitHub
2. **Import Project** → **Import Git Repository**
3. **Select your repository**
4. **Configure Build Settings:**
   - **Framework Preset**: Create React App
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

5. **Environment Variables:**
   ```
   REACT_APP_API_URL=https://your-backend-url.railway.app/api
   ```

6. **Deploy:**
   - Click **Deploy**
   - Vercel will build and deploy your frontend

### Step 4: Initialize Database

1. **Connect to your Railway PostgreSQL database:**
   ```bash
   # Get connection details from Railway dashboard
   psql $DATABASE_URL
   ```

2. **Run the schema:**
   ```sql
   \i server/database/schema.sql
   ```

   Or use Railway's web console to run the SQL commands.

### Step 5: Test the Deployment

1. **Visit your frontend URL**
2. **Register a new account** (try different roles: student, faculty, admin)
3. **Test the features:**
   - Student: Submit activities, download portfolio
   - Faculty: Review activities, approve/reject
   - Admin: View reports, export data

## 🔧 Configuration Details

### Backend (Railway)
- **Runtime**: Node.js
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Health Check**: `/api/health`
- **Database**: PostgreSQL (provided by Railway)

### Frontend (Vercel)
- **Framework**: React
- **Build Command**: `npm run build`
- **Output Directory**: `build`
- **Environment**: Production

## 🌍 Environment Variables

### Backend (Railway)
```env
NODE_ENV=production
DATABASE_URL=postgresql://... (provided by Railway)
JWT_SECRET=your_super_secret_jwt_key_here
CORS_ORIGIN=https://your-frontend-url.vercel.app
```

### Frontend (Vercel)
```env
REACT_APP_API_URL=https://your-backend-url.railway.app/api
```

## 📊 Monitoring & Logs

### Railway
- **Logs**: Available in Railway dashboard
- **Metrics**: CPU, Memory, Network usage
- **Database**: PostgreSQL metrics and logs

### Vercel
- **Analytics**: Page views, performance metrics
- **Functions**: Serverless function logs
- **Build Logs**: Deployment and build logs

## 🔒 Security Considerations

1. **JWT Secret**: Use a strong, random secret key
2. **CORS**: Configure allowed origins properly
3. **Database**: Use SSL connections in production
4. **File Uploads**: Consider using cloud storage (AWS S3, Cloudinary)
5. **Rate Limiting**: Already configured in the app

## 🚨 Troubleshooting

### Common Issues

1. **CORS Errors:**
   - Check CORS_ORIGIN environment variable
   - Ensure frontend URL is in allowed origins

2. **Database Connection:**
   - Verify DATABASE_URL is correct
   - Check if database is accessible

3. **Build Failures:**
   - Check Node.js version compatibility
   - Verify all dependencies are in package.json

4. **File Upload Issues:**
   - Check file size limits
   - Verify upload directory permissions

### Debug Commands

```bash
# Check Railway logs
railway logs

# Check Vercel deployment
vercel logs

# Test API endpoints
curl https://your-backend-url.railway.app/api/health
```

## 📈 Scaling Considerations

1. **Database**: Railway PostgreSQL can handle moderate traffic
2. **File Storage**: Consider moving to cloud storage for production
3. **CDN**: Vercel provides global CDN automatically
4. **Monitoring**: Add application monitoring (Sentry, LogRocket)

## 🎉 Success!

Once deployed, your Smart Student Hub will be live and accessible to users worldwide!

### Quick Test Checklist
- [ ] Frontend loads correctly
- [ ] User registration works
- [ ] User login works
- [ ] Student can submit activities
- [ ] Faculty can review activities
- [ ] Admin can view reports
- [ ] File uploads work
- [ ] PDF generation works
- [ ] Database queries work

---

**Need Help?** Check the logs in Railway and Vercel dashboards, or refer to the main README.md for local development setup.