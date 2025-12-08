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
    API.get('/decorators').then(r => setDecorators(r.data || [])).catch(() => setDecorators([]));
    API.get('/bookings').then(r => setBookings(r.data || [])).catch(() => setBookings([]));
  }, []);

  if (!services) return <Spinner />;

  return (
    <div>
      <h2 className="text-2xl mb-4">Admin Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-base-200 rounded shadow">Services: {services.length}</div>
        <div className="p-4 bg-base-200 rounded shadow">Decorators: {decorators?.length || 0}</div>
        <div className="p-4 bg-base-200 rounded shadow">Bookings: {bookings?.length || 0}</div>
      </div>

      <section className="mt-6">
        <h3 className="text-xl mb-2">Manage Services</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {services.map(s => (
            <div key={s._id} className="p-3 bg-base-200 rounded shadow">
              <div className="font-semibold">{s.service_name}</div>
              <div className="text-sm">BDT {s.cost}</div>
            </div>
          ))}
        </div>
        <Link to="/dashboard/admin/add-service" className="btn btn-primary mt-4 mb-4">Add Service</Link>
      </section>
    </div>
  );
}
