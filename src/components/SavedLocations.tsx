
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MapPin, Star, Trash2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface SavedLocation {
  id: string;
  name: string;
  state: string;
  district?: string;
  solarScore: number;
}

interface SavedLocationsProps {
  locations: SavedLocation[];
  onSelectLocation: (locationId: string) => void;
  onRemoveLocation: (locationId: string) => void;
}

const SavedLocations: React.FC<SavedLocationsProps> = ({
  locations,
  onSelectLocation,
  onRemoveLocation
}) => {
  if (locations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Star className="w-5 h-5 mr-2 text-yellow-500" />
            Saved Locations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-gray-500">
            <MapPin className="w-10 h-10 mx-auto mb-2 opacity-50" />
            <p>No saved locations yet</p>
            <p className="text-sm mt-1">Search for locations and save them for quick access</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Star className="w-5 h-5 mr-2 text-yellow-500" />
          Saved Locations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-48 pr-4">
          <div className="space-y-2">
            {locations.map((location) => (
              <div 
                key={location.id} 
                className="flex items-center justify-between p-2 rounded-md hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1">
                  <button 
                    className="text-left w-full"
                    onClick={() => onSelectLocation(location.id)}
                  >
                    <div className="font-medium">{location.name}</div>
                    <div className="text-sm text-gray-500">
                      {location.state}{location.district ? `, ${location.district}` : ''}
                    </div>
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`text-sm font-medium ${
                    location.solarScore > 80 ? "text-green-500" : 
                    location.solarScore > 70 ? "text-green-400" :
                    location.solarScore > 60 ? "text-blue-500" :
                    location.solarScore > 50 ? "text-yellow-500" :
                    location.solarScore > 40 ? "text-orange-500" : "text-red-500"
                  }`}>
                    {location.solarScore}/100
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => onRemoveLocation(location.id)}
                  >
                    <Trash2 className="h-4 w-4 text-gray-500" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default SavedLocations;
