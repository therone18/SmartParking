import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../services/axios";

const MyReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch the user's reservations when component mounts
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await axiosInstance.get("/api/reservations/me/");
        setReservations(response.data);
      } catch (error) {
        console.error(
          "Error fetching reservations:",
          error.response?.data || error.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header & Navigation */}
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">My Reservations</h1>
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            Back to Dashboard
          </button>
        </div>

        {/* Reservation List or Loading/Error States */}
        {loading ? (
          <p className="text-gray-500 text-center">Loading...</p>
        ) : reservations.length === 0 ? (
          <p className="text-gray-500 text-center">No reservations found.</p>
        ) : (
          <>
            <ul className="space-y-4 mb-6">
              {reservations.map((res) => (
                <li
                  key={res.id}
                  className="bg-white shadow border rounded-lg p-5 hover:shadow-md transition"
                >
                  <div className="flex flex-col gap-2">
                    <p>
                      <span className="text-sm text-gray-500">Reservation ID:</span>{" "}
                      <span className="font-medium">{res.id}</span>
                    </p>
                    <p>
                      <span className="text-sm text-gray-500">Location:</span>{" "}
                      <span className="font-semibold text-gray-700">{res.location.name}</span>
                    </p>
                    <p>
                      <span className="text-sm text-gray-500">Address:</span>{" "}
                      <span className="text-gray-700">{res.location.address}</span>
                    </p>
                    <p>
                      <span className="text-sm text-gray-500">Status:</span>{" "}
                      <span className="text-blue-700 font-medium">{res.status}</span>
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}

        {/* Add New Reservation Button */}
        <div className="text-right">
          <button
            onClick={() => navigate("/reservations/new")}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            Add Reservation
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyReservations;
