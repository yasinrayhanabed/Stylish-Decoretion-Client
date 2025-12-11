// src/pages/Dashboard/UserDashboard.jsx (Fixed)

import React from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaCalendarCheck, FaSignOutAlt, FaHome } from 'react-icons/fa';

const DashboardSidebar = () => {
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/'; 
    };

    return (
        <div className="w-64 bg-gray-800 text-white min-h-screen p-4">
            <h2 className="text-2xl font-bold mb-6 border-b border-gray-700 pb-2">User Dashboard</h2>
            <nav className="space-y-2">
                <Link 
                    // 🚨 পরিবর্তন: /dashboard এ এখন My Bookings পেজ লোড হচ্ছে
                    to="/dashboard/my-bookings" 
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-600 text-gray-300 transition duration-150"
                >
                    <FaCalendarCheck /> {/* 🚨 আইকন পরিবর্তন */}
                    <span>My Bookings (Default)</span> {/* 🚨 টেক্সট পরিবর্তন */}
                </Link>
                <Link 
                    to="/dashboard/my-bookings"
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-600 text-gray-300 transition duration-150"
                >
                    <FaCalendarCheck />
                    <span>My Bookings</span>
                </Link>
                <button 
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 p-3 mt-4 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition duration-150"
                >
                    <FaSignOutAlt />
                    <span>Logout</span>
                </button>
            </nav>
            <div className='mt-8 pt-4 border-t border-gray-700'>
                 <Link 
                    to="/"
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 text-gray-300 transition duration-150"
                >
                    <FaHome />
                    <span>Back to Home</span>
                </Link>
            </div>
        </div>
    );
};


// এটি ড্যাশবোর্ড লেআউট হিসেবে কাজ করবে, যেখানে children-এর মাধ্যমে ভেতরের পেজগুলি লোড হবে
export default function UserDashboard({ children }) {
    return (
        <div className="flex min-h-screen w-full"> 
            <DashboardSidebar />
            <div className="flex-grow p-4 md:p-8">
                {children} {/* ড্যাশবোর্ডের কন্টেন্ট (MyBookingsPage) এখানে প্রদর্শিত হবে */}
            </div>
        </div>
    );
}