import React from 'react';
import { 
  CheckCircle, 
  Clock, 
  XCircle, 
  Edit, 
  Eye,
  Calendar,
  User,
  FileText
} from 'lucide-react';

const ActivityCard = ({ activity, onEdit, showEditButton = false }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="card hover:shadow-lg transition-shadow duration-200">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-2">
          {getStatusIcon(activity.status)}
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
            {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
          </span>
        </div>
        
        {showEditButton && (
          <button
            onClick={() => onEdit(activity)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>
        )}
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
        {activity.title}
      </h3>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <FileText className="w-4 h-4 mr-2" />
          <span className="font-medium">Type:</span>
          <span className="ml-1">{activity.type}</span>
        </div>

        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="w-4 h-4 mr-2" />
          <span className="font-medium">Submitted:</span>
          <span className="ml-1">{formatDate(activity.created_at)}</span>
        </div>

        {activity.reviewed_at && (
          <div className="flex items-center text-sm text-gray-600">
            <CheckCircle className="w-4 h-4 mr-2" />
            <span className="font-medium">Reviewed:</span>
            <span className="ml-1">{formatDate(activity.reviewed_at)}</span>
          </div>
        )}
      </div>

      <p className="text-gray-700 text-sm mb-4 line-clamp-3">
        {activity.description}
      </p>

      {activity.faculty_comment && (
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <div className="flex items-start space-x-2">
            <User className="w-4 h-4 text-gray-500 mt-0.5" />
            <div>
              <p className="text-xs font-medium text-gray-600 mb-1">Faculty Comment:</p>
              <p className="text-sm text-gray-700">{activity.faculty_comment}</p>
            </div>
          </div>
        </div>
      )}

      {activity.proof_file_path && (
        <div className="flex items-center text-sm text-primary-600">
          <FileText className="w-4 h-4 mr-2" />
          <span>Proof document attached</span>
        </div>
      )}
    </div>
  );
};

export default ActivityCard;