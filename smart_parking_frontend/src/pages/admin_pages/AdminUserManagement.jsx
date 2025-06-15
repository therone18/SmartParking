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

  // Toggle user status (active/inactive)
  const handleToggle = async (userId) => {
    try {
      await axiosInstance.patch(`/api/admin/users/${userId}/toggle/`);
      fetchUsers(); // Refresh user list after update
    } catch (err) {
      console.error("Error toggling user status:", err);
      alert("Failed to update user status.");
    }
  };

  // Fetch users on initial page load
  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <div className="p-6">Loading users...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>

      <table className="min-w-full bg-white rounded shadow">
        <thead className="bg-gray-200 text-left text-gray-700">
          <tr>
            <th className="px-4 py-2">Full Name</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-t">
              <td className="px-4 py-2">
                {user.first_name} {user.last_name}
              </td>
              <td className="px-4 py-2">{user.email}</td>
              <td className="px-4 py-2">
                {user.is_active ? (
                  <span className="text-green-600">Active</span>
                ) : (
                  <span className="text-red-500">Inactive</span>
                )}
              </td>
              <td className="px-4 py-2">
                <button
                  onClick={() => handleToggle(user.id)}
                  className={`px-3 py-1 rounded text-white ${
                    user.is_active
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-green-500 hover:bg-green-600"
                  }`}
                >
                  {user.is_active ? "Deactivate" : "Reactivate"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUserManagement;
