import React from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const Legal = () => {
  const { page } = useParams();

  const getPageContent = () => {
    switch (page) {
      case 'terms':
        return {
          title: 'Terms of Service',
          content: (
            <div className="prose prose-invert max-w-none">
              <h2>Terms of Service</h2>
              <p>Last updated: {new Date().toLocaleDateString()}</p>
              <p>
                By using our platform, you agree to these terms and conditions.
                This is a placeholder for the actual terms of service.
              </p>
              <h3>Age Verification</h3>
              <p>
                You must be at least 18 years old to use this platform.
              </p>
              <h3>Content Guidelines</h3>
              <p>
                All content must comply with our community guidelines and applicable laws.
              </p>
            </div>
          ),
        };
      case 'privacy':
        return {
          title: 'Privacy Policy',
          content: (
            <div className="prose prose-invert max-w-none">
              <h2>Privacy Policy</h2>
              <p>Last updated: {new Date().toLocaleDateString()}</p>
              <p>
                This privacy policy describes how we collect, use, and protect your information.
              </p>
              <h3>Information We Collect</h3>
              <p>
                We collect information you provide directly to us and information we collect automatically.
              </p>
            </div>
          ),
        };
      case 'dmca':
        return {
          title: 'DMCA Policy',
          content: (
            <div className="prose prose-invert max-w-none">
              <h2>DMCA Takedown Policy</h2>
              <p>Last updated: {new Date().toLocaleDateString()}</p>
              <p>
                We respect intellectual property rights and respond to valid DMCA takedown notices.
              </p>
            </div>
          ),
        };
      case 'community-guidelines':
        return {
          title: 'Community Guidelines',
          content: (
            <div className="prose prose-invert max-w-none">
              <h2>Community Guidelines</h2>
              <p>Last updated: {new Date().toLocaleDateString()}</p>
              <p>
                Our community guidelines ensure a safe and respectful environment for all users.
              </p>
            </div>
          ),
        };
      default:
        return {
          title: 'Legal Information',
          content: (
            <div>
              <p>Please select a legal document to view.</p>
            </div>
          ),
        };
    }
  };

  const { title, content } = getPageContent();

  return (
    <>
      <Helmet>
        <title>{title} - Adult Content Platform</title>
        <meta name="description" content={`${title} for Adult Content Platform`} />
      </Helmet>

      <div className="min-h-screen bg-dark-900 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-dark-800 rounded-lg p-8">
            <h1 className="text-3xl font-bold text-white mb-8">{title}</h1>
            <div className="text-dark-200">
              {content}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Legal;