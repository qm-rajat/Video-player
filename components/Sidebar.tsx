'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Home, Tv, Search, Heart, User, LayoutDashboard, ShieldCheck, UploadCloud } from 'lucide-react';

export default function Sidebar() {
  const [currentPath, setCurrentPath] = useState('/');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentPath(window.location.pathname);
    }
  }, []);

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/anime-hub', label: 'Anime Hub', icon: Tv, badge: 'Live' },
    { href: '/search', label: 'Search', icon: Search },
    { href: '/subscriptions', label: 'Subscriptions', icon: Heart },
    { href: '/profile', label: 'Profile', icon: User },
  ];

  const creatorItems = [
    { href: '/creator/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/creator/upload', label: 'Upload Video', icon: UploadCloud },
  ];

  const adminItems = [
    { href: '/admin', label: 'Admin Panel', icon: ShieldCheck },
  ];

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-dark-800 border-r border-dark-700 overflow-y-auto hidden lg:block p-4 space-y-6">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-dark-400 px-3">
          Explore
        </span>
        <div className="mt-2 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setCurrentPath(item.href)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-purple-600/20 text-purple-300 font-semibold border border-purple-500/30'
                    : 'text-dark-300 hover:text-white hover:bg-dark-700'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-purple-400' : 'text-dark-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-600 text-white">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-dark-400 px-3">
          Creator Studio
        </span>
        <div className="mt-2 space-y-1">
          {creatorItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setCurrentPath(item.href)}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-purple-600/20 text-purple-300 font-semibold border border-purple-500/30'
                    : 'text-dark-300 hover:text-white hover:bg-dark-700'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-purple-400' : 'text-dark-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-dark-400 px-3">
          Management
        </span>
        <div className="mt-2 space-y-1">
          {adminItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setCurrentPath(item.href)}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-purple-600/20 text-purple-300 font-semibold border border-purple-500/30'
                    : 'text-dark-300 hover:text-white hover:bg-dark-700'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-purple-400' : 'text-dark-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="pt-4 border-t border-dark-700/60 text-xs text-dark-400 px-3">
        <p>© 2026 AnimeStream</p>
        <div className="flex gap-2 mt-2">
          <Link href="/legal/terms" className="hover:underline">Terms</Link>
          <span>•</span>
          <Link href="/legal/privacy" className="hover:underline">Privacy</Link>
        </div>
      </div>
    </aside>
  );
}
