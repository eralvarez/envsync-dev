import { Outlet, Navigate, useLocation } from "react-router";

export default function PublicLayout() {
  // const location = useLocation();

  // if (true && location.pathname === '/') {
  //   return <Navigate to="/sign-in" />
  // }

  return (
    <div id="PublicLayout">
      <span>public layout</span>
      <Outlet />
    </div>
  );
}
