"use client";

import { useRouter } from "next/navigation";

import { useAuth } from "contexts/AuthContext";
import PATHS from "constants/paths";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { hasAuth } = useAuth();
  const router = useRouter();

  if (hasAuth === null) {
    return null;
  }

  if (!hasAuth) {
    setTimeout(() => {
      router.replace(PATHS.signInPath);
    });
    return null;
  } else {
    return children;
  }
}
