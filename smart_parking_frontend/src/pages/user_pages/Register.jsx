// Register.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "../../services/axios";

const Register = () => {
  const navigate = useNavigate();

  // Form state
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Handle field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Password match check
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      // Send registration request
      await axiosInstance.post("/api/register/", {
        username: form.username,
        email: form.email,
        password: form.password,
        first_name: form.firstName,
        last_name: form.lastName,
      });

      alert("Registration successful!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Registration failed:", error.response?.data || error.message);
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
        <h2 className="text-3xl font-bold mb-6 text-center text-slate-900">
          Create Your Account
        </h2>

        {/* Registration Form */}
        <form onSubmit={handleSubmit}>
          <FormInput
            label="First Name"
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
          />
          <FormInput
            label="Last Name"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
          />
          <FormInput
            label="Username"
            name="username"
            value={form.username}
            onChange={handleChange}
          />
          <FormInput
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
          />
          <FormInput
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
          />
          <FormInput
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
          />

          <button
            type="submit"
            className="w-full bg-indigo-800 text-white py-2 px-4 rounded-md shadow-sm hover:bg-indigo-900 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Register
          </button>
        </form>

        {/* Link to login */}
        <div className="mt-6 text-center text-sm text-slate-900">
          Already have an account?{" "}
          <Link to="/" className="text-blue-500 font-medium hover:underline">
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
};

// 🔁 Reusable Input Component
const FormInput = ({ label, name, value, onChange, type = "text" }) => (
  <div className="mb-4">
    <label
      htmlFor={name}
      className="block text-sm font-medium text-slate-900 mb-1"
    >
      {label}
    </label>
    <input
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      required
      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
    />
  </div>
);

export default Register;
