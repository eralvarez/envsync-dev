"use client";

import { useMemo, useState } from "react";
import { DashboardLayout, ThemeSwitcher } from "@toolpad/core/DashboardLayout";
import { AppProvider } from "@toolpad/core/nextjs";
import Image from "next/image";
import {
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Tooltip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

import theme from "constants/theme";
import AuthService from "services/AuthService";
import navigation from "app/(auth)/dashboard/navigation";
import { Navigation } from "types/toolpad";
import { useAuth } from "contexts/AuthContext";

const authService = new AuthService();

function Test() {
  return <h1>test!</h1>;
}

function ToolbarActionsSearch() {
  const [age, setAge] = useState("");

  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value as string);
  };

  return (
    <Stack direction="row">
      <Tooltip title="Search" enterDelay={1000}>
        <div>
          <IconButton
            type="button"
            aria-label="search"
            sx={{
              display: { xs: "inline", md: "none" },
            }}
          >
            <SearchIcon />
          </IconButton>
        </div>
      </Tooltip>
      <TextField
        label="Search"
        variant="outlined"
        size="small"
        slotProps={{
          input: {
            endAdornment: (
              <IconButton type="button" aria-label="search" size="small">
                <SearchIcon />
              </IconButton>
            ),
            sx: { pr: 0.5 },
          },
        }}
        sx={{ display: { xs: "none", md: "inline-block" }, mr: 1 }}
      />
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Age</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={age}
          label="Age"
          onChange={handleChange}
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

export default function Layout({ children }: { children: React.ReactNode }) {
  const [projectsNavigation, setProjectsNavigation] = useState<Navigation[]>(
    []
  );
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
      navigation={[...navigation, ...projectsNavigation]}
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
          />
        ),
        title: process.env.NEXT_PUBLIC_PROJECT_NAME,
      }}
    >
      <DashboardLayout
        slotProps={{
          toolbarActions: ToolbarActionsSearch,
          // toolbarActions: Test,
          // sidebarFooter: ToolbarActionsSearch,
          // toolbarAccount: {
          //   slotProps: {
          //     preview: {
          //       variant: "condensed",
          //       slotProps: {
          //         avatarIconButton: {
          //           sx: {
          //             padding: 0,
          //           },
          //         },
          //       },
          //     },
          //   },
          // },
        }}
      >
        {children}
      </DashboardLayout>
    </AppProvider>
  );
}
