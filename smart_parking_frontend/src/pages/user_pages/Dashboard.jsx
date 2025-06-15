import { useEffect, useState } from "react";
import axiosInstance from "../../services/axios";

const Dashboard = () => {
  const [reservations, setReservations] = useState([]);
  const [profile, setProfile] = useState([]);
  const user = { firstName: "Therone", lastName: "Smith" };

  useEffect(() => {
    const getData = async () => {
      try {
        const [res1, res2] = await Promise.all([
          axiosInstance.get("/api/reservations/me/"),
          axiosInstance.get("/api/profile/"),
        ]);
        setReservations(res1.data);
        setProfile(res2.data);
      } catch (error) {
        console.error(
          "Failed to get reservation data:",
          error.response?.data || error.message
        );
      }
    };

    getData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Welcome back, {profile.first_name}!
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-2">Active Reservations</h2>
            <ul className="space-y-2">
              {reservations.length === 0 ? (
                <li className="text-gray-500">No reservations yet.</li>
              ) : (
                reservations.map((res) => (
                  <li
                    key={res.id}
                    className="border rounded p-3 flex justify-between items-center"
                  >
                    <div>
                      <div className="font-medium">
                        {res.location?.name || "Unknown Location"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(res.start_time).toLocaleString()} →{" "}
                        {new Date(res.end_time).toLocaleString()}
                      </div>
                    </div>
                    <span className="px-2 py-1 text-sm rounded-full bg-green-200 text-green-800">
                      {res.status}
                    </span>
                  </li>
                ))
              )}
            </ul>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded shadow">
                Make a Reservation
              </button>
              <button className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded shadow"
              onClick={() =>{
                  window.location.href = "/myreservations";
                }}>
                View My Reservations
              </button>
              <button className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded shadow"
                onClick={() =>{
                  window.location.href = "/profile";
                }}
                >
                Go to My Profile
              </button>
              <button
                onClick={() => {
                  localStorage.clear();
                  window.location.href = "/";
                }}
                className="w-full bg-red-100 hover:bg-red-200 text-red-600 py-2 rounded shadow"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        <footer className="text-sm text-gray-500 text-center mt-8">
          &copy; 2025 Smart Parking App | TJBA
        </footer>
      </div>
    </div>
  );
};

export default Dashboard;
