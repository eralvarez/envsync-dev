import { Suspense } from "react";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { PageContainer } from "@toolpad/core/PageContainer";
import Image from "next/image";

import AppProvider from "components/toolpad/AppProvider";
import theme from "constants/theme";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense>
      <AppProvider
        theme={theme}
        branding={{
          logo: (
            <Image
              src="https://placehold.co/40x40?text=EnvSync"
              width={40}
              height={40}
              alt={`${process.env.PROJECT_NAME} logo`}
            />
          ),
          title: process.env.PROJECT_NAME,
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
          {children}
        </DashboardLayout>
      </AppProvider>
    </Suspense>
  );
}
