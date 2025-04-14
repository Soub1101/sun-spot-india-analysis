
import React, { memo } from "react";
import { AlertCircle } from "lucide-react";

const DataAttribution: React.FC = memo(() => {
  return (
    <div className="rounded-lg bg-blue-50 p-4 text-blue-800 shadow-sm">
      <div className="flex items-start space-x-3">
        <AlertCircle className="mt-0.5 h-5 w-5" />
        <div>
          <h3 className="font-medium">Data Sources</h3>
          <p className="text-sm">
            This data is sourced from NREL (National Renewable Energy Laboratory), NASA POWER, 
            Indian Meteorological Department, and Ministry of New and Renewable Energy. For complete 
            real-time data integration, solar monitoring stations would need to be accessed.
          </p>
        </div>
      </div>
    </div>
  );
});

DataAttribution.displayName = "DataAttribution";

export default DataAttribution;
