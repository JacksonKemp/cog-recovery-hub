
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Brain, CheckSquare, Clock, Activity } from "lucide-react";

const Index = () => {
  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)]">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-cog-light-teal to-white py-16 md:py-24">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="md:w-1/2 space-y-6 animate-fade-in">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
                Recovery at <span className="text-cog-teal">your pace</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground">
                Customized cognitive rehabilitation for traumatic brain injury recovery with games, 
                task management, and symptom tracking.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="font-medium">
                  <Link to="/dashboard">Get Started</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="font-medium">
                  <Link to="/about">Learn More</Link>
                </Button>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative w-64 h-64 md:w-80 md:h-80 bg-cog-teal rounded-full flex items-center justify-center animate-pulse-gentle">
                <div className="w-48 h-48 md:w-60 md:h-60 bg-cog-light-teal rounded-full flex items-center justify-center">
                  <div className="w-32 h-32 md:w-40 md:h-40 bg-white rounded-full"></div>
                </div>
                <div className="absolute top-0 right-0 w-16 h-16 bg-cog-soft-blue rounded-full"></div>
                <div className="absolute bottom-10 left-0 w-10 h-10 bg-cog-soft-blue rounded-full"></div>
                <div className="absolute bottom-20 right-5 w-6 h-6 bg-cog-soft-blue rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-cog-soft-gray">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How Rewire Helps</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our comprehensive tools are designed to support your cognitive rehabilitation journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="feature-card">
              <div className="mb-4 w-12 h-12 rounded-full bg-cog-light-teal flex items-center justify-center">
                <Brain className="h-6 w-6 text-cog-teal" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Cognitive Games</h3>
              <p className="text-muted-foreground">
                Fun, interactive exercises designed to improve memory, attention, and processing speed.
              </p>
            </div>

            <div className="feature-card">
              <div className="mb-4 w-12 h-12 rounded-full bg-cog-light-teal flex items-center justify-center">
                <CheckSquare className="h-6 w-6 text-cog-teal" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Task Manager</h3>
              <p className="text-muted-foreground">
                Simple tools to organize your daily activities and maintain independence.
              </p>
            </div>

            <div className="feature-card">
              <div className="mb-4 w-12 h-12 rounded-full bg-cog-light-teal flex items-center justify-center">
                <Activity className="h-6 w-6 text-cog-teal" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Symptom Tracker</h3>
              <p className="text-muted-foreground">
                Monitor your symptoms over time and identify patterns to share with healthcare providers.
              </p>
            </div>

            <div className="feature-card">
              <div className="mb-4 w-12 h-12 rounded-full bg-cog-light-teal flex items-center justify-center">
                <Clock className="h-6 w-6 text-cog-teal" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Progress Insights</h3>
              <p className="text-muted-foreground">
                Track your rehabilitation journey with clear, visual representations of your progress.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Your Recovery Journey?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join Rewire today and take the first step towards cognitive rehabilitation.
            </p>
            <Button asChild size="lg" className="font-medium">
              <Link to="/dashboard">Get Started Now</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
