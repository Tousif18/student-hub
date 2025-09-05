import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  User, 
  LogOut, 
  GraduationCap, 
  Users, 
  BarChart3, 
  UserCircle 
} from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardLink = () => {
    if (!user) return '/dashboard';
    
    switch (user.role) {
      case 'student':
        return '/dashboard';
      case 'faculty':
        return '/faculty';
      case 'admin':
        return '/admin';
      default:
        return '/dashboard';
    }
  };

  const getDashboardIcon = () => {
    if (!user) return <GraduationCap className="w-5 h-5" />;
    
    switch (user.role) {
      case 'student':
        return <GraduationCap className="w-5 h-5" />;
      case 'faculty':
        return <Users className="w-5 h-5" />;
      case 'admin':
        return <BarChart3 className="w-5 h-5" />;
      default:
        return <GraduationCap className="w-5 h-5" />;
    }
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to={isAuthenticated ? getDashboardLink() : '/'} className="flex items-center space-x-2">
            <GraduationCap className="w-8 h-8 text-primary-600" />
            <span className="text-xl font-bold text-gray-800">Smart Student Hub</span>
          </Link>

          {/* Navigation Links */}
          {isAuthenticated ? (
            <div className="flex items-center space-x-6">
              <Link
                to={getDashboardLink()}
                className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition-colors"
              >
                {getDashboardIcon()}
                <span>Dashboard</span>
              </Link>

              <Link
                to="/profile"
                className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition-colors"
              >
                <UserCircle className="w-5 h-5" />
                <span>Profile</span>
              </Link>

              {/* User Info & Logout */}
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">{user?.firstName} {user?.lastName}</span>
                  <span className="text-gray-400 ml-2">({user?.role})</span>
                </div>
                
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-gray-700 hover:text-red-600 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-700 hover:text-primary-600 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="btn-primary"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;