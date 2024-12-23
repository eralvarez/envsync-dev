"use client";

import { Typography, Stack, Button } from "@mui/material";

import { useAuth } from "state/auth";
import { authService } from "services";

export default function DashboardHomePage() {
  const { hasAuth } = useAuth();

  return (
    <Stack>
      <Typography>Dashboard page {String(hasAuth)}</Typography>
      <Button onClick={() => authService.signOut()}>sign out</Button>
    </Stack>
  );
}
