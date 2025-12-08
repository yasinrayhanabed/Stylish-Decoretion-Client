import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import { toast } from "react-toastify";

export default function AddService() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (!user || user.role !== "admin") navigate("/");
  }, [user, navigate]);

  const [serviceName, setServiceName] = useState("");
  const [cost, setCost] = useState("");
  const [unit, setUnit] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState(null); // image field
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const serviceData = new FormData(); // use FormData for image
      serviceData.append("service_name", serviceName);
      serviceData.append("cost", Number(cost));
      serviceData.append("unit", unit);
      serviceData.append("category", category);
      serviceData.append("description", description);
      if (photo) serviceData.append("photo", photo); // add photo if selected

      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You are not authenticated. Please login again.");
        setLoading(false);
        return;
      }

      const response = await API.post("/services", serviceData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data", // important for file upload
        },
      });

      if (response.data.success) {
        toast.success("Service added successfully!");
        setServiceName("");
        setCost("");
        setUnit("");
        setCategory("");
        setDescription("");
        setPhoto(null);
      } else {
        toast.error("Failed to add service");
      }
    } catch (error) {
      console.error(error.response?.data || error.message || error);
      toast.error(error.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-base-200 shadow-md rounded-md mt-10">
      <h2 className="text-2xl font-bold mx-auto flex items-center justify-center mb-6">Add a New Service</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold">Service Name</label>
          <input
            type="text"
            value={serviceName}
            onChange={(e) => setServiceName(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="Enter service name"
            required
          />
        </div>
        <div>
          <label className="block font-semibold">Cost (BDT)</label>
          <input
            type="number"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="Enter cost in BDT"
            required
          />
        </div>
        <div>
          <label className="block font-semibold">Unit</label>
          <input
            type="text"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="e.g., per event / per hour"
            required
          />
        </div>
        <div>
          <label className="block font-semibold">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          >
            <option value="">Select a category</option>
            <option value="wedding" className="text-gray-800">Wedding</option>
            <option value="home" className="text-gray-800">Home</option>
            <option value="corporate" className="text-gray-800">Corporate</option>
            <option value="seminar" className="text-gray-800">Seminar</option>
          </select>
        </div>
        <div>
          <label className="block font-semibold">Service Photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPhoto(e.target.files[0])}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block font-semibold">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded px-3 py-2"
            rows="4"
            placeholder="Write a short description of the service"
            required
          ></textarea>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="bg-violet-600 text-white px-6 py-2 rounded flex items-center justify-center hover:bg-violet-700"
        >
          {loading ? "Adding..." : "Add Service"}
        </button>
      </form>
    </div>
  );
}
