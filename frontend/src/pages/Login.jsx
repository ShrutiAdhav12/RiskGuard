import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../hooks/useAuth';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

export default function Login() {
  const navigate = useNavigate();
  const { customerLogin, underwriterLogin, adminLogin } = useAuth();
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (data) => {
    setServerError('');
    setLoading(true);

    try {
      let success = false;
      let detectedRole = 'customer';

      // Auto-detect role based on email pattern
      if (data.email.includes('underwriter')) {
        success = await underwriterLogin(data.email, data.password);
        detectedRole = 'underwriter';
      } else if (data.email.includes('admin')) {
        success = await adminLogin(data.email, data.password);
        detectedRole = 'admin';
      } else {
        success = await customerLogin(data.email, data.password);
        detectedRole = 'customer';
      }

      if (success) {
        if (detectedRole === 'underwriter') navigate('/underwriter/dashboard');
        else if (detectedRole === 'admin') navigate('/admin/dashboard');
        else navigate('/customer/dashboard');
      } else {
        setServerError('Invalid email or password');
      }
    } catch (err) {
      setServerError('Login failed. Please try again.');
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

            {serverError && <div className="alert alert-error mb-4">{serverError}</div>}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className={`w-full px-4 py-2 border rounded-lg ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Please enter a valid email address'
                    }
                  })}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Customer, underwriter, or admin email
                </p>
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  className={`w-full px-4 py-2 border rounded-lg ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  })}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                )}
              </div>

              <div className="text-right">
                <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
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
              <Link to="/register" className="btn-secondary btn-block">Create Account</Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
