import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { forgotPassword, selectAuth } from '../../store/slices/authSlice';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import { Helmet } from 'react-helmet-async';

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector(selectAuth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    await dispatch(forgotPassword(data.email));
  };

  return (
    <>
      <Helmet>
        <title>Forgot Password - Adult Content Platform</title>
        <meta name="description" content="Reset your password to regain access to your account." />
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
            <h1 className="text-2xl font-bold text-white mb-2">Forgot Password</h1>
            <p className="text-dark-300">Enter your email to receive a password reset link</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn btn-primary"
            >
              {isLoading ? <LoadingSpinner size="small" /> : 'Send Reset Link'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-dark-400">
            Remember your password?{' '}
            <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;