import React, { useEffect, useState } from 'react';
import API from '../../api/axios';
import Spinner from '../../components/Spinner';

export default function DecoratorDashboard() {
  const [services, setServices] = useState(null);
  const [bookings, setBookings] = useState(null);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    API.get('/services').then(r => setServices(r.data || [])).catch(() => setServices([]));
    API.get(`/bookings/my/${user.id}`).then(r => setBookings(r.data || [])).catch(() => setBookings([]));
  }, [user.id]);

  if (!services) return <Spinner />;

  return (
    <div>
      <h2 className="text-2xl mb-4">Decorator Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-white rounded shadow">Services: {services.length}</div>
        <div className="p-4 bg-white rounded shadow">My Bookings: {bookings?.length || 0}</div>
      </div>

      <section className="mt-6">
        <h3 className="text-xl mb-2">My Assigned Services</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {services.map(s => (
            <div key={s._id} className="p-3 bg-white rounded shadow">
              <div className="font-semibold">{s.service_name}</div>
              <div className="text-sm">BDT {s.cost}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6">
        <h3 className="text-xl mb-2">My Bookings</h3>
        <div className="grid md:grid-cols-1 gap-4">
          {bookings?.map(b => (
            <div key={b._id} className="p-3 bg-white rounded shadow">
              <div className="font-semibold">Service: {b.service_name}</div>
              <div className="text-sm">Customer: {b.userName}</div>
              <div className="text-sm">Date: {new Date(b.date).toLocaleDateString()}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
