import React, { useEffect, useState } from 'react';
import { ResourcesList } from '../resources/ResourcesList';
import { RequestsList } from '../requests/RequestsList';
import MapView from './MapView';
import { useAuth } from '../../context/AuthContext';
import { TrendingUp, Users, Home, Package, Heart, Truck, AlertTriangle, FileText } from 'lucide-react';

export function VolunteerDashboard() {
  const { user } = useAuth();
  const [resources, setResources] = useState([]);
  const [stats, setStats] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [urgentAlerts, setUrgentAlerts] = useState([]);

  useEffect(() => {
    // Fetch resources, requests, and alerts
    const fetchData = async () => {
      try {
        const resResources = await fetch('/api/resources');
        const resourcesData = await resResources.json();
        setResources(resourcesData.filter(r => r.provider_id === user?._id));
        const resRequests = await fetch('/api/requests');
        const requests = await resRequests.json();
        // Stats for volunteer
        const myResources = resourcesData.filter(r => r.provider_id === user?._id);
        setStats([
          { label: 'My Resources', value: myResources.length, icon: Package, color: 'bg-blue-500' },
          { label: 'Requests to Handle', value: requests.filter(r => r.resource && r.resource.provider_id === user?._id).length, icon: FileText, color: 'bg-orange-500' },
          { label: 'Transport', value: myResources.filter(r => r.type === 'transport').length, icon: Truck, color: 'bg-orange-500' },
          { label: 'Food', value: myResources.filter(r => r.type === 'food').length, icon: Heart, color: 'bg-red-500' },
          { label: 'Shelter', value: myResources.filter(r => r.type === 'shelter').length, icon: Home, color: 'bg-green-500' },
        ]);
        // Recent activity: last 5 requests for my resources
        const myResourceRequests = requests.filter(r => r.resource && r.resource.provider_id === user?._id);
        setRecentActivity(myResourceRequests.slice(-5).reverse().map(r => ({
          id: r._id,
          type: 'request',
          action: r.message || r.description || 'Resource requested',
          location: r.resource?.location?.address || 'N/A',
          time: new Date(r.created_at).toLocaleString(),
          priority: r.priority,
        })));
        // Mock urgent alerts
        setUrgentAlerts([
          { id: 1, message: 'Emergency: Flood in your area', severity: 'critical', time: 'Just now' },
          { id: 2, message: 'High demand for your resources', severity: 'high', time: '10 min ago' },
        ]);
      } catch (err) {
        setResources([]);
        setStats([]);
        setRecentActivity([]);
        setUrgentAlerts([]);
      }
    };
    fetchData();
  }, [user]);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-500 to-orange-500 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {user?.name}
        </h1>
        <p className="text-blue-100">
          Help distribute resources and assist those in need
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                <p className="text-gray-600 text-sm">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>


      {/* Recent Activity & Urgent Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${
                    activity.type === 'request' ? 'bg-orange-100' :
                    activity.type === 'resource' ? 'bg-blue-100' :
                    activity.type === 'volunteer' ? 'bg-green-100' :
                    'bg-gray-100'
                  }`}>
                    {activity.type === 'request' && <FileText className="h-4 w-4 text-orange-600" />}
                    {activity.type === 'resource' && <Package className="h-4 w-4 text-blue-600" />}
                    {activity.type === 'volunteer' && <Users className="h-4 w-4 text-green-600" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.location}</p>
                    <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                  </div>
                  {activity.priority === 'high' && (
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Urgent Alerts */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Urgent Alerts</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {urgentAlerts.map((alert) => (
                <div key={alert.id} className={`p-4 rounded-lg border-l-4 ${
                  alert.severity === 'critical' ? 'bg-red-50 border-red-500' :
                  alert.severity === 'high' ? 'bg-orange-50 border-orange-500' :
                  'bg-yellow-50 border-yellow-500'
                }`}>
                  <div className="flex items-start">
                    <AlertTriangle className={`h-5 w-5 mt-0.5 mr-3 ${
                      alert.severity === 'critical' ? 'text-red-500' :
                      alert.severity === 'high' ? 'text-orange-500' :
                      'text-yellow-500'
                    }`} />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
