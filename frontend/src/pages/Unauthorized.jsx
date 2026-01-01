import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/common/Header';

export default function Unauthorized() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-900">403</h1>
          <p className="text-xl text-gray-600 mt-4">Unauthorized Access</p>
          <Link to="/login" className="btn-primary mt-8">Go to Login</Link>
        </div>
      </main>
    </div>
  );
}
