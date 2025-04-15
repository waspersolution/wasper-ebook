
import React from 'react';
import { Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';
import { useAuth } from '@/hooks/useAuth';
import { ContextRequiredProvider } from '@/contexts/ContextRequiredProvider';

interface LayoutProps {
  children: React.ReactNode;
  requireContext?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, requireContext = false }) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = React.useState(false);
  const { user, loading } = useAuth();

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  // Redirect to login if not authenticated
  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" />;
  }

  return (
    <ContextRequiredProvider requireContext={requireContext}>
      <div className="flex min-h-screen bg-background">
        <Sidebar 
          isMobileOpen={isMobileSidebarOpen} 
          toggleMobileSidebar={toggleMobileSidebar} 
        />
        
        <div className="flex-1 flex flex-col md:ml-64">
          <Header 
            toggleMobileSidebar={toggleMobileSidebar}
            user={user}
          />
          
          <main className="flex-1 p-4 md:p-6 overflow-y-auto">
            {children}
          </main>
          
          <Footer />
        </div>
      </div>
    </ContextRequiredProvider>
  );
};

export default Layout;
