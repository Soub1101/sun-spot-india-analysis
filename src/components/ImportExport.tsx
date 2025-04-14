
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileDown, FileUp, PlusCircle, Save, Clock, BarChart3, HelpCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import AnalysisResult from "./AnalysisResult";
import { downloadSampleData, downloadSampleDataJSON } from "@/data/sampleSolarData";

interface ImportExportProps {
  onDataImported?: (data: any) => void;
}

const calculateSolarScore = (ghi: number, dni: number): number => {
  const normalizedGHI = Math.min(Math.max((ghi - 4) / 2.5, 0), 1);
  const normalizedDNI = Math.min(Math.max((dni - 4.5) / 2.5, 0), 1);
  
  return Math.round((normalizedGHI * 0.6 + normalizedDNI * 0.4) * 100);
};

const generateMonthlyData = (ghi: number, dni: number) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const seasonalFactors = [0.7, 0.8, 0.9, 1.1, 1.2, 1.1, 0.9, 0.8, 0.9, 0.8, 0.7, 0.6];
  
  return months.map((month, index) => ({
    month,
    ghi: Math.round(ghi * seasonalFactors[index] * 100) / 100,
    dni: Math.round(dni * seasonalFactors[index] * 100) / 100,
  }));
};

const estimatePotential = (ghi: number, solarScore: number) => {
  const baseCapacityFactor = 0.16 + (ghi - 4) * 0.03;
  const capacityMW = Math.round(1000 * (solarScore / 100) * 1.2);
  const generationMWh = Math.round(capacityMW * 8760 * baseCapacityFactor);
  
  return { capacityMW, generationMWh };
};

const readCSVFile = (file: File): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (!event.target?.result) {
        reject(new Error("Failed to read file"));
        return;
      }
      
      const csvData = event.target.result as string;
      const lines = csvData.split('\n');
      const headers = lines[0].split(',').map(header => header.trim());
      
      const results = [];
      for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim() === '') continue;
        
        const values = lines[i].split(',');
        const entry: Record<string, any> = {};
        
        for (let j = 0; j < headers.length; j++) {
          const value = values[j]?.trim();
          if (value !== undefined) {
            entry[headers[j]] = isNaN(Number(value)) ? value : Number(value);
          }
        }
        
        results.push(entry);
      }
      
      resolve(results);
    };
    
    reader.onerror = () => {
      reject(new Error("Error reading file"));
    };
    
    reader.readAsText(file);
  });
};

const readJSONFile = (file: File): Promise<any> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (!event.target?.result) {
        reject(new Error("Failed to read file"));
        return;
      }
      
      try {
        const jsonData = JSON.parse(event.target.result as string);
        resolve(jsonData);
      } catch (error) {
        reject(new Error("Invalid JSON format"));
      }
    };
    
    reader.onerror = () => {
      reject(new Error("Error reading file"));
    };
    
    reader.readAsText(file);
  });
};

