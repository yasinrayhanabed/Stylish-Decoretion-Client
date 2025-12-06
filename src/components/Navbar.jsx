import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function getUser() {
  const u = localStorage.getItem('user');
  return u ? JSON.parse(u) : null;
}
export default function Navbar(){
  const user = getUser();
  const nav = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    nav('/login');
  };
  return (
    <div className="navbar bg-base-200 shadow">
      <div className="navbar-start">
        <Link to="/" className="btn btn-ghost normal-case text-xl">StyleDecor</Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/services">Services</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/contact">Contact</Link></li>
        </ul>
      </div>
      <div className="navbar-end">
        {user ? (
          <div className="dropdown dropdown-end">
            <label tabIndex="0" className="btn btn-ghost">
              <img src={user.avatar || 'https://i.pravatar.cc/40'} alt="avatar" className="rounded-full w-8 h-8 mr-2"/>
              {user.name}
            </label>
            <ul tabIndex="0" className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
              <li><Link to={`/dashboard/${user.role}`}>Dashboard</Link></li>
              <li><button onClick={handleLogout}>Logout</button></li>
            </ul>
          </div>
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
