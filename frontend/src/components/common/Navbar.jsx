import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function Navbar() {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar flex items-center justify-between px-6 py-4">
      <Link to="/" className="text-2xl font-bold text-white">RiskGuard</Link>
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="text-sm text-white">{user.email}</span>
            <button onClick={handleLogout} className="btn-secondary btn-small">Logout</button>
          </>
        ) : (
          <Link to="/login" className="btn-secondary btn-small">Login</Link>
        )}
      </div>
    </nav>
  );
}
