import { useAuth } from "../context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";
import Loading from "./Loading";
export default function RequireAuth() {
  const { user, isLoading } = useAuth();

  if (isLoading && !user) {
    return <Loading />;
  }

  if (!user && !isLoading) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
