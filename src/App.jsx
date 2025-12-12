import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Public Pages
import Home from "./pages/Home";
import Services from "./pages/Services";
import ServiceDetails from "./pages/ServiceDetails";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFoundPage from "./pages/NotFoundPage";
import ServiceCoverageMap from "./pages/ServiceCoverageMap";

// Booking and Payment Pages
import BookingPage from "./pages/BookingPage";
import { Outlet } from "react-router-dom";
import CheckoutPage from "./pages/CheckoutPage";
import PaymentPage from "./pages/PaymentPage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";

// Dashboard Pages
import DecoratorDashboard from "./pages/Dashboard/DecoratorDashboard";
import AdminDashboard from "./pages/Dashboard/AdminDashboard";
import UserDashboard from "./pages/Dashboard/UserDashboard";
import AddService from "./pages/Dashboard/AddService";
import AdminManageUsers from "./pages/Dashboard/AdminManageUsers";
import AdminManageServices from "./pages/Dashboard/AdminManageServices";
import AdminManageDecorators from "./pages/Dashboard/AdminManageDecorators";
import AdminManageBookings from "./pages/Dashboard/AdminManageBookings";
import AdminDashboardHome from "./pages/Dashboard/AdminDashboardHome";
import AdminAnalytics from "./pages/Dashboard/AdminAnalytics";
import MyBookingsPage from "./pages/Dashboard/MyBookingsPage";
import UserProfile from "./pages/Dashboard/UserProfile";
import UserDashboardHome from "./pages/Dashboard/UserDashboardHome";
import PaymentHistory from "./pages/Dashboard/PaymentHistory";

// Guards
import PrivateRoute from "./routes/PrivateRoute";
import RoleGuard from "./components/RoleGuard"; 

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

          {/* Admin Routes */}
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