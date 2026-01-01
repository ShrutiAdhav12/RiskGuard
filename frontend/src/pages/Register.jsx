import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import { validateForm } from '../utils/validators';

export default function Register() {
  const navigate = useNavigate();
  const { customerRegister } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const errors = validateForm({ name, email, password });
    if (Object.keys(errors).length > 0) {
      setError(Object.values(errors)[0]);
      return;
    }

    setLoading(true);
    try {
      const success = await customerRegister({ name, email, password });
      if (success) {
        alert('Registration successful! Please login.');
        navigate('/login');
      } else {
        setError('Email already exists');
      }
    } catch (err) {
      setError('Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center bg-primary-light py-12 px-4">
        <div className="w-full max-w-md card">
          <div className="card-body">
            <h1 className="text-3xl font-bold text-center mb-2">Create Account</h1>
            <p className="text-center text-gray-600 mb-8">Join RiskGuard Insurance</p>

            {error && <div className="alert alert-error mb-4">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary btn-block"
              >
                {loading ? 'Creating...' : 'Create Account'}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t text-center">
              <p className="text-sm text-gray-600">Already have an account? <Link to="/login" className="font-bold text-primary">Login</Link></p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
