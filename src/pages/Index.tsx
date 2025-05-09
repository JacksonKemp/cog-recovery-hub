
import { Button } from "@/components/ui/button";
import { Link, Navigate } from "react-router-dom";
import { Brain, Activity, CheckCircle, Clock } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

const Index = () => {
  const { user, isLoading } = useAuth();
  
  // If user is logged in, redirect to dashboard
  if (!isLoading && user) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero section */}
      <section className="py-12 md:py-24 lg:py-32 flex flex-col items-center text-center">
        <div className="mb-4">
          <Brain className="h-16 w-16 text-cog-purple mx-auto" />
        </div>
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl mb-6">
          CogniCare
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground mb-8">
          Cognitive rehabilitation and tracking designed for TBI recovery.
          Play games, track symptoms, and manage daily tasks with ease.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild size="lg">
            <Link to="/auth">Get Started</Link>
          </Button>
        </div>
      </section>

      {/* Features section */}
      <section className="py-12 md:py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight">Features</h2>
          <p className="text-muted-foreground mt-4">
            Tools designed specifically for cognitive rehabilitation
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center p-4">
            <div className="rounded-full bg-primary/10 p-4 mb-4">
              <Brain className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Cognitive Games</h3>
            <p className="text-muted-foreground">
              Engage with memory, attention, and processing speed games
              designed to help with cognitive rehabilitation.
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-4">
            <div className="rounded-full bg-primary/10 p-4 mb-4">
              <Activity className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Symptom Tracking</h3>
            <p className="text-muted-foreground">
              Monitor your symptoms over time to better understand patterns
              and communicate with healthcare providers.
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-4">
            <div className="rounded-full bg-primary/10 p-4 mb-4">
              <CheckCircle className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Task Management</h3>
            <p className="text-muted-foreground">
              Keep track of daily tasks with reminders designed for those
              with memory challenges.
            </p>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-12 md:py-24 text-center">
        <div className="max-w-[800px] mx-auto">
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            Start Your Recovery Journey Today
          </h2>
          <p className="text-muted-foreground mb-8">
            Sign up for free and gain access to all features designed to assist with your
            cognitive rehabilitation journey.
          </p>
          <Button asChild size="lg">
            <Link to="/auth">Sign Up Now</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
