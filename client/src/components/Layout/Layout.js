import React from 'react';
import { useSelector } from 'react-redux';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { selectAuth } from '../../store/slices/authSlice';

const Layout = ({ children }) => {
  const { user } = useSelector(selectAuth);

  return (
    <div className="min-h-screen bg-dark-900 text-white">
      <Header />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 lg:ml-64">
          <div className="container mx-auto px-4 py-6">
            {children}
          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  );
};

export default Layout;