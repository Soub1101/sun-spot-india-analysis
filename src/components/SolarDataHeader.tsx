
import React from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RefreshCw, Download } from "lucide-react";

interface SolarDataHeaderProps {
  selectedLocation: string;
  setSelectedLocation: (value: string) => void;
  refreshData: () => void;
  locations: any[];
  handleDownloadData: () => void;
}

const SolarDataHeader: React.FC<SolarDataHeaderProps> = ({
  selectedLocation,
  setSelectedLocation,
  refreshData,
  locations,
  handleDownloadData
}) => {
  // Display the current date & time more clearly
  const currentDateTime = new Date().toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Live Solar Data</h1>
          <p className="text-gray-500">
            Real-time solar radiation and weather conditions across India
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="hidden md:block text-sm">
            <span className="text-gray-500">Auto-refreshing:</span>{" "}
            <span className="font-medium">Every 20s</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={refreshData}
            className="flex items-center"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            <span>Refresh Now</span>
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-4 sm:mt-6">
        <div className="w-full sm:w-64">
          <Select value={selectedLocation} onValueChange={setSelectedLocation}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              {locations.map(location => (
                <SelectItem key={location.id} value={location.id}>
                  {location.name}, {location.state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="text-sm text-gray-500">
          Last updated: {currentDateTime}
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="sm:ml-auto flex items-center gap-2 w-full sm:w-auto"
          onClick={handleDownloadData}
        >
          <Download className="h-4 w-4" />
          Download Data
        </Button>
      </div>
    </>
  );
};

export default SolarDataHeader;
