
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Sun, Search, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

const Index: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  return (
    <div className="space-y-12 pb-8">
      {/* Hero Section */}
      <section className="pt-10 md:pt-16">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="animate-fade-up text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            <span className="bg-gradient-to-r from-yellow-500 via-orange-500 to-amber-500 bg-clip-text text-transparent">
              Solar Radiation Analysis
            </span>
          </h1>
          <p className="mt-6 animate-fade-up text-lg text-gray-600 animation-delay-200">
            Analyze solar potential, visualize radiation data, and find optimal
            locations for solar installations across India.
          </p>
          <div className="mt-8 flex animate-fade-up flex-col items-center gap-4 animation-delay-300 sm:flex-row sm:justify-center">
            <Link to="/signup">
              <Button className="w-full sm:w-auto">Get Started</Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" className="w-full sm:w-auto">
                Log In
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Search Section */}
      <section className="mx-auto max-w-3xl">
        <div className="rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 p-6 shadow-md sm:p-8">
          <div className="text-center">
            <h2 className="animate-fade-up text-2xl font-bold tracking-tight text-gray-900">
              Find Solar Potential for Any Location
            </h2>
            <p className="mt-2 animate-fade-up text-gray-600 animation-delay-100">
              Enter a city or district in India to analyze solar radiation data
            </p>
          </div>
          <div className="mt-6 animate-fade-up animation-delay-200">
            <div className="flex overflow-hidden rounded-lg shadow-sm">
              <Input
                className="flex-1 border-0 focus-visible:ring-0"
                placeholder="Search for a location (e.g., Mumbai, Delhi, Jaipur)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button className="rounded-l-none">
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
            </div>
          </div>
          <div className="mt-4 flex animate-fade-up flex-wrap items-center justify-center gap-2 text-xs text-gray-500 animation-delay-300">
            <span>Popular:</span>
            <Button variant="ghost" size="sm" onClick={() => setSearchQuery("New Delhi")}>
              New Delhi
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setSearchQuery("Mumbai")}>
              Mumbai
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setSearchQuery("Chennai")}>
              Chennai
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setSearchQuery("Jaipur")}>
              Jaipur
            </Button>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="animate-fade-up animation-delay-400">
        <h2 className="mb-8 text-center text-3xl font-bold">
          Why Analyze Solar Potential?
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="overflow-hidden border-b-4 border-b-blue-500 transition-all hover:shadow-md">
            <CardContent className="p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-500">
                <Sun className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-bold">Maximize Efficiency</h3>
              <p className="text-gray-600">
                Find the ideal placement and angle for your solar panels to
                maximize energy production.
              </p>
            </CardContent>
          </Card>
          
          <Card className="overflow-hidden border-b-4 border-b-green-500 transition-all hover:shadow-md">
            <CardContent className="p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2a10 10 0 1 0 10 10H12V2Z" />
                  <path d="M20 12a8 8 0 1 0-16 0" />
                  <path d="M12 12v-8" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-bold">Data-Driven Decisions</h3>
              <p className="text-gray-600">
                Make informed decisions based on historical and real-time solar
                radiation data.
              </p>
            </CardContent>
          </Card>
          
          <Card className="overflow-hidden border-b-4 border-b-amber-500 transition-all hover:shadow-md">
            <CardContent className="p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="18" height="10" x="3" y="11" rx="2" />
                  <circle cx="12" cy="5" r="2" />
                  <path d="M12 7v4" />
                  <line x1="8" x2="8" y1="16" y2="16" />
                  <line x1="16" x2="16" y1="16" y2="16" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-bold">ROI Calculation</h3>
              <p className="text-gray-600">
                Calculate potential return on investment and energy savings for
                your solar installations.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
      
      {/* Getting Started Section */}
      <section className="animate-fade-up rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white animation-delay-500">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div>
            <h2 className="text-2xl font-bold">Ready to analyze your location?</h2>
            <p className="mt-2 max-w-lg text-blue-100">
              Create an account to save your searches, generate reports, and
              receive personalized solar recommendations.
            </p>
          </div>
          <Link to="/signup">
            <Button variant="secondary" className="group min-w-[160px]">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </section>
      
      {/* Add animation styles */}
      <style jsx>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-up {
          animation: fadeUp 0.6s ease-out forwards;
          opacity: 0;
        }
        
        .animation-delay-100 {
          animation-delay: 0.1s;
        }
        
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        
        .animation-delay-300 {
          animation-delay: 0.3s;
        }
        
        .animation-delay-400 {
          animation-delay: 0.4s;
        }
        
        .animation-delay-500 {
          animation-delay: 0.5s;
        }
      `}</style>
    </div>
  );
};

export default Index;
