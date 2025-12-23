import type { JSX } from "react";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }: { children: JSX.Element }) => {
  const roles = JSON.parse(localStorage.getItem("roles") || "[]");

  if (!roles.includes("ADMIN")) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
