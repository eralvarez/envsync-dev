import { Outlet } from "react-router";

export default function DashboardLayout() {
  return (
    <div id="DashboardLayout">
      <span>dashboard layout1</span>
      <Outlet />
    </div>
  );
}
