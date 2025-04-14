
import { useMemo } from 'react';

interface TemperatureData {
  temperature: number;
  feelsLike: number;
  description: string;
}

/**
 * Custom hook to calculate realistic temperature based on radiation and location
 * Uses a more accurate algorithm based on real-world solar-temperature correlations
 */
export const useTemperatureCalculation = (
  locationLatitude: number,
  currentRadiation: number,
  month: number = new Date().getMonth()
): TemperatureData => {
  
  return useMemo(() => {
    // Get current time of day to factor in day/night temperatures
    const currentHour = new Date().getHours();
    const isDaytime = currentHour >= 6 && currentHour <= 18;
    
    // Base temperature depends on latitude (approximate climate zones)
    let baseTemp = 25; // Default

    // Northern India (colder in winter, hotter in summer)
    if (locationLatitude > 28) {
      // Winter (Nov-Feb)
      if (month >= 10 || month <= 1) {
        baseTemp = isDaytime ? 18 : 12;
      } 
      // Summer (Apr-Jul)
      else if (month >= 3 && month <= 6) {
        baseTemp = isDaytime ? 36 : 28;
      }
      // Spring/Fall
      else {
        baseTemp = isDaytime ? 28 : 22;
      }
    } 
    // Central India
    else if (locationLatitude > 20) {
      // Winter (Nov-Feb)
      if (month >= 10 || month <= 1) {
        baseTemp = isDaytime ? 24 : 18;
      } 
      // Summer (Apr-Jul)
      else if (month >= 3 && month <= 6) {
        baseTemp = isDaytime ? 38 : 30;
      }
      // Spring/Fall
      else {
        baseTemp = isDaytime ? 32 : 26;
      }
    } 
    // Southern India (more consistent)
    else {
      // Winter (Nov-Feb)
      if (month >= 10 || month <= 1) {
        baseTemp = isDaytime ? 28 : 22;
      } 
      // Summer (Apr-Jul)
      else if (month >= 3 && month <= 6) {
        baseTemp = isDaytime ? 34 : 28;
      }
      // Spring/Fall
      else {
        baseTemp = isDaytime ? 30 : 25;
      }
    }
    
    // Adjust temperature based on current radiation (more accurate calculation)
    // The relationship between radiation and temperature isn't linear
    // For zero radiation (night), temperature should be lower
    // For peak radiation (midday, clear sky), temperature should be higher
    
    // Maximum adjustment based on radiation (±8°C)
    const maxAdjustment = 8;
    
    // Calculate the radiation factor (0-1 scale)
    // Average max radiation is around 1000 W/m²
    const radiationFactor = Math.min(currentRadiation / 1000, 1);
    
    // Temperature adjustment varies based on time of day
    let radiationAdjustment = 0;
    
    if (isDaytime) {
      // During day, higher radiation = higher temperature (up to +maxAdjustment)
      radiationAdjustment = radiationFactor * maxAdjustment;
    } else {
      // At night, radiation is typically very low, so we use a small negative adjustment
      radiationAdjustment = -2; // Slight cooling at night
    }
    
    // Cloud cover effect: lower radiation during daytime means more clouds, which reduces temperature swing
    const cloudAdjustment = isDaytime && currentRadiation < 400 ? -3 : 0;
    
    // Calculate final temperature with all adjustments
    const temperature = Math.round(baseTemp + radiationAdjustment + cloudAdjustment);
    
    // Calculate feels like temperature (adding humidity factor)
    // In general, humidity makes it feel warmer in hot conditions and colder in cold conditions
    let humidityFactor = 0;
    
    // Southern and coastal areas have higher humidity
    const isCoastalOrSouthern = locationLatitude < 23;
    
    if (temperature > 30 && isCoastalOrSouthern) {
      // Hot + humid = feels hotter
      humidityFactor = 3;
    } else if (temperature > 25 && isCoastalOrSouthern) {
      // Warm + humid = feels slightly hotter
      humidityFactor = 2;
    } else if (temperature < 15 && !isCoastalOrSouthern) {
      // Cold + dry = feels colder (wind chill effect)
      humidityFactor = -1;
    }
    
    const feelsLike = Math.round(temperature + humidityFactor);
    
    // Temperature description
    let description = "Moderate";
    if (temperature > 38) description = "Extremely Hot";
    else if (temperature > 35) description = "Very Hot";
    else if (temperature > 30) description = "Hot";
    else if (temperature > 25) description = "Warm";
    else if (temperature > 20) description = "Moderate";
    else if (temperature > 15) description = "Cool";
    else if (temperature > 10) description = "Cold";
    else description = "Very Cold";
    
    return { temperature, feelsLike, description };
  }, [locationLatitude, currentRadiation, month]);
};
