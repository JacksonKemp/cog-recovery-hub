
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "./components/Layout/MainLayout";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import CognitiveGames from "./pages/CognitiveGames";
import TaskManager from "./pages/TaskManager";
import SymptomTracker from "./pages/SymptomTracker";
import NotFound from "./pages/NotFound";
import * as React from "react";
import { initializeReminders } from "./utils/reminderUtils";
import GameProgress from "./pages/GameProgress";
import Auth from "./pages/Auth";
import { AuthProvider } from "./hooks/use-auth";
import { ProtectedRoute } from "./components/ProtectedRoute";

// Game imports
import NumbersGame from "./pages/games/NumbersGame";
import NamesGame from "./pages/games/NamesGame";
import FacesGame from "./pages/games/FacesGame";
import RGBGame from "./pages/games/RGBGame";
import WordFinderGame from "./pages/games/WordFinderGame";
import IdentificationGame from "./pages/games/IdentificationGame";
import ThenWhatGame from "./pages/games/ThenWhatGame";
import WordSearchesGame from "./pages/games/WordSearchesGame";
import SudokuGame from "./pages/games/SudokuGame";
import MemoryMatchGame from "./pages/games/MemoryMatch";

function App() {
  // Create a client inside the component to ensure it's properly initialized
  const [queryClient] = React.useState(() => new QueryClient());

  // Request notification permission and initialize reminders when app loads
  React.useEffect(() => {
    // Request notification permission
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        console.log("Notification permission status:", permission);
      });
    }
    
    // Initialize reminders from sessionStorage
    initializeReminders();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/" element={<Index />} />
              
              {/* Protected routes */}
              <Route element={<ProtectedRoute />}>
                <Route element={<MainLayout />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/games" element={<CognitiveGames />} />
                  <Route path="/games/progress" element={<GameProgress />} />
                  <Route path="/tasks" element={<TaskManager />} />
                  <Route path="/symptoms" element={<SymptomTracker />} />
                  
                  {/* Game routes */}
                  <Route path="/games/numbers" element={<NumbersGame />} />
                  <Route path="/games/names" element={<NamesGame />} />
                  <Route path="/games/faces" element={<FacesGame />} />
                  <Route path="/games/rgb" element={<RGBGame />} />
                  <Route path="/games/word-finder" element={<WordFinderGame />} />
                  <Route path="/games/identification" element={<IdentificationGame />} />
                  <Route path="/games/then-what" element={<ThenWhatGame />} />
                  <Route path="/games/word-searches" element={<WordSearchesGame />} />
                  <Route path="/games/sudoku" element={<SudokuGame />} />
                  <Route path="/games/memory-match" element={<MemoryMatchGame />} />
                </Route>
              </Route>
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
