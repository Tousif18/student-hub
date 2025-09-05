import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import { GraduationCap, Eye, EyeOff } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    firstName: '',
    lastName: '',
    studentId: '',
    department: '',
    yearOfStudy: '',
    phone: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    if (!formData.email || !formData.firstName || !formData.lastName) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.role === 'student' && !formData.studentId) {
      toast.error('Student ID is required for students');
      return;
    }

    const userData = {
      email: formData.email,
      password: formData.password,
      role: formData.role,
      firstName: formData.firstName,
      lastName: formData.lastName,
      studentId: formData.studentId || null,
      department: formData.department || null,
      yearOfStudy: formData.yearOfStudy ? parseInt(formData.yearOfStudy) : null,
      phone: formData.phone || null
    };

    const result = await register(userData);
    
    if (result.success) {
      toast.success('Registration successful!');
      navigate('/dashboard');
    } else {
      toast.error(result.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <GraduationCap className="w-12 h-12 text-primary-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link
              to="/login"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              sign in to your existing account
            </Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Role Selection */}
            <div className="md:col-span-2">
              <label htmlFor="role" className="label">
                Account Type *
              </label>
              <select
                id="role"
                name="role"
                required
                className="input-field"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="student">Student</option>
                <option value="faculty">Faculty</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* Basic Information */}
            <div>
              <label htmlFor="firstName" className="label">
                First Name *
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                required
                className="input-field"
                placeholder="Enter your first name"
                value={formData.firstName}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="lastName" className="label">
                Last Name *
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                required
                className="input-field"
                placeholder="Enter your last name"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="email" className="label">
                Email Address *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="input-field"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="phone" className="label">
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                className="input-field"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            {/* Student-specific fields */}
            {formData.role === 'student' && (
              <>
                <div>
                  <label htmlFor="studentId" className="label">
                    Student ID *
                  </label>
                  <input
                    id="studentId"
                    name="studentId"
                    type="text"
                    required
                    className="input-field"
                    placeholder="Enter your student ID"
                    value={formData.studentId}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="department" className="label">
                    Department
                  </label>
                  <input
                    id="department"
                    name="department"
                    type="text"
                    className="input-field"
                    placeholder="Enter your department"
                    value={formData.department}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="yearOfStudy" className="label">
                    Year of Study
                  </label>
                  <select
                    id="yearOfStudy"
                    name="yearOfStudy"
                    className="input-field"
                    value={formData.yearOfStudy}
                    onChange={handleChange}
                  >
                    <option value="">Select year</option>
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                    <option value="5">5th Year</option>
                  </select>
                </div>
              </>
            )}

            {/* Faculty/Admin fields */}
            {(formData.role === 'faculty' || formData.role === 'admin') && (
              <div>
                <label htmlFor="department" className="label">
                  Department
                </label>
                <input
                  id="department"
                  name="department"
                  type="text"
                  className="input-field"
                  placeholder="Enter your department"
                  value={formData.department}
                  onChange={handleChange}
                />
              </div>
            )}

            {/* Password fields */}
            <div>
              <label htmlFor="password" className="label">
                Password *
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="input-field pr-10"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="label">
                Confirm Password *
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  className="input-field pr-10"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;