// src/components/QuickActions.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Floating Quick Action panel for logged-in users.
 * Provides shortcuts for reservation, profile, and logout.
 */
const QuickActions = ({ onLogout }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Toggle Button (⚡ to open, × to close) */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="bg-indigo-800 text-white px-4 py-2 rounded-full shadow-lg hover:bg-indigo-900 transition"
        aria-label="Toggle Quick Actions"
      >
        {open ? "×" : "⚡"}
      </button>

      {/* Action Panel */}
      {open && (
        <div className="mt-3 bg-white border border-gray-200 rounded-lg p-4 w-64 shadow-xl">
          <h3 className="text-lg font-semibold text-slate-900 mb-3">
            Quick Actions
          </h3>

          <div className="space-y-2">
            <button
              className="w-full bg-indigo-800 hover:bg-indigo-900 text-white py-2 px-3 rounded transition"
              onClick={() => navigate("/reservations/new")}
            >
              Make a Reservation
            </button>
            <button
              className="w-full bg-gray-100 hover:bg-gray-200 text-slate-900 py-2 px-3 rounded transition"
              onClick={() => navigate("/myreservations")}
            >
              View My Reservations
            </button>
            <button
              className="w-full bg-gray-100 hover:bg-gray-200 text-slate-900 py-2 px-3 rounded transition"
              onClick={() => navigate("/profile")}
            >
              Go to My Profile
            </button>
            <button
              className="w-full bg-red-100 hover:bg-red-200 text-red-500 py-2 px-3 rounded transition"
              onClick={onLogout}
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickActions;
