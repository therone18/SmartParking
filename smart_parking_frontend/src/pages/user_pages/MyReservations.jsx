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
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Top Navigation */}
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">My Reservations</h1>
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            Back to Dashboard
          </button>
        </div>

        {/* Reservation List */}
        {loading ? (
          <div className="text-gray-500 text-center">Loading...</div>
        ) : reservations.length === 0 ? (
          <div className="text-gray-500 text-center">No reservations found.</div>
        ) : (
          <ul className="space-y-4">
            {reservations.map((res) => (
              <li
                key={res.id}
                className="bg-white shadow border rounded-lg p-5 transition hover:shadow-md"
              >
                <div className="flex flex-col gap-2">
                  <div>
                    <span className="text-sm text-gray-500">Reservation ID:</span>{" "}
                    <span className="font-medium">{res.id}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Location:</span>{" "}
                    <span className="font-semibold text-gray-700">{res.location.name}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Address:</span>{" "}
                    <span className="text-gray-700">{res.location.address}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
        <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            onClick={() => navigate("/reservations/new")}
          >
            Add Reservation
          </button>
      </div>
      
    </div>
  );
};

export default MyReservations;
