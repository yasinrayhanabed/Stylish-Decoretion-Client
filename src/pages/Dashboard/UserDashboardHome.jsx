import React from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { FaUser, FaCalendarAlt, FaPalette, FaChartBar, FaEdit, FaPhone } from 'react-icons/fa';

export default function UserDashboardHome() {
    const { user } = useAuth();

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-8 text-white shadow-xl">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold mb-2 flex items-center">
                            <FaUser className="mr-3" />
                            Welcome back, {user?.name || 'User'}!
                        </h1>
                        <p className="text-blue-100 text-lg">Manage your bookings and profile from your dashboard</p>
                    </div>
                    <div className="hidden md:block">
                        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                            <FaUser className="text-3xl" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link to="/dashboard/profile" className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all border-l-4 border-blue-500 group">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm font-medium text-blue-600 mb-1">My Profile</div>
                            <div className="text-lg font-bold text-blue-800">Manage Account</div>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                            <FaUser className="text-xl text-blue-600" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm text-blue-600">
                        <FaEdit className="mr-2" />
                        View and edit your information
                    </div>
                </Link>

                <Link to="/dashboard/my-bookings" className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all border-l-4 border-green-500 group">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm font-medium text-green-600 mb-1">My Bookings</div>
                            <div className="text-lg font-bold text-green-800">Track Orders</div>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors">
                            <FaCalendarAlt className="text-xl text-green-600" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm text-green-600">
                        <FaCalendarAlt className="mr-2" />
                        View your service bookings
                    </div>
                </Link>

                <Link to="/services" className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all border-l-4 border-purple-500 group">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm font-medium text-purple-600 mb-1">Book Service</div>
                            <div className="text-lg font-bold text-purple-800">New Booking</div>
                        </div>
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                            <FaPalette className="text-xl text-purple-600" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm text-purple-600">
                        <FaPalette className="mr-2" />
                        Browse decoration services
                    </div>
                </Link>
            </div>

            {/* Stats and Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl shadow-xl p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                        <FaChartBar className="mr-3 text-blue-600" />
                        Account Overview
                    </h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <span className="font-medium">Account Status</span>
                            <span className="text-lg font-bold text-green-600">Active</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <span className="font-medium">Member Since</span>
                            <span className="text-lg font-bold text-blue-600">
                                {user?.createdAt ? new Date(user.createdAt).getFullYear() : 'N/A'}
                            </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <span className="font-medium">Role</span>
                            <span className="text-lg font-bold text-purple-600 capitalize">{user?.role || 'User'}</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                        <FaEdit className="mr-3 text-green-600" />
                        Quick Actions
                    </h3>
                    <div className="space-y-3">
                        <Link to="/services" className="flex items-center p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors group">
                            <FaPalette className="mr-3 text-purple-600" />
                            <span className="font-medium text-purple-800 group-hover:text-purple-900">Browse Services</span>
                        </Link>
                        <Link to="/dashboard/profile" className="flex items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors group">
                            <FaEdit className="mr-3 text-blue-600" />
                            <span className="font-medium text-blue-800 group-hover:text-blue-900">Edit Profile</span>
                        </Link>
                        <Link to="/contact" className="flex items-center p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors group">
                            <FaPhone className="mr-3 text-green-600" />
                            <span className="font-medium text-green-800 group-hover:text-green-900">Contact Support</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}