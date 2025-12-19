import React from "react";
import { Link, NavLink } from "react-router-dom";
import useAuth from "../hooks/useAuth.jsx";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  // Determine the correct dashboard path based on user role
  const getDashboardPath = () => {
    if (!user) return "/dashboard";
    switch (user.role) {
      case "admin":
        return "/dashboard/admin";
      case "decorator":
        return "/dashboard/decorator-dashboard";
      default:
        return "/dashboard";
    }
  };

  return (
    <div className="navbar bg-base-200 shadow">
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              ></path>
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  isActive ? "bg-primary text-primary-content" : ""
                }
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/services"
                className={({ isActive }) =>
                  isActive ? "bg-primary text-primary-content" : ""
                }
              >
                Services
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  isActive ? "bg-primary text-primary-content" : ""
                }
              >
                About
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  isActive ? "bg-primary text-primary-content" : ""
                }
              >
                Contact
              </NavLink>
            </li>
          </ul>
        </div>
        <Link to="/" className="btn btn-ghost normal-case text-xl">
          🎨 StyleDecor
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                isActive
                  ? "bg-primary text-primary-content font-semibold"
                  : "hover:bg-base-300"
              }
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/services"
              className={({ isActive }) =>
                isActive
                  ? "bg-primary text-primary-content font-semibold"
                  : "hover:bg-base-300"
              }
            >
              Services
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                isActive
                  ? "bg-primary text-primary-content font-semibold"
                  : "hover:bg-base-300"
              }
            >
              About
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                isActive
                  ? "bg-primary text-primary-content font-semibold"
                  : "hover:bg-base-300"
              }
            >
              Contact
            </NavLink>
          </li>
        </ul>
      </div>
      <div className="navbar-end">
        {isAuthenticated && user ? (
          <>
            <Link
              to={getDashboardPath()}
              className="btn btn-primary btn-sm mr-2"
            >
              Dashboard
            </Link>
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                  <img
                    src={user.photo || "https://i.pravatar.cc/40"}
                    alt="Profile"
                  />
                </div>
              </label>
              <ul
                tabIndex={0}
                className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
              >
                <li>
                  <span className="font-semibold">{user.name}</span>
                </li>
                <div className="divider my-1"></div>
                {user.role === "admin" ? (
                  <>
                    <li>
                      <Link to="/dashboard/admin">Admin Dashboard</Link>
                    </li>
                  </>
                ) : user.role === "decorator" ? (
                  <li>
                    <Link to="/dashboard/decorator-dashboard">
                      Decorator Dashboard
                    </Link>
                  </li>
                ) : (
                  <>
                    <li>
                      <Link to="/dashboard">My Dashboard</Link>
                    </li>
                    <li>
                      <Link to="/dashboard/profile">My Profile</Link>
                    </li>
                  </>
                )}
                <div className="divider my-1"></div>
                <li>
                  <button onClick={handleLogout} className="text-red-500">
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </>
        ) : (
          <>
            <Link className="btn btn-ghost" to="/login">
              Login
            </Link>
            <Link className="btn btn-primary ml-2" to="/register">
              Register
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
