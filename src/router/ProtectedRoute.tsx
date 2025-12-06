import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.tsx";

export function ProtectedRoute() {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) return <Navigate to="/" replace />;
  return <Outlet />;
}
