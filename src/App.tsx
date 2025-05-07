
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

function App() {
  // Create a client inside the component to ensure it's properly initialized
  const [queryClient] = React.useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/games" element={<CognitiveGames />} />
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
              
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
