import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../services/axios";

const ReservationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reservation, setReservation] = useState(null);

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
    return <div className="text-center py-10">Loading reservation details...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-10 px-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">Reservation Details</h2>
        <div className="space-y-4">
          <div><strong>Location:</strong> {reservation.location.name}</div>
          <div><strong>Address:</strong> {reservation.location.address}</div>
          <div><strong>Slot ID:</strong> {reservation.slot}</div>
          <div><strong>Start Time:</strong> {new Date(reservation.start_time).toLocaleString()}</div>
          <div><strong>End Time:</strong> {new Date(reservation.end_time).toLocaleString()}</div>
          <div><strong>Status:</strong> <span className="capitalize">{reservation.status}</span></div>
          <hr />
          <h3 className="text-lg font-semibold">Vehicle Info</h3>
          <div><strong>Make:</strong> {reservation.vehicle_make}</div>
          <div><strong>Model:</strong> {reservation.vehicle_model}</div>
          <div><strong>Plate Number:</strong> {reservation.plate_number}</div>
          <div><strong>Type:</strong> {reservation.vehicle_type}</div>
          {reservation.receipt && (
            <>
              <hr />
              <div>
                <strong>Receipt:</strong><br />
                <img
                  src={reservation.receipt}
                  alt="Uploaded Receipt"
                  className="mt-2 max-w-xs border rounded"
                />
              </div>
            </>
          )}
        </div>
        <button
          onClick={() => navigate("/dashboard")}
          className="mt-6 w-full bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default ReservationDetails;
