import React, { useEffect, useState } from "react";
import axiosInstance from "../../services/axios";

const AdminDashboard = () => {
  const [summary, setSummary] = useState({});
  const [recentReservations, setRecentReservations] = useState([]);
  const [adminUsername, setAdminUsername] = useState("");

  useEffect(() => {
    // Fetch admin profile
    axiosInstance.get("/api/profile/")
      .then((res) => setAdminUsername(res.data.username))
      .catch((err) => console.error("Error fetching admin profile:", err));

    // Fetch slot utilization summary
    axiosInstance.get("/api/summary/slot-utilization/overall/")
      .then((res) => setSummary(res.data))
      .catch((err) => console.error("Error fetching summary:", err));

    // Fetch and sort recent reservations (limit to 5)
    axiosInstance.get("/api/reservations/all/")
      .then((res) => {
        const sorted = res.data
          .filter(r => r.created_at)
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 5);
        setRecentReservations(sorted);
      })
      .catch((err) => console.error("Error fetching reservations:", err));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Welcome, {adminUsername}</h1>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <SummaryCard title="Total Locations" value={summary.total_locations || 0} color="blue" />
        <SummaryCard title="Total Slots" value={summary.total_slots || 0} color="green" />
        <SummaryCard title="Utilization Rate" value={`${summary.utilization_rate || 0}%`} color="yellow" />
      </div>

      {/* Recent Reservations */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Recent Reservations</h2>
        <ul className="space-y-2">
          {recentReservations.map((res) => (
            <li key={res.id} className="bg-white p-4 rounded shadow">
              <p><strong>User:</strong> {res.user_full_name || res.user}</p>
              <p><strong>Location:</strong> {res.location?.name || res.location_name}</p>
              <p><strong>Status:</strong> {res.status}</p>
              <p><strong>Created:</strong> {new Date(res.created_at).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Quick Admin Navigation */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <AdminNavLink to="/dashboard/admin/locations" label="Manage Locations" />
        <AdminNavLink to="/dashboard/admin/slots" label="View Slots" />
        <AdminNavLink to="/dashboard/admin/users" label="View Users" />
        <AdminNavLink to="/dashboard/admin/feedback" label="View Feedback" />
      </div>
    </div>
  );
};

// Reusable summary card component
const SummaryCard = ({ title, value, color }) => (
  <div className={`bg-${color}-100 p-4 rounded shadow`}>
    <h2 className="text-xl font-semibold">{title}</h2>
    <p className="text-2xl">{value}</p>
  </div>
);

// Reusable admin nav link
const AdminNavLink = ({ to, label }) => (
  <a
    href={to}
    className="bg-white text-center p-4 border rounded shadow hover:bg-gray-50"
  >
    {label}
  </a>
);

export default AdminDashboard;
