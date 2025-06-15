import React, { useEffect, useState } from "react";
import axiosInstance from "../../services/axios";
import { Link } from "react-router-dom";

const ReservationHistory = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await axiosInstance.get("/api/reservations/me/");
        // Filter to only completed or canceled
        const filtered = response.data.filter(res =>
          res.status === "Complete" || res.status === "Cancelled"
        );
        setReservations(filtered);
      } catch (error) {
        console.error("Failed to load reservation history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading reservation history...</p>;

  if (reservations.length === 0)
    return <p className="text-center mt-10 text-gray-600">No past reservations found.</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Reservation History</h1>

      <div className="space-y-4">
        {reservations.map((res) => (
          <div
            key={res.id}
            className="border rounded p-4 bg-gray-50 hover:bg-gray-100 transition"
          >
            <p><strong>Location:</strong> {res.location_name}</p>
            <p><strong>Slot:</strong> {res.slot_number || "N/A"}</p>
            <p><strong>Status:</strong> <span className={`capitalize ${res.status === "completed" ? "text-green-600" : "text-red-600"}`}>{res.status}</span></p>
            <p><strong>Reserved At:</strong> {new Date(res.created_at).toLocaleString()}</p>

            <Link
              to={`/reservations/${res.id}`}
              className="text-blue-600 underline text-sm mt-2 inline-block"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReservationHistory;
