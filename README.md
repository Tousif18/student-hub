# Smart Student Hub

A comprehensive digital platform for managing and verifying student academic and extracurricular achievements in Higher Education Institutions.

## Features

### For Students
- **Profile Management**: Complete academic profile with department and year information
- **Activity Submission**: Submit achievements with proof documents (PDF/images)
- **Status Tracking**: Real-time tracking of submission status (Pending/Approved/Rejected)
- **Digital Portfolio**: Auto-generated PDF portfolio of verified achievements
- **Activity Management**: Edit pending submissions before review

### For Faculty/Admin
- **Review System**: Approve or reject student activities with comments
- **Dashboard Analytics**: Comprehensive statistics and reporting
- **Bulk Operations**: Export student and activity data in CSV/Excel formats
- **Department Reports**: Department-wise and year-wise statistics
- **Search & Filter**: Advanced filtering by status, type, department, and more

### Technical Features
- **Role-based Access Control**: Separate dashboards for students, faculty, and admin
- **File Upload**: Secure proof document upload (PDF, images up to 10MB)
- **Real-time Updates**: Live status updates and notifications
- **Responsive Design**: Mobile-friendly interface
- **API-first Architecture**: RESTful APIs for easy mobile app integration

## Tech Stack

### Backend
- **Node.js** with Express.js
- **PostgreSQL** database
- **JWT** authentication
- **Multer** for file uploads
- **jsPDF** for PDF generation
- **XLSX** for Excel export

### Frontend
- **React.js** with functional components and hooks
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Axios** for API calls
- **React Toastify** for notifications

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd smart-student-hub
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Database Setup**
   ```bash
   # Create PostgreSQL database
   createdb smart_student_hub
   
   # Run schema
   psql -d smart_student_hub -f server/database/schema.sql
   ```

4. **Environment Configuration**
   ```bash
   # Copy environment file
   cp server/.env.example server/.env
   
   # Update database credentials in server/.env
   ```

5. **Start the application**
   ```bash
   # Start both frontend and backend
   npm run dev
   
   # Or start individually
   npm run server  # Backend on port 5000
   npm run client  # Frontend on port 3000
   ```

### Default Access

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## Database Schema

### Core Tables
- **users**: Student, faculty, and admin accounts
- **activities**: Student activity submissions
- **activity_types**: Predefined activity categories

### Key Features
- Automatic timestamps with triggers
- Foreign key constraints for data integrity
- Indexes for optimal query performance
- Role-based access control

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Activities
- `GET /api/activities` - Get all activities (faculty/admin)
- `GET /api/activities/my-activities` - Get student's activities
- `POST /api/activities` - Submit new activity
- `PUT /api/activities/:id` - Update activity
- `PUT /api/activities/:id/review` - Review activity (faculty/admin)
- `GET /api/activities/types` - Get activity types
- `GET /api/activities/stats` - Get statistics

### Portfolio
- `GET /api/portfolio/download` - Download portfolio PDF
- `GET /api/portfolio/data` - Get portfolio data

### Reports
- `GET /api/reports/students` - Student reports
- `GET /api/reports/activities` - Activity reports
- `GET /api/reports/department-stats` - Department statistics
- `GET /api/reports/year-stats` - Year-wise statistics

## File Structure

```
smart-student-hub/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── contexts/       # React contexts
│   │   ├── pages/          # Page components
│   │   └── utils/          # Utility functions
│   └── package.json
├── server/                 # Node.js backend
│   ├── config/            # Database configuration
│   ├── database/          # Database schema
│   ├── middleware/        # Express middleware
│   ├── routes/            # API routes
│   ├── utils/             # Utility functions
│   └── package.json
└── package.json           # Root package.json
```

## Development

### Adding New Features
1. Create API endpoints in `server/routes/`
2. Add corresponding frontend components
3. Update database schema if needed
4. Test with different user roles

### Database Migrations
- Schema changes should be added to `server/database/schema.sql`
- Test migrations on development database first

### File Uploads
- Files are stored in `server/uploads/`
- Supported formats: PDF, JPG, PNG, GIF
- Maximum size: 10MB per file

## Deployment

### Production Setup
1. Set `NODE_ENV=production`
2. Configure production database
3. Set up file storage (consider cloud storage)
4. Configure CORS for production domain
5. Set up SSL certificates

### Environment Variables
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=smart_student_hub
DB_USER=postgres
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d

# Server
PORT=5000
NODE_ENV=production

# File Upload
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team or create an issue in the repository.

---

**Smart Student Hub** - Empowering students to showcase their achievements digitally! 🎓