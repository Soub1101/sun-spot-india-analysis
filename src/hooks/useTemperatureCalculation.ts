
import { useMemo } from 'react';

interface TemperatureData {
  temperature: number;
  feelsLike: number;
  description: string;
}

/**
 * Custom hook to calculate realistic temperature based on radiation and location
 */
export const useTemperatureCalculation = (
  locationLatitude: number,
  currentRadiation: number,
  month: number = new Date().getMonth()
): TemperatureData => {
  
  return useMemo(() => {
    // Base temperature depends on latitude (approximate climate zones)
    let baseTemp = 25; // Default

    // Northern India (colder in winter, hotter in summer)
    if (locationLatitude > 28) {
      // Winter (Nov-Feb)
      if (month >= 10 || month <= 1) {
        baseTemp = 15;
      } 
      // Summer (Apr-Jul)
      else if (month >= 3 && month <= 6) {
        baseTemp = 32;
      }
      // Spring/Fall
      else {
        baseTemp = 24;
      }
    } 
    // Central India
    else if (locationLatitude > 20) {
      // Winter (Nov-Feb)
      if (month >= 10 || month <= 1) {
        baseTemp = 20;
      } 
      // Summer (Apr-Jul)
      else if (month >= 3 && month <= 6) {
        baseTemp = 36;
      }
      // Spring/Fall
      else {
        baseTemp = 28;
      }
    } 
    // Southern India (more consistent)
    else {
      // Winter (Nov-Feb)
      if (month >= 10 || month <= 1) {
        baseTemp = 24;
      } 
      // Summer (Apr-Jul)
      else if (month >= 3 && month <= 6) {
        baseTemp = 32;
      }
      // Spring/Fall
      else {
        baseTemp = 28;
      }
    }
    
    // Adjust temperature based on current radiation
    // Max adjustment ±5°C based on radiation levels
    const radiationFactor = (currentRadiation / 1000) * 5;
    
    // Cloud cover reduces temperature during daytime
    const cloudAdjustment = currentRadiation > 400 ? 0 : -2;
    
    // Calculate final temperature
    const temperature = Math.round(baseTemp + radiationFactor + cloudAdjustment);
    
    // Calculate feels like temperature (adding humidity factor)
    // In general, humidity makes it feel warmer in hot conditions
    let humidityFactor = 0;
    if (temperature > 25) {
      // Southern and coastal areas typically have higher humidity
      if (locationLatitude < 23) {
        humidityFactor = 2;
      }
    }
    
    const feelsLike = Math.round(temperature + humidityFactor);
    
    // Temperature description
    let description = "Moderate";
    if (temperature > 35) description = "Very Hot";
    else if (temperature > 30) description = "Hot";
    else if (temperature > 25) description = "Warm";
    else if (temperature > 20) description = "Moderate";
    else if (temperature > 15) description = "Cool";
    else if (temperature > 10) description = "Cold";
    else description = "Very Cold";
    
    return { temperature, feelsLike, description };
  }, [locationLatitude, currentRadiation, month]);
};
