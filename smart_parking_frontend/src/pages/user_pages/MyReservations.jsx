import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../services/axios";
import dayjs from "dayjs";

const MyReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("All");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await axiosInstance.get("/api/reservations/me/");
        const data = response.data?.data;
        setReservations(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching reservations:", error.response?.data || error.message);
        setReservations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  const handleCancel = async (id) => {
    try {
      await axiosInstance.put(`/api/reservations/${id}/status/`, {
        status: "Cancelled",
      });
      setReservations((prev) =>
        prev.map((res) =>
          res.id === id ? { ...res, status: "Cancelled" } : res
        )
      );
    } catch (error) {
      alert("Unable to cancel reservation.");
      console.error(error.response?.data || error.message);
    }
  };

  const handleCheckOut = async (id) => {
    try {
      await axiosInstance.put(`/api/reservations/${id}/status/`, {
        status: "Complete",
      });
      setReservations((prev) =>
        prev.map((res) =>
          res.id === id ? { ...res, status: "Complete" } : res
        )
      );
    } catch (error) {
      alert("Unable to check out.");
      console.error(error.response?.data || error.message);
    }
  };

  const canBeCancelled = (res) => {
    return res.status === "Reserved" && dayjs(res.start_time).isAfter(dayjs());
  };

  const canCheckOut = (res) => {
    return res.status === "Active";
  };

  const filteredReservations =
    filterStatus === "All"
      ? reservations
      : reservations.filter((res) => res.status === filterStatus);

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-slate-900">My Reservations</h1>
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-indigo-800 hover:bg-indigo-900 text-white px-4 py-2 rounded transition"
          >
            Back to Dashboard
          </button>
        </div>

        {/* Filter */}
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700 mr-2">
            Filter by status:
          </label>
          <select
            className="border rounded px-3 py-1 text-sm"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option>All</option>
            <option>Pending</option>
            <option>Processing</option>
            <option>Reserved</option>
            <option>Active</option>
            <option>Overdue</option>
            <option>Checked-out</option>
            <option>Cancelled</option>
            <option>Complete</option>
          </select>
        </div>

        {/* Reservation List */}
        {loading ? (
          <p className="text-center text-gray-500">Loading your reservations...</p>
        ) : filteredReservations.length === 0 ? (
          <p className="text-center text-gray-500">
            No reservations match the selected filter.
          </p>
        ) : (
          <ul className="space-y-4 mb-6">
            {filteredReservations.map((res) => (
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
                    <span className="text-sm text-gray-500">Slot ID:</span>{" "}
                    <span className="font-medium">{res.slot_id || res.slot}</span>
                  </p>
                  <p>
                    <span className="text-sm text-gray-500">Vehicle:</span>{" "}
                    <span>{res.vehicle_make} {res.vehicle_model}</span>
                  </p>
                  <p>
                    <span className="text-sm text-gray-500">Plate:</span>{" "}
                    <span>{res.plate_number}</span>
                  </p>
                  <p>
                    <span className="text-sm text-gray-500">Start Time:</span>{" "}
                    <span>{dayjs(res.start_time).format("YYYY-MM-DD HH:mm")}</span>
                  </p>
                  <p>
                    <span className="text-sm text-gray-500">End Time:</span>{" "}
                    <span>{dayjs(res.end_time).format("YYYY-MM-DD HH:mm")}</span>
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
                          : res.status === "Active"
                          ? "bg-blue-100 text-blue-700"
                          : res.status === "Checked-out"
                          ? "bg-gray-100 text-gray-800"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {res.status}
                    </span>
                  </p>

                  {/* Cancel Button */}
                  {canBeCancelled(res) && (
                    <button
                      onClick={() => handleCancel(res.id)}
                      className="mt-2 w-fit bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                    >
                      Cancel Reservation
                    </button>
                  )}

                  {/* Check Out Button */}
                  {canCheckOut(res) && (
                    <button
                      onClick={() => handleCheckOut(res.id)}
                      className="mt-2 w-fit bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                    >
                      Check Out
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Add New */}
        <div className="text-right">
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
