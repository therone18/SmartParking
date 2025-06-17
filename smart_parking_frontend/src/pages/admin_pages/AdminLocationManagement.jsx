import React, { useEffect, useState } from "react";
import axiosInstance from "../../services/axios";

const AdminReservationManagement = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approvingIds, setApprovingIds] = useState(new Set());

  

  // Approve a reservation by ID
  const approveReservation = async (id) => {
    if (approvingIds.has(id)) return; // prevent duplicate clicks
    setApprovingIds((prev) => new Set(prev).add(id));

    try {
      await axiosInstance.post(`/api/reservations/${id}/approve/`);
      // Refresh after approving
      fetchReservations();
    } catch (error) {
      console.error("Failed to approve reservation:", error);
      alert("Failed to approve reservation.");
    } finally {
      setApprovingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  // Get reservations needing approval soon (e.g. within 2 days)
  const now = new Date();
  const soonThresholdMs = 2 * 24 * 60 * 60 * 1000; // 2 days in ms
  const needsApproval = reservations.filter((r) => {
    if (r.status !== "processing") return false;
    const startDate = new Date(r.start_time || r.created_at);
    return startDate - now <= soonThresholdMs && startDate >= now;
  });

  // Utility for nicer date formatting
  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleString();
  };

  if (loading) {
    return <p className="p-6 text-slate-600">Loading reservations...</p>;
  }

  return (
    <div className="p-6 space-y-10">
      <h1 className="text-2xl font-bold text-slate-900">Reservation Management</h1>

      {/* Panel: Reservations needing approval soon */}
      <div className="bg-yellow-50 border-yellow-400 border rounded p-4 shadow">
        <h2 className="text-lg font-semibold text-yellow-700 mb-3">
          Reservations Needing Approval Soon
        </h2>
        {needsApproval.length === 0 ? (
          <p className="text-yellow-800">No reservations require immediate approval.</p>
        ) : (
          <ul className="space-y-3 max-h-60 overflow-auto">
            {needsApproval.map((r) => (
              <li
                key={r.id}
                className="border border-yellow-300 rounded p-3 bg-yellow-100 flex justify-between items-center"
              >
                <div>
                  <p>
                    <strong>User:</strong> {r.user_full_name || r.user || "Unknown"}
                  </p>
                  <p>
                    <strong>Location:</strong> {r.location?.name || "N/A"}
                  </p>
                  <p>
                    <strong>Start Time:</strong> {formatDate(r.start_time)}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span className="font-semibold text-yellow-800">{r.status}</span>
                  </p>
                </div>
                <button
                  disabled={approvingIds.has(r.id)}
                  onClick={() => approveReservation(r.id)}
                  className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 disabled:opacity-50"
                >
                  {approvingIds.has(r.id) ? "Approving..." : "Approve"}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* All Reservations Table */}
      <div className="bg-white p-4 rounded shadow border max-h-[600px] overflow-auto">
        <h2 className="text-lg font-semibold text-indigo-800 mb-4">All Reservations</h2>
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead className="bg-indigo-100">
            <tr>
              <th className="border border-gray-300 px-3 py-2 text-left">User</th>
              <th className="border border-gray-300 px-3 py-2 text-left">Location</th>
              <th className="border border-gray-300 px-3 py-2 text-left">Slot ID</th>
              <th className="border border-gray-300 px-3 py-2 text-left">Start Time</th>
              <th className="border border-gray-300 px-3 py-2 text-left">End Time</th>
              <th className="border border-gray-300 px-3 py-2 text-left">Status</th>
              <th className="border border-gray-300 px-3 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reservations.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center p-4 text-gray-500">
                  No reservations found.
                </td>
              </tr>
            ) : (
              reservations.map((r) => (
                <tr
                  key={r.id}
                  className={`${
                    r.status === "processing" ? "bg-yellow-50" : "bg-white"
                  } hover:bg-indigo-50`}
                >
                  <td className="border border-gray-300 px-3 py-1">
                    {r.user_full_name || r.user || "Unknown"}
                  </td>
                  <td className="border border-gray-300 px-3 py-1">
                    {r.location?.name || "N/A"}
                  </td>
                  <td className="border border-gray-300 px-3 py-1">{r.slot_id || "N/A"}</td>
                  <td className="border border-gray-300 px-3 py-1">{formatDate(r.start_time)}</td>
                  <td className="border border-gray-300 px-3 py-1">{formatDate(r.end_time)}</td>
                  <td className="border border-gray-300 px-3 py-1 font-semibold capitalize">
                    {r.status}
                  </td>
                  <td className="border border-gray-300 px-3 py-1 space-x-2">
                    {r.status === "processing" && (
                      <button
                        disabled={approvingIds.has(r.id)}
                        onClick={() => approveReservation(r.id)}
                        className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 disabled:opacity-50"
                      >
                        {approvingIds.has(r.id) ? "Approving..." : "Approve"}
                      </button>
                    )}
                    
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminReservationManagement;
