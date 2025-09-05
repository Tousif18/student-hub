import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import api from '../utils/api';
import { 
  Plus, 
  FileText, 
  CheckCircle, 
  Clock, 
  XCircle, 
  Download,
  Eye,
  Edit
} from 'lucide-react';
import ActivityForm from '../components/ActivityForm';
import ActivityCard from '../components/ActivityCard';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await api.get('/activities/my-activities');
      setActivities(response.data.activities);
    } catch (error) {
      toast.error('Failed to fetch activities');
    } finally {
      setLoading(false);
    }
  };

  const handleActivitySubmit = async (activityData) => {
    try {
      if (editingActivity) {
        await api.put(`/activities/${editingActivity.id}`, activityData);
        toast.success('Activity updated successfully');
      } else {
        await api.post('/activities', activityData);
        toast.success('Activity submitted successfully');
      }
      setShowForm(false);
      setEditingActivity(null);
      fetchActivities();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit activity');
    }
  };

  const handleEditActivity = (activity) => {
    if (activity.status !== 'pending') {
      toast.error('Only pending activities can be edited');
      return;
    }
    setEditingActivity(activity);
    setShowForm(true);
  };

  const handleDownloadPortfolio = async () => {
    try {
      const response = await api.get('/portfolio/download', {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `portfolio_${user.studentId || user.firstName}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success('Portfolio downloaded successfully');
    } catch (error) {
      toast.error('Failed to download portfolio');
    }
  };

  const filteredActivities = activities.filter(activity => {
    if (filter === 'all') return true;
    return activity.status === filter;
  });

  const stats = {
    total: activities.length,
    approved: activities.filter(a => a.status === 'approved').length,
    pending: activities.filter(a => a.status === 'pending').length,
    rejected: activities.filter(a => a.status === 'rejected').length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user.firstName}!
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your academic achievements and activities
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleDownloadPortfolio}
            className="btn-secondary flex items-center space-x-2"
            disabled={stats.approved === 0}
          >
            <Download className="w-4 h-4" />
            <span>Download Portfolio</span>
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Activity</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Activities</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-gray-900">{stats.approved}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-gray-900">{stats.rejected}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Activities */}
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">My Activities</h2>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="input-field w-auto"
          >
            <option value="all">All Activities</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {filteredActivities.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No activities found</h3>
            <p className="text-gray-600 mb-4">
              {filter === 'all' 
                ? "You haven't submitted any activities yet." 
                : `No ${filter} activities found.`
              }
            </p>
            {filter === 'all' && (
              <button
                onClick={() => setShowForm(true)}
                className="btn-primary"
              >
                Add Your First Activity
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredActivities.map((activity) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                onEdit={handleEditActivity}
                showEditButton={activity.status === 'pending'}
              />
            ))}
          </div>
        )}
      </div>

      {/* Activity Form Modal */}
      {showForm && (
        <ActivityForm
          activity={editingActivity}
          onSubmit={handleActivitySubmit}
          onClose={() => {
            setShowForm(false);
            setEditingActivity(null);
          }}
        />
      )}
    </div>
  );
};

export default StudentDashboard;