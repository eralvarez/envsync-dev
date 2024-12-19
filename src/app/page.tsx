"use client";

import { Button, Stack, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

import { useAuth } from "state/auth";

export default function HomePage() {
  const { hasAuth } = useAuth();
  const router = useRouter();

  return (
    <Stack>
      <Typography>homepage {String(hasAuth)}</Typography>
      <Stack gap={1}>
        <Button variant="contained" onClick={() => router.push("/sign-in")}>
          Sign in
        </Button>
        <Button variant="contained" onClick={() => router.push("/dashboard")}>
          go to dashboard
        </Button>
      </Stack>
    </Stack>
  );
}
