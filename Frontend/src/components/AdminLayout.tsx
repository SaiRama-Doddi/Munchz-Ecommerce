import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />

      <div className="ml-72 min-h-screen flex flex-col">
        {/* CONTENT */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>

        {/* FOOTER */}
       
      </div>
    </div>
  );
}