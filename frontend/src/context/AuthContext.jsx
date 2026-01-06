//authcontext 

import React, { createContext, useState, useEffect } from 'react';
import { customerAPI, underwriterAPI, adminAPI } from '../utils/api';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedRole = localStorage.getItem('role');
    if (savedUser && savedRole) {
      try {
        setUser(JSON.parse(savedUser));
        setRole(savedRole);
      } catch (err) {
        console.error('Failed to restore user:', err);
      }
    }
    setLoading(false);
  }, []);

  const customerLogin = async (email, password) => {
    try {
      const response = await customerAPI.login(email, password);
      if (response.data.length > 0) {
        const user = response.data[0];
        setUser(user);
        setRole('customer');
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('role', 'customer');
        return true;
      }
      return false;
    } catch (err) {
      setError('Login failed');
      return false;
    }
  };

  const customerRegister = async (formData) => {
    try {
      const existing = await customerAPI.getAll();
      if (existing.data.some(c => c.email === formData.email)) {
        setError('Email already exists');
        return false;
      }
      const newCustomer = {
        ...formData,
        id: Date.now(),
        createdAt: new Date().toISOString().split('T')[0]
      };
      await customerAPI.create(newCustomer);
      return true;
    } catch (err) {
      setError('Registration failed');
      return false;
    }
  };

  const underwriterLogin = async (email, password) => {
    try {
      const response = await underwriterAPI.login(email, password);
      setUser(response.data);
      setRole('underwriter');
      localStorage.setItem('user', JSON.stringify(response.data));
      localStorage.setItem('role', 'underwriter');
      return true;
    } catch (err) {
      setError('Invalid credentials');
      return false;
    }
  };

  const adminLogin = async (email, password) => {
    try {
      const response = await adminAPI.login(email, password);
      setUser(response.data);
      setRole('admin');
      localStorage.setItem('user', JSON.stringify(response.data));
      localStorage.setItem('role', 'admin');
      return true;
    } catch (err) {
      setError('Invalid credentials');
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setRole(null);
    localStorage.removeItem('user');
    localStorage.removeItem('role');
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const checkAuth = () => {
    const storedUser = localStorage.getItem('user');
    const storedRole = localStorage.getItem('role');
    if (storedUser && storedRole) {
      setUser(JSON.parse(storedUser));
      setRole(storedRole);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      role,
      loading,
      error,
      customerLogin,
      customerRegister,
      underwriterLogin,
      adminLogin,
      logout,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
}
