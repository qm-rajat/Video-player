import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-dark-800 border-t border-dark-700 mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <span className="text-xl font-bold text-white">AdultPlatform</span>
            </Link>
            <p className="text-dark-400 text-sm">
              The premier platform for adult content creators and their fans.
            </p>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/legal/terms" className="text-dark-400 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/legal/privacy" className="text-dark-400 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/legal/dmca" className="text-dark-400 hover:text-white transition-colors">
                  DMCA Policy
                </Link>
              </li>
              <li>
                <Link to="/legal/community-guidelines" className="text-dark-400 hover:text-white transition-colors">
                  Community Guidelines
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/help" className="text-dark-400 hover:text-white transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-dark-400 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/safety" className="text-dark-400 hover:text-white transition-colors">
                  Safety Center
                </Link>
              </li>
              <li>
                <Link to="/report" className="text-dark-400 hover:text-white transition-colors">
                  Report Content
                </Link>
              </li>
            </ul>
          </div>

          {/* Creators */}
          <div>
            <h3 className="text-white font-semibold mb-4">For Creators</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/creator-guide" className="text-dark-400 hover:text-white transition-colors">
                  Creator Guide
                </Link>
              </li>
              <li>
                <Link to="/monetization" className="text-dark-400 hover:text-white transition-colors">
                  Monetization
                </Link>
              </li>
              <li>
                <Link to="/creator-resources" className="text-dark-400 hover:text-white transition-colors">
                  Resources
                </Link>
              </li>
              <li>
                <Link to="/become-creator" className="text-dark-400 hover:text-white transition-colors">
                  Become a Creator
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-dark-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-dark-400 text-sm">
            © 2024 AdultPlatform. All rights reserved.
          </p>
          
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="text-dark-400 hover:text-white transition-colors">
              <span className="sr-only">Twitter</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
            
            <a href="#" className="text-dark-400 hover:text-white transition-colors">
              <span className="sr-only">Instagram</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.014 5.367 18.647.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.328-1.297C4.198 14.895 3.5 13.559 3.5 12.017s.698-2.878 1.621-3.674c.88-.807 2.031-1.297 3.328-1.297s2.448.49 3.328 1.297c.923.796 1.621 2.132 1.621 3.674s-.698 2.878-1.621 3.674c-.88.807-2.031 1.297-3.328 1.297z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>

        {/* Age verification notice */}
        <div className="mt-8 p-4 bg-dark-700 rounded-lg">
          <p className="text-dark-300 text-sm text-center">
            <span className="font-semibold text-primary-400">18+ ONLY:</span> This website contains adult content and is intended for adults only. 
            All models are 18 years of age or older. By entering this site, you confirm that you are of legal age to view adult content in your jurisdiction.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;