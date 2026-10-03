'use client';

import React, { useState, useEffect } from 'react';
import VideoPlayer from '@/components/VideoPlayer';
import MediaCard from '@/components/MediaCard';
import { MediaItem } from '@/lib/data';
import { addToQueue } from '@/lib/queueStore';

export default function AnimeHubPage() {
  const [activeTab, setActiveTab] = useState<'youtube' | 'episodes' | 'themes' | 'trending' | 'search'>('youtube');
  const [viewMode, setViewMode] = useState<'box' | 'row'>('row');
  const [loading, setLoading] = useState(false);
  const [youtubeVideos, setYoutubeVideos] = useState<MediaItem[]>([]);
  const [episodes, setEpisodes] = useState<MediaItem[]>([]);
  const [themes, setThemes] = useState<MediaItem[]>([]);
  const [trending, setTrending] = useState<MediaItem[]>([]);
  const [searchResults, setSearchResults] = useState<MediaItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [ytPreset, setYtPreset] = useState('anime official episode full');
  const [activeVideo, setActiveVideo] = useState<MediaItem | null>(null);

  useEffect(() => {
    loadYouTube('anime official episode full');
    loadEpisodes();
    loadThemes();
    loadTrending();
  }, []);

  const loadYouTube = async (query = 'anime official episode full') => {
    try {
      setLoading(true);
      setYtPreset(query);
      const res = await fetch(`/api/anime/youtube?q=${encodeURIComponent(query)}&maxResults=16`);
      const data = await res.json();
      if (data.data) {
        setYoutubeVideos(data.data);
        if (!activeVideo && data.data.length > 0) {
          setActiveVideo(data.data[0]);
        }
      }
    } catch (e) {
      console.warn('YouTube load error', e);
    } finally {
      setLoading(false);
    }
  };

  const loadEpisodes = async () => {
    try {
      const res = await fetch('/api/anime/episodes');
      const data = await res.json();
      if (data.data) setEpisodes(data.data);
    } catch (e) {
      console.warn('Episodes load error', e);
    }
  };

  const loadThemes = async () => {
    try {
      const res = await fetch('/api/anime/themes');
      const data = await res.json();
      if (data.data) setThemes(data.data);
    } catch (e) {
      console.warn('Themes load error', e);
    }
  };

  const loadTrending = async () => {
    try {
      const res = await fetch('/api/anime/trending');
      const data = await res.json();
      if (data.data) setTrending(data.data);
    } catch (e) {
      console.warn('Trending load error', e);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    try {
      setLoading(true);
      setActiveTab('search');
      const [localRes, ytRes] = await Promise.all([
        fetch(`/api/anime/search?q=${encodeURIComponent(searchQuery)}`).then(r => r.json()),
        fetch(`/api/anime/youtube?q=${encodeURIComponent(searchQuery)}&maxResults=12`).then(r => r.json())
      ]);

      const combined = [
        ...(localRes.data || []),
        ...(ytRes.data || [])
      ];

      setSearchResults(combined);
    } catch (e) {
      console.warn('Search error', e);
    } finally {
      setLoading(false);
    }
  };

  const currentList = activeTab === 'youtube'
    ? youtubeVideos
    : activeTab === 'episodes'
    ? episodes
    : activeTab === 'themes'
    ? themes
    : activeTab === 'trending'
    ? trending
    : searchResults;

  return (
    <div>
      {/* Fixwell Page Title Section */}
      <section className="pt">
        <div className="cr">
          <a href="/">HOME</a> / <span>ANIME HUB &bull; FREE STREAMS ENGINE</span>
        </div>
        <h1>STREAM HUB</h1>

        {/* Search Bar in Fixwell Monospace Form Style */}
        <form onSubmit={handleSearch} className="mt-4 flex flex-wrap gap-2 max-w-2xl">
          <input
            type="text"
            placeholder="SEARCH SAKUGA, EPISODES, OP THEMES..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 min-w-[260px] !mt-0 !p-3 border-4 border-black"
          />
          <button type="submit" className="bt !p-3 whitespace-nowrap">
            SEARCH &rarr;
          </button>
        </form>

        {/* Fixwell Filter Buttons */}
        <div className="fl">
          <button
            onClick={() => setActiveTab('youtube')}
            className={activeTab === 'youtube' ? 'on' : ''}
          >
            01 YOUTUBE V3 ({youtubeVideos.length})
          </button>
          <button
            onClick={() => setActiveTab('episodes')}
            className={activeTab === 'episodes' ? 'on' : ''}
          >
            02 LEGAL EPISODES ({episodes.length})
          </button>
          <button
            onClick={() => setActiveTab('themes')}
            className={activeTab === 'themes' ? 'on' : ''}
          >
            03 ANIMETHEMES (.WEBM)
          </button>
          <button
            onClick={() => setActiveTab('trending')}
            className={activeTab === 'trending' ? 'on' : ''}
          >
            04 ANILIST TRENDING ({trending.length})
          </button>
          {searchResults.length > 0 && (
            <button
              onClick={() => setActiveTab('search')}
              className={activeTab === 'search' ? 'on' : ''}
            >
              SEARCH RESULTS ({searchResults.length})
            </button>
          )}
        </div>
      </section>

      {/* Fixwell Active Stream Spec & Player (.pd) */}
      {activeVideo && (
        <section className="pd">
          <div className="sheet">
            <div className="ph">
              <VideoPlayer
                url={activeVideo.videoUrl}
                title={activeVideo.title}
                poster={activeVideo.thumbnailUrl}
              />
            </div>
            <table>
              <tbody>
                <tr>
                  <td>STREAM SKU</td>
                  <td>FW-ANM-{(activeVideo.id || '00').toString().slice(-4).padStart(4, '0').toUpperCase()}</td>
                </tr>
                <tr>
                  <td>MEDIA TITLE</td>
                  <td className="font-bold">{activeVideo.title}</td>
                </tr>
                <tr>
                  <td>SOURCE API</td>
                  <td>{activeVideo.source || 'YouTube Data API v3'}</td>
                </tr>
                <tr>
                  <td>STUDIO / CHANNEL</td>
                  <td>{activeVideo.channelTitle || activeVideo.studio || activeVideo.seriesTitle || 'Official Licensor'}</td>
                </tr>
                <tr>
                  <td>RESOLUTION</td>
                  <td>{activeVideo.resolution ? `${activeVideo.resolution}P HD` : '1080P HD / 60FPS'}</td>
                </tr>
                <tr>
                  <td>DISPATCH SPEED</td>
                  <td>INSTANT ZERO-BUFFER STREAM</td>
                </tr>
              </tbody>
            </table>
            <p className="font-mono text-xs text-neutral-600">
              {activeVideo.description || 'Verified stream direct from master feed. No promotional interstitials.'}
            </p>
          </div>

          {/* Fixwell Sticky Action Block (.bb) */}
          <div className="bb">
            <b>STREAM RATING / STATUS</b>
            <div className="big">
              {activeVideo.score ? `★ ${activeVideo.score}` : '1080P'}
              <s>{(activeVideo.views || 25000).toLocaleString()} VWS</s>
            </div>

            <b>ACTIONS & QUEUE</b>
            <div className="mt-2 space-y-2">
              <button
                onClick={() => addToQueue(activeVideo._id || String(activeVideo.id))}
                className="bt w-full text-center"
              >
                + ADD TO WATCH QUEUE
              </button>
              <a
                href={activeVideo.videoUrl}
                target="_blank"
                rel="noreferrer"
                className="bt w w-full block text-center"
              >
                OPEN DIRECT STREAM &rarr;
              </a>
              <button
                onClick={() => setActiveVideo(null)}
                className="bt k w-full text-center"
              >
                COLLAPSE THEATER
              </button>
            </div>
          </div>
        </section>
      )}

      {/* YouTube Preset Controls Bar */}
      {activeTab === 'youtube' && (
        <div className="lab flex flex-wrap items-center justify-between gap-2">
          <span>YOUTUBE API PRESETS:</span>
          <div className="flex flex-wrap gap-2 text-xs">
            {[
              { label: 'FULL EPISODES', q: 'anime official episode full' },
              { label: '60FPS SAKUGA FIGHTS', q: 'anime sakuga fight scene 60fps' },
              { label: '4K OPENINGS', q: 'anime opening 4k 60fps' },
              { label: 'MOVIE TRAILERS', q: 'anime movie official trailer' },
              { label: 'LO-FI CHILL', q: 'anime lofi hip hop chill beats' },
            ].map((p) => (
              <button
                key={p.q}
                onClick={() => loadYouTube(p.q)}
                className={`px-2 py-0.5 border ${
                  ytPreset === p.q
                    ? 'bg-[#ff4d00] text-black border-[#ff4d00] font-bold'
                    : 'bg-black text-white border-neutral-700 hover:border-white'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* View Switcher: Table vs Box */}
      <div className="px-6 py-3 border-b-4 border-black flex justify-between items-center text-xs font-bold bg-[#efefea]">
        <span>TOTAL ITEMS IN FEED: {currentList.length}</span>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('row')}
            className={`px-3 py-1 border-2 border-black ${viewMode === 'row' ? 'bg-black text-white' : 'bg-white text-black'}`}
          >
            TABLE VIEW
          </button>
          <button
            onClick={() => setViewMode('box')}
            className={`px-3 py-1 border-2 border-black ${viewMode === 'box' ? 'bg-black text-white' : 'bg-white text-black'}`}
          >
            GRID BOXES
          </button>
        </div>
      </div>

      {/* Stream Items List */}
      {loading ? (
        <div className="p-16 text-center font-bold text-xl tracking-wider">
          FETCHING STREAMS FROM API ARCHIVE...
        </div>
      ) : viewMode === 'row' ? (
        <div>
          <div className="rw hh">
            <span>SKU</span>
            <span>STREAM ITEM</span>
            <span>SPEC / STUDIO</span>
            <span>RESOLUTION</span>
            <span>ACTION</span>
          </div>
          {currentList.map((item) => (
            <div
              key={item._id}
              onClick={() => {
                setActiveVideo(item);
                window.scrollTo({ top: 120, behavior: 'smooth' });
              }}
              className="cursor-pointer"
            >
              <MediaCard media={item} viewMode="row" />
            </div>
          ))}
        </div>
      ) : (
        <div className="bx4">
          {currentList.map((item) => (
            <div
              key={item._id}
              onClick={() => {
                setActiveVideo(item);
                window.scrollTo({ top: 120, behavior: 'smooth' });
              }}
              className="cursor-pointer"
            >
              <MediaCard media={item} viewMode="box" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
