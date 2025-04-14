import React, { useState, useEffect, useCallback } from "react";
import { toast } from "@/components/ui/use-toast";
import { useTemperatureCalculation } from "@/hooks/useTemperatureCalculation";
import indiaLocations from "@/data/indiaLocations";

// Import utility functions
import { 
  convertToHourlyData, 
  generateStateDistribution, 
  generateMonthlyData, 
  downloadCSV 
} from "@/utils/solarDataUtils";

// Import components
import SolarDataHeader from "@/components/SolarDataHeader";
import SolarMetricsCards from "@/components/SolarMetricsCards";
import SolarChartTabs from "@/components/SolarChartTabs";
import SolarRecommendationCards from "@/components/SolarRecommendationCards";
import DataAttribution from "@/components/DataAttribution";
import ImportExport from "@/components/ImportExport";

// Optimization: Move this outside the component to prevent recreating on each render
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

const LiveData: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState(indiaLocations[0]?.id || "delhi-1");
  const [liveData, setLiveData] = useState<any[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [stateDistribution, setStateDistribution] = useState<any[]>([]);
  const [refreshCounter, setRefreshCounter] = useState(0);
  const [importedLocations, setImportedLocations] = useState<any[]>([]);
  
  // Get current location data
  const locationData = indiaLocations.find(loc => loc.id === selectedLocation) || indiaLocations[0];
  
  // Current radiation value (latest in the array)
  const currentRadiation = liveData.length ? liveData[liveData.length - 1].ghi : 0;
  
  // Use our updated temperature hook with longitude and location name
  const temperatureData = useTemperatureCalculation(
    locationData?.latitude || 20,
    locationData?.longitude || 77, // Added longitude parameter
    locationData?.name || "Delhi"  // Added location name parameter
  );
  
  // Load data handler - memoized to prevent recreation on each render
  const loadLocationData = useCallback((location: any) => {
    if (location) {
      const hourlyData = convertToHourlyData(location);
      setLiveData(hourlyData);
      setMonthlyData(generateMonthlyData(location));
      
      // For state distribution, use all locations (including imported)
      const allLocations = [...indiaLocations, ...importedLocations];
      setStateDistribution(generateStateDistribution(allLocations));
    }
  }, [importedLocations]);

  // Effect to load initial data and update on location change
  useEffect(() => {
    loadLocationData(locationData);
  }, [selectedLocation, refreshCounter, loadLocationData]);
  
  // Auto-refresh effect - with more efficient interval handling
  useEffect(() => {
    const interval = setInterval(() => {
      loadLocationData(locationData);
      setRefreshCounter(prev => prev + 1);
    }, 20000); // Update every 20 seconds
    
    return () => clearInterval(interval);
  }, [locationData, loadLocationData]);

  // Handlers
  const handleRefreshData = () => {
    loadLocationData(locationData);
    setRefreshCounter(prev => prev + 1);
    
    toast({
      title: "Data Refreshed",
      description: "The solar data has been updated with the latest values."
    });
  };

  const handleDownloadData = () => {
    downloadCSV(
      liveData, 
      `solar_data_${locationData?.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`,
      toast
    );
  };

  const handleDataImported = (importedData: any[]) => {
    if (importedData && importedData.length > 0) {
      setImportedLocations(importedData);
      
      // Update state distribution with new locations
      const allLocations = [...indiaLocations, ...importedData];
      setStateDistribution(generateStateDistribution(allLocations));
      
      toast({
        title: "Data Imported Successfully",
        description: `${importedData.length} location(s) have been imported and are ready for analysis.`
      });
    }
  };

  return (
    <div className="space-y-6">
      <SolarDataHeader 
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
        refreshData={handleRefreshData}
        locations={indiaLocations}
        handleDownloadData={handleDownloadData}
      />
      
      <SolarMetricsCards 
        currentRadiation={currentRadiation}
        temperatureData={temperatureData}
        locationData={locationData}
      />
      
      <SolarChartTabs 
        liveData={liveData}
        monthlyData={monthlyData}
        stateDistribution={stateDistribution}
        locationData={locationData}
        chartConfig={chartConfig}
      />
      
      <SolarRecommendationCards locationData={locationData} />
      
      <ImportExport onDataImported={handleDataImported} />
      
      <DataAttribution />
    </div>
  );
};

export default LiveData;
