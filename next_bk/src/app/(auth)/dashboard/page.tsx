"use client";

import { Typography } from "@mui/material";
import { PageContainer } from "@toolpad/core";

import { useOrganization } from "state/organizations";

export default function DashboardMainPage() {
  const { selectedOrganization } = useOrganization();

  return (
    <PageContainer>
      <Typography>
        dashboard main page {JSON.stringify(selectedOrganization)}
      </Typography>
    </PageContainer>
  );
}
