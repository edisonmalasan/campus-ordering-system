import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

interface ProtectedRouteProps {
  allowedRoles?: ("customer" | "shop" | "admin")[];
  redirectTo?: string;
}

export default function ProtectedRoute({
  allowedRoles,
  redirectTo = "/login",
}: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    if (user.role === "customer") {
      return <Navigate to="/customer" replace />;
    } else if (user.role === "shop") {
      return <Navigate to="/shop" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
