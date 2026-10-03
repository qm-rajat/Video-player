'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  return (
    <div>
      <section className="pt">
        <div className="cr">
          <Link href="/">HOME</Link> / <span>ARCHIVE AUTHENTICATION</span>
        </div>
        <h1>SIGN IN</h1>
      </section>

      <div className="rc">
        <div className="paper">
          <h1>ANIMESTREAM</h1>
          <p className="c">
            ARCHIVIST LOGIN SLIP<br />
            ------------------------------------------------
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <label>
              EMAIL ADDRESS *
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="archivist@animestream.example"
              />
            </label>

            <label>
              SECURITY KEY / PASSWORD *
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
              />
            </label>

            <button type="submit" className="bt w-full mt-4 !bg-[#ff4d00] !text-black !border-black">
              AUTHENTICATE ACCESS &rarr;
            </button>
          </form>

          <div className="mt-6 pt-4 border-t-2 border-black text-center text-xs">
            NEW ARCHIVIST?{' '}
            <Link href="/register" className="font-bold underline hover:text-[#ff4d00]">
              APPLY FOR CREDENTIALS
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
