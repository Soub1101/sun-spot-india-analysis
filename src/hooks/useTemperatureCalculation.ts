
import { useState, useEffect } from 'react';

interface TemperatureData {
  temperature: number;
  feelsLike: number;
  description: string;
}

/**
 * Custom hook to fetch and calculate temperature data from OpenWeatherMap API
 */
export const useTemperatureCalculation = (
  locationLatitude: number,
  locationLongitude: number,
  locationName: string
): TemperatureData => {
  const [temperatureData, setTemperatureData] = useState<TemperatureData>({
    temperature: 25, // Default fallback value
    feelsLike: 25,
    description: "Loading..."
  });
  
  useEffect(() => {
    const fetchTemperatureData = async () => {
      try {
        // OpenWeatherMap API key - this is a free tier API key with limited usage
        // In a production app, this should be stored in environment variables
        const apiKey = "bd5e378503939ddaee76f12ad7a97608";
        
        // Use coordinates for more accurate results
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${locationLatitude}&lon=${locationLongitude}&units=metric&appid=${apiKey}`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error('Weather data fetch failed');
        }
        
        const data = await response.json();
        
        // Map weather description to our format
        let description = "Moderate";
        const temp = Math.round(data.main.temp);
        
        if (temp > 38) description = "Extremely Hot";
        else if (temp > 35) description = "Very Hot";
        else if (temp > 30) description = "Hot";
        else if (temp > 25) description = "Warm";
        else if (temp > 20) description = "Moderate";
        else if (temp > 15) description = "Cool";
        else if (temp > 10) description = "Cold";
        else description = "Very Cold";
        
        setTemperatureData({
          temperature: temp,
          feelsLike: Math.round(data.main.feels_like),
          description
        });
        
        console.log("Weather data fetched successfully for", locationName);
        
      } catch (error) {
        console.error("Error fetching weather data:", error);
        
        // Fallback to our algorithm in case API fails
        // This maintains backward compatibility
        const baseTemp = locationLatitude > 28 ? 24 : 
                         locationLatitude > 20 ? 28 : 32;
        
        setTemperatureData({
          temperature: baseTemp,
          feelsLike: baseTemp + (locationLatitude < 23 ? 2 : 0),
          description: baseTemp > 30 ? "Hot" : baseTemp > 25 ? "Warm" : "Moderate"
        });
      }
    };
    
    // Only fetch if we have valid coordinates
    if (locationLatitude && locationLongitude) {
      fetchTemperatureData();
    }
    
    // Refresh every 30 minutes (1800000 ms)
    const interval = setInterval(fetchTemperatureData, 1800000);
    
    return () => clearInterval(interval);
  }, [locationLatitude, locationLongitude, locationName]);
  
  return temperatureData;
};
