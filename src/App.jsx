import { Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar.jsx";
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
import AnalyticsCharts from "./pages/Dashboard/AnalyticsCharts.jsx";
import RevenueMonitoring from "./pages/Dashboard/RevenueMonitoring.jsx";
import BusinessAnalytics from "./pages/Dashboard/BusinessAnalytics.jsx";
import MyBookingsPage from "./pages/Dashboard/MyBookingsPage.jsx";
import UserProfile from "./pages/Dashboard/UserProfile.jsx";
import UserDashboardHome from "./pages/Dashboard/UserDashboardHome.jsx";
import PaymentHistory from "./pages/Dashboard/PaymentHistory.jsx";
import MyEarnings from "./pages/Dashboard/MyEarnings.jsx";
import DecoratorRequest from "./pages/DecoratorRequest.jsx";
import AdminDecoratorRequests from "./pages/Dashboard/AdminDecoratorRequests.jsx";
import AdminServiceManager from "./pages/Dashboard/AdminServiceManager.jsx";

import PrivateRoute from "./routes/PrivateRoute.jsx";
import RoleGuard from "./components/RoleGuard.jsx";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:id" element={<ServiceDetails />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/coverage" element={<ServiceCoverageMap />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<PrivateRoute />}>
          <Route path="/booking/:serviceId" element={<BookingPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route
            path="/payment-success/:transactionId"
            element={<PaymentSuccessPage />}
          />

          <Route path="/dashboard" element={<UserDashboard />}>
            <Route index element={<UserDashboardHome />} />
            <Route path="my-bookings" element={<MyBookingsPage />} />
            <Route path="profile" element={<UserProfile />} />
            <Route path="payment-history" element={<PaymentHistory />} />
            <Route path="my-earnings" element={<MyEarnings />} />
            <Route path="become-decorator" element={<DecoratorRequest />} />
          </Route>

          <Route
            path="/dashboard/admin"
            element={
              <RoleGuard allowedRoles={["admin"]}>
                <AdminDashboard />
              </RoleGuard>
            }
          >
            <Route index element={<AdminDashboardHome />} />
            <Route path="add-service" element={<AddService />} />
            <Route path="manage-users" element={<AdminManageUsers />} />
            <Route path="manage-services" element={<AdminManageServices />} />
            <Route
              path="manage-decorators"
              element={<AdminManageDecorators />}
            />
            <Route path="manage-bookings" element={<AdminManageBookings />} />
            <Route
              path="decorator-requests"
              element={<AdminDecoratorRequests />}
            />
            <Route path="revenue-monitoring" element={<RevenueMonitoring />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="analytics-charts" element={<AnalyticsCharts />} />
            <Route path="business-analytics" element={<BusinessAnalytics />} />
            <Route path="service-manager" element={<AdminServiceManager />} />
          </Route>

          <Route
            path="/dashboard/decorator-dashboard"
            element={
              <RoleGuard allowedRoles={["decorator"]}>
                <DecoratorDashboard />
              </RoleGuard>
            }
          />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
