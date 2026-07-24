import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "../features/auth/hooks/useAuth";

interface Props {
  children: ReactNode;
  roles?: string[];
}

function PrivateRoute({ children, roles }: Props) {
  const token = localStorage.getItem("access");
  const { user, isSuperuser } = useAuth();

  if (!token) {
    return <Navigate to="/" />;
  }

  if (roles?.length && user?.role && !roles.includes(user.role) && !isSuperuser) {
    return <Navigate to="/dashboard" />;
  }

  return children;
}

export default PrivateRoute;
