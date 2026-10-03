'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useQueue } from '@/lib/queueStore';

export default function Navbar() {
  const { count } = useQueue();
  const pathname = usePathname() || '/';

  const navLinks = [
    { href: '/', label: 'HOME' },
    { href: '/anime-hub', label: 'ANIME HUB (APIS)' },
    { href: '/search', label: 'CATALOGUE' },
    { href: '/creator/dashboard', label: 'STUDIO' },
    { href: '/queue', label: 'WATCHLIST' },
    { href: '/admin', label: 'ADMIN' },
  ];

  return (
    <>
      <header className="hd">
        {/* Fixwell Wordmark */}
        <Link href="/" className="lg">
          <span>ANIMESTREAM</span>
        </Link>

        {/* Fixwell Monospace Nav Links with 4px borders */}
        <nav>
          {navLinks.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={isActive ? 'on' : ''}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Fixwell High-Visibility Orange Queue / Cart Button */}
        <Link href="/queue" className="cart-btn">
          <small className="text-xs uppercase tracking-wider font-bold">QUEUE</small>
          <b data-count>{count}</b>
        </Link>
      </header>

      {/* Fixwell Running Ticker */}
      <div className="tick" aria-hidden="true">
        <div className="tick-inner">
          YOUTUBE DATA API V3 CONNECTED &nbsp;///&nbsp; ANIMETHEMES DIRECT VIDEO ENGINE &nbsp;///&nbsp; ANILIST GRAPHQL SYNCED &nbsp;///&nbsp; 60FPS SAKUGA ARCHIVE &nbsp;///&nbsp; ZERO POPUPS &nbsp;///&nbsp; INSTANT HD STREAMING &nbsp;///&nbsp; YOUTUBE DATA API V3 CONNECTED &nbsp;///&nbsp; ANIMETHEMES DIRECT VIDEO ENGINE &nbsp;///&nbsp; ANILIST GRAPHQL SYNCED &nbsp;///&nbsp; 60FPS SAKUGA ARCHIVE &nbsp;///&nbsp; ZERO POPUPS &nbsp;///&nbsp; INSTANT HD STREAMING &nbsp;///&nbsp;
        </div>
      </div>
    </>
  );
}
