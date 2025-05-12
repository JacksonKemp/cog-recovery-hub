
import { Button } from "@/components/ui/button";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";

const Index = () => {
  const { user, isLoading } = useAuth();
  
  // If user is logged in, redirect to dashboard
  if (!isLoading && user) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img 
            src="/lovable-uploads/de82e189-2f36-4299-aaa1-717b3e0d662e.png" 
            alt="Rewire Logo" 
            className="h-8" 
          />
          <span className="font-bold text-2xl">Rewire</span>
        </div>
        <button className="border border-blue-500 rounded-lg p-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-menu"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
        </button>
      </header>

      {/* Hero section */}
      <section className="flex-grow bg-green-50 px-6 py-12 flex flex-col">
        <h1 className="text-5xl font-bold mb-2">
          Recovery at <span className="text-teal-400">your pace</span>
        </h1>
        <p className="text-gray-600 text-xl mb-12">
          Customized cognitive rehabilitation for traumatic brain injury recovery with games, task management, and symptom tracking.
        </p>
        <div className="flex flex-col gap-4 w-full max-w-md">
          <Button asChild className="bg-teal-400 hover:bg-teal-500 text-xl py-6 w-full">
            <Link to="/auth">Get Started</Link>
          </Button>
          <Button asChild variant="outline" className="bg-white text-black border border-gray-300 text-xl py-6 w-full">
            <Link to="#">Learn More</Link>
          </Button>
        </div>

        <div className="mt-12 flex justify-center">
          <div className="relative w-64 h-64">
            <div className="absolute inset-0 rounded-full border-16 border-teal-400"></div>
            <div className="absolute top-0 right-0 w-16 h-16 bg-blue-100 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-12 px-6">
        <div className="flex items-center gap-2 mb-4">
          <img 
            src="/lovable-uploads/de82e189-2f36-4299-aaa1-717b3e0d662e.png" 
            alt="Rewire Logo" 
            className="h-6" 
          />
          <span className="font-bold text-xl">Rewire</span>
        </div>
        <p className="text-gray-600 mb-8">
          Supporting brain injury recovery through cognitive exercises and tracking
        </p>
        <div className="flex justify-center gap-8 mb-6">
          <Link to="#" className="text-gray-600">About</Link>
          <Link to="#" className="text-gray-600">Contact</Link>
          <Link to="#" className="text-gray-600">Privacy</Link>
        </div>
        <p className="text-center text-gray-500 text-sm">
          © 2025 Rewire. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Index;
