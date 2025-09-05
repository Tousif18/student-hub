import React, { useState, useEffect } from 'react';
import { X, Upload, FileText } from 'lucide-react';
import api from '../utils/api';

const ActivityForm = ({ activity, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    description: '',
    proof: null
  });
  const [activityTypes, setActivityTypes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchActivityTypes();
    if (activity) {
      setFormData({
        title: activity.title || '',
        type: activity.type || '',
        description: activity.description || '',
        proof: null
      });
    }
  }, [activity]);

  const fetchActivityTypes = async () => {
    try {
      const response = await api.get('/activities/types');
      setActivityTypes(response.data.types);
    } catch (error) {
      console.error('Failed to fetch activity types:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        proof: file
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.type || !formData.description) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    
    const submitData = new FormData();
    submitData.append('title', formData.title);
    submitData.append('type', formData.type);
    submitData.append('description', formData.description);
    
    if (formData.proof) {
      submitData.append('proof', formData.proof);
    }

    try {
      await onSubmit(submitData);
    } catch (error) {
      console.error('Submit error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {activity ? 'Edit Activity' : 'Add New Activity'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label htmlFor="title" className="label">
              Activity Title *
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              className="input-field"
              placeholder="Enter activity title"
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="type" className="label">
              Activity Type *
            </label>
            <select
              id="type"
              name="type"
              required
              className="input-field"
              value={formData.type}
              onChange={handleChange}
            >
              <option value="">Select activity type</option>
              {activityTypes.map((type) => (
                <option key={type.id} value={type.name}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="description" className="label">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={4}
              className="input-field"
              placeholder="Describe your activity or achievement"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="proof" className="label">
              Proof Document (Optional)
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400 transition-colors">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="proof"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                  >
                    <span>Upload a file</span>
                    <input
                      id="proof"
                      name="proof"
                      type="file"
                      className="sr-only"
                      accept=".pdf,.jpg,.jpeg,.png,.gif"
                      onChange={handleFileChange}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">
                  PDF, PNG, JPG, GIF up to 10MB
                </p>
                {formData.proof && (
                  <div className="flex items-center justify-center mt-2 text-sm text-green-600">
                    <FileText className="w-4 h-4 mr-1" />
                    {formData.proof.name}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'Submitting...' : (activity ? 'Update Activity' : 'Submit Activity')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ActivityForm;