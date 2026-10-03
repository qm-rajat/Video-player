import React from 'react';
import Link from 'next/link';
import MediaCard from '@/components/MediaCard';
import { curatedLegalEpisodes } from '@/lib/data';

export default function SubscriptionsPage() {
  return (
    <div>
      <section className="pt">
        <div className="cr">
          <Link href="/">HOME</Link> / <span>SUBSCRIPTION DISPATCH</span>
        </div>
        <h1>SUBSCRIPTIONS</h1>
      </section>

      <div className="lab">LATEST DISPATCHES FROM FOLLOWED STUDIOS</div>
      <div className="bx4">
        {curatedLegalEpisodes.map((item) => (
          <MediaCard key={item._id} media={item} viewMode="box" />
        ))}
      </div>
    </div>
  );
}
