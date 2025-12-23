import React from "react";
import Sidebar from "./Sidebar";
import AdminNavbar from "./AdminNavbar";
import Footer from "./Footer";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      
      {/* Main content area */}
      <div className="flex flex-1">
        
        {/* Sidebar */}
        <Sidebar />

        {/* Right content */}
        <div className="flex-1 flex flex-col">
          
          {/* Top navbar */}
          <AdminNavbar />

          {/* Page content */}
          <main className="flex-1 p-6 overflow-y-auto">
            {children}
          </main>

        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Layout;
