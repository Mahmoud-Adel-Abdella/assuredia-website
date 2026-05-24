import { Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

interface RoleBasedRouteProps {
  children: React.ReactNode;
  allowedRoles: ("admin" | "client")[];
  fallbackPath?: string;
}

export const RoleBasedRoute = ({ children, allowedRoles, fallbackPath = "/dashboard" }: RoleBasedRouteProps) => {
  const { user } = useUser();
  const token = localStorage.getItem("token");

  if (!token) return <Navigate to="/auth" />;
  if (!user) return <Navigate to="/auth" />;
  if (!allowedRoles.includes(user.role)) return <Navigate to={fallbackPath} />;

  return <>{children}</>;
};