import React from 'react';
import ReactDOM from 'react-dom/client';
import AdminApp from './AdminApp';
import UserApp from './UserApp';
import './index.css';

// Read mode from environment variable
const mode = import.meta.env.VITE_APP_MODE;

const root = ReactDOM.createRoot(document.getElementById('root'));

if (mode === 'admin') {
  root.render(<AdminApp />);
} else {
  root.render(<UserApp />);
}
