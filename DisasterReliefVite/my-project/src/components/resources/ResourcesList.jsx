import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Package, Home, Heart, Truck, MapPin, Phone, Plus, Search, Filter, 
  Edit3, Trash2 
} from 'lucide-react';

export const ResourcesList = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Fetch resources from backend
  const [resources, setResources] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newResource, setNewResource] = useState({
    title: '',
    description: '',
    type: 'food',
    quantity: 1,
    available_quantity: 1,
    location: { address: '' },
    provider_id: user?.id || user?._id,
    provider_name: user?.name,
    provider_contact: user?.phone,
    status: 'available',
    requirements: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/resources')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch resources');
        return res.json();
      })
      .then(data => setResources(data))
      .catch((err) => {
        setError(err.message || 'Could not load resources');
        setResources([]);
      });
  }, []);

  const handleAddResource = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newResource)
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to add resource');
      }
      const data = await res.json();
      setResources(prev => [...prev, data]);
      setShowModal(false);
      setNewResource({
        title: '',
        description: '',
        type: 'food',
        quantity: 1,
        available_quantity: 1,
        location: { address: '' },
        provider_id: user?.id || user?._id,
        provider_name: user?.name,
        provider_contact: user?.phone,
        status: 'available',
        requirements: ''
      });
    } catch (err) {
      setError(err.message || 'Could not add resource');
    }
  };

  const getCategoryIcon = (type) => {
    switch (type) {
      case 'food': return Package;
      case 'shelter': return Home;
      case 'medical': return Heart;
      case 'transport': return Truck;
      default: return Package;
    }
  };

  const getCategoryColor = (type) => {
    switch (type) {
      case 'food': return 'bg-green-100 text-green-700';
      case 'shelter': return 'bg-blue-100 text-blue-700';
      case 'medical': return 'bg-red-100 text-red-700';
      case 'transport': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'limited': return 'bg-yellow-100 text-yellow-800';
      case 'unavailable': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || resource.type === filterCategory;
    const matchesStatus = filterStatus === 'all' || resource.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Resources</h1>
        {(user?.role === 'admin' || user?.role === 'volunteer') && (
          <button
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center"
            onClick={() => setShowModal(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Resource
          </button>
        )}
      {/* Add Resource Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <form onSubmit={handleAddResource} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md space-y-4">
            <h2 className="text-xl font-bold mb-2">Add Resource</h2>
            {error && <div className="mb-2 text-red-600 text-sm">{error}</div>}
            <input
              type="text"
              placeholder="Title"
              value={newResource.title}
              onChange={e => setNewResource({ ...newResource, title: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
            <textarea
              placeholder="Description"
              value={newResource.description}
              onChange={e => setNewResource({ ...newResource, description: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
            <input
              type="text"
              placeholder="Address"
              value={newResource.location.address}
              onChange={e => setNewResource({ ...newResource, location: { address: e.target.value } })}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
            <select
              value={newResource.type}
              onChange={e => setNewResource({ ...newResource, type: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option value="food">Food</option>
              <option value="shelter">Shelter</option>
              <option value="medical">Medical</option>
              <option value="transport">Transport</option>
            </select>
            <input
              type="number"
              placeholder="Quantity"
              value={newResource.quantity}
              onChange={e => setNewResource({ ...newResource, quantity: Number(e.target.value), available_quantity: Number(e.target.value) })}
              className="w-full px-4 py-2 border rounded-lg"
              min={1}
              required
            />
            <input
              type="text"
              placeholder="Requirements (optional)"
              value={newResource.requirements}
              onChange={e => setNewResource({ ...newResource, requirements: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
            />
            <div className="flex gap-2 justify-end">
              <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded bg-gray-200">Cancel</button>
              <button type="submit" className="px-4 py-2 rounded bg-red-600 text-white">Add</button>
            </div>
          </form>
        </div>
      )}
      {/* Top-level error display */}
      {error && !showModal && (
        <div className="mb-4 text-center text-red-600 text-sm">{error}</div>
      )}
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>
          
          <div className="flex gap-3">
            <div className="relative">
              <Filter className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="all">All Categories</option>
                <option value="food">Food</option>
                <option value="shelter">Shelter</option>
                <option value="medical">Medical</option>
                <option value="transport">Transport</option>
              </select>
            </div>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="limited">Limited</option>
              <option value="unavailable">Unavailable</option>
            </select>
          </div>
        </div>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((resource) => {
          const CategoryIcon = getCategoryIcon(resource.category);
          const key = resource._id || resource.id;
          return (
            <div key={key} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-2 rounded-lg ${getCategoryColor(resource.category)}`}>
                    <CategoryIcon className="h-5 w-5" />
                  </div>
                  <div className="flex space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(resource.status)}`}>
                      {resource.status}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(resource.category)}`}>
                      {resource.category}
                    </span>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2">{resource.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{resource.description}</p>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-sm">
                    <Package className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">
                      Available: {resource.available_quantity}/{resource.quantity}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-sm">
                    <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-600 truncate">{resource.location.address}</span>
                  </div>
                  
                  <div className="flex items-center text-sm">
                    <Phone className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">{resource.provider_contact}</span>
                  </div>
                </div>

                {resource.requirements && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600">
                      <strong>Requirements:</strong> {resource.requirements}
                    </p>
                  </div>
                )}

                <div className="flex space-x-2">
                  {user?.role === 'victim' && (
                    <button
                      className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 text-sm font-medium"
                      onClick={async () => {
                        try {
                          const payload = {
                            resource: resource._id || resource.id,
                            user: user?._id || user?.id,
                            quantity_requested: 1,
                            message: `Request for ${resource.title} at ${resource.location.address}`
                          };
                          const res = await fetch('/api/requests', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(payload)
                          });
                          if (!res.ok) {
                            const data = await res.json();
                            throw new Error(data.error || 'Failed to request resource');
                          }
                          alert('Resource request submitted!');
                        } catch (err) {
                          alert(err.message || 'Could not request resource');
                        }
                      }}
                    >
                      Request Resource
                    </button>
                  )}
                  
                  {(user?.role === 'admin' || (user?.role === 'volunteer' && resource.provider_id === user.id)) && (
                    <>
                      <button className="flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button className="flex items-center px-3 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </>
                  )}
                  
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredResources.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No resources found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  );
}
