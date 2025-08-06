import React from 'react';
import Logo from '../ui/Logo';

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className = '' }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`bg-secondary-800 text-white ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <Logo className="mb-4" size="sm" />
            <p className="text-secondary-300 text-sm leading-relaxed max-w-md">
              Professional bid management software for construction companies.
              Streamline your bidding process and win more projects with our
              comprehensive tools and analytics.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="/about"
                  className="text-secondary-300 hover:text-white transition-colors duration-200"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="/features"
                  className="text-secondary-300 hover:text-white transition-colors duration-200"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="/pricing"
                  className="text-secondary-300 hover:text-white transition-colors duration-200"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="text-secondary-300 hover:text-white transition-colors duration-200"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="/help"
                  className="text-secondary-300 hover:text-white transition-colors duration-200"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="/docs"
                  className="text-secondary-300 hover:text-white transition-colors duration-200"
                >
                  Documentation
                </a>
              </li>
              <li>
                <a
                  href="/api"
                  className="text-secondary-300 hover:text-white transition-colors duration-200"
                >
                  API Reference
                </a>
              </li>
              <li>
                <a
                  href="/status"
                  className="text-secondary-300 hover:text-white transition-colors duration-200"
                >
                  System Status
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-secondary-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-secondary-400 text-sm">
            © {currentYear} BidBuilder. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a
              href="/privacy"
              className="text-secondary-400 hover:text-white text-sm transition-colors duration-200"
            >
              Privacy Policy
            </a>
            <a
              href="/terms"
              className="text-secondary-400 hover:text-white text-sm transition-colors duration-200"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
