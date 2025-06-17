// Login.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "../../services/axios";

const Login = () => {
  const navigate = useNavigate();

  // Local state for form inputs
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Optional: Check if backend is reachable on mount
  useEffect(() => {
    const testBackendConnection = async () => {
      try {
        const res = await axiosInstance.get("/api/test-cors/");
        console.log("✅ Backend reachable:", res.data);
      } catch (error) {
        console.error("❌ Backend/CORS error:", error);
        alert("Backend is not responding or blocked by CORS.");
      }
    };

    testBackendConnection();
  }, []);

  // Handle login form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.post("/api/login/", {
        username,
        password,
      });

      // Store tokens in localStorage
      localStorage.setItem("access", response.data.access);
      localStorage.setItem("refresh", response.data.refresh);

      console.log("✅ Login successful");
      navigate("/dashboard");
    } catch (error) {
      console.error("❌ Login failed:", error.response?.data || error.message);
      alert("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-indigo-800 mb-6">
          Be Smart, Start Parking.
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-slate-900 mb-1"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-800"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-900 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-800"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-800 text-white font-semibold rounded-md hover:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-800"
          >
            Login
          </button>
        </form>

        {/* Register Link */}
        <div className="mt-6 text-center text-sm text-slate-900">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-blue-500 font-medium hover:underline"
          >
            Sign Up to Start Parking
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
