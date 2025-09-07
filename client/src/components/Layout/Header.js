import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, selectAuth } from '../../store/slices/authSlice';
import SearchBar from '../Search/SearchBar';
import UserMenu from '../User/UserMenu';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector(selectAuth);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <header className="bg-dark-800 border-b border-dark-700 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <span className="text-xl font-bold text-white hidden sm:block">
              AdultPlatform
            </span>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-4">
            <SearchBar />
          </div>

          {/* Navigation */}
          <nav className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* Upload Button (Creators only) */}
                {user?.role === 'creator' && (
                  <Link
                    to="/creator/upload"
                    className="btn btn-primary hidden sm:flex"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Upload
                  </Link>
                )}

                {/* Notifications */}
                <button className="p-2 text-dark-300 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM15 17H9a2 2 0 01-2-2V5a2 2 0 012-2h6a2 2 0 012 2v10z" />
                  </svg>
                </button>

                {/* User Menu */}
                <UserMenu user={user} onLogout={handleLogout} />
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login" className="btn btn-outline">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden p-2 text-dark-300 hover:text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>
          </nav>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-dark-700">
            <nav className="flex flex-col space-y-2">
              <Link
                to="/"
                className="px-4 py-2 text-dark-300 hover:text-white hover:bg-dark-700 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/search"
                className="px-4 py-2 text-dark-300 hover:text-white hover:bg-dark-700 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Search
              </Link>
              {isAuthenticated && (
                <>
                  <Link
                    to="/subscriptions"
                    className="px-4 py-2 text-dark-300 hover:text-white hover:bg-dark-700 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Subscriptions
                  </Link>
                  {user?.role === 'creator' && (
                    <>
                      <Link
                        to="/creator/dashboard"
                        className="px-4 py-2 text-dark-300 hover:text-white hover:bg-dark-700 rounded-lg transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Creator Dashboard
                      </Link>
                      <Link
                        to="/creator/upload"
                        className="px-4 py-2 text-dark-300 hover:text-white hover:bg-dark-700 rounded-lg transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Upload Content
                      </Link>
                    </>
                  )}
                  {user?.role === 'admin' && (
                    <Link
                      to="/admin"
                      className="px-4 py-2 text-dark-300 hover:text-white hover:bg-dark-700 rounded-lg transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  )}
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;