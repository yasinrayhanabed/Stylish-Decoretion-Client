import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import API from '../../api/axios';
import { toast } from 'react-toastify';
import Spinner from '../../components/Spinner';
import { FaCreditCard, FaMoneyBillWave } from 'react-icons/fa';
import { formatAmountDisplay, formatAmountFull } from '../../utils/formatCurrency';

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
          // Transform all bookings to payment format (both paid and pending)
          const bookings = Array.isArray(res.data) ? res.data : res.data?.data || [];
          const allBookings = bookings.map(booking => {
            let paymentStatus = 'pending';
            
            // Determine payment status based on booking status and payment info
            if (booking.paymentStatus === 'paid' || 
                booking.paymentStatus === 'completed' ||
                booking.isPaid === true ||
                booking.status === 'Completed' || 
                booking.status === 'Planning Phase' ||
                booking.status === 'Assigned') {
              paymentStatus = 'completed';
            } else if (booking.paymentStatus === 'failed' || booking.status === 'Cancelled') {
              paymentStatus = 'failed';
            } else if (booking.status === 'Pending' || 
                      booking.paymentStatus === 'pending' ||
                      !booking.isPaid) {
              paymentStatus = 'pending';
            }
            
            return {
              _id: booking._id,
              serviceName: booking.serviceName,
              amount: parseFloat(booking.cost || booking.totalAmount || booking.price || 0),
              status: paymentStatus,
              createdAt: booking.createdAt || booking.date,
              paymentMethod: booking.paymentMethod || 'Stripe',
              transactionId: booking.paymentId || booking.transactionId || 'N/A',
              currency: 'BDT'
            };
          });
          
          setPayments(allBookings);
          return;
        } else {
          throw paymentErr;
        }
      }
      
      // Handle payment endpoint response
      if (res.data && res.data.success) {
        const paymentsData = res.data.data || [];
        // Ensure amount is properly parsed as number
        const formattedPayments = paymentsData.map(payment => ({
          ...payment,
          amount: parseFloat(payment.amount || 0)
        }));
        setPayments(formattedPayments);
      } else if (Array.isArray(res.data)) {
        const formattedPayments = res.data.map(payment => ({
          ...payment,
          amount: parseFloat(payment.amount || 0)
        }));
        setPayments(formattedPayments);
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



  // Get all payments including pending ones from bookings
  const getAllPayments = () => {
    // This should include both completed and pending payments
    return payments;
  };

  const completedPayments = payments.filter(p => p.status === 'completed');
  const pendingPayments = payments.filter(p => p.status === 'pending');
  const totalPaid = completedPayments.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
  const totalPending = pendingPayments.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);

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
              <div className="text-6xl flex items-center justify-center mb-4"><FaMoneyBillWave /></div>
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
                      <td>{new Date(payment.createdAt || payment.date).toLocaleDateString('en-GB')}</td>
                      <td>
                        <div>
                          <div className="font-semibold">{payment.serviceName || payment.description}</div>
                          <div className="text-sm opacity-70">{payment.serviceCategory || 'Service'}</div>
                        </div>
                      </td>
                      <td className="font-bold" title={formatAmountFull(payment.amount)}>
                        {formatAmountDisplay(payment.amount)}
                      </td>
                      <td>
                        <div className={`badge ${getStatusBadge(payment.status)}`}>
                          {payment.status === 'completed' ? 'Paid' : 
                           payment.status === 'pending' ? 'Pending' :
                           payment.status === 'failed' ? 'Failed' :
                           payment.status}
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
            <div className="mt-6 space-y-4">
              {/* Payment Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="stat bg-primary text-primary-content rounded-lg p-4">
                  <div className="stat-value text-2xl">{completedPayments.length}</div>
                  <div className="stat-title text-primary-content opacity-80">Completed</div>
                  <div className="stat-desc text-primary-content opacity-60">Successful payments</div>
                </div>
                
                <div className="stat bg-success text-success-content rounded-lg p-4">
                  <div className="stat-value text-xl" title={formatAmountFull(totalPaid)}>
                    {formatAmountDisplay(totalPaid)}
                  </div>
                  <div className="stat-title text-success-content opacity-80">Total Paid</div>
                  <div className="stat-desc text-success-content opacity-60">Amount received</div>
                </div>
                
                <div className="stat bg-warning text-warning-content rounded-lg p-4">
                  <div className="stat-value text-2xl">{pendingPayments.length}</div>
                  <div className="stat-title text-warning-content opacity-80">Pending</div>
                  <div className="stat-desc text-warning-content opacity-60">Awaiting payment</div>
                </div>
                
                <div className="stat bg-orange-500 text-white rounded-lg p-4">
                  <div className="stat-value text-xl" title={formatAmountFull(totalPending)}>
                    {formatAmountDisplay(totalPending)}
                  </div>
                  <div className="stat-title text-white opacity-80">Total Pending</div>
                  <div className="stat-desc text-white opacity-60">Amount due</div>
                </div>
              </div>
              
              {/* Additional Summary Info */}
              <div className="bg-base-200 rounded-lg p-4">
                <div className="flex flex-wrap justify-between items-center text-sm">
                  <span>Total Transactions: <strong>{payments.length}</strong></span>
                  <span>Success Rate: <strong>{payments.length > 0 ? ((completedPayments.length / payments.length) * 100).toFixed(1) : 0}%</strong></span>
                  <span>Total Amount: <strong title={formatAmountFull(totalPaid + totalPending)}>{formatAmountDisplay(totalPaid + totalPending)}</strong></span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}