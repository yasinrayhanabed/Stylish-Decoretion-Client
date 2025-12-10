import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Services from "./pages/Services";
import ServiceDetails from "./pages/ServiceDetails";
import BookingPage from "./pages/BookingPage";
import PaymentPage from "./pages/PaymentPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import About from "./pages/About";
import Contact from "./pages/Contact";
import AddService from "./pages/Dashboard/AddService";
import UserDashboard from "./pages/Dashboard/UserDashboard"; // এটি এখন ইউজার ড্যাশবোর্ড লেআউট হিসেবে কাজ করবে
import AdminDashboard from "./pages/Dashboard/AdminDashboard"; 
import DecoratorDashboard from "./pages/Dashboard/DecoratorDashboard";
import AdminManageUsers from "./pages/Dashboard/AdminManageUsers";
import AdminManageServices from "./pages/Dashboard/AdminManageServices";
import AdminManageDecorators from "./pages/Dashboard/AdminManageDecorators";
import AdminManageBookings from "./pages/Dashboard/AdminManageBookings";
import AdminAnalytics from "./pages/Dashboard/AdminAnalytics";
import AdminDashboardHome from "./pages/Dashboard/AdminDashboardHome";
// নতুন ইমপোর্ট: পেমেন্ট সফলতার পেজ (আগের উত্তরে বানানো হয়েছে)
import PaymentSuccessPage from "./pages/PaymentSuccessPage"; 
// বুকিং পেজ ইমপোর্ট করুন (যদি এটি আলাদা ফাইল হয়)
import MyBookingsPage from "./pages/Dashboard/MyBookingsPage"; 
import { ToastContainer } from "react-toastify";


// প্রাইভেট রুট কম্পোনেন্ট
function PrivateRoute({ children, roles = [] }) {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  // 1. টোকেন না থাকলে লগইন এ রিডিরেক্ট
  if (!token) return <Navigate to="/login" replace />;

  // 2. রোল চেক: ইউজার ডেটা না থাকলে বা রোলের সাথে না মিললে
  if (roles.length && (!user || !roles.includes(user.role)))
    return <Navigate to="/" replace />; 

  return children;
}

// মূল অ্যাপ কম্পোনেন্ট
export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-6">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:id" element={<ServiceDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          
          {/* User Protected Routes */}
          <Route
            path="/booking/:id" 
            element={
              <PrivateRoute roles={["user"]}>
                <BookingPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/payment/:bookingId" 
            element={
              <PrivateRoute roles={["user"]}>
                <PaymentPage />
              </PrivateRoute>
            }
          />
          
          {/* Payment Success Route (পেমেন্ট সফলতার পর ইউজার এখানে আসে) */}
          {/* এটি সাধারণত সুরক্ষিত রুট হয় না, কারণ Stripe বা পেমেন্ট গেটওয়ে এটিকে কল করে */}
          <Route 
            path="/payment/success/:transactionId" 
            element={<PaymentSuccessPage />} 
          />

          {/* User Dashboard - নেস্টেড রুট ব্যবহার করা হলো */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute roles={["user"]}>
                <UserDashboard />
              </PrivateRoute>
            }
          >
             {/* default route for /dashboard (UserDashboard Home) */}
             {/* 💡 MyBookingsPage যোগ করা হলো */}
             <Route index element={<MyBookingsPage />} />
             <Route path="my-bookings" element={<MyBookingsPage />} />
             {/* এখানে ভবিষ্যতে অন্যান্য ইউজার রুট যোগ হবে (যেমন Profile, Settings) */}
          </Route>

          {/* Decorator Dashboard */}
          <Route
            path="/dashboard/decorator"
            element={
              <PrivateRoute roles={["decorator"]}>
                <DecoratorDashboard />
              </PrivateRoute>
            }
          />

          {/* Admin Dashboard - নেস্টেড রুট ঠিক রাখা হলো */}
          <Route
            path="/dashboard/admin"
            element={
              <PrivateRoute roles={["admin"]}>
                <AdminDashboard />
              </PrivateRoute>
            }
          >
            <Route index element={<AdminDashboardHome />} /> 
            <Route path="manage-users" element={<AdminManageUsers />} />
            <Route path="manage-services" element={<AdminManageServices />} />
            <Route path="add-service" element={<AddService />} />
            <Route path="manage-decorators" element={<AdminManageDecorators />} />
            <Route path="manage-bookings" element={<AdminManageBookings />} />
            <Route path="analytics" element={<AdminAnalytics />} />
          </Route>
          
          {/* Fallback 404 Route */}
          <Route
            path="*"
            element={
              <div className="text-center text-3xl text-red-700 font-bold py-20">
                404 - Page not found
              </div>
            }
          />
        </Routes>
      </main>
      <Footer />
      <ToastContainer position="top-right" />
    </div>
  );
}