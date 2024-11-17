"use client";

import { Suspense, useState } from "react";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { PageContainer } from "@toolpad/core/PageContainer";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import CloudQueueIcon from "@mui/icons-material/CloudQueue";
import { useQuery } from "react-query";

import PATHS from "constants/paths";
import navigation from "./navigation";
import AppProvider from "components/toolpad/AppProvider";
import theme from "constants/theme";
import QUERY_KEYS from "constants/queryKeys";
import { Navigation } from "types/toolpad";
import { getAllProjectsAction } from "actions/project";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [projectsNavigation, setProjectsNavigation] = useState<Navigation[]>(
    []
  );
  useQuery([QUERY_KEYS.getAllProjects], () => getAllProjectsAction(), {
    onSuccess({ data: projects, error }) {
      if (!Boolean(error)) {
        setProjectsNavigation(() => {
          const newProjectsNavigation: Navigation[] = [];

          projects?.forEach((project) => {
            newProjectsNavigation.push({
              segment: `${PATHS.dashboard}/project/${project.id}`,
              title: project.name,
              icon: <FolderOpenIcon />,
              children: project.project_envs.map((env) => {
                return {
                  segment: env.id,
                  title: env.name,
                  icon: <CloudQueueIcon />,
                };
              }),
            });
          });

          return newProjectsNavigation;
        });
      }
    },
  });

  return (
    <Suspense>
      <AppProvider
        theme={theme}
        navigation={[...navigation, ...projectsNavigation]}
        session={{
          user: {
            name: "Test test",
            email: "eaea@outlook.com",
            image: "https://avatars.githubusercontent.com/u/19550456",
          },
        }}
      >
        <DashboardLayout
          slotProps={{
            toolbarAccount: {
              slotProps: {
                preview: {
                  variant: "condensed",
                  slotProps: {
                    avatarIconButton: {
                      sx: {
                        padding: 0,
                      },
                    },
                  },
                },
              },
            },
          }}
        >
          <PageContainer>{children}</PageContainer>
        </DashboardLayout>
      </AppProvider>
    </Suspense>
  );
}
