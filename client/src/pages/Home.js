import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMedia, fetchTrendingMedia, selectMedia } from '../store/slices/mediaSlice';
import MediaGrid from '../components/Media/MediaGrid';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { Helmet } from 'react-helmet-async';

const Home = () => {
  const dispatch = useDispatch();
  const { media, trending, isLoading } = useSelector(selectMedia);

  useEffect(() => {
    dispatch(fetchMedia({ page: 1, limit: 20 }));
    dispatch(fetchTrendingMedia());
  }, [dispatch]);

  return (
    <>
      <Helmet>
        <title>Home - Anime Video Streaming Platform</title>
        <meta name="description" content="Discover the latest and trending anime series, sakuga clips, and original animations from creators." />
      </Helmet>

      <div className="space-y-8">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-purple-700 via-indigo-700 to-pink-600 rounded-2xl p-8 text-center overflow-hidden shadow-2xl">
          <div className="relative z-10">
            <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold tracking-wider text-pink-200 mb-3">
              ✨ PREMIER ANIME STREAMING HUB
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
              Welcome to AnimeStream
            </h1>
            <p className="text-xl text-purple-100 mb-6 max-w-2xl mx-auto font-medium">
              Watch high-definition anime episodes, breathtaking sakuga animation highlights, and original works from top anime creators.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#latest" className="btn btn-secondary shadow-lg">
                Explore Anime
              </a>
              <button 
                onClick={() => dispatch(fetchMedia({ page: 1, limit: 20 }))}
                className="btn btn-outline border-white text-white hover:bg-white hover:text-purple-700"
              >
                Trending Sakuga
              </button>
            </div>
          </div>
          <div className="absolute inset-0 bg-black opacity-30"></div>
        </section>

        {/* Trending Content */}
        {trending.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <span>🔥</span> Trending Anime & Clips
              </h2>
            </div>
            <MediaGrid media={trending.slice(0, 8)} />
          </section>
        )}

        {/* Latest Content */}
        <section id="latest">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <span>⚡</span> Latest Releases & AMVs
            </h2>
            <div className="flex space-x-2">
              <select 
                onChange={(e) => dispatch(fetchMedia({ page: 1, limit: 20, sort: e.target.value }))}
                className="bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white text-sm"
              >
                <option value="newest">Newest Releases</option>
                <option value="popular">Most Popular</option>
                <option value="most-liked">Highest Rated</option>
              </select>
            </div>
          </div>
          
          {isLoading && media.length === 0 ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="large" />
            </div>
          ) : (
            <MediaGrid media={media} />
          )}
        </section>

        {/* Categories */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <span>🎭</span> Anime Genres & Categories
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              'Action',
              'Shonen',
              'Isekai',
              'Fantasy',
              'Sci-Fi',
              'Romance',
              'Slice of Life',
              'Comedy',
              'Mecha',
              'Supernatural',
              'AMV',
              'Movie'
            ].map((category) => (
              <div
                key={category}
                onClick={() => dispatch(fetchMedia({ page: 1, limit: 20, category: category.toLowerCase() }))}
                className="bg-dark-800 rounded-lg p-4 text-center hover:bg-dark-700 hover:border-primary-500 border border-transparent transition-all cursor-pointer group"
              >
                <div className="w-12 h-12 bg-gradient-to-tr from-purple-600 to-pink-500 rounded-full mx-auto mb-2 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="text-white font-bold">
                    {category.charAt(0)}
                  </span>
                </div>
                <span className="text-white text-sm font-medium group-hover:text-primary-400 transition-colors">{category}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;