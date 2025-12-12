import React from 'react';
import { NavLink, Outlet } from 'react-router-dom'; 

// Removed getNavLinkClass as we're using inline styles now


export default function AdminDashboard() {

  return (
    <div className="flex h-screen w-full bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Sidebar */}
      <aside className="w-72 bg-gradient-to-b from-indigo-900 via-purple-900 to-indigo-800 p-6 shadow-2xl flex-shrink-0 fixed h-full overflow-y-auto"> 
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              <span className="text-xl font-bold text-white">👑</span>
            </div>
            <h2 className="text-2xl font-bold text-white">Admin Panel</h2>
          </div>
          <div className="w-full h-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"></div>
        </div>
     
        <nav className="space-y-2">
            {/* Dashboard Home */}
            <NavLink 
                to="/dashboard/admin" 
                end 
                className={({ isActive }) => 
                    `flex items-center space-x-3 w-full py-3 px-4 rounded-xl transition-all duration-200 ${
                        isActive 
                            ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105" 
                            : "text-gray-300 hover:text-white hover:bg-white/10 hover:transform hover:scale-105"
                    }`
                }
            >
                <span className="text-xl">🏠</span>
                <span className="font-medium">Dashboard Home</span>
            </NavLink>
           
            {/* Management Section */}
            <div className="pt-6 pb-2">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4">Management</h3>
                <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent mt-2"></div>
            </div>

            <NavLink 
                to="manage-users" 
                className={({ isActive }) => 
                    `flex items-center space-x-3 w-full py-3 px-4 rounded-xl transition-all duration-200 ${
                        isActive 
                            ? "bg-gradient-to-r from-green-500 to-teal-600 text-white shadow-lg transform scale-105" 
                            : "text-gray-300 hover:text-white hover:bg-white/10 hover:transform hover:scale-105"
                    }`
                }
            >
                <span className="text-xl">👥</span>
                <span className="font-medium">User Management</span>
            </NavLink>

            <NavLink 
                to="manage-services" 
                className={({ isActive }) => 
                    `flex items-center space-x-3 w-full py-3 px-4 rounded-xl transition-all duration-200 ${
                        isActive 
                            ? "bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-lg transform scale-105" 
                            : "text-gray-300 hover:text-white hover:bg-white/10 hover:transform hover:scale-105"
                    }`
                }
            >
                <span className="text-xl">🎨</span>
                <span className="font-medium">Services & Packages</span>
            </NavLink>

            <NavLink 
                to="manage-decorators" 
                className={({ isActive }) => 
                    `flex items-center space-x-3 w-full py-3 px-4 rounded-xl transition-all duration-200 ${
                        isActive 
                            ? "bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg transform scale-105" 
                            : "text-gray-300 hover:text-white hover:bg-white/10 hover:transform hover:scale-105"
                    }`
                }
            >
                <span className="text-xl">🎭</span>
                <span className="font-medium">Decorator Management</span>
            </NavLink>

            <NavLink 
                to="manage-bookings" 
                className={({ isActive }) => 
                    `flex items-center space-x-3 w-full py-3 px-4 rounded-xl transition-all duration-200 ${
                        isActive 
                            ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg transform scale-105" 
                            : "text-gray-300 hover:text-white hover:bg-white/10 hover:transform hover:scale-105"
                    }`
                }
            >
                <span className="text-xl">📋</span>
                <span className="font-medium">Booking Management</span>
            </NavLink>

            {/* Analytics Section */}
            <div className="pt-6 pb-2">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4">Analytics</h3>
                <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent mt-2"></div>
            </div>

            <NavLink 
                to="analytics" 
                className={({ isActive }) => 
                    `flex items-center space-x-3 w-full py-3 px-4 rounded-xl transition-all duration-200 ${
                        isActive 
                            ? "bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg transform scale-105" 
                            : "text-gray-300 hover:text-white hover:bg-white/10 hover:transform hover:scale-105"
                    }`
                }
            >
                <span className="text-xl">📊</span>
                <span className="font-medium">Analytics & Revenue</span>
            </NavLink>
        </nav>

        {/* Footer */}
        <div className="absolute bottom-6 left-6 right-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
            <p className="text-xs text-gray-300">Stylish Decoration</p>
            <p className="text-xs text-gray-400">Admin Panel v1.0</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow bg-white/50 backdrop-blur-sm overflow-y-auto ml-72">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}