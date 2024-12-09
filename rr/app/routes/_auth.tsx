import { Outlet, useNavigate, Navigate } from "react-router";

export default function AuthLayout() {
  const navigate = useNavigate();

  if (true) {
    return <Navigate to="/" />;
  }

  return (
    <div id="AuthLayout">
      <span>auth layout</span>
      <button onClick={() => navigate("/")}>nav</button>
      <Outlet />
    </div>
  );
}
