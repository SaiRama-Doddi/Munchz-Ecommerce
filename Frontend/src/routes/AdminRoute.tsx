import { Navigate, Outlet } from "react-router-dom";

const AdminRoute = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const base64Payload = token.split(".")[1];
    if (!base64Payload) {
      return <Navigate to="/login" replace />;
    }

    const payload = JSON.parse(atob(base64Payload));
    const roles: string[] = payload?.roles || [];

    if (!roles.includes("ADMIN") && !roles.includes("SUB_ADMIN")) {
      return <Navigate to="/" replace />;
    }

    return <Outlet />;
  } catch (error) {
    return <Navigate to="/login" replace />;
  }
};

export default AdminRoute;
