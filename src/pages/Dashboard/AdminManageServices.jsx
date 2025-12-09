import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import Spinner from "../../components/Spinner";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

export default function AdminManageServices() {
  const [services, setServices] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await API.get("/services");
      setServices(res.data || []);
    } catch (err) {
      console.error("Failed to fetch services:", err);
      setServices([]);
      toast.error("Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this service?")) return;
    try {
      setDeletingId(id);
      const res = await API.delete(`/services/${id}`);
      if (res.data?.success) {
        toast.success("Service deleted");
        setServices((prev) => prev.filter((s) => s._id !== id));
      } else {
        toast.error("Failed to delete");
      }
    } catch (err) {
      console.error("Delete service failed:", err);
      toast.error(err.response?.data?.message || "Failed to delete service");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading || services === null) return <Spinner />;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Manage Services</h2>
        <Link to="/dashboard/admin/add-service" className="btn btn-primary">Add Service</Link>
      </div>

      {services.length === 0 ? (
        <div className="text-center py-16 text-gray-400">No services available.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s) => (
            <div key={s._id} className="bg-base-200 rounded-lg overflow-hidden shadow">
              <img
                src={(s.images && s.images[0]) || s.photo || "/uploads/default-service.png"}
                alt={s.service_name}
                className="w-full h-44 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg">{s.service_name}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">{s.description}</p>
                <div className="flex items-center justify-between mt-4 gap-2">
                  <div className="text-sm font-semibold">BDT {s.cost}</div>
                  <div className="flex gap-2">
                    <Link to={`/services/${s._id}`} className="btn btn-sm btn-ghost">View</Link>
                    <button
                      onClick={() => handleDelete(s._id)}
                      className="btn btn-sm btn-error"
                      disabled={deletingId === s._id}
                    >
                      {deletingId === s._id ? "Deleting..." : "Delete"}
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
