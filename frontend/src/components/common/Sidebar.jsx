import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { applicationAPI } from '../../utils/api';

export default function Sidebar({ onToggle, isOpen: externalIsOpen }) {
  const [internalIsOpen, setInternalIsOpen] = useState(true);
  const [stats, setStats] = useState({
    pending: 0,
    highRisk: 0
  });
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const { role } = useAuth();
  const location = useLocation();

  // Load stats for notifications
  useEffect(() => {
    const loadStats = async () => {
      if (role === 'underwriter') {
        try {
          const response = await applicationAPI.getAll();
          const data = response.data || [];
          setStats({
            pending: data.filter(a => a.status === 'pending').length,
            highRisk: data.filter(a => a.riskScore > 70).length
          });
        } catch (err) {
          console.error('Failed to load stats:', err);
        }
      }
    };
    loadStats();
  }, [role]);

  const handleToggle = () => {
    const newState = !isOpen;
    setInternalIsOpen(newState);
    if (onToggle) onToggle(newState);
  };

  const getMenuItems = () => {
    if (role === 'customer') {
      return [
        { label: 'Dashboard', path: '/customer/dashboard' },
        { label: 'Applications', path: '/customer/applications' },
        { label: 'Policies', path: '/customer/policies' },
        { label: 'Profile', path: '/customer/profile' },
        { label: 'Settings', path: '/customer/settings' }
      ];
    } else if (role === 'underwriter') {
      return [
        { label: 'Dashboard', path: '/underwriter/dashboard' },
        { label: 'Pending Review', path: '/underwriter/pending' },
        { label: 'Notifications', path: '/underwriter/notifications', badge: stats.pending + stats.highRisk },
        { label: 'Settings', path: '/underwriter/settings' }
      ];
    } else if (role === 'admin') {
      return [
        { label: 'Dashboard', path: '/admin/dashboard' },
        { label: 'Products', path: '/admin/products' },
        { label: 'Users', path: '/admin/users' },
        { label: 'Reports', path: '/admin/reports' },
        { label: 'Settings', path: '/admin/settings' }
      ];
    }
    return [];
  };

  const items = getMenuItems();

  return (
    <aside className={`sidebar transition-all ${isOpen ? 'w-64' : 'w-20'}`}>
      <button
        onClick={handleToggle}
        className="w-full p-4 text-white hover:bg-blue-600 text-lg font-bold"
      >
        {isOpen ? '←' : '→'}
      </button>
      <nav className="mt-4">
        {items.map(item => (
          <div key={item.path} className="relative">
            <Link
              to={item.path}
              className={`sidebar-link ${
                location.pathname === item.path ? 'active' : ''
              } ${!isOpen && 'justify-center'}`}
              title={!isOpen ? item.label : ''}
            >
              <span>{isOpen ? item.label : item.label[0]}</span>
              {item.badge && item.badge > 0 && (
                <span className="ml-auto bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          </div>
        ))}
      </nav>
    </aside>
  );
}
