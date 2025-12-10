import React, { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle, Clock, XCircle, Plus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function RequestsList({ forRole }) {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetch('/api/requests')
      .then(res => res.json())
      .then(data => setRequests(data));
  }, []);

  // Filter requests for volunteer: show requests for resources owned by this volunteer
  let filteredRequests = requests;
  if (forRole === 'volunteer') {
    filteredRequests = requests.filter(r =>
      r.resource && r.resource.provider_id && String(r.resource.provider_id) === String(user?._id)
    );
  } else if (forRole === 'victim') {
    filteredRequests = requests.filter(r => r.user && String(r.user._id) === String(user?._id));
  }

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'bg-gray-100 text-gray-700 border-gray-300',
      medium: 'bg-blue-100 text-blue-700 border-blue-300',
      high: 'bg-orange-100 text-orange-700 border-orange-300',
      critical: 'bg-red-100 text-red-700 border-red-300',
    };
    return colors[priority] || '';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-orange-600" />;
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-blue-600" />;
      case 'allocated':
      case 'fulfilled':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-orange-50 border-orange-200 text-orange-700',
      approved: 'bg-blue-50 border-blue-200 text-blue-700',
      allocated: 'bg-green-50 border-green-200 text-green-700',
      fulfilled: 'bg-green-50 border-green-200 text-green-700',
      rejected: 'bg-red-50 border-red-200 text-red-700',
    };
    return colors[status] || '';
  };

  // Accept/Decline handlers
  const handleStatusChange = async (id, status) => {
    try {
      const res = await fetch(`/api/requests/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setRequests((prev) => prev.map(r => r._id === id ? { ...r, status } : r));
        if (status === 'approved') {
          alert('User will be notified: Request accepted');
        } else {
          alert('User will be notified: Request not accepted');
        }
      }
    } catch (e) {
      alert('Failed to update request');
    }
  };

  return (
    <div className="space-y-4">
      {filteredRequests.map((request) => (
        <div
          key={request._id}
          className="bg-white rounded-xl shadow-md border-2 border-gray-200 p-6 hover:border-orange-500 transition-all"
        >
          <div className="flex flex-col lg:flex-row gap-4 justify-between">
            <div className="flex-1">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="h-6 w-6 text-orange-600" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap gap-2 mb-2">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full border capitalize ${getPriorityColor(
                        request.priority
                      )}`}
                    >
                      {request.priority} Priority
                    </span>
                    <span className="px-3 py-1 text-xs font-semibold rounded-full border bg-gray-100 text-gray-700 border-gray-300 capitalize">
                      {request.resource?.type || 'resource'}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-2">{request.message || request.description}</p>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>
                      <span className="font-semibold">Quantity:</span> {request.quantity_requested || request.quantity_needed} units
                    </p>
                    <p>
                      <span className="font-semibold">Location:</span> {request.resource?.location?.address || request.location || 'N/A'}
                    </p>
                    <p>
                      <span className="font-semibold">Requested:</span> {new Date(request.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-start lg:items-end gap-3">
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 ${getStatusColor(
                  request.status
                )}`}
              >
                {getStatusIcon(request.status)}
                <span className="font-semibold capitalize">{request.status}</span>
              </div>
              {/* Accept/Decline for volunteers on pending requests */}
              {forRole === 'volunteer' && request.status === 'pending' && (
                <div className="flex gap-2 mt-2">
                  <button
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    onClick={() => handleStatusChange(request._id, 'approved')}
                  >
                    Accept
                  </button>
                  <button
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    onClick={() => handleStatusChange(request._id, 'rejected')}
                  >
                    Decline
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
      {filteredRequests.length === 0 && (
        <div className="text-center py-12">
          <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">No requests found</p>
        </div>
      )}
    </div>
  );
}
