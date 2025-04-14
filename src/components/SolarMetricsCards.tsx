
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
  const radiationCategory = getRadiationCategory(currentRadiation);

  // Determine weather icon
  const WeatherIcon = currentRadiation > 700 ? Sun 
    : currentRadiation > 500 ? Cloud 
    : currentRadiation > 300 ? CloudRain 
    : Wind;

  return (
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
              <div className="text-2xl font-bold">{getWeatherDescription(currentRadiation)}</div>
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
  );
};

export default SolarMetricsCards;
