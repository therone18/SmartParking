import { useEffect, useState } from "react";
import axiosInstance from "../../services/axios";

const AdminUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all user accounts
  const fetchUsers = async () => {
    try {
      const res = await axiosInstance.get("/api/users/");
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  // Toggle user status using the appropriate endpoint
  const handleToggle = async (userId, isActive) => {
    const endpoint = isActive
      ? `/api/users/${userId}/deactivate/`
      : `/api/users/${userId}/reactivate/`;

    try {
      await axiosInstance.post(endpoint);
      fetchUsers(); // Refresh user list
    } catch (err) {
      console.error("Error toggling user status:", err);
      alert("Failed to update user status.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <div className="p-6 text-slate-600">Loading users...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-slate-900 mb-4">User Management</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow text-slate-900">
          <thead className="bg-gray-100 text-left text-sm text-slate-700">
            <tr>
              <th className="px-4 py-2">Full Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const isActive = user.is_active;
              const statusText = isActive ? "Active" : "Inactive";
              const statusClass = isActive ? "text-green-500" : "text-red-500";
              const toggleLabel = isActive ? "Deactivate" : "Reactivate";
              const toggleClass = isActive
                ? "bg-red-500 hover:bg-red-600"
                : "bg-green-500 hover:bg-green-600";

              return (
                <tr key={user.id} className="border-t text-sm">
                  <td className="px-4 py-2">
                    {user.first_name} {user.last_name}
                  </td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2">
                    <span className={`font-medium ${statusClass}`}>
                      {statusText}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleToggle(user.id, isActive)}
                      className={`px-3 py-1 text-sm rounded text-white transition ${toggleClass}`}
                    >
                      {toggleLabel}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUserManagement;
