"use client";

import { useMemo, useState } from "react";
import {
  // AppProvider,
  type Session,
  type Navigation,
} from "@toolpad/core/AppProvider";
import { AppProviderProps } from "@toolpad/core";
import { AppProvider } from "@toolpad/core/nextjs";

import { signOutAction } from "actions/auth";

export default function CustomAppProvider(props: AppProviderProps) {
  // const [session, setSession] = useState<Session | null>({
  //   user: {
  //     name: "Bharat Kashyap",
  //     email: "bharatkashyap@outlook.com",
  //     image: "https://avatars.githubusercontent.com/u/19550456",
  //   },
  // });
  const authentication = useMemo(() => {
    return {
      signIn: () => {
        // setSession({
        //   user: {
        //     name: "Bharat Kashyap",
        //     email: "bharatkashyap@outlook.com",
        //     image: "https://avatars.githubusercontent.com/u/19550456",
        //   },
        // });
      },
      signOut: async () => {
        await signOutAction();
      },
    };
  }, []);

  return <AppProvider authentication={authentication} {...props} />;
}
