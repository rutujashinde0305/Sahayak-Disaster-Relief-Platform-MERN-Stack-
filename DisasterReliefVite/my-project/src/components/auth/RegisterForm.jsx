import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Shield, Mail, Lock, User, Phone, MapPin, Building, AlertCircle } from 'lucide-react';

export const RegisterForm = ({ onSwitchToLogin, onBackToHome }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    role: 'victim',
    phone: '',
    address: '',
    organization: '',
    skills: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const { register, loading, notify } = useAuth();

  const validateField = (name, value) => {
    const errors = { ...fieldErrors };
    
    switch (name) {
      case 'email':
        if (!value.trim()) {
          errors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errors.email = 'Please enter a valid email address';
        } else {
          delete errors.email;
        }
        break;
      case 'name':
        if (!value.trim()) {
          errors.name = 'Full name is required';
        } else if (value.trim().length < 2) {
          errors.name = 'Name must be at least 2 characters';
        } else {
          delete errors.name;
        }
        break;
      case 'password':
        if (!value) {
          errors.password = 'Password is required';
        } else if (value.length < 6) {
          errors.password = 'Password must be at least 6 characters';
        } else {
          delete errors.password;
        }
        break;
      case 'phone':
        if (value && !/^\+?[0-9]{10,}$/.test(value.replace(/\D/g, ''))) {
          errors.phone = 'Please enter a valid phone number';
        } else {
          delete errors.phone;
        }
        break;
      default:
        break;
    }
    
    setFieldErrors(errors);
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate all fields
    const emailErrors = validateField('email', formData.email);
    const nameErrors = validateField('name', formData.name);
    const passwordErrors = validateField('password', formData.password);
    const phoneErrors = validateField('phone', formData.phone);

    if (Object.keys(emailErrors).length > 0 || Object.keys(nameErrors).length > 0 || 
        Object.keys(passwordErrors).length > 0 || Object.keys(phoneErrors).length > 0) {
      setError('Please fix the errors below');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Volunteer-specific validation
    if (formData.role === 'volunteer') {
      if (!formData.organization.trim()) {
        setError('Organization is required for volunteers');
        return;
      }
      if (!formData.skills.trim()) {
        setError('Skills are required for volunteers');
        return;
      }
    }

    // Only send organization and skills for volunteers, and always as non-empty for volunteers
    const payload = {
      email: formData.email,
      name: formData.name,
      role: formData.role,
      phone: formData.phone,
      location: formData.address
        ? {
            latitude: 40.7128 + Math.random() * 0.1,
            longitude: -74.006 + Math.random() * 0.1,
            address: formData.address
          }
        : null,
      password: formData.password
    };
    if (formData.role === 'volunteer') {
      payload.organization = formData.organization.trim();
      payload.skills = formData.skills.split(',').map((s) => s.trim()).filter(Boolean);
    }
    try {
      const data = await register(payload);
      setSuccess('Account created successfully! Redirecting to dashboard...');
      try { notify && notify('Registration successful', 'success'); } catch (e) {}
      return data;
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again or contact support.');
      try { notify && notify(err.message || 'Registration failed', 'error'); } catch (e) {}
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-blue-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Back Button */}
      <div className="absolute top-4 left-4">
        <button
          onClick={onBackToHome}
          className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition"
        >
          <span>← Back to Home</span>
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Shield className="h-12 w-12 text-red-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Join DisasterRelief
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Help make a difference in disaster response
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded flex items-start">
              <AlertCircle className="h-5 w-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-red-700 font-medium text-sm">{error}</p>
                <p className="text-red-600 text-xs mt-1">Please review the form and try again</p>
              </div>
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-500 rounded flex items-start">
              <AlertCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
              <p className="text-green-700 font-medium text-sm">{success}</p>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <div className="mt-1 relative">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`appearance-none block w-full px-3 py-2 pl-10 border rounded-md placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 ${
                    fieldErrors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your full name"
                />
                <User className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
              </div>
              {fieldErrors.name && <p className="mt-1 text-sm text-red-600">{fieldErrors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1 relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`appearance-none block w-full px-3 py-2 pl-10 border rounded-md placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 ${
                    fieldErrors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your email"
                />
                <Mail className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
              </div>
              {fieldErrors.email && <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>}
            </div>

            {/* Role */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                I am registering as a
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
              >
                <option value="victim">Person in need of assistance</option>
                <option value="volunteer">Volunteer/Organization</option>
                <option value="admin">Administrator</option>
              </select>
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <div className="mt-1 relative">
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
                  placeholder="Enter your phone number"
                />
                <Phone className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
              </div>
            </div>

            {/* Address */}
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Location/Address
              </label>
              <div className="mt-1 relative">
                <input
                  id="address"
                  name="address"
                  type="text"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
                  placeholder="Enter your location"
                />
                <MapPin className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
              </div>
            </div>

            {/* Organization & Skills (only for volunteers) */}
            {formData.role === 'volunteer' && (
              <>
                <div>
                  <label htmlFor="organization" className="block text-sm font-medium text-gray-700">
                    Organization (Optional)
                  </label>
                  <div className="mt-1 relative">
                    <input
                      id="organization"
                      name="organization"
                      type="text"
                      value={formData.organization}
                      onChange={handleInputChange}
                      className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
                      placeholder="Organization name"
                    />
                    <Building className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                  </div>
                </div>

                <div>
                  <label htmlFor="skills" className="block text-sm font-medium text-gray-700">
                    Skills/Specializations
                  </label>
                  <input
                    id="skills"
                    name="skills"
                    type="text"
                    value={formData.skills}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
                    placeholder="e.g., Medical Aid, Food Distribution, Translation"
                  />
                  <p className="mt-1 text-xs text-gray-500">Separate multiple skills with commas</p>
                </div>
              </>
            )}

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`appearance-none block w-full px-3 py-2 pl-10 border rounded-md placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 ${
                    fieldErrors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Create a password"
                />
                <Lock className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
              </div>
              {fieldErrors.password && <p className="mt-1 text-sm text-red-600">{fieldErrors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
                  placeholder="Confirm your password"
                />
                <Lock className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </div>
          </form>

          {/* Switch to Login */}
          <div className="mt-6">
            <div className="text-center">
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="text-sm text-red-600 hover:text-red-500"
              >
                Already have an account? Sign in here
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
