import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminLogin from './pages/admin_pages/AdminLogin';
import AdminDashboard from './pages/admin_pages/AdminDashboard';
import './App.css'

const AdminApp = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AdminLogin />} />
        <Route path="/dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
};

export default AdminApp;
