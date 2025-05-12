
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="border-t bg-muted/40 mt-auto">
      <div className="container py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <Link to="/" className="flex items-center gap-2">
              <img 
                src="/lovable-uploads/501f50c1-99db-4a88-9997-b16406b1397b.png" 
                alt="Rewire Logo" 
                className="h-6" 
              />
              <span className="font-display font-bold">Rewire</span>
            </Link>
            <p className="text-sm text-muted-foreground mt-2">
              Supporting brain injury recovery through cognitive exercises and tracking
            </p>
          </div>
          
          <div className="flex flex-col items-center md:items-end mt-4 md:mt-0">
            <div className="flex gap-6">
              <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground">
                About
              </Link>
              <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground">
                Contact
              </Link>
              <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
                Privacy
              </Link>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              © {new Date().getFullYear()} Rewire. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
