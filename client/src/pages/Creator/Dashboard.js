import React from 'react';
import { Helmet } from 'react-helmet-async';

const Dashboard = () => {
  return (
    <>
      <Helmet>
        <title>Creator Dashboard - Adult Content Platform</title>
        <meta name="description" content="Manage your content and view analytics." />
      </Helmet>

      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-white">Creator Dashboard</h1>
        <div className="bg-dark-800 rounded-lg p-6">
          <p className="text-dark-300">Creator dashboard coming soon...</p>
        </div>
      </div>
    </>
  );
};

export default Dashboard;