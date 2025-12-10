import React from 'react';
import { AlertCircle, MapPin, Users, Package, Zap } from 'lucide-react';

export const HomePage = ({ onLoginClick, onRegisterClick }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-orange-50 to-orange-100 text-gray-800">
      {/* Top navigation */}
      <header className="sticky top-0 z-30 backdrop-blur bg-white/60 border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-red-600 text-white">
              <AlertCircle className="w-5 h-5" />
            </div>
            <span className="text-xl font-semibold tracking-tight">Sahayak</span>
            <span className="ml-3 text-sm text-gray-500">Disaster Relief & Coordination</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onLoginClick}
              className="text-sm px-4 py-2 rounded-md font-medium text-gray-700 hover:text-red-600"
            >
              Log in
            </button>
            <button
              onClick={onRegisterClick}
              className="text-sm px-4 py-2 rounded-md font-semibold bg-red-600 text-white shadow-sm hover:bg-red-700"
            >
              Register
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight text-gray-900">
              Coordinate relief fast —
              <span className="text-red-600"> help where it matters</span>
            </h1>
            <p className="mt-6 text-lg text-gray-600 max-w-xl">
              Sahayak connects people in need with volunteers and available resources in real time. Report requests, find help nearby, and track responses — all from one simple dashboard.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <button
                onClick={onRegisterClick}
                className="inline-flex items-center gap-3 px-5 py-3 bg-red-600 text-white rounded-lg text-lg font-medium shadow-md hover:bg-red-700 transition"
              >
                Create Account
              </button>

              <button
                onClick={onLoginClick}
                className="inline-flex items-center gap-2 px-5 py-3 bg-white text-red-600 border border-red-200 rounded-lg text-lg font-medium hover:bg-red-50 transition"
              >
                Sign in
              </button>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-red-600" />
                <span>Live location-based requests</span>
              </div>
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-blue-600" />
                <span>Verified volunteer network</span>
              </div>
            </div>
          </div>

          {/* Visual card */}
          <div className="relative">
            <div className="rounded-2xl bg-white shadow-2xl p-6 transform -translate-y-6">
              <div className="h-64 rounded-lg overflow-hidden bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-16 h-16 text-red-600 mx-auto" />
                  <p className="mt-4 text-gray-700">Map view with active requests</p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-4 text-sm text-gray-600">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                    <Users className="w-4 h-4" />
                  </div>
                  <div className="mt-2">Volunteers</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <Package className="w-4 h-4" />
                  </div>
                  <div className="mt-2">Resources</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div className="mt-2">Requests</div>
                </div>
              </div>
            </div>

            <div className="absolute right-0 bottom-0 -mb-8 -mr-8">
              <div className="w-36 h-36 rounded-full bg-red-50 ring-8 ring-white shadow-xl flex items-center justify-center">
                <div className="text-sm text-red-600 font-semibold">Live</div>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <section className="mt-20">
          <h3 className="text-2xl font-bold text-gray-900 text-center">What Sahayak provides</h3>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 bg-white rounded-xl shadow-sm border">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-red-50 flex items-center justify-center text-red-600">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold">Volunteer Network</h4>
                  <p className="text-sm text-gray-600 mt-1">Locate and dispatch volunteers near affected areas.</p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white rounded-xl shadow-sm border">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold">Resource Tracking</h4>
                  <p className="text-sm text-gray-600 mt-1">Keep inventory of supplies and assign them where needed.</p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white rounded-xl shadow-sm border">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-yellow-50 flex items-center justify-center text-yellow-600">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold">Fast Response</h4>
                  <p className="text-sm text-gray-600 mt-1">Create requests and coordinate responses in minutes.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Roles */}
        <section className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-red-50 rounded-xl">
            <h4 className="text-lg font-semibold">For Disaster Victims</h4>
            <p className="mt-2 text-sm text-gray-600">Report needs, request resources, and track responses in real time.</p>
            <div className="mt-4">
              <button
                onClick={onRegisterClick}
                className="px-4 py-2 rounded-md bg-red-600 text-white font-medium hover:bg-red-700"
              >
                Register as Victim
              </button>
            </div>
          </div>

          <div className="p-6 bg-white rounded-xl border">
            <h4 className="text-lg font-semibold">For Volunteers</h4>
            <p className="mt-2 text-sm text-gray-600">Sign up, set availability, and respond to nearby requests.</p>
            <div className="mt-4">
              <button
                onClick={onRegisterClick}
                className="px-4 py-2 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700"
              >
                Register as Volunteer
              </button>
            </div>
          </div>
        </section>

        {/* Small CTA */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-600">Questions or need help setting up? <button onClick={onLoginClick} className="text-red-600 underline">Contact us</button></p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t">
        <div className="max-w-7xl mx-auto px-6 py-8 text-sm text-gray-600 flex flex-col md:flex-row md:justify-between gap-4">
          <div>
            <div className="font-semibold text-gray-900">Sahayak</div>
            <div className="mt-1">Connecting communities during disasters.</div>
          </div>
          <div className="flex gap-4">
            <a href="#" className="hover:underline">About</a>
            <a href="#" className="hover:underline">Contact</a>
            <a href="#" className="hover:underline">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
