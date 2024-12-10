"use client";

import { useMemo, useState } from "react";
import { AppProviderProps } from "@toolpad/core";
import { AppProvider } from "@toolpad/core/nextjs";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import CloudQueueIcon from "@mui/icons-material/CloudQueue";

import { signOutAction } from "actions/auth";
import { Navigation } from "types/toolpad";
import { getAllProjectsAction } from "actions/project";
import PATHS from "constants/paths";
import QUERY_KEYS from "constants/queryKeys";
import { useQuery } from "react-query";
import navigation from "app/(auth)/dashboard/navigation";
import AddIcon from "@mui/icons-material/Add";
import AuthService from "services/AuthService";

const authService = new AuthService();

export default function CustomAppProvider(props: AppProviderProps) {
  const [projectsNavigation, setProjectsNavigation] = useState<Navigation[]>(
    []
  );
  // useQuery([QUERY_KEYS.getAllProjects], () => getAllProjectsAction(), {
  //   onSuccess({ data: projects, error }) {
  //     if (!Boolean(error)) {
  //       setProjectsNavigation(() => {
  //         const newProjectsNavigation: Navigation[] = [];

  //         projects?.forEach((project) => {
  //           const childrenNavigation = project.project_envs.map((env) => {
  //             return {
  //               segment: env.id,
  //               title: env.name,
  //               icon: <CloudQueueIcon />,
  //             };
  //           });
  //           childrenNavigation.push({
  //             segment: PATHS.newEnv,
  //             title: "New environment",
  //             icon: <AddIcon />,
  //           });

  //           newProjectsNavigation.push({
  //             segment: `${PATHS.dashboard}/project/${project.id}`,
  //             title: project.name,
  //             icon: <FolderOpenIcon />,
  //             children: childrenNavigation,
  //           });
  //         });

  //         return newProjectsNavigation;
  //       });
  //     }
  //   },
  // });
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
          name: "Test test",
          email: "eaea@outlook.com",
          image: "https://avatars.githubusercontent.com/u/12943375",
        },
      }}
      {...props}
    />
  );
}
