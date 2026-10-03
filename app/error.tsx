'use client';

import React from 'react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div>
      <section className="pt">
        <div className="cr">
          <Link href="/">HOME</Link> / <span>SYSTEM FAULT</span>
        </div>
        <h1>STREAM FAULT</h1>
      </section>

      <section className="ab">
        <p>TRANSMISSION INTERRUPTED.</p>
        <p className="sm text-red-600 font-bold">
          ERROR: {error.message || 'UNEXPECTED STREAM BUFFER ANOMALY'}
        </p>
        <div className="mt-8 flex gap-4">
          <button onClick={() => reset()} className="bt">
            RETRY STREAM &rarr;
          </button>
          <Link href="/" className="bt k">
            HOME
          </Link>
        </div>
      </section>
    </div>
  );
}
