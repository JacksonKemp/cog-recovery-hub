
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface GameLayoutProps {
  title: string;
  children: ReactNode;
  backLink?: string;
}

const GameLayout = ({ title, children, backLink = "/games" }: GameLayoutProps) => {
  return (
    <div className="container py-8 max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" asChild className="mr-2">
          <Link to={backLink}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">{title}</h1>
      </div>
      
      <div className="bg-card rounded-lg shadow-sm border p-6">
        {children}
      </div>
    </div>
  );
};

export default GameLayout;
