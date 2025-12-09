import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface ProtectedRouteProps {
  allowedRoles?: ("customer" | "shop" | "admin")[];
  redirectTo?: string;
}

export default function ProtectedRoute({
  allowedRoles,
  redirectTo = "/login",
}: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  if (allowedRoles && user) {
    if (allowedRoles.includes("admin")) {
      if (user.access_level !== "admin" && user.role !== "admin") {
        if (user.role === "customer") {
          return <Navigate to="/customer" replace />;
        } else if (user.role === "shop") {
          return <Navigate to="/shop" replace />;
        }
        return <Navigate to="/" replace />;
      }
    } else if (!allowedRoles.includes(user.role)) {
      if (user.role === "customer") {
        return <Navigate to="/customer" replace />;
      } else if (user.role === "shop") {
        return <Navigate to="/shop" replace />;
      } else if (user.access_level === "admin") {
        return <Navigate to="/admin" replace />;
      }
      return <Navigate to="/" replace />;
    }
  }

  return <Outlet />;
}
