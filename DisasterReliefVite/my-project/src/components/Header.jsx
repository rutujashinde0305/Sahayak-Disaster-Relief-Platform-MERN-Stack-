import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, LogOut, Menu, Bell } from 'lucide-react';

// Prop types for Header
import PropTypes from 'prop-types';

export const Header = ({ onMenuToggle }) => {
  const { user, logout } = useAuth();

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-red-500';
      case 'volunteer': return 'bg-blue-500';
      case 'victim': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            {onMenuToggle && (
              <button
                onClick={onMenuToggle}
                className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900"
              >
                <Menu className="h-5 w-5" />
              </button>
            )}
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-red-600" />
              <h1 className="ml-2 text-xl font-bold text-gray-900">
                DisasterRelief
              </h1>
            </div>
          </div>

          {user && (
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <div className="flex items-center space-x-1">
                    <span className={`inline-block w-2 h-2 rounded-full ${getRoleColor(user.role)}`}></span>
                    <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                  </div>
                </div>
                
                <button
                  onClick={logout}
                  className="p-2 text-gray-400 hover:text-gray-600"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};