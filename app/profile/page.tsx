'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { mockUser, curatedLegalEpisodes } from '@/lib/data';
import MediaCard from '@/components/MediaCard';

export default function ProfilePage() {
  const [tab, setTab] = useState<'uploads' | 'saved'>('uploads');

  return (
    <div>
      <section className="pt">
        <div className="cr">
          <Link href="/">HOME</Link> / <span>ARCHIVIST PROFILE</span>
        </div>
        <h1>{mockUser.username}</h1>
      </section>

      {/* Profile Header Spec Section */}
      <div className="pd">
        <div className="sheet">
          <table>
            <tbody>
              <tr>
                <td>ARCHIVIST HANDLE</td>
                <td className="font-bold">{mockUser.username}</td>
              </tr>
              <tr>
                <td>ACCOUNT TYPE</td>
                <td className="font-bold text-[#ff4d00] uppercase">VERIFIED CREATOR & ARCHIVIST</td>
              </tr>
              <tr>
                <td>SUBSCRIBERS</td>
                <td>{mockUser.profile.subscribersCount.toLocaleString()} ARCHIVISTS</td>
              </tr>
              <tr>
                <td>CATALOGUED STREAMS</td>
                <td>6 MASTER TITLES</td>
              </tr>
              <tr>
                <td>REGISTRATION</td>
                <td>OKHLA DISPATCH &bull; OCTOBER 2026</td>
              </tr>
            </tbody>
          </table>
          <p className="mt-4 font-mono text-sm text-neutral-700">
            {mockUser.profile.bio}
          </p>
        </div>

        <div className="bb">
          <b>ACCOUNT ACTIONS</b>
          <div className="big !text-3xl mt-2 mb-4">
            PRO ACCESS
          </div>
          <Link href="/creator/upload" className="bt w-full block text-center mb-2">
            + UPLOAD NEW STREAM
          </Link>
          <Link href="/queue" className="bt w w-full block text-center">
            OPEN STREAM DOCKET
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="lab">CATALOGUED STREAMS BY {mockUser.username}</div>
      <div className="bx4">
        {curatedLegalEpisodes.slice(0, 4).map((item) => (
          <MediaCard key={item._id} media={item} viewMode="box" />
        ))}
      </div>
    </div>
  );
}
