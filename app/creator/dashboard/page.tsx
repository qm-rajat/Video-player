import React from 'react';
import Link from 'next/link';
import { curatedLegalEpisodes } from '@/lib/data';

export default function CreatorDashboardPage() {
  const stats = [
    { label: 'TOTAL STREAMS PLAYED', value: '3,840,200', spec: '+14.2% THIS MONTH' },
    { label: 'SUBSCRIBED ARCHIVISTS', value: '1,420', spec: 'VERIFIED CHANNEL' },
    { label: 'CATALOGUED MASTER FILES', value: '6 TITLES', spec: '100% HEALTHY' },
    { label: 'CDN DISPATCH EFFICIENCY', value: '99.98%', spec: 'ZERO LATENCY' },
  ];

  return (
    <div>
      <section className="pt">
        <div className="cr">
          <Link href="/">HOME</Link> / <span>CREATOR STUDIO & TELEMETRY</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1>CREATOR STUDIO</h1>
          <Link href="/creator/upload" className="bt !bg-[#ff4d00] !text-black !border-black self-start">
            + UPLOAD NEW STREAM &rarr;
          </Link>
        </div>
      </section>

      {/* 4-Box Industrial Stat Grid */}
      <div className="bx4">
        {stats.map((s) => (
          <div key={s.label} className="bx">
            <small>{s.label}</small>
            <div className="pp !text-3xl my-auto">{s.value}</div>
            <p className="font-bold text-neutral-600">{s.spec}</p>
          </div>
        ))}
      </div>

      {/* Published Streams Table */}
      <div className="lab">MANAGED STREAM MASTER FILES</div>
      <div className="rw hh">
        <span>SKU</span>
        <span>STREAM TITLE</span>
        <span>CATEGORY</span>
        <span>VIEWS / RATING</span>
        <span>ACTION</span>
      </div>

      {curatedLegalEpisodes.map((v) => {
        const sku = `FW-ANM-${(v.id || '00').toString().slice(-4).padStart(4, '0').toUpperCase()}`;
        return (
          <div key={v._id} className="rw">
            <span><b>{sku}</b></span>
            <Link href={`/media/${v._id}`} className="n hover:underline truncate">
              {v.title}
            </Link>
            <span className="uppercase font-bold">{v.category} &bull; 1080P</span>
            <div>
              <b>{(v.views || 0).toLocaleString()}</b>
              <s>★ {v.score || '8.5'}</s>
            </div>
            <div className="flex gap-2">
              <Link href={`/media/${v._id}`} className="bt py-2 px-3 text-xs flex-1 text-center">
                MANAGE
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
