import React from 'react';
import { Helmet } from 'react-helmet-async';

const MediaView = () => {
  return (
    <>
      <Helmet>
        <title>Media View - Adult Content Platform</title>
        <meta name="description" content="Watch premium adult content." />
      </Helmet>

      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-white">Media View</h1>
        <div className="bg-dark-800 rounded-lg p-6">
          <p className="text-dark-300">Media viewer coming soon...</p>
        </div>
      </div>
    </>
  );
};

export default MediaView;