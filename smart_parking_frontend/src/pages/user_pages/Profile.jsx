import React, { useEffect, useState } from "react";
import axiosInstance from "../../services/axios";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axiosInstance.get("/api/profile/");
      setProfile(res.data);
      setFormData(res.data);
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    try {
      await axiosInstance.put("/api/profile/update", formData);
      setIsEditing(false);
      fetchProfile();
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    }
  };

  const handleChangePassword = async () => {
    const { current_password, new_password, confirm_password } = passwordData;
    if (!current_password || !new_password || !confirm_password) {
      return alert("Please fill in all password fields.");
    }
    if (new_password !== confirm_password) {
      return alert("New passwords do not match.");
    }

    try {
      await axiosInstance.put("/api/profile/change-password/", {
        current_password,
        new_password,
        refresh: localStorage.getItem("refresh_token"), 
      });
      alert("Password updated successfully!");
      setPasswordData({
        current_password: "",
        new_password: "",
        confirm_password: "",
      });
      setShowPasswordForm(false);
      localStorage.clear(); 
      navigate("/login");
    } catch (error) {
      console.error("Password update failed:", error);
      alert("Failed to change password.");
    }
  };

  if (!profile) {
    return <div className="p-6 text-center">Loading profile...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">My Profile</h1>

        {/* Profile Fields */}
        <div className="space-y-4">
          <Field
            label="First Name"
            name="first_name"
            value={formData.first_name}
            disabled={!isEditing}
            onChange={handleProfileChange}
          />
          <Field
            label="Last Name"
            name="last_name"
            value={formData.last_name}
            disabled={!isEditing}
            onChange={handleProfileChange}
          />
          <Field
            label="Email"
            name="email"
            value={formData.email}
            disabled={!isEditing}
            onChange={handleProfileChange}
          />
        </div>

        {/* Action Buttons */}
        <div className="mt-6 space-x-3">
          {!isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Edit
              </button>
              <button
                onClick={() => navigate("/dashboard")}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
              >
                Go Back
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleSaveProfile}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setFormData(profile);
                  setIsEditing(false);
                }}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </>
          )}
        </div>

        {/* Toggle password change */}
        <div className="mt-8">
          <button
            onClick={() => setShowPasswordForm((prev) => !prev)}
            className="text-blue-500 hover:underline text-sm"
          >
            {showPasswordForm ? "Cancel Password Change" : "Change Password"}
          </button>

          {showPasswordForm && (
            <div className="mt-4 space-y-4">
              <PasswordField
                label="Current Password"
                name="current_password"
                value={passwordData.current_password}
                onChange={handlePasswordChange}
              />
              <PasswordField
                label="New Password"
                name="new_password"
                value={passwordData.new_password}
                onChange={handlePasswordChange}
              />
              <PasswordField
                label="Confirm New Password"
                name="confirm_password"
                value={passwordData.confirm_password}
                onChange={handlePasswordChange}
              />
              <button
                onClick={handleChangePassword}
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
              >
                Update Password
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Field = ({ label, name, value, onChange, disabled }) => (
  <div>
    <label
      htmlFor={name}
      className="block text-sm font-medium text-gray-700 mb-1"
    >
      {label}
    </label>
    <input
      type="text"
      name={name}
      id={name}
      value={value || ""}
      onChange={onChange}
      disabled={disabled}
      className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm ${
        disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white"
      }`}
    />
  </div>
);

const PasswordField = ({ label, name, value, onChange }) => (
  <div>
    <label
      htmlFor={name}
      className="block text-sm font-medium text-gray-700 mb-1"
    >
      {label}
    </label>
    <input
      type="password"
      name={name}
      id={name}
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white"
    />
  </div>
);

export default Profile;
