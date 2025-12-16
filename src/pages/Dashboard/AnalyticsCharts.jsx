import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import Spinner from '../../components/Spinner';
import { toast } from 'react-toastify';
import { FaChartBar, FaChartPie, FaChartLine, FaUsers, FaServicestack, FaSync } from 'react-icons/fa';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement,
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement
);

export default function AnalyticsCharts() {
  const [serviceDemand, setServiceDemand] = useState([]);
  const [bookingsByUser, setBookingsByUser] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchChartsData();
  }, []);

  const handleRefresh = () => {
    fetchChartsData(true);
  };

  // Chart configurations
  const serviceHistogramData = {
    labels: serviceDemand.map(service => service.name),
    datasets: [
      {
        label: 'Number of Bookings',
        data: serviceDemand.map(service => service.bookings),
        backgroundColor: [
          'rgba(147, 51, 234, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(99, 102, 241, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(107, 114, 128, 0.8)',
          'rgba(249, 115, 22, 0.8)',
          'rgba(20, 184, 166, 0.8)'
        ],
        borderColor: [
          'rgba(147, 51, 234, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(99, 102, 241, 1)',
          'rgba(236, 72, 153, 1)',
          'rgba(107, 114, 128, 1)',
          'rgba(249, 115, 22, 1)',
          'rgba(20, 184, 166, 1)'
        ],
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      }
    ]
  };

  const userHistogramData = {
    labels: bookingsByUser.map(user => user.name.length > 15 ? user.name.substring(0, 15) + '...' : user.name),
    datasets: [
      {
        label: 'Bookings per User',
        data: bookingsByUser.map(user => user.bookings),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
        borderRadius: 6,
        borderSkipped: false,
      }
    ]
  };

  const revenueLineData = {
    labels: revenueData.map(data => data.month),
    datasets: [
      {
        label: 'Monthly Revenue (৳)',
        data: revenueData.map(data => data.revenue),
        borderColor: 'rgba(16, 185, 129, 1)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgba(16, 185, 129, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      }
    ]
  };

  const servicePieData = {
    labels: serviceDemand.slice(0, 5).map(service => service.name),
    datasets: [
      {
        data: serviceDemand.slice(0, 5).map(service => service.bookings),
        backgroundColor: [
          'rgba(147, 51, 234, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)'
        ],
        borderColor: [
          'rgba(147, 51, 234, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(239, 68, 68, 1)'
        ],
        borderWidth: 2,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12,
            weight: '500'
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        padding: 12
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
          drawBorder: false
        },
        ticks: {
          font: {
            size: 11
          },
          color: '#6B7280'
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 11
          },
          color: '#6B7280',
          maxRotation: 45
        }
      }
    }
  };

  const lineChartOptions = {
    ...chartOptions,
    elements: {
      line: {
        tension: 0.4
      }
    }
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12,
            weight: '500'
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        padding: 12,
        callbacks: {
          label: function(context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${context.label}: ${context.parsed} (${percentage}%)`;
          }
        }
      }
    }
  };

  const fetchChartsData = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    
    try {
      const [servicesRes, bookingsRes, analyticsRes] = await Promise.all([
        API.get('/services'),
        API.get('/bookings'),
        API.get('/admin/analytics')
      ]);
      
      const services = servicesRes.data?.data || servicesRes.data || [];
      const bookings = bookingsRes.data?.data || bookingsRes.data || [];
      const analytics = analyticsRes.data || {};
      
      // Calculate service demand
      const serviceBookingCount = {};
      bookings.forEach(booking => {
        const serviceName = booking.serviceName || 'Unknown Service';
        serviceBookingCount[serviceName] = (serviceBookingCount[serviceName] || 0) + 1;
      });
      
      const demandData = Object.entries(serviceBookingCount)
        .map(([name, count]) => ({ name, bookings: count }))
        .sort((a, b) => b.bookings - a.bookings)
        .slice(0, 10);
      
      setServiceDemand(demandData);
      
      // Calculate bookings by user (histogram)
      const userBookingCount = {};
      bookings.forEach(booking => {
        const userName = booking.userName || 'Unknown User';
        userBookingCount[userName] = (userBookingCount[userName] || 0) + 1;
      });
      
      const userBookingData = Object.entries(userBookingCount)
        .map(([name, count]) => ({ name, bookings: count }))
        .sort((a, b) => b.bookings - a.bookings)
        .slice(0, 15);
      
      setBookingsByUser(userBookingData);
      
      // Generate revenue trend data (mock data for demonstration)
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
      const revenueByMonth = months.map((month, index) => ({
        month,
        revenue: Math.round((analytics.totalRevenue || 50000) * (0.1 + Math.random() * 0.2))
      }));
      
      setRevenueData(revenueByMonth);
      
    } catch (err) {
      console.error('Failed to fetch charts data:', err);
      if (err.response?.status === 403) {
        toast.error('Access denied. Admin role required.');
      } else {
        toast.error('Failed to load charts data');
      }
    } finally {
      setLoading(false);
      if (isRefresh) setRefreshing(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2 flex items-center">
              <FaChartBar className="mr-3" />
              Analytics Charts
            </h1>
            <p className="text-indigo-100 text-lg">Dynamic visual analytics for service demand and user engagement</p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="btn btn-outline btn-sm text-white border-white hover:bg-white hover:text-indigo-600 transition-all"
            >
              <FaSync className={`mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh Data'}
            </button>
            <div className="hidden md:block">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <FaChartLine className="text-3xl" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Service Demand Histogram */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <FaServicestack className="mr-3 text-purple-600" />
            Service Demand Chart (Histogram)
          </h3>
          <p className="text-gray-600 mb-6">Number of services booked by users - Dynamic Histogram</p>
          
          <div className="h-80">
            {serviceDemand.length > 0 ? (
              <Bar data={serviceHistogramData} options={chartOptions} />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <FaServicestack className="mx-auto text-6xl mb-4 opacity-30" />
                  <h4 className="text-lg font-medium mb-2">No Service Data Available</h4>
                  <p>Service demand histogram will appear here once bookings are made</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* User Booking Histogram */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <FaUsers className="mr-3 text-blue-600" />
            User Booking Histogram
          </h3>
          <p className="text-gray-600 mb-6">Customer engagement levels by booking frequency - Dynamic Chart</p>
          
          <div className="h-80">
            {bookingsByUser.length > 0 ? (
              <Bar data={userHistogramData} options={chartOptions} />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <FaUsers className="mx-auto text-6xl mb-4 opacity-30" />
                  <h4 className="text-lg font-medium mb-2">No User Data Available</h4>
                  <p>User booking histogram will appear here once users make bookings</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Additional Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Revenue Trend Line Chart */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <FaChartLine className="mr-3 text-green-600" />
            Revenue Trend Analysis
          </h3>
          <p className="text-gray-600 mb-6">Monthly revenue growth pattern - Dynamic Line Chart</p>
          
          <div className="h-80">
            {revenueData.length > 0 ? (
              <Line data={revenueLineData} options={lineChartOptions} />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <FaChartLine className="mx-auto text-6xl mb-4 opacity-30" />
                  <h4 className="text-lg font-medium mb-2">No Revenue Data Available</h4>
                  <p>Revenue trend will appear here once data is available</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Service Distribution Pie Chart */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <FaChartPie className="mr-3 text-pink-600" />
            Service Distribution
          </h3>
          <p className="text-gray-600 mb-6">Top 5 services market share - Dynamic Pie Chart</p>
          
          <div className="h-80">
            {serviceDemand.length > 0 ? (
              <Pie data={servicePieData} options={pieChartOptions} />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <FaChartPie className="mx-auto text-6xl mb-4 opacity-30" />
                  <h4 className="text-lg font-medium mb-2">No Distribution Data Available</h4>
                  <p>Service distribution will appear here once bookings are made</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
          <FaChartPie className="mr-3 text-green-600" />
          Chart Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
            <div className="text-2xl font-bold text-purple-600 mb-2">
              {serviceDemand.length}
            </div>
            <div className="text-sm text-purple-500 font-medium">Active Services</div>
            <div className="text-xs text-purple-400 mt-1">With Bookings</div>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
            <div className="text-2xl font-bold text-blue-600 mb-2">
              {bookingsByUser.length}
            </div>
            <div className="text-sm text-blue-500 font-medium">Active Users</div>
            <div className="text-xs text-blue-400 mt-1">With Bookings</div>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
            <div className="text-2xl font-bold text-green-600 mb-2">
              {serviceDemand.length > 0 ? serviceDemand[0]?.bookings || 0 : 0}
            </div>
            <div className="text-sm text-green-500 font-medium">Peak Demand</div>
            <div className="text-xs text-green-400 mt-1">Highest Service Bookings</div>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl">
            <div className="text-2xl font-bold text-orange-600 mb-2">
              {bookingsByUser.length > 0 ? bookingsByUser[0]?.bookings || 0 : 0}
            </div>
            <div className="text-sm text-orange-500 font-medium">Top User Activity</div>
            <div className="text-xs text-orange-400 mt-1">Most Active Customer</div>
          </div>
        </div>
      </div>

      {/* Chart Legend */}
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Chart Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">Service Demand Chart</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Shows the most popular services based on booking frequency</li>
              <li>• Helps identify which services are in highest demand</li>
              <li>• Useful for inventory and resource planning</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">User Booking Histogram</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Displays user engagement levels by booking frequency</li>
              <li>• Identifies most active customers</li>
              <li>• Helps with customer retention strategies</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}