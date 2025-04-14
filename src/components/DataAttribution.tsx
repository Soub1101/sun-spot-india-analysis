
import React from "react";

const DataAttribution: React.FC = () => {
  return (
    <div className="rounded-lg bg-blue-50 p-4 text-blue-800">
      <div className="flex items-start space-x-3">
        <svg xmlns="http://www.w3.org/2000/svg" className="mt-0.5 h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4" />
          <path d="M12 8h.01" />
        </svg>
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
};

export default DataAttribution;
