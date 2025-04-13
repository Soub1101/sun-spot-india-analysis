
import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import ImportExport from "./ImportExport";

const Layout: React.FC = () => {
  const location = useLocation();
  const isLiveDataPage = location.pathname === "/live-data";
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Outlet />
        
        {isLiveDataPage && (
          <div className="mt-8">
            <ImportExport />
          </div>
        )}
      </main>
    </div>
  );
};

export default Layout;
