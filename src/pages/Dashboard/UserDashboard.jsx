import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUser,
  FaCalendarCheck,
  FaSignOutAlt,
  FaHome,
  FaCreditCard,
  FaPalette,
  FaDollarSign,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import useAuth from "../../hooks/useAuth";
import ErrorBoundary from "../../components/ErrorBoundary";

const DashboardSidebar = ({ userRole }) => {
  const { user, logout } = useAuth();

  const getNavLinkClass = ({ isActive }) =>
    `flex items-center space-x-3 p-3 rounded-lg transition duration-150 ${
      isActive
        ? "bg-primary text-primary-content font-semibold"
        : "text-base-content/70 hover:bg-base-200 hover:text-base-content"
    }`;

  // Define links based on user role
  const userLinks = [
    { to: "/dashboard", end: true, icon: <FaHome />, label: "Dashboard" },
    { to: "/dashboard/profile", icon: <FaUser />, label: "My Profile" },
    {
      to: "/dashboard/my-bookings",
      icon: <FaCalendarCheck />,
      label: "My Bookings",
    },
    {
      to: "/dashboard/payment-history",
      icon: <FaCreditCard />,
      label: "Payment History",
    },
    {
      to: "/dashboard/become-decorator",
      icon: <FaPalette />,
      label: "Become Decorator",
    },
  ];

  const decoratorLinks = [
    {
      to: "/dashboard/decorator-dashboard",
      end: true,
      icon: <FaTachometerAlt />,
      label: "Decorator Dashboard",
    },
    { to: "/dashboard/profile", icon: <FaUser />, label: "My Profile" },
    {
      to: "/dashboard/my-earnings",
      icon: <FaDollarSign />,
      label: "My Earnings",
    },
  ];

  const links = userRole === "decorator" ? decoratorLinks : userLinks;

  return (
    <div className="h-full overflow-y-auto bg-base-200">
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-6 text-primary">
          {userRole === "decorator" ? "Decorator Menu" : "User Menu"}
        </h2>
        <nav className="space-y-2">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={getNavLinkClass}
            >
              {link.icon}
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-8 pt-4 border-t border-base-300 space-y-2">
          <NavLink
            to="/"
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-base-300 text-base-content/70 transition duration-150"
          >
            <FaHome />
            <span>Back to Home</span>
          </NavLink>
          <button
            onClick={logout}
            className="w-full flex items-center space-x-3 p-3 rounded-lg bg-error text-error-content hover:bg-error/80 font-semibold transition duration-150"
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default function UserDashboard({ content = null }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="relative min-h-screen md:flex">
      {/* Mobile Menu Button */}
      <div className="md:hidden flex justify-between items-center bg-base-200 p-4 shadow-md">
        <h2 className="text-xl font-bold text-primary">
          {user?.role === "decorator" ? "Decorator Menu" : "User Menu"}
        </h2>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          {isSidebarOpen ? (
            <FaTimes className="text-2xl" />
          ) : (
            <FaBars className="text-2xl" />
          )}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 bg-base-200 shadow-lg w-64 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0 transition-transform duration-300 ease-in-out z-30`}
      >
        <DashboardSidebar userRole={user?.role} />
      </aside>

      <main className="flex-1 bg-base-100">
        <div className="p-6">
          <ErrorBoundary>{content ? content : <Outlet />}</ErrorBoundary>
        </div>
      </main>
    </div>
  );
}
