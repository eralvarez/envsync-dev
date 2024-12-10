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
  CircularProgress,
} from "@mui/material";
import Image from "next/image";
import { useQuery } from "react-query";
import CloudQueueIcon from "@mui/icons-material/CloudQueue";

import { useAuth } from "contexts/AuthContext";
import AuthService from "services/AuthService";
import { navigation } from "app/(auth)/dashboard/navigation";
import theme from "constants/theme";
import {
  OrganizationService,
  Organization,
} from "services/OrganizationService";
import QUERY_KEYS from "constants/queryKeys";
import { useOrganization } from "state/organizations";
import { ProjectService } from "services/ProjectService";
import { Navigation } from "types/toolpad";
import PATHS from "constants/paths";

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
        if ((data ?? []).length > 0) {
          // console.log("All orgs:");
          // console.log(data);

          if (selectedOrganization === null) {
            setSelectedOrganization(data?.at(0) as Organization);
          } else {
            // const isValidOrg =
            //   data.filter((org) => org.id === selectedOrganization!.id)
            //     .length !== 0;
            // console.log({ isValidOrg });
            // if (!isValidOrg) {
            //   setSelectedOrganization(null);
            // }
          }
        }
      },
    }
  );

  const handleOrganizationChange = (event: SelectChangeEvent) => {
    const org = getOrganizationsResponse?.data.find(
      (currentOrg) => currentOrg.id === event.target.value
    ) as Organization;
    setSelectedOrganization(org);
  };

  const getSelectorComponent = () => {
    if (getOrganizationsResponse?.data.length === 0) {
      return null;
    }

    return (
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
    );
  };

  return (
    <Stack direction="row" alignItems="center" gap={2}>
      {isLoading ? <CircularProgress size={30} /> : getSelectorComponent()}
      <ThemeSwitcher />
    </Stack>
  );
}

const authService = new AuthService();

export default function Layout(props: { children: React.ReactNode }) {
  const { children } = props;
  const { user } = useAuth();
  const { selectedOrganization } = useOrganization();
  const [projectNavigation, setProjectNavigation] = useState<Navigation[]>([]);
  const projectService = new ProjectService({
    organizationId: selectedOrganization?.id as string,
  });

  useQuery({
    queryKey: [QUERY_KEYS.getAllProjects, String(selectedOrganization?.id)],
    queryFn: () => projectService.getAll(),
    onSuccess: ({ data: projects }) => {
      const newNavigation: Navigation[] = [];

      if (projects.length) {
        projects.forEach((project) => {
          newNavigation.push({
            segment: `${PATHS.project}/`,
            title: project.name,
            icon: <CloudQueueIcon />,
          });
        });
      }

      setProjectNavigation(newNavigation);
    },
    enabled: Boolean(selectedOrganization),
  });

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
      navigation={[...navigation, ...projectNavigation]}
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
