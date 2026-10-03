import React from 'react';
import Link from 'next/link';

export default function LegalPage({ params }: { params: { page: string } }) {
  const isPrivacy = params.page === 'privacy';
  const title = isPrivacy ? 'PRIVACY POLICY' : 'TERMS OF SERVICE';

  return (
    <div>
      <section className="pt">
        <div className="cr">
          <Link href="/">HOME</Link> / <span>LEGAL PROTOCOLS</span>
        </div>
        <h1>{title}</h1>
      </section>

      <section className="ab">
        <p>CLEAR TERMS.</p>
        <p>NO FINE PRINT TRICKS.</p>
        <p className="sm">
          LAST AUDIT: OCTOBER 2026 &bull; OKHLA CDN ARCHIVE<br /><br />
          1. CONTENT & FAIR USE SYNDICATION:<br />
          All anime video streams, openings, endings, and battle cuts featured on this archive are aggregated through official public endpoints, licensors, YouTube Data API v3, and the public AnimeThemes API. We uphold full creator copyright and respect Japanese animation studios.<br /><br />
          2. USER PRIVACY & DATA DISPATCH:<br />
          We do not sell user telemetry, inject third-party ad pixels, or profile viewing habits. Your watch queue remains stored locally in your browser session.<br /><br />
          3. TAKE DOWN REQUESTS:<br />
          Verified licensors and creators may request immediate indexing updates or link removal through syndication@animestream.example.
        </p>
      </section>
    </div>
  );
}
