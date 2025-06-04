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
      // 1️⃣ Fetch any saved session
      const { data: { session: currentSession } } =
        await supabase.auth.getSession();

      setSession(currentSession);
      setUser(currentSession?.user ?? null);

      // 2️⃣ Inject the session into Supabase's in-memory store
      if (currentSession) {
        const { access_token, refresh_token } = currentSession;
        await supabase.auth.setSession({ access_token, refresh_token });
        console.log("[DEBUG] Session injected into memory");
      }

      setIsLoading(false);
    };

    // Real-time listener
    const { data: { subscription } } =
      supabase.auth.onAuthStateChange((_event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);

        if (newSession) {
          const { access_token, refresh_token } = newSession;
          supabase.auth.setSession({ access_token, refresh_token });
        }
      });

    initAuth();
    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      // Clear Supabase's in-memory session
      await supabase.auth.setSession(null);
      // Sign out from Supabase
      await supabase.auth.signOut();
      // Clear local state
      setUser(null);
      setSession(null);
      console.log("[DEBUG] Signed out and cleared session");
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
