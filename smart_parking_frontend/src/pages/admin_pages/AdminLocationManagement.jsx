import React, { useEffect, useState } from "react";
import axiosInstance from "../../services/axios";

const AdminLocationManagement = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch locations with their slots
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

  // Toggle slot lock/unlock
  const toggleSlotLock = async (slotId, isLocked) => {
    const url = `/api/slots/${slotId}/${isLocked ? "unlock" : "lock"}/`;
    try {
      await axiosInstance.post(url);
      fetchLocationsWithSlots();
    } catch (error) {
      console.error("Failed to toggle slot lock:", error);
    }
  };

  // Delete a slot
  const deleteSlot = async (slotId) => {
    if (!window.confirm("Are you sure you want to delete this slot?")) return;

    try {
      await axiosInstance.delete(`/api/slots/${slotId}/delete/`);
      fetchLocationsWithSlots();
    } catch (error) {
      console.error("Failed to delete slot:", error);
      alert("Slot deletion failed. It may have existing reservations.");
    }
  };

  // Load data on mount
  useEffect(() => {
    fetchLocationsWithSlots();
  }, []);

  if (loading) {
    return <p className="p-6 text-slate-600">Loading locations...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-slate-900">Admin Location Dashboard</h1>

      {locations.length === 0 ? (
        <p className="text-gray-500">No locations found.</p>
      ) : (
        locations.map((location) => (
          <div
            key={location.id}
            className="mb-8 border border-gray-300 rounded-lg shadow-sm p-6 bg-white"
          >
            <h2 className="text-xl font-semibold text-indigo-800 mb-1">{location.name}</h2>
            <p className="text-sm text-gray-600 mb-4">{location.address}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {(location.slots || []).map((slot) => (
                <SlotCard
                  key={slot.id}
                  slot={slot}
                  onToggle={() => toggleSlotLock(slot.id, slot.locked)}
                  onDelete={() => deleteSlot(slot.id)}
                />
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

// 🔁 Reusable SlotCard with Lock and Delete buttons
const SlotCard = ({ slot, onToggle, onDelete }) => {
  const locked = slot.locked;

  return (
    <div
      className={`p-4 rounded border shadow-sm flex flex-col justify-between gap-3 ${
        locked ? "bg-red-50 border-red-300" : "bg-green-50 border-green-300"
      }`}
    >
      <div>
        <p className="font-medium text-slate-900">Slot ID: {slot.slot_id}</p>
        <p className="text-sm text-gray-600">
          Status:{" "}
          <span className={locked ? "text-red-500" : "text-green-600"}>
            {locked ? "Locked" : "Unlocked"}
          </span>
        </p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onToggle}
          className={`flex-1 text-sm font-medium py-1 rounded ${
            locked
              ? "bg-green-600 hover:bg-green-700 text-white"
              : "bg-red-600 hover:bg-red-700 text-white"
          }`}
        >
          {locked ? "Unlock" : "Lock"}
        </button>

        <button
          onClick={onDelete}
          className="flex-1 text-sm font-medium py-1 rounded bg-gray-200 hover:bg-gray-300 text-slate-800"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default AdminLocationManagement;
