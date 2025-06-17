import { useEffect, useState } from "react";
import axiosInstance from "../../services/axios";
import QuickActions from "../../components/QuickActions";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [reservations, setReservations] = useState([]);
  const [profile, setProfile] = useState({});
  const [recent, setRecent] = useState([]);
  const [locations, setLocations] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const getData = async () => {
      try {
        const [res1, res2, res3] = await Promise.all([
          axiosInstance.get("/api/reservations/me/"),
          axiosInstance.get("/api/profile/"),
          axiosInstance.get("/api/locations/"),
        ]);

        const all = Array.isArray(res1.data.data) ? res1.data.data : [];

        setReservations(all.filter((r) => r.status === "Active"));

        setRecent(
          all
            .filter(
              (r) => r.status === "Complete" || r.status === "Checked-out"
            )
            .sort(
              (a, b) =>
                new Date(b.last_park_out || b.end_time) -
                new Date(a.last_park_out || a.end_time)
            )
            .slice(0, 3)
        );

        setProfile(res2.data);
        setLocations(res3.data);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      }
    };

    getData();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-6">
          Welcome back, {profile.first_name || "User"}!
        </h1>

        {/* Active Reservations */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-3">
            Active Reservations
          </h2>
          <ul className="space-y-3">
            {reservations.length === 0 ? (
              <li className="text-gray-500">No active reservations.</li>
            ) : (
              reservations.map((res) => (
                <li
                  key={res.id}
                  className="flex justify-between items-center border rounded p-3"
                >
                  <div>
                    <div className="font-medium text-slate-900">
                      {res.location?.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(res.start_time).toLocaleString()} →{" "}
                      {new Date(res.end_time).toLocaleString()}
                    </div>
                  </div>
                  <span className="px-3 py-1 text-sm rounded-full bg-green-100 text-green-600 font-medium">
                    {res.status}
                  </span>
                </li>
              ))
            )}
          </ul>
        </div>

        {/* Recent Parking Activity */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-semibold text-slate-900">
              Recent Parking Activity
            </h2>
            <button
              onClick={() => navigate("/reservations/history")}
              className="text-sm text-blue-500 hover:underline"
            >
              View All History →
            </button>
          </div>

          <ul className="space-y-3">
            {recent.length === 0 ? (
              <li className="text-gray-500">No recent parking history.</li>
            ) : (
              recent.map((res) => (
                <li key={res.id} className="border rounded p-3">
                  <div className="text-slate-900 font-medium">
                    {res.location?.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(
                      res.last_park_in || res.start_time
                    ).toLocaleString()}{" "}
                    →{" "}
                    {new Date(
                      res.last_park_out || res.end_time
                    ).toLocaleString()}
                  </div>
                  <div className="text-sm mt-1 text-slate-600">
                    Status:{" "}
                    <span
                      className={
                        res.status === "Complete"
                          ? "text-green-500"
                          : "text-amber-500"
                      }
                    >
                      {res.status}
                    </span>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>

        {/* Available Locations */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-3">
            Available Locations
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {locations.map((loc) => (
              <div
                key={loc.id}
                className="border rounded p-4 bg-slate-50 hover:bg-slate-100 transition"
              >
                <h3 className="text-lg font-bold text-indigo-800">
                  {loc.name}
                </h3>
                <p className="text-sm text-gray-700 mb-2">{loc.address}</p>
                {loc.google_maps_url && (
                  <a
                    href={loc.google_maps_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline text-sm"
                  >
                    View on Google Maps
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>

        <footer className="text-sm text-gray-500 text-center mt-12">
          &copy; 2025 Smart Parking App | TJBA
        </footer>
      </div>

      {/* Floating quick actions */}
      <QuickActions onLogout={handleLogout} />
    </div>
  );
};

export default Dashboard;
