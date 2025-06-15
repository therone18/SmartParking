import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../services/axios";

const Payment = () => {
  const { id } = useParams(); // Reservation ID
  const [receipt, setReceipt] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!receipt) {
      alert("Please upload your receipt.");
      return;
    }

    const formData = new FormData();
    formData.append("receipt", receipt);

    try {
      await axiosInstance.patch(
        `/api/reservations/${id}/upload-receipt/`,
        formData
      );

      alert(
        "Receipt uploaded successfully! Your reservation is now being processed."
      );
      navigate("/dashboard");
    } catch (error) {
      console.error("Error uploading receipt:", error);
      alert("Failed to upload receipt. Try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded shadow">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Upload Payment Receipt
      </h1>
      <div className="mb-4">
        <img
          src="/assets/images/sample_qr.png"
          alt="QR Code"
          className="w-64 mx-auto mb-4"
        />
        <p className="text-center text-gray-600">
          Scan the QR code above to make your payment. Then upload your receipt
          below.
        </p>
        <p className="text-center text-red-600">*This is only a sample QR*</p>
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setReceipt(e.target.files[0])}
          required
          className="w-full mb-4"
        />
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Upload Receipt
        </button>
      </form>
    </div>
  );
};

export default Payment;
