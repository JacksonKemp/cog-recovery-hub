
import { ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, HelpCircle } from "lucide-react";

interface GameLayoutProps {
  title: string;
  children: ReactNode;
  backLink?: string;
}

const GameLayout = ({ title, children, backLink = "/games" }: GameLayoutProps) => {
  const [showHelp, setShowHelp] = useState(false);
  
  return (
    <div className="min-h-screen bg-background">
      <div className="container py-4 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Button variant="ghost" size="sm" asChild className="mr-2">
              <Link to={backLink}>
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Link>
            </Button>
            <h1 className="text-2xl md:text-3xl font-bold">{title}</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowHelp(!showHelp)}
              className="flex items-center gap-1"
            >
              <HelpCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Help</span>
            </Button>
          </div>
        </div>
        
        <div className="bg-card rounded-lg shadow-sm border p-4 md:p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default GameLayout;
