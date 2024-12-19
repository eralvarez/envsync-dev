"use client";

import { Box } from "@mui/material";

import { useAuth } from "state/auth";
import { PATHS } from "constants/paths";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { hasAuth } = useAuth();

  if (hasAuth === null) {
    return null;
  }

  if (hasAuth) {
    window.location.href = PATHS.dashboardPath;
    return null;
  }

  return <Box id="authLayout">{children}</Box>;
}
