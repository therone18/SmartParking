const SlotCard = ({ slot, onToggle, onDelete }) => {
  const locked = slot.locked;
  const occupant = slot.current_reservation;

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

        {occupant && (
          <div className="mt-2 border-t pt-2 text-sm text-slate-700 space-y-1">
            <p className="font-semibold text-blue-500">Occupied</p>
            <p>
              <span className="font-medium">User:</span> {occupant.user.name}{" "}
              <span className="text-xs text-gray-500">({occupant.user.email})</span>
            </p>
            <p>
              <span className="font-medium">Car:</span>{" "}
              {occupant.car.make} {occupant.car.model} – {occupant.car.plate_number}
            </p>
          </div>
        )}
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
