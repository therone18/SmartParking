// src/components/QuickActions.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const QuickActions = ({ onLogout }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Toggle Button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="bg-indigo-800 text-white px-4 py-2 rounded-full shadow-lg hover:bg-indigo-900"
      >
        {open ? "×" : "⚡"}
      </button>

      {/* Panel */}
      {open && (
        <div className="mt-3 bg-white border border-gray-200 rounded-lg p-4 w-64 shadow-xl">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            Quick Actions
          </h3>

          <button
            className="w-full bg-indigo-800 hover:bg-indigo-900 text-white py-2 rounded mb-2"
            onClick={() => navigate("/reservations/new")}
          >
            Make a Reservation
          </button>
          <button
            className="w-full bg-gray-100 hover:bg-gray-200 text-slate-900 py-2 rounded mb-2"
            onClick={() => navigate("/myreservations")}
          >
            View My Reservations
          </button>
          <button
            className="w-full bg-gray-100 hover:bg-gray-200 text-slate-900 py-2 rounded mb-2"
            onClick={() => navigate("/profile")}
          >
            Go to My Profile
          </button>
          <button
            className="w-full bg-red-100 hover:bg-red-200 text-red-500 py-2 rounded"
            onClick={onLogout}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default QuickActions;
