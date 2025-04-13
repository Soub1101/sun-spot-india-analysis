
import React from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-gray-500">
          Welcome back, {user?.name}! Monitor your solar energy insights here.
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Solar Score</CardTitle>
            <CardDescription>Your location's solar suitability</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">86/100</div>
            <p className="text-xs text-green-500">Excellent potential</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Energy Generated</CardTitle>
            <CardDescription>This month's estimate</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">342 kWh</div>
            <p className="text-xs text-green-500">+12% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Carbon Saved</CardTitle>
            <CardDescription>Environmental impact</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">218 kg</div>
            <p className="text-xs text-green-500">of CO2 avoided</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Your latest solar analysis activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between border-b pb-2">
                <div>
                  <p className="font-medium">Location Analysis</p>
                  <p className="text-sm text-gray-500">New Delhi, India</p>
                </div>
                <div className="text-sm text-gray-500">3 days ago</div>
              </div>
              <div className="flex justify-between border-b pb-2">
                <div>
                  <p className="font-medium">Report Generated</p>
                  <p className="text-sm text-gray-500">Annual solar projection</p>
                </div>
                <div className="text-sm text-gray-500">1 week ago</div>
              </div>
              <div className="flex justify-between">
                <div>
                  <p className="font-medium">Data Export</p>
                  <p className="text-sm text-gray-500">Mumbai comparison data</p>
                </div>
                <div className="text-sm text-gray-500">2 weeks ago</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recommendations</CardTitle>
            <CardDescription>Optimize your solar setup</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 border-b pb-2">
                <div className="rounded-full bg-blue-100 p-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                    <circle cx="12" cy="12" r="10" />
                    <path d="m8 12 2 2 4-4" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium">Panel Orientation</p>
                  <p className="text-sm text-gray-500">Adjust 5° southeast for 8% improvement</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 border-b pb-2">
                <div className="rounded-full bg-yellow-100 p-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-600">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" x2="12" y1="8" y2="12" />
                    <line x1="12" x2="12.01" y1="16" y2="16" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium">Maintenance Alert</p>
                  <p className="text-sm text-gray-500">Clean panels before monsoon season</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="rounded-full bg-green-100 p-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                    <path d="M12 2v8" />
                    <path d="m4.93 10.93 1.41 1.41" />
                    <path d="M2 18h2" />
                    <path d="M20 18h2" />
                    <path d="m19.07 10.93-1.41 1.41" />
                    <path d="M22 22H2" />
                    <path d="m8 6 4-4 4 4" />
                    <path d="M16 18a4 4 0 0 0-8 0" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium">Optimal Time</p>
                  <p className="text-sm text-gray-500">Peak generation hours: 10am - 2pm</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
