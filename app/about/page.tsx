import React from 'react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div>
      <section className="pt">
        <div className="cr">
          <Link href="/">HOME</Link> / <span>ABOUT ARCHIVE</span>
        </div>
        <h1>ABOUT</h1>
      </section>

      <section className="ab">
        <p>WE STREAM ANIME.</p>
        <p>WE DON&apos;T STREAM HYPE.</p>
        <p className="sm">
          AnimeStream is an industrial-grade streaming index and sakuga archive.
          We connect directly to official public endpoints including YouTube Data API v3,
          AnimeThemes.moe, and AniList GraphQL to deliver zero-latency video playback.
          <br /><br />
          No intrusive tracking, no crypto scams, no popup ads, and no artificial AI slop.
          Just high-frame-rate animation, crisp sound, and straight technical data.
        </p>
      </section>

      <div className="bx4">
        <div className="bx">
          <small>MANIFESTO 01</small>
          <div className="n">UNCOMPRESSED VISION</div>
          <p>Preserve 24fps and 60fps keyframe motion as envisioned by the animation directors.</p>
        </div>
        <div className="bx">
          <small>MANIFESTO 02</small>
          <div className="n">OPEN ARCHIVES</div>
          <p>Leverage public APIs and official distributor feeds without gatekeeping or paywalls.</p>
        </div>
        <div className="bx">
          <small>MANIFESTO 03</small>
          <div className="n">ZERO SLOP</div>
          <p>Strict typographical discipline, fast load times, and raw utility over decorative fluff.</p>
        </div>
        <div className="bx">
          <small>MANIFESTO 04</small>
          <div className="n">COMMUNITY ATTRIBUTION</div>
          <p>Full studio and key animator attribution across every indexed cut and episode.</p>
        </div>
      </div>
    </div>
  );
}
