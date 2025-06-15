import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminLogin from './pages/admin_pages/AdminLogin';
import AdminDashboard from './pages/admin_pages/AdminDashboard';
import AdminAllReservations from "./pages/admin_pages/AdminAllReservations";
import AdminLocationDashboard from './pages/admin_pages/AdminLocationDashboard';
import AdminReservationManagement from './pages/admin_pages/AdminReservationManagement';

import './App.css'

const AdminApp = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AdminLogin />} />
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="/reservations" element={<AdminAllReservations />} />
        <Route path="/locations" element={<AdminLocationDashboard />} />
        <Route path="/reservations/management" element={<AdminReservationManagement />} />
      </Routes>
    </Router>
  );
};

export default AdminApp;
