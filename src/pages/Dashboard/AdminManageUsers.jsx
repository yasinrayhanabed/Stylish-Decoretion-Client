// src/pages/admin/AdminManageUsers.jsx
import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import Spinner from "../../components/Spinner";
import { toast } from "react-toastify";

export default function AdminManageUsers() {
  const [users, setUsers] = useState(null);
  const [loading, setLoading] = useState(false);
  const [changing, setChanging] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await API.get("/users"); // GET /api/users
      setUsers(res.data || []);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setUsers([]);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const updateRole = async (id, role) => {
    if (!window.confirm(`Are you sure you want to set role = "${role}" for this user?`)) return;
    try {
      setChanging(true);
      const res = await API.put(`/users/${id}/role`, { role }); // PUT /api/users/:id/role
      if (res.data?.success) {
        toast.success("Role updated");
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
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Manage Users</h2>

      {users.length === 0 ? (
        <div className="text-center py-16 text-gray-400">No users found.</div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {users.map((u) => (
            <div key={u._id} className="flex items-center gap-4 p-4 bg-base-200 rounded-lg shadow-sm">
              <img
                src={u.photo || u.image || u.photoURL || "/uploads/default-user.png"}
                alt={u.name || u.email}
                className="w-16 h-16 rounded-full object-cover border"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-lg">{u.name || "No name"}</div>
                    <div className="text-sm text-gray-500">{u.email}</div>
                  </div>
                  <div className="text-sm px-2 py-1 rounded">{u.role}</div>
                </div>
                <div className="mt-2 flex gap-2">
                  {u.role !== "decorator" ? (
                    <button
                      onClick={() => updateRole(u._id, "decorator")}
                      className="btn btn-sm btn-outline"
                      disabled={changing}
                    >
                      Make Decorator
                    </button>
                  ) : (
                    <button
                      onClick={() => updateRole(u._id, "user")}
                      className="btn btn-sm btn-warning"
                      disabled={changing}
                    >
                      Remove Decorator
                    </button>
                  )}
                  <button
                    onClick={() => updateRole(u._id, "admin")}
                    className="btn btn-sm btn-primary"
                    disabled={changing || u.role === "admin"}
                    title="Promote to admin"
                  >
                    Make Admin
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
