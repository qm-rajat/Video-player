import React from 'react';
import { Helmet } from 'react-helmet-async';

const Subscriptions = () => {
  return (
    <>
      <Helmet>
        <title>Subscriptions - Adult Content Platform</title>
        <meta name="description" content="Manage your subscriptions and payments." />
      </Helmet>

      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-white">Subscriptions</h1>
        <div className="bg-dark-800 rounded-lg p-6">
          <p className="text-dark-300">Subscriptions page coming soon...</p>
        </div>
      </div>
    </>
  );
};

export default Subscriptions;