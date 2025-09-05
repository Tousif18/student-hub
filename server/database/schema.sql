-- Smart Student Hub Database Schema

-- Users table (students, faculty, admin)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('student', 'faculty', 'admin')),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    student_id VARCHAR(50) UNIQUE, -- Only for students
    department VARCHAR(100),
    year_of_study INTEGER, -- Only for students
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Activities table
CREATE TABLE activities (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL, -- academic, extracurricular, sports, etc.
    description TEXT NOT NULL,
    proof_file_path VARCHAR(500), -- Path to uploaded file
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    faculty_comment TEXT,
    reviewed_by INTEGER REFERENCES users(id), -- Faculty who reviewed
    reviewed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Activity types lookup table
CREATE TABLE activity_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true
);

-- Insert default activity types
INSERT INTO activity_types (name, description) VALUES
('Academic Achievement', 'Academic accomplishments, research papers, publications'),
('Extracurricular', 'Clubs, societies, cultural activities'),
('Sports', 'Sports achievements, competitions'),
('Volunteer Work', 'Community service, volunteering'),
('Internship', 'Internships, work experience'),
('Certification', 'Professional certifications, courses'),
('Leadership', 'Leadership roles, student government'),
('Competition', 'Hackathons, competitions, contests');

-- Indexes for better performance
CREATE INDEX idx_activities_student_id ON activities(student_id);
CREATE INDEX idx_activities_status ON activities(status);
CREATE INDEX idx_activities_type ON activities(type);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_student_id ON users(student_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_activities_updated_at BEFORE UPDATE ON activities
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();