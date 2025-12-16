import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { FaHome, FaSignOutAlt } from 'react-icons/fa';
import useAuth from '../hooks/useAuth';

export default function DashboardLayout({ 
  title, 
  icon: Icon, 
  navItems = [], 
  headerColor = "bg-primary",
  sidebarColor = "bg-base-200" 
}) {
  const { logout } = useAuth();

  const getNavLinkClass = ({ isActive }) =>
    `flex items-center space-x-3 p-3 rounded-lg transition duration-150 ${
      isActive 
        ? "bg-primary text-primary-content font-semibold" 
        : "text-base-content/70 hover:bg-base-200 hover:text-base-content"
    }`;

  return (
    <div className="flex min-h-screen w-full bg-base-100">
      {/* Fixed Sidebar - Full Height */}
      <aside className={`w-64 ${sidebarColor} shadow-lg flex-shrink-0 fixed top-0 left-0 h-screen overflow-y-auto z-10`}>
        <div className="p-4">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center space-x-3 mb-2">
              <div className={`w-10 h-10 ${headerColor} rounded-full flex items-center justify-center`}>
                {Icon && <Icon className="text-xl text-primary-content" />}
              </div>
              <h2 className="text-2xl font-bold text-primary">{title}</h2>
            </div>
            <div className="w-full h-1 bg-primary rounded-full"></div>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            {navItems.map((item, index) => (
              <NavLink 
                key={index}
                to={item.path} 
                end={item.end}
                className={getNavLinkClass}
              >
                <item.icon />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
          
          {/* Footer Navigation */}
          <div className="mt-8 pt-4 border-t border-base-300 space-y-2">
            <NavLink 
              to="/"
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-base-300 text-base-content/70 transition duration-150"
            >
              <FaHome />
              <span>Back to Home</span>
            </NavLink>
            <button 
              onClick={logout}
              className="w-full flex items-center space-x-3 p-3 rounded-lg bg-error text-error-content hover:bg-error/80 font-semibold transition duration-150"
            >
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content - Scrollable with margin for fixed sidebar */}
      <main className="flex-1 bg-base-100 ml-64 min-h-screen">
        <div className="h-full overflow-y-auto">
          <div className="p-6">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}