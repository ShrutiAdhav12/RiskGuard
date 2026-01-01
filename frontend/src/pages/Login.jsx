import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import { validateForm } from '../utils/validators';

export default function Login() {
  const navigate = useNavigate();
  const { customerLogin, underwriterLogin, adminLogin } = useAuth();
  const [role, setRole] = useState('customer'); // Hidden selection, direct input only
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let success = false;
      let detectedRole = 'customer';

      // Auto-detect role based on email pattern
      if (email.includes('underwriter')) {
        success = await underwriterLogin(email, password);
        detectedRole = 'underwriter';
      } else if (email.includes('admin')) {
        success = await adminLogin(email, password);
        detectedRole = 'admin';
      } else {
        success = await customerLogin(email, password);
        detectedRole = 'customer';
      }

      if (success) {
        if (detectedRole === 'underwriter') navigate('/underwriter/dashboard');
        else if (detectedRole === 'admin') navigate('/admin/dashboard');
        else navigate('/customer/dashboard');
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('Login failed');
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
            <h1 className="text-3xl font-bold text-center mb-2">Login</h1>
            <p className="text-center text-gray-600 text-sm mb-8">Welcome to RiskGuard</p>

            {error && <div className="alert alert-error mb-4">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Customer, underwriter, or admin email
                </p>
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary btn-block"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t text-center">
              <p className="text-sm text-gray-600 mb-4">New to RiskGuard?</p>
              <Link to="/register" className="btn-secondary btn-block">Create Customer Account</Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
