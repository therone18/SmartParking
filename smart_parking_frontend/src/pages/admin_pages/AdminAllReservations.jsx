import React, { useEffect, useState } from "react";
import axiosInstance from "../../services/axios";

const AdminAllReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all reservations from the backend
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await axiosInstance.get("/api/reservations/all/");
        setReservations(response.data);
      } catch (error) {
        console.error("Error fetching reservations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">All Reservations</h1>

      {loading ? (
        <p>Loading reservations...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">User</th>
                <th className="px-4 py-2">Location</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Receipt</th>
                <th className="px-4 py-2">Times</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((res) => (
                <tr key={res.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{res.id}</td>
                  <td className="px-4 py-2">{res.user_full_name || "-"}</td>
                  <td className="px-4 py-2">{res.location?.name || "-"}</td>
                  <td className="px-4 py-2">{res.status}</td>
                  <td className="px-4 py-2">
                    {res.receipt ? (
                      <a
                        href={res.receipt}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        View
                      </a>
                    ) : (
                      <span className="text-gray-400">No receipt</span>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    <div className="text-sm text-gray-600">
                      <p>
                        <strong>In:</strong>{" "}
                        {res.last_park_in
                          ? new Date(res.last_park_in).toLocaleString()
                          : "-"}
                      </p>
                      <p>
                        <strong>Out:</strong>{" "}
                        {res.last_park_out
                          ? new Date(res.last_park_out).toLocaleString()
                          : "-"}
                      </p>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminAllReservations;
