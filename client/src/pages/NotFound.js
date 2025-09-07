import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const NotFound = () => {
  return (
    <>
      <Helmet>
        <title>Page Not Found - Adult Content Platform</title>
        <meta name="description" content="The page you're looking for doesn't exist." />
      </Helmet>

      <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="mb-8">
            <h1 className="text-9xl font-bold text-primary-600 mb-4">404</h1>
            <h2 className="text-3xl font-bold text-white mb-4">Page Not Found</h2>
            <p className="text-dark-400 text-lg mb-8 max-w-md">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>
          
          <div className="space-y-4">
            <Link
              to="/"
              className="inline-block btn btn-primary"
            >
              Go Home
            </Link>
            
            <div className="text-dark-500">
              <p>Or try one of these:</p>
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                <Link to="/search" className="text-primary-400 hover:text-primary-300">
                  Search Content
                </Link>
                <Link to="/subscriptions" className="text-primary-400 hover:text-primary-300">
                  My Subscriptions
                </Link>
                <Link to="/profile" className="text-primary-400 hover:text-primary-300">
                  Profile
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFound;