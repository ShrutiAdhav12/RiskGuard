import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/common/Header';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-900">404</h1>
          <p className="text-xl text-gray-600 mt-4">Page not found</p>
          <Link to="/" className="btn-primary mt-8">Back to Home</Link>
        </div>
      </main>
    </div>
  );
}
