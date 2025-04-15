
import React from 'react';

const POSHeader: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row justify-between gap-4 md:items-center">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Point of Sale</h1>
        <p className="text-muted-foreground">
          Process sales transactions quickly and efficiently
        </p>
      </div>
    </div>
  );
};

export default POSHeader;
