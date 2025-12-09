import React, { useEffect, useState } from 'react';
import API from '../../api/axios';
import Spinner from '../../components/Spinner';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom'; // Added useNavigate

export default function UserDashboard() {
 const [bookings, setBookings] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const navigate = useNavigate();

 useEffect(() => {
    if (!user.id) {
        setLoading(false);
        setBookings([]);
        return;
    }
    // Note: /bookings/my/:userId এই রুটটি ব্যবহার না করে /bookings/my ব্যবহার করা ভালো
    // কারণ রিকোয়ারমেন্ট অনুযায়ী টোকেন থেকে userId নেওয়াই নিরাপদ।
 API.get(`/bookings/my/:userId`)
        .then(r => {
            setBookings(r.data || []);
            setLoading(false);
        })
        .catch((err) => {
            console.error("Error fetching bookings:", err);
            setBookings([]);
            setLoading(false);
        });
 }, [user.id]);

 const cancelBooking = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
 try {
await API.delete(`/bookings/${id}`);
 toast.success('Booking cancelled successfully!');
setBookings(prev => prev.filter(b => b._id !== id));
 } catch(err) {
 toast.error('Cancellation failed. Only pending bookings can be cancelled.');
      console.error(err);
 }
 };

  // Example: Estimate Amount (since actual amount is missing in current data structure)
  const calculateAmount = (booking) => {
    // Ideally, the booking object should contain the cost.
    // Assuming a placeholder cost of 5000 BDT for pending bookings without cost.
    return booking.cost || 5000; 
  }

 if (loading || !bookings) return <Spinner />;

 return (
 <div className="p-4">
<h2 className="text-3xl font-bold mb-6 text-primary">
  My Bookings & Services
</h2>
 <div className="space-y-4">
 {bookings.length === 0 ? (
            <div className="text-center p-6 bg-blue-50 rounded-lg text-gray-600">
                You have no active bookings.
            </div>
        ) : (
            bookings.map(b => (
 <div key={b._id} className="p-4 bg-white rounded-xl shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center">
<div>
 <div className="font-bold text-xl text-violet-600">{b.service_name || 'Unknown Service'}</div>
<div className="text-sm text-gray-500 mt-1">Date: {new Date(b.date).toLocaleDateString()} | Location: {b.location}</div>
 <div className="text-md font-semibold mt-2">
                      Status: 
                      <span className={`ml-2 badge ${b.status === 'Completed' ? 'badge-success' : b.status === 'Cancelled' ? 'badge-error' : 'badge-warning'}`}>
                          {b.status || 'Assigned'}
                      </span>
                  </div>
 </div>
 <div className="flex flex-col gap-2 mt-4 md:mt-0 items-end">
                      {b.paymentStatus === 'pending' ? (
                          <>
                              <div className="text-lg font-bold text-red-600">BDT {calculateAmount(b)} (Pending)</div>
                              {/* Assuming we pass bookingId and amount to Payment Page */}
                              <Link 
                                  to={`/payment/${b._id}?amount=${calculateAmount(b)}&name=${b.service_name}`}
                                  className="btn btn-sm btn-success text-white"
                              >
                                  Pay Now
                              </Link>
                          </>
                      ) : (
                          <div className="text-lg font-bold text-green-600">Paid (BDT {calculateAmount(b)})</div>
                      )}
 <button 
                    className="btn btn-sm btn-outline btn-error" 
                    onClick={() => cancelBooking(b._id)} 
                    disabled={b.paymentStatus !== 'pending'} // Only allow cancellation if payment is pending
                  >
                    Cancel Booking
                  </button>
 </div>
 </div>
))
        )}
 </div>
 </div>
 );
}