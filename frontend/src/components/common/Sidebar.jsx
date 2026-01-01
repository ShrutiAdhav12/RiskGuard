import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const { role } = useAuth();
  const location = useLocation();

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
    <aside className={`sidebar ${isOpen ? 'w-64' : 'w-20'} transition-all`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 text-white hover:bg-blue-600 text-lg font-bold"
      >
        {isOpen ? '←' : '→'}
      </button>
      <nav className="mt-4">
        {items.map(item => (
          <Link
            key={item.path}
            to={item.path}
            className={`sidebar-link ${
              location.pathname === item.path ? 'active' : ''
            } ${!isOpen && 'justify-center'}`}
            title={!isOpen ? item.label : ''}
          >
            {isOpen ? item.label : item.label[0]}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
