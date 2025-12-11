import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

export default function UserDashboardHome() {
    const { user } = useAuth();

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
        >
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">Welcome back, {user?.name || 'User'}! 👋</h1>
                <p className="text-base-content/70">Manage your bookings and profile from your dashboard</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <Link to="/dashboard/profile" className="card bg-primary text-primary-content shadow-xl hover:shadow-2xl transition-all">
                    <div className="card-body text-center">
                        <div className="text-4xl mb-2">👤</div>
                        <h2 className="card-title justify-center">My Profile</h2>
                        <p>View and edit your personal information</p>
                    </div>
                </Link>

                <Link to="/dashboard/my-bookings" className="card bg-secondary text-secondary-content shadow-xl hover:shadow-2xl transition-all">
                    <div className="card-body text-center">
                        <div className="text-4xl mb-2">📅</div>
                        <h2 className="card-title justify-center">My Bookings</h2>
                        <p>Track your service bookings and history</p>
                    </div>
                </Link>

                <Link to="/services" className="card bg-accent text-accent-content shadow-xl hover:shadow-2xl transition-all">
                    <div className="card-body text-center">
                        <div className="text-4xl mb-2">🎨</div>
                        <h2 className="card-title justify-center">Book Service</h2>
                        <p>Browse and book new decoration services</p>
                    </div>
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card bg-base-200 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title">📊 Quick Stats</h2>
                        <div className="stats stats-vertical lg:stats-horizontal shadow">
                            <div className="stat">
                                <div className="stat-title">Account Status</div>
                                <div className="stat-value text-sm">Active</div>
                                <div className="stat-desc">Member since {user?.createdAt ? new Date(user.createdAt).getFullYear() : 'N/A'}</div>
                            </div>
                            <div className="stat">
                                <div className="stat-title">Role</div>
                                <div className="stat-value text-sm capitalize">{user?.role || 'User'}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card bg-base-200 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title">🚀 Quick Actions</h2>
                        <div className="space-y-2">
                            <Link to="/services" className="btn btn-outline btn-sm w-full justify-start">
                                🎨 Browse Services
                            </Link>
                            <Link to="/dashboard/profile" className="btn btn-outline btn-sm w-full justify-start">
                                ✏️ Edit Profile
                            </Link>
                            <Link to="/contact" className="btn btn-outline btn-sm w-full justify-start">
                                📞 Contact Support
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}