import React, { useEffect, useState } from "react";
import axiosInstance from "../../services/axios";

const AdminLocationManagement = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newLocation, setNewLocation] = useState({ name: "", address: "" });
  const [newSlotCounts, setNewSlotCounts] = useState({}); // locationId -> number

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

  // Create a new location
  const createLocation = async () => {
    if (!newLocation.name || !newLocation.address) {
      alert("Please provide both name and address.");
      return;
    }
    try {
      await axiosInstance.post("/api/locations/", {
        ...newLocation,
        slots: 0, // ✅ add default slots to avoid backend 400
      });
      setNewLocation({ name: "", address: "" });
      fetchLocationsWithSlots();
    } catch (error) {
      console.error("Failed to create location:", error);
    }
  };

  // Add slots to a location
  const addSlots = async (locationId) => {
    const count = parseInt(newSlotCounts[locationId] || "0");
    if (count <= 0) {
      alert("Enter a valid number of slots to add.");
      return;
    }

    try {
      for (let i = 0; i < count; i++) {
        await axiosInstance.post("/api/slots/create/", {
          location: locationId,
        });
      }
      setNewSlotCounts((prev) => ({ ...prev, [locationId]: "" }));
      fetchLocationsWithSlots();
    } catch (error) {
      console.error("Failed to add slots:", error);
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

  // Delete a location
  const deleteLocation = async (locationId) => {
    if (
      !window.confirm(
        "This will delete ALL slots and reservations tied to this location. Proceed?"
      )
    )
      return;
    try {
      await axiosInstance.delete(`/api/locations/${locationId}/`);
      fetchLocationsWithSlots();
    } catch (error) {
      console.error("Failed to delete location:", error);
      alert("Location deletion failed. It may have existing reservations.");
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

  useEffect(() => {
    fetchLocationsWithSlots();
  }, []);

  if (loading) {
    return <p className="p-6 text-slate-600">Loading locations...</p>;
  }

  return (
    <div className="p-6 space-y-10">
      <h1 className="text-2xl font-bold text-slate-900">
        Admin Location Dashboard
      </h1>

      {/* Create new location form */}
      <div className="bg-white p-4 rounded shadow border">
        <h2 className="text-lg font-semibold text-indigo-800 mb-2">
          Create New Location
        </h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            className="border p-2 rounded w-full"
            type="text"
            placeholder="Name"
            value={newLocation.name}
            onChange={(e) =>
              setNewLocation({ ...newLocation, name: e.target.value })
            }
          />
          <input
            className="border p-2 rounded w-full"
            type="text"
            placeholder="Address"
            value={newLocation.address}
            onChange={(e) =>
              setNewLocation({ ...newLocation, address: e.target.value })
            }
          />
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={createLocation}
          >
            Create
          </button>
        </div>
      </div>

      {/* Locations List */}
      {locations.length === 0 ? (
        <p className="text-gray-500">No locations found.</p>
      ) : (
        locations.map((location) => (
          <div key={location.id} className="bg-white p-6 rounded shadow border">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h2 className="text-xl font-semibold text-indigo-800">
                  {location.name}
                </h2>
                <p className="text-sm text-gray-600">{location.address}</p>
              </div>
              <button
                onClick={() => deleteLocation(location.id)}
                className="text-sm bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded"
              >
                Delete Location
              </button>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <input
                type="number"
                min="1"
                className="border p-1 px-2 rounded w-24"
                placeholder="Slots"
                value={newSlotCounts[location.id] || ""}
                onChange={(e) =>
                  setNewSlotCounts({
                    ...newSlotCounts,
                    [location.id]: e.target.value,
                  })
                }
              />
              <button
                onClick={() => addSlots(location.id)}
                className="bg-indigo-600 text-white text-sm px-3 py-1 rounded hover:bg-indigo-700"
              >
                Add Slots
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {(location.slots || []).map((slot) => (
                <SlotCard
                  key={slot.id}
                  slot={slot}
                  onLockToggle={() => toggleSlotLock(slot.id, slot.locked)}
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

const SlotCard = ({ slot, onLockToggle }) => {
  const occupant = slot.current_reservation;

  return (
    <div className="border p-4 rounded shadow-sm bg-white">
      <h4 className="font-bold mb-2 text-slate-800">Slot {slot.slot_id}</h4>
      {occupant ? (
        <div className="text-sm text-slate-700 mb-2">
          <p>
            <span className="font-medium">User:</span>{" "}
            {occupant.user
              ? `${occupant.user.first_name} ${occupant.user.last_name}`
              : "[No user]"}
          </p>
          <p>
            <span className="font-medium">Car:</span>{" "}
            {occupant.vehicle_make
              ? `${occupant.vehicle_make} ${occupant.vehicle_model} – ${occupant.plate_number}`
              : "[No car]"}
          </p>
        </div>
      ) : (
        <p className="text-sm text-gray-500 italic mb-2">No active reservation</p>
      )}
      <button
        onClick={() => onLockToggle(slot.id, !slot.is_locked)}
        className={`w-full text-sm py-1 rounded ${
          slot.is_locked
            ? "bg-red-100 text-red-600 hover:bg-red-200"
            : "bg-green-100 text-green-600 hover:bg-green-200"
        }`}
      >
        {slot.is_locked ? "Unlock Slot" : "Lock Slot"}
      </button>
    </div>
  );
};



export default AdminLocationManagement;
