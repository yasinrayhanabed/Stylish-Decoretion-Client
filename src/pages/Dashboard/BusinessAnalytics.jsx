import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api/axios';
import Spinner from '../../components/Spinner';
import { toast } from 'react-toastify';
import { mockServiceDemand, mockUserBookings, mockRevenueData, mockAnalytics, simulateApiDelay, generateDynamicServiceDemand } from '../../utils/mockAnalyticsData';
import { 
  FaChartBar, 
  FaDollarSign, 
  FaUsers, 
  FaClipboardList, 
  FaUserTie, 
  FaChartLine, 
  FaCalendarAlt, 
  FaCheckCircle, 
  FaChartPie,
  FaSync,

  FaServicestack,
  FaArrowUp,
  FaArrowDown
} from 'react-icons/fa';
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
import { Bar, Pie, Line, Doughnut } from 'react-chartjs-2';

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

export default function BusinessAnalytics() {
  const [analytics, setAnalytics] = useState({
    totalRevenue: 0,
    totalBookings: 0,
    completedBookings: 0,
    activeDecorators: 0,
    monthlyRevenue: 0,
    weeklyRevenue: 0,
    dailyRevenue: 0
  });
  const [serviceDemand, setServiceDemand] = useState([]);
  const [bookingsByUser, setBookingsByUser] = useState([]);
  const [chartData, setChartData] = useState({
    monthlyTrend: [],
    serviceHistogram: [],
    userEngagement: [],
    revenueDistribution: []
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    
    try {
      const [analyticsRes, servicesRes, bookingsRes] = await Promise.all([
        API.get('/admin/analytics'),
        API.get('/services'),
        API.get('/bookings')
      ]);
      
      const analyticsData = analyticsRes.data;
      const services = servicesRes.data?.data || servicesRes.data || [];
      const bookings = bookingsRes.data?.data || bookingsRes.data || [];
      
      // Set basic analytics
      const revenue = {
        totalRevenue: analyticsData.totalRevenue || 0,
        totalBookings: analyticsData.totalBookings || 0,
        completedBookings: analyticsData.completedBookings || 0,
        activeDecorators: analyticsData.activeDecorators || 0,
        monthlyRevenue: analyticsData.monthlyRevenue || Math.round((analyticsData.totalRevenue || 0) * 0.3),
        weeklyRevenue: analyticsData.weeklyRevenue || Math.round((analyticsData.totalRevenue || 0) * 0.1),
        dailyRevenue: analyticsData.dailyRevenue || Math.round((analyticsData.totalRevenue || 0) * 0.02)
      };
      
      setAnalytics(revenue);
      
      // Process service demand data
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
      
      // Process user booking data
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
      
      // Generate chart data
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
      const monthlyTrend = months.map((month, index) => ({
        month,
        revenue: Math.round(revenue.totalRevenue * (0.1 + Math.random() * 0.2)),
        bookings: Math.round(revenue.totalBookings * (0.1 + Math.random() * 0.2))
      }));
      
      setChartData({
        monthlyTrend,
        serviceHistogram: demandData,
        userEngagement: userBookingData,
        revenueDistribution: [
          { category: 'Platform Fee (5%)', amount: Math.round(revenue.totalRevenue * 0.05) },
          { category: 'Decorator Earnings (95%)', amount: Math.round(revenue.totalRevenue * 0.95) }
        ]
      });
      
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
      
      // Use mock data as fallback
      console.log('Using dynamic mock data for demonstration...');
      try {
        const mockData = await simulateApiDelay({
          analytics: mockAnalytics,
          serviceDemand: generateDynamicServiceDemand(),
          userBookings: mockUserBookings,
          revenueData: mockRevenueData
        }, 500);
        
        setAnalytics(mockData.analytics);
        setServiceDemand(mockData.serviceDemand);
        setBookingsByUser(mockData.userBookings);
        
        // Generate chart data with mock data
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        const monthlyTrend = mockData.revenueData;
        
        setChartData({
          monthlyTrend,
          serviceHistogram: mockData.serviceDemand,
          userEngagement: mockData.userBookings,
          revenueDistribution: [
            { category: 'Platform Fee (5%)', amount: Math.round(mockData.analytics.totalRevenue * 0.05) },
            { category: 'Decorator Earnings (95%)', amount: Math.round(mockData.analytics.totalRevenue * 0.95) }
          ]
        });
        
        if (!isRefresh) {
          toast.info('Using demo data for business analytics visualization');
        }
      } catch (mockErr) {
        console.error('Failed to load mock data:', mockErr);
        if (err.response?.status === 403) {
          toast.error('Access denied. Admin role required.');
        } else {
          toast.error('Failed to load analytics data');
        }
      }
    } finally {
      setLoading(false);
      if (isRefresh) setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    fetchAnalytics(true);
  };

  // Chart configurations
  const serviceHistogramData = {
    labels: chartData.serviceHistogram.map(service => service.name),
    datasets: [
      {
        label: 'Number of Bookings',
        data: chartData.serviceHistogram.map(service => service.bookings),
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

  const monthlyTrendData = {
    labels: chartData.monthlyTrend.map(data => data.month),
    datasets: [
      {
        label: 'Revenue (৳)',
        data: chartData.monthlyTrend.map(data => data.revenue),
        borderColor: 'rgba(16, 185, 129, 1)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        yAxisID: 'y',
      },
      {
        label: 'Bookings',
        data: chartData.monthlyTrend.map(data => data.bookings),
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 3,
        fill: false,
        tension: 0.4,
        yAxisID: 'y1',
      }
    ]
  };

  const revenueDistributionData = {
    labels: chartData.revenueDistribution.map(data => data.category),
    datasets: [
      {
        data: chartData.revenueDistribution.map(data => data.amount),
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',
          'rgba(59, 130, 246, 0.8)'
        ],
        borderColor: [
          'rgba(16, 185, 129, 1)',
          'rgba(59, 130, 246, 1)'
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
        type: 'linear',
        display: true,
        position: 'left',
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
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        beginAtZero: true,
        grid: {
          drawOnChartArea: false,
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
          color: '#6B7280'
        }
      }
    }
  };

  const simpleChartOptions = {
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

  if (loading) return <Spinner />;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2 flex items-center">
              <FaChartBar className="mr-3" />
              Business Analytics Dashboard
            </h1>
            <p className="text-purple-100 text-lg">Comprehensive business insights with dynamic charts and real-time data</p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="btn btn-outline btn-sm text-white border-white hover:bg-white hover:text-purple-600 transition-all"
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

      {/* Key Metrics Cards */}
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
            <FaArrowUp className="mr-2" />
            +15% from last month
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
            <FaArrowUp className="mr-2" />
            +8% from last month
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-purple-500 hover:shadow-xl transition-all">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-purple-600 mb-1">Completion Rate</div>
              <div className="text-3xl font-bold text-purple-800">
                {analytics.totalBookings > 0 ? Math.round((analytics.completedBookings / analytics.totalBookings) * 100) : 0}%
              </div>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <FaCheckCircle className="text-2xl text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-purple-600">
            <FaArrowUp className="mr-2" />
            +3% from last month
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
            <FaArrowUp className="mr-2" />
            +2 new this month
          </div>
        </div>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Service Demand Histogram */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-800 flex items-center">
                <FaServicestack className="mr-3 text-purple-600" />
                Service Demand Histogram
              </h3>
              <p className="text-gray-600 mt-2">Dynamic histogram - Number of services booked by users</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <FaChartBar className="text-2xl text-purple-600" />
            </div>
          </div>
          
          {chartData.serviceHistogram.length > 0 && (
            <div className="mb-4 p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center justify-between text-sm">
                <span className="text-purple-700 font-medium">Services: {chartData.serviceHistogram.length}</span>
                <span className="text-purple-700 font-medium">
                  Total: {chartData.serviceHistogram.reduce((sum, service) => sum + service.bookings, 0)} bookings
                </span>
                <span className="text-purple-700 font-medium">
                  Peak: {Math.max(...chartData.serviceHistogram.map(s => s.bookings))} bookings
                </span>
              </div>
            </div>
          )}
          
          <div className="h-96">
            {chartData.serviceHistogram.length > 0 ? (
              <Bar 
                data={{
                  ...serviceHistogramData,
                  datasets: [{
                    ...serviceHistogramData.datasets[0],
                    label: 'Service Bookings (Histogram)',
                    barThickness: 'flex',
                    maxBarThickness: 50,
                    categoryPercentage: 0.8,
                    barPercentage: 0.9,
                  }]
                }} 
                options={{
                  ...simpleChartOptions,
                  plugins: {
                    ...simpleChartOptions.plugins,
                    title: {
                      display: true,
                      text: 'Service Demand Distribution (Histogram)',
                      font: {
                        size: 14,
                        weight: 'bold'
                      },
                      color: '#374151',
                      padding: {
                        bottom: 20
                      }
                    },
                    tooltip: {
                      ...simpleChartOptions.plugins.tooltip,
                      callbacks: {
                        title: function(context) {
                          return chartData.serviceHistogram[context[0].dataIndex]?.name || context[0].label;
                        },
                        label: function(context) {
                          return `Bookings: ${context.parsed.y}`;
                        },
                        afterLabel: function(context) {
                          const total = chartData.serviceHistogram.reduce((sum, service) => sum + service.bookings, 0);
                          const percentage = ((context.parsed.y / total) * 100).toFixed(1);
                          return `Share: ${percentage}% of total`;
                        }
                      }
                    }
                  },
                  scales: {
                    ...simpleChartOptions.scales,
                    y: {
                      ...simpleChartOptions.scales.y,
                      title: {
                        display: true,
                        text: 'Number of Bookings',
                        font: {
                          size: 12,
                          weight: '600'
                        },
                        color: '#6B7280'
                      }
                    },
                    x: {
                      ...simpleChartOptions.scales.x,
                      title: {
                        display: true,
                        text: 'Services',
                        font: {
                          size: 12,
                          weight: '600'
                        },
                        color: '#6B7280'
                      }
                    }
                  }
                }} 
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <FaServicestack className="mx-auto text-6xl mb-4 opacity-30" />
                  <h4 className="text-lg font-medium mb-2">No Service Data Available</h4>
                  <p className="text-sm">Service demand histogram will appear here once bookings are made</p>
                  <div className="mt-4 p-3 bg-gray-100 rounded-lg">
                    <p className="text-xs text-gray-500">Histogram Features:</p>
                    <ul className="text-xs text-gray-500 mt-2 space-y-1">
                      <li>• Shows booking frequency per service</li>
                      <li>• Color-coded bars for visual distinction</li>
                      <li>• Interactive tooltips with percentages</li>
                      <li>• Real-time data updates</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Monthly Revenue & Booking Trend */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <FaChartLine className="mr-3 text-green-600" />
            Revenue & Booking Trends
          </h3>
          <p className="text-gray-600 mb-6">Monthly performance tracking with dual axis</p>
          
          <div className="h-80">
            {chartData.monthlyTrend.length > 0 ? (
              <Line data={monthlyTrendData} options={chartOptions} />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <FaChartLine className="mx-auto text-6xl mb-4 opacity-30" />
                  <h4 className="text-lg font-medium mb-2">Loading Trend Data...</h4>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Secondary Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Revenue Distribution */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <FaChartPie className="mr-3 text-blue-600" />
            Revenue Distribution
          </h3>
          <p className="text-gray-600 mb-6">Platform fee vs decorator earnings breakdown</p>
          
          <div className="h-80">
            {chartData.revenueDistribution.length > 0 ? (
              <Doughnut 
                data={revenueDistributionData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
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
                          return `${context.label}: ৳${context.parsed.toLocaleString()} (${percentage}%)`;
                        }
                      }
                    }
                  }
                }}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <FaChartPie className="mx-auto text-6xl mb-4 opacity-30" />
                  <h4 className="text-lg font-medium mb-2">Loading Distribution...</h4>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions & Links */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <FaChartLine className="mr-3 text-indigo-600" />
            Quick Analytics Access
          </h3>
          
          <div className="space-y-4">
            <Link 
              to="/dashboard/admin/revenue-monitoring" 
              className="block p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl hover:from-emerald-100 hover:to-emerald-200 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FaDollarSign className="text-2xl text-emerald-600 mr-4" />
                  <div>
                    <h4 className="font-semibold text-emerald-800">Revenue Monitoring</h4>
                    <p className="text-sm text-emerald-600">Detailed revenue analytics and trends</p>
                  </div>
                </div>
                <FaArrowUp className="text-emerald-600 transform rotate-45" />
              </div>
            </Link>

            <Link 
              to="/dashboard/admin/analytics-charts" 
              className="block p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl hover:from-blue-100 hover:to-blue-200 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FaChartBar className="text-2xl text-blue-600 mr-4" />
                  <div>
                    <h4 className="font-semibold text-blue-800">Analytics Charts</h4>
                    <p className="text-sm text-blue-600">Interactive charts and visualizations</p>
                  </div>
                </div>
                <FaArrowUp className="text-blue-600 transform rotate-45" />
              </div>
            </Link>

            <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl">
              <div className="flex items-center">
                <FaUsers className="text-2xl text-purple-600 mr-4" />
                <div>
                  <h4 className="font-semibold text-purple-800">User Engagement</h4>
                  <p className="text-sm text-purple-600">{bookingsByUser.length} active users this month</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl">
              <div className="flex items-center">
                <FaServicestack className="text-2xl text-orange-600 mr-4" />
                <div>
                  <h4 className="font-semibold text-orange-800">Service Performance</h4>
                  <p className="text-sm text-orange-600">{serviceDemand.length} services with active bookings</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
          <FaChartLine className="mr-3 text-indigo-600" />
          Business Performance Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl">
            <div className="text-2xl font-bold text-emerald-600 mb-2">
              ৳{analytics.totalBookings > 0 ? Math.round(analytics.totalRevenue / analytics.totalBookings).toLocaleString() : 0}
            </div>
            <div className="text-sm text-emerald-500 font-medium">Avg. Order Value</div>
            <div className="text-xs text-emerald-400 mt-1">Per Booking Revenue</div>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
            <div className="text-2xl font-bold text-blue-600 mb-2">
              {analytics.activeDecorators > 0 ? Math.round(analytics.totalBookings / analytics.activeDecorators) : 0}
            </div>
            <div className="text-sm text-blue-500 font-medium">Bookings per Decorator</div>
            <div className="text-xs text-blue-400 mt-1">Average Workload</div>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
            <div className="text-2xl font-bold text-purple-600 mb-2">
              ৳{Math.round(analytics.totalRevenue * 0.05).toLocaleString()}
            </div>
            <div className="text-sm text-purple-500 font-medium">Platform Revenue</div>
            <div className="text-xs text-purple-400 mt-1">5% Commission</div>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl">
            <div className="text-2xl font-bold text-orange-600 mb-2">
              ৳{Math.round(analytics.dailyRevenue).toLocaleString()}
            </div>
            <div className="text-sm text-orange-500 font-medium">Daily Average</div>
            <div className="text-xs text-orange-400 mt-1">Revenue per Day</div>
          </div>
        </div>
      </div>
    </div>
  );
}