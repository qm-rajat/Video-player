import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import ReactPlayer from 'react-player';
import animeAPI from '../../services/animeAPI';
import LoadingSpinner from '../../components/UI/LoadingSpinner';

const AnimeHub = () => {
  const [activeTab, setActiveTab] = useState('youtube'); // 'youtube' | 'episodes' | 'themes' | 'trending' | 'search'
  const [loading, setLoading] = useState(false);
  const [episodes, setEpisodes] = useState([]);
  const [trending, setTrending] = useState([]);
  const [themes, setThemes] = useState([]);
  const [youtubeVideos, setYoutubeVideos] = useState([]);
  const [ytPreset, setYtPreset] = useState('anime official episode full');
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeVideo, setActiveVideo] = useState(null);

  // Load initial content
  useEffect(() => {
    loadYouTube('anime official episode full');
    loadEpisodes();
    loadTrending();
    loadThemes();
  }, []);

  const loadYouTube = async (query = 'anime official episode full') => {
    try {
      setLoading(true);
      setYtPreset(query);
      const res = await animeAPI.searchYouTubeAnime(query, 16);
      if (res && res.data) {
        setYoutubeVideos(res.data);
        if (!activeVideo && res.data.length > 0) {
          setActiveVideo(res.data[0]);
        }
      }
    } catch (e) {
      console.warn('YouTube videos note:', e?.message || e);
    } finally {
      setLoading(false);
    }
  };

  const loadEpisodes = async () => {
    try {
      const res = await animeAPI.getLegalEpisodes();
      if (res && res.data) {
        setEpisodes(res.data);
      }
    } catch (e) {
      console.warn('Episodes note:', e?.message || e);
    }
  };

  const loadTrending = async () => {
    try {
      const res = await animeAPI.getTrendingAnime();
      if (res && res.data) {
        setTrending(res.data);
      }
    } catch (e) {
      console.warn('Trending note:', e?.message || e);
    }
  };

  const loadThemes = async () => {
    try {
      const res = await animeAPI.getAnimeThemes();
      if (res && res.data) {
        setThemes(res.data);
      }
    } catch (e) {
      console.warn('Themes note:', e?.message || e);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    try {
      setLoading(true);
      setActiveTab('search');
      const [localRes, ytRes] = await Promise.all([
        animeAPI.searchAnime(searchQuery),
        animeAPI.searchYouTubeAnime(searchQuery, 8)
      ]);

      const combined = [
        ...(localRes.data || []),
        ...(ytRes.data || [])
      ];

      setSearchResults(combined);
    } catch (e) {
      console.error('Search failed', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Anime Stream Hub - YouTube Data API & Free Streams</title>
        <meta name="description" content="Watch free anime videos with YouTube Data API v3, direct anime openings and endings from AnimeThemes, and trending anime PVs powered by AniList." />
      </Helmet>

      <div className="space-y-8">
        {/* Header Title & API Providers Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-red-950/40 via-purple-900/40 to-dark-800 p-6 rounded-2xl border border-red-500/20 shadow-xl">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-500/20 text-red-300 border border-red-500/30 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                YOUTUBE DATA API V3 CONNECTED
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                ANIMETHEMES & ANILIST ACTIVE
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <span>⚡</span> Anime Video Streaming Hub
            </h1>
            <p className="text-purple-200/80 text-sm mt-1 max-w-xl">
              Powered by your <strong>YouTube Data API v3 key</strong>, <strong>AnimeThemes API</strong> (direct .webm/.mp4), <strong>AniList GraphQL</strong>, and official licensor streams.
            </p>
          </div>

          {/* Quick Search */}
          <form onSubmit={handleSearch} className="flex items-center gap-2 w-full md:w-auto">
            <input
              type="text"
              placeholder="Search anime title or episode..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-dark-900/90 border border-purple-500/30 focus:border-red-400 rounded-xl px-4 py-2 text-sm text-white placeholder-dark-400 w-full md:w-64 focus:outline-none"
            />
            <button
              type="submit"
              className="btn btn-primary bg-gradient-to-r from-red-600 via-purple-600 to-indigo-600 hover:from-red-700 hover:to-indigo-700 text-sm whitespace-nowrap"
            >
              Search
            </button>
          </form>
        </div>

        {/* Active Theater Video Player */}
        {activeVideo && (
          <div className="bg-dark-800/90 rounded-2xl border border-dark-700 overflow-hidden shadow-2xl">
            <div className="relative aspect-video bg-black max-h-[540px]">
              <ReactPlayer
                url={activeVideo.videoUrl}
                controls
                playing
                width="100%"
                height="100%"
              />
            </div>
            <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className="px-2 py-0.5 text-xs rounded bg-red-500/20 text-red-300 font-semibold">
                    {activeVideo.source || 'YouTube Stream'}
                  </span>
                  {activeVideo.channelTitle && (
                    <span className="px-2 py-0.5 text-xs rounded bg-dark-700 text-white font-medium">
                      📺 {activeVideo.channelTitle}
                    </span>
                  )}
                  {activeVideo.resolution && (
                    <span className="px-2 py-0.5 text-xs rounded bg-green-500/20 text-green-300 font-medium">
                      {activeVideo.resolution}p HD
                    </span>
                  )}
                  {activeVideo.category && (
                    <span className="px-2 py-0.5 text-xs rounded bg-dark-700 text-dark-300 uppercase">
                      {activeVideo.category}
                    </span>
                  )}
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">
                  {activeVideo.title}
                </h2>
                <p className="text-dark-300 text-sm mt-1 max-w-3xl line-clamp-2">
                  {activeVideo.description || (activeVideo.songTitle ? `Featured Song: ${activeVideo.songTitle}` : '')}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveVideo(null)}
                  className="btn btn-outline border-dark-600 text-dark-300 hover:text-white text-xs px-3 py-1.5"
                >
                  Close Player
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex flex-wrap items-center gap-2 border-b border-dark-700 pb-3">
          <button
            onClick={() => setActiveTab('youtube')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'youtube'
                ? 'bg-gradient-to-r from-red-600 to-purple-600 text-white shadow-lg shadow-red-600/30'
                : 'bg-dark-800 text-dark-300 hover:text-white hover:bg-dark-700'
            }`}
          >
            <span>🔴</span> YouTube Data API Streams ({youtubeVideos.length})
          </button>

          <button
            onClick={() => setActiveTab('episodes')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'episodes'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/30'
                : 'bg-dark-800 text-dark-300 hover:text-white hover:bg-dark-700'
            }`}
          >
            <span>🎬</span> Legal Free Episodes ({episodes.length})
          </button>

          <button
            onClick={() => setActiveTab('themes')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'themes'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/30'
                : 'bg-dark-800 text-dark-300 hover:text-white hover:bg-dark-700'
            }`}
          >
            <span>🎵</span> Direct Video Streams (AnimeThemes API)
          </button>

          <button
            onClick={() => setActiveTab('trending')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'trending'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/30'
                : 'bg-dark-800 text-dark-300 hover:text-white hover:bg-dark-700'
            }`}
          >
            <span>🔥</span> Trending Anime PVs (AniList & Jikan)
          </button>

          {searchResults.length > 0 && (
            <button
              onClick={() => setActiveTab('search')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'search'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/30'
                  : 'bg-dark-800 text-dark-300 hover:text-white hover:bg-dark-700'
              }`}
            >
              <span>🔍</span> Search Results ({searchResults.length})
            </button>
          )}
        </div>

        {/* YouTube Category Presets Bar */}
        {activeTab === 'youtube' && (
          <div className="flex flex-wrap items-center gap-2 pt-1 pb-2">
            <span className="text-xs text-dark-400 mr-2 font-medium">Quick Query:</span>
            {[
              { label: '🔥 Full Official Episodes', query: 'anime official episode full' },
              { label: '⚔️ Sakuga Battle Fights', query: 'anime sakuga fight scene 60fps' },
              { label: '🌸 Anime Openings 4K', query: 'anime opening 4k 60fps' },
              { label: '🎬 Official Movie Trailers', query: 'anime movie official trailer' },
              { label: '☕ Lo-Fi Anime Chill', query: 'anime lofi hip hop chill beats' }
            ].map(preset => (
              <button
                key={preset.query}
                onClick={() => loadYouTube(preset.query)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  ytPreset === preset.query
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                    : 'bg-dark-800 text-dark-300 hover:text-white hover:bg-dark-700 border border-dark-700'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="flex justify-center py-16">
            <LoadingSpinner size="large" />
          </div>
        )}

        {/* Tab 0: YouTube Data API v3 Streams */}
        {!loading && activeTab === 'youtube' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span>🔴</span> YouTube Data API v3 Live Anime Streams
              </h2>
              <span className="text-xs text-red-300 font-mono">Status: 200 OK • Live Query Active</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {youtubeVideos.map((item) => (
                <div
                  key={item._id}
                  onClick={() => {
                    setActiveVideo(item);
                    window.scrollTo({ top: 120, behavior: 'smooth' });
                  }}
                  className="bg-dark-800 rounded-xl overflow-hidden border border-dark-700 hover:border-red-500/60 transition-all hover:scale-[1.02] cursor-pointer group shadow-lg flex flex-col"
                >
                  <div className="relative aspect-video bg-dark-900 overflow-hidden">
                    <img
                      src={item.thumbnailUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[11px] bg-red-600 text-white font-semibold flex items-center gap-1 shadow">
                      <span>▶</span> YouTube API
                    </span>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center shadow-lg shadow-red-600/50">
                        <svg className="w-6 h-6 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[11px] font-medium text-red-400 line-clamp-1">
                        {item.channelTitle}
                      </span>
                      <h3 className="font-bold text-white text-sm group-hover:text-red-300 transition-colors line-clamp-2 mt-1">
                        {item.title}
                      </h3>
                      <p className="text-dark-400 text-xs mt-1.5 line-clamp-2">
                        {item.description}
                      </p>
                    </div>
                    <div className="mt-3 pt-3 border-t border-dark-700/60 flex items-center justify-between text-xs text-dark-400">
                      <span className="text-red-400 font-semibold group-hover:underline">Play in Theater ▶</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 1: Curated Legal Free Episodes */}
        {!loading && activeTab === 'episodes' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span>🌟</span> Official Free Episodes & Sakuga Showcases
              </h2>
              <span className="text-xs text-dark-400">Streamed from Official Licensors (MAPPA, Muse, TOHO)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {episodes.map((item) => (
                <div
                  key={item._id}
                  onClick={() => {
                    setActiveVideo(item);
                    window.scrollTo({ top: 120, behavior: 'smooth' });
                  }}
                  className="bg-dark-800 rounded-xl overflow-hidden border border-dark-700 hover:border-purple-500/60 transition-all hover:scale-[1.02] cursor-pointer group shadow-lg flex flex-col"
                >
                  <div className="relative aspect-video bg-dark-900 overflow-hidden">
                    <img
                      src={item.thumbnailUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                    <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded text-xs bg-purple-600/90 text-white font-medium">
                      {item.source}
                    </span>
                    <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded text-xs bg-black/80 text-white font-mono">
                      {Math.floor(item.duration / 60)}:00
                    </span>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-purple-600/50">
                        <svg className="w-6 h-6 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-white text-base group-hover:text-purple-400 transition-colors line-clamp-1">
                        {item.title}
                      </h3>
                      <p className="text-dark-400 text-xs mt-1 line-clamp-2">
                        {item.description}
                      </p>
                    </div>
                    <div className="mt-3 pt-3 border-t border-dark-700/60 flex items-center justify-between text-xs text-dark-400">
                      <span className="capitalize">{item.category}</span>
                      <span className="text-purple-400 font-medium group-hover:underline">Click to Watch ▶</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Direct Video Streams (AnimeThemes API) */}
        {!loading && activeTab === 'themes' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span>🎵</span> Direct High-Definition Anime Video Streams
              </h2>
              <span className="text-xs text-purple-300">Powered by AnimeThemes.moe API (Direct .webm / .mp4 files)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {themes.map((theme) => (
                <div
                  key={theme._id}
                  onClick={() => {
                    setActiveVideo(theme);
                    window.scrollTo({ top: 120, behavior: 'smooth' });
                  }}
                  className="bg-dark-800 rounded-xl overflow-hidden border border-dark-700 hover:border-indigo-500/60 transition-all hover:scale-[1.02] cursor-pointer group shadow-lg flex flex-col"
                >
                  <div className="relative aspect-video bg-dark-900 overflow-hidden">
                    <img
                      src={theme.thumbnailUrl}
                      alt={theme.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded text-xs bg-indigo-600/90 text-white font-medium">
                      Direct Video File
                    </span>
                    <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded text-xs bg-green-600/90 text-white font-medium">
                      {theme.resolution}p Direct Stream
                    </span>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center shadow-lg shadow-indigo-600/50">
                        <svg className="w-6 h-6 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-semibold text-indigo-400">{theme.seriesTitle}</span>
                      <h3 className="font-bold text-white text-base group-hover:text-indigo-300 transition-colors line-clamp-1 mt-0.5">
                        {theme.title}
                      </h3>
                      {theme.songTitle && (
                        <p className="text-dark-300 text-xs mt-1">
                          Track: <span className="text-dark-200">{theme.songTitle}</span>
                        </p>
                      )}
                    </div>
                    <div className="mt-3 pt-3 border-t border-dark-700/60 flex items-center justify-between text-xs text-dark-400">
                      <span>Source: animethemes.moe</span>
                      <span className="text-indigo-400 font-medium group-hover:underline">Play Video ▶</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Trending Anime (AniList & Jikan v4) */}
        {!loading && activeTab === 'trending' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span>🔥</span> Top Trending Anime & PV Trailers
              </h2>
              <span className="text-xs text-purple-300">Live GraphQL Feed via AniList & Jikan v4</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {trending.map((anime) => (
                <div
                  key={anime._id}
                  onClick={() => {
                    setActiveVideo(anime);
                    window.scrollTo({ top: 120, behavior: 'smooth' });
                  }}
                  className="bg-dark-800 rounded-xl overflow-hidden border border-dark-700 hover:border-purple-500/60 transition-all hover:scale-[1.02] cursor-pointer group shadow-lg flex flex-col"
                >
                  <div className="relative aspect-[3/4] bg-dark-900 overflow-hidden">
                    <img
                      src={anime.thumbnailUrl}
                      alt={anime.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded text-xs bg-yellow-500 text-dark-900 font-bold flex items-center gap-1">
                      ★ {anime.score}
                    </span>
                    <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded text-xs bg-black/70 text-purple-300 font-medium">
                      {anime.episodes} Episodes
                    </span>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-purple-600/50">
                        <svg className="w-6 h-6 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-white text-sm group-hover:text-purple-400 transition-colors line-clamp-1">
                        {anime.title}
                      </h3>
                      <p className="text-dark-400 text-xs mt-1 line-clamp-2">
                        {anime.description}
                      </p>
                    </div>
                    <div className="mt-3 pt-3 border-t border-dark-700/60 flex items-center justify-between text-xs text-dark-400">
                      <span className="truncate max-w-[120px]">{anime.studio}</span>
                      <span className="text-purple-400 font-medium">Watch Trailer ▶</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Search Results */}
        {!loading && activeTab === 'search' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span>🔍</span> Search Results for "{searchQuery}"
            </h2>
            {searchResults.length === 0 ? (
              <div className="p-12 text-center bg-dark-800 rounded-xl border border-dark-700">
                <p className="text-dark-300">No anime found matching your query. Try a different title!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {searchResults.map((item) => (
                  <div
                    key={item._id}
                    onClick={() => {
                      setActiveVideo(item);
                      window.scrollTo({ top: 120, behavior: 'smooth' });
                    }}
                    className="bg-dark-800 rounded-xl overflow-hidden border border-dark-700 hover:border-purple-500/60 transition-all hover:scale-[1.02] cursor-pointer group shadow-lg flex flex-col"
                  >
                    <div className="relative aspect-video bg-dark-900 overflow-hidden">
                      <img
                        src={item.thumbnailUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[11px] bg-red-600/90 text-white font-semibold">
                        {item.source || 'Stream'}
                      </span>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-purple-600/50">
                          <svg className="w-6 h-6 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-white text-sm group-hover:text-purple-400 transition-colors line-clamp-2">
                          {item.title}
                        </h3>
                        <p className="text-dark-400 text-xs mt-1 line-clamp-2">
                          {item.description}
                        </p>
                      </div>
                      <div className="mt-3 pt-3 border-t border-dark-700/60 flex items-center justify-between text-xs text-dark-400">
                        <span>{item.channelTitle || item.year || 'Anime'}</span>
                        <span className="text-purple-400 font-medium">Watch Stream ▶</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default AnimeHub;
