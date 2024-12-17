import { Outlet, Navigate, useLocation } from "react-router";

export default function AuthLayout() {
  const location = useLocation();

  if (true && location.pathname === "/") {
    return <Navigate to="/sign-in" />;
  }

  return (
    <div id="AuthLayout">
      <span>Auth layout</span>
      <Outlet />
    </div>
  );
}
