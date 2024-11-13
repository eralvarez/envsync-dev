import { Typography, Box, Stack } from "@mui/material";
import Link from "next/link";

import PATHS from "constants/paths";

export default function Home() {
  return (
    <Stack>
      <Typography>main</Typography>
      <Link href={PATHS.dashboardPath}>go do dashboard</Link>
    </Stack>
  );
}
