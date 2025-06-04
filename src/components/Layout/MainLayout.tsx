
import { Outlet, useLocation } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { useEffect } from "react";

export const MainLayout = () => {
  const location = useLocation();
  
  // Check if current route is a game/exercise route
  const isGameRoute = location.pathname.startsWith('/games/') && location.pathname !== '/games' && location.pathname !== '/games/progress';

  // Prevent bounce/overscroll effect on iOS
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.body.style.height = '100%';
    document.documentElement.style.overflow = 'hidden';
    document.documentElement.style.height = '100%';
    
    return () => {
      document.body.style.overflow = '';
      document.body.style.height = '';
      document.documentElement.style.overflow = '';
      document.documentElement.style.height = '';
    };
  }, []);

  if (isGameRoute) {
    // Full screen layout for games/exercises
    return (
      <div className="min-h-screen max-h-screen overflow-hidden">
        <main className="h-screen overflow-y-auto">
          <Outlet />
        </main>
      </div>
    );
  }

  // Normal layout with header and footer
  return (
    <div className="flex flex-col min-h-screen max-h-screen overflow-hidden pt-safe">
      <Header />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
