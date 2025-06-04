
import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  signOut: () => Promise<void>;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        console.log("[DEBUG] Initializing auth...");
        
        // Get current session
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("[DEBUG] Error getting session:", error);
        } else {
          console.log("[DEBUG] Current session:", currentSession ? "Found" : "None");
        }

        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        console.log("[DEBUG] Auth initialized, user:", currentSession?.user?.id || "None");
      } catch (error) {
        console.error("[DEBUG] Exception in initAuth:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Real-time listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      console.log("[DEBUG] Auth state change:", event, newSession ? "Session exists" : "No session");
      setSession(newSession);
      setUser(newSession?.user ?? null);
    });

    initAuth();
    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      console.log("[DEBUG] Signing out...");
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      console.log("[DEBUG] Signed out successfully");
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  };

  const value = {
    session,
    user,
    signOut,
    isLoading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
