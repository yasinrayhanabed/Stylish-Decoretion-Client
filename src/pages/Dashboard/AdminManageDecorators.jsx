import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import Spinner from "../../components/Spinner";

export default function AdminManageDecorators() {
  const [decorators, setDecorators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDecorators = async () => {
      try {
        const res = await API.get("/users");
        const allUsers = Array.isArray(res.data) ? res.data : [];
        const decoratorUsers = allUsers.filter(user => user.role === 'decorator');
        setDecorators(decoratorUsers);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch decorators:", err);
        setDecorators([]);
        setLoading(false);
      }
    };
    fetchDecorators();
  }, []);

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = !currentStatus;
    try {
      await API.put(`/users/${id}/role`, { role: newStatus ? 'decorator' : 'user' });
      setDecorators((prev) =>
        prev.map((d) => (d._id === id ? { ...d, isActive: newStatus } : d))
      );
    } catch (err) {
      console.error("Failed to toggle status:", err);
    }
  };

  if (loading) return <Spinner />;
  if (error) return <div className="text-center text-red-500 py-10">{error}</div>;

  return (
    <div className="p-4">
      <h2 className="text-3xl text-blue-600 font-bold mb-6">Manage Decorators</h2>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr className="text-gray-700">
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {decorators.map((decorator) => (
              <tr key={decorator._id}>
                <td className="text-gray-600">{decorator.name}</td>
                <td className="text-gray-600">{decorator.email}</td>
                <td>
                  <span className="badge badge-success">
                    Active
                  </span>
                </td>
                <td>
                  <button
                    onClick={() => handleToggleStatus(decorator._id, true)}
                    className="btn btn-sm btn-warning"
                  >
                    Remove Decorator
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}