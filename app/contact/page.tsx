'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function ContactTradePage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div>
      <section className="pt">
        <div className="cr">
          <Link href="/">HOME</Link> / <span>STUDIO & LICENSING SYNDICATION</span>
        </div>
        <h1>TRADE & LICENSING</h1>
      </section>

      <section className="ab two">
        <div>
          <p className="font-bold text-2xl font-display uppercase mb-4">
            OFFICIAL DISTRIBUTOR & STUDIO INGESTION
          </p>
          <p className="sm">
            OKHLA PHASE 2 CDN HUB<br />
            NEW DELHI / TOKYO GLOBAL EDGE<br />
            +91 90000 00000<br />
            SYNDICATION@ANIMESTREAM.EXAMPLE<br /><br />
            For studio distributors, key animators, production committees, and archive syndicators seeking master-file indexing and verified channel presence.
          </p>
        </div>

        <div>
          {submitted ? (
            <div className="p-8 border-4 border-black bg-white">
              <h3 className="font-bold text-2xl font-display uppercase">INQUIRY DOCKET TRANSMITTED</h3>
              <p className="font-mono text-sm mt-2">
                Thank you. Our distribution desk will review your specifications within one business day.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="border-4 border-black bg-white p-6 shadow-[6px_6px_0px_#000]">
              <label>
                NAME / REPRESENTATIVE *
                <input required placeholder="e.g. Kenji Sato" />
              </label>

              <label>
                ORGANIZATION / STUDIO / CHANNEL
                <input placeholder="e.g. Studio Mappa / Distributor" />
              </label>

              <label>
                SYNDICATION REQUIREMENTS / CATALOGUE SIZE
                <textarea rows={4} placeholder="Detail titles to be syndicated or API feeds..."></textarea>
              </label>

              <button className="bt w-full mt-4">
                TRANSMIT INQUIRY &rarr;
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
