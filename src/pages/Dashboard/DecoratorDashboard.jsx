import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import Spinner from "../../components/Spinner";

export default function DecoratorDashboard() {
  const [bookings, setBookings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reloadTrigger, setReloadTrigger] = useState(0);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleUpdateStatus = async (bookingId, newStatus) => {
    if (
      !window.confirm(`Are you sure you want to change status to ${newStatus}?`)
    )
      return;
    try {
      const response = await API.put(`/bookings/${bookingId}`, {
        status: newStatus,
      });
      if (response.data.success) {
        alert(`Status updated to ${newStatus}`);
        setReloadTrigger((prev) => prev + 1); // ডেটা রিফ্রেশ করার জন্য trigger আপডেট
      } else {
        alert("Failed to update status.");
      }
    } catch (err) {
      alert("Status update failed due to server error.");
      console.error("Status update failed:", err);
    }
  };

 useEffect(() => {
        const fetchAssignedBookings = () => { 
            setLoading(true);

            API.get('/bookings/assigned') 
                .then(r => setBookings(r.data || []))
                .catch(err => {
                    console.error("Error fetching assigned bookings:", err);
                    setBookings([]);
                })
                .finally(() => setLoading(false));
        };
        
        // 💡 এই অংশটি পরিবর্তন করা হয়েছে:
        if (user.id) {
            fetchAssignedBookings();
        } else {
            // যদি user.id না থাকে, তবে লোডিং বন্ধ করে ডেটা সেট করে দেওয়া হয়
            setLoading(false); 
            setBookings([]);
        }
}, [user.id, reloadTrigger]); 

  if (loading || bookings === null) return <Spinner />;

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold mb-6 text-primary">
        🎨 Decorator Dashboard
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded shadow font-semibold text-lg">
          Assigned Projects: {bookings.length}
        </div>
      </div>

      <section className="mt-8">
        <h3 className="text-xl font-semibold mb-4 border-b pb-2">
          My Assigned Bookings
        </h3>

        {bookings.length === 0 ? (
          <div className="text-center p-6 bg-yellow-50 rounded-lg text-gray-600">
            No projects currently assigned to you.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((b) => (
              <div
                key={b._id}
                className="p-4 bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300"
              >
                <div className="font-bold text-xl text-indigo-600">
                  {b.service_name}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  Customer: {b.userName}
                </div>
                <div className="text-sm text-gray-500">
                  Date: {new Date(b.date).toLocaleDateString()}
                </div>

                <div className={`mt-3 font-extrabold text-lg`}>
                  Status:
                  <span
                    className={`ml-2 px-2 py-1 rounded-full text-white ${
                      b.status === "Complete"
                        ? "bg-green-500"
                        : b.status === "Processing"
                        ? "bg-orange-500"
                        : "bg-red-500"
                    }`}
                  >
                    {b.status}
                  </span>
                </div>

                <div className="mt-4 space-x-2">
                  <button
                    className="btn btn-sm btn-warning text-white"
                    disabled={
                      b.status === "Processing" || b.status === "Complete"
                    }
                    onClick={() => handleUpdateStatus(b._id, "Processing")}
                  >
                    Mark Processing
                  </button>
                  <button
                    className="btn btn-sm btn-success text-white"
                    disabled={b.status === "Complete"}
                    onClick={() => handleUpdateStatus(b._id, "Complete")}
                  >
                    Mark Complete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
