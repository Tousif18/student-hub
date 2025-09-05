import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import api from '../utils/api';
import { User, Save, Edit } from 'lucide-react';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    department: '',
    yearOfStudy: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        department: user.department || '',
        yearOfStudy: user.yearOfStudy || '',
        phone: user.phone || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.put('/auth/profile', formData);
      updateUser(response.data.user);
      setEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600 mt-1">Manage your account information</p>
        </div>
        <button
          onClick={() => setEditing(!editing)}
          className="btn-secondary flex items-center space-x-2"
        >
          <Edit className="w-4 h-4" />
          <span>{editing ? 'Cancel' : 'Edit Profile'}</span>
        </button>
      </div>

      {/* Profile Card */}
      <div className="card">
        <div className="flex items-center space-x-4 mb-6">
          <div className="p-3 bg-primary-100 rounded-full">
            <User className="w-8 h-8 text-primary-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {user.firstName} {user.lastName}
            </h2>
            <p className="text-gray-600 capitalize">{user.role}</p>
            {user.studentId && (
              <p className="text-sm text-gray-500">ID: {user.studentId}</p>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="firstName" className="label">
                First Name
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                required
                className="input-field"
                value={formData.firstName}
                onChange={handleChange}
                disabled={!editing}
              />
            </div>

            <div>
              <label htmlFor="lastName" className="label">
                Last Name
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                required
                className="input-field"
                value={formData.lastName}
                onChange={handleChange}
                disabled={!editing}
              />
            </div>

            <div>
              <label htmlFor="email" className="label">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                className="input-field bg-gray-50"
                value={user.email}
                disabled
              />
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
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
                value={formData.phone}
                onChange={handleChange}
                disabled={!editing}
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
                value={formData.department}
                onChange={handleChange}
                disabled={!editing}
              />
            </div>

            {user.role === 'student' && (
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
                  disabled={!editing}
                >
                  <option value="">Select year</option>
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                  <option value="5">5th Year</option>
                </select>
              </div>
            )}

            {user.studentId && (
              <div>
                <label htmlFor="studentId" className="label">
                  Student ID
                </label>
                <input
                  id="studentId"
                  type="text"
                  className="input-field bg-gray-50"
                  value={user.studentId}
                  disabled
                />
                <p className="text-xs text-gray-500 mt-1">Student ID cannot be changed</p>
              </div>
            )}
          </div>

          {editing && (
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="btn-secondary"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary flex items-center space-x-2"
                disabled={loading}
              >
                <Save className="w-4 h-4" />
                <span>{loading ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Account Information */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Account Type:</span>
            <span className="font-medium text-gray-900 capitalize">{user.role}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Member Since:</span>
            <span className="font-medium text-gray-900">
              {new Date().toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;