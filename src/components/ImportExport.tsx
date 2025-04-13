
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileDown, FileUp, PlusCircle, Save, Clock } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ImportExportProps {
  onDataImported?: (data: any) => void;
}

// Function to calculate solar score based on GHI and DNI values
const calculateSolarScore = (ghi: number, dni: number): number => {
  // Normalized values (assuming GHI range 4-6.5 and DNI range 4.5-7)
  const normalizedGHI = Math.min(Math.max((ghi - 4) / 2.5, 0), 1);
  const normalizedDNI = Math.min(Math.max((dni - 4.5) / 2.5, 0), 1);
  
  // Score calculation (GHI has 60% weight and DNI has 40% weight)
  return Math.round((normalizedGHI * 0.6 + normalizedDNI * 0.4) * 100);
};

// Function to generate monthly data based on annual values
const generateMonthlyData = (ghi: number, dni: number) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  // Seasonal factors for northern hemisphere (increase in summer, decrease in winter)
  const seasonalFactors = [0.7, 0.8, 0.9, 1.1, 1.2, 1.1, 0.9, 0.8, 0.9, 0.8, 0.7, 0.6];
  
  return months.map((month, index) => ({
    month,
    ghi: Math.round(ghi * seasonalFactors[index] * 100) / 100,
    dni: Math.round(dni * seasonalFactors[index] * 100) / 100,
  }));
};

// Function to estimate capacity and generation potential
const estimatePotential = (ghi: number, solarScore: number) => {
  // Basic estimation based on GHI and solar score
  const baseCapacityFactor = 0.16 + (ghi - 4) * 0.03; // 16-28% capacity factor range
  const capacityMW = Math.round(1000 * (solarScore / 100) * 1.2); // Scale based on score
  const generationMWh = Math.round(capacityMW * 8760 * baseCapacityFactor); // Hours in year * capacity factor
  
  return { capacityMW, generationMWh };
};

// Helper to read CSV files
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
          entry[headers[j]] = isNaN(Number(value)) ? value : Number(value);
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

// Helper to read JSON files
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

// Local storage functions for saved locations
const saveLocation = (location: any) => {
  try {
    const savedLocations = localStorage.getItem('savedLocations');
    const locations = savedLocations ? JSON.parse(savedLocations) : [];
    
    // Check if location already exists by ID
    const existingIndex = locations.findIndex((loc: any) => loc.id === location.id);
    if (existingIndex !== -1) {
      locations[existingIndex] = location;
    } else {
      locations.push(location);
    }
    
    localStorage.setItem('savedLocations', JSON.stringify(locations));
    return true;
  } catch (error) {
    console.error("Error saving location:", error);
    return false;
  }
};

const getSavedLocations = () => {
  try {
    const savedLocations = localStorage.getItem('savedLocations');
    return savedLocations ? JSON.parse(savedLocations) : [];
  } catch (error) {
    console.error("Error retrieving saved locations:", error);
    return [];
  }
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
  const [savedLocations, setSavedLocations] = useState<any[]>(getSavedLocations());
  const [isAddingLocation, setIsAddingLocation] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
    }
  };
  
  // Process the selected file
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
        setImportedData(data);
        
        // Add ids if they don't exist
        const processedData = data.map((item, index) => {
          if (!item.id) {
            item.id = `imported-${index}`;
          }
          
          // Calculate solar score if not present
          if (item.ghi && item.dni && !item.solarScore) {
            item.solarScore = calculateSolarScore(item.ghi, item.dni);
          }
          
          // Generate monthly data if not present
          if (item.ghi && item.dni && !item.monthlyData) {
            item.monthlyData = generateMonthlyData(item.ghi, item.dni);
          }
          
          // Estimate capacity and generation if not present
          if (item.ghi && item.solarScore && (!item.capacityMW || !item.generationMWh)) {
            const { capacityMW, generationMWh } = estimatePotential(item.ghi, item.solarScore);
            item.capacityMW = item.capacityMW || capacityMW;
            item.generationMWh = item.generationMWh || generationMWh;
          }
          
          return item;
        });
        
        toast({
          title: "Data imported successfully",
          description: `Imported ${processedData.length} locations from ${selectedFile.name}`,
        });
        
        if (onDataImported) {
          onDataImported(processedData);
        }
      } else {
        const dataArray = [data];
        setImportedData(dataArray);
        
        if (onDataImported) {
          onDataImported(dataArray);
        }
      }
      
      // Close the dialog
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
  
  // Handle adding a new location
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
    
    // Create new location with calculated fields
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
    
    // Save the location
    if (saveLocation(locationData)) {
      setSavedLocations(getSavedLocations());
      
      toast({
        title: "Location added successfully",
        description: `${newLocation.name}, ${newLocation.state} has been added and saved`,
      });
      
      // Reset the form
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
      
      // Pass the data to parent component if callback exists
      if (onDataImported) {
        onDataImported([locationData]);
      }
    } else {
      toast({
        title: "Error saving location",
        description: "Failed to save location. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
          <CardDescription>Import, export, and manage your solar data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Import/Export options */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Import Data</h3>
              <p className="text-xs text-gray-500">Import location data from CSV or JSON files</p>
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
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setImportDialogOpen(false)}>Cancel</Button>
                    <Button onClick={processFile}>Import</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Export Saved Data</h3>
              <p className="text-xs text-gray-500">Export your saved locations and analysis</p>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  const locations = getSavedLocations();
                  if (locations.length === 0) {
                    toast({
                      title: "No saved locations",
                      description: "You don't have any saved locations to export",
                      variant: "destructive",
                    });
                    return;
                  }
                  
                  const jsonData = JSON.stringify(locations, null, 2);
                  const blob = new Blob([jsonData], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = `solar_locations_export_${new Date().toISOString().split('T')[0]}.json`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  
                  toast({
                    title: "Data exported successfully",
                    description: `${locations.length} locations have been exported as JSON`,
                  });
                }}
              >
                <FileDown className="mr-2 h-4 w-4" />
                Export Data
              </Button>
            </div>
          </div>
          
          {/* Add new location */}
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
                    Save Location
                  </Button>
                </div>
              </div>
            )}
            
            {/* Saved locations */}
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">
                Your Saved Locations 
                <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-600">
                  {savedLocations.length}
                </span>
              </h4>
              
              {savedLocations.length > 0 ? (
                <div className="space-y-2">
                  {savedLocations.map((location) => (
                    <div 
                      key={location.id} 
                      className="flex items-center justify-between rounded-md border p-3 hover:bg-gray-50"
                    >
                      <div>
                        <h5 className="text-sm font-medium">{location.name}, {location.state}</h5>
                        <p className="text-xs text-gray-500">
                          GHI: {location.ghi} kWh/m²/day | Score: {location.solarScore}/100
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            if (onDataImported) {
                              onDataImported([location]);
                              
                              toast({
                                title: "Location loaded",
                                description: `Loaded data for ${location.name}, ${location.state}`,
                              });
                            }
                          }}
                        >
                          <Clock className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-md border border-dashed p-6 text-center">
                  <p className="text-sm text-gray-500">
                    You don't have any saved locations yet. Add a custom location or import data.
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImportExport;
