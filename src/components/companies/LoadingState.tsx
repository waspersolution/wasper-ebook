
import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-64 space-y-4">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      <div className="text-center">
        <p className="text-lg font-medium">Loading your companies...</p>
        <p className="text-sm text-muted-foreground">Please wait while we retrieve your available companies.</p>
      </div>
    </div>
  );
};

export default LoadingState;
