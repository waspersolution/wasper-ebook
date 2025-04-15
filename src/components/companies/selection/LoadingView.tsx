
import React from 'react';

const LoadingView: React.FC = () => {
  return (
    <div className="text-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
      <p className="text-lg font-medium">Loading...</p>
    </div>
  );
};

export default LoadingView;
