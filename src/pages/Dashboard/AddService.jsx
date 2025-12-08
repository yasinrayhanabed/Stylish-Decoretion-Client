import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import { toast } from "react-toastify";

export default function AddService() {
  const nav = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (!user || user.role !== "admin") nav("/");
  }, [user, nav]);

  const [serviceName, setServiceName] = React.useState("");
  const [cost, setCost] = React.useState("");
  const [unit, setUnit] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const service = {
        service_name: serviceName,
        cost: Number(cost),
        unit,
        category,
        description,
        createdByEmail: user.email,
      };

      const res = await API.post("/services", service);
      if(res.data.success){
        toast.success("Service added successfully!");
        setServiceName(""); setCost(""); setUnit(""); setCategory(""); setDescription("");
      } else toast.error("Failed to add service");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-md mt-10">
      <h2 className="text-2xl font-bold mb-6">Add New Service</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold">Service Name</label>
          <input type="text" value={serviceName} onChange={e=>setServiceName(e.target.value)} className="w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label className="block font-semibold">Cost (BDT)</label>
          <input type="number" value={cost} onChange={e=>setCost(e.target.value)} className="w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label className="block font-semibold">Unit</label>
          <input type="text" value={unit} onChange={e=>setUnit(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="per event / per hour" required />
        </div>
        <div>
          <label className="block font-semibold">Category</label>
          <select value={category} onChange={e=>setCategory(e.target.value)} className="w-full border rounded px-3 py-2" required>
            <option value="">Select Category</option>
            <option value="wedding">Wedding</option>
            <option value="home">Home</option>
            <option value="corporate">Corporate</option>
            <option value="seminar">Seminar</option>
          </select>
        </div>
        <div>
          <label className="block font-semibold">Description</label>
          <textarea value={description} onChange={e=>setDescription(e.target.value)} className="w-full border rounded px-3 py-2" rows="4" required></textarea>
        </div>
        <button type="submit" disabled={loading} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
          {loading ? "Adding..." : "Add Service"}
        </button>
      </form>
    </div>
  );
}
