import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../services/axios";

const MyReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const navigate = useNavigate();

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const params = {
        ...(statusFilter !== "All" && { status: statusFilter }),
        page: page,
      };
      const response = await axiosInstance.get("/api/reservations/me/", { params });
      setReservations(response.data.results || []);
      setCount(response.data.count || 0);
    } catch (error) {
      console.error("Error fetching reservations:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, [statusFilter, page]);

  const cancelReservation = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this reservation?")) return;

    try {
      await axiosInstance.patch(`/api/reservations/${id}/`, { status: "Cancelled" });
      fetchReservations(); // Refresh list
    } catch (error) {
      console.error("Failed to cancel reservation:", error.response?.data || error.message);
      alert("Failed to cancel reservation.");
    }
  };

  const isCancelable = (res) => {
    const now = new Date();
    const start = new Date(res.start_time);
    return res.status === "Reserved" && start > now;
  };

  const totalPages = Math.ceil(count / 10); // Assuming 10 per page from DRF default

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold text-slate-900">My Reservations</h1>

          <div className="flex gap-3">
            <select
              value={statusFilter}
              onChange={(e) => {
                setPage(1); // Reset page when changing filter
                setStatusFilter(e.target.value);
              }}
              className="border text-slate-700 px-3 py-2 rounded shadow-sm"
            >
              {["All", "Pending", "Processing", "Reserved", "Active", "Overdue", "Checked-out", "Cancelled", "Complete"].map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>

            <button
              onClick={() => navigate("/dashboard")}
              className="bg-indigo-800 hover:bg-indigo-900 text-white px-4 py-2 rounded transition"
            >
              Back to Dashboard
            </button>
          </div>
        </div>

        {/* Reservation States */}
        {loading ? (
          <p className="text-center text-gray-500">Loading your reservations...</p>
        ) : reservations.length === 0 ? (
          <p className="text-center text-gray-500">No reservations found.</p>
        ) : (
          <ul className="space-y-4 mb-6">
            {reservations.map((res) => (
              <li
                key={res.id}
                className="bg-white shadow rounded-lg p-5 hover:shadow-md transition border"
              >
                <div className="flex flex-col gap-2 text-slate-900">
                  <p>
                    <span className="text-sm text-gray-500">Reservation ID:</span>{" "}
                    <span className="font-medium">{res.id}</span>
                  </p>
                  <p>
                    <span className="text-sm text-gray-500">Location ID:</span>{" "}
                    <span className="font-semibold">{res.location}</span>
                  </p>
                  <p>
                    <span className="text-sm text-gray-500">Slot ID:</span>{" "}
                    <span>{res.slot}</span>
                  </p>
                  <p>
                    <span className="text-sm text-gray-500">Start Time:</span>{" "}
                    <span>{new Date(res.start_time).toLocaleString()}</span>
                  </p>
                  <p>
                    <span className="text-sm text-gray-500">Status:</span>{" "}
                    <span
                      className={`inline-block px-2 py-1 text-sm rounded-full font-semibold ${
                        res.status === "Reserved"
                          ? "bg-green-100 text-green-700"
                          : res.status === "Cancelled"
                          ? "bg-red-100 text-red-600"
                          : res.status === "Overdue"
                          ? "bg-amber-100 text-amber-600"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {res.status}
                    </span>
                  </p>
                </div>

                {isCancelable(res) && (
                  <div className="mt-4 text-right">
                    <button
                      onClick={() => cancelReservation(res.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded shadow"
                    >
                      Cancel Reservation
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}

        {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-4">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className={`px-4 py-2 rounded ${
              page === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-indigo-800 hover:bg-indigo-900 text-white"
            }`}
          >
            Previous
          </button>
          <span className="text-slate-700">Page {page} of {totalPages || 1}</span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className={`px-4 py-2 rounded ${
              page >= totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-indigo-800 hover:bg-indigo-900 text-white"
            }`}
          >
            Next
          </button>
        </div>

        {/* Add Reservation */}
        <div className="text-right mt-6">
          <button
            onClick={() => navigate("/reservations/new")}
            className="bg-indigo-800 text-white px-4 py-2 rounded hover:bg-indigo-900 transition"
          >
            Add Reservation
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyReservations;
