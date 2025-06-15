import React, { useEffect, useState } from "react";
import axiosInstance from "../../services/axios";

const AdminDashboard = () => {
  const [summary, setSummary] = useState({});
  const [recentReservations, setRecentReservations] = useState([]);
  const [adminUsername, setAdminUsername] = useState("");

  useEffect(() => {
    // Fetch admin profile info
    axiosInstance.get("/api/profile/")
      .then((res) => setAdminUsername(res.data.username))
      .catch((err) => console.error("Error fetching admin info", err));

    // Fetch summary info
    axiosInstance.get("/api/summary/slot-utilization/overall/")
      .then((res) => setSummary(res.data))
      .catch((err) => console.error("Summary error", err));

    // Fetch recent reservations
    axiosInstance.get("/api/reservations/all/")
      .then((res) => {
        const sorted = res.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setRecentReservations(sorted.slice(0, 5));
      })
      .catch((err) => console.error("Reservations error", err));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Welcome, {adminUsername}</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-100 p-4 rounded shadow">
          <h2 className="text-xl font-semibold">Total Locations</h2>
          <p className="text-2xl">{summary.total_locations || 0}</p>
        </div>
        <div className="bg-green-100 p-4 rounded shadow">
          <h2 className="text-xl font-semibold">Total Slots</h2>
          <p className="text-2xl">{summary.total_slots || 0}</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded shadow">
          <h2 className="text-xl font-semibold">Utilization Rate</h2>
          <p className="text-2xl">{summary.utilization_rate || 0}%</p>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Recent Reservations</h2>
        <ul className="space-y-2">
          {recentReservations.map((res) => (
            <li key={res.id} className="bg-white p-4 rounded shadow">
              <p><strong>User:</strong> {res.user}</p>
              <p><strong>Location:</strong> {res.location_name}</p>
              <p><strong>Status:</strong> {res.status}</p>
              <p><strong>Created:</strong> {new Date(res.created_at).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <a href="/admin/locations" className="bg-white text-center p-4 border rounded shadow hover:bg-gray-50">Manage Locations</a>
        <a href="/admin/slots" className="bg-white text-center p-4 border rounded shadow hover:bg-gray-50">View Slots</a>
        <a href="/admin/users" className="bg-white text-center p-4 border rounded shadow hover:bg-gray-50">View Users</a>
        <a href="/admin/feedback" className="bg-white text-center p-4 border rounded shadow hover:bg-gray-50">View Feedback</a>
      </div>
    </div>
  );
};

export default AdminDashboard;
