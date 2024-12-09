import { Outlet } from "react-router";

export default function PublicLayout() {
  return (
    <div id="PublicLayout">
      <span>public layout</span>
      <Outlet />
    </div>
  );
}
