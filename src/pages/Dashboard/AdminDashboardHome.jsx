import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; 
import API from "../../api/axios"; 
import Spinner from "../../components/Spinner"; 
import { toast } from "react-toastify";
import { FaChartBar, FaBuilding, FaPalette, FaUserTie, FaClipboardList, FaStar, FaTag, FaDollarSign } from "react-icons/fa"; 

function AdminDashboardHome() {
    const [services, setServices] = useState([]);
    const [decorators, setDecorators] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const servicesRes = await API.get('/services');
                setServices(servicesRes.data || []);
            } catch (err) {
                console.error("Service data fetch error:", err);
                toast.error("Failed to load Services.");
            }

            try {
                const usersRes = await API.get('/users'); 
                const allUsers = Array.isArray(usersRes.data) ? usersRes.data : [];
                const decoratorUsers = allUsers.filter(user => user.role === 'decorator');
                setDecorators(decoratorUsers);
            } catch (err) {
                console.error("Decorator data fetch error:", err);
                if (err.response?.status === 403) {
                    toast.error("Access denied. Admin role required to view users.");
                } else if (err.response?.status === 401) {
                    toast.error("Authentication failed. Please login as admin.");
                } else {
                    toast.error("Failed to load decorator data.");
                }
                setDecorators([]);
            }

        
            try {
                // Try admin bookings endpoint first
                const bookingsRes = await API.get('/bookings');
                const bookingsData = Array.isArray(bookingsRes.data) ? bookingsRes.data : [];
                setBookings(bookingsData);
            } catch (err) {
                console.error("Booking data fetch error:", err);
                if (err.response?.status === 403) {
                    toast.error("Access denied. Admin role required to view all bookings.");
                } else if (err.response?.status === 401) {
                    toast.error("Authentication failed. Please login as admin.");
                } else {
                    toast.error("Failed to load booking data.");
                }
                setBookings([]);
            }
            
            setLoading(false);
        };

        fetchData();
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <Spinner />
                <p className="mt-4 text-gray-600">Loading dashboard...</p>
            </div>
        </div>
    );

    if (error) {
 
        return (
            <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="flex items-center space-x-4 p-6 bg-red-50 border border-red-200 rounded-xl">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                        <span className="text-2xl">⚠️</span>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-red-700 mb-2">Dashboard Data Error</h2>
                        <p className="text-red-600">{error}</p>
                    </div>
                </div>
            </div>
        );
    }
    
    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="bg-blue-600 rounded-lg p-8 text-white shadow-lg">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold mb-2 flex items-center">
                            <FaChartBar className="mr-3" /> 
                            Admin Overview
                        </h1>
                        <p className="text-blue-100 text-lg">Quick view of the entire system</p>
                    </div>
                    <div className="hidden md:block">
                        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                            <FaBuilding className="text-3xl" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm font-medium text-blue-600 mb-1">Total Services</div>
                            <div className="text-3xl font-bold text-blue-800">{services.length}</div>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <FaPalette className="text-xl text-blue-600" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm text-blue-600">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                        Active Services
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm font-medium text-green-600 mb-1">Total Decorators</div>
                            <div className="text-3xl font-bold text-green-800">{decorators.length}</div>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <FaUserTie className="text-xl text-green-600" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm text-green-600">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        Registered Skilled Professionals
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-orange-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm font-medium text-orange-600 mb-1">Total Bookings</div>
                            <div className="text-3xl font-bold text-orange-800">{bookings.length}</div>
                        </div>
                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                            <FaClipboardList className="text-xl text-orange-600" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm text-orange-600">
                        <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                        Customer Orders
                    </div>
                </div>
            </div>

            {/* Latest Services Section */}
            <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-gray-800 flex items-center">
                        <FaStar className="mr-3 text-yellow-500" /> 
                        Recent Services
                    </h3>
                    <Link 
                        to="manage-services" 
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        View All Services →
                    </Link>
                </div>
                
                {services.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FaPalette className="text-2xl text-gray-400" />
                        </div>
                        <p className="text-gray-500">No services found</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 gap-6">
                        {services.slice(0, 4).map((s, index) => (
                            <div key={s._id} className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-purple-200 group">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1">
                                        <h4 className="font-bold text-lg text-gray-800 mb-1 group-hover:text-purple-600 transition-colors">
                                            {s.service_name}
                                        </h4>
                                        <div className="flex items-center text-sm text-gray-500 mb-2">
                                            <FaTag className="mr-2 text-xs text-gray-400" />
                                            <span>Category: {s.category}</span>
                                        </div>
                                    </div>
                                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                        {index + 1}
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center text-lg font-bold text-green-600">
                                        <FaDollarSign className="mr-1 text-sm text-green-500" />
                                        <span>BDT {s.cost}</span>
                                    </div>
                                    <div className="text-xs text-gray-400 font-mono bg-gray-100 px-2 py-1 rounded">
                                        {s._id ? s._id.substring(0, 8) : 'N/A'}...
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminDashboardHome;