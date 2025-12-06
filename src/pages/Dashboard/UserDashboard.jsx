import React, { useEffect, useState } from 'react';
import API from '../../api/axios';
import Spinner from '../../components/Spinner';
import { toast } from 'react-toastify';

export default function UserDashboard(){
  const [bookings, setBookings] = useState(null);
  useEffect(()=> {
    API.get('/bookings/my').then(r => setBookings(r.data)).catch(()=> setBookings([]));
  }, []);

  const cancelBooking = async (id) => {
    try {
      await API.delete(`/bookings/${id}`);
      toast.success('Cancelled');
      setBookings(bookings.filter(b => b._id !== id));
    } catch(err){ toast.error('Cancel failed'); }
  };

  if(bookings === null) return <Spinner/>;

  return (
    <div>
      <h2 className="text-2xl mb-4">My Bookings</h2>
      <div className="space-y-4">
        {bookings.map(b => (
          <div key={b._id} className="p-4 bg-white rounded shadow flex justify-between items-center">
            <div>
              <div className="font-semibold">{b.service.service_name}</div>
              <div className="text-sm">{new Date(b.date).toLocaleDateString()} • {b.timeSlot} • {b.mode}</div>
              <div className="text-sm">Status: {b.status}</div>
            </div>
            <div className="flex flex-col gap-2">
              {b.paymentStatus === 'pending' ? <div className="text-sm">BDT {b.amount}</div> : <div className="text-sm">Paid</div>}
              <button className="btn btn-sm btn-error" onClick={()=>cancelBooking(b._id)}>Cancel</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
