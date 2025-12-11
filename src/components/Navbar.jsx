import React from "react";
import { Link, NavLink } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="navbar bg-base-200 shadow">
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16"></path>
            </svg>
          </label>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
            <li><NavLink to="/">Home</NavLink></li>
            <li><NavLink to="/services">Services</NavLink></li>
            <li><NavLink to="/about">About</NavLink></li>
            <li><NavLink to="/contact">Contact</NavLink></li>
          </ul>
        </div>
        <Link to="/" className="btn btn-ghost normal-case text-xl">
          🎨 StyleDecor
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li><NavLink to="/" className={({ isActive }) => isActive ? "active" : ""}>Home</NavLink></li>
          <li><NavLink to="/services" className={({ isActive }) => isActive ? "active" : ""}>Services</NavLink></li>
          <li><NavLink to="/about" className={({ isActive }) => isActive ? "active" : ""}>About</NavLink></li>
          <li><NavLink to="/contact" className={({ isActive }) => isActive ? "active" : ""}>Contact</NavLink></li>
        </ul>
      </div>
      <div className="navbar-end">
        {isAuthenticated && user ? (
          <>
            <Link to="/dashboard" className="btn btn-primary btn-sm mr-2">
              Dashboard
            </Link>
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                  <img src={user.photo || "https://i.pravatar.cc/40"} alt="Profile" />
                </div>
              </label>
              <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                <li><span className="font-semibold">{user.name}</span></li>
                <div className="divider my-1"></div>
                {user.role === "admin" ? (
                  <>
                    <li><Link to="/dashboard/admin">Admin Dashboard</Link></li>
                    <li><Link to="/dashboard/admin/manage-services">Manage Services</Link></li>
                    <li><Link to="/dashboard/admin/manage-users">Manage Users</Link></li>
                  </>
                ) : user.role === "decorator" ? (
                  <li><Link to="/dashboard/decorator">Decorator Dashboard</Link></li>
                ) : (
                  <>
                    <li><Link to="/dashboard">My Dashboard</Link></li>
                    <li><Link to="/dashboard/my-bookings">My Bookings</Link></li>
                    <li><Link to="/dashboard/profile">My Profile</Link></li>
                  </>
                )}
                <div className="divider my-1"></div>
                <li><button onClick={handleLogout} className="text-red-500">Logout</button></li>
              </ul>
            </div>
          </>
        ) : (
          <>
            <Link className="btn btn-ghost" to="/login">Login</Link>
            <Link className="btn btn-primary ml-2" to="/register">Register</Link>
          </>
        )}
      </div>
    </div>
  );
}
