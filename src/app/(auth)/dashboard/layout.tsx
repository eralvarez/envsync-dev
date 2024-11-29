"use client";

import { useMemo, useState } from "react";
import { AppProvider } from "@toolpad/core/nextjs";
import { DashboardLayout, ThemeSwitcher } from "@toolpad/core/DashboardLayout";
import {
  Stack,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import Image from "next/image";
import { useQuery } from "react-query";

import { useAuth } from "contexts/AuthContext";
import AuthService from "services/AuthService";
import navigation from "app/(auth)/dashboard/navigation";
import theme from "constants/theme";
import OrganizationService from "services/OrganizationService";
import QUERY_KEYS from "constants/queryKeys";

const organizationService = new OrganizationService();

function ToolbarActionsSearch() {
  const [age, setAge] = useState("");
  useQuery(
    [QUERY_KEYS.getAllOrganizations],
    () => organizationService.getAll(),
    {
      onSuccess: ({ data, error }) => {
        console.log({ data, error });
      },
      onError: (error) => {
        console.log({ error });
      },
    }
  );

  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value as string);
  };

  return (
    <Stack direction="row" gap={2}>
      <FormControl fullWidth variant="outlined">
        <InputLabel id="demo-simple-select-label" size="small">
          Organizations
        </InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={age}
          label="Organizations"
          onChange={handleChange}
          size="small"
          sx={{ minWidth: 200 }}
        >
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>
      </FormControl>
      <ThemeSwitcher />
    </Stack>
  );
}

const authService = new AuthService();

export default function Layout(props: { children: React.ReactNode }) {
  const { children } = props;
  const { user } = useAuth();

  const authentication = useMemo(() => {
    return {
      signIn: () => {},
      signOut: async () => {
        await authService.signOut();
      },
    };
  }, []);

  return (
    <AppProvider
      navigation={navigation}
      authentication={authentication}
      session={{
        user: {
          name: user?.displayName ?? "<no-name>",
          email: user?.email,
          image: `https://placehold.co/40x40?text=${user?.email?.at(0)?.toUpperCase()}`,
        },
      }}
      theme={theme}
      branding={{
        logo: (
          <Image
            src="https://placehold.co/40x40?text=EnvSync"
            width={40}
            height={40}
            alt={`${process.env.NEXT_PUBLIC_PROJECT_NAME} logo`}
            unoptimized
          />
        ),
        title: process.env.NEXT_PUBLIC_PROJECT_NAME,
      }}
    >
      <DashboardLayout
        slots={{
          toolbarActions: ToolbarActionsSearch,
          // sidebarFooter: SidebarFooter,
        }}
      >
        {children}
      </DashboardLayout>
    </AppProvider>
  );
}
