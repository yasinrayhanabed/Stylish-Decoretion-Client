import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import Spinner from "../../components/Spinner";

export default function AdminManageBookings() {
  const [bookings, setBookings] = useState([]);
  const [decorators, setDecorators] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookingsRes, decoratorsRes] = await Promise.all([
          API.get("/admin/bookings"),
          API.get("/admin/decorators"),
        ]);
        setBookings(bookingsRes.data);
        setDecorators(decoratorsRes.data.filter(d => d.isActive)); // শুধুমাত্র Active Decorator
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAssignDecorator = async (bookingId, decoratorId) => {
    try {
      await API.put(`/admin/bookings/${bookingId}/assign`, { decoratorId });
      setBookings((prev) =>
        prev.map((b) =>
          b._id === bookingId
            ? { ...b, assignedDecorator: decoratorId, status: 'Assigned' }
            : b
        )
      );
    } catch (err) {
      console.error("Failed to assign decorator:", err);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold mb-6">Manage Bookings</h2>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>User</th>
              <th>Service</th>
              <th>Payment Status</th>
              <th>Assigned To</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking._id}>
                <td>{booking._id.substring(0, 8)}...</td>
                <td>{booking.user?.name || "N/A"}</td>
                <td>{booking.service?.service_name || "N/A"}</td>
                <td>
                  <span
                    className={`badge ${
                      booking.isPaid ? "badge-success" : "badge-error"
                    }`}
                  >
                    {booking.isPaid ? "Paid" : "Pending"}
                  </span>
                </td>
                <td>
                  {booking.assignedDecorator ? (
                    decorators.find(d => d._id === booking.assignedDecorator)?.name || 'N/A'
                  ) : (
                    <span className="text-gray-500">Unassigned</span>
                  )}
                </td>
                <td>
                  {booking.isPaid && !booking.assignedDecorator && (
                    <select
                      className="select select-sm select-bordered w-full max-w-xs"
                      defaultValue=""
                      onChange={(e) =>
                        handleAssignDecorator(booking._id, e.target.value)
                      }
                    >
                      <option value="" disabled>
                        Assign Decorator
                      </option>
                      {decorators.map((d) => (
                        <option key={d._id} value={d._id}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}