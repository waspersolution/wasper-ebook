
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FileSearch, Home, LogIn, HelpCircle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center max-w-md p-6">
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center">
            <FileSearch size={48} className="text-muted-foreground" />
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-2">404</h1>
        <p className="text-xl text-muted-foreground mb-6">
          We couldn't find the page you're looking for. It might have been moved or deleted.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button asChild className="px-6 gap-2 w-full">
            <Link to="/">
              <Home className="h-4 w-4" />
              Home
            </Link>
          </Button>
          
          <Button asChild variant="outline" className="px-6 gap-2 w-full">
            <Link to="/auth">
              <LogIn className="h-4 w-4" />
              Login
            </Link>
          </Button>
          
          <Button asChild variant="secondary" className="px-6 gap-2 w-full md:col-span-2">
            <a href="mailto:support@wasper.com">
              <HelpCircle className="h-4 w-4" />
              Contact Support
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
