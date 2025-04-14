
import React, { useState, useEffect } from "react";
import { FileDown } from "lucide-react";
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
  
  // Use our custom temperature hook for more accurate temperature calculation
  const temperatureData = useTemperatureCalculation(
    locationData?.latitude || 20, 
    currentRadiation
  );
  
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

  // Effect to load initial data and update on location change
  useEffect(() => {
    if (locationData) {
      setLiveData(convertToHourlyData(locationData));
      setMonthlyData(generateMonthlyData(locationData));
      setStateDistribution(generateStateDistribution(indiaLocations));
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

  // Handlers
  const handleRefreshData = () => {
    setLiveData(convertToHourlyData(locationData));
    setRefreshCounter(prev => prev + 1);
  };

  const handleDownloadData = () => {
    downloadCSV(
      liveData, 
      `solar_data_${locationData?.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`,
      toast
    );
  };

  const handleDataImported = (importedData: any[]) => {
    // Handle imported data if needed
    console.log("Data imported:", importedData);
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
