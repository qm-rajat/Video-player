import React from 'react';
import { Helmet } from 'react-helmet-async';

const Upload = () => {
  return (
    <>
      <Helmet>
        <title>Upload Content - Adult Content Platform</title>
        <meta name="description" content="Upload new content to share with your audience." />
      </Helmet>

      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-white">Upload Content</h1>
        <div className="bg-dark-800 rounded-lg p-6">
          <p className="text-dark-300">Upload page coming soon...</p>
        </div>
      </div>
    </>
  );
};

export default Upload;