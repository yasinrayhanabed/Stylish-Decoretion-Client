import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";

import Home from "./pages/Home.jsx";
import Services from "./pages/Services.jsx";
import ServiceDetails from "./pages/ServiceDetails.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import ServiceCoverageMap from "./pages/ServiceCoverageMap.jsx";

import BookingPage from "./pages/BookingPage.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";
import PaymentPage from "./pages/PaymentPage.jsx";
import PaymentSuccessPage from "./pages/PaymentSuccessPage.jsx";

import DecoratorDashboard from "./pages/Dashboard/DecoratorDashboard.jsx";
import AdminDashboard from "./pages/Dashboard/AdminDashboard.jsx";
import UserDashboard from "./pages/Dashboard/UserDashboard.jsx";
import AddService from "./pages/Dashboard/AddService.jsx";
import AdminManageUsers from "./pages/Dashboard/AdminManageUsers.jsx";
import AdminManageServices from "./pages/Dashboard/AdminManageServices.jsx";
import AdminManageDecorators from "./pages/Dashboard/AdminManageDecorators.jsx";
import AdminManageBookings from "./pages/Dashboard/AdminManageBookings.jsx";
import AdminDashboardHome from "./pages/Dashboard/AdminDashboardHome.jsx";
import AdminAnalytics from "./pages/Dashboard/AdminAnalytics.jsx";
import MyBookingsPage from "./pages/Dashboard/MyBookingsPage.jsx";
import UserProfile from "./pages/Dashboard/UserProfile.jsx";
import UserDashboardHome from "./pages/Dashboard/UserDashboardHome.jsx";
import PaymentHistory from "./pages/Dashboard/PaymentHistory.jsx";

import PrivateRoute from "./routes/PrivateRoute.jsx";
import RoleGuard from "./components/RoleGuard.jsx"; 

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:id" element={<ServiceDetails />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/coverage" element={<ServiceCoverageMap />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route element={<PrivateRoute />}>
          
          {/* Booking & Payment Routes */}
          <Route path="/booking/:serviceId" element={<BookingPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/payment-success" element={<PaymentSuccessPage />} />

          {/* User Dashboard Routes */}
          <Route path="/dashboard" element={<UserDashboard><UserDashboardHome /></UserDashboard>} />
          <Route path="/dashboard/my-bookings" element={<UserDashboard><MyBookingsPage /></UserDashboard>} />
          <Route path="/dashboard/profile" element={<UserDashboard><UserProfile /></UserDashboard>} />
          <Route path="/dashboard/payment-history" element={<UserDashboard><PaymentHistory /></UserDashboard>} />

          {/* Decorator Routes */}
          <Route path="/dashboard/decorator" element={
            <RoleGuard allowedRoles={['decorator', 'admin']}>
              <DecoratorDashboard />
            </RoleGuard>
          } />

          <Route path="/dashboard/admin" element={
            <RoleGuard allowedRoles={['admin']}>
              <AdminDashboard />
            </RoleGuard>
          }>
            <Route index element={<AdminDashboardHome />} />
            <Route path="add-service" element={<AddService />} />
            <Route path="manage-users" element={<AdminManageUsers />} />
            <Route path="manage-services" element={<AdminManageServices />} />
            <Route path="manage-decorators" element={<AdminManageDecorators />} />
            <Route path="manage-bookings" element={<AdminManageBookings />} />
            <Route path="analytics" element={<AdminAnalytics />} />
          </Route>
          
        </Route>
        {/* Protected Routes End */}

        {/* 404 Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;