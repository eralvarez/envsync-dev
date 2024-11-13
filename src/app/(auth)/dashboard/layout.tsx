// "use client";

// import { Suspense, useMemo, useState } from "react";
import { Suspense } from "react";
import {
  // AppProvider,
  type Session,
  type Navigation,
} from "@toolpad/core/AppProvider";
// import { AppProvider } from "@toolpad/core/nextjs";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { PageContainer } from "@toolpad/core/PageContainer";

import navigation from "./navigation";
import AppProvider from "components/toolpad/AppProvider";

// const signIn = () => {};
// const authFunctions = { signIn, signOut: () => {} };

export default function Layout({ children }: { children: React.ReactNode }) {
  // const [session, setSession] = useState<Session | null>({
  //   user: {
  //     name: "Bharat Kashyap",
  //     email: "bharatkashyap@outlook.com",
  //     image: "https://avatars.githubusercontent.com/u/19550456",
  //   },
  // });
  // const authentication = useMemo(() => {
  //   return {
  //     signIn: () => {
  //       setSession({
  //         user: {
  //           name: "Bharat Kashyap",
  //           email: "bharatkashyap@outlook.com",
  //           image: "https://avatars.githubusercontent.com/u/19550456",
  //         },
  //       });
  //     },
  //     signOut: () => {
  //       setSession(null);
  //     },
  //   };
  // }, []);

  return (
    <Suspense>
      <AppProvider
        navigation={navigation}
        session={{
          user: {
            name: "Bharat Kashyap",
            email: "bharatkashyap@outlook.com",
            image: "https://avatars.githubusercontent.com/u/19550456",
          },
        }}
        // authentication={authFunctions}
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
