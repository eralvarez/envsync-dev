"use client";

import { useMemo } from "react";
import { AppProvider } from "@toolpad/core/nextjs";
import { DashboardLayout, ThemeSwitcher } from "@toolpad/core/DashboardLayout";
import {
  Stack,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  CircularProgress,
} from "@mui/material";
import Image from "next/image";
import { useQuery } from "react-query";

import { useAuth } from "contexts/AuthContext";
import AuthService from "services/AuthService";
import navigation from "app/(auth)/dashboard/navigation";
import theme from "constants/theme";
import OrganizationService, {
  OrganizationDto,
} from "services/OrganizationService";
import QUERY_KEYS from "constants/queryKeys";
import { useOrganization } from "state/organizations";

const organizationService = new OrganizationService();

function ToolbarActionsSearch() {
  const { user } = useAuth();
  const { selectedOrganization, setSelectedOrganization } = useOrganization();

  const { data: getOrganizationsResponse, isLoading } = useQuery(
    [QUERY_KEYS.getAllOrganizations],
    () =>
      organizationService.getAll({
        whereConditions: [["members", "array-contains", user?.uid as string]],
      }),
    {
      onSuccess: ({ data }) => {
        if ((data ?? []).length > 0 && selectedOrganization === null) {
          setSelectedOrganization(data?.at(0) as OrganizationDto);
        }
      },
    }
  );

  const handleOrganizationChange = (event: SelectChangeEvent) => {
    const org = getOrganizationsResponse?.data.find(
      (currentOrg) => currentOrg.id === event.target.value
    ) as OrganizationDto;
    setSelectedOrganization(org);
  };

  return (
    <Stack direction="row" alignItems="center" gap={2}>
      {isLoading ? (
        <CircularProgress size={30} />
      ) : (
        <FormControl fullWidth variant="outlined">
          <InputLabel id="organization-label" size="small">
            Organizations
          </InputLabel>

          <Select
            labelId="organization-label"
            value={selectedOrganization?.id ?? ""}
            label="Organizations"
            onChange={handleOrganizationChange}
            size="small"
            sx={{ minWidth: 200 }}
          >
            {getOrganizationsResponse?.data?.map((organizations) => (
              <MenuItem value={organizations.id} key={organizations.id}>
                {organizations.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
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
