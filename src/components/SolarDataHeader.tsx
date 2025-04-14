
import React from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  return (
    <>
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
            onClick={refreshData}
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
              {locations.map(location => (
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
          onClick={handleDownloadData}
        >
          <span className="h-4 w-4">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
          </span>
          Download Data
        </Button>
      </div>
    </>
  );
};

export default SolarDataHeader;
