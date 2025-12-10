import React from 'react';
import { NavLink, Outlet } from 'react-router-dom'; 

const getNavLinkClass = ({ isActive }) =>
    `w-full block py-2 px-3 text-sm transition duration-150 
    ${isActive 
        ? "text-blue-600 font-bold bg-base-300 rounded-lg shadow-inner border-l-4 border-blue-600" 
        : "text-gray-600 hover:text-blue-500 hover:bg-base-300 rounded-lg"
    }`;


export default function AdminDashboard() {

  return (
    <div className="flex h-screen w-full">
        

      <aside className="w-64 bg-gray-100 p-4 shadow-xl flex-shrink-0"> 
        <h2 className="text-xl font-bold mb-6 text-blue-500">Admin Panel</h2>
     
        <ul className="space-y-1">

            <li>
                <NavLink 
                    to="/dashboard/admin" 
                    end 
                    className={getNavLinkClass}
                >
                    Dashboard Home
                </NavLink>
            </li>
           
            <li className="menu-title text-sm font-semibold text-gray-500 pt-4 pb-1">Management</li>

            <li>
                <NavLink 
                    to="manage-users" 
                    className={getNavLinkClass}
                >
                    Manage Users
                </NavLink>
            </li>

            <li>
                <NavLink 
                    to="manage-services" 
                    className={getNavLinkClass}
                >
                    Manage Services & Packages
                </NavLink>
            </li>

            <li>
                <NavLink 
                    to="manage-decorators" 
                    className={getNavLinkClass}
                >
                    Manage Decorators
                </NavLink>
            </li>

            <li>
                <NavLink 
                    to="manage-bookings" 
                    className={getNavLinkClass}
                >
                    Manage Bookings
                </NavLink>
            </li>

            <li className="menu-title text-sm font-semibold text-gray-500 pt-4 pb-1">Analytics</li>

            <li>
                <NavLink 
                    to="analytics" 
                    className={getNavLinkClass}
                >
                    Analytics & Revenue
                </NavLink>
            </li>

        </ul>
      </aside>

      <main className="flex-grow p-8 bg-white overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}