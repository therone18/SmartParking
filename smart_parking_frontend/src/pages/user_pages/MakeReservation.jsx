import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../services/axios";

const MakeReservation = () => {
  const navigate = useNavigate();

  const [locations, setLocations] = useState([]);
  const [slots, setSlots] = useState([]);

  const [formData, setFormData] = useState({
    location: "",
    slot: "",
    start_time: "",
    end_time: "",
    vehicle_make: "",
    vehicle_model: "",
    plate_number: "",
    vehicle_type: "",
  });

  // Fetch all available locations on mount
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await axiosInstance.get("/api/locations/");
        setLocations(res.data);
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };
    fetchLocations();
  }, []);

  // Fetch slot IDs when a location is selected
  useEffect(() => {
    const fetchSlots = async () => {
      if (formData.location) {
        try {
          const res = await axiosInstance.get(`/api/locations/${formData.location}/`);
          setSlots(res.data.slot_ids || []);
        } catch (error) {
          console.error("Error fetching slots:", error);
        }
      }
    };
    fetchSlots();
  }, [formData.location]);

  // Update form field on input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle reservation form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/api/reservations/", {
        ...formData,
        slot: formData.slot, // ensure slot is passed explicitly
      });

      // Navigate to payment page with reservation ID
      const reservationId = response.data.id;
      navigate(`/payment/${reservationId}`);
    } catch (error) {
      console.error("Reservation failed:", error.response?.data || error.message);
      alert("Failed to make reservation. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-10 px-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-xl">
        <h2 className="text-2xl font-bold mb-6 text-center">Make a Reservation</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Location selection */}
          <div>
            <label className="block mb-1 font-medium">Location</label>
            <select
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            >
              <option value="">Select location</option>
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name} – {loc.address}
                </option>
              ))}
            </select>
          </div>

          {/* Slot selection (basic input for now) */}
          <div>
            <label className="block mb-1 font-medium">Slot</label>
            <input
              type="text"
              name="slot"
              placeholder="Enter Slot ID"
              value={formData.slot}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Time selection */}
          <div>
            <label className="block mb-1 font-medium">Start Time</label>
            <input
              type="datetime-local"
              name="start_time"
              value={formData.start_time}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">End Time</label>
            <input
              type="datetime-local"
              name="end_time"
              value={formData.end_time}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Vehicle info */}
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="vehicle_make"
              placeholder="Vehicle Make"
              value={formData.vehicle_make}
              onChange={handleChange}
              className="p-2 border rounded"
              required
            />
            <input
              type="text"
              name="vehicle_model"
              placeholder="Vehicle Model"
              value={formData.vehicle_model}
              onChange={handleChange}
              className="p-2 border rounded"
              required
            />
            <input
              type="text"
              name="plate_number"
              placeholder="Plate Number"
              value={formData.plate_number}
              onChange={handleChange}
              className="p-2 border rounded col-span-2"
              required
            />
            <input
              type="text"
              name="vehicle_type"
              placeholder="Vehicle Type"
              value={formData.vehicle_type}
              onChange={handleChange}
              className="p-2 border rounded col-span-2"
              required
            />
          </div>

          {/* Buttons */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Reserve
          </button>
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="w-full mt-2 bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300"
          >
            Go Back to Dashboard
          </button>
        </form>
      </div>
    </div>
  );
};

export default MakeReservation;
