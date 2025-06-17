import React, { useEffect, useState } from "react";
import axiosInstance from "../../services/axios";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const [summary, setSummary] = useState({});
  const [recentReservations, setRecentReservations] = useState([]);
  const [adminUsername, setAdminUsername] = useState("");

  useEffect(() => {
    // Fetch profile and data summaries
    axiosInstance
      .get("/api/profile/")
      .then((res) => setAdminUsername(res.data.username || "Admin"))
      .catch((err) => console.error("Profile error:", err));

    axiosInstance
      .get("/api/summary/slot-utilization/overall/")
      .then((res) => setSummary(res.data))
      .catch((err) => console.error("Summary error:", err));

    axiosInstance
      .get("/api/reservations/all/")
      .then((res) => {
        const sorted = res.data
          .filter((r) => r.created_at)
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 5);
        setRecentReservations(sorted);
      })
      .catch((err) => console.error("Reservations error:", err));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <h1 className="text-3xl font-bold text-indigo-800 mb-6">
        Welcome, {adminUsername}
      </h1>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <SummaryCard
          title="Total Locations"
          value={summary.total_locations || 0}
          color="blue"
        />
        <SummaryCard
          title="Total Slots"
          value={summary.total_slots || 0}
          color="green"
        />
        <SummaryCard
          title="Utilization Rate"
          value={`${((summary.utilization_rate || 0) * 100).toFixed(2)}%`}
          color="yellow"
        />
      </div>

      {/* Recent Reservations */}
      <div className="bg-white rounded shadow p-6 mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-slate-900">
            Recent Reservations
          </h2>
          <Link
            to="/reservations/management"
            className="text-blue-500 hover:underline text-sm"
          >
            View All
          </Link>
        </div>
        {recentReservations.length === 0 ? (
          <p className="text-gray-500">No recent reservations.</p>
        ) : (
          <ul className="space-y-3">
            {recentReservations.map((res) => (
              <li key={res.id} className="border rounded p-4 bg-slate-50">
                <p>
                  <strong>User:</strong>{" "}
                  {res.user_full_name || res.user || "Unknown"}
                </p>
                <p>
                  <strong>Location:</strong>{" "}
                  {res.location?.name || res.location_name || "N/A"}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span className="text-indigo-700 font-semibold">
                    {res.status}
                  </span>
                </p>
                <p>
                  <strong>Created:</strong>{" "}
                  {new Date(res.created_at).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Navigation Panel */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <AdminNavLink to="/locations/management" label="Manage Locations" />
        <AdminNavLink to="/reservations/management" label="Manage Reservations" />
        <AdminNavLink to="/user/management" label="Manage Users" />
        <LogoutButton />
      </div>
    </div>
  );
};

const SummaryCard = ({ title, value, color }) => {
  const bgColor = {
    blue: "bg-blue-100 text-blue-700",
    green: "bg-green-100 text-green-700",
    yellow: "bg-yellow-100 text-yellow-700",
  }[color];

  return (
    <div className={`p-4 rounded shadow ${bgColor}`}>
      <h2 className="text-md font-medium">{title}</h2>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
};

const AdminNavLink = ({ to, label }) => (
  <Link
    to={to}
    className="bg-white border rounded shadow p-4 text-center hover:bg-gray-50 transition"
  >
    <span className="font-medium text-slate-900">{label}</span>
  </Link>
);

const LogoutButton = () => (
  <button
    onClick={() => {
      localStorage.clear();
      window.location.href = "/";
    }}
    className="bg-white border rounded shadow p-4 text-center hover:bg-gray-50 transition text-red-600 font-medium"
  >
    Logout
  </button>
);

export default AdminDashboard;
