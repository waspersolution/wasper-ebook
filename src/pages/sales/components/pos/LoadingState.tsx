
import React from 'react';
import Layout from '@/components/layout/Layout';

const LoadingState: React.FC = () => {
  return (
    <Layout>
      <div className="flex items-center justify-center h-[70vh]">
        <div className="text-center">
          <p className="text-muted-foreground mb-2">Loading POS data...</p>
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
        </div>
      </div>
    </Layout>
  );
};

export default LoadingState;
