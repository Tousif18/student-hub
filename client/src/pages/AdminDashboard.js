import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import api from '../utils/api';
import { 
  Users, 
  FileText, 
  Download, 
  BarChart3,
  TrendingUp,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({});
  const [departmentStats, setDepartmentStats] = useState([]);
  const [yearStats, setYearStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, deptRes, yearRes] = await Promise.all([
        api.get('/activities/stats'),
        api.get('/reports/department-stats'),
        api.get('/reports/year-stats')
      ]);

      setStats(statsRes.data);
      setDepartmentStats(deptRes.data.departmentStats);
      setYearStats(yearRes.data.yearStats);
    } catch (error) {
      toast.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleExportReport = async (type, format) => {
    try {
      const response = await api.get(`/reports/${type}?format=${format}`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${type}_report.${format === 'excel' ? 'xlsx' : 'csv'}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success('Report exported successfully');
    } catch (error) {
      toast.error('Failed to export report');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const totalActivities = stats.statusStats?.reduce((sum, stat) => sum + parseInt(stat.count), 0) || 0;
  const approvedActivities = stats.statusStats?.find(s => s.status === 'approved')?.count || 0;
  const pendingActivities = stats.statusStats?.find(s => s.status === 'pending')?.count || 0;
  const rejectedActivities = stats.statusStats?.find(s => s.status === 'rejected')?.count || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Overview of student activities and institutional reporting
          </p>
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
              <p className="text-2xl font-bold text-gray-900">{totalActivities}</p>
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
              <p className="text-2xl font-bold text-gray-900">{approvedActivities}</p>
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
              <p className="text-2xl font-bold text-gray-900">{pendingActivities}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-gray-900">{rejectedActivities}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Export Reports */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Export Reports</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-gray-700">Student Reports</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => handleExportReport('students', 'csv')}
                className="btn-secondary flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>CSV</span>
              </button>
              <button
                onClick={() => handleExportReport('students', 'excel')}
                className="btn-secondary flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Excel</span>
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-medium text-gray-700">Activity Reports</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => handleExportReport('activities', 'csv')}
                className="btn-secondary flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>CSV</span>
              </button>
              <button
                onClick={() => handleExportReport('activities', 'excel')}
                className="btn-secondary flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Excel</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Department Statistics */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Department Statistics</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Students
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Activities
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Approved
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Approval Rate
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {departmentStats.map((dept, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {dept.department}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {dept.total_students}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {dept.total_activities}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {dept.approved_activities}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {dept.approval_rate}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Year Statistics */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Year-wise Statistics</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Year of Study
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Students
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Activities
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Approved
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pending
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rejected
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {yearStats.map((year, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Year {year.year_of_study}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {year.total_students}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {year.total_activities}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {year.approved_activities}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {year.pending_activities}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {year.rejected_activities}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;