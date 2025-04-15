
import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-background border-t border-border py-4 px-6 text-sm text-muted-foreground">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div>
          &copy; {currentYear} WASPER Retail Nexus. All rights reserved.
        </div>
        <div className="mt-2 md:mt-0">
          <span>Version 1.0.0</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
