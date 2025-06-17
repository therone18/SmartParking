// LocationDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../services/axios";

const LocationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch specific location details by ID
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const res = await axiosInstance.get(`/api/locations/${id}/`);
        setLocation(res.data);
      } catch (err) {
        console.error("Error fetching location details:", err);
        setError("Failed to load location details.");
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();
  }, [id]);

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-lg font-medium text-slate-700">Loading...</p>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-red-600 font-medium">{error}</p>
      </div>
    );
  }

  // Render location info
  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">
          {location.name}
        </h1>

        <p className="text-slate-800 mb-2">
          <span className="font-semibold">Address:</span> {location.address}
        </p>

        {/* Google Maps Link */}
        {location.google_maps_link && (
          <p className="mb-4">
            <a
              href={location.google_maps_link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              View on Google Maps
            </a>
          </p>
        )}

        {/* Go Back Button */}
        <div className="mt-6">
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-gray-200 hover:bg-gray-300 text-slate-800 font-medium py-2 px-4 rounded transition"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationDetails;
