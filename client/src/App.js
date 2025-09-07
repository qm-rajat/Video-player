import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// Components
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import AgeVerificationGate from './components/Auth/AgeVerificationGate';
import LoadingSpinner from './components/UI/LoadingSpinner';

// Pages
import Home from './pages/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ForgotPassword from './pages/Auth/ForgotPassword';
import ResetPassword from './pages/Auth/ResetPassword';
import Profile from './pages/Profile/Profile';
import CreatorDashboard from './pages/Creator/Dashboard';
import Upload from './pages/Creator/Upload';
import MediaView from './pages/Media/MediaView';
import Search from './pages/Search';
import Subscriptions from './pages/Subscriptions';
import AdminPanel from './pages/Admin/AdminPanel';
import Legal from './pages/Legal';
import NotFound from './pages/NotFound';

// Redux
import { loadUser } from './store/slices/authSlice';
import { selectAuth } from './store/slices/authSlice';

// Initialize Stripe
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

function App() {
  const dispatch = useDispatch();
  const { isLoading, isAuthenticated, user, ageVerified } = useSelector(selectAuth);

  useEffect(() => {
    // Load user on app start
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(loadUser());
    }
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-900">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <div className="App min-h-screen bg-dark-900 text-white">
        <AgeVerificationGate>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={
              isAuthenticated ? <Navigate to="/" replace /> : <Login />
            } />
            <Route path="/register" element={
              isAuthenticated ? <Navigate to="/" replace /> : <Register />
            } />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/legal/:page" element={<Legal />} />

            {/* Protected Routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <Layout>
                  <Home />
                </Layout>
              </ProtectedRoute>
            } />

            <Route path="/search" element={
              <ProtectedRoute>
                <Layout>
                  <Search />
                </Layout>
              </ProtectedRoute>
            } />

            <Route path="/media/:id" element={
              <ProtectedRoute>
                <Layout>
                  <MediaView />
                </Layout>
              </ProtectedRoute>
            } />

            <Route path="/profile" element={
              <ProtectedRoute>
                <Layout>
                  <Profile />
                </Layout>
              </ProtectedRoute>
            } />

            <Route path="/subscriptions" element={
              <ProtectedRoute>
                <Layout>
                  <Subscriptions />
                </Layout>
              </ProtectedRoute>
            } />

            {/* Creator Routes */}
            <Route path="/creator/dashboard" element={
              <ProtectedRoute requiredRole="creator">
                <Layout>
                  <CreatorDashboard />
                </Layout>
              </ProtectedRoute>
            } />

            <Route path="/creator/upload" element={
              <ProtectedRoute requiredRole="creator">
                <Layout>
                  <Upload />
                </Layout>
              </ProtectedRoute>
            } />

            {/* Admin Routes */}
            <Route path="/admin/*" element={
              <ProtectedRoute requiredRole="admin">
                <Layout>
                  <AdminPanel />
                </Layout>
              </ProtectedRoute>
            } />

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AgeVerificationGate>
      </div>
    </Elements>
  );
}

export default App;