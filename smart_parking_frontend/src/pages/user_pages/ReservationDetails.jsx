import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../services/axios";

const ReservationDetails = () => {
  const { id } = useParams(); // Get reservation ID from URL
  const navigate = useNavigate();

  const [reservation, setReservation] = useState(null);

  // Fetch reservation details on mount
  useEffect(() => {
    const fetchReservation = async () => {
      try {
        const res = await axiosInstance.get(`/api/reservations/${id}/`);
        setReservation(res.data);
      } catch (error) {
        console.error("Failed to fetch reservation:", error);
        alert("Failed to load reservation.");
      }
    };

    fetchReservation();
  }, [id]);

  if (!reservation) {
    return (
      <div className="text-center py-10 text-gray-600">
        Loading reservation details...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-10 px-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">
          Reservation Details
        </h2>

        <div className="space-y-4 text-sm sm:text-base">
          {/* Basic Info */}
          <DetailRow label="Location" value={reservation.location?.name} />
          <DetailRow label="Address" value={reservation.location?.address} />
          <DetailRow label="Slot ID" value={reservation.slot} />
          <DetailRow
            label="Start Time"
            value={new Date(reservation.start_time).toLocaleString()}
          />
          <DetailRow
            label="End Time"
            value={new Date(reservation.end_time).toLocaleString()}
          />
          <DetailRow label="Status" value={reservation.status} />

          {/* Vehicle Info */}
          <hr />
          <h3 className="text-lg font-semibold text-gray-800">Vehicle Info</h3>
          <DetailRow label="Make" value={reservation.vehicle_make} />
          <DetailRow label="Model" value={reservation.vehicle_model} />
          <DetailRow label="Plate Number" value={reservation.plate_number} />
          <DetailRow label="Type" value={reservation.vehicle_type} />

          {/* Receipt */}
          {reservation.receipt && (
            <>
              <hr />
              <div>
                <strong>Receipt:</strong>
                <img
                  src={reservation.receipt}
                  alt="Uploaded Receipt"
                  className="mt-2 max-w-xs border rounded shadow-sm"
                />
              </div>
            </>
          )}
        </div>

        {/* Back Button */}
        <button
          onClick={() => navigate("/dashboard")}
          className="mt-6 w-full bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300 transition"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

// 🔁 Reusable row for displaying label/value pairs
const DetailRow = ({ label, value }) => (
  <div className="flex justify-between border-b pb-1">
    <span className="font-medium text-gray-600">{label}:</span>
    <span className="text-gray-800">{value || "-"}</span>
  </div>
);

export default ReservationDetails;
