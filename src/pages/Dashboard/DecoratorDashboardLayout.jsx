import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { FaHome, FaPalette, FaClipboardList, FaDollarSign, FaUser, FaSignOutAlt } from 'react-icons/fa';
import useAuth from '../../hooks/useAuth';

export default function DecoratorDashboardLayout() {
  const { logout } = useAuth();

  const getNavLinkClass = ({ isActive }) =>
    `flex items-center space-x-3 p-3 rounded-lg transition duration-150 ${
      isActive 
        ? "bg-primary text-primary-content font-semibold" 
        : "text-base-content/70 hover:bg-base-200 hover:text-base-content"
    }`;

  return (
    <div className="flex min-h-screen w-full bg-base-100">
      {/* Fixed Sidebar */}
      <aside className="w-64 bg-base-200 shadow-lg flex-shrink-0 fixed top-0 left-0 h-screen overflow-y-auto z-10">
        <div className="p-4">
          <div className="mb-6">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <FaPalette className="text-xl text-primary-content" />
              </div>
              <h2 className="text-2xl font-bold text-primary">Decorator Panel</h2>
            </div>
            <div className="w-full h-1 bg-primary rounded-full"></div>
          </div>

          <nav className="space-y-2">
            <NavLink 
              to="/dashboard/decorator" 
              end
              className={getNavLinkClass}
            >
              <FaHome />
              <span>Dashboard</span>
            </NavLink>
            
            <NavLink 
              to="/dashboard/decorator/projects"
              className={getNavLinkClass}
            >
              <FaClipboardList />
              <span>My Projects</span>
            </NavLink>
            
            <NavLink 
              to="/dashboard/decorator/earnings"
              className={getNavLinkClass}
            >
              <FaDollarSign />
              <span>Earnings</span>
            </NavLink>
            
            <NavLink 
              to="/dashboard/decorator/profile"
              className={getNavLinkClass}
            >
              <FaUser />
              <span>My Profile</span>
            </NavLink>
          </nav>
          
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
      <main className="flex-1 bg-base-100 ml-64 min-h-screen overflow-y-auto">
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}