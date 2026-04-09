import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="navbar-logo">✦</span>
        <span className="navbar-title">SmartTask</span>
      </div>
      <div className="navbar-right">
        <span className="navbar-user">
          <span className="user-avatar">{user?.name?.charAt(0).toUpperCase()}</span>
          <span className="user-name">{user?.name}</span>
        </span>
        <button className="btn-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
