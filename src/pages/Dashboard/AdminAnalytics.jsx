import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import Spinner from '../../components/Spinner';
import { toast } from 'react-toastify';
import { FaChartBar, FaDollarSign, FaUsers, FaClipboardList, FaUserTie, FaChartLine, FaCalendarAlt, FaCheckCircle, FaChartPie } from 'react-icons/fa';

export default function AdminAnalytics() {
  const [analytics, setAnalytics] = useState({
    totalRevenue: 0,
    totalBookings: 0,
    completedBookings: 0,
    activeDecorators: 0
  });
  const [serviceDemand, setServiceDemand] = useState([]);
  const [bookingsByUser, setBookingsByUser] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const [analyticsRes, servicesRes, bookingsRes] = await Promise.all([
        API.get('/admin/analytics'),
        API.get('/services'),
        API.get('/bookings')
      ]);
      
      setAnalytics(analyticsRes.data);
      
      // Process service demand data
      const services = servicesRes.data?.data || servicesRes.data || [];
      const bookings = bookingsRes.data?.data || bookingsRes.data || [];
      
      // Calculate service demand
      const serviceBookingCount = {};
      bookings.forEach(booking => {
        const serviceName = booking.serviceName || 'Unknown Service';
        serviceBookingCount[serviceName] = (serviceBookingCount[serviceName] || 0) + 1;
      });
      
      const demandData = Object.entries(serviceBookingCount)
        .map(([name, count]) => ({ name, bookings: count }))
        .sort((a, b) => b.bookings - a.bookings)
        .slice(0, 8);
      
      setServiceDemand(demandData);
      
      // Calculate bookings by user
      const userBookingCount = {};
      bookings.forEach(booking => {
        const userName = booking.userName || 'Unknown User';
        userBookingCount[userName] = (userBookingCount[userName] || 0) + 1;
      });
      
      const userBookingData = Object.entries(userBookingCount)
        .map(([name, count]) => ({ name, bookings: count }))
        .sort((a, b) => b.bookings - a.bookings)
        .slice(0, 10);
      
      setBookingsByUser(userBookingData);
      
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
      if (err.response?.status === 403) {
        toast.error('Access denied. Admin role required.');
      } else {
        toast.error('Failed to load analytics data');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2 flex items-center">
              <FaChartBar className="mr-3" />
              Business Analytics
            </h1>
            <p className="text-purple-100 text-lg">Business insights and financial overview</p>
          </div>
          <div className="hidden md:block">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <FaChartLine className="text-3xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-green-500 hover:shadow-xl transition-all">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-green-600 mb-1">Total Revenue</div>
              <div className="text-3xl font-bold text-green-800">৳{analytics.totalRevenue.toLocaleString()}</div>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <FaDollarSign className="text-2xl text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <FaChartLine className="mr-2" />
            Total Income
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-blue-500 hover:shadow-xl transition-all">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-blue-600 mb-1">Total Bookings</div>
              <div className="text-3xl font-bold text-blue-800">{analytics.totalBookings}</div>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <FaClipboardList className="text-2xl text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-blue-600">
            <FaCalendarAlt className="mr-2" />
            All Bookings
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-purple-500 hover:shadow-xl transition-all">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-purple-600 mb-1">Completed Orders</div>
              <div className="text-3xl font-bold text-purple-800">{analytics.completedBookings}</div>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <FaCheckCircle className="text-2xl text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-purple-600">
            <FaCheckCircle className="mr-2" />
            Successfully Completed
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-orange-500 hover:shadow-xl transition-all">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-orange-600 mb-1">Active Decorators</div>
              <div className="text-3xl font-bold text-orange-800">{analytics.activeDecorators}</div>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <FaUserTie className="text-2xl text-orange-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-orange-600">
            <FaUsers className="mr-2" />
            Professional Decorators
          </div>
        </div>
      </div>

      {/* Additional Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <FaChartBar className="mr-3 text-blue-600" />
            Performance Metrics
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-green-100 rounded-lg">
              <span className="font-medium text-gray-700">Completion Rate</span>
              <span className="text-lg font-bold text-green-600">
                {analytics.totalBookings > 0 ? Math.round((analytics.completedBookings / analytics.totalBookings) * 100) : 0}%
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-100 rounded-lg">
              <span className="font-medium text-gray-700">Average Revenue per Booking</span>
              <span className="text-lg font-bold text-blue-600">
                ৳{analytics.totalBookings > 0 ? Math.round(analytics.totalRevenue / analytics.totalBookings) : 0}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-purple-100 rounded-lg">
              <span className="font-medium text-gray-700">Revenue per Decorator</span>
              <span className="text-lg font-bold text-purple-600">
                ৳{analytics.activeDecorators > 0 ? Math.round(analytics.totalRevenue / analytics.activeDecorators) : 0}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <FaDollarSign className="mr-3 text-green-600" />
            Revenue Breakdown
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-green-100 rounded-lg">
              <span className="font-medium text-gray-700">Total Revenue</span>
              <span className="text-lg font-bold text-green-600">৳{analytics.totalRevenue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-100 rounded-lg">
              <span className="font-medium text-gray-700">Platform Fee (5%)</span>
              <span className="text-lg font-bold text-blue-600">৳{Math.round(analytics.totalRevenue * 0.05).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-purple-100 rounded-lg">
              <span className="font-medium text-gray-700">Decorator Earnings (95%)</span>
              <span className="text-lg font-bold text-purple-600">৳{Math.round(analytics.totalRevenue * 0.95).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Service Demand Chart */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <FaChartPie className="mr-3 text-purple-600" />
            Service Demand Chart
          </h3>
          <div className="space-y-3">
            {serviceDemand.length > 0 ? serviceDemand.map((service, index) => {
              const maxBookings = Math.max(...serviceDemand.map(s => s.bookings));
              const percentage = (service.bookings / maxBookings) * 100;
              const colors = ['bg-purple-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500', 'bg-indigo-500', 'bg-pink-500', 'bg-gray-500'];
              
              return (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700 truncate">{service.name}</span>
                    <span className="text-sm font-bold text-gray-900">{service.bookings} bookings</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full ${colors[index % colors.length]} transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            }) : (
              <div className="text-center py-8 text-gray-500">
                <FaChartPie className="mx-auto text-4xl mb-2 opacity-50" />
                <p>No service data available</p>
              </div>
            )}
          </div>
        </div>

        {/* User Booking Histogram */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <FaChartLine className="mr-3 text-blue-600" />
            User Booking Histogram
          </h3>
          <div className="space-y-3">
            {bookingsByUser.length > 0 ? bookingsByUser.map((user, index) => {
              const maxBookings = Math.max(...bookingsByUser.map(u => u.bookings));
              const percentage = (user.bookings / maxBookings) * 100;
              const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-yellow-500', 'bg-red-500', 'bg-indigo-500', 'bg-pink-500', 'bg-gray-500', 'bg-orange-500', 'bg-teal-500'];
              
              return (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700 truncate">{user.name}</span>
                    <span className="text-sm font-bold text-gray-900">{user.bookings} bookings</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full ${colors[index % colors.length]} transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            }) : (
              <div className="text-center py-8 text-gray-500">
                <FaChartLine className="mx-auto text-4xl mb-2 opacity-50" />
                <p>No user booking data available</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
          <FaChartLine className="mr-3 text-indigo-600" />
          Business Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
            <div className="text-2xl font-bold text-purple-600 mb-2">
              {serviceDemand.length > 0 ? serviceDemand[0]?.name : 'N/A'}
            </div>
            <div className="text-sm text-purple-500 font-medium">Most Popular Service</div>
            <div className="text-xs text-purple-400 mt-1">
              {serviceDemand.length > 0 ? `${serviceDemand[0]?.bookings} bookings` : 'No data'}
            </div>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
            <div className="text-2xl font-bold text-blue-600 mb-2">
              {bookingsByUser.length > 0 ? bookingsByUser[0]?.name : 'N/A'}
            </div>
            <div className="text-sm text-blue-500 font-medium">Top Customer</div>
            <div className="text-xs text-blue-400 mt-1">
              {bookingsByUser.length > 0 ? `${bookingsByUser[0]?.bookings} bookings` : 'No data'}
            </div>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
            <div className="text-2xl font-bold text-green-600 mb-2">
              {analytics.totalBookings > 0 ? Math.round((analytics.completedBookings / analytics.totalBookings) * 100) : 0}%
            </div>
            <div className="text-sm text-green-500 font-medium">Success Rate</div>
            <div className="text-xs text-green-400 mt-1">
              {analytics.completedBookings} of {analytics.totalBookings} completed
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}