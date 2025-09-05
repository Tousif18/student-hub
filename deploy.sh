#!/bin/bash

echo "🚀 Smart Student Hub - Deployment Helper"
echo "========================================"
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📁 Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit: Smart Student Hub MVP"
    echo "✅ Git repository initialized"
    echo ""
fi

# Check if remote origin exists
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "⚠️  No remote origin found. Please add your GitHub repository:"
    echo "   git remote add origin https://github.com/yourusername/smart-student-hub.git"
    echo "   git push -u origin main"
    echo ""
fi

echo "🌐 Deployment Options:"
echo ""
echo "1. Railway (Backend) + Vercel (Frontend) - Recommended"
echo "   - Backend: https://railway.app"
echo "   - Frontend: https://vercel.com"
echo ""
echo "2. Heroku (Backend) + Netlify (Frontend)"
echo "   - Backend: https://heroku.com"
echo "   - Frontend: https://netlify.com"
echo ""
echo "3. Render (Full-stack)"
echo "   - Full app: https://render.com"
echo ""

echo "📋 Quick Deployment Steps:"
echo ""
echo "1. Push to GitHub:"
echo "   git add ."
echo "   git commit -m 'Deploy to production'"
echo "   git push origin main"
echo ""
echo "2. Deploy Backend (Railway):"
echo "   - Go to https://railway.app"
echo "   - Connect GitHub repository"
echo "   - Add PostgreSQL database"
echo "   - Set environment variables"
echo ""
echo "3. Deploy Frontend (Vercel):"
echo "   - Go to https://vercel.com"
echo "   - Import GitHub repository"
echo "   - Set root directory to 'client'"
echo "   - Add REACT_APP_API_URL environment variable"
echo ""

echo "📖 For detailed instructions, see DEPLOYMENT.md"
echo ""
echo "🎉 Happy deploying!"