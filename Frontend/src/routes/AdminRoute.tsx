import { Navigate, Outlet } from "react-router-dom";

const AdminRoute = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const roles = payload.roles || [];

    const isAdmin = roles.includes("ADMIN");

    return isAdmin ? <Outlet /> : <Navigate to="/" replace />;
  } catch (err) {
    return <Navigate to="/login" replace />;
  }
};

export default AdminRoute;