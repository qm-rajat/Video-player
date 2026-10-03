'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import MediaCard from '@/components/MediaCard';
import { MediaItem, curatedLegalEpisodes } from '@/lib/data';

function SearchContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('cat') || 'All';
  const initialQuery = searchParams.get('q') || '';

  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<MediaItem[]>(curatedLegalEpisodes);
  const [viewMode, setViewMode] = useState<'row' | 'box'>('row');
  const [loading, setLoading] = useState(false);

  const categories = ['All', 'shonen', 'action', 'comedy', 'fantasy', 'amv'];

  useEffect(() => {
    performSearch(query, activeCategory);
  }, [activeCategory]);

  const performSearch = async (searchTerm: string, categoryFilter: string) => {
    setLoading(true);
    try {
      let list = [...curatedLegalEpisodes];

      if (categoryFilter && categoryFilter.toLowerCase() !== 'all') {
        list = list.filter(item => (item.category || '').toLowerCase() === categoryFilter.toLowerCase());
      }

      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        list = list.filter(item =>
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          (item.studio && item.studio.toLowerCase().includes(q))
        );
      }

      setResults(list);
    } catch {
      setResults(curatedLegalEpisodes);
    } finally {
      setLoading(false);
    }
  };

  const handleQuerySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query, activeCategory);
  };

  return (
    <div>
      {/* Fixwell Catalogue Title & Filter Bar */}
      <section className="pt">
        <div className="cr">
          <a href="/">HOME</a> / <span>GLOBAL ARCHIVE CATALOGUE</span>
        </div>
        <h1>CATALOGUE</h1>

        {/* Search Input Form in Fixwell Monospace Style */}
        <form onSubmit={handleQuerySubmit} className="mt-4 flex flex-wrap gap-2 max-w-xl">
          <input
            type="text"
            placeholder="SEARCH TITLE, STUDIO, OR SKU..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 min-w-[240px] !mt-0 !p-3 border-4 border-black"
          />
          <button type="submit" className="bt !p-3">
            FILTER &rarr;
          </button>
        </form>

        {/* Fixwell Contiguous Category Filter Buttons */}
        <div className="fl">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={activeCategory.toLowerCase() === cat.toLowerCase() ? 'on' : ''}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>
      </section>

      {/* Catalogue Sub-header */}
      <div className="px-6 py-3 border-b-4 border-black flex justify-between items-center text-xs font-bold bg-[#efefea]">
        <span>INDEXED ITEMS: {results.length}</span>
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
            GRID VIEW
          </button>
        </div>
      </div>

      {/* Content Rendering */}
      {loading ? (
        <div className="p-16 text-center font-bold text-xl">
          FILTERING CATALOGUE ITEMS...
        </div>
      ) : results.length === 0 ? (
        <div className="p-16 text-center font-bold text-xl border-b-4 border-black">
          NOTHING FOUND FOR THE SPECIFIED QUERY.
        </div>
      ) : viewMode === 'row' ? (
        <div>
          <div className="rw hh">
            <span>SKU</span>
            <span>ANIME TITLE</span>
            <span>STUDIO / SPEC</span>
            <span>RESOLUTION</span>
            <span>ACTION</span>
          </div>
          {results.map((item) => (
            <MediaCard key={item._id} media={item} viewMode="row" />
          ))}
        </div>
      ) : (
        <div className="bx4">
          {results.map((item) => (
            <MediaCard key={item._id} media={item} viewMode="box" />
          ))}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="p-20 text-center font-bold text-xl">
        LOADING CATALOGUE...
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
