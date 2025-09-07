import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { register as registerUser, selectAuth } from '../../store/slices/authSlice';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import { Helmet } from 'react-helmet-async';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading } = useSelector(selectAuth);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch('password');

  const onSubmit = async (data) => {
    const result = await dispatch(registerUser(data));
    if (result.type === 'auth/register/fulfilled') {
      navigate('/');
    }
  };

  return (
    <>
      <Helmet>
        <title>Sign Up - Adult Content Platform</title>
        <meta name="description" content="Create your account to access exclusive adult content." />
      </Helmet>

      <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full glass rounded-2xl p-8">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              <span className="text-2xl font-bold text-white">AdultPlatform</span>
            </Link>
            <h1 className="text-2xl font-bold text-white mb-2">Create Account</h1>
            <p className="text-dark-300">Join our community of creators and fans</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="form-label">Username</label>
              <input
                type="text"
                {...register('username', {
                  required: 'Username is required',
                  minLength: {
                    value: 3,
                    message: 'Username must be at least 3 characters',
                  },
                  pattern: {
                    value: /^[a-zA-Z0-9_-]+$/,
                    message: 'Username can only contain letters, numbers, underscores and hyphens',
                  },
                })}
                className="form-input"
                placeholder="Choose a username"
              />
              {errors.username && (
                <p className="text-red-400 text-sm mt-1">{errors.username.message}</p>
              )}
            </div>

            <div>
              <label className="form-label">Email Address</label>
              <input
                type="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: 'Please enter a valid email address',
                  },
                })}
                className="form-input"
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="form-label">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                  })}
                  className="form-input pr-12"
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <svg className="h-5 w-5 text-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {showPassword ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    )}
                  </svg>
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label className="form-label">Confirm Password</label>
              <input
                type="password"
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (value) =>
                    value === password || 'Passwords do not match',
                })}
                className="form-input"
                placeholder="Confirm your password"
              />
              {errors.confirmPassword && (
                <p className="text-red-400 text-sm mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            <div>
              <label className="form-label">Date of Birth</label>
              <input
                type="date"
                {...register('dateOfBirth', {
                  required: 'Date of birth is required',
                })}
                className="form-input"
              />
              {errors.dateOfBirth && (
                <p className="text-red-400 text-sm mt-1">{errors.dateOfBirth.message}</p>
              )}
            </div>

            <div>
              <label className="form-label">Account Type</label>
              <select
                {...register('role', { required: 'Please select an account type' })}
                className="form-input"
              >
                <option value="">Select account type</option>
                <option value="viewer">Viewer</option>
                <option value="creator">Creator</option>
              </select>
              {errors.role && (
                <p className="text-red-400 text-sm mt-1">{errors.role.message}</p>
              )}
            </div>

            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="agree-terms"
                {...register('agreeToTerms', {
                  required: 'You must agree to the terms and conditions',
                })}
                className="mt-1 w-4 h-4 text-primary-600 bg-dark-700 border-dark-600 rounded focus:ring-primary-500"
              />
              <label htmlFor="agree-terms" className="text-sm text-dark-300">
                I am at least 18 years old and I agree to the{' '}
                <Link to="/legal/terms" className="text-primary-400 hover:text-primary-300" target="_blank">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/legal/privacy" className="text-primary-400 hover:text-primary-300" target="_blank">
                  Privacy Policy
                </Link>
              </label>
            </div>
            {errors.agreeToTerms && (
              <p className="text-red-400 text-sm">{errors.agreeToTerms.message}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn btn-primary"
            >
              {isLoading ? <LoadingSpinner size="small" /> : 'Create Account'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-dark-400">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Register;