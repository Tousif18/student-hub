import React, { useState } from 'react';
import { X, CheckCircle, XCircle, FileText, User, Calendar } from 'lucide-react';

const ActivityReviewModal = ({ activity, onSubmit, onClose }) => {
  const [reviewData, setReviewData] = useState({
    status: activity.status === 'pending' ? 'approved' : activity.status,
    comment: activity.faculty_comment || ''
  });

  const handleChange = (e) => {
    setReviewData({
      ...reviewData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(reviewData);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Review Activity
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Student Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Student Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">Name:</span>
                <span className="text-sm font-medium text-gray-900">
                  {activity.first_name} {activity.last_name}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Student ID:</span>
                <span className="text-sm font-medium text-gray-900">
                  {activity.student_id}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Department:</span>
                <span className="text-sm font-medium text-gray-900">
                  {activity.department}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Year:</span>
                <span className="text-sm font-medium text-gray-900">
                  {activity.year_of_study}
                </span>
              </div>
            </div>
          </div>

          {/* Activity Details */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Activity Details</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Title</label>
                <p className="text-gray-900 mt-1">{activity.title}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Type</label>
                <p className="text-gray-900 mt-1">{activity.type}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Description</label>
                <p className="text-gray-900 mt-1 whitespace-pre-wrap">{activity.description}</p>
              </div>
              
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">Submitted:</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatDate(activity.created_at)}
                </span>
              </div>

              {activity.proof_file_path && (
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Proof Document:</span>
                  <a
                    href={`http://localhost:5000/${activity.proof_file_path}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary-600 hover:text-primary-800 underline"
                  >
                    View Document
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Review Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600 mb-2 block">
                Review Decision
              </label>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="status"
                    value="approved"
                    checked={reviewData.status === 'approved'}
                    onChange={handleChange}
                    className="text-green-600 focus:ring-green-500"
                  />
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-900">Approve</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="status"
                    value="rejected"
                    checked={reviewData.status === 'rejected'}
                    onChange={handleChange}
                    className="text-red-600 focus:ring-red-500"
                  />
                  <XCircle className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-gray-900">Reject</span>
                </label>
              </div>
            </div>

            <div>
              <label htmlFor="comment" className="text-sm font-medium text-gray-600 mb-2 block">
                Comments (Optional)
              </label>
              <textarea
                id="comment"
                name="comment"
                rows={4}
                className="input-field"
                placeholder="Add your comments about this activity..."
                value={reviewData.comment}
                onChange={handleChange}
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
              >
                Submit Review
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ActivityReviewModal;