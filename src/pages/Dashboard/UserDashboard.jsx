// src/pages/Dashboard/UserDashboard.jsx (Fixed)

import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaUser, FaCalendarCheck, FaSignOutAlt, FaHome, FaCreditCard, FaTimes } from 'react-icons/fa';
import useAuth from '../../hooks/useAuth';

const DashboardSidebar = () => {
    const { logout } = useAuth();

    const getNavLinkClass = ({ isActive }) =>
        `flex items-center space-x-3 p-3 rounded-lg transition duration-150 ${
            isActive 
                ? "bg-primary text-primary-content font-semibold" 
                : "text-base-content/70 hover:bg-base-200 hover:text-base-content"
        }`;

    return (
        <div className="w-64 bg-base-200 min-h-screen p-4 shadow-lg fixed h-full overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6 text-primary">User Dashboard</h2>
            <nav className="space-y-2">
                <NavLink 
                    to="/dashboard" 
                    end
                    className={getNavLinkClass}
                >
                    <FaHome />
                    <span>Dashboard</span>
                </NavLink>
                <NavLink 
                    to="/dashboard/profile" 
                    className={getNavLinkClass}
                >
                    <FaUser />
                    <span>My Profile</span>
                </NavLink>
                <NavLink 
                    to="/dashboard/my-bookings"
                    className={getNavLinkClass}
                >
                    <FaCalendarCheck />
                    <span>My Bookings</span>
                </NavLink>
                <NavLink 
                    to="/dashboard/payment-history"
                    className={getNavLinkClass}
                >
                    <FaCreditCard />
                    <span>Payment History</span>
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
    );
};


export default function UserDashboard({ children }) {
    return (
        <div className="flex min-h-screen bg-base-100"> 
            <DashboardSidebar />
            <div className="flex-grow p-6 ml-64">
                {children}
            </div>
        </div>
    );
}