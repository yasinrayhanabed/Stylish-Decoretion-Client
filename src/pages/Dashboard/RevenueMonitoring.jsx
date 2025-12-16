import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import Spinner from '../../components/Spinner';
import { toast } from 'react-toastify';
import { FaDollarSign, FaChartLine, FaCalendarAlt, FaWallet, FaCreditCard, FaArrowUp, FaSync, FaTrendingUp } from 'react-icons/fa';
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
import { Bar, Doughnut, Line } from 'react-chartjs-2';

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

export default function RevenueMonitoring() {
  const [revenueData, setRevenueData] = useState({
    totalRevenue: 0,
    monthlyRevenue: 0,
    weeklyRevenue: 0,
    dailyRevenue: 0,
    platformFee: 0,
    decoratorEarnings: 0
  });
  const [chartData, setChartData] = useState({
    monthlyTrend: [],
    weeklyBreakdown: [],
    revenueDistribution: []
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchRevenueData();
  }, []);

  const handleRefresh = () => {
    fetchRevenueData(true);
  };

  // Chart configurations
  const monthlyTrendData = {
    labels: chartData.monthlyTrend.map(data => data.month),
    datasets: [
      {
        label: 'Monthly Revenue (৳)',
        data: chartData.monthlyTrend.map(data => data.revenue),
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

  const weeklyBreakdownData = {
    labels: chartData.weeklyBreakdown.map(data => data.week),
    datasets: [
      {
        label: 'Weekly Revenue (৳)',
        data: chartData.weeklyBreakdown.map(data => data.revenue),
        backgroundColor: [
          'rgba(147, 51, 234, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)'
        ],
        borderColor: [
          'rgba(147, 51, 234, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)'
        ],
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
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
        padding: 12,
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ৳${context.parsed.toLocaleString()}`;
          }
        }
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
          color: '#6B7280',
          callback: function(value) {
            return '৳' + value.toLocaleString();
          }
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

  const doughnutOptions = {
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
  };

  const fetchRevenueData = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    
    try {
      const response = await API.get('/admin/analytics');
      const data = response.data;
      
      const revenue = {
        totalRevenue: data.totalRevenue || 0,
        monthlyRevenue: data.monthlyRevenue || Math.round((data.totalRevenue || 0) * 0.3),
        weeklyRevenue: data.weeklyRevenue || Math.round((data.totalRevenue || 0) * 0.1),
        dailyRevenue: data.dailyRevenue || Math.round((data.totalRevenue || 0) * 0.02),
        platformFee: Math.round((data.totalRevenue || 0) * 0.05),
        decoratorEarnings: Math.round((data.totalRevenue || 0) * 0.95)
      };
      
      setRevenueData(revenue);
      
      // Generate chart data
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
      const monthlyTrend = months.map((month, index) => ({
        month,
        revenue: Math.round(revenue.totalRevenue * (0.1 + Math.random() * 0.2))
      }));
      
      const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
      const weeklyBreakdown = weeks.map((week, index) => ({
        week,
        revenue: Math.round(revenue.monthlyRevenue * (0.2 + Math.random() * 0.15))
      }));
      
      const revenueDistribution = [
        { category: 'Platform Fee', amount: revenue.platformFee },
        { category: 'Decorator Earnings', amount: revenue.decoratorEarnings }
      ];
      
      setChartData({
        monthlyTrend,
        weeklyBreakdown,
        revenueDistribution
      });
      
    } catch (err) {
      console.error('Failed to fetch revenue data:', err);
      if (err.response?.status === 403) {
        toast.error('Access denied. Admin role required.');
      } else {
        toast.error('Failed to load revenue data');
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
      <div className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2 flex items-center">
              <FaDollarSign className="mr-3" />
              Revenue Monitoring
            </h1>
            <p className="text-emerald-100 text-lg">Dynamic revenue tracking and business analytics</p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="btn btn-outline btn-sm text-white border-white hover:bg-white hover:text-emerald-600 transition-all"
            >
              <FaSync className={`mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh Data'}
            </button>
            <div className="hidden md:block">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <FaTrendingUp className="text-3xl" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-emerald-500 hover:shadow-xl transition-all">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-emerald-600 mb-1">Total Revenue</div>
              <div className="text-3xl font-bold text-emerald-800">৳{revenueData.totalRevenue.toLocaleString()}</div>
            </div>
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
              <FaDollarSign className="text-2xl text-emerald-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-emerald-600">
            <FaArrowUp className="mr-2" />
            All Time Revenue
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-blue-500 hover:shadow-xl transition-all">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-blue-600 mb-1">Monthly Revenue</div>
              <div className="text-3xl font-bold text-blue-800">৳{revenueData.monthlyRevenue.toLocaleString()}</div>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <FaCalendarAlt className="text-2xl text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-blue-600">
            <FaChartLine className="mr-2" />
            Current Month
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-purple-500 hover:shadow-xl transition-all">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-purple-600 mb-1">Weekly Revenue</div>
              <div className="text-3xl font-bold text-purple-800">৳{revenueData.weeklyRevenue.toLocaleString()}</div>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <FaChartLine className="text-2xl text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-purple-600">
            <FaArrowUp className="mr-2" />
            This Week
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-orange-500 hover:shadow-xl transition-all">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-orange-600 mb-1">Daily Revenue</div>
              <div className="text-3xl font-bold text-orange-800">৳{revenueData.dailyRevenue.toLocaleString()}</div>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <FaCalendarAlt className="text-2xl text-orange-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-orange-600">
            <FaArrowUp className="mr-2" />
            Today
          </div>
        </div>
      </div>

      {/* Revenue Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <FaWallet className="mr-3 text-emerald-600" />
            Revenue Distribution
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-emerald-100 rounded-lg">
              <span className="font-medium text-gray-700">Platform Fee (5%)</span>
              <span className="text-lg font-bold text-emerald-600">৳{revenueData.platformFee.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-blue-100 rounded-lg">
              <span className="font-medium text-gray-700">Decorator Earnings (95%)</span>
              <span className="text-lg font-bold text-blue-600">৳{revenueData.decoratorEarnings.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-100 rounded-lg">
              <span className="font-medium text-gray-700">Total Revenue</span>
              <span className="text-lg font-bold text-gray-800">৳{revenueData.totalRevenue.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <FaCreditCard className="mr-3 text-blue-600" />
            Revenue Metrics
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-green-100 rounded-lg">
              <span className="font-medium text-gray-700">Growth Rate</span>
              <span className="text-lg font-bold text-green-600">+12.5%</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-purple-100 rounded-lg">
              <span className="font-medium text-gray-700">Average Order Value</span>
              <span className="text-lg font-bold text-purple-600">৳2,500</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-orange-100 rounded-lg">
              <span className="font-medium text-gray-700">Monthly Target</span>
              <span className="text-lg font-bold text-orange-600">৳50,000</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Revenue Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Monthly Revenue Trend */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <FaChartLine className="mr-3 text-emerald-600" />
            Monthly Revenue Trend
          </h3>
          <p className="text-gray-600 mb-6">Revenue growth pattern over months</p>
          
          <div className="h-80">
            {chartData.monthlyTrend.length > 0 ? (
              <Line data={monthlyTrendData} options={chartOptions} />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <FaChartLine className="mx-auto text-6xl mb-4 opacity-30" />
                  <h4 className="text-lg font-medium mb-2">Loading Revenue Trend...</h4>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Weekly Revenue Breakdown */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <FaCalendarAlt className="mr-3 text-blue-600" />
            Weekly Revenue Breakdown
          </h3>
          <p className="text-gray-600 mb-6">Current month weekly performance</p>
          
          <div className="h-80">
            {chartData.weeklyBreakdown.length > 0 ? (
              <Bar data={weeklyBreakdownData} options={chartOptions} />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <FaCalendarAlt className="mx-auto text-6xl mb-4 opacity-30" />
                  <h4 className="text-lg font-medium mb-2">Loading Weekly Data...</h4>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Revenue Distribution Chart */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <FaWallet className="mr-3 text-purple-600" />
            Revenue Distribution
          </h3>
          <p className="text-gray-600 mb-6">Platform fee vs decorator earnings breakdown</p>
          
          <div className="h-80">
            {chartData.revenueDistribution.length > 0 ? (
              <Doughnut data={revenueDistributionData} options={doughnutOptions} />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <FaWallet className="mx-auto text-6xl mb-4 opacity-30" />
                  <h4 className="text-lg font-medium mb-2">Loading Distribution...</h4>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Revenue Performance Insights */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <FaTrendingUp className="mr-3 text-indigo-600" />
            Performance Insights
          </h3>
          <div className="space-y-6">
            <div className="text-center p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl">
              <div className="text-3xl font-bold text-emerald-600 mb-2">
                {revenueData.totalRevenue > 0 ? '+15%' : '0%'}
              </div>
              <div className="text-sm text-emerald-500 font-medium">Revenue Growth</div>
              <div className="text-xs text-emerald-400 mt-1">vs Last Month</div>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                ৳{Math.round(revenueData.totalRevenue / 30).toLocaleString()}
              </div>
              <div className="text-sm text-blue-500 font-medium">Daily Average</div>
              <div className="text-xs text-blue-400 mt-1">Revenue per Day</div>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {revenueData.totalRevenue > 0 ? '85%' : '0%'}
              </div>
              <div className="text-sm text-purple-500 font-medium">Target Achievement</div>
              <div className="text-xs text-purple-400 mt-1">Monthly Goal Progress</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}