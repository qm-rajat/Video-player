import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../../store/slices/authSlice';

const Sidebar = () => {
  const user = useSelector(selectUser);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: '/', label: 'Home', icon: 'home' },
    { path: '/search', label: 'Search', icon: 'search' },
    { path: '/subscriptions', label: 'Subscriptions', icon: 'heart' },
    { path: '/profile', label: 'Profile', icon: 'user' },
  ];

  const creatorItems = [
    { path: '/creator/dashboard', label: 'Dashboard', icon: 'chart' },
    { path: '/creator/upload', label: 'Upload', icon: 'upload' },
  ];

  const adminItems = [
    { path: '/admin', label: 'Admin Panel', icon: 'shield' },
  ];

  const getIcon = (iconName) => {
    const icons = {
      home: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      ),
      search: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      ),
      heart: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      ),
      user: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      ),
      chart: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      ),
      upload: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
      ),
      shield: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      ),
    };
    return icons[iconName] || icons.home;
  };

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-dark-800 border-r border-dark-700 overflow-y-auto hidden lg:block">
      <div className="p-4">
        {/* Main Navigation */}
        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                isActive(item.path)
                  ? 'bg-primary-600 text-white'
                  : 'text-dark-300 hover:text-white hover:bg-dark-700'
              }`}
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {getIcon(item.icon)}
              </svg>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Creator Section */}
        {user?.role === 'creator' && (
          <div className="mt-8">
            <h3 className="px-4 text-xs font-semibold text-dark-400 uppercase tracking-wider">
              Creator Tools
            </h3>
            <nav className="mt-2 space-y-1">
              {creatorItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive(item.path)
                      ? 'bg-primary-600 text-white'
                      : 'text-dark-300 hover:text-white hover:bg-dark-700'
                  }`}
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {getIcon(item.icon)}
                  </svg>
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        )}

        {/* Admin Section */}
        {user?.role === 'admin' && (
          <div className="mt-8">
            <h3 className="px-4 text-xs font-semibold text-dark-400 uppercase tracking-wider">
              Administration
            </h3>
            <nav className="mt-2 space-y-1">
              {adminItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive(item.path)
                      ? 'bg-primary-600 text-white'
                      : 'text-dark-300 hover:text-white hover:bg-dark-700'
                  }`}
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {getIcon(item.icon)}
                  </svg>
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;