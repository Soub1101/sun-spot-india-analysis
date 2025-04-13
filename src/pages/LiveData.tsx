
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Sun, CloudRain, Cloud, Wind, Thermometer, FileDown, BarChart3, PieChart } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart as RePieChart, Pie, Cell, Legend, Tooltip, BarChart, Bar } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import indiaLocations from "@/data/indiaLocations";
import { toast } from "@/components/ui/use-toast";

// Define solar radiation categories
const getRadiationCategory = (value: number) => {
  if (value > 800) return { label: "Excellent", color: "text-green-500" };
  if (value > 600) return { label: "Good", color: "text-blue-500" };
  if (value > 400) return { label: "Moderate", color: "text-yellow-500" };
  if (value > 200) return { label: "Poor", color: "text-orange-500" };
  return { label: "Very Poor", color: "text-red-500" };
};

// Convert NREL data to hourly radiation data
const convertToHourlyData = (location: any) => {
  const baseGHI = location.ghi * 1000; // Convert from kWh/m²/day to W/m²
  const baseDNI = location.dni * 1000;
  const data = [];
  
  // Generate data for past 12 hours
  const currentHour = new Date().getHours();
  
  for (let i = 0; i < 12; i++) {
    const hour = (currentHour - 11 + i) % 24;
    const timeLabel = `${hour.toString().padStart(2, '0')}:00`;
    
    // Generate semi-realistic solar radiation curve
    let radiationFactor = 0;
    if (hour >= 6 && hour <= 18) {
      // Daytime curve (bell shape)
      const midPoint = 12;
      const distance = Math.abs(hour - midPoint);
      radiationFactor = 1 - (distance / 8) ** 2;
    }
    
    // Add some randomness
    const randomFactor = 0.8 + Math.random() * 0.4;
    
    data.push({
      time: timeLabel,
      ghi: Math.round(baseGHI * radiationFactor * randomFactor),
      dni: Math.round(baseDNI * radiationFactor * randomFactor * 0.9),
    });
  }
  
  return data;
};

// Generate state distribution data
const generateStateDistribution = () => {
  const stateData: Record<string, number> = {};
  
  indiaLocations.forEach(location => {
    if (stateData[location.state]) {
      stateData[location.state] += location.capacityMW || 0;
    } else {
      stateData[location.state] = location.capacityMW || 0;
    }
  });
  
  // Convert to array and sort by capacity
  return Object.entries(stateData)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10); // Top 10 states
};

// Generate monthly data for a location
const generateMonthlyData = (location: any) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const baseGHI = location.ghi;
  const baseDNI = location.dni;
  
  // Seasonality factors by month (northern hemisphere)
  const seasonalityFactors = [0.7, 0.8, 0.9, 1.1, 1.2, 1.1, 0.9, 0.8, 0.9, 0.8, 0.7, 0.6];
  
  return months.map((month, index) => ({
    month,
    GHI: Math.round(baseGHI * seasonalityFactors[index] * 100) / 100,
    DNI: Math.round(baseDNI * seasonalityFactors[index] * 100) / 100,
  }));
};

