import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div>
      <section className="pt">
        <div className="cr">
          <Link href="/">HOME</Link> / <span>404 ERROR</span>
        </div>
        <h1>NOT FOUND</h1>
      </section>

      <section className="ab">
        <p>STREAM NOT FOUND.</p>
        <p>FILE DOES NOT EXIST.</p>
        <p className="sm">
          The requested media item or SKU could not be located in the archive catalog.
          Verify the identifier or return to the main catalogue index.
        </p>
        <div className="mt-8">
          <Link href="/search" className="bt">
            &larr; RETURN TO CATALOGUE
          </Link>
        </div>
      </section>
    </div>
  );
}
