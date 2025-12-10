import React, { useEffect, useState } from 'react';

export function VolunteersList() {
  const [volunteers, setVolunteers] = useState([]);

  useEffect(() => {
    fetch('/api/volunteers')
      .then(res => res.json())
      .then(data => setVolunteers(data));
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold mb-4">Other Volunteers</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {volunteers.map(v => (
          <div key={v._id} className="bg-white rounded-lg shadow p-4 border">
            <div className="font-semibold text-lg text-blue-700">{v.name}</div>
            <div className="text-gray-600">Skills: {v.skills?.join(', ') || 'N/A'}</div>
            <div className="text-gray-600">Availability: {v.availability ? 'Available' : 'Unavailable'}</div>
            <div className="text-gray-600">Requests Approved: {v.approvedCount ?? 0}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
