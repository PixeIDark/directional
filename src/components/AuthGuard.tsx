import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.tsx";
import { PATHS } from "../router/path.ts";

function AuthGuard() {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) return <Navigate to={PATHS.HOME} replace />;
  return <Outlet />;
}

export default AuthGuard;
