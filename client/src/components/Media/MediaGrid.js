import React from 'react';
import MediaCard from './MediaCard';

const MediaGrid = ({ media, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-dark-700 aspect-video rounded-lg mb-3"></div>
            <div className="space-y-2">
              <div className="h-4 bg-dark-700 rounded w-3/4"></div>
              <div className="h-3 bg-dark-700 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!media || media.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-dark-700 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 011 1v1a1 1 0 01-1 1H3a1 1 0 01-1-1V5a1 1 0 011-1h4zM3 7v12a2 2 0 002 2h14a2 2 0 002-2V7H3z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-white mb-2">No content found</h3>
        <p className="text-dark-400">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {media.map((item) => (
        <MediaCard key={item._id} media={item} />
      ))}
    </div>
  );
};

export default MediaGrid;