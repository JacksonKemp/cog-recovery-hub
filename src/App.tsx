
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "./components/Layout/MainLayout";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import CognitiveGames from "./pages/CognitiveGames";
import MemoryMatch from "./pages/games/MemoryMatch";
import TaskManager from "./pages/TaskManager";
import SymptomTracker from "./pages/SymptomTracker";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
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
            <Route path="/games/memory-match" element={<MemoryMatch />} />
            <Route path="/tasks" element={<TaskManager />} />
            <Route path="/symptoms" element={<SymptomTracker />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
