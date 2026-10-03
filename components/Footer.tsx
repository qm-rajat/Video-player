'use client';

import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer>
      <div className="fb">ANIMESTREAM</div>
      <div className="fr">
        <span>RAW STREAMS &bull; SAKUGA ARCHIVE &bull; TOKYO / GLOBAL CDN</span>
        <div className="flex gap-4">
          <Link href="/legal/terms" className="hover:underline">TERMS</Link>
          <Link href="/legal/privacy" className="hover:underline">PRIVACY</Link>
          <Link href="/admin" className="hover:underline">SYSTEM CONSOLE</Link>
        </div>
        <span>PURE VIDEO. NO HYPE.</span>
      </div>
    </footer>
  );
}
