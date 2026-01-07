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

      {/* MAIN WRAPPER */}
      <div className="flex flex-1 overflow-hidden">

        {/* SIDEBAR (FIXED WIDTH, NO SHRINK) */}
        <div className="w-72 shrink-0">
          <Sidebar />
        </div>

        {/* RIGHT CONTENT */}
        <div className="flex-1 flex flex-col min-w-0">

          {/* TOP NAVBAR */}
          <AdminNavbar />

          {/* PAGE CONTENT */}
          <main className="flex-1 p-6 overflow-y-auto overflow-x-hidden">
            {children}
          </main>

        </div>
      </div>

      {/* FOOTER */}
      <Footer />
    </div>
  );
};

export default Layout;