const ImportExport: React.FC<ImportExportProps> = ({ onDataImported }) => {
  const [newLocation, setNewLocation] = useState({
    name: "",
    state: "",
    district: "",
    ghi: 0,
    dni: 0,
    latitude: 0,
    longitude: 0,
  });
  
  const [importedData, setImportedData] = useState<any[]>([]);
  const [isAddingLocation, setIsAddingLocation] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [sampleDialogOpen, setSampleDialogOpen] = useState(false);
  
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
    }
  };
  
  const processFile = async () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select a file to import",
        variant: "destructive",
      });
      return;
    }
    
    try {
      let data;
      
      if (selectedFile.name.endsWith('.csv')) {
        data = await readCSVFile(selectedFile);
      } else if (selectedFile.name.endsWith('.json')) {
        data = await readJSONFile(selectedFile);
      } else {
        throw new Error("Unsupported file format. Please use CSV or JSON.");
      }
      
      if (Array.isArray(data)) {
        const processedData = data.map((item, index) => {
          const uniqueId = `imported-${Date.now()}-${index}`;
          
          if (!item.id) {
            item.id = uniqueId;
          }
          
          if (item.ghi && item.dni && !item.solarScore) {
            item.solarScore = calculateSolarScore(Number(item.ghi), Number(item.dni));
          }
          
          if (item.ghi && item.dni && !item.monthlyData) {
            item.monthlyData = generateMonthlyData(Number(item.ghi), Number(item.dni));
          }
          
          if (item.ghi && item.solarScore && (!item.capacityMW || !item.generationMWh)) {
            const { capacityMW, generationMWh } = estimatePotential(Number(item.ghi), Number(item.solarScore));
            item.capacityMW = item.capacityMW || capacityMW;
            item.generationMWh = item.generationMWh || generationMWh;
          }
          
          return {
            ...item,
            state: item.state || "Unknown",
            district: item.district || "Unknown",
            name: item.name || `Location-${uniqueId}`,
          };
        });
        
        setImportedData(processedData);
        
        toast({
          title: "Data imported successfully",
          description: `Imported ${processedData.length} locations from ${selectedFile.name}`,
        });
        
        if (onDataImported) {
          onDataImported(processedData);
        }
        
        setShowAnalysis(true);
      } else {
        const dataArray = [data];
        
        if (dataArray[0]) {
          if (!dataArray[0].id) {
            dataArray[0].id = `imported-${Date.now()}`;
          }
          
          if (dataArray[0].ghi && dataArray[0].dni && !dataArray[0].solarScore) {
            dataArray[0].solarScore = calculateSolarScore(Number(dataArray[0].ghi), Number(dataArray[0].dni));
          }
        }
        
        setImportedData(dataArray);
        
        if (onDataImported) {
          onDataImported(dataArray);
        }
        
        setShowAnalysis(true);
      }
      
      setImportDialogOpen(false);
    } catch (error) {
      console.error("Error processing file:", error);
      toast({
        title: "Error importing data",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    }
  };
  
  const handleAddLocation = () => {
    if (!newLocation.name || !newLocation.state) {
      toast({
        title: "Missing required fields",
        description: "Please provide at least location name and state",
        variant: "destructive",
      });
      return;
    }
    
    if (newLocation.ghi <= 0 || newLocation.dni <= 0) {
      toast({
        title: "Invalid radiation values",
        description: "GHI and DNI values must be greater than 0",
        variant: "destructive",
      });
      return;
    }
    
    const solarScore = calculateSolarScore(newLocation.ghi, newLocation.dni);
    const { capacityMW, generationMWh } = estimatePotential(newLocation.ghi, solarScore);
    const monthlyData = generateMonthlyData(newLocation.ghi, newLocation.dni);
    
    const locationData = {
      ...newLocation,
      id: `custom-${Date.now()}`,
      solarScore,
      capacityMW,
      generationMWh,
      monthlyData,
    };
    
    setImportedData([locationData]);
    
    toast({
      title: "Location added successfully",
      description: `${newLocation.name}, ${newLocation.state} has been added`,
    });
    
    setNewLocation({
      name: "",
      state: "",
      district: "",
      ghi: 0,
      dni: 0,
      latitude: 0,
      longitude: 0,
    });
    
    setIsAddingLocation(false);
    
    if (onDataImported) {
      onDataImported([locationData]);
    }
    
    setShowAnalysis(true);
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
          <CardDescription>Import, export, and manage your solar data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Import Data</h3>
              <p className="text-xs text-gray-500">Import location data from CSV or JSON files</p>
              <div className="flex flex-col space-y-2">
                <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <FileUp className="mr-2 h-4 w-4" />
                      Import Data
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Import Solar Data</DialogTitle>
                      <DialogDescription>
                        Upload a CSV or JSON file with location data. 
                        Required fields: name, state, ghi, dni, latitude, longitude.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="file-upload">Select File</Label>
                        <Input 
                          id="file-upload" 
                          type="file" 
                          accept=".csv,.json" 
                          onChange={handleFileSelect}
                        />
                      </div>
                      
                      <Alert>
                        <AlertTitle>Data Format</AlertTitle>
                        <AlertDescription>
                          CSV headers or JSON properties should include: name, state, district (optional), 
                          ghi, dni, latitude, longitude. Other fields will be calculated automatically.
                        </AlertDescription>
                      </Alert>
                      
                      <div className="flex justify-between items-center">
                        <Button 
                          variant="link" 
                          size="sm" 
                          onClick={() => {
                            setImportDialogOpen(false);
                            setSampleDialogOpen(true);
                          }}
                        >
                          <HelpCircle className="h-4 w-4 mr-1" />
                          Need sample data?
                        </Button>
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setImportDialogOpen(false)}>Cancel</Button>
                      <Button onClick={processFile}>Import</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Dialog open={sampleDialogOpen} onOpenChange={setSampleDialogOpen}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Sample Data</DialogTitle>
                      <DialogDescription>
                        Download sample data to see the required format for import
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4 py-4">
                      <p className="text-sm">
                        Click the buttons below to download sample data in either CSV or JSON format.
                        You can then modify this data with your own values and import it back.
                      </p>
                      
                      <div className="flex flex-col space-y-2">
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            downloadSampleData();
                            toast({
                              title: "Sample CSV Downloaded",
                              description: "A sample CSV file has been downloaded to your device",
                            });
                          }}
                        >
                          <FileDown className="mr-2 h-4 w-4" />
                          Download Sample CSV
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            downloadSampleDataJSON();
                            toast({
                              title: "Sample JSON Downloaded",
                              description: "A sample JSON file has been downloaded to your device",
                            });
                          }}
                        >
                          <FileDown className="mr-2 h-4 w-4" />
                          Download Sample JSON
                        </Button>
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button onClick={() => setSampleDialogOpen(false)}>Close</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Export Data</h3>
              <p className="text-xs text-gray-500">Export your analysis and data</p>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  if (importedData.length === 0) {
                    toast({
                      title: "No data to export",
                      description: "Import or add location data first",
                      variant: "destructive",
                    });
                    return;
                  }
                  
                  const jsonData = JSON.stringify(importedData, null, 2);
                  const blob = new Blob([jsonData], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = `solar_data_export_${new Date().toISOString().split('T')[0]}.json`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  
                  toast({
                    title: "Data exported successfully",
                    description: `${importedData.length} locations have been exported as JSON`,
                  });
                }}
              >
                <FileDown className="mr-2 h-4 w-4" />
                Export Data
              </Button>
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Custom Locations</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsAddingLocation(!isAddingLocation)}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add New Location
              </Button>
            </div>
            
            {isAddingLocation && (
              <div className="mt-4 space-y-4 rounded-md border p-4">
                <h4 className="text-sm font-medium">New Location Details</h4>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Location Name*</Label>
                    <Input 
                      id="name" 
                      value={newLocation.name}
                      onChange={(e) => setNewLocation({...newLocation, name: e.target.value})}
                      placeholder="e.g., Mysore"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="state">State*</Label>
                    <Input 
                      id="state" 
                      value={newLocation.state}
                      onChange={(e) => setNewLocation({...newLocation, state: e.target.value})}
                      placeholder="e.g., Karnataka"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="district">District (Optional)</Label>
                    <Input 
                      id="district" 
                      value={newLocation.district}
                      onChange={(e) => setNewLocation({...newLocation, district: e.target.value})}
                      placeholder="e.g., Mysore"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="ghi">GHI (kWh/m²/day)*</Label>
                    <Input 
                      id="ghi" 
                      type="number"
                      value={newLocation.ghi || ''}
                      onChange={(e) => setNewLocation({...newLocation, ghi: parseFloat(e.target.value)})}
                      placeholder="e.g., 5.6"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="dni">DNI (kWh/m²/day)*</Label>
                    <Input 
                      id="dni" 
                      type="number"
                      value={newLocation.dni || ''}
                      onChange={(e) => setNewLocation({...newLocation, dni: parseFloat(e.target.value)})}
                      placeholder="e.g., 6.1"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="latitude">Latitude*</Label>
                    <Input 
                      id="latitude" 
                      type="number"
                      value={newLocation.latitude || ''}
                      onChange={(e) => setNewLocation({...newLocation, latitude: parseFloat(e.target.value)})}
                      placeholder="e.g., 12.3"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="longitude">Longitude*</Label>
                    <Input 
                      id="longitude" 
                      type="number"
                      value={newLocation.longitude || ''}
                      onChange={(e) => setNewLocation({...newLocation, longitude: parseFloat(e.target.value)})}
                      placeholder="e.g., 76.6"
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-end space-x-2 pt-2">
                  <Button variant="outline" onClick={() => setIsAddingLocation(false)}>Cancel</Button>
                  <Button onClick={handleAddLocation}>
                    <Save className="mr-2 h-4 w-4" />
                    Add Location
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          {importedData.length > 0 && (
            <div className="flex justify-center mt-4">
              <Button 
                onClick={() => setShowAnalysis(!showAnalysis)} 
                className="w-full"
                variant={showAnalysis ? "secondary" : "default"}
              >
                <BarChart3 className="mr-2 h-4 w-4" />
                {showAnalysis ? "Hide Analysis" : "View Detailed Analysis"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      {showAnalysis && importedData.length > 0 && (
        <AnalysisResult 
          data={importedData} 
          fileName={selectedFile ? selectedFile.name : "Custom Location"} 
        />
      )}
    </div>
  );
};

export default ImportExport;