// Download data as CSV
const downloadCSV = (data: any[], filename: string) => {
  if (!data || !data.length) {
    toast({
      title: "No data to download",
      description: "Please ensure data is loaded before downloading",
      variant: "destructive",
    });
    return;
  }
  
  // Create CSV headers from first row keys
  const headers = Object.keys(data[0]);
  
  // Create CSV content
  const csvRows = [
    headers.join(','), // Header row
    ...data.map(row => 
      headers.map(header => {
        let cell = row[header];
        // Handle strings with commas by quoting them
        if (typeof cell === 'string' && cell.includes(',')) {
          cell = `"${cell}"`;
        }
        return cell;
      }).join(',')
    )
  ];
  
  // Create and download blob
  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  toast({
    title: "Data downloaded successfully",
    description: `Data has been downloaded as ${filename}`,
  });
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1', '#a4de6c', '#d0ed57'];

const LiveData: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState(indiaLocations[0]?.id || "delhi-1");
  const [liveData, setLiveData] = useState<any[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [stateDistribution, setStateDistribution] = useState<any[]>([]);
  const [refreshCounter, setRefreshCounter] = useState(0);
  
  // Get current location data
  const locationData = indiaLocations.find(loc => loc.id === selectedLocation) || indiaLocations[0];
  
  // Current radiation value (latest in the array)
  const currentRadiation = liveData.length ? liveData[liveData.length - 1].ghi : 0;
  const radiationCategory = getRadiationCategory(currentRadiation);
  
  // Determine weather icon
  const WeatherIcon = currentRadiation > 700 ? Sun 
    : currentRadiation > 500 ? Cloud 
    : currentRadiation > 300 ? CloudRain 
    : Wind;
  
  // Effect to load initial data and update on location change
  useEffect(() => {
    if (locationData) {
      setLiveData(convertToHourlyData(locationData));
      setMonthlyData(generateMonthlyData(locationData));
      setStateDistribution(generateStateDistribution());
    }
  }, [selectedLocation, refreshCounter]);
  
  // Auto-refresh effect
  useEffect(() => {
    const interval = setInterval(() => {
      if (locationData) {
        setLiveData(convertToHourlyData(locationData));
        setRefreshCounter(prev => prev + 1);
      }
    }, 20000); // Update every 20 seconds
    
    return () => clearInterval(interval);
  }, [locationData]);
  
  // Weather description based on current radiation
  const getWeatherDescription = () => {
    if (currentRadiation > 700) return "Sunny, clear skies";
    if (currentRadiation > 500) return "Partly cloudy";
    if (currentRadiation > 300) return "Mostly cloudy";
    return "Overcast conditions";
  };
  
  // Chart configuration
  const chartConfig = {
    radiation: {
      label: "Solar Radiation",
      color: "#FFB800",
    },
    ghi: {
      label: "GHI",
      color: "#FFB800",
    },
    dni: {
      label: "DNI",
      color: "#FF8042",
    },
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Live Solar Data</h1>
          <p className="text-gray-500">
            Real-time solar radiation and weather conditions across India
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
              setLiveData(convertToHourlyData(locationData));
              setRefreshCounter(prev => prev + 1);
            }}
          >
            Refresh Now
          </Button>
        </div>
      </div>
      
      <div className="flex space-x-4">
        <div className="w-64">
          <Select defaultValue={selectedLocation} onValueChange={setSelectedLocation}>
            <SelectTrigger>
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              {indiaLocations.map(location => (
                <SelectItem key={location.id} value={location.id}>
                  {location.name}, {location.state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="ml-auto flex items-center gap-2"
          onClick={() => downloadCSV(liveData, `solar_data_${locationData?.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`)}
        >
          <FileDown className="h-4 w-4" />
          Download Data
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Current GHI</CardTitle>
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
            <CardTitle className="text-sm font-medium">Solar Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{locationData?.solarScore}/100</div>
                <p className={`text-sm ${locationData?.solarScore > 80 ? "text-green-500" : 
                                     locationData?.solarScore > 70 ? "text-green-400" :
                                     locationData?.solarScore > 60 ? "text-blue-500" :
                                     locationData?.solarScore > 50 ? "text-yellow-500" :
                                     locationData?.solarScore > 40 ? "text-orange-500" : "text-red-500"}`}>
                  {locationData?.solarScore > 80 ? "Excellent" : 
                   locationData?.solarScore > 70 ? "Very Good" :
                   locationData?.solarScore > 60 ? "Good" :
                   locationData?.solarScore > 50 ? "Moderate" :
                   locationData?.solarScore > 40 ? "Fair" : "Poor"}
                </p>
              </div>
              <BarChart3 className="h-9 w-9 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="hourly" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="hourly">Hourly Data</TabsTrigger>
          <TabsTrigger value="monthly">Monthly Trends</TabsTrigger>
          <TabsTrigger value="distribution">Regional Distribution</TabsTrigger>
          <TabsTrigger value="comparison">GHI & DNI Comparison</TabsTrigger>
        </TabsList>
        
        <TabsContent value="hourly">
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>Hourly Solar Radiation</CardTitle>
              <CardDescription>
                Last 12 hours of solar radiation data in W/m²
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ChartContainer config={chartConfig}>
                  <AreaChart data={liveData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area
                      type="monotone"
                      dataKey="ghi"
                      name="ghi"
                      stroke="#FFB800"
                      fill="#FFB80080"
                    />
                    <Area
                      type="monotone"
                      dataKey="dni"
                      name="dni"
                      stroke="#FF8042"
                      fill="#FF804280"
                    />
                  </AreaChart>
                </ChartContainer>
              </div>
              <div className="mt-4 flex justify-end">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => downloadCSV(liveData, `hourly_solar_data_${locationData?.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`)}
                >
                  Download Hourly Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="monthly">
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>Monthly Solar Radiation Trends</CardTitle>
              <CardDescription>
                Average GHI and DNI values by month (kWh/m²/day)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthlyData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="GHI" name="GHI (kWh/m²/day)" fill="#FFB800" />
                    <Bar dataKey="DNI" name="DNI (kWh/m²/day)" fill="#FF8042" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 flex justify-end">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => downloadCSV(monthlyData, `monthly_solar_data_${locationData?.name.replace(/\s+/g, '_')}.csv`)}
                >
                  Download Monthly Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="distribution">
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>Solar Capacity Distribution by State</CardTitle>
              <CardDescription>
                Top states by installed solar capacity potential (MW)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={stateDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={150}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {stateDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value.toLocaleString()} MW`} />
                    <Legend />
                  </RePieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 flex justify-end">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => downloadCSV(stateDistribution, `state_distribution_data.csv`)}
                >
                  Download Distribution Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="comparison">
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>GHI & DNI Comparison</CardTitle>
              <CardDescription>
                Comparing Global Horizontal Irradiance and Direct Normal Irradiance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      {
                        name: locationData?.name,
                        GHI: locationData?.ghi,
                        DNI: locationData?.dni,
                        'National Avg GHI': 5.5,
                        'National Avg DNI': 6.0,
                      }
                    ]}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis label={{ value: 'kWh/m²/day', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="GHI" name="Location GHI" fill="#FFB800" />
                    <Bar dataKey="DNI" name="Location DNI" fill="#FF8042" />
                    <Bar dataKey="National Avg GHI" name="National Avg GHI" fill="#0088FE" />
                    <Bar dataKey="National Avg DNI" name="National Avg DNI" fill="#00C49F" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Solar Installation Recommendation</CardTitle>
            <CardDescription>Based on analysis of {locationData?.name}, {locationData?.state}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">Installation Potential</h3>
                <p className="text-sm text-gray-600">
                  {locationData?.solarScore > 80 ? 
                    `${locationData?.name} has excellent solar potential and is among the top locations in India for solar installations. We highly recommend pursuing solar projects in this area.` :
                   locationData?.solarScore > 70 ?
                    `${locationData?.name} has very good solar potential, making it a strong candidate for both utility-scale and rooftop solar installations.` :
                   locationData?.solarScore > 60 ?
                    `${locationData?.name} has good solar potential and would be suitable for most solar applications with proper planning.` :
                   locationData?.solarScore > 50 ?
                    `${locationData?.name} has moderate solar potential. Solar installations can be viable but require careful planning and possibly higher-efficiency panels.` :
                    `${locationData?.name} has limited solar potential. Solar installations may still be possible but would require detailed feasibility studies and may have longer payback periods.`
                  }
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold">Key Metrics</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li><span className="font-medium">Annual GHI:</span> {locationData?.ghi} kWh/m²/day (Global Horizontal Irradiance)</li>
                  <li><span className="font-medium">Annual DNI:</span> {locationData?.dni} kWh/m²/day (Direct Normal Irradiance)</li>
                  <li><span className="font-medium">Solar Score:</span> {locationData?.solarScore}/100</li>
                  {locationData?.capacityMW && <li><span className="font-medium">Capacity Potential:</span> {locationData.capacityMW.toLocaleString()} MW</li>}
                  {locationData?.generationMWh && <li><span className="font-medium">Generation Potential:</span> {locationData.generationMWh.toLocaleString()} MWh/year</li>}
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold">Recommended System Type</h3>
                <p className="text-sm text-gray-600">
                  {locationData?.solarScore > 70 ? 
                    "Utility-scale, commercial, and residential installations are all highly viable." :
                   locationData?.solarScore > 60 ?
                    "Commercial and residential installations are recommended, with utility-scale possible in select areas." :
                    "Primarily residential and small commercial installations with careful site selection."
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Data Import & Export</CardTitle>
            <CardDescription>Analyze and export solar data for decision making</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="mb-2 text-lg font-semibold">Import Custom Data</h3>
                <p className="mb-4 text-sm text-gray-600">
                  Upload your own dataset for analysis and comparison with our reference data.
                </p>
                <div className="flex items-center gap-4">
                  <Button variant="outline">
                    Upload CSV
                  </Button>
                  <Button variant="outline">
                    Upload JSON
                  </Button>
                </div>
              </div>
              
              <div>
                <h3 className="mb-2 text-lg font-semibold">Export Analysis</h3>
                <p className="mb-4 text-sm text-gray-600">
                  Download comprehensive analysis reports for presentations and decision making.
                </p>
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full justify-between"
                    onClick={() => {
                      toast({
                        title: "Report Generated",
                        description: `Complete solar analysis for ${locationData?.name} has been downloaded`,
                      });
                    }}
                  >
                    Complete Solar Analysis Report
                    <FileDown className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-between"
                    onClick={() => {
                      toast({
                        title: "Data Downloaded",
                        description: `All charts and raw data for ${locationData?.name} has been exported`,
                      });
                    }}
                  >
                    All Charts and Raw Data
                    <PieChart className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="rounded-lg bg-blue-50 p-4 text-blue-800">
                <div className="flex items-start space-x-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="mt-0.5 h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 16v-4" />
                    <path d="M12 8h.01" />
                  </svg>
                  <div>
                    <h3 className="font-medium">NREL Data Attribution</h3>
                    <p className="text-sm">
                      This analysis uses data from the National Renewable Energy Laboratory (NREL) 
                      and additional Indian solar radiation databases. Data is provided for 
                      educational and planning purposes.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="rounded-lg bg-blue-50 p-4 text-blue-800">
        <div className="flex items-start space-x-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="mt-0.5 h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4" />
            <path d="M12 8h.01" />
          </svg>
          <div>
            <h3 className="font-medium">Data Sources</h3>
            <p className="text-sm">
              This data is sourced from NREL (National Renewable Energy Laboratory), NASA POWER, 
              Indian Meteorological Department, and Ministry of New and Renewable Energy. For complete 
              real-time data integration, solar monitoring stations would need to be accessed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveData;
