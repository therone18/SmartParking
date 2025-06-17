import React, { useEffect, useState } from "react";
import axiosInstance from "../../services/axios";

const AdminReservationManagement = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approvingIds, setApprovingIds] = useState(new Set());

  // Fetch reservations
  const fetchReservations = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/api/reservations/all/");
      setReservations(res.data);
    } catch (error) {
      console.error("Failed to fetch reservations:", error);
    } finally {
      setLoading(false);
    }
  };

  // Approve a reservation
  const approveReservation = async (id) => {
    if (approvingIds.has(id)) return; // prevent duplicate calls
    setApprovingIds(new Set(approvingIds).add(id));
    try {
      await axiosInstance.post(`/api/reservations/${id}/approve/`);
      // Refresh list after approval
      await fetchReservations();
    } catch (error) {
      console.error("Failed to approve reservation:", error);
      alert("Failed to approve reservation.");
    } finally {
      const newSet = new Set(approvingIds);
      newSet.delete(id);
      setApprovingIds(newSet);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  if (loading) {
    return <p className="p-6 text-slate-600">Loading reservations...</p>;
  }

  // Filter reservations needing approval soon (within 24h and still processing)
  const now = new Date();
  const soonThreshold = 24 * 60 * 60 * 1000; // 24h in ms
  const needsApprovalSoon = reservations.filter((r) => {
    if (r.status !== "processing") return false;
    const start = new Date(r.start_time);
    return start - now <= soonThreshold && start - now > 0;
  });

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold text-slate-900">Admin Reservation Management</h1>

      {/* Panel for reservations needing approval soon */}
      {needsApprovalSoon.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-300 p-4 rounded shadow mb-6">
          <h2 className="text-lg font-semibold text-yellow-800 mb-2">
            Reservations Needing Approval Soon
          </h2>
          <ul className="space-y-2 max-h-48 overflow-y-auto">
            {needsApprovalSoon.map((res) => (
              <li
                key={res.id}
                className="flex justify-between items-center p-2 border border-yellow-200 rounded bg-yellow-100"
              >
                <div>
                  <p>
                    <span className="font-semibold">{res.user.name}</span> -{" "}
                    <span className="italic">{res.car.make} {res.car.model}</span>
                  </p>
                  <p className="text-sm text-yellow-700">
                    Starts at: {new Date(res.start_time).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => approveReservation(res.id)}
                  disabled={approvingIds.has(res.id)}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm"
                >
                  {approvingIds.has(res.id) ? "Approving..." : "Approve"}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* All reservations list */}
      <div className="bg-white p-4 rounded shadow border max-h-[600px] overflow-y-auto">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-indigo-100 text-indigo-800">
              <th className="border px-3 py-1 text-left">User</th>
              <th className="border px-3 py-1 text-left">Car</th>
              <th className="border px-3 py-1 text-left">Slot</th>
              <th className="border px-3 py-1 text-left">Start Time</th>
              <th className="border px-3 py-1 text-left">End Time</th>
              <th className="border px-3 py-1 text-left">Status</th>
              <th className="border px-3 py-1 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((res) => (
              <tr
                key={res.id}
                className={`${
                  res.status === "processing" ? "bg-yellow-50" : "bg-white"
                } hover:bg-indigo-50`}
              >
                <td className="border px-3 py-1">{res.user.name} <br/><small className="text-xs text-gray-500">{res.user.email}</small></td>
                <td className="border px-3 py-1">{res.car.make} {res.car.model} <br/><small className="text-xs text-gray-500">{res.car.plate_number}</small></td>
                <td className="border px-3 py-1">{res.slot.slot_id}</td>
                <td className="border px-3 py-1">{new Date(res.start_time).toLocaleString()}</td>
                <td className="border px-3 py-1">{new Date(res.end_time).toLocaleString()}</td>
                <td className="border px-3 py-1 capitalize">{res.status}</td>
                <td className="border px-3 py-1 text-center">
                  {res.status === "processing" && (
                    <button
                      disabled={approvingIds.has(res.id)}
                      onClick={() => approveReservation(res.id)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded text-sm"
                    >
                      {approvingIds.has(res.id) ? "Approving..." : "Approve"}
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {reservations.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-4 text-gray-500">
                  No reservations found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminReservationManagement;
