import React, { useEffect, useState } from 'react';
import API from '../../api/axios';
import Spinner from '../../components/Spinner';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const [services, setServices] = useState(null);
  const [decorators, setDecorators] = useState(null);
  const [bookings, setBookings] = useState(null);

  useEffect(() => {
    API.get('/services').then(r => setServices(r.data || [])).catch(() => setServices([]));
    // Note: The API routes below need to be secured with adminMiddleware on the backend.
    API.get('/admin/decorators').then(r => setDecorators(r.data || [])).catch(() => setDecorators([]));
    API.get('/admin/bookings').then(r => setBookings(r.data || [])).catch(() => setBookings([]));
  }, []);

  if (!services) return <Spinner />;

  return (
    <div className="flex h-full min-h-screen">
      
      {/* 👈 বাম দিকের সাইডবার (নতুন মেনু লিঙ্ক সহ) */}
      <aside className="w-64 bg-base-200 p-4 shadow-lg flex-shrink-0">
        <h2 className="text-xl font-bold mb-6 text-blue-400">Admin Panel</h2>
        <ul className="menu bg-base-200 rounded-box w-full">
            
            {/* 🔗 বিদ্যমান এবং নতুন লিঙ্কগুলি */}
            <li><Link to="/dashboard/admin">Dashboard Home</Link></li>
            <li><Link to="/dashboard/admin/manage-users">Manage Users</Link></li>
            <li><Link to="/dashboard/admin/manage-services">Manage Services</Link></li>

            {/* 🆕 নতুন যোগ করা লিঙ্কগুলি */}
            <li className="menu-title">Management</li>
            <li><Link to="/dashboard/admin/manage-decorators">Manage Decorators</Link></li>
            <li><Link to="/dashboard/admin/manage-bookings">Manage Bookings</Link></li>
            <li className="menu-title">Analytics</li>
            <li><Link to="/dashboard/admin/analytics">Analytics & Revenue</Link></li>
        </ul>
      </aside>

      {/* ➡️ ডান দিকের প্রধান কন্টেন্ট এরিয়া */}
      <main className="flex-grow p-8 bg-white overflow-y-auto">
        <h1 className="text-3xl font-bold text-blue-400 mb-6">Admin Overview</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-blue-100 text-blue-800 rounded-lg shadow-md">
            <div className="font-semibold text-lg">Total Services</div>
            <div className="text-3xl font-bold">{services.length}</div>
          </div>
          <div className="p-6 bg-green-100 text-green-800 rounded-lg shadow-md">
            <div className="font-semibold text-lg">Total Decorators</div>
            <div className="text-3xl font-bold">{decorators?.length || 0}</div>
          </div>
          <div className="p-6 bg-yellow-100 text-yellow-800 rounded-lg shadow-md">
            <div className="font-semibold text-lg">Total Bookings</div>
            <div className="text-3xl font-bold">{bookings?.length || 0}</div>
          </div>
        </div>

        <section className="mt-8">
          <h3 className="text-2xl font-bold mb-4">Latest Services</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {services.slice(0, 4).map(s => (
              <div key={s._id} className="p-4 bg-gray-50 rounded-lg shadow border border-gray-200">
                <div className="font-semibold text-lg">{s.service_name}</div>
                <div className="text-sm text-gray-600">Category: {s.category}</div>
                <div className="text-md font-medium">BDT {s.cost}</div>
              </div>
            ))}
          </div>
          <Link to="/dashboard/admin/manage-services" className="btn btn-primary mt-6">View All Services</Link>
        </section>
      </main>
    </div>
  );
}