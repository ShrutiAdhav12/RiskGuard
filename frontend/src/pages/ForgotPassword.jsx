import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { customerAPI } from '../utils/api';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const VALID_OTP = '123456';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [step, setStep] = useState('email'); // 'email', 'otp', or 'reset'
  const [resetEmail, setResetEmail] = useState('');

  const {
    register: registerEmail,
    handleSubmit: handleSubmitEmail,
    formState: { errors: errorsEmail }
  } = useForm({
    defaultValues: {
      email: ''
    }
  });

  const {
    register: registerOtp,
    handleSubmit: handleSubmitOtp,
    formState: { errors: errorsOtp },
    reset: resetOtpForm
  } = useForm({
    defaultValues: {
      otp: ''
    }
  });

  const {
    register: registerReset,
    handleSubmit: handleSubmitReset,
    watch,
    formState: { errors: errorsReset }
  } = useForm({
    defaultValues: {
      newPassword: '',
      confirmPassword: ''
    }
  });

  const newPasswordValue = watch('newPassword');

  const onSubmitEmail = async (data) => {
    setLoading(true);
    try {
      // Verify that the email exists in the database
      const response = await customerAPI.getAll();
      const customers = response.data;
      const customerExists = customers.some(c => c.email === data.email);

      if (customerExists) {
        setResetEmail(data.email);
        setMessage(`OTP sent to ${data.email}. OTP: ${VALID_OTP}`);
        setTimeout(() => {
          setStep('otp');
          setMessage('');
        }, 2000);
      } else {
        setMessage('Email not found in our records');
      }
    } catch (err) {
      setMessage('Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onSubmitOtp = (data) => {
    if (data.otp === VALID_OTP) {
      setMessage('OTP verified successfully!');
      setTimeout(() => {
        setStep('reset');
        setMessage('');
        resetOtpForm();
      }, 1500);
    } else {
      setMessage('Invalid OTP. Please try again.');
    }
  };

  const onSubmitReset = async (data) => {
    setLoading(true);
    try {
      // Call API to reset password
      await customerAPI.resetPassword(resetEmail, data.newPassword);
      setMessage('Password reset successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setMessage('Failed to reset password. Please try again.');
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
            <h1 className="text-3xl font-bold text-center mb-2">Reset Password</h1>
            <p className="text-center text-gray-600 text-sm mb-8">
              {step === 'email'
                ? 'Enter your email to receive an OTP'
                : step === 'otp'
                ? 'Enter the OTP sent to your email'
                : 'Create your new password'}
            </p>

            {message && (
              <div
                className={`mb-4 p-3 rounded text-sm ${
                  message.includes('successful')
                    ? 'bg-green-100 text-green-700'
                    : 'bg-blue-100 text-blue-700'
                }`}
              >
                {message}
              </div>
            )}

            {step === 'email' ? (
              <form onSubmit={handleSubmitEmail(onSubmitEmail)} className="space-y-4">
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    placeholder="Enter your registered email"
                    className={`w-full px-4 py-2 border rounded-lg ${
                      errorsEmail.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    {...registerEmail('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: 'Please enter a valid email address'
                      }
                    })}
                  />
                  {errorsEmail.email && (
                    <p className="text-red-500 text-sm mt-1">{errorsEmail.email.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary btn-block"
                >
                  {loading ? 'Sending...' : 'Send OTP'}
                </button>
              </form>
            ) : step === 'otp' ? (
              <form onSubmit={handleSubmitOtp(onSubmitOtp)} className="space-y-4">
                <div className="form-group">
                  <label>Enter OTP</label>
                  <input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    maxLength="6"
                    className={`w-full px-4 py-2 border rounded-lg text-center text-2xl tracking-widest ${
                      errorsOtp.otp ? 'border-red-500' : 'border-gray-300'
                    }`}
                    {...registerOtp('otp', {
                      required: 'OTP is required',
                      minLength: {
                        value: 6,
                        message: 'OTP must be 6 digits'
                      },
                      maxLength: {
                        value: 6,
                        message: 'OTP must be 6 digits'
                      }
                    })}
                  />
                  {errorsOtp.otp && (
                    <p className="text-red-500 text-sm mt-1">{errorsOtp.otp.message}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-2">Test OTP: {VALID_OTP}</p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary btn-block"
                >
                  {loading ? 'Verifying...' : 'Verify OTP'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleSubmitReset(onSubmitReset)} className="space-y-4">
                <div className="form-group">
                  <label>New Password</label>
                  <input
                    type="password"
                    placeholder="Enter new password"
                    className={`w-full px-4 py-2 border rounded-lg ${
                      errorsReset.newPassword ? 'border-red-500' : 'border-gray-300'
                    }`}
                    {...registerReset('newPassword', {
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters'
                      },
                      pattern: {
                        value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/,
                        message: 'Password must contain at least one letter and one number'
                      }
                    })}
                  />
                  {errorsReset.newPassword && (
                    <p className="text-red-500 text-sm mt-1">{errorsReset.newPassword.message}</p>
                  )}
                </div>

                <div className="form-group">
                  <label>Confirm Password</label>
                  <input
                    type="password"
                    placeholder="Re-enter your password"
                    className={`w-full px-4 py-2 border rounded-lg ${
                      errorsReset.confirmPassword ? 'border-red-500' : 'border-gray-300'
                    }`}
                    {...registerReset('confirmPassword', {
                      required: 'Please confirm your password',
                      validate: (value) =>
                        value === newPasswordValue || 'Passwords do not match'
                    })}
                  />
                  {errorsReset.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">{errorsReset.confirmPassword.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary btn-block"
                >
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>
              </form>
            )}

            <div className="mt-6 pt-6 border-t text-center">
              <p className="text-sm text-gray-600 mb-4">Remember your password?</p>
              <Link to="/login" className="btn-secondary btn-block">Back to Login</Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
