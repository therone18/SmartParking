import React, { useEffect, useState } from "react";
import axiosInstance from "../../services/axios";

const AdminLocationManagement = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all parking locations and their associated slots
  const fetchLocationsWithSlots = async () => {
    try {
      const response = await axiosInstance.get("/api/locations-dashboard/");
      setLocations(response.data);
    } catch (error) {
      console.error("Error fetching locations:", error);
    } finally {
      setLoading(false);
    }
  };

  // Lock or unlock a parking slot
  const toggleSlotLock = async (slotId, isLocked) => {
    const url = `/api/slots/${slotId}/${isLocked ? "unlock" : "lock"}/`;
    try {
      await axiosInstance.post(url);
      fetchLocationsWithSlots(); // Refresh UI after toggle
    } catch (error) {
      console.error("Failed to toggle slot lock:", error);
    }
  };

  // Initial data fetch on component mount
  useEffect(() => {
    fetchLocationsWithSlots();
  }, []);

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Location Dashboard</h1>

      {locations.length === 0 ? (
        <p className="text-gray-600">No locations found.</p>
      ) : (
        locations.map((location) => (
          <div
            key={location.id}
            className="mb-8 border border-gray-300 rounded-lg shadow-sm p-4"
          >
            <h2 className="text-xl font-semibold mb-2">{location.name}</h2>
            <p className="mb-2 text-gray-600">{location.address}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(location.slots || []).map((slot) => (
                <div
                  key={slot.id}
                  className={`p-3 border rounded-md flex justify-between items-center ${
                    slot.locked ? "bg-red-100" : "bg-green-100"
                  }`}
                >
                  <div>
                    <p className="font-medium">Slot ID: {slot.slot_id}</p>
                    <p className="text-sm">Status: {slot.locked ? "Locked" : "Unlocked"}</p>
                  </div>
                  <button
                    onClick={() => toggleSlotLock(slot.id, slot.locked)}
                    className={`px-3 py-1 text-sm rounded-md font-medium ${
                      slot.locked
                        ? "bg-green-600 text-white"
                        : "bg-red-600 text-white"
                    }`}
                  >
                    {slot.locked ? "Unlock" : "Lock"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default AdminLocationManagement;
