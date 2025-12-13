import React from 'react';
import { NavLink, Outlet } from 'react-router-dom'; 
import { FaHome, FaUsers, FaPalette, FaUserTie, FaCalendarAlt, FaChartBar, FaCrown } from "react-icons/fa";

// Removed getNavLinkClass as we're using inline styles now


export default function AdminDashboard() {

  return (
    <div className="flex h-screen w-full bg-gray-100">
      {/* Sidebar */}
      <aside className="w-72 bg-gray-800 p-6 shadow-lg flex-shrink-0"> 
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
                <span className="text-xl"><FaHome /></span>
                <span className="font-medium">Overview</span>
            </NavLink>
           
            {/* Management Section */}
            <div className="pt-6 pb-2">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4">System Management</h3>
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

            {/* Analytics Section */}
            <div className="pt-6 pb-2">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4">Reports & Analytics</h3>
                <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent mt-2"></div>
            </div>

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
                <span className="font-medium">Business Analytics</span>
            </NavLink>
        </nav>

        
      </aside>

      {/* Main Content */}
      <main className="flex-grow bg-white overflow-y-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}