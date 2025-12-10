import React from "react";
import { Link, useNavigate, NavLink } from "react-router-dom";

function getUser() {
  const u = localStorage.getItem("user");
  return u ? JSON.parse(u) : null;
}

export default function Navbar() {
  const user = getUser();
  const nav = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    nav("/login");
  };

  return (
    <div className="navbar bg-base-200 shadow">
      <div className="navbar-start">
        <Link to="/" className="btn btn-ghost normal-case text-xl">
          StyleDecor
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li className="">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `text-gray-200 hover:text-blue-500 transition duration-150 p-2 
        ${isActive ? "text-blue-500 font-bold border-b-2 border-blue-500 rounded-2xl" : ""}`
              }
            >
              Home
            </NavLink>
          </li>
          <NavLink
              to="/Services"
              className={({ isActive }) =>
                `text-gray-200 hover:text-blue-500 transition duration-150 p-2 
        ${isActive ? "text-blue-500 font-bold border-b-2 border-blue-500 rounded-2xl" : ""}`
              }
            >
              Services
            </NavLink>
          <li>
            <NavLink
              to="/About"
              className={({ isActive }) =>
                `text-gray-200 hover:text-blue-500 transition duration-150 p-2 
        ${isActive ? "text-blue-500 font-bold border-b-2 border-blue-500 rounded-2xl" : ""}`
              }
            >
              About
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/Contact"
              className={({ isActive }) =>
                `text-gray-200 hover:text-blue-500 transition duration-150 p-2 
        ${isActive ? "text-blue-500 font-bold border-b-2 border-blue-500 rounded-2xl" : ""}`
              }
            >
              Contact
            </NavLink>
          </li>
        </ul>
      </div>
      <div className="navbar-end">
        {user ? (
          <div className="dropdown dropdown-end">
            <label
              tabIndex="0"
              className="btn btn-ghost flex items-center gap-2"
            >
              <img
                src={user.photo || "https://i.pravatar.cc/40"}
                alt="avatar"
                className="rounded-full w-8 h-8"
              />
              {user.name}
            </label>
            <ul
              tabIndex="0"
              className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <Link to={`/dashboard/${user.role}`}>
                  {user.role === "admin"
                    ? "Admin Dashboard"
                    : user.role === "decorator"
                    ? "Decorator Dashboard"
                    : "My Dashboard"}
                </Link>
              </li>

              {user.role === "admin" && (
                <>
                  <li>
                    <Link to="/dashboard/admin/add-service">Add Service</Link>
                  </li>
                </>
              )}

              <li>
                <button onClick={handleLogout} className="text-red-500">
                  Logout
                </button>
              </li>
            </ul>
          </div>
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
