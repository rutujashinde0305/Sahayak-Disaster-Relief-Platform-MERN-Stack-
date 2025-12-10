import React, { useEffect, useState } from 'react';
import MapView from './MapView';
import { useAuth } from '../../context/AuthContext';

function VolunteerMapView() {
  const { user } = useAuth();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const res = await fetch('/api/resources');
        const data = await res.json();
        setResources(data.filter(r => r.provider_id === user?._id));
      } catch (err) {
        setResources([]);
      } finally {
        setLoading(false);
      }
    };
    fetchResources();
  }, [user]);

  if (loading) return <div>Loading map...</div>;

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4">
      {resources.length > 0 ? (
        <MapView resources={resources} userRole="volunteer" />
      ) : (
        <div className="text-gray-500">No resources found to display on map.</div>
      )}
    </div>
  );
}

export default VolunteerMapView;
