import React, { useEffect, useState } from "react";
import axiosInstance from "../../services/axios";
import { Navigate } from "react-router-dom";

const Profile = () => {
    const navigate = Navigate();
  const [profile, setProfile] = useState(null); // Holds fetched user data
  const [isEditing, setIsEditing] = useState(false); // Toggle form edit mode
  const [formData, setFormData] = useState({}); // Editable form values

  // Fetch user profile on component mount
  useEffect(() => {
    fetchProfile();
  }, []);

  // Load current user profile data
  const fetchProfile = async () => {
    try {
      const res = await axiosInstance.get("/api/profile/update");
      setProfile(res.data);
      setFormData(res.data); // Pre-fill form fields
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    }
  };

  // Update local state as form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit profile changes
  const handleSave = async () => {
    try {
      await axiosInstance.put("/api/profile/", formData);
      setIsEditing(false);
      fetchProfile(); // Refresh display
      alert("Profile Saved!");
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert("Error updating profile.");
    }
  };

  if (!profile) return <div className="p-6 text-center">Loading profile...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">My Profile</h1>

        {/* Profile Form Fields */}
        <div className="space-y-4">
          <Field
            label="First Name"
            name="first_name"
            value={formData.first_name}
            disabled={!isEditing}
            onChange={handleChange}
          />
          <Field
            label="Last Name"
            name="last_name"
            value={formData.last_name}
            disabled={!isEditing}
            onChange={handleChange}
          />
          <Field
            label="Email"
            name="email"
            value={formData.email}
            disabled={!isEditing}
            onChange={handleChange}
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
                Go Back to Dashboard
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleSave}
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
      </div>
    </div>
  );
};

// Reusable input field component
const Field = ({ label, name, value, onChange, disabled }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
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

export default Profile;
