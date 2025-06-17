import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../../services/axios";

const ReservationHistory = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filtering & Pagination
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await axiosInstance.get("/api/reservations/me/");
        const raw = response.data?.data || response.data;

        if (Array.isArray(raw)) {
          const completed = raw.filter(
            (res) => res.status === "Complete" || res.status === "Cancelled"
          );
          setReservations(completed);
        } else {
          console.warn("Unexpected reservation format:", response.data);
          setReservations([]);
        }
      } catch (error) {
        console.error("Failed to load reservation history:", error);
        setReservations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  // Filtered + Paginated Reservations
  const filtered = statusFilter === "All"
    ? reservations
    : reservations.filter((r) => r.status === statusFilter);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1); // reset to first page on filter change
  };

  const handlePageChange = (direction) => {
    setCurrentPage((prev) => Math.max(1, Math.min(prev + direction, totalPages)));
  };

  if (loading) return <p className="text-center mt-10 text-slate-600">Loading reservation history...</p>;
  if (reservations.length === 0) return <p className="text-center mt-10 text-slate-600">No past reservations found.</p>;

  return (
    <div className="max-w-6xl mx-auto mt-10 bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-4 text-slate-900">Reservation History</h1>

      {/* Filter Dropdown */}
      <div className="mb-4">
        <label className="text-sm font-medium text-slate-700 mr-2">Filter by Status:</label>
        <select
          value={statusFilter}
          onChange={handleFilterChange}
          className="border px-2 py-1 rounded text-sm"
        >
          <option>All</option>
          <option>Complete</option>
          <option>Cancelled</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-indigo-800 text-white text-sm">
            <tr>
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Location</th>
              <th className="px-4 py-2 text-left">Slot</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Reserved At</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginated.map((res) => (
              <tr key={res.id} className="hover:bg-slate-50 transition">
                <td className="px-4 py-2">{res.id}</td>
                <td className="px-4 py-2">{res.location?.name || "Unknown"}</td>
                <td className="px-4 py-2">{res.slot_id || res.slot || "N/A"}</td>
                <td className="px-4 py-2">
                  <span className={`font-medium ${res.status === "Complete" ? "text-green-500" : "text-red-500"}`}>
                    {res.status}
                  </span>
                </td>
                <td className="px-4 py-2 text-sm text-slate-700">
                  {res.created_at ? new Date(res.created_at).toLocaleString() : "N/A"}
                </td>
                <td className="px-4 py-2">
                  <Link to={`/reservations/${res.id}`} className="text-blue-500 hover:underline text-sm">
                    View Details →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="mt-4 flex justify-between items-center text-sm">
        <span className="text-slate-600">
          Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filtered.length)} to{" "}
          {Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length} results
        </span>

        <div className="space-x-2">
          <button
            onClick={() => handlePageChange(-1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded border ${currentPage === 1 ? "text-gray-400 border-gray-300" : "text-slate-800 border-slate-400 hover:bg-gray-100"}`}
          >
            Previous
          </button>
          <button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded border ${currentPage === totalPages ? "text-gray-400 border-gray-300" : "text-slate-800 border-slate-400 hover:bg-gray-100"}`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReservationHistory;
