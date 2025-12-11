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

// Booking and Payment Pages
import BookingPage from "./pages/BookingPage";
import CheckoutPage from "./pages/CheckoutPage";
import PaymentPage from "./pages/PaymentPage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";

// Dashboard Pages
import DecoratorDashboard from "./pages/Dashboard/DecoratorDashboard";
import AdminDashboard from "./pages/Dashboard/AdminDashboard";
import UserDashboard from "./pages/Dashboard/UserDashboard";
import AddService from "./pages/Dashboard/AddService";
import AdminManageUsers from "./pages/Dashboard/AdminManageUsers";
import AdminManageDecorators from "./pages/Dashboard/AdminManageDecorators";
import AdminManageBookings from "./pages/Dashboard/AdminManageBookings";
import AdminDashboardHome from "./pages/Dashboard/AdminDashboardHome";
import AdminAnalytics from "./pages/Dashboard/AdminAnalytics";
import MyBookingsPage from "./pages/Dashboard/MyBookingsPage";
import UserProfile from "./pages/Dashboard/UserProfile";

// Guards
import PrivateRoute from "./routes/PrivateRoute"; 

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/service/:id" element={<ServiceDetails />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
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
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/dashboard/my-bookings" element={<MyBookingsPage />} />
          <Route path="/dashboard/profile" element={<UserProfile />} />

          {/* Decorator Routes */}
          <Route path="/dashboard/decorator" element={<PrivateRoute requiredRole={['decorator', 'admin']}><DecoratorDashboard /></PrivateRoute>} />

          {/* Admin Routes */}
          <Route path="/dashboard/admin" element={<PrivateRoute requiredRole={['admin']}><AdminDashboard /></PrivateRoute>} /> 
          <Route path="/dashboard/admin/home" element={<PrivateRoute requiredRole={['admin']}><AdminDashboardHome /></PrivateRoute>} />
          <Route path="/dashboard/admin/add-service" element={<PrivateRoute requiredRole={['admin']}><AddService /></PrivateRoute>} />
          <Route path="/dashboard/admin/manage-users" element={<PrivateRoute requiredRole={['admin']}><AdminManageUsers /></PrivateRoute>} />
          <Route path="/dashboard/admin/manage-decorators" element={<PrivateRoute requiredRole={['admin']}><AdminManageDecorators /></PrivateRoute>} />
          <Route path="/dashboard/admin/manage-bookings" element={<PrivateRoute requiredRole={['admin']}><AdminManageBookings /></PrivateRoute>} />
          <Route path="/dashboard/admin/analytics" element={<PrivateRoute requiredRole={['admin']}><AdminAnalytics /></PrivateRoute>} />
          
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