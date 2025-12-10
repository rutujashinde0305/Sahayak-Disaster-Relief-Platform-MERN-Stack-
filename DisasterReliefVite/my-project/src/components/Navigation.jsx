import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Home,
  Package,
  FileText,
  BarChart3,
  Users,
  MapPin,
  Settings,
  Heart
} from 'lucide-react';

// Prop types for Navigation
// currentPage: string
// onPageChange: function
// className: string (optional)

export const Navigation = ({
  currentPage,
  onPageChange,
  className = ''
}) => {
  const { user } = useAuth();

  const getNavItems = () => {
    const baseItems = [
      { id: 'dashboard', label: 'Dashboard', icon: Home },
      { id: 'resources', label: 'Resources', icon: Package },
      { id: 'requests', label: 'Requests', icon: FileText },
      { id: 'map', label: 'Map View', icon: MapPin },
    ];

    if (user?.role === 'admin') {
      return [
        ...baseItems,
        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
        { id: 'users', label: 'Users', icon: Users },
        { id: 'settings', label: 'Settings', icon: Settings },
      ];
    }

    if (user?.role === 'volunteer') {
      return [
        ...baseItems,
        { id: 'volunteers', label: 'Volunteers', icon: Heart },
      ];
    }

    return baseItems;
  };

  const navItems = getNavItems();

  return (
    <nav className={`bg-white shadow-sm border-r ${className}`}>
      <div className="p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onPageChange(item.id)}
                  className={`w-full flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-red-100 text-red-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};