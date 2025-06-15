import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../services/axios";

const MyReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await axiosInstance.get("/api/reservations/me/");
        setReservations(response.data);
      } catch (error) {
        console.error("Error fetching reservations:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-slate-900">My Reservations</h1>
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-indigo-800 hover:bg-indigo-900 text-white px-4 py-2 rounded transition"
          >
            Back to Dashboard
          </button>
        </div>

        {/* Reservation States */}
        {loading ? (
          <p className="text-center text-gray-500">Loading your reservations...</p>
        ) : reservations.length === 0 ? (
          <p className="text-center text-gray-500">You have no reservations yet.</p>
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
                    <span className="text-sm text-gray-500">Location:</span>{" "}
                    <span className="font-semibold">{res.location?.name}</span>
                  </p>
                  <p>
                    <span className="text-sm text-gray-500">Address:</span>{" "}
                    <span>{res.location?.address}</span>
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
              </li>
            ))}
          </ul>
        )}

        {/* Add Reservation CTA */}
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
