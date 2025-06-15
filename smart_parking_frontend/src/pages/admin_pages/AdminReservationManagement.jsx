import { useEffect, useState } from "react";
import axiosInstance from "../../services/axios";

const AdminReservationManagement = () => {
  const [reservations, setReservations] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  // Fetch all reservations on component mount
  useEffect(() => {
    fetchReservations();
  }, []);

  // Fetch reservation data from backend
  const fetchReservations = async () => {
    try {
      const res = await axiosInstance.get("/api/reservations/all/");
      setReservations(res.data);
    } catch (err) {
      console.error("Failed to fetch reservations", err);
    } finally {
      setLoading(false);
    }
  };

  // Approve a reservation if it has a receipt
  const handleApprove = async (id, receipt) => {
    if (!receipt) {
      alert("Cannot approve without receipt.");
      return;
    }

    try {
      await axiosInstance.post(`/api/reservations/${id}/approve/`);
      fetchReservations(); // Refresh data after update
    } catch (err) {
      console.error("Approval failed:", err);
      alert("Failed to approve reservation.");
    }
  };

  // Cancel a reservation
  const handleCancel = async (id) => {
    try {
      await axiosInstance.put(`/api/reservations/${id}/status/`, {
        status: "Cancelled",
      });
      fetchReservations(); // Refresh data after update
    } catch (err) {
      console.error("Cancellation failed:", err);
      alert("Failed to cancel reservation.");
    }
  };

  // Filter reservations based on selected status
  const filteredReservations =
    filter === "All"
      ? reservations
      : reservations.filter((r) => r.status === filter);

  const statusOptions = [
    "All",
    "Pending",
    "Processing",
    "Reserved",
    "Active",
    "Overdue",
    "Checked-out",
    "Cancelled",
    "Complete",
  ];

  if (loading) {
    return <div className="p-6">Loading reservations...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Reservation Management</h1>

      {/* Filter Dropdown */}
      <div className="mb-4">
        <label className="mr-2 font-semibold">Filter by Status:</label>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded px-2 py-1"
        >
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      {/* Reservation Table */}
      {filteredReservations.length === 0 ? (
        <p>No reservations found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded">
            <thead>
              <tr className="bg-gray-200 text-gray-700 text-left">
                <th className="py-2 px-4">User</th>
                <th className="py-2 px-4">Slot</th>
                <th className="py-2 px-4">Location</th>
                <th className="py-2 px-4">Time</th>
                <th className="py-2 px-4">Vehicle</th>
                <th className="py-2 px-4">Status</th>
                <th className="py-2 px-4">Receipt</th>
                <th className="py-2 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReservations.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="py-2 px-4">{r.user_full_name}</td>
                  <td className="py-2 px-4">{r.slot}</td>
                  <td className="py-2 px-4">{r.location?.name}</td>
                  <td className="py-2 px-4">
                    {new Date(r.start_time).toLocaleString()}
                    <br />
                    → {new Date(r.end_time).toLocaleString()}
                  </td>
                  <td className="py-2 px-4">
                    {r.vehicle_make} {r.vehicle_model}
                    <br />
                    {r.plate_number} ({r.vehicle_type})
                  </td>
                  <td className="py-2 px-4">{r.status}</td>
                  <td className="py-2 px-4">
                    {r.receipt ? (
                      <a
                        href={r.receipt}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline"
                      >
                        View
                      </a>
                    ) : (
                      <span className="text-gray-500">None</span>
                    )}
                  </td>
                  <td className="py-2 px-4 space-x-2">
                    {r.status === "Processing" && (
                      <button
                        onClick={() => handleApprove(r.id, r.receipt)}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                      >
                        Approve
                      </button>
                    )}
                    {r.status !== "Cancelled" && (
                      <button
                        onClick={() => handleCancel(r.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminReservationManagement;
