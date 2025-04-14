
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart as RePieChart, Pie, Cell, Legend, Tooltip, BarChart, Bar } from "recharts";
import { downloadCSV } from "@/utils/solarDataUtils";
import { toast } from "@/components/ui/use-toast";

interface SolarChartTabsProps {
  liveData: any[];
  monthlyData: any[];
  stateDistribution: any[];
  locationData: any;
  chartConfig: {
    radiation: {
      label: string;
      color: string;
    };
    ghi: {
      label: string;
      color: string;
    };
    dni: {
      label: string;
      color: string;
    };
  };
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1', '#a4de6c', '#d0ed57'];

const SolarChartTabs: React.FC<SolarChartTabsProps> = ({
  liveData,
  monthlyData,
  stateDistribution,
  locationData,
  chartConfig
}) => {
  return (
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
                onClick={() => downloadCSV(
                  liveData, 
                  `hourly_solar_data_${locationData?.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`,
                  toast
                )}
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
                onClick={() => downloadCSV(
                  monthlyData, 
                  `monthly_solar_data_${locationData?.name.replace(/\s+/g, '_')}.csv`,
                  toast
                )}
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
                onClick={() => downloadCSV(
                  stateDistribution, 
                  `state_distribution_data.csv`,
                  toast
                )}
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
  );
};

export default SolarChartTabs;
