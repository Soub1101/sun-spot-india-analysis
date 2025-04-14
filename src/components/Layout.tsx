
import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import ImportExport from "./ImportExport";
import { Toaster } from "@/components/ui/toaster";

const Layout: React.FC = () => {
  const location = useLocation();
  const isLiveDataPage = location.pathname === "/live-data";
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster />
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Outlet />
        
        {isLiveDataPage && (
          <div className="mt-8 bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <ImportExport />
          </div>
        )}
      </main>
      <footer className="mt-20 py-8 bg-gray-100 border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <h3 className="text-lg font-semibold mb-4">About Solar Analysis</h3>
              <p className="text-gray-600 text-sm">
                Comprehensive solar radiation analysis tool for India, providing detailed insights
                for solar potential assessment and installation planning.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Data Sources</h3>
              <p className="text-gray-600 text-sm">
                Data sourced from NREL (National Renewable Energy Laboratory), NASA POWER, 
                Indian Meteorological Department, and Ministry of New and Renewable Energy.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Disclaimer</h3>
              <p className="text-gray-600 text-sm">
                Analysis is provided for educational and planning purposes only. 
                Always consult with certified solar professionals for installation advice.
              </p>
            </div>
          </div>
          <div className="mt-8 pt-4 border-t border-gray-200 text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} Solar Radiation Analysis Tool
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
