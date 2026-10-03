'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
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
          <Link href="/">HOME</Link> / <span>ARCHIVIST CREDENTIAL REGISTRATION</span>
        </div>
        <h1>REGISTER</h1>
      </section>

      <div className="rc">
        <div className="paper">
          <h1>ANIMESTREAM</h1>
          <p className="c">
            APPLICATION SLIP &bull; NEW ARCHIVIST<br />
            ------------------------------------------------
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <label>
              ARCHIVIST HANDLE / USERNAME *
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. SakugaMaster"
              />
            </label>

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
              MASTER PASSWORD *
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
              />
            </label>

            <button type="submit" className="bt w-full mt-4 !bg-[#ff4d00] !text-black !border-black">
              ISSUE ARCHIVIST CREDENTIALS &rarr;
            </button>
          </form>

          <div className="mt-6 pt-4 border-t-2 border-black text-center text-xs">
            ALREADY REGISTERED?{' '}
            <Link href="/login" className="font-bold underline hover:text-[#ff4d00]">
              SIGN IN HERE
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
