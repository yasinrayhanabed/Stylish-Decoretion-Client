import React, { useState, useEffect } from "react";
import { FaWallet, FaCheckCircle, FaChartLine } from "react-icons/fa";
import API from "../../api/axios";
import useAuth from "../../hooks/useAuth";
import LoadingSpinner from "../../components/LoadingSpinner";
import { formatCurrency } from "../../utils/formatCurrency";

const StatCard = ({ icon, title, value, color }) => (
  <div className={`card bg-base-100 shadow-lg`}>
    <div className="card-body flex-row items-center">
      <div className={`p-3 rounded-full ${color}`}>{icon}</div>
      <div className="ml-4">
        <h3 className="text-base-content/70">{title}</h3>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  </div>
);

export default function MyEarnings() {
  const [earningsData, setEarningsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchEarnings = async () => {
      if (user?.role !== "decorator") {
        setError("This page is for decorators only.");
        setLoading(false);
        return;
      }
      try {
        // Fetch all bookings assigned to the decorator
        const response = await API.get("/bookings/assigned");
        const assignedBookings = response.data?.data || response.data || [];

        // Calculate earnings on the client-side
        const completedBookings = assignedBookings.filter(
          (b) => b.status === "Completed"
        );

        const total = completedBookings.reduce(
          (sum, booking) => sum + (parseFloat(booking.cost) || 0),
          0
        );

        const earnings = {
          totalEarnings: total,
          completedProjects: completedBookings.length,
          projects: completedBookings.map((b) => ({
            ...b, // Keep original booking data
            amount: b.cost, // Ensure amount is set for the table
          })),
        };
        setEarningsData(earnings);
      } catch (err) {
        setError("Failed to fetch earnings data. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEarnings();
  }, [user]);

  if (loading) {
    return <LoadingSpinner text="Loading Earnings..." />;
  }

  if (error) {
    return <div className="alert alert-error">{error}</div>;
  }

  if (!earningsData) {
    return <div className="text-center p-8">No earnings data available.</div>;
  }

  const { totalEarnings, completedProjects, projects } = earningsData;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-primary">My Earnings</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          icon={<FaWallet className="text-2xl text-success-content" />}
          title="Total Earnings"
          value={formatCurrency(totalEarnings, { currency: "৳" })}
          color="bg-success"
        />
        <StatCard
          icon={<FaCheckCircle className="text-2xl text-info-content" />}
          title="Completed Projects"
          value={completedProjects}
          color="bg-info"
        />
        <StatCard
          icon={<FaChartLine className="text-2xl text-warning-content" />}
          title="Avg. Per Project"
          value={formatCurrency(
            completedProjects > 0 ? totalEarnings / completedProjects : 0,
            { currency: "৳" }
          )}
          color="bg-warning"
        />
      </div>

      {/* Completed Projects Table */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Completed Projects</h2>
        <div className="overflow-x-auto bg-base-100 rounded-lg shadow">
          <table className="table w-full">
            <thead>
              <tr>
                <th>#</th>
                <th>Service Name</th>
                <th>Client Name</th>
                <th>Completion Date</th>
                <th className="text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {projects?.map((project, index) => (
                <tr key={project._id} className="hover">
                  <th>{index + 1}</th>
                  <td>{project.serviceName || "N/A"}</td>
                  <td>{project.userName || "N/A"}</td>
                  <td>{new Date(project.updatedAt).toLocaleDateString()}</td>
                  <td className="text-right font-semibold">
                    {formatCurrency(project.amount, { currency: "৳" })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
