// Payment.jsx
import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axiosInstance from "../../services/axios";
import sampleQR from "../../assets/images/sample_qr.png";

const Payment = () => {
  const { id } = useParams(); // Reservation ID from route
  const navigate = useNavigate();

  const [receipt, setReceipt] = useState(null); // Uploaded receipt file
  const [uploadSuccess, setUploadSuccess] = useState(false); // Show confirmation UI

  // Submit uploaded receipt to backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!receipt) {
      alert("Please upload your receipt.");
      return;
    }

    const formData = new FormData();
    formData.append("receipt", receipt);

    try {
      // PATCH request to upload receipt
      await axiosInstance.patch(`/api/reservations/${id}/upload-receipt/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setUploadSuccess(true); // Switch to success UI
    } catch (error) {
      console.error("Error uploading receipt:", error);
      alert("Failed to upload receipt. Try again.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10">
      <div className="bg-white max-w-md w-full p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-slate-900 mb-4 text-center">
          Upload Payment Receipt
        </h1>

        {/* Simulated QR code instructions */}
        <div className="mb-6 text-center">
          <img src={sampleQR} alt="QR Code" className="w-64 mx-auto mb-4" />
          <p className="text-gray-600 mt-2">
            Scan the QR code above to pay via your preferred PH wallet.
          </p>
          <p className="text-red-500 text-sm font-medium mt-1">
            * This is a simulated QR *
          </p>
        </div>

        {!uploadSuccess ? (
          // File Upload Form
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload Receipt (Image)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setReceipt(e.target.files[0])}
                required
                className="w-full border border-gray-300 rounded p-2 file:border-0 file:bg-indigo-100 file:text-indigo-800"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded transition"
            >
              Upload & Continue
            </button>

            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="w-full mt-2 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded transition"
            >
              Cancel and Go Back
            </button>
          </form>
        ) : (
          // Success Message UI
          <div className="text-center space-y-4">
            <p className="text-green-600 font-semibold">
              Receipt uploaded successfully! Your reservation is now being processed.
            </p>
            <Link
              to={`/reservations/${id}`}
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              View Reservation Details
            </Link>
            <button
              onClick={() => navigate("/dashboard")}
              className="block w-full mt-3 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded transition"
            >
              Go Back to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payment;
