import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { likeMedia, unlikeMedia, addToFavorites, removeFromFavorites } from '../../store/slices/mediaSlice';
import { selectUser } from '../../store/slices/authSlice';
import { formatDistanceToNow } from 'date-fns';

const MediaCard = ({ media }) => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const [isLiked, setIsLiked] = useState(
    media.likes?.some(like => like.user === user?._id) || false
  );
  const [isFavorited, setIsFavorited] = useState(
    user?.favorites?.includes(media._id) || false
  );
  const [likeCount, setLikeCount] = useState(media.likeCount || media.likes?.length || 0);

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isLiked) {
      const result = await dispatch(unlikeMedia(media._id));
      if (result.type === 'media/unlikeMedia/fulfilled') {
        setIsLiked(false);
        setLikeCount(result.payload.likeCount);
      }
    } else {
      const result = await dispatch(likeMedia(media._id));
      if (result.type === 'media/likeMedia/fulfilled') {
        setIsLiked(true);
        setLikeCount(result.payload.likeCount);
      }
    }
  };

  const handleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isFavorited) {
      const result = await dispatch(removeFromFavorites(media._id));
      if (result.type === 'media/removeFromFavorites/fulfilled') {
        setIsFavorited(false);
      }
    } else {
      const result = await dispatch(addToFavorites(media._id));
      if (result.type === 'media/addToFavorites/fulfilled') {
        setIsFavorited(true);
      }
    }
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="group relative bg-dark-800 rounded-lg overflow-hidden card-hover">
      <Link to={`/media/${media._id}`} className="block">
        {/* Thumbnail */}
        <div className="relative aspect-video bg-dark-700 overflow-hidden">
          <img
            src={media.thumbnailUrl}
            alt={media.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300" />
          
          {/* Duration */}
          {media.duration && (
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
              {formatDuration(media.duration)}
            </div>
          )}
          
          {/* Premium badge */}
          {media.isPremium && (
            <div className="absolute top-2 left-2 bg-gradient-primary text-white text-xs font-bold px-2 py-1 rounded">
              PREMIUM
            </div>
          )}
          
          {/* Play button overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-4">
          <h3 className="text-white font-medium text-sm mb-2 line-clamp-2 group-hover:text-primary-400 transition-colors">
            {media.title}
          </h3>
          
          {/* Creator info */}
          <div className="flex items-center space-x-2 mb-3">
            <img
              src={media.creator?.profile?.avatar || '/default-avatar.png'}
              alt={media.creator?.username}
              className="w-6 h-6 rounded-full"
            />
            <span className="text-dark-300 text-xs">
              {media.creator?.username}
              {media.creator?.isVerified && (
                <svg className="w-3 h-3 text-primary-400 inline ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              )}
            </span>
          </div>
          
          {/* Stats */}
          <div className="flex items-center justify-between text-xs text-dark-400">
            <div className="flex items-center space-x-3">
              <span className="flex items-center">
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {media.views || 0}
              </span>
              <span className="flex items-center">
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {likeCount}
              </span>
            </div>
            <span>
              {formatDistanceToNow(new Date(media.createdAt), { addSuffix: true })}
            </span>
          </div>
        </div>
      </Link>
      
      {/* Action buttons */}
      <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button
          onClick={handleLike}
          className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
            isLiked 
              ? 'bg-primary-600 text-white' 
              : 'bg-black bg-opacity-50 text-white hover:bg-primary-600'
          }`}
        >
          <svg className="w-4 h-4" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
        
        <button
          onClick={handleFavorite}
          className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
            isFavorited 
              ? 'bg-yellow-600 text-white' 
              : 'bg-black bg-opacity-50 text-white hover:bg-yellow-600'
          }`}
        >
          <svg className="w-4 h-4" fill={isFavorited ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default MediaCard;