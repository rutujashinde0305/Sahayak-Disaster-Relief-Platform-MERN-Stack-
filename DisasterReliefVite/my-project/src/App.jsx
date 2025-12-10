import React, { useState, lazy, Suspense } from 'react';
const VolunteerMapView = lazy(() => import('./components/dashboard/VolunteerMapView'));
const VictimMapView = lazy(() => import('./components/dashboard/VictimMapView'));
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { HomePage } from './components/HomePage';
import { DashboardOverview } from './components/dashboard/DashboardOverview';
import { VolunteerDashboard } from './components/dashboard/VolunteerDashboard';
import { ResourcesList } from './components/resources/ResourcesList';
import { RequestsList } from './components/requests/RequestsList';
import { VolunteersList } from './components/dashboard/VolunteersList';

const AppContent = () => {
  const { user, loading } = useAuth();
  const { notification, clearNotification } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [authMode, setAuthMode] = useState('login'); // removed union type
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showHomePage, setShowHomePage] = useState(true);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!user) {
    if (showHomePage) {
      return (
        <HomePage 
          onLoginClick={() => {
            setShowHomePage(false);
            setAuthMode('login');
          }}
          onRegisterClick={() => {
            setShowHomePage(false);
            setAuthMode('register');
          }}
        />
      );
    }
    return authMode === 'login' ? (
      <LoginForm 
        onSwitchToRegister={() => setAuthMode('register')}
        onBackToHome={() => {
          setShowHomePage(true);
          setAuthMode('login');
        }}
      />
    ) : (
      <RegisterForm 
        onSwitchToLogin={() => setAuthMode('login')}
        onBackToHome={() => {
          setShowHomePage(true);
          setAuthMode('login');
        }}
      />
    );
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        if (user?.role === 'volunteer') {
          return <VolunteerDashboard />;
        }
        return <DashboardOverview />;
      case 'resources':
        return <ResourcesList />;
      case 'requests':
        if (user?.role === 'victim') {
          return (
            <div className="bg-white rounded-lg shadow-sm border p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">My Past Requests</h2>
              <RequestsList forRole="victim" />
            </div>
          );
        } else if (user?.role === 'volunteer') {
          return (
            <div className="bg-white rounded-lg shadow-sm border p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Requests for My Resources</h2>
              <RequestsList forRole="volunteer" />
            </div>
          );
        }
        return (
          <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Requests Management</h2>
            <p className="text-gray-600">Request management interface coming soon...</p>
          </div>
        );
      case 'map':
        if (user?.role === 'volunteer') {
          return (
            <Suspense fallback={<div>Loading map...</div>}>
              <VolunteerMapView />
            </Suspense>
          );
        }
        if (user?.role === 'victim') {
          return (
            <Suspense fallback={<div>Loading map...</div>}>
              <VictimMapView />
            </Suspense>
          );
        }
        return (
          <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Map View</h2>
            <p className="text-gray-600">Interactive map with resource locations coming soon...</p>
          </div>
        );
      case 'analytics':
        return (
          <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Analytics Dashboard</h2>
            <p className="text-gray-600">Advanced analytics and reporting coming soon...</p>
          </div>
        );
      case 'users':
        return (
          <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">User Management</h2>
            <p className="text-gray-600">User management interface coming soon...</p>
          </div>
        );
      case 'volunteers':
        return (
          <div className="bg-white rounded-lg shadow-sm border p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Volunteers</h2>
            <p className="text-gray-600 mb-4">Browse other volunteers, their skills, and availability.</p>
            <VolunteersList />
          </div>
        );
      case 'settings':
        return (
          <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Settings</h2>
            <p className="text-gray-600">System settings and configuration coming soon...</p>
          </div>
        );
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      {/* Global notification banner */}
      {notification && (
        <div className={`max-w-7xl mx-auto mt-4 px-4 sm:px-6 lg:px-8`}>
          <div className={`rounded-md p-3 flex items-start justify-between ${notification.type === 'success' ? 'bg-green-50 border-l-4 border-green-400 text-green-800' : notification.type === 'error' ? 'bg-red-50 border-l-4 border-red-400 text-red-800' : 'bg-blue-50 border-l-4 border-blue-400 text-blue-800'}`}>
            <div>{notification.message}</div>
            <button onClick={clearNotification} className="ml-4 text-sm font-medium underline">Dismiss</button>
          </div>
        </div>
      )}
      
      <div className="flex">
        {/* Sidebar */}
        <div className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 fixed md:relative z-30 w-64 h-[calc(100vh-4rem)] transition-transform duration-200 ease-in-out`}>
          <Navigation 
            currentPage={currentPage} 
            onPageChange={setCurrentPage} 
            className="h-full"
          />
        </div>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {renderCurrentPage()}
          </div>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
