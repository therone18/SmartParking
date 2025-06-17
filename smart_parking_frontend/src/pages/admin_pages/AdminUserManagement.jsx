import { useEffect, useState } from "react";
import axiosInstance from "../../services/axios";

const AdminUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [togglingUserId, setTogglingUserId] = useState(null);
  const [error, setError] = useState("");

  // Fetch users from API and get info
  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axiosInstance.get("/api/users/");
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to load users. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Toggle activation/deactivation
  const handleToggle = async (userId, isActive) => {
    const action = isActive ? "deactivate" : "reactivate";
    const confirmed = window.confirm(
      `Are you sure you want to ${action} this user?`
    );
    if (!confirmed) return;

    setTogglingUserId(userId);
    try {
      const endpoint = `/api/users/${userId}/${action}/`;
      await axiosInstance.post(endpoint);
      await fetchUsers();
    } catch (err) {
      console.error("Toggle error:", err);
      alert("Failed to update user status.");
    } finally {
      setTogglingUserId(null);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-slate-900 mb-4">User Management</h1>

      {loading ? (
        <p className="text-slate-600">Loading users...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
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
              {users.map((user) => (
                <UserRow
                  key={user.id}
                  user={user}
                  onToggle={handleToggle}
                  isToggling={togglingUserId === user.id}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// 🔁 Modular row component
const UserRow = ({ user, onToggle, isToggling }) => {
  const isActive = user.is_active;
  const statusText = isActive ? "Active" : "Inactive";
  const statusClass = isActive ? "text-green-500" : "text-red-500";
  const toggleLabel = isToggling
    ? "Processing..."
    : isActive
    ? "Deactivate"
    : "Reactivate";
  const toggleClass = isActive
    ? "bg-red-500 hover:bg-red-600"
    : "bg-green-500 hover:bg-green-600";

  return (
    <tr className="border-t text-sm">
      <td className="px-4 py-2">
        {user.first_name} {user.last_name}
      </td>
      <td className="px-4 py-2">{user.email}</td>
      <td className="px-4 py-2">
        <span className={`font-medium ${statusClass}`}>{statusText}</span>
      </td>
      <td className="px-4 py-2">
        <button
          disabled={isToggling}
          onClick={() => onToggle(user.id, isActive)}
          className={`px-3 py-1 text-sm rounded text-white transition disabled:opacity-50 ${toggleClass}`}
        >
          {toggleLabel}
        </button>
      </td>
    </tr>
  );
};

export default AdminUserManagement;
