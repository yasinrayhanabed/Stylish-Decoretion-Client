import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import API from '../../api/axios';
import { toast } from 'react-toastify';
import Spinner from '../../components/Spinner';
import { FaCreditCard, FaMoneyBillWave } from 'react-icons/fa';

export default function PaymentHistory() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPaymentHistory();
  }, []);

  const fetchPaymentHistory = async () => {
    try {
      // Try payments endpoint first, fallback to bookings
      let res;
      try {
        res = await API.get('/payments/my-payments');
      } catch (paymentErr) {
        if (paymentErr.response?.status === 404) {
          // Fallback to bookings endpoint to get payment info
          res = await API.get('/bookings/my');
          // Filter only paid bookings and transform to payment format
          const bookings = Array.isArray(res.data) ? res.data : res.data?.data || [];
          const paidBookings = bookings.filter(b => 
            b.paymentStatus === 'paid' || 
            b.status === 'Completed' || 
            b.status === 'Planning Phase' ||
            b.status === 'Assigned'
          );
          setPayments(paidBookings.map(booking => ({
            _id: booking._id,
            serviceName: booking.serviceName,
            amount: booking.cost || booking.totalAmount || booking.price,
            status: 'completed',
            createdAt: booking.createdAt || booking.date,
            paymentMethod: 'Stripe',
            transactionId: booking.paymentId || booking.transactionId || 'N/A'
          })));
          return;
        } else {
          throw paymentErr;
        }
      }
      
      // Handle payment endpoint response
      if (res.data && res.data.success) {
        setPayments(res.data.data || []);
      } else if (Array.isArray(res.data)) {
        setPayments(res.data);
      } else {
        setPayments([]);
      }
    } catch (err) {
      console.error('Failed to fetch payment history:', err);
      
      if (err.response?.status === 401) {
        toast.error('Please login to view payment history');
      } else if (err.code === 'NETWORK_ERROR' || !err.response) {
        toast.error('Network error. Please check server connection');
      } else {
        toast.error(err.response?.data?.message || 'Failed to load payment history');
      }
      
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      'completed': 'badge-success',
      'pending': 'badge-warning',
      'failed': 'badge-error',
      'refunded': 'badge-info'
    };
    return statusClasses[status?.toLowerCase()] || 'badge-ghost';
  };

  if (loading) return <Spinner />;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-3xl mb-6"><FaCreditCard className="mr-2" /> Payment History</h2>
          
          {payments.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4"><FaMoneyBillWave /></div>
              <p className="text-xl font-semibold">No payment history found</p>
              <p className="text-base-content/70 mt-2">Your payment transactions will appear here</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Service</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Payment Method</th>
                    <th>Transaction ID</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment, index) => (
                    <motion.tr
                      key={payment._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <td>{new Date(payment.createdAt || payment.date).toLocaleDateString()}</td>
                      <td>
                        <div>
                          <div className="font-semibold">{payment.serviceName || payment.description}</div>
                          <div className="text-sm opacity-70">{payment.serviceCategory || 'Service'}</div>
                        </div>
                      </td>
                      <td className="font-bold">
                        {payment.currency?.toUpperCase() || 'BDT'} {payment.amount}
                      </td>
                      <td>
                        <div className={`badge ${getStatusBadge(payment.status)}`}>
                          {payment.status}
                        </div>
                      </td>
                      <td>{payment.paymentMethod || payment.payment_method || 'Stripe'}</td>
                      <td>
                        <div className="font-mono text-sm">
                          {payment.transactionId || payment.stripe_payment_id || 'N/A'}
                        </div>
                        {payment.receipt_url && (
                          <a 
                            href={payment.receipt_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs text-primary hover:underline"
                          >
                            View Receipt
                          </a>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {payments.length > 0 && (
            <div className="mt-6 p-4 bg-base-200 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">
                    {payments.filter(p => p.status === 'completed').length}
                  </div>
                  <div className="text-sm opacity-70">Completed Payments</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-success">
                    BDT {payments
                      .filter(p => p.status === 'completed')
                      .reduce((sum, p) => sum + p.amount, 0)}
                  </div>
                  <div className="text-sm opacity-70">Total Paid</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-warning">
                    {payments.filter(p => p.status === 'pending').length}
                  </div>
                  <div className="text-sm opacity-70">Pending Payments</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}