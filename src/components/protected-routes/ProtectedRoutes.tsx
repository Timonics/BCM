import { Navigate, Outlet } from "react-router";

export const ProtectedRoutes = () => {
  const isAuthenticated = true;

  return isAuthenticated ? <Outlet /> : <Navigate to={"/auth"} />;
};

export const RedirectRoutes = () => {
  const isAuthenticated = true;

  return !isAuthenticated ? <Outlet /> : <Navigate to={"/"} />;
};
