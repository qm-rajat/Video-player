import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import ReactPlayer from 'react-player';
import { fetchMediaById, selectCurrentMedia, selectMediaLoading, likeMedia } from '../../store/slices/mediaSlice';
import LoadingSpinner from '../../components/UI/LoadingSpinner';

const MediaView = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const media = useSelector(selectCurrentMedia);
  const isLoading = useSelector(selectMediaLoading);

  useEffect(() => {
    if (id) {
      dispatch(fetchMediaById(id));
    }
  }, [id, dispatch]);

  const handleLike = () => {
    if (media?._id) {
      dispatch(likeMedia(media._id));
    }
  };

  if (isLoading && !media) {
    return (
      <div className="flex justify-center py-20">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  const videoSource = media?.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

  return (
    <>
      <Helmet>
        <title>{media?.title ? `${media.title} - Video Player` : 'Watch Video - Video Player'}</title>
        <meta name="description" content={media?.description || 'Watch stream in high quality.'} />
      </Helmet>

      <div className="max-w-5xl mx-auto space-y-6">
        <Link to="/" className="inline-flex items-center text-sm text-primary-400 hover:text-primary-300">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </Link>

        {/* Video Player */}
        <div className="relative rounded-2xl overflow-hidden bg-black aspect-video shadow-2xl border border-dark-700">
          <ReactPlayer
            url={videoSource}
            controls
            playing
            width="100%"
            height="100%"
            light={media?.thumbnailUrl || false}
          />
        </div>

        {/* Media Details */}
        <div className="bg-dark-800 rounded-xl p-6 border border-dark-700 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">{media?.title || 'Video Stream'}</h1>
              <div className="flex items-center space-x-4 text-sm text-dark-300">
                <span>{media?.views || 1} views</span>
                <span>•</span>
                <span className="capitalize">{media?.category || 'general'}</span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleLike}
                className="btn btn-secondary flex items-center space-x-2 text-sm"
              >
                <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
                <span>{media?.likeCount || 0} Likes</span>
              </button>
            </div>
          </div>

          {/* Creator Profile */}
          <div className="flex items-center space-x-3 pt-4 border-t border-dark-700">
            <img
              src={media?.creator?.profile?.avatar || 'https://picsum.photos/seed/creator/100/100'}
              alt={media?.creator?.username || 'Creator'}
              className="w-10 h-10 rounded-full object-cover border border-dark-600"
            />
            <div>
              <p className="font-semibold text-white">{media?.creator?.username || 'Verified Creator'}</p>
              <p className="text-xs text-dark-400">Content Creator</p>
            </div>
          </div>

          {/* Description */}
          {media?.description && (
            <p className="text-dark-200 text-sm leading-relaxed pt-2">
              {media.description}
            </p>
          )}

          {/* Tags */}
          {media?.tags && media.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {media.tags.map((tag, idx) => (
                <span key={idx} className="bg-dark-700 text-dark-300 text-xs px-2.5 py-1 rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MediaView;