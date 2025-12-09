import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import Spinner from "../../components/Spinner";
// import { Bar, Line } from 'react-chartjs-2'; // Charting library import করতে হবে

export default function AdminAnalytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [revenueRes, demandRes] = await Promise.all([
          API.get("/admin/analytics/revenue"),
          API.get("/admin/analytics/demand"),
        ]);
        setAnalytics({
          revenue: revenueRes.data,
          demand: demandRes.data,
        });
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch analytics data:", err);
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <Spinner />;

  // এইখানে Chart Data তৈরি করার লজিক থাকবে

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold mb-6">Analytics & Revenue Monitoring</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="stats shadow bg-base-100">
          <div className="stat">
            <div className="stat-title">Total Revenue</div>
            <div className="stat-value text-success">BDT {analytics.revenue.totalRevenue || '0'}</div>
          </div>
        </div>
        <div className="stats shadow bg-base-100">
          <div className="stat">
            <div className="stat-title">Bookings Last Month</div>
            <div className="stat-value">{analytics.revenue.monthlyBookings || '0'}</div>
          </div>
        </div>
        <div className="stats shadow bg-base-100">
          <div className="stat">
            <div className="stat-title">Active Decorators</div>
            <div className="stat-value">{analytics.revenue.activeDecorators || '0'}</div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-base-100 p-6 rounded-box shadow">
          <h3 className="text-xl font-semibold mb-4">Service Demand Chart (Bookings)</h3>
          {/* এখানে Bar Chart কম্পোনেন্ট বসবে, ডেটা হিসেবে analytics.demand পাস হবে */}
          <div className="text-gray-500 h-64 flex items-center justify-center">
             (Chart Component Placeholder)
          </div>
        </div>

        <div className="bg-base-100 p-6 rounded-box shadow">
          <h3 className="text-xl font-semibold mb-4">Monthly Revenue Trend</h3>
          {/* এখানে Line Chart কম্পোনেন্ট বসবে */}
          <div className="text-gray-500 h-64 flex items-center justify-center">
             (Chart Component Placeholder)
          </div>
        </div>
      </div>
    </div>
  );
}