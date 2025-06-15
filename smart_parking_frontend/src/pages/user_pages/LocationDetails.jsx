import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../services/axios';

const LocationDetails = () => {
  const { id } = useParams(); // Location ID from URL
  const navigate = useNavigate();
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const res = await axiosInstance.get(`/api/locations/${id}/`);
        setLocation(res.data);
      } catch (err) {
        setError('Failed to fetch location details.');
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-lg font-medium text-gray-700">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">{location.name}</h1>
        <p className="text-gray-700 mb-2">
          <span className="font-medium">Address:</span> {location.address}
        </p>
        {location.google_maps_link && (
          <p className="text-blue-600 mb-4">
            <a
              href={location.google_maps_link}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              View on Google Maps
            </a>
          </p>
        )}

        <div className="mt-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded"
          >
            Go Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationDetails;
