
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Sun, Cloud, CloudRain, Wind, Thermometer, BarChart3 } from "lucide-react";
import { getRadiationCategory, getWeatherDescription } from "@/utils/solarDataUtils";

interface SolarMetricsCardsProps {
  currentRadiation: number;
  temperatureData: {
    temperature: number;
    feelsLike: number;
    description: string;
  };
  locationData: any;
}

const SolarMetricsCards: React.FC<SolarMetricsCardsProps> = ({
  currentRadiation,
  temperatureData,
  locationData
}) => {
  // Ensure currentRadiation is properly calculated
  // If it's daytime (6am-6pm), show realistic value based on time of day
  // If it's nighttime, radiation should be very low
  const currentHour = new Date().getHours();
  const isDaytime = currentHour >= 6 && currentHour <= 18;
  
  // Adjust current radiation based on time of day
  let adjustedRadiation = currentRadiation;
  if (!isDaytime) {
    // Nighttime - radiation should be close to zero
    adjustedRadiation = Math.round(Math.random() * 10); // 0-10 W/m² at night
  }
  
  const radiationCategory = getRadiationCategory(adjustedRadiation);

  // Determine weather icon based on radiation level
  const WeatherIcon = adjustedRadiation > 700 ? Sun 
    : adjustedRadiation > 500 ? Cloud 
    : adjustedRadiation > 300 ? CloudRain 
    : Wind;

  return (
    <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Current GHI</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">{adjustedRadiation} W/m²</div>
              <p className={`text-sm ${radiationCategory.color}`}>
                {radiationCategory.label}
              </p>
            </div>
            <Sun className="h-9 w-9 text-yellow-400" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Weather Condition</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">{getWeatherDescription(adjustedRadiation)}</div>
              <p className="text-sm text-gray-500">
                {isDaytime ? "Daytime conditions" : "Nighttime conditions"}
              </p>
            </div>
            <WeatherIcon className="h-9 w-9 text-blue-400" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Temperature</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">
                {temperatureData.temperature}°C
              </div>
              <p className="text-sm text-gray-500">
                Feels like {temperatureData.feelsLike}°C
                <span className="ml-1">({temperatureData.description})</span>
              </p>
            </div>
            <Thermometer className="h-9 w-9 text-red-400" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="shadow-sm hover:shadow-md transition-shadow">
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
  );
};

export default SolarMetricsCards;
