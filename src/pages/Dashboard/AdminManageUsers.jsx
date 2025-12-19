// src/pages/admin/AdminManageUsers.jsx (FIXED)
import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import Spinner from "../../components/Spinner";
import { toast } from "react-toastify";
import useAuth from "../../hooks/useAuth.jsx"; // 💡 Added useAuth for protection
import {
  FaUsers,
  FaUserShield,
  FaUserTie,
  FaUser,
  FaCrown,
  FaSpinner,
} from "react-icons/fa";

export default function AdminManageUsers() {
  const { user } = useAuth(); // Get user and loading state
  const [users, setUsers] = useState(null);
  const [loading, setLoading] = useState(false);
  const [changing, setChanging] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // GET /api/users - This should be a protected route on the server
      const res = await API.get("/users");
      setUsers(res.data || []);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      // A 403 error might occur if the server-side role check fails
      if (err.response?.status === 403) {
        toast.error("Access denied. Admin role required to manage users.");
      } else if (err.response?.status === 401) {
        toast.error("Authentication failed. Please login as admin.");
      } else {
        toast.error("Failed to load users. Please check server connection.");
      }
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [user]); // user state change-এ ফ্লো ট্রিগার হবে

  const updateRole = async (id, role) => {
    if (
      !window.confirm(
        `Are you sure you want to set role = "${role}" for this user?`
      )
    )
      return;

    // Prevent admin from demoting themselves (optional safety check)
    if (user._id === id && role !== "admin") {
      toast.error("Admin cannot demote themselves!");
      return;
    }

    try {
      setChanging(true);
      const res = await API.put(`/users/${id}/role`, { role }); // PUT /api/users/:id/role
      if (res.data?.success) {
        toast.success(`Role updated to ${role}`);
        await fetchUsers();
      } else {
        toast.error("Failed to update role");
      }
    } catch (err) {
      console.error("Update user role error:", err);
      toast.error(err.response?.data?.message || "Failed to update role");
    } finally {
      setChanging(false);
    }
  };

  if (loading || users === null) return <Spinner />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 p-4 md:p-6 overflow-x-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center">
              <FaUsers className="mr-3" />
              Manage Users ({users.length})
            </h1>
            <p className="text-blue-100 text-lg">
              Oversee and manage all user roles
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <FaUsers className="text-3xl" />
            </div>
          </div>
        </div>
      </div>

      {users.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-xl">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <FaUsers className="text-4xl text-gray-400" />
          </div>
          <h4 className="text-2xl font-bold text-gray-700 mb-3">
            No Users Found
          </h4>
          <p className="text-gray-500 text-lg">
            The system currently has no registered users.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {users.map((u) => (
            <div
              key={u._id}
              className="bg-white p-5 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <img
                  src={
                    u.photo ||
                    u.image ||
                    u.photoURL ||
                    "/uploads/default-user.png"
                  }
                  alt={u.name || u.email}
                  className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md"
                />
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                    <div>
                      <h3 className="font-bold text-xl text-gray-800">
                        {u.name || "No name"}
                      </h3>
                      <p className="text-sm text-gray-500">{u.email}</p>
                    </div>
                    <div
                      className={`mt-2 sm:mt-0 text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1.5 ${
                        u.role === "admin"
                          ? "bg-red-100 text-red-800"
                          : u.role === "decorator"
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {u.role === "admin" ? (
                        <FaCrown />
                      ) : u.role === "decorator" ? (
                        <FaUserTie />
                      ) : (
                        <FaUser />
                      )}
                      <span>{u.role}</span>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {u.role !== "decorator" ? (
                      <button
                        onClick={() => updateRole(u._id, "decorator")}
                        className="px-3 py-2 text-sm flex items-center gap-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:bg-gray-400"
                        disabled={changing || u._id === user._id}
                      >
                        <FaUserTie /> Make Decorator
                      </button>
                    ) : (
                      <button
                        onClick={() => updateRole(u._id, "user")}
                        className="px-3 py-2 text-sm flex items-center gap-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors disabled:bg-gray-400"
                        disabled={changing || u._id === user._id}
                      >
                        <FaUser /> Remove Decorator
                      </button>
                    )}
                    <button
                      onClick={() => updateRole(u._id, "admin")}
                      className="px-3 py-2 text-sm flex items-center gap-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:bg-gray-400"
                      disabled={changing || u.role === "admin"}
                      title="Promote to admin"
                    >
                      <FaUserShield /> Make Admin
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
