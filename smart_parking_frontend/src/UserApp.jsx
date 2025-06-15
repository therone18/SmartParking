import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/user_pages/Login';
import Register from './pages/user_pages/Register';
import Dashboard from './pages/user_pages/Dashboard';
import Profile from './pages/user_pages/Profile';
import MyReservations from './pages/user_pages/MyReservations';
import MakeReservation from "./pages/user_pages/MakeReservation";
import LocationDetails from './pages/user_pages/LocationDetails';
import Payment from './pages/user_pages/Payment';
import ReservationDetails from './pages/user_pages/ReservationDetails';
import ReservationHistory from './pages/user_pages/ReservationHistory';
import './App.css'

const UserApp = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/myreservations" element={<MyReservations />} />
        <Route path="/reservations/new" element={<MakeReservation />} />
        <Route path="/locations/:id" element={<LocationDetails />} />
        <Route path="/payment/:id" element={<Payment />} />
        <Route path="/reservations/:id" element={<ReservationDetails />} />
        <Route path="/reservations/history" element={<ReservationHistory />} />
      </Routes>
    </Router>
  );
};

export default UserApp;
