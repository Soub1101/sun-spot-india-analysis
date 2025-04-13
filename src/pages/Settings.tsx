
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Settings: React.FC = () => {
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
              <Switch id="email-notifications" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="browser-notifications">Browser Notifications</Label>
                <p className="text-sm text-gray-500">Show alerts in your browser</p>
              </div>
              <Switch id="browser-notifications" />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="alert-threshold">Alert Threshold</Label>
                <p className="text-sm text-gray-500">Notify when radiation drops below</p>
              </div>
              <Select defaultValue="medium">
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
              <Select defaultValue="celsius">
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
              <Select defaultValue="kwh">
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
              <Switch id="dark-mode" />
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
              <Switch id="save-history" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="analytics">Allow Analytics</Label>
                <p className="text-sm text-gray-500">Help improve the platform with anonymous usage data</p>
              </div>
              <Switch id="analytics" defaultChecked />
            </div>
            
            <Button variant="outline">Export My Data</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
