'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { showToast } from '@/lib/queueStore';

export default function CreatorUploadPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [category, setCategory] = useState('shonen');
  const [studio, setStudio] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    showToast('STREAM FILE INGESTED & INDEXED IN ARCHIVE');
    setTimeout(() => {
      router.push('/creator/dashboard');
    }, 1500);
  };

  return (
    <div>
      <section className="pt">
        <div className="cr">
          <Link href="/">HOME</Link> / <Link href="/creator/dashboard">STUDIO</Link> / <span>INGESTION PROTOCOL</span>
        </div>
        <h1>UPLOAD STREAM</h1>
      </section>

      <section className="ab two">
        <div>
          <p className="font-bold text-black text-2xl uppercase font-display leading-tight mb-4">
            STREAMING MASTER SPECIFICATION
          </p>
          <p className="sm">
            ACCEPTED PROTOCOLS:<br />
            &bull; Direct MP4 / WebM Lossless Container<br />
            &bull; YouTube Data API v3 Stream Video ID<br />
            &bull; HLS (.m3u8) Adaptive Bitrate Stream<br /><br />
            STANDARDS:<br />
            Native 24fps or 60fps frame rates preserved without re-encoding artifacting. Audio channels must maintain original stereo/5.1 master fidelity.<br /><br />
            OKHLA PHASE 2 CDN CLUSTER &bull; TOKYO DISPATCH
          </p>
        </div>

        <div>
          {submitted ? (
            <div className="p-8 border-4 border-black bg-white space-y-3">
              <h3 className="font-bold text-2xl font-display uppercase">INGESTION COMPLETE</h3>
              <p className="text-sm font-mono">
                Stream master verified and propagated across CDN edge locations. Redirecting to studio...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="border-4 border-black bg-white p-6 shadow-[6px_6px_0px_#000]">
              <label>
                STREAM TITLE *
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Chainsaw Man - Episode 1: Dog & Chainsaw"
                />
              </label>

              <label>
                MASTER STREAM URL (.MP4 / .WEBM / YOUTUBE) *
                <input
                  type="url"
                  required
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=... or direct CDN URL"
                />
              </label>

              <label>
                ANIMATION STUDIO / CREATOR CREDITS
                <input
                  type="text"
                  value={studio}
                  onChange={(e) => setStudio(e.target.value)}
                  placeholder="e.g. MAPPA / Ufotable / Studio Bones"
                />
              </label>

              <label>
                ARCHIVE CATEGORY
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="shonen">SHONEN & ACTION</option>
                  <option value="action">SAKUGA COMBAT CUT</option>
                  <option value="amv">ANIMETHEME / AMV</option>
                  <option value="comedy">COMEDY & SLICE OF LIFE</option>
                  <option value="fantasy">DARK FANTASY</option>
                </select>
              </label>

              <label>
                SYNOPSIS & TECHNICAL LOG
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detail key animator credits, sound design, and broadcast date..."
                />
              </label>

              <button type="submit" className="bt w-full mt-4">
                PUBLISH TO MASTER ARCHIVE &rarr;
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
