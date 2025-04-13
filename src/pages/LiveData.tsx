
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Sun, CloudRain, Cloud, Wind, Thermometer } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";

// Generate mock live data that changes over time
const generateLiveData = () => {
  const currentHour = new Date().getHours();
  const data = [];
  
  // Generate data for past 12 hours
  for (let i = 0; i < 12; i++) {
    const hour = (currentHour - 11 + i) % 24;
    const timeLabel = `${hour.toString().padStart(2, '0')}:00`;
    
    // Generate semi-realistic solar radiation curve
    let baseValue = 0;
    if (hour >= 6 && hour <= 18) {
      // Daytime curve (bell shape)
      const midPoint = 12;
      const distance = Math.abs(hour - midPoint);
      baseValue = 1000 * (1 - (distance / 8) ** 2);
    }
    
    // Add some randomness
    const randomFactor = 0.8 + Math.random() * 0.4;
    
    data.push({
      time: timeLabel,
      radiation: Math.round(baseValue * randomFactor),
    });
  }
  
  return data;
};

const getRadiationCategory = (value: number) => {
  if (value > 800) return { label: "Excellent", color: "text-green-500" };
  if (value > 600) return { label: "Good", color: "text-blue-500" };
  if (value > 400) return { label: "Moderate", color: "text-yellow-500" };
  if (value > 200) return { label: "Poor", color: "text-orange-500" };
  return { label: "Very Poor", color: "text-red-500" };
};

const LiveData: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState("new-delhi");
  const [liveData, setLiveData] = useState(generateLiveData());
  const [refreshCounter, setRefreshCounter] = useState(0);
  
  // Get current radiation value (latest in the array)
  const currentRadiation = liveData[liveData.length - 1].radiation;
  const radiationCategory = getRadiationCategory(currentRadiation);
  
  // Determine which weather icon to show based on radiation value
  const WeatherIcon = currentRadiation > 700 ? Sun 
    : currentRadiation > 500 ? Cloud 
    : currentRadiation > 300 ? CloudRain 
    : Wind;
  
  // Effect to simulate live data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveData(generateLiveData());
      setRefreshCounter(prev => prev + 1);
    }, 20000); // Update every 20 seconds
    
    return () => clearInterval(interval);
  }, []);
  
  // Weather conditions based on current radiation
  const getWeatherDescription = () => {
    if (currentRadiation > 700) return "Sunny, clear skies";
    if (currentRadiation > 500) return "Partly cloudy";
    if (currentRadiation > 300) return "Mostly cloudy";
    return "Overcast conditions";
  };
  
  // Different locations with slight data variations
  const handleLocationChange = (value: string) => {
    setSelectedLocation(value);
    // Generate slightly different data based on location
    const baseData = generateLiveData();
    let factor = 1;
    
    switch(value) {
      case "mumbai":
        factor = 0.9;
        break;
      case "chennai":
        factor = 1.1;
        break;
      case "kolkata":
        factor = 0.85;
        break;
      case "jaipur":
        factor = 1.2;
        break;
      default: // new-delhi
        factor = 1;
    }
    
    const adjustedData = baseData.map(item => ({
      ...item,
      radiation: Math.round(item.radiation * factor),
    }));
    
    setLiveData(adjustedData);
  };
  
  const chartConfig = {
    radiation: {
      label: "Solar Radiation",
      color: "#FFB800",
    },
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Live Solar Data</h1>
          <p className="text-gray-500">
            Real-time solar radiation and weather conditions
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="text-sm">
            <span className="text-gray-500">Auto-refreshing:</span>{" "}
            <span className="font-medium">Every 20s</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setLiveData(generateLiveData());
              setRefreshCounter(prev => prev + 1);
            }}
          >
            Refresh Now
          </Button>
        </div>
      </div>
      
      <div className="flex space-x-4">
        <div className="w-44">
          <Select defaultValue={selectedLocation} onValueChange={handleLocationChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new-delhi">New Delhi</SelectItem>
              <SelectItem value="mumbai">Mumbai</SelectItem>
              <SelectItem value="chennai">Chennai</SelectItem>
              <SelectItem value="kolkata">Kolkata</SelectItem>
              <SelectItem value="jaipur">Jaipur</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Current Radiation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{currentRadiation} W/m²</div>
                <p className={`text-sm ${radiationCategory.color}`}>
                  {radiationCategory.label}
                </p>
              </div>
              <Sun className="h-9 w-9 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Weather Condition</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{getWeatherDescription()}</div>
                <p className="text-sm text-gray-500">Visibility: Good</p>
              </div>
              <WeatherIcon className="h-9 w-9 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Temperature</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">
                  {Math.round(25 + (currentRadiation / 1000) * 10)}°C
                </div>
                <p className="text-sm text-gray-500">Feels like {Math.round(26 + (currentRadiation / 1000) * 11)}°C</p>
              </div>
              <Thermometer className="h-9 w-9 text-red-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Wind</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{Math.round(5 + Math.random() * 8)} km/h</div>
                <p className="text-sm text-gray-500">Direction: {["NE", "E", "SE", "S", "SW"][Math.floor(Math.random() * 5)]}</p>
              </div>
              <Wind className="h-9 w-9 text-gray-400" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Solar Radiation Trend</CardTitle>
          <CardDescription>
            Last 12 hours of solar radiation data in W/m²
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ChartContainer
              config={chartConfig}
            >
              <AreaChart data={liveData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="radiation"
                  name="radiation"
                  stroke="#FFB800"
                  fill="#FFB80080"
                />
              </AreaChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
      
      <div className="rounded-lg bg-blue-50 p-4 text-blue-800">
        <div className="flex items-start space-x-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="mt-0.5 h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4" />
            <path d="M12 8h.01" />
          </svg>
          <div>
            <h3 className="font-medium">Simulation Notice</h3>
            <p className="text-sm">
              This data is simulated for demonstration purposes. In a production environment,
              this would connect to real-time solar radiation APIs from NREL and weather services.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveData;
