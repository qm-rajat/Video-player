'use client';

import React, { useState, useEffect } from 'react';

interface VideoPlayerProps {
  url: string;
  title?: string;
  poster?: string;
  autoPlay?: boolean;
}

export default function VideoPlayer({ url, title, poster, autoPlay = true }: VideoPlayerProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="relative aspect-video bg-black flex items-center justify-center border-4 border-black text-[#ff4d00] font-mono font-bold text-sm tracking-widest">
        <span>INITIALIZING STREAM ENGINE...</span>
      </div>
    );
  }

  // Detect YouTube URL
  const isYouTube = url.includes('youtube.com') || url.includes('youtu.be');
  let youtubeEmbedUrl = '';

  if (isYouTube) {
    let videoId = '';
    if (url.includes('v=')) {
      videoId = url.split('v=')[1]?.split('&')[0];
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0];
    }
    youtubeEmbedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=${autoPlay ? 1 : 0}&rel=0&modestbranding=1`;
  }

  return (
    <div className="relative aspect-video bg-black border-4 border-black shadow-[6px_6px_0px_#000000] overflow-hidden">
      {isYouTube ? (
        <iframe
          src={youtubeEmbedUrl}
          title={title || "Anime Stream"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full border-0"
        />
      ) : (
        <video
          src={url}
          poster={poster}
          controls
          autoPlay={autoPlay}
          playsInline
          className="w-full h-full object-contain"
        >
          Your browser does not support HTML5 video streaming.
        </video>
      )}
    </div>
  );
}
