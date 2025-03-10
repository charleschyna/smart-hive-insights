
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart2, HelpCircle, Shield } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div className="container mx-auto px-4 pt-20 pb-16 sm:pt-32 sm:pb-24 lg:pt-40 lg:pb-32 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6 animate-slide-down">
            Smart Nyuki <span className="text-honey-500">Beekeeping</span> Insights
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mb-10 animate-slide-down animation-delay-100">
            Revolutionize your apiary management with real-time monitoring 
            and predictive analytics for healthier, more productive hives.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 animate-slide-up animation-delay-200">
            <Button asChild size="lg" className="bg-honey-500 hover:bg-honey-600 text-forest-900 font-medium">
              <Link to="/signup">Get Started <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/login">Login to Dashboard</Link>
            </Button>
          </div>
        </div>
        <div className="absolute inset-x-0 -bottom-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-bottom-80" aria-hidden="true">
          <div className="relative left-[calc(50%-20rem)] aspect-[1200/800] w-[40rem] -translate-x-1/2 bg-gradient-to-tr from-honey-300 to-forest-300 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[80rem]" style={{ clipPath: "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)" }}></div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Smart Hive Monitoring</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-background rounded-xl p-6 shadow-glass flex flex-col items-center text-center glass-card glass-card-hover">
              <div className="h-14 w-14 rounded-full bg-honey-100 flex items-center justify-center mb-6">
                <BarChart2 className="h-7 w-7 text-honey-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Real-time Analytics</h3>
              <p className="text-muted-foreground">Monitor weight, temperature, humidity, and sound frequencies to evaluate colony health and productivity.</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-background rounded-xl p-6 shadow-glass flex flex-col items-center text-center glass-card glass-card-hover">
              <div className="h-14 w-14 rounded-full bg-forest-100 flex items-center justify-center mb-6">
                <Shield className="h-7 w-7 text-forest-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Predictive Alerts</h3>
              <p className="text-muted-foreground">Receive instant notifications when metrics exceed thresholds, allowing for timely interventions.</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-background rounded-xl p-6 shadow-glass flex flex-col items-center text-center glass-card glass-card-hover">
              <div className="h-14 w-14 rounded-full bg-honey-100 flex items-center justify-center mb-6">
                <HelpCircle className="h-7 w-7 text-honey-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Apiary Management</h3>
              <p className="text-muted-foreground">Organize and track all your apiaries and hives in one place with our intuitive management system.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to enhance your beekeeping?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Join Smart Nyuki today and transform your apiary management with cutting-edge technology.
          </p>
          <Button asChild size="lg" className="bg-honey-500 hover:bg-honey-600 text-forest-900 font-medium">
            <Link to="/signup">Get Started Now</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-10">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">&copy; {new Date().getFullYear()} Smart Nyuki. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
