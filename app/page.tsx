import React from 'react';
import Link from 'next/link';
import { curatedLegalEpisodes } from '@/lib/data';
import MediaCard from '@/components/MediaCard';

export default function HomePage() {
  const featured = curatedLegalEpisodes.slice(0, 4);

  return (
    <div>
      {/* Fixwell Giant Hero Section */}
      <section className="giant">
        <h1>STREAM ANIME.<br />NO FUSS.</h1>
        <div className="g2">
          <p>
            High-bitrate legal anime streams, sakuga fight showcases, and lossless video themes.
            Connected directly to YouTube Data API v3 and AnimeThemes. No hype, no tracking, no popups.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link className="bt" href="/search">
              OPEN CATALOGUE &rarr;
            </Link>
            <Link className="bt k" href="/anime-hub">
              LAUNCH ANIME HUB &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Fixwell Category Index */}
      <section>
        <div className="lab">INDEX // ARCHIVE CATEGORIES</div>
        <Link className="ix" href="/search?cat=shonen">
          <span>01</span>
          <b>SHONEN & ACTION ARCHIVE</b>
          <em>EPISODES &bull; 6 TITLES</em>
        </Link>
        <Link className="ix" href="/search?cat=action">
          <span>02</span>
          <b>SAKUGA 60FPS COMBAT CUTS</b>
          <em>MAPPA &bull; UFOTABLE &bull; BONES</em>
        </Link>
        <Link className="ix" href="/anime-hub?tab=themes">
          <span>03</span>
          <b>ANIMETHEMES LOSSLESS OPS</b>
          <em>DIRECT .WEBM VIDEO FILES</em>
        </Link>
        <Link className="ix" href="/anime-hub?tab=trending">
          <span>04</span>
          <b>ANILIST TRENDING SYNDICATION</b>
          <em>LIVE GRAPHQL MEDIA FEED</em>
        </Link>
      </section>

      {/* Fixwell 4-Box Best Watched Grid */}
      <section>
        <div className="lab">BEST WATCHED // FEATURED STREAMS</div>
        <div className="bx4">
          {featured.map((item) => (
            <MediaCard key={item._id} media={item} viewMode="box" />
          ))}
        </div>
      </section>

      {/* Fixwell Creator / Trade Section */}
      <section className="trade">
        <h2>CREATING SAKUGA CUTS, AMVS OR INDIE ANIMATION?</h2>
        <p>
          Direct file ingestion. YouTube sync. Frame-rate accuracy and uncompressed audio.
          One central archive for the global anime animation community.
        </p>
        <Link className="bt k" href="/creator/upload">
          PUBLISH TO ARCHIVE &rarr;
        </Link>
      </section>
    </div>
  );
}
