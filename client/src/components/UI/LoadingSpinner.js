import React from 'react';
import classNames from 'classnames';

const LoadingSpinner = ({ size = 'medium', className = '' }) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-6 h-6',
    large: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  return (
    <div className={classNames('flex items-center justify-center', className)}>
      <div
        className={classNames(
          'animate-spin rounded-full border-2 border-gray-300 border-t-primary-600',
          sizeClasses[size]
        )}
      />
    </div>
  );
};

export default LoadingSpinner;