// ReservationDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../services/axios";

const ReservationDetails = () => {
  const { id } = useParams(); // Get reservation ID from URL
  const navigate = useNavigate();
  const [reservation, setReservation] = useState(null);

  // Fetch reservation details when component mounts or ID changes
  useEffect(() => {
    const fetchReservation = async () => {
      try {
        const res = await axiosInstance.get(`/api/reservations/${id}/`);
        setReservation(res.data);
      } catch (error) {
        console.error("Failed to fetch reservation:", error.response?.data || error.message);
        alert("Failed to load reservation.");
      }
    };

    fetchReservation();
  }, [id]);

  // Show loading text if data hasn't loaded yet
  if (!reservation) {
    return (
      <div className="text-center py-10 text-gray-600">
        Loading reservation details...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 flex justify-center items-start">
      <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl w-full">
        <h2 className="text-2xl font-bold text-indigo-800 mb-6 text-center">
          Reservation Details
        </h2>

        {/* Basic Reservation Info */}
        <div className="space-y-3 text-sm sm:text-base">
          <DetailRow label="Location" value={reservation.location?.name} />
          <DetailRow label="Address" value={reservation.location?.address} />
          <DetailRow label="Slot ID" value={reservation.slot_id || reservation.slot} />
          <DetailRow
            label="Start Time"
            value={new Date(reservation.start_time).toLocaleString()}
          />
          <DetailRow
            label="End Time"
            value={new Date(reservation.end_time).toLocaleString()}
          />
          <DetailRow
            label="Status"
            value={
              <span
                className={`font-semibold ${
                  reservation.status === "Reserved"
                    ? "text-blue-500"
                    : reservation.status === "Complete"
                    ? "text-green-500"
                    : reservation.status === "Cancelled"
                    ? "text-red-500"
                    : "text-slate-800"
                }`}
              >
                {reservation.status}
              </span>
            }
          />
        </div>

        {/* Vehicle Information */}
        <hr className="my-5" />
        <h3 className="text-lg font-semibold text-slate-900 mb-2">Vehicle Info</h3>
        <div className="space-y-2 text-sm sm:text-base">
          <DetailRow label="Make" value={reservation.vehicle_make} />
          <DetailRow label="Model" value={reservation.vehicle_model} />
          <DetailRow label="Plate Number" value={reservation.plate_number} />
          <DetailRow label="Type" value={reservation.vehicle_type} />
        </div>

        {/* Receipt Image (if uploaded) */}
        {reservation.receipt && (
          <>
            <hr className="my-5" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Receipt</h3>
            <div className="flex justify-center">
              <img
                src={reservation.receipt}
                alt="Payment Receipt"
                className="max-w-xs w-full rounded border shadow"
              />
            </div>
          </>
        )}

        {/* Back Navigation */}
        <button
          onClick={() => navigate("/dashboard")}
          className="mt-6 w-full bg-gray-200 hover:bg-gray-300 text-slate-900 py-2 rounded transition"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

// 🔁 Row component for reusable field display
const DetailRow = ({ label, value }) => (
  <div className="flex justify-between gap-4 border-b pb-1">
    <span className="text-slate-600 font-medium">{label}:</span>
    <span className="text-slate-900 text-right">{value || "-"}</span>
  </div>
);

export default ReservationDetails;
