'use client';

import React from 'react';
import Link from 'next/link';
import { MediaItem } from '@/lib/data';
import { addToQueue } from '@/lib/queueStore';

interface MediaCardProps {
  media: MediaItem;
  viewMode?: 'box' | 'row';
}

export default function MediaCard({ media, viewMode = 'box' }: MediaCardProps) {
  const watchUrl = `/media/${media._id || media.id}`;
  const sku = `FW-ANM-${(media.id || media._id || '00').toString().slice(-4).padStart(4, '0')}`.toUpperCase();
  const resolution = media.resolution ? `${media.resolution}P HD` : '1080P HD';
  const duration = media.duration ? `${Math.floor(media.duration / 60)} MIN` : '24 MIN';
  const studio = media.studio || media.seriesTitle || media.channelTitle || 'STUDIO ARCHIVE';

  const handleQueueClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToQueue(media._id || String(media.id));
  };

  if (viewMode === 'row') {
    return (
      <div className="rw">
        <span><b>{sku}</b></span>
        <Link href={watchUrl} className="n hover:underline truncate">
          {media.title}
        </Link>
        <span className="truncate">{studio} &bull; {duration}</span>
        <div>
          <b>{resolution}</b>
          <s>{media.views ? `${(media.views).toLocaleString()} VIEWS` : 'OFFICIAL'}</s>
        </div>
        <div className="flex gap-2">
          <Link href={watchUrl} className="bt flex-1 text-center py-2 px-3 text-xs">
            WATCH
          </Link>
          <button onClick={handleQueueClick} className="bt flex-1 py-2 px-3 text-xs">
            + QUEUE
          </button>
        </div>
      </div>
    );
  }

  return (
    <article className="bx">
      <div className="flex items-center justify-between">
        <small>{sku}</small>
        <small className="uppercase font-bold text-black">{media.category || 'EPISODE'}</small>
      </div>

      {/* Media Frame with 3px solid black border */}
      <Link href={watchUrl} className="relative aspect-video border-[3px] border-black bg-black overflow-hidden group block my-1">
        <img
          src={media.thumbnailUrl}
          alt={media.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          loading="lazy"
        />
        <div className="absolute top-2 left-2 bg-black text-[#ff4d00] font-bold text-[10px] px-2 py-0.5 border border-black uppercase">
          {media.source || 'STREAM'}
        </div>
      </Link>

      <Link href={watchUrl} className="n hover:underline line-clamp-2 mt-1">
        {media.title}
      </Link>

      <p className="line-clamp-2">
        {studio} &bull; {duration} &bull; {media.description}
      </p>

      <div className="pp">
        {resolution}
        <s>{media.score ? `★ ${media.score}` : `${(media.views || 25000).toLocaleString()} VWS`}</s>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-2">
        <Link href={watchUrl} className="bt text-center text-xs py-2.5">
          PLAY STREAM &rarr;
        </Link>
        <button onClick={handleQueueClick} className="bt text-center text-xs py-2.5">
          + QUEUE
        </button>
      </div>
    </article>
  );
}
