import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

const UserMenu = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-dark-700 transition-colors"
      >
        <img
          src={user?.profile?.avatar || '/default-avatar.png'}
          alt={user?.username}
          className="w-8 h-8 rounded-full"
        />
        <span className="hidden md:block text-white font-medium">
          {user?.username}
        </span>
        <svg className="w-4 h-4 text-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-dark-800 border border-dark-700 rounded-lg shadow-lg py-1 z-50">
          <div className="px-4 py-2 border-b border-dark-700">
            <p className="text-white font-medium">{user?.username}</p>
            <p className="text-dark-400 text-sm">{user?.email}</p>
          </div>
          
          <Link
            to="/profile"
            className="block px-4 py-2 text-dark-300 hover:text-white hover:bg-dark-700 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Profile
          </Link>
          
          <Link
            to="/subscriptions"
            className="block px-4 py-2 text-dark-300 hover:text-white hover:bg-dark-700 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Subscriptions
          </Link>
          
          {user?.role === 'creator' && (
            <>
              <Link
                to="/creator/dashboard"
                className="block px-4 py-2 text-dark-300 hover:text-white hover:bg-dark-700 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Creator Dashboard
              </Link>
              <Link
                to="/creator/upload"
                className="block px-4 py-2 text-dark-300 hover:text-white hover:bg-dark-700 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Upload Content
              </Link>
            </>
          )}
          
          {user?.role === 'admin' && (
            <Link
              to="/admin"
              className="block px-4 py-2 text-dark-300 hover:text-white hover:bg-dark-700 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Admin Panel
            </Link>
          )}
          
          <div className="border-t border-dark-700 mt-1">
            <button
              onClick={() => {
                setIsOpen(false);
                onLogout();
              }}
              className="block w-full text-left px-4 py-2 text-dark-300 hover:text-white hover:bg-dark-700 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;