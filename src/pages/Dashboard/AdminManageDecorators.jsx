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
        const res = await API.get("/admin/decorators");
        setDecorators(res.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch decorators data.");
        setLoading(false);
      }
    };
    fetchDecorators();
  }, []);

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = !currentStatus;
    try {
      await API.put(`/admin/decorators/${id}/status`, { isActive: newStatus });
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
                  <span
                    className={`badge ${
                      decorator.isActive ? "badge-success" : "badge-error"
                    }`}
                  >
                    {decorator.isActive ? "Active" : "Disabled"}
                  </span>
                </td>
                <td>
                  <button
                    onClick={() =>
                      handleToggleStatus(decorator._id, decorator.isActive)
                    }
                    className={`btn btn-sm ${
                      decorator.isActive ? "btn-warning" : "btn-success"
                    }`}
                  >
                    {decorator.isActive ? "Disable" : "Approve"}
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