import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Sun, Search, Download, ArrowRight, Star, FileBarChart, MapPin, Building, BarChart2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import indiaLocations from "@/data/indiaLocations";
import SavedLocations from "@/components/SavedLocations";

interface LocationData {
  id: string;
  name: string;
  state: string;
  ghi: number;
  dni: number;
  latitude: number;
  longitude: number;
  solarScore: number;
  district?: string;
  sector?: string;
  capacityMW?: number;
  generationMWh?: number;
}

const getSolarScoreLabel = (score: number) => {
  if (score >= 80) return { label: "Excellent", color: "text-green-600" };
  if (score >= 70) return { label: "Very Good", color: "text-green-500" };
  if (score >= 60) return { label: "Good", color: "text-blue-500" };
  if (score >= 50) return { label: "Moderate", color: "text-yellow-500" };
  if (score >= 40) return { label: "Fair", color: "text-orange-500" };
  return { label: "Poor", color: "text-red-500" };
};

const LocationDetails = ({ location, onSaveLocation }: { 
  location: LocationData, 
  onSaveLocation: (location: LocationData) => void 
}) => {
  const score = getSolarScoreLabel(location.solarScore);
  const navigate = useNavigate();
  
  const downloadData = () => {
    const jsonData = JSON.stringify(location, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${location.name.replace(/\s+/g, '_')}_solar_data.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Data downloaded successfully",
      description: `Solar data for ${location.name} has been downloaded as JSON`,
    });
  };
  
  const monthlyData = [
    { month: "Jan", ghi: Math.round(location.ghi * 0.7) },
    { month: "Feb", ghi: Math.round(location.ghi * 0.8) },
    { month: "Mar", ghi: Math.round(location.ghi * 0.9) },
    { month: "Apr", ghi: Math.round(location.ghi * 1.1) },
    { month: "May", ghi: Math.round(location.ghi * 1.2) },
    { month: "Jun", ghi: Math.round(location.ghi * 0.8) },
    { month: "Jul", ghi: Math.round(location.ghi * 0.7) },
    { month: "Aug", ghi: Math.round(location.ghi * 0.7) },
    { month: "Sep", ghi: Math.round(location.ghi * 0.8) },
    { month: "Oct", ghi: Math.round(location.ghi * 0.9) },
    { month: "Nov", ghi: Math.round(location.ghi * 0.8) },
    { month: "Dec", ghi: Math.round(location.ghi * 0.7) },
  ];
  
  return (
    <div className="animate-fade-in space-y-6 rounded-lg border p-6 mt-4 bg-white shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold">{location.name}</h2>
          <p className="text-gray-500">{location.state}{location.district ? `, ${location.district}` : ''}</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => onSaveLocation(location)}
          >
            <Star className="h-4 w-4 text-yellow-500" />
            Save Location
          </Button>
          <Button
            variant="outline" 
            className="flex items-center gap-2"
            onClick={downloadData}
          >
            <Download className="h-4 w-4" />
            Download Data
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">GHI (Global Horizontal Irradiance)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{location.ghi} kWh/m²/day</div>
            <p className="text-xs text-gray-500">Annual average</p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">DNI (Direct Normal Irradiance)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{location.dni} kWh/m²/day</div>
            <p className="text-xs text-gray-500">Annual average</p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Solar Suitability Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{location.solarScore}/100</div>
            <p className={`text-sm ${score.color}`}>{score.label}</p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Coordinates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">
              {location.latitude.toFixed(4)}°, {location.longitude.toFixed(4)}°
            </div>
            <p className="text-xs text-gray-500">Latitude, Longitude</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-6">
        <h3 className="mb-4 text-lg font-semibold">Monthly Solar Radiation</h3>
        <div className="h-64 w-full">
          <div className="flex h-full items-end">
            {monthlyData.map((data) => (
              <div key={data.month} className="group flex flex-1 flex-col items-center">
                <div className="relative w-full">
                  <div 
                    className="mx-auto w-full bg-yellow-500 transition-all duration-300 group-hover:bg-yellow-400 rounded-t-sm"
                    style={{ height: `${(data.ghi / location.ghi) * 150}px` }}
                  ></div>
                  <div className="absolute bottom-0 left-0 right-0 mx-auto hidden w-full max-w-xs -translate-y-2 rounded bg-black bg-opacity-80 p-1 text-center text-xs text-white group-hover:block">
                    {data.ghi} kWh/m²/day
                  </div>
                </div>
                <span className="mt-2 text-xs">{data.month}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="mt-6 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 p-6">
        <h3 className="text-lg font-semibold text-blue-700">Recommendations</h3>
        <p className="mt-2 text-sm text-blue-700">
          {score.label === "Excellent" || score.label === "Very Good" ? (
            "This location has exceptional solar potential. Highly recommended for both commercial and residential solar installations."
          ) : score.label === "Good" ? (
            "Good solar potential. Suitable for most solar installations with proper positioning."
          ) : score.label === "Moderate" ? (
            "Moderate solar potential. Consider optimizing panel angle and using high-efficiency panels."
          ) : (
            "Limited solar potential. May require larger installation area and careful planning for economic viability."
          )}
        </p>
        
        {location.capacityMW && location.generationMWh && (
          <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm font-semibold text-blue-700">Potential Capacity</p>
              <p className="text-sm text-blue-700">{location.capacityMW.toLocaleString()} MW</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-blue-700">Annual Generation</p>
              <p className="text-sm text-blue-700">{location.generationMWh.toLocaleString()} MWh/year</p>
            </div>
          </div>
        )}
        
        <Button 
          className="mt-4 flex items-center gap-2 bg-blue-600 hover:bg-blue-700" 
          size="sm"
          onClick={() => navigate("/live-data")}
        >
          View Detailed Report
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);
  const [savedLocations, setSavedLocations] = useState<LocationData[]>([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    const saved = localStorage.getItem("savedLocations");
    if (saved) {
      try {
        setSavedLocations(JSON.parse(saved));
      } catch (e) {
        console.error("Error loading saved locations:", e);
      }
    }
  }, []);
  
  const saveLocation = (location: LocationData) => {
    if (savedLocations.some(loc => loc.id === location.id)) {
      toast({
        title: "Already saved",
        description: `${location.name} is already in your saved locations`,
      });
      return;
    }
    
    const updatedLocations = [...savedLocations, location];
    setSavedLocations(updatedLocations);
    localStorage.setItem("savedLocations", JSON.stringify(updatedLocations));
    
    toast({
      title: "Location saved",
      description: `${location.name} has been added to your saved locations`,
    });
  };
  
  const removeLocation = (locationId: string) => {
    const updatedLocations = savedLocations.filter(loc => loc.id !== locationId);
    setSavedLocations(updatedLocations);
    localStorage.setItem("savedLocations", JSON.stringify(updatedLocations));
    
    toast({
      title: "Location removed",
      description: "The location has been removed from your saved locations",
    });
  };
  
  const selectSavedLocation = (locationId: string) => {
    const location = indiaLocations.find(loc => loc.id === locationId);
    if (location) {
      setSelectedLocation(location);
    }
  };

  const handleSearch = () => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) {
      toast({
        title: "Search query is empty",
        description: "Please enter a location to search",
        variant: "destructive",
      });
      return;
    }
    
    const result = indiaLocations.find(
      (loc) => 
        loc.name.toLowerCase().includes(query) || 
        loc.state.toLowerCase().includes(query) ||
        (loc.district && loc.district.toLowerCase().includes(query))
    );
    
    if (result) {
      setSelectedLocation(result);
    } else {
      toast({
        title: "Location not found",
        description: "Try another location or check spelling",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div>
      <style>
        {`
        .solar-gradient {
          background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
        }
        `}
      </style>
      <div className="solar-gradient rounded-lg py-12 text-white shadow-lg">
        <div className="container mx-auto px-6">
          <div className="flex items-center space-x-4">
            <Sun className="h-12 w-12 text-yellow-300" />
            <h1 className="text-3xl font-bold sm:text-4xl">Solar Radiation Analysis</h1>
          </div>
          <p className="mt-4 max-w-2xl text-blue-100">
            Analyze solar radiation potential across India. Find the best locations
            for solar installations based on GHI, DNI, and other critical factors.
          </p>
          
          <div className="mt-8 flex max-w-md flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                className="pl-10 text-black"
                placeholder="Search any location in India..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <Button onClick={handleSearch}>Analyze</Button>
          </div>
          
          <div className="mt-6 flex flex-wrap gap-2">
            {["Delhi", "Mumbai", "Chennai", "Rajasthan", "Gujarat", "Indore"].map((suggestion) => (
              <Button 
                key={suggestion}
                variant="outline" 
                className="border-blue-300 bg-blue-900 bg-opacity-30 text-blue-50 hover:bg-blue-800"
                onClick={() => {
                  setSearchQuery(suggestion);
                  const result = indiaLocations.find(
                    (loc) => loc.name === suggestion || loc.state === suggestion || 
                            (loc.district && loc.district === suggestion)
                  );
                  if (result) {
                    setSelectedLocation(result);
                  }
                }}
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            {selectedLocation ? (
              <LocationDetails 
                location={selectedLocation} 
                onSaveLocation={saveLocation}
              />
            ) : (
              <div className="mt-8 rounded-lg border border-dashed p-12 text-center bg-white">
                <Sun className="mx-auto h-12 w-12 text-yellow-500 opacity-50" />
                <h2 className="mt-4 text-xl font-medium">Search for a Location</h2>
                <p className="mt-2 text-gray-500">
                  Enter a city, state, or district to analyze its solar potential
                </p>
              </div>
            )}
          </div>
          
          <div>
            <SavedLocations 
              locations={savedLocations}
              onSelectLocation={selectSavedLocation}
              onRemoveLocation={removeLocation}
            />
            
            <div className="mt-6 space-y-4">
              <Card className="hover:shadow-md transition-shadow border-blue-100">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-lg">
                  <CardTitle className="flex items-center text-blue-700">
                    <FileBarChart className="h-5 w-5 mr-2" />
                    Detailed Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-sm text-gray-600 mb-4">
                    Get comprehensive reports on solar potential, ROI estimates, and custom comparisons.
                  </p>
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => navigate("/live-data")}
                  >
                    View Analytics
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-md transition-shadow border-green-100">
                <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 rounded-t-lg">
                  <CardTitle className="flex items-center text-green-700">
                    <Building className="h-5 w-5 mr-2" />
                    Solar Installation Guide
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-sm text-gray-600 mb-4">
                    Learn about optimal solar panel placement and sizing based on your location.
                  </p>
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => {
                      toast({
                        title: "Coming Soon",
                        description: "The installation guide will be available in a future update.",
                      });
                    }}
                  >
                    View Guide
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="hover:shadow-md transition-shadow border-t-4 border-t-yellow-400">
            <CardHeader>
              <Sun className="h-8 w-8 text-yellow-500" />
              <CardTitle className="mt-4">Solar Radiation Data</CardTitle>
              <CardDescription>
                Access historical and projected solar radiation data from NREL and NASA
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate("/live-data")}
              >
                Explore Solar Data
              </Button>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow border-t-4 border-t-blue-400">
            <CardHeader>
              <BarChart2 className="h-8 w-8 text-blue-500" />
              <CardTitle className="mt-4">Detailed Analysis</CardTitle>
              <CardDescription>
                Get comprehensive reports on solar potential and ROI estimates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate("/live-data")}
              >
                Create Analysis
              </Button>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow border-t-4 border-t-green-400">
            <CardHeader>
              <MapPin className="h-8 w-8 text-green-500" />
              <CardTitle className="mt-4">Installation Potential</CardTitle>
              <CardDescription>
                Learn about optimal solar panel placement based on your location
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  toast({
                    title: "Coming Soon",
                    description: "The installation potential guide will be available in a future update.",
                  });
                }}
              >
                View Potential
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
