import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import React, { useState } from 'react';

const statusColors = {
  available: 'green',
  limited: 'orange',
  unavailable: 'red',
};

function MapView({ resources = [], userRole, onRequestResource, onUpdateStatus }) {
  const [filterType, setFilterType] = useState('all');

  // Center on India by default
  const indiaCenter = [22.5937, 78.9629];
  const filtered = resources.filter(r => filterType === 'all' || r.type === filterType);

  return (
    <div className="h-96 w-full rounded-lg overflow-hidden">
      <div className="mb-2 flex gap-2 items-center">
        <label className="font-semibold">Filter by type:</label>
        <select value={filterType} onChange={e => setFilterType(e.target.value)} className="border rounded px-2 py-1">
          <option value="all">All</option>
          <option value="food">Food</option>
          <option value="shelter">Shelter</option>
          <option value="medical">Medical</option>
          <option value="transport">Transport</option>
        </select>
      </div>
      <MapContainer center={indiaCenter} zoom={5} style={{ height: '100%', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {filtered.map((resource, idx) => (
          resource.location?.latitude && resource.location?.longitude && (
            <Marker
              key={idx}
              position={[resource.location.latitude, resource.location.longitude]}
              pathOptions={{ color: statusColors[resource.status] || 'blue' }}
            >
              <Popup>
                <div>
                  <strong>{resource.title}</strong><br />
                  <span className="text-xs">{resource.type} | <span style={{ color: statusColors[resource.status] }}>{resource.status}</span></span><br />
                  {resource.location.address}<br />
                  Quantity: {resource.available_quantity} / {resource.quantity}
                  {userRole === 'victim' && resource.status === 'available' && onRequestResource && (
                    <div className="mt-2">
                      <button
                        className="bg-orange-500 text-white px-3 py-1 rounded"
                        onClick={() => onRequestResource(resource)}
                      >Request Resource</button>
                    </div>
                  )}
                  {userRole === 'volunteer' && onUpdateStatus && (
                    <div className="mt-2">
                      <label className="mr-2">Update status:</label>
                      <select
                        value={resource.status}
                        onChange={e => onUpdateStatus(resource, e.target.value)}
                        className="border rounded px-2 py-1"
                      >
                        <option value="available">Available</option>
                        <option value="limited">Limited</option>
                        <option value="unavailable">Unavailable</option>
                      </select>
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          )
        ))}
      </MapContainer>
    </div>
  );
}

export default MapView;
