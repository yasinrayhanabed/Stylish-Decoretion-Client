import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; 
import API from "../../api/axios"; 
import Spinner from "../../components/Spinner"; 
import { toast } from "react-toastify"; 

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
                const decoratorsRes = await API.get('/admin/decorators'); 
                setDecorators(decoratorsRes.data || []);
            } catch (err) {
                const status = err.response?.status;
                if (status === 401 || status === 403) {
                    setError("Authorization Failed: Decorator data requires Admin role (403). Check user role in DB.");
                    toast.error("Admin role required for Decorator data.");
                } else if (status === 404) {
                    setError("Route Not Found (404): Check if '/api/admin/decorators' is defined in server.js.");
                } else {
                    setError(`Error loading Decorators: ${err.message}.`);
                    toast.error("Failed to load Decorators data.");
                }
                console.error("Decorator data fetch error:", err.response?.data || err.message);
            }

        
            try {
             
                const bookingsRes = await API.get('/bookings'); 
                setBookings(bookingsRes.data || []);
            } catch (err) {
                const status = err.response?.status;
                 if (status === 401 || status === 403) {
                    setError("Authorization Failed: Booking data requires Admin role (403). Check user role in DB.");
                    toast.error("Admin role required for Booking data.");
                } else if (status === 404) {
                    setError("Route Not Found (404): Check if '/api/bookings' is defined in server.js.");
                } else {
                    setError(`Error loading Bookings: ${err.message}.`);
                    toast.error("Failed to load Bookings data.");
                }
                console.error("Booking data fetch error:", err.response?.data || err.message);
            }
            
            setLoading(false);
        };

        fetchData();
    }, []);

    if (loading) return <Spinner />;

    if (error) {
 
        return (
            <div className="p-6 bg-red-100 text-red-700 rounded-lg shadow-md font-semibold">
                <h2 className="text-xl mb-2"> Dashboard Data Error</h2>
                <p>{error}</p>
            </div>
        );
    }
    
    return (
        <div>
            <h1 className="text-3xl font-bold text-blue-600 mb-6">Admin Overview</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-blue-100 text-blue-800 rounded-lg shadow-md">
                    <div className="font-semibold text-lg">Total Services</div>
                    <div className="text-3xl font-bold">{services.length}</div>
                </div>
                <div className="p-6 bg-green-100 text-green-800 rounded-lg shadow-md">
                    <div className="font-semibold text-lg">Total Decorators</div>
                    <div className="text-3xl font-bold">{decorators.length}</div> 
                </div>
                <div className="p-6 bg-yellow-100 text-yellow-800 rounded-lg shadow-md">
                    <div className="font-semibold text-lg">Total Bookings</div>
                    <div className="text-3xl font-bold">{bookings.length}</div>
                </div>
            </div>

            <section className="mt-8">
                <h3 className="text-2xl text-blue-500 font-bold mb-4">Latest Services</h3>
                <div className="grid md:grid-cols-2 gap-4">
                    {services.slice(0, 4).map(s => (
                        <div key={s._id} className="p-4 bg-gray-50 rounded-lg shadow border border-gray-200">
                            <div className="font-semibold text-gray-800 text-lg">{s.service_name}</div>
                            <div className="text-sm text-gray-600">Category: {s.category}</div>
                            <div className="text-md font-medium">BDT {s.cost}</div>
                        </div>
                    ))}
                </div>
                <Link to="manage-services" className="btn btn-primary mt-6">View All Services</Link>
            </section>
        </div>
    );
}

export default AdminDashboardHome;