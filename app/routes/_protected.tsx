import { Outlet, Navigate, useLocation } from "react-router";

export default function ProtectedLayout() {
  const location = useLocation();

  if (true && location.pathname === "/") {
    return <Navigate to="/sign-in" />;
  }

  return (
    <div id="ProtectedLayout">
      <span>Protected layout</span>
      <Outlet />
    </div>
  );
}
