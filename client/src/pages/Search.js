import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { searchMedia, selectSearchResults, selectMediaLoading } from '../store/slices/mediaSlice';
import MediaGrid from '../components/Media/MediaGrid';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { Helmet } from 'react-helmet-async';

const Search = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const searchResults = useSelector(selectSearchResults);
  const isLoading = useSelector(selectMediaLoading);
  const [filters, setFilters] = useState({
    category: '',
    sort: 'newest',
  });

  const query = searchParams.get('q') || '';

  useEffect(() => {
    if (query) {
      dispatch(searchMedia({ q: query, ...filters }));
    }
  }, [dispatch, query, filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <>
      <Helmet>
        <title>{query ? `Search: ${query}` : 'Search'} - Adult Content Platform</title>
        <meta name="description" content={`Search results for ${query}`} />
      </Helmet>

      <div className="space-y-6">
        {/* Search Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">
              {query ? `Search results for "${query}"` : 'Search Content'}
            </h1>
            {searchResults.length > 0 && (
              <p className="text-dark-400 mt-1">
                {searchResults.length} results found
              </p>
            )}
          </div>

          {/* Filters */}
          <div className="flex space-x-4 mt-4 sm:mt-0">
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white text-sm"
            >
              <option value="">All Categories</option>
              <option value="amateur">Amateur</option>
              <option value="professional">Professional</option>
              <option value="couples">Couples</option>
              <option value="solo-female">Solo Female</option>
              <option value="solo-male">Solo Male</option>
              <option value="group">Group</option>
              <option value="fetish">Fetish</option>
              <option value="bdsm">BDSM</option>
              <option value="roleplay">Roleplay</option>
              <option value="vintage">Vintage</option>
            </select>

            <select
              value={filters.sort}
              onChange={(e) => handleFilterChange('sort', e.target.value)}
              className="bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white text-sm"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="popular">Most Popular</option>
              <option value="most-liked">Most Liked</option>
            </select>
          </div>
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="large" />
          </div>
        ) : query && searchResults.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-dark-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-white mb-2">No results found</h3>
            <p className="text-dark-400">
              Try adjusting your search terms or filters
            </p>
          </div>
        ) : !query ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-dark-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-white mb-2">Start searching</h3>
            <p className="text-dark-400">
              Enter a search term to find content
            </p>
          </div>
        ) : (
          <MediaGrid media={searchResults} />
        )}
      </div>
    </>
  );
};

export default Search;