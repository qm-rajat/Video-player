import React from 'react';
import { Helmet } from 'react-helmet-async';

const Profile = () => {
  return (
    <>
      <Helmet>
        <title>Profile - Adult Content Platform</title>
        <meta name="description" content="Manage your profile and account settings." />
      </Helmet>

      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-white">Profile</h1>
        <div className="bg-dark-800 rounded-lg p-6">
          <p className="text-dark-300">Profile page coming soon...</p>
        </div>
      </div>
    </>
  );
};

export default Profile;