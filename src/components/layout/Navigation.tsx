'use client';

import React, { useState } from 'react';
import Button from '../ui/Button';

interface NavigationProps {
  className?: string;
}

const Navigation: React.FC<NavigationProps> = ({ className = '' }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Projects', href: '/projects' },
    { label: 'Bids', href: '/bids' },
    { label: 'Reports', href: '/reports' },
    { label: 'Settings', href: '/settings' },
  ];

  return (
    <nav className={`${className}`}>
      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center space-x-8">
        {navItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="text-secondary-600 hover:text-primary-600 font-medium transition-colors duration-200"
          >
            {item.label}
          </a>
        ))}
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm">
            Sign In
          </Button>
          <Button size="sm">Get Started</Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <button
          onClick={toggleMobileMenu}
          className="text-secondary-600 hover:text-primary-600 p-2"
          aria-label="Toggle mobile menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isMobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white shadow-lg border-t border-secondary-200 z-50">
            <div className="px-4 py-6 space-y-4">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="block text-secondary-600 hover:text-primary-600 font-medium py-2 transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <div className="pt-4 space-y-3">
                <Button variant="outline" size="sm" className="w-full">
                  Sign In
                </Button>
                <Button size="sm" className="w-full">
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
