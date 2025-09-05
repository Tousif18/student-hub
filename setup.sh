#!/bin/bash

echo "🚀 Setting up Smart Student Hub..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v14 or higher."
    exit 1
fi

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed. Please install PostgreSQL v12 or higher."
    exit 1
fi

echo "✅ Prerequisites check passed"

# Install dependencies
echo "📦 Installing dependencies..."
npm run install-all

# Create database
echo "🗄️ Setting up database..."
createdb smart_student_hub 2>/dev/null || echo "Database might already exist"

# Run database schema
echo "📋 Creating database schema..."
psql -d smart_student_hub -f server/database/schema.sql

echo "✅ Setup complete!"
echo ""
echo "🎉 Smart Student Hub is ready to run!"
echo ""
echo "To start the application:"
echo "  npm run dev"
echo ""
echo "The application will be available at:"
echo "  Frontend: http://localhost:3000"
echo "  Backend:  http://localhost:5000"
echo ""
echo "Default user roles available:"
echo "  - Student: Register with role 'student'"
echo "  - Faculty: Register with role 'faculty'"
echo "  - Admin: Register with role 'admin'"
echo ""
echo "Happy coding! 🎓"