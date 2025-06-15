import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../services/axios";

const MakeReservation = () => {
  const navigate = useNavigate();

  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
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

  // Fetch locations on mount
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

  // Fetch slot details when a location is selected
  useEffect(() => {
    const fetchSlotDetails = async () => {
      if (formData.location) {
        try {
          const res = await axiosInstance.get(`/api/locations/${formData.location}/`);
          setSelectedLocation(res.data);
        } catch (error) {
          console.error("Error fetching location details:", error);
        }
      } else {
        setSelectedLocation(null);
      }
    };
    fetchSlotDetails();
  }, [formData.location]);

  // Update any form field
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Slot selection
  const handleSlotSelect = (slotId) => {
    setFormData((prev) => ({ ...prev, slot: slotId }));
  };

  // Submit reservation
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post("/api/reservations/", formData);
      navigate(`/payment/${res.data.id}`);
    } catch (error) {
      console.error("Reservation failed:", error.response?.data || error.message);
      alert("Reservation failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-12 px-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl">
        <h2 className="text-2xl font-bold mb-6 text-center text-slate-900">Make a Reservation</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Location selection */}
          <div>
            <label className="block mb-1 text-sm font-medium text-slate-700">Select Location</label>
            <select
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-indigo-800"
            >
              <option value="">-- Choose a Location --</option>
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name} — {loc.address}
                </option>
              ))}
            </select>
          </div>

          {/* Slot selection visual */}
          {selectedLocation?.slots?.length > 0 && (
            <div>
              <label className="block mb-2 font-medium text-slate-700">Available Slots</label>
              <div className="grid grid-cols-4 gap-3 p-2 border border-gray-200 rounded bg-slate-100">
                {selectedLocation.slots.map((slot) => (
                  <button
                    type="button"
                    key={slot.id}
                    onClick={() => handleSlotSelect(slot.id)}
                    className={`text-sm py-2 rounded border shadow-sm ${
                      formData.slot === slot.id
                        ? "bg-indigo-800 text-white border-indigo-800"
                        : slot.locked || !slot.is_available
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-white text-slate-900 hover:bg-indigo-100"
                    }`}
                    disabled={slot.locked || !slot.is_available}
                  >
                    {`Slot-${slot.slot_id.slice(0, 6).toUpperCase()}`}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Time inputs */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-sm font-medium text-slate-700">Start Time</label>
              <input
                type="datetime-local"
                name="start_time"
                value={formData.start_time}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded focus:ring-indigo-800"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-slate-700">End Time</label>
              <input
                type="datetime-local"
                name="end_time"
                value={formData.end_time}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded focus:ring-indigo-800"
              />
            </div>
          </div>

          {/* Vehicle info */}
          <div className="grid grid-cols-2 gap-4">
            <input
              name="vehicle_make"
              placeholder="Vehicle Make"
              value={formData.vehicle_make}
              onChange={handleChange}
              required
              className="p-2 border rounded col-span-1 focus:ring-indigo-800"
            />
            <input
              name="vehicle_model"
              placeholder="Vehicle Model"
              value={formData.vehicle_model}
              onChange={handleChange}
              required
              className="p-2 border rounded col-span-1 focus:ring-indigo-800"
            />
            <input
              name="plate_number"
              placeholder="Plate Number"
              value={formData.plate_number}
              onChange={handleChange}
              required
              className="p-2 border rounded col-span-2 focus:ring-indigo-800"
            />
            <input
              name="vehicle_type"
              placeholder="Vehicle Type"
              value={formData.vehicle_type}
              onChange={handleChange}
              required
              className="p-2 border rounded col-span-2 focus:ring-indigo-800"
            />
          </div>

          {/* Submit & Cancel buttons */}
          <button
            type="submit"
            className="w-full bg-indigo-800 hover:bg-indigo-900 text-white py-2 rounded shadow transition"
          >
            Reserve Slot
          </button>
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="w-full mt-2 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded transition"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default MakeReservation;
