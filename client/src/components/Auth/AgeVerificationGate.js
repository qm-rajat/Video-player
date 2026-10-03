import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectAgeVerified, setAgeVerified } from '../../store/slices/authSlice';
import { toast } from 'react-hot-toast';

const AgeVerificationGate = ({ children }) => {
  const dispatch = useDispatch();
  const ageVerified = useSelector(selectAgeVerified);
  const [agreed, setAgreed] = useState(true);

  const handleEnter = (e) => {
    e.preventDefault();
    if (!agreed) {
      toast.error('Please accept the community guidelines to enter');
      return;
    }
    dispatch(setAgeVerified(true));
    toast.success('Welcome to AnimePlatform!');
  };

  if (ageVerified) {
    return children;
  }

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full glass rounded-2xl p-8 border border-purple-500/30 shadow-2xl">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/20">
            <span className="text-2xl">⚡</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Welcome to AnimePlatform</h1>
          <p className="text-dark-300 text-sm">
            The ultimate anime video streaming and creator hub. Discover episodes, AMVs, sakuga animations, and support anime creators.
          </p>
        </div>

        <form onSubmit={handleEnter} className="space-y-6">
          <div className="p-4 bg-dark-800/80 rounded-xl border border-dark-700 text-left text-xs text-dark-300 space-y-2">
            <p className="font-semibold text-white text-sm flex items-center gap-1.5">
              <span>🌸</span> Community Highlights
            </p>
            <p>• High quality anime streams & high frame rate sakuga clips</p>
            <p>• Verified creator channels, fan animations, and original series</p>
            <p>• Community discussions, ratings, and creator subscriptions</p>
          </div>

          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="agree-terms"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1 w-4 h-4 text-purple-600 bg-dark-700 border-dark-600 rounded focus:ring-purple-500"
            />
            <label htmlFor="agree-terms" className="text-xs text-dark-300">
              I agree to the{' '}
              <a href="/legal/terms" className="text-primary-400 hover:text-primary-300 underline" target="_blank" rel="noopener noreferrer">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="/legal/community-guidelines" className="text-primary-400 hover:text-primary-300 underline" target="_blank" rel="noopener noreferrer">
                Anime Community Guidelines
              </a>
            </label>
          </div>

          <button
            type="submit"
            className="w-full btn btn-primary bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 rounded-xl shadow-lg shadow-purple-600/30 transition-all transform hover:-translate-y-0.5"
          >
            Enter Anime Platform
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs text-dark-400">
            Enjoy premium streaming experiences curated for anime fans worldwide.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AgeVerificationGate;