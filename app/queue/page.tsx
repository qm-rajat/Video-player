'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { curatedLegalEpisodes, MediaItem } from '@/lib/data';
import { useQueue, updateQueueQuantity, removeFromQueue, clearQueue, showToast } from '@/lib/queueStore';

export default function QueuePage() {
  const { queue, count } = useQueue();
  const [items, setItems] = useState<{ media: MediaItem; qty: number }[]>([]);

  useEffect(() => {
    const list: { media: MediaItem; qty: number }[] = [];
    Object.keys(queue).forEach((id) => {
      const match = curatedLegalEpisodes.find(m => m._id === id || String(m.id) === id);
      if (match) {
        list.push({ media: match, qty: queue[id] });
      } else {
        // Fallback for custom or YouTube item
        list.push({
          media: {
            _id: id,
            id: id,
            title: id.startsWith('yt-') ? 'YouTube Anime Stream' : `Stream ID ${id}`,
            description: 'Queued stream item',
            thumbnailUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=300&auto=format&fit=crop&q=80',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            duration: 1440,
            category: 'action'
          },
          qty: queue[id]
        });
      }
    });
    setItems(list);
  }, [queue]);

  const totalRuntimeMinutes = items.reduce((acc, item) => acc + (Math.floor((item.media.duration || 1440) / 60) * item.qty), 0);

  const handleStartPlay = () => {
    if (items.length > 0) {
      showToast('INITIALIZING QUEUE CONTINUOUS STREAM...');
      window.location.href = `/media/${items[0].media._id || items[0].media.id}`;
    }
  };

  return (
    <div>
      <section className="pt">
        <div className="cr">
          <Link href="/">HOME</Link> / <span>WATCHLIST & CONTINUOUS QUEUE</span>
        </div>
        <h1>STREAM DOCKET</h1>
      </section>

      {/* Fixwell Thermal Receipt Box (.rc + .paper) */}
      <div className="rc">
        <div className="paper">
          <h1>ANIMESTREAM</h1>
          <p className="c">
            STREAM QUEUE &bull; DOCKET #8892<br />
            ------------------------------------------------
          </p>

          <div id="items">
            {items.length === 0 ? (
              <div className="py-8 text-center text-sm font-bold text-neutral-600">
                NO STREAMS IN QUEUE.<br /><br />
                <Link href="/search" className="underline hover:text-black">
                  &rarr; BROWSE CATALOGUE TO ADD STREAMS
                </Link>
              </div>
            ) : (
              items.map(({ media, qty }) => {
                const sku = `FW-ANM-${(media.id || media._id || '00').toString().slice(-4).padStart(4, '0').toUpperCase()}`;
                const itemMinutes = Math.floor((media.duration || 1440) / 60);

                return (
                  <div key={media._id} className="li">
                    <div>
                      <span className="n block">{media.title}</span>
                      <small className="block font-mono">
                        {sku} &bull; {itemMinutes} MIN EACH
                      </small>
                    </div>

                    <div className="text-right">
                      <b>{itemMinutes * qty} MIN</b>
                      <div className="ctl mt-1 justify-end">
                        <button onClick={() => updateQueueQuantity(media._id || String(media.id), -1)}>
                          -
                        </button>
                        <span>X{qty}</span>
                        <button onClick={() => updateQueueQuantity(media._id || String(media.id), 1)}>
                          +
                        </button>
                        <button
                          className="x"
                          onClick={() => removeFromQueue(media._id || String(media.id))}
                        >
                          DEL
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {items.length > 0 && (
            <div className="tt">
              <div>
                <span>QUEUED TITLES</span>
                <span>{items.length} TITLES</span>
              </div>
              <div>
                <span>TOTAL EPISODES / CLIPS</span>
                <span>{count} ITEMS</span>
              </div>
              <div>
                <span>STREAM BUFFER</span>
                <span className="font-bold">ZERO DELAY (DIRECT CDN)</span>
              </div>
              <div className="g">
                <span>ESTIMATED RUNTIME</span>
                <span>{totalRuntimeMinutes} MIN</span>
              </div>

              <div className="pt-4 flex flex-col gap-2">
                <button
                  onClick={handleStartPlay}
                  className="bt w-full text-center !bg-[#ff4d00] !text-black !border-black"
                >
                  START CONTINUOUS STREAM &rarr;
                </button>
                <button
                  onClick={clearQueue}
                  className="bt w-full text-center !bg-black !text-white"
                >
                  CLEAR QUEUE
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
