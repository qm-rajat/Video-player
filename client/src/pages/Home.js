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
        <title>Home - Adult Content Platform</title>
        <meta name="description" content="Discover the latest and trending adult content from verified creators." />
      </Helmet>

      <div className="space-y-8">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-8 text-center overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Welcome to the Ultimate Adult Platform
            </h1>
            <p className="text-xl text-primary-100 mb-6 max-w-2xl mx-auto">
              Discover exclusive content from verified creators. Subscribe to your favorites and enjoy premium experiences.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn btn-secondary">
                Explore Content
              </button>
              <button className="btn btn-outline border-white text-white hover:bg-white hover:text-primary-600">
                Become a Creator
              </button>
            </div>
          </div>
          <div className="absolute inset-0 bg-black opacity-20"></div>
        </section>

        {/* Trending Content */}
        {trending.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Trending Now</h2>
              <button className="text-primary-400 hover:text-primary-300 font-medium">
                View All
              </button>
            </div>
            <MediaGrid media={trending.slice(0, 8)} />
          </section>
        )}

        {/* Latest Content */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Latest Content</h2>
            <div className="flex space-x-2">
              <select className="bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white text-sm">
                <option value="newest">Newest</option>
                <option value="popular">Most Popular</option>
                <option value="most-liked">Most Liked</option>
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
          <h2 className="text-2xl font-bold text-white mb-6">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              'Amateur',
              'Professional',
              'Couples',
              'Solo Female',
              'Solo Male',
              'Group',
              'Fetish',
              'BDSM',
              'Roleplay',
              'Vintage'
            ].map((category) => (
              <div
                key={category}
                className="bg-dark-800 rounded-lg p-4 text-center hover:bg-dark-700 transition-colors cursor-pointer"
              >
                <div className="w-12 h-12 bg-primary-600 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <span className="text-white font-bold">
                    {category.charAt(0)}
                  </span>
                </div>
                <span className="text-white text-sm font-medium">{category}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;