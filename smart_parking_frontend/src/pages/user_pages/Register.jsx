import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../services/axios';

const Register = () => {
  const navigate = useNavigate();

  // Form field states
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // Handle field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic password confirmation validation
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      await axiosInstance.post('/api/register/', {
        username: form.username,
        email: form.email,
        password: form.password,
        first_name: form.firstName,
        last_name: form.lastName,
      });

      alert("Registration successful!");
      navigate('/dashboard');
    } catch (error) {
      console.error("Registration failed:", error.response?.data || error.message);
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
        <form onSubmit={handleSubmit}>

          {/* First Name */}
          <FormInput
            label="First Name"
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
          />

          {/* Last Name */}
          <FormInput
            label="Last Name"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
          />

          {/* Username */}
          <FormInput
            label="Username"
            name="username"
            value={form.username}
            onChange={handleChange}
          />

          {/* Email */}
          <FormInput
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
          />

          {/* Password */}
          <FormInput
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
          />

          {/* Confirm Password */}
          <FormInput
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
          />

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

// 🔁 Reusable form input component
const FormInput = ({ label, name, value, onChange, type = "text" }) => (
  <div className="mb-4">
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      required
      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

export default Register;
