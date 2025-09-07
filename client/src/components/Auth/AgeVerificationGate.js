import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectAgeVerified, setAgeVerified } from '../../store/slices/authSlice';
import { toast } from 'react-hot-toast';

const AgeVerificationGate = ({ children }) => {
  const dispatch = useDispatch();
  const ageVerified = useSelector(selectAgeVerified);
  const [birthDate, setBirthDate] = useState('');
  const [agreed, setAgreed] = useState(false);

  const handleAgeVerification = (e) => {
    e.preventDefault();

    if (!birthDate) {
      toast.error('Please enter your date of birth');
      return;
    }

    if (!agreed) {
      toast.error('You must agree to the terms and conditions');
      return;
    }

    const birth = new Date(birthDate);
    const today = new Date();
    const age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    if (age < 18) {
      toast.error('You must be at least 18 years old to access this content');
      return;
    }

    dispatch(setAgeVerified(true));
    toast.success('Age verification successful');
  };

  if (ageVerified) {
    return children;
  }

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full glass rounded-2xl p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Age Verification Required</h1>
          <p className="text-dark-300">
            This website contains adult content. You must be 18 years or older to continue.
          </p>
        </div>

        <form onSubmit={handleAgeVerification} className="space-y-6">
          <div>
            <label className="form-label">
              Date of Birth
            </label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="agree-terms"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1 w-4 h-4 text-primary-600 bg-dark-700 border-dark-600 rounded focus:ring-primary-500"
              required
            />
            <label htmlFor="agree-terms" className="text-sm text-dark-300">
              I am at least 18 years old and I agree to the{' '}
              <a href="/legal/terms" className="text-primary-400 hover:text-primary-300" target="_blank" rel="noopener noreferrer">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="/legal/privacy" className="text-primary-400 hover:text-primary-300" target="_blank" rel="noopener noreferrer">
                Privacy Policy
              </a>
            </label>
          </div>

          <button
            type="submit"
            className="w-full btn btn-primary"
          >
            Verify Age & Enter
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs text-dark-400">
            By continuing, you confirm that you are of legal age to view adult content in your jurisdiction.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AgeVerificationGate;