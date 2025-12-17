import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  FaHome,
  FaUsers,
  FaPalette,
  FaUserTie,
  FaCalendarAlt,
  FaChartBar,
  FaCrown,
  FaUserPlus,
  FaDollarSign,
  FaChartLine,
  FaBars,
  FaTimes,
} from "react-icons/fa";

export default function AdminDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="relative min-h-screen md:flex">
      {/* Mobile Menu Button */}
      <div className="md:hidden flex justify-between items-center bg-gray-800 text-white p-4">
        <h2 className="text-xl font-bold">Admin Menu</h2>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          {isSidebarOpen ? (
            <FaTimes className="text-2xl" />
          ) : (
            <FaBars className="text-2xl" />
          )}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 bg-gray-800 shadow-lg w-72 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0 transition-transform duration-300 ease-in-out z-30`}
      >
        <div className="p-6 h-full overflow-y-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <FaCrown className="text-xl font-bold text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Admin Dashboard</h2>
            </div>
            <div className="w-full h-1 bg-blue-600 rounded-full"></div>
          </div>

          <nav className="space-y-2">
            {/* Dashboard Home */}
            <NavLink
              to="/dashboard/admin"
              end
              className={({ isActive }) =>
                `flex items-center space-x-3 w-full py-3 px-4 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:text-white hover:bg-gray-700"
                }`
              }
            >
              <span className="text-xl">
                <FaHome />
              </span>
              <span className="font-medium">Overview</span>
            </NavLink>

            {/* Management Section */}
            <div className="pt-6 pb-2">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4">
                System Management
              </h3>
              <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent mt-2"></div>
            </div>

            <NavLink
              to="manage-users"
              className={({ isActive }) =>
                `flex items-center space-x-3 w-full py-3 px-4 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-green-600 text-white"
                    : "text-gray-300 hover:text-white hover:bg-gray-700"
                }`
              }
            >
              <FaUsers className="text-xl" />
              <span className="font-medium">Manage Users</span>
            </NavLink>

            <NavLink
              to="manage-services"
              className={({ isActive }) =>
                `flex items-center space-x-3 w-full py-3 px-4 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-pink-600 text-white"
                    : "text-gray-300 hover:text-white hover:bg-gray-700"
                }`
              }
            >
              <FaPalette className="text-xl" />
              <span className="font-medium">Manage Services</span>
            </NavLink>

            <NavLink
              to="manage-decorators"
              className={({ isActive }) =>
                `flex items-center space-x-3 w-full py-3 px-4 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-orange-600 text-white"
                    : "text-gray-300 hover:text-white hover:bg-gray-700"
                }`
              }
            >
              <FaUserTie className="text-xl" />
              <span className="font-medium">Manage Decorators</span>
            </NavLink>

            <NavLink
              to="manage-bookings"
              className={({ isActive }) =>
                `flex items-center space-x-3 w-full py-3 px-4 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-cyan-600 text-white"
                    : "text-gray-300 hover:text-white hover:bg-gray-700"
                }`
              }
            >
              <FaCalendarAlt className="text-xl" />
              <span className="font-medium">Manage Bookings</span>
            </NavLink>

            <NavLink
              to="decorator-requests"
              className={({ isActive }) =>
                `flex items-center space-x-3 w-full py-3 px-4 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-indigo-600 text-white"
                    : "text-gray-300 hover:text-white hover:bg-gray-700"
                }`
              }
            >
              <FaUserPlus className="text-xl" />
              <span className="font-medium">Decorator Requests</span>
            </NavLink>

            {/* Analytics Section */}
            <div className="pt-6 pb-2">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4">
                Reports & Analytics
              </h3>
              <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent mt-2"></div>
            </div>

            <NavLink
              to="revenue-monitoring"
              className={({ isActive }) =>
                `flex items-center space-x-3 w-full py-3 px-4 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-emerald-600 text-white"
                    : "text-gray-300 hover:text-white hover:bg-gray-700"
                }`
              }
            >
              <FaDollarSign className="text-xl" />
              <span className="font-medium">Revenue Monitoring</span>
            </NavLink>

            <NavLink
              to="analytics"
              className={({ isActive }) =>
                `flex items-center space-x-3 w-full py-3 px-4 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-purple-600 text-white"
                    : "text-gray-300 hover:text-white hover:bg-gray-700"
                }`
              }
            >
              <FaChartBar className="text-xl" />
              <span className="font-medium">Analytics Overview</span>
            </NavLink>

            <NavLink
              to="analytics-charts"
              className={({ isActive }) =>
                `flex items-center space-x-3 w-full py-3 px-4 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-pink-600 text-white"
                    : "text-gray-300 hover:text-white hover:bg-gray-700"
                }`
              }
            >
              <FaChartLine className="text-xl" />
              <span className="font-medium">Analytics Charts</span>
            </NavLink>

            <NavLink
              to="business-analytics"
              className={({ isActive }) =>
                `flex items-center space-x-3 w-full py-3 px-4 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-indigo-600 text-white"
                    : "text-gray-300 hover:text-white hover:bg-gray-700"
                }`
              }
            >
              <FaChartLine className="text-xl" />
              <span className="font-medium">Business Dashboard</span>
            </NavLink>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-base-100">
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
