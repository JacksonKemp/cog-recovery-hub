import { Link } from "react-router-dom";
import { Menu, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const Header = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully");
      navigate("/");
    } catch (error) {
      toast.error("Error signing out");
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-2 font-semibold">
          <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/de82e189-2f36-4299-aaa1-717b3e0d662e.png" 
              alt="Rewire Logo" 
              className="h-6" 
            />
            <span className="hidden md:block">Rewire</span>
          </Link>
        </div>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {user ? (
            <>
              <Link to="/dashboard" className="text-sm font-medium transition-colors hover:text-foreground/80">Dashboard</Link>
              <Link to="/games" className="text-sm font-medium transition-colors hover:text-foreground/80">Games</Link>
              <Link to="/tasks" className="text-sm font-medium transition-colors hover:text-foreground/80">Tasks</Link>
              <Link to="/symptoms" className="text-sm font-medium transition-colors hover:text-foreground/80">Symptoms</Link>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem disabled>
                    {user.email}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut}>
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button asChild size="sm">
              <Link to="/auth">Sign In</Link>
            </Button>
          )}
        </nav>

        {/* Mobile navigation */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <div className="grid gap-4 py-4">
              <Link to="/" className="flex items-center gap-2 font-semibold px-2">
                <img 
                  src="/lovable-uploads/de82e189-2f36-4299-aaa1-717b3e0d662e.png" 
                  alt="Rewire Logo" 
                  className="h-6" 
                />
                <span>Rewire</span>
              </Link>
              <div className="flex flex-col space-y-2">
                {user ? (
                  <>
                    <Link to="/dashboard" className="px-2 py-1 hover:bg-accent rounded-md">Dashboard</Link>
                    <Link to="/games" className="px-2 py-1 hover:bg-accent rounded-md">Games</Link>
                    <Link to="/tasks" className="px-2 py-1 hover:bg-accent rounded-md">Tasks</Link>
                    <Link to="/symptoms" className="px-2 py-1 hover:bg-accent rounded-md">Symptoms</Link>
                    <div className="border-t my-2"></div>
                    <div className="px-2 py-1 text-sm text-muted-foreground">{user.email}</div>
                    <button 
                      onClick={handleSignOut}
                      className="px-2 py-1 hover:bg-accent rounded-md text-left"
                    >
                      Sign out
                    </button>
                  </>
                ) : (
                  <Button asChild size="sm" className="mt-2">
                    <Link to="/auth">Sign In</Link>
                  </Button>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};
