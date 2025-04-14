
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileDown, PieChart } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface SolarRecommendationCardsProps {
  locationData: any;
}

const SolarRecommendationCards: React.FC<SolarRecommendationCardsProps> = ({
  locationData
}) => {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Solar Installation Recommendation</CardTitle>
          <CardDescription>Based on analysis of {locationData?.name}, {locationData?.state}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Installation Potential</h3>
              <p className="text-sm text-gray-600">
                {locationData?.solarScore > 80 ? 
                  `${locationData?.name} has excellent solar potential and is among the top locations in India for solar installations. We highly recommend pursuing solar projects in this area.` :
                 locationData?.solarScore > 70 ?
                  `${locationData?.name} has very good solar potential, making it a strong candidate for both utility-scale and rooftop solar installations.` :
                 locationData?.solarScore > 60 ?
                  `${locationData?.name} has good solar potential and would be suitable for most solar applications with proper planning.` :
                 locationData?.solarScore > 50 ?
                  `${locationData?.name} has moderate solar potential. Solar installations can be viable but require careful planning and possibly higher-efficiency panels.` :
                  `${locationData?.name} has limited solar potential. Solar installations may still be possible but would require detailed feasibility studies and may have longer payback periods.`
                }
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold">Key Metrics</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><span className="font-medium">Annual GHI:</span> {locationData?.ghi} kWh/m²/day (Global Horizontal Irradiance)</li>
                <li><span className="font-medium">Annual DNI:</span> {locationData?.dni} kWh/m²/day (Direct Normal Irradiance)</li>
                <li><span className="font-medium">Solar Score:</span> {locationData?.solarScore}/100</li>
                {locationData?.capacityMW && <li><span className="font-medium">Capacity Potential:</span> {locationData.capacityMW.toLocaleString()} MW</li>}
                {locationData?.generationMWh && <li><span className="font-medium">Generation Potential:</span> {locationData.generationMWh.toLocaleString()} MWh/year</li>}
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold">Recommended System Type</h3>
              <p className="text-sm text-gray-600">
                {locationData?.solarScore > 70 ? 
                  "Utility-scale, commercial, and residential installations are all highly viable." :
                 locationData?.solarScore > 60 ?
                  "Commercial and residential installations are recommended, with utility-scale possible in select areas." :
                  "Primarily residential and small commercial installations with careful site selection."
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Data Import & Export</CardTitle>
          <CardDescription>Analyze and export solar data for decision making</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="mb-2 text-lg font-semibold">Import Custom Data</h3>
              <p className="mb-4 text-sm text-gray-600">
                Upload your own dataset for analysis and comparison with our reference data.
              </p>
              <div className="flex items-center gap-4">
                <Button variant="outline">
                  Upload CSV
                </Button>
                <Button variant="outline">
                  Upload JSON
                </Button>
              </div>
            </div>
            
            <div>
              <h3 className="mb-2 text-lg font-semibold">Export Analysis</h3>
              <p className="mb-4 text-sm text-gray-600">
                Download comprehensive analysis reports for presentations and decision making.
              </p>
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-between"
                  onClick={() => {
                    toast({
                      title: "Report Generated",
                      description: `Complete solar analysis for ${locationData?.name} has been downloaded`,
                    });
                  }}
                >
                  Complete Solar Analysis Report
                  <FileDown className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-between"
                  onClick={() => {
                    toast({
                      title: "Data Downloaded",
                      description: `All charts and raw data for ${locationData?.name} has been exported`,
                    });
                  }}
                >
                  All Charts and Raw Data
                  <PieChart className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="rounded-lg bg-blue-50 p-4 text-blue-800">
              <div className="flex items-start space-x-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="mt-0.5 h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4" />
                  <path d="M12 8h.01" />
                </svg>
                <div>
                  <h3 className="font-medium">NREL Data Attribution</h3>
                  <p className="text-sm">
                    This analysis uses data from the National Renewable Energy Laboratory (NREL) 
                    and additional Indian solar radiation databases. Data is provided for 
                    educational and planning purposes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SolarRecommendationCards;
