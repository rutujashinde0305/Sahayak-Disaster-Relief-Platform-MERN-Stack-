import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Shield, Mail, Lock, AlertCircle } from 'lucide-react';

const demoAccounts = [
  { role: 'Admin', email: 'admin@relief.org', password: 'admin123' },
  { role: 'Volunteer', email: 'volunteer@relief.org', password: 'volunteer123' },
  { role: 'Victim', email: 'victim@relief.org', password: 'victim123' }
];

export const LoginForm = ({ onSwitchToRegister, onBackToHome }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showDemoAccounts, setShowDemoAccounts] = useState(false);
  const { login, loading, notify } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    if (!password.trim()) {
      setError('Please enter your password');
      return;
    }

    try {
      const data = await login(email, password);
      setSuccess('Login successful! Redirecting...');
      // set a global notification so it shows after redirect
      try { notify && notify('Login successful', 'success'); } catch(e) {}
      return data;
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials and try again.');
      try { notify && notify(err.message || 'Login failed', 'error'); } catch(e) {}
    }
  };

  const fillDemoAccount = (email, password) => {
    setEmail(email);
    setPassword(password);
    setError('');
    setSuccess('');
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
          DisasterRelief Platform
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Connecting resources with those in need
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded flex items-start">
              <AlertCircle className="h-5 w-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-red-700 font-medium text-sm">{error}</p>
                <p className="text-red-600 text-xs mt-1">Use demo accounts to test, or create a new account</p>
              </div>
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-500 rounded flex items-start">
              <AlertCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
              <p className="text-green-700 font-medium text-sm">{success}</p>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
                  placeholder="Enter your email"
                />
                <Mail className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
                  placeholder="Enter your password"
                />
                <Lock className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>

          {/* Demo Accounts Section */}
          <div className="mt-6 border-t pt-6">
            <button
              type="button"
              onClick={() => setShowDemoAccounts(!showDemoAccounts)}
              className="w-full text-center text-sm text-gray-600 hover:text-gray-900 font-medium transition"
            >
              {showDemoAccounts ? '✕ Hide Demo Accounts' : '+ Show Demo Accounts'}
            </button>

            {showDemoAccounts && (
              <div className="mt-4 space-y-2">
                <p className="text-xs text-gray-600 mb-3 font-semibold">Click to auto-fill demo credentials:</p>
                {demoAccounts.map((account) => (
                  <button
                    key={account.email}
                    type="button"
                    onClick={() => fillDemoAccount(account.email, account.password)}
                    className="w-full p-3 text-left bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-md transition text-sm"
                  >
                    <div className="font-medium text-blue-900">{account.role}</div>
                    <div className="text-blue-700 text-xs mt-1">{account.email}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6">
            <div className="text-center">
              <button
                type="button"
                onClick={onSwitchToRegister}
                className="text-sm text-red-600 hover:text-red-500"
              >
                Don't have an account? Register here
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
