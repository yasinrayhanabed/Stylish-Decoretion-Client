import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Services from "./pages/Services";
import ServiceDetails from "./pages/ServiceDetails";
import BookingPage from "./pages/BookingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import About from "./pages/About";
import AddService from "./pages/Dashboard/AddService";
import Contact from "./pages/Contact";
import UserDashboard from "./pages/Dashboard/UserDashboard";
import AdminDashboard from "./pages/Dashboard/AdminDashboard";
import DecoratorDashboard from "./pages/Dashboard/DecoratorDashboard";
import { ToastContainer } from "react-toastify";

function PrivateRoute({ children, roles = [] }) {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;
  if (!token) return <Navigate to="/login" replace />;
  if (roles.length && (!user || !roles.includes(user.role)))
    return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:id" element={<ServiceDetails />} />
          <Route
            path="/booking/:id"
            element={
              <PrivateRoute>
                <BookingPage />
              </PrivateRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route
            path="/dashboard/user"
            element={
              <PrivateRoute>
                <UserDashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/dashboard/admin/add-service"
            element={
              <PrivateRoute roles={["admin"]}>
                <AddService />
              </PrivateRoute>
            }
          />

          <Route
            path="/dashboard/admin"
            element={
              <PrivateRoute roles={["admin"]}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard/decorator"
            element={
              <PrivateRoute roles={["decorator"]}>
                <DecoratorDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="*"
            element={
              <div className="text-center py-20">404 - Page not found</div>
            }
          />
        </Routes>
      </main>
      <Footer />
      <ToastContainer position="top-right" />
    </div>
  );
}
