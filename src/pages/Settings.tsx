
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Download, Save } from "lucide-react";

const Settings: React.FC = () => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    browserNotifications: false,
    alertThreshold: "medium",
    temperatureUnit: "celsius",
    energyUnit: "kwh",
    darkMode: false,
    saveHistory: true,
    allowAnalytics: true
  });

  const handleToggle = (key: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev]
    }));

    toast({
      title: "Setting Updated",
      description: `${key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')} has been ${settings[key as keyof typeof settings] ? 'disabled' : 'enabled'}.`,
    });
  };

  const handleSelectChange = (key: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));

    toast({
      title: "Setting Updated",
      description: `${key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')} has been set to ${value}.`,
    });
  };

  const handleExportData = () => {
    const dataToExport = {
      settings,
      exportDate: new Date().toISOString(),
      user: "Current User"
    };

    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `solar_app_settings_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Settings Exported",
      description: "Your settings have been exported as a JSON file.",
    });
  };

  const handleSaveSettings = () => {
    // Simulate saving settings to a server/local storage
    localStorage.setItem('solarAppSettings', JSON.stringify(settings));
    
    toast({
      title: "Settings Saved",
      description: "Your preferences have been saved successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-gray-500">
          Manage your application preferences and settings
        </p>
      </div>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Configure how you receive alerts and updates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <p className="text-sm text-gray-500">Receive solar reports via email</p>
              </div>
              <Switch 
                id="email-notifications" 
                checked={settings.emailNotifications}
                onCheckedChange={() => handleToggle('emailNotifications')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="browser-notifications">Browser Notifications</Label>
                <p className="text-sm text-gray-500">Show alerts in your browser</p>
              </div>
              <Switch 
                id="browser-notifications" 
                checked={settings.browserNotifications}
                onCheckedChange={() => handleToggle('browserNotifications')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="alert-threshold">Alert Threshold</Label>
                <p className="text-sm text-gray-500">Notify when radiation drops below</p>
              </div>
              <Select 
                value={settings.alertThreshold}
                onValueChange={(value) => handleSelectChange('alertThreshold', value)}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Select threshold" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High (700 W/m²)</SelectItem>
                  <SelectItem value="medium">Medium (500 W/m²)</SelectItem>
                  <SelectItem value="low">Low (300 W/m²)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Display Settings</CardTitle>
            <CardDescription>Customize how solar data is displayed</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="temperature-unit">Temperature Unit</Label>
              <Select 
                value={settings.temperatureUnit}
                onValueChange={(value) => handleSelectChange('temperatureUnit', value)}
              >
                <SelectTrigger id="temperature-unit">
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="celsius">Celsius (°C)</SelectItem>
                  <SelectItem value="fahrenheit">Fahrenheit (°F)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="energy-unit">Energy Unit</Label>
              <Select 
                value={settings.energyUnit}
                onValueChange={(value) => handleSelectChange('energyUnit', value)}
              >
                <SelectTrigger id="energy-unit">
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kwh">Kilowatt-hour (kWh)</SelectItem>
                  <SelectItem value="mwh">Megawatt-hour (MWh)</SelectItem>
                  <SelectItem value="joules">Joules (J)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="dark-mode">Dark Mode</Label>
                <p className="text-sm text-gray-500">Use dark theme for the application</p>
              </div>
              <Switch 
                id="dark-mode" 
                checked={settings.darkMode}
                onCheckedChange={() => handleToggle('darkMode')}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Data Settings</CardTitle>
            <CardDescription>Manage your data and privacy preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="save-history">Save Search History</Label>
                <p className="text-sm text-gray-500">Keep a record of your solar searches</p>
              </div>
              <Switch 
                id="save-history" 
                checked={settings.saveHistory}
                onCheckedChange={() => handleToggle('saveHistory')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="analytics">Allow Analytics</Label>
                <p className="text-sm text-gray-500">Help improve the platform with anonymous usage data</p>
              </div>
              <Switch 
                id="analytics" 
                checked={settings.allowAnalytics}
                onCheckedChange={() => handleToggle('allowAnalytics')}
              />
            </div>
            
            <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
              <Button 
                variant="outline"
                onClick={handleExportData}
                className="flex items-center"
              >
                <Download className="mr-2 h-4 w-4" />
                Export My Data
              </Button>
              
              <Button 
                onClick={handleSaveSettings}
                className="flex items-center"
              >
                <Save className="mr-2 h-4 w-4" />
                Save Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
