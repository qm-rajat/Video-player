import React from 'react';
import { Helmet } from 'react-helmet-async';

const AdminPanel = () => {
  return (
    <>
      <Helmet>
        <title>Admin Panel - Adult Content Platform</title>
        <meta name="description" content="Manage users, content, and platform settings." />
      </Helmet>

      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
        <div className="bg-dark-800 rounded-lg p-6">
          <p className="text-dark-300">Admin panel coming soon...</p>
        </div>
      </div>
    </>
  );
};

export default AdminPanel;