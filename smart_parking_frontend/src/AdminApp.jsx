import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminLogin from './pages/admin_pages/AdminLogin';
import AdminDashboard from './pages/admin_pages/AdminDashboard';
import AdminAllReservations from "./pages/admin_pages/AdminAllReservations";
import AdminLocationManagement from './pages/admin_pages/AdminLocationManagement';
import AdminReservationManagement from './pages/admin_pages/AdminReservationManagement';
import AdminUserManagement from './pages/admin_pages/AdminUserManagement';

import './App.css'

const AdminApp = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AdminLogin />} />
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="/reservations" element={<AdminAllReservations />} />
        <Route path="/locations" element={<AdminLocationManagement />} />
        <Route path="/reservations/management" element={<AdminReservationManagement />} />
        <Route path="/user/management" element={<AdminUserManagement />} />
      </Routes>
    </Router>
  );
};

export default AdminApp;
