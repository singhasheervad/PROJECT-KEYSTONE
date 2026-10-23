import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // Not logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Role restriction
  if (
    allowedRoles &&
    (!role || !allowedRoles.includes(role.toUpperCase()))
  ) {
    // Send the user to their correct home page
    switch (role?.toUpperCase()) {
      case "MANAGER":
        return <Navigate to="/manager" replace />;

      case "DISPATCHER":
        return <Navigate to="/dashboard" replace />;

      case "TECHNICIAN":
        return <Navigate to="/technician" replace />;

      case "CUSTOMER":
        return <Navigate to="/customer-portal" replace />;

      default:
        return <Navigate to="/login" replace />;
    }
  }

  return <>{children}</>;
}