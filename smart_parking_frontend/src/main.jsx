import React from 'react';
import ReactDOM from 'react-dom/client';
import AdminApp from './AdminApp';
import UserApp from './UserApp';
import './index.css'

const root = ReactDOM.createRoot(document.getElementById('root'));

// Simulate subdomain using port
const port = window.location.port;

if (port === '3001') {
  root.render(<AdminApp />);
} else {
  root.render(<UserApp />);
}
